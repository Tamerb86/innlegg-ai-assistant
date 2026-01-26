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
        const { getUserSubscription, getUserVoiceSamples, createPost, incrementPostsGenerated } = await import("./db");
        const { generateContent } = await import("./contentGenerator");
        
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
        
        // Generate content
        const result = await generateContent({
          rawInput: input.rawInput,
          platform: input.platform,
          tone: input.tone,
          voiceSamples: sampleTexts,
          language: input.language || "no",
        });
        
        // Save post to database
        const post = await createPost({
          userId: ctx.user.id,
          platform: input.platform,
          tone: input.tone,
          rawInput: input.rawInput,
          generatedContent: result.content,
        });
        
        // Increment posts generated count
        await incrementPostsGenerated(ctx.user.id);
        
        return post;
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
});

export type AppRouter = typeof appRouter;
