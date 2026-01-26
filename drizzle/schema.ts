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
  openaiConsent: int("openai_consent").default(0).notNull(), // boolean as int: 0 = not asked, 1 = accepted, 2 = declined
  consentDate: timestamp("consent_date"),
  usagePreferences: text("usage_preferences"), // User's custom description of how they want to use the platform
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
/**
 * Blog Posts table - stores blog articles for content marketing and SEO
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: varchar("cover_image", { length: 500 }),
  category: mysqlEnum("category", ["tips", "guides", "news", "case-studies"]).notNull(),
  tags: text("tags"), // JSON array of tags
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorRole: varchar("author_role", { length: 100 }),
  readingTime: int("reading_time").notNull(), // in minutes
  published: int("published").notNull().default(1), // boolean as int
  viewCount: int("view_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Invoices table - stores billing history and payment records
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  amount: int("amount").notNull(), // Amount in øre (NOK cents) - 19900 = 199.00 NOK
  currency: varchar("currency", { length: 3 }).notNull().default("NOK"),
  status: mysqlEnum("status", ["pending", "paid", "failed", "refunded"]).notNull().default("pending"),
  description: text("description"),
  vippsOrderId: varchar("vipps_order_id", { length: 255 }),
  invoiceDate: timestamp("invoice_date").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;


/**
 * User Interests table - stores user's industry and content interests
 * Used to personalize trending topics suggestions
 */
export const userInterests = mysqlTable("user_interests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  industry: varchar("industry", { length: 100 }), // e.g., "tech", "marketing", "finance"
  topics: text("topics"), // JSON array of interested topics
  platforms: text("platforms"), // JSON array of preferred platforms
  contentTypes: text("content_types"), // JSON array: "tips", "news", "thought-leadership", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserInterest = typeof userInterests.$inferSelect;
export type InsertUserInterest = typeof userInterests.$inferInsert;

/**
 * Trending Topics table - stores curated trending topics
 * Populated by admin or automated aggregation
 */
export const trendingTopics = mysqlTable("trending_topics", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // "tech", "marketing", "business", etc.
  source: varchar("source", { length: 100 }), // "google_trends", "reddit", "linkedin", "manual"
  sourceUrl: varchar("source_url", { length: 500 }),
  trendScore: int("trend_score").default(50).notNull(), // 0-100 popularity score
  region: varchar("region", { length: 10 }).default("NO").notNull(), // Country code
  suggestedPlatforms: text("suggested_platforms"), // JSON array of best platforms for this topic
  expiresAt: timestamp("expires_at"), // When this trend becomes stale
  active: int("active").default(1).notNull(), // boolean as int
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type TrendingTopic = typeof trendingTopics.$inferSelect;
export type InsertTrendingTopic = typeof trendingTopics.$inferInsert;

/**
 * Voice Profiles table - stores analyzed writing style for each user
 * AI extracts patterns from user's writing samples
 */
export const voiceProfiles = mysqlTable("voice_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  
  // Writing style characteristics (JSON)
  toneProfile: text("tone_profile"), // {"formal": 0.7, "friendly": 0.3, ...}
  vocabularyLevel: varchar("vocabulary_level", { length: 50 }), // "simple", "professional", "technical"
  sentenceStyle: varchar("sentence_style", { length: 50 }), // "short", "medium", "long", "varied"
  
  // Common patterns
  favoriteWords: text("favorite_words"), // JSON array of frequently used words
  avoidWords: text("avoid_words"), // JSON array of words user never uses
  signaturePhrases: text("signature_phrases"), // JSON array of user's unique expressions
  
  // Formatting preferences
  usesEmojis: int("uses_emojis").default(0).notNull(), // boolean as int
  usesHashtags: int("uses_hashtags").default(0).notNull(),
  usesQuestions: int("uses_questions").default(0).notNull(),
  usesBulletPoints: int("uses_bullet_points").default(0).notNull(),
  
  // Training status
  samplesCount: int("samples_count").default(0).notNull(),
  trainingStatus: mysqlEnum("training_status", ["not_started", "in_progress", "trained", "needs_update"]).default("not_started").notNull(),
  lastTrainedAt: timestamp("last_trained_at"),
  
  // Full profile summary (AI-generated description)
  profileSummary: text("profile_summary"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type VoiceProfile = typeof voiceProfiles.$inferSelect;
export type InsertVoiceProfile = typeof voiceProfiles.$inferInsert;
