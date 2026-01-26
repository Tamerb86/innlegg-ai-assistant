import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { storagePut } from "./storage";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  user: router({
    getPreference: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPreference, createUserPreference } = await import("./db");
      let preference = await getUserPreference(ctx.user.id);
      
      // Create default preference if it doesn't exist
      if (!preference) {
        preference = await createUserPreference({
          userId: ctx.user.id,
          language: "no", // Default to Norwegian
        });
      }
      
      return preference;
    }),
    
    updateLanguage: protectedProcedure
      .input(z.object({ language: z.enum(["no", "en"]) }))
      .mutation(async ({ ctx, input }) => {
        const { updateUserPreference, getUserPreference, createUserPreference } = await import("./db");
        
        const existing = await getUserPreference(ctx.user.id);
        if (existing) {
          await updateUserPreference(ctx.user.id, input.language);
        } else {
          await createUserPreference({
            userId: ctx.user.id,
            language: input.language,
          });
        }
        
        return { success: true };
      }),
      
    updateOpenAIConsent: protectedProcedure
      .input(z.object({ consent: z.number().min(0).max(2) })) // 0 = not asked, 1 = accepted, 2 = declined
      .mutation(async ({ ctx, input }) => {
        const { updateUserOpenAIConsent, getUserPreference, createUserPreference } = await import("./db");
        
        const existing = await getUserPreference(ctx.user.id);
        if (existing) {
          await updateUserOpenAIConsent(ctx.user.id, input.consent);
        } else {
          await createUserPreference({
            userId: ctx.user.id,
            language: "no",
            openaiConsent: input.consent,
          });
        }
        
        return { success: true };
      }),
      
    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      const { getUserSubscription, createSubscription } = await import("./db");
      let subscription = await getUserSubscription(ctx.user.id);
      
      // Create default trial subscription if it doesn't exist
      if (!subscription) {
        subscription = await createSubscription({
          userId: ctx.user.id,
          status: "trial",
          postsGenerated: 0,
          trialPostsLimit: 5,
        });
      }
      
      return subscription;
    }),

    // Export user data (GDPR right to data portability)
    exportData: protectedProcedure.mutation(async ({ ctx }) => {
      const { getUserPreference } = await import("./db");
      
      // Get user data (already in ctx.user)
      const preferenceData = await getUserPreference(ctx.user.id);
      
      // TODO: Add other user-related data (posts, etc.) when those features are implemented
      
      return {
        user: ctx.user,
        preferences: preferenceData,
        exportedAt: new Date().toISOString(),
      };
    }),

    // Delete account (GDPR right to be forgotten)
    deleteAccount: protectedProcedure
      .input(z.object({ 
        confirmation: z.literal("DELETE"),
        reason: z.string().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        const { deleteUser } = await import("./db");
        const cookieOptions = getSessionCookieOptions(ctx.req);
        
        // Delete user account and all related data
        await deleteUser(ctx.user.id);
        
        // Clear session cookie
        ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
        
        // Log deletion reason if provided (for analytics)
        if (input.reason) {
          console.log(`Account deleted - User ID: ${ctx.user.id}, Reason: ${input.reason}`);
        }
        
        return {
          success: true,
          message: "Din konto og alle data har blitt permanent slettet.",
        };
      }),
  }),
  
  content: router({
    generate: protectedProcedure
      .input(z.object({
        topic: z.string().min(1),
        platform: z.enum(["linkedin", "twitter", "instagram", "facebook"]),
        tone: z.enum(["professional", "casual", "friendly", "formal", "humorous"]).optional(),
        length: z.enum(["short", "medium", "long"]).optional(),
        keywords: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getUserSubscription, incrementPostsGenerated } = await import("./db");
        const { generateContent } = await import("./openaiService");
        
        // Check subscription limits
        const subscription = await getUserSubscription(ctx.user.id);
        if (!subscription) {
          throw new Error("No subscription found");
        }
        
        // Check if user has reached limit
        if (subscription.status === "trial" && subscription.postsGenerated >= subscription.trialPostsLimit) {
          throw new Error("Trial limit reached. Please upgrade to continue.");
        }
        
        // Generate content using OpenAI
        const content = await generateContent({
          platform: input.platform,
          topic: input.topic,
          tone: input.tone,
          length: input.length,
          keywords: input.keywords,
        });
        
        // Increment posts generated count
        await incrementPostsGenerated(ctx.user.id);
        
        // Get updated subscription
        const updatedSubscription = await getUserSubscription(ctx.user.id);
        
        return { 
          content,
          postsGenerated: updatedSubscription?.postsGenerated || 0,
          postsRemaining: updatedSubscription?.status === "trial" 
            ? (updatedSubscription.trialPostsLimit - updatedSubscription.postsGenerated)
            : null,
        };
      }),
      
    improve: protectedProcedure
      .input(z.object({
        content: z.string().min(1),
        platform: z.enum(["linkedin", "twitter", "instagram", "facebook"]),
        improvementType: z.enum(["grammar", "engagement", "clarity", "tone"]),
      }))
      .mutation(async ({ input }) => {
        const { improveContent } = await import("./openaiService");
        
        const improvedContent = await improveContent(
          input.content,
          input.platform,
          input.improvementType
        );
        
        return { content: improvedContent };
      }),
      
    generateImageDallE: protectedProcedure
      .input(z.object({
        topic: z.string().min(1),
        platform: z.enum(["linkedin", "twitter", "instagram", "facebook"]),
        tone: z.enum(["professional", "casual", "friendly", "formal", "humorous"]),
        keywords: z.array(z.string()).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getUserSubscription } = await import("./db");
        const { generateOptimizedImagePrompt } = await import("./imagePromptOptimizer");
        const { generateImageWithDallE } = await import("./openaiService");
        
        // Check subscription - DALL-E 3 is Pro only
        const subscription = await getUserSubscription(ctx.user.id);
        if (!subscription || subscription.status === "trial") {
          throw new Error("DALL-E 3 image generation requires a Pro subscription. Please upgrade or use Nano Banana (free).");
        }
        
        // Generate optimized prompt
        const optimizedPrompt = generateOptimizedImagePrompt({
          topic: input.topic,
          platform: input.platform,
          tone: input.tone,
          keywords: input.keywords,
        });
        
        // Generate image with DALL-E 3
        const imageUrl = await generateImageWithDallE(optimizedPrompt.prompt);
        
        return { 
          url: imageUrl,
          prompt: optimizedPrompt.prompt,
        };
      }),
      
    generateImageNanoBanana: protectedProcedure
      .input(z.object({
        topic: z.string().min(1),
        platform: z.enum(["linkedin", "twitter", "instagram", "facebook"]),
        tone: z.enum(["professional", "casual", "friendly", "formal", "humorous"]),
        keywords: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const { generateSimplifiedPrompt } = await import("./imagePromptOptimizer");
        const { generateImage } = await import("./_core/imageGeneration");
        
        // Generate simplified prompt for Nano Banana/Gemini
        const prompt = generateSimplifiedPrompt({
          topic: input.topic,
          platform: input.platform,
          tone: input.tone,
          keywords: input.keywords,
        });
        
        // Generate image with Manus built-in image generation (Gemini)
        const result = await generateImage({ prompt });
        
        if (!result.url) {
          throw new Error("Failed to generate image");
        }
        
        return { 
          url: result.url,
          prompt,
        };
      }),
      
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPosts } = await import("./db");
      return getUserPosts(ctx.user.id);
    }),
    
    delete: protectedProcedure
      .input(z.object({ postId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getPostById, deletePost } = await import("./db");
        
        // Verify ownership
        const post = await getPostById(input.postId);
        if (!post || post.userId !== ctx.user.id) {
          throw new Error("Post not found or unauthorized");
        }
        
        await deletePost(input.postId);
        return { success: true };
      }),
      
    update: protectedProcedure
      .input(z.object({ postId: z.number(), content: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { getPostById, updatePost } = await import("./db");
        
        // Verify ownership
        const post = await getPostById(input.postId);
        if (!post || post.userId !== ctx.user.id) {
          throw new Error("Post not found or unauthorized");
        }
        
        await updatePost(input.postId, input.content);
        return { success: true };
      }),
  }),
  
  voice: router({
    addSample: protectedProcedure
      .input(z.object({ sampleText: z.string().min(50) }))
      .mutation(async ({ ctx, input }) => {
        const { createVoiceSample } = await import("./db");
        
        const sample = await createVoiceSample({
          userId: ctx.user.id,
          sampleText: input.sampleText,
        });
        
        return sample;
      }),
      
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserVoiceSamples } = await import("./db");
      return getUserVoiceSamples(ctx.user.id);
    }),
    
    delete: protectedProcedure
      .input(z.object({ sampleId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteVoiceSample } = await import("./db");
        await deleteVoiceSample(input.sampleId);
        return { success: true };
      }),
    
    getProfile: protectedProcedure.query(async ({ ctx }) => {
      const { getVoiceProfile } = await import("./db");
      return await getVoiceProfile(ctx.user.id);
    }),
    
    getSamples: protectedProcedure.query(async ({ ctx }) => {
      const { getUserVoiceSamples } = await import("./db");
      return await getUserVoiceSamples(ctx.user.id);
    }),
    
    deleteSample: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteVoiceSample } = await import("./db");
        await deleteVoiceSample(input.id);
        return { success: true };
      }),
    
    analyzeVoice: protectedProcedure.mutation(async ({ ctx }) => {
      const { getUserSubscription, getUserVoiceSamples, createOrUpdateVoiceProfile } = await import("./db");
      const { invokeLLM } = await import("./_core/llm");
      
      // Check if user has Pro subscription
      const subscription = await getUserSubscription(ctx.user.id);
      if (!subscription || subscription.status !== "active") {
        throw new Error("Stemmetrening krever Pro-abonnement");
      }
      
      // Get user's samples
      const samples = await getUserVoiceSamples(ctx.user.id);
      if (samples.length < 3) {
        throw new Error("Du trenger minst 3 tekstprøver for å analysere");
      }
      
      // Combine samples for analysis
      const combinedText = samples.map((s: { sampleText: string }) => s.sampleText).join("\n\n---\n\n");
      
      // Use LLM to analyze writing style
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are an expert writing style analyst. Analyze the following writing samples and extract the author's unique writing style characteristics. Return a JSON object with the following structure:
{
  "vocabularyLevel": "simple" | "professional" | "technical",
  "sentenceStyle": "short" | "medium" | "long" | "varied",
  "usesEmojis": boolean,
  "usesHashtags": boolean,
  "usesQuestions": boolean,
  "usesBulletPoints": boolean,
  "favoriteWords": string[] (max 10 frequently used words/phrases),
  "signaturePhrases": string[] (max 5 unique expressions),
  "toneProfile": { "formal": number, "friendly": number, "professional": number, "casual": number } (values 0-1, should sum to 1),
  "profileSummary": string (2-3 sentences describing the writing style in Norwegian)
}
Respond ONLY with valid JSON, no other text.`
          },
          {
            role: "user",
            content: `Analyze these writing samples:\n\n${combinedText}`
          }
        ],
        response_format: { type: "json_object" }
      });
      
      const analysisText = response.choices[0]?.message?.content;
      if (typeof analysisText !== 'string') {
        throw new Error("Kunne ikke analysere skrivestilen");
      }
      
      let analysis;
      try {
        analysis = JSON.parse(analysisText);
      } catch {
        throw new Error("Kunne ikke analysere skrivestilen");
      }
      
      // Save voice profile
      await createOrUpdateVoiceProfile(ctx.user.id, {
        vocabularyLevel: analysis.vocabularyLevel || "professional",
        sentenceStyle: analysis.sentenceStyle || "medium",
        usesEmojis: analysis.usesEmojis ? 1 : 0,
        usesHashtags: analysis.usesHashtags ? 1 : 0,
        usesQuestions: analysis.usesQuestions ? 1 : 0,
        usesBulletPoints: analysis.usesBulletPoints ? 1 : 0,
        favoriteWords: JSON.stringify(analysis.favoriteWords || []),
        signaturePhrases: JSON.stringify(analysis.signaturePhrases || []),
        toneProfile: JSON.stringify(analysis.toneProfile || {}),
        profileSummary: analysis.profileSummary || "",
        samplesCount: samples.length,
        trainingStatus: "trained",
        lastTrainedAt: new Date(),
      });
      
      return { success: true, profile: analysis };
    }),
  }),
  
  examples: router({
    save: protectedProcedure
      .input(z.object({
        postId: z.number(),
        title: z.string().min(1).max(200),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getPostById, createSavedExample } = await import("./db");
        
        // Get the post
        const post = await getPostById(input.postId);
        if (!post || post.userId !== ctx.user.id) {
          throw new Error("Post not found or unauthorized");
        }
        
        // Save as example
        const example = await createSavedExample({
          userId: ctx.user.id,
          postId: post.id,
          title: input.title,
          platform: post.platform,
          tone: post.tone,
          rawInput: post.rawInput,
          generatedContent: post.generatedContent,
        });
        
        return example;
      }),
      
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserSavedExamples } = await import("./db");
      return getUserSavedExamples(ctx.user.id);
    }),
    
    use: protectedProcedure
      .input(z.object({ exampleId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getSavedExampleById, incrementExampleUsage } = await import("./db");
        
        const example = await getSavedExampleById(input.exampleId);
        if (!example || example.userId !== ctx.user.id) {
          throw new Error("Example not found or unauthorized");
        }
        
        // Increment usage count
        await incrementExampleUsage(input.exampleId);
        
        return example;
      }),
      
    delete: protectedProcedure
      .input(z.object({ exampleId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getSavedExampleById, deleteSavedExample } = await import("./db");
        
        const example = await getSavedExampleById(input.exampleId);
        if (!example || example.userId !== ctx.user.id) {
          throw new Error("Example not found or unauthorized");
        }
        
        await deleteSavedExample(input.exampleId);
        return { success: true };
      }),
  }),
  
  coach: router({
    chat: protectedProcedure
      .input(z.object({ message: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const { getUserPosts, getUserContentAnalyses } = await import("./db");
        
        // Get user's posts and analyses for context
        const posts = await getUserPosts(ctx.user.id);
        const analyses = await getUserContentAnalyses(ctx.user.id);
        
        // Build context
        const avgScore = analyses.length > 0
          ? analyses.reduce((sum: number, a: any) => sum + a.overallScore, 0) / analyses.length
          : 0;
        
        const platformCounts = posts.reduce((acc: Record<string, number>, p) => {
          acc[p.platform] = (acc[p.platform] || 0) + 1;
          return acc;
        }, {});
        
        const analysesText = analyses.slice(0, 3).map((a: any) => {
          const strengths = typeof a.strengths === 'string' ? JSON.parse(a.strengths) : a.strengths;
          return `Score: ${a.overallScore}/10, Strengths: ${Array.isArray(strengths) ? strengths.join(", ") : ""}`;
        }).join(" | ");
        
        const context = `You are an expert content coach helping a user improve their social media content.

User Stats:
- Total posts: ${posts.length}
- Average content score: ${avgScore.toFixed(1)}/10
- Platforms used: ${Object.entries(platformCounts).map(([p, c]) => `${p} (${c})`).join(", ")}
- Recent analyses: ${analysesText}

Provide helpful, actionable advice. Be encouraging but honest. Keep responses concise (2-3 paragraphs max).`;
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: context },
            { role: "user", content: input.message },
          ],
        });
        
        return {
          message: response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.",
        };
      }),
  }),
  
  blog: router({
    list: publicProcedure.query(async () => {
      const { getAllBlogPosts } = await import("./db");
      return await getAllBlogPosts();
    }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const { getBlogPostBySlug } = await import("./db");
        return await getBlogPostBySlug(input.slug);
      }),
    
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        const { getBlogPostsByCategory } = await import("./db");
        return await getBlogPostsByCategory(input.category);
      }),
      
    // Admin procedures
    adminList: protectedProcedure.query(async ({ ctx }) => {
      // Check if user is admin
      if (ctx.user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
      }
      
      const { getAllBlogPostsAdmin } = await import("./db");
      return await getAllBlogPostsAdmin();
    }),
    
    create: protectedProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        excerpt: z.string().min(1),
        content: z.string().min(1),
        category: z.enum(["tips", "guides", "news", "case-studies"]),
        tags: z.string().optional(),
        authorName: z.string().min(1),
        readingTime: z.number().min(1),
        imageUrl: z.string().optional(),
        published: z.number().min(0).max(1),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        
        const { createBlogPost } = await import("./db");
        return await createBlogPost(input as any);
      }),
      
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        excerpt: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        category: z.enum(["tips", "guides", "news", "case-studies"]).optional(),
        tags: z.string().optional(),
        author: z.string().min(1).optional(),
        imageUrl: z.string().optional(),
        published: z.number().min(0).max(1).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        
        const { id, ...updates } = input;
        const { updateBlogPostAdmin } = await import("./db");
        await updateBlogPostAdmin(id, updates as any);
        return { success: true };
      }),
      
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        
        const { deleteBlogPostAdmin } = await import("./db");
        await deleteBlogPostAdmin(input.id);
        return { success: true };
      }),
      
    uploadImage: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        contentType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if user is admin
        if (ctx.user.role !== "admin") {
          throw new Error("Unauthorized: Admin access required");
        }
        
        // Generate unique file key
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(7);
        const fileKey = `blog-images/${timestamp}-${randomSuffix}-${input.fileName}`;
        
        // Convert base64 to buffer
        const base64Data = input.fileData.split(',')[1] || input.fileData;
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.contentType);
        
        return { url, fileKey };
      }),
  }),

  // Stripe Payment Router
  stripe: router({
    createCheckoutSession: protectedProcedure
      .input(z.object({
        productKey: z.enum(["PRO_MONTHLY", "PRO_YEARLY"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createCheckoutSession } = await import("./stripe/stripeService");
        
        const origin = ctx.req.headers.origin || "https://innlegg.manus.space";
        
        const result = await createCheckoutSession({
          userId: ctx.user.id,
          userEmail: ctx.user.email || "",
          userName: ctx.user.name || undefined,
          productKey: input.productKey,
          successUrl: `${origin}/subscription/success`,
          cancelUrl: `${origin}/subscription/cancel`,
        });
        
        return result;
      }),

    getPortalUrl: protectedProcedure.mutation(async ({ ctx }) => {
      const { getUserSubscription } = await import("./db");
      const { createCustomerPortalSession } = await import("./stripe/stripeService");
      
      const subscription = await getUserSubscription(ctx.user.id);
      
      if (!subscription?.stripeCustomerId) {
        throw new Error("Ingen aktiv Stripe-konto funnet");
      }
      
      const origin = ctx.req.headers.origin || "https://innlegg.manus.space";
      const url = await createCustomerPortalSession(
        subscription.stripeCustomerId,
        `${origin}/settings`
      );
      
      return { url };
    }),

    cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
      const { getUserSubscription, updateSubscriptionStatus } = await import("./db");
      const { cancelSubscription } = await import("./stripe/stripeService");
      
      const subscription = await getUserSubscription(ctx.user.id);
      
      if (!subscription?.stripeSubscriptionId) {
        throw new Error("Ingen aktiv abonnement funnet");
      }
      
      await cancelSubscription(subscription.stripeSubscriptionId);
      await updateSubscriptionStatus(ctx.user.id, "cancelled");
      
      return { success: true, message: "Abonnementet er kansellert" };
    }),
  }),
});

export type AppRouter = typeof appRouter;
