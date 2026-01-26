import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  posts, 
  Post, 
  InsertPost,
  voiceSamples,
  VoiceSample,
  InsertVoiceSample,
  subscriptions,
  Subscription,
  InsertSubscription,
  userPreferences,
  UserPreference,
  InsertUserPreference,
  contentAnalysis,
  ContentAnalysis,
  InsertContentAnalysis,
  savedExamples,
  SavedExample,
  InsertSavedExample,
  blogPosts,
  BlogPost,
  InsertBlogPost
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ Posts Queries ============

export async function createPost(post: InsertPost): Promise<Post> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(posts).values(post).$returningId();
  const [newPost] = await db.select().from(posts).where(eq(posts.id, result.id));
  return newPost!;
}

export async function getUserPosts(userId: number): Promise<Post[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt));
}

export async function getPostById(postId: number): Promise<Post | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
  return post;
}

export async function updatePost(postId: number, content: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(posts).set({ generatedContent: content, updatedAt: new Date() }).where(eq(posts.id, postId));
}

export async function deletePost(postId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(posts).where(eq(posts.id, postId));
}

// ============ Voice Samples Queries ============

export async function createVoiceSample(sample: InsertVoiceSample): Promise<VoiceSample> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(voiceSamples).values(sample).$returningId();
  const [newSample] = await db.select().from(voiceSamples).where(eq(voiceSamples.id, result.id));
  return newSample!;
}

export async function getUserVoiceSamples(userId: number): Promise<VoiceSample[]> {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(voiceSamples).where(eq(voiceSamples.userId, userId));
}

export async function deleteVoiceSample(sampleId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(voiceSamples).where(eq(voiceSamples.id, sampleId));
}

// ============ Subscriptions Queries ============

export async function getUserSubscription(userId: number): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1);
  return subscription;
}

export async function createSubscription(subscription: InsertSubscription): Promise<Subscription> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(subscriptions).values(subscription).$returningId();
  const [newSubscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, result.id));
  return newSubscription!;
}

export async function updateSubscription(userId: number, updates: Partial<Subscription>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(subscriptions).set({ ...updates, updatedAt: new Date() }).where(eq(subscriptions.userId, userId));
}

export async function incrementPostsGenerated(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const subscription = await getUserSubscription(userId);
  if (subscription) {
    await db.update(subscriptions)
      .set({ postsGenerated: subscription.postsGenerated + 1, updatedAt: new Date() })
      .where(eq(subscriptions.userId, userId));
  }
}

// ============ User Preferences Queries ============

export async function getUserPreference(userId: number): Promise<UserPreference | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const [preference] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId)).limit(1);
  return preference;
}

export async function createUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(userPreferences).values(preference).$returningId();
  const [newPreference] = await db.select().from(userPreferences).where(eq(userPreferences.id, result.id));
  return newPreference!;
}

export async function updateUserPreference(userId: number, language: "no" | "en"): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(userPreferences).set({ language, updatedAt: new Date() }).where(eq(userPreferences.userId, userId));
}

export async function updateUserOpenAIConsent(userId: number, consent: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(userPreferences).set({ 
    openaiConsent: consent, 
    consentDate: new Date(),
    updatedAt: new Date() 
  }).where(eq(userPreferences.userId, userId));
}

// ============ Content Analysis Queries ============

export async function saveContentAnalysis(analysis: InsertContentAnalysis): Promise<ContentAnalysis> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(contentAnalysis).values(analysis).$returningId();
  const [newAnalysis] = await db.select().from(contentAnalysis).where(eq(contentAnalysis.id, result.id));
  return newAnalysis!;
}

export async function getContentAnalysisByPostId(postId: number): Promise<ContentAnalysis | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const [analysis] = await db.select().from(contentAnalysis).where(eq(contentAnalysis.postId, postId)).limit(1);
  return analysis;
}

export async function getUserAnalysisHistory(userId: number, limit: number = 30): Promise<ContentAnalysis[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(contentAnalysis)
    .where(eq(contentAnalysis.userId, userId))
    .orderBy(desc(contentAnalysis.createdAt))
    .limit(limit);
}

export async function getUserContentAnalyses(userId: number): Promise<ContentAnalysis[]> {
  return getUserAnalysisHistory(userId, 50);
}

// ============ Saved Examples Queries ============

export async function createSavedExample(example: InsertSavedExample): Promise<SavedExample> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(savedExamples).values(example).$returningId();
  const [newExample] = await db.select().from(savedExamples).where(eq(savedExamples.id, result.id));
  return newExample!;
}

export async function getUserSavedExamples(userId: number): Promise<SavedExample[]> {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(savedExamples)
    .where(eq(savedExamples.userId, userId))
    .orderBy(desc(savedExamples.createdAt));
}

export async function getSavedExampleById(exampleId: number): Promise<SavedExample | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const [example] = await db.select().from(savedExamples).where(eq(savedExamples.id, exampleId)).limit(1);
  return example;
}

export async function incrementExampleUsage(exampleId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const example = await getSavedExampleById(exampleId);
  if (example) {
    await db.update(savedExamples)
      .set({ usageCount: example.usageCount + 1, updatedAt: new Date() })
      .where(eq(savedExamples.id, exampleId));
  }
}

export async function deleteSavedExample(exampleId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(savedExamples).where(eq(savedExamples.id, exampleId));
}

// ============================
// Blog Post Helpers
// ============================

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, 1))
      .orderBy(desc(blogPosts.createdAt));
  } catch (error) {
    console.error("[Database] Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const results = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug))
      .limit(1);
    
    // Increment view count
    if (results[0]) {
      await db
        .update(blogPosts)
        .set({ viewCount: results[0].viewCount + 1 })
        .where(eq(blogPosts.id, results[0].id));
    }
    
    return results[0] || null;
  } catch (error) {
    console.error("[Database] Error fetching blog post by slug:", error);
    return null;
  }
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];
  
  try {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.category, category as any))
      .orderBy(desc(blogPosts.createdAt));
  } catch (error) {
    console.error("[Database] Error fetching blog posts by category:", error);
    return [];
  }
}

export async function createBlogPost(post: InsertBlogPost): Promise<BlogPost | null> {
  const db = await getDb();
  if (!db) return null;
  
  try {
    const result = await db.insert(blogPosts).values(post);
    const insertedId = result[0].insertId;
    
    const inserted = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, insertedId))
      .limit(1);
    
    return inserted[0] || null;
  } catch (error) {
    console.error("[Database] Error creating blog post:", error);
    return null;
  }
}

// Delete user and all related data (GDPR right to be forgotten)
export async function deleteUser(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete all user-related data
  await db.delete(userPreferences).where(eq(userPreferences.userId, userId));
  await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
  await db.delete(contentAnalysis).where(eq(contentAnalysis.userId, userId));
  await db.delete(savedExamples).where(eq(savedExamples.userId, userId));
  await db.delete(voiceSamples).where(eq(voiceSamples.userId, userId));
  await db.delete(posts).where(eq(posts.userId, userId));
  
  // Finally, delete the user account
  await db.delete(users).where(eq(users.id, userId));
}

// ============================================
// Blog Management Functions (Admin)
// ============================================

export async function updateBlogPostAdmin(id: number, updates: Partial<Omit<BlogPost, "id" | "createdAt">>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(blogPosts)
    .set({
      ...updates,
      updatedAt: new Date(),
    })
    .where(eq(blogPosts.id, id));
}

export async function deleteBlogPostAdmin(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}
