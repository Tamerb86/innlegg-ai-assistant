import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Posts table - stores generated social media content
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  platform: mysqlEnum("platform", ["linkedin", "twitter", "instagram", "facebook"]).notNull(),
  tone: varchar("tone", { length: 50 }).notNull(), // professional, friendly, motivational, educational
  rawInput: text("raw_input").notNull(),
  generatedContent: text("generated_content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

/**
 * Voice samples table - stores user's writing examples for tone training
 */
export const voiceSamples = mysqlTable("voice_samples", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  sampleText: text("sample_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type VoiceSample = typeof voiceSamples.$inferSelect;
export type InsertVoiceSample = typeof voiceSamples.$inferInsert;

/**
 * Subscriptions table - tracks user subscription status
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  status: mysqlEnum("status", ["trial", "active", "cancelled", "expired"]).default("trial").notNull(),
  postsGenerated: int("posts_generated").default(0).notNull(),
  trialPostsLimit: int("trial_posts_limit").default(5).notNull(),
  vippsOrderId: varchar("vipps_order_id", { length: 255 }),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * User preferences table - stores language and other settings
 */
export const userPreferences = mysqlTable("user_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  language: mysqlEnum("language", ["no", "en"]).default("no").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

/**
 * Content Analysis table - AI Content Coach feature
 * Stores analysis and scoring for each generated post
 */
export const contentAnalysis = mysqlTable("content_analysis", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("post_id").notNull(),
  userId: int("user_id").notNull(),
  
  // Analysis metrics
  wordCount: int("word_count").notNull(),
  sentenceCount: int("sentence_count").notNull(),
  questionCount: int("question_count").notNull(),
  emojiCount: int("emoji_count").notNull(),
  hashtagCount: int("hashtag_count").notNull(),
  hasNumbers: int("has_numbers").notNull().default(0), // boolean as int
  hasCallToAction: int("has_call_to_action").notNull().default(0),
  
  // Scores (0-100 for precision)
  lengthScore: int("length_score").notNull(),
  engagementScore: int("engagement_score").notNull(),
  readabilityScore: int("readability_score").notNull(),
  overallScore: int("overall_score").notNull(),
  
  // Feedback (JSON strings)
  strengths: text("strengths"), // JSON array of strength points
  improvements: text("improvements"), // JSON array of improvement suggestions
  tips: text("tips"), // JSON array of tips
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ContentAnalysis = typeof contentAnalysis.$inferSelect;
export type InsertContentAnalysis = typeof contentAnalysis.$inferInsert;

/**
 * Saved Examples table - User's favorite posts saved as templates
 * Allows users to reuse successful content patterns
 */
export const savedExamples = mysqlTable("saved_examples", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  postId: int("post_id").notNull(), // Reference to original post
  
  title: varchar("title", { length: 200 }).notNull(),
  platform: mysqlEnum("platform", ["linkedin", "twitter", "instagram", "facebook"]).notNull(),
  tone: varchar("tone", { length: 50 }).notNull(),
  rawInput: text("raw_input").notNull(),
  generatedContent: text("generated_content").notNull(),
  
  usageCount: int("usage_count").notNull().default(0),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type SavedExample = typeof savedExamples.$inferSelect;
export type InsertSavedExample = typeof savedExamples.$inferInsert;