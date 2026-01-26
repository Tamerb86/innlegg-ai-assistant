import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

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
  }),
  
  content: router({
    generate: protectedProcedure
      .input(z.object({
        rawInput: z.string().min(1),
        platform: z.enum(["linkedin", "twitter", "instagram", "facebook"]),
        tone: z.enum(["professional", "friendly", "motivational", "educational"]),
        language: z.enum(["no", "en"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getUserSubscription, getUserVoiceSamples, createPost, incrementPostsGenerated, saveContentAnalysis, getUserPreference } = await import("./db");
        const { generateContent } = await import("./contentGenerator");
        const { analyzeContent } = await import("./contentAnalyzer");
        
        // Check subscription limits
        const subscription = await getUserSubscription(ctx.user.id);
        if (!subscription) {
          throw new Error("No subscription found");
        }
        
        // Check if user has reached limit
        if (subscription.status === "trial" && subscription.postsGenerated >= subscription.trialPostsLimit) {
          throw new Error("Trial limit reached. Please upgrade to continue.");
        }
        
        // Get user's voice samples for personalization
        const voiceSamples = await getUserVoiceSamples(ctx.user.id);
        const sampleTexts = voiceSamples.map(s => s.sampleText);
        
        // Get user language preference
        const preference = await getUserPreference(ctx.user.id);
        const userLanguage = preference?.language || "no";
        
        // Generate content
        const result = await generateContent({
          rawInput: input.rawInput,
          platform: input.platform,
          tone: input.tone,
          voiceSamples: sampleTexts,
          language: input.language || userLanguage,
        });
        
        // Save post to database
        const post = await createPost({
          userId: ctx.user.id,
          platform: input.platform,
          tone: input.tone,
          rawInput: input.rawInput,
          generatedContent: result.content,
        });
        
        // Analyze content with AI Content Coach
        const analysis = analyzeContent(result.content, input.platform, userLanguage);
        
        // Save analysis to database
        await saveContentAnalysis({
          postId: post.id,
          userId: ctx.user.id,
          wordCount: analysis.wordCount,
          sentenceCount: analysis.sentenceCount,
          questionCount: analysis.questionCount,
          emojiCount: analysis.emojiCount,
          hashtagCount: analysis.hashtagCount,
          hasNumbers: analysis.hasNumbers ? 1 : 0,
          hasCallToAction: analysis.hasCallToAction ? 1 : 0,
          lengthScore: analysis.lengthScore,
          engagementScore: analysis.engagementScore,
          readabilityScore: analysis.readabilityScore,
          overallScore: analysis.overallScore,
          strengths: JSON.stringify(analysis.strengths),
          improvements: JSON.stringify(analysis.improvements),
          tips: JSON.stringify(analysis.tips),
        });
        
        // Increment posts generated count
        await incrementPostsGenerated(ctx.user.id);
        
        return { post, analysis };
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
});

export type AppRouter = typeof appRouter;
