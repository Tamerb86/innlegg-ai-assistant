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
  InsertUserPreference
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
