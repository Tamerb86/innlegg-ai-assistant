import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint, date, boolean, json } from "drizzle-orm/mysql-core";

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
  tags: json("tags").$type<string[]>(),
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
  // Stripe integration fields
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  stripePriceId: varchar("stripe_price_id", { length: 255 }),
  // Legacy Vipps field (kept for backwards compatibility)
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


/**
 * Content Calendar Events - Norwegian + global events for content planning
 */
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  eventDate: date("event_date").notNull(),
  category: mysqlEnum("category", ["norwegian", "global", "business", "tech", "seasonal"]).notNull(),
  isRecurring: tinyint("is_recurring").default(0).notNull(), // 0 = no, 1 = yes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

/**
 * User Content Schedule - planned posts
 */
export const contentSchedule = mysqlTable("content_schedule", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  postId: int("post_id"), // nullable - can be planned without post yet
  scheduledDate: timestamp("scheduled_date").notNull(),
  platform: mysqlEnum("platform", ["linkedin", "twitter", "instagram", "facebook"]).notNull(),
  status: mysqlEnum("status", ["planned", "published", "cancelled"]).default("planned").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ContentSchedule = typeof contentSchedule.$inferSelect;
export type InsertContentSchedule = typeof contentSchedule.$inferInsert;

/**
 * Best Time Analytics - track when posts perform best
 */
export const postAnalytics = mysqlTable("post_analytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  postId: int("post_id").notNull(),
  platform: mysqlEnum("platform", ["linkedin", "twitter", "instagram", "facebook"]).notNull(),
  publishedAt: timestamp("published_at").notNull(),
  dayOfWeek: int("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  hourOfDay: int("hour_of_day").notNull(), // 0-23
  engagement: int("engagement").default(0).notNull(), // likes + comments + shares
  impressions: int("impressions").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type PostAnalytics = typeof postAnalytics.$inferSelect;
export type InsertPostAnalytics = typeof postAnalytics.$inferInsert;

/**
 * Content Repurposing - track repurposed content
 */
export const repurposedContent = mysqlTable("repurposed_content", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  originalPostId: int("original_post_id").notNull(),
  newPostId: int("new_post_id").notNull(),
  repurposeType: mysqlEnum("repurpose_type", ["platform_adapt", "format_change", "audience_shift", "update"]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type RepurposedContent = typeof repurposedContent.$inferSelect;
export type InsertRepurposedContent = typeof repurposedContent.$inferInsert;

/**
 * Competitor Tracking
 */
export const competitors = mysqlTable("competitors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  platform: mysqlEnum("platform", ["linkedin", "twitter", "instagram", "facebook"]).notNull(),
  profileUrl: varchar("profile_url", { length: 500 }).notNull(),
  isActive: tinyint("is_active").default(1).notNull(),
  lastChecked: timestamp("last_checked"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Competitor = typeof competitors.$inferSelect;
export type InsertCompetitor = typeof competitors.$inferInsert;

/**
 * Competitor Posts - track competitor content
 */
export const competitorPosts = mysqlTable("competitor_posts", {
  id: int("id").autoincrement().primaryKey(),
  competitorId: int("competitor_id").notNull(),
  content: text("content").notNull(),
  engagement: int("engagement").default(0).notNull(),
  publishedAt: timestamp("published_at").notNull(),
  postUrl: varchar("post_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CompetitorPost = typeof competitorPosts.$inferSelect;
export type InsertCompetitorPost = typeof competitorPosts.$inferInsert;

/**
 * Content Series - multi-part content planning
 */
export const contentSeries = mysqlTable("content_series", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  totalParts: int("total_parts").notNull(),
  status: mysqlEnum("status", ["planning", "in_progress", "completed"]).default("planning").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ContentSeries = typeof contentSeries.$inferSelect;
export type InsertContentSeries = typeof contentSeries.$inferInsert;

/**
 * Series Posts - individual posts in a series
 */
export const seriesPosts = mysqlTable("series_posts", {
  id: int("id").autoincrement().primaryKey(),
  seriesId: int("series_id").notNull(),
  postId: int("post_id"),
  partNumber: int("part_number").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SeriesPost = typeof seriesPosts.$inferSelect;
export type InsertSeriesPost = typeof seriesPosts.$inferInsert;

/**
 * A/B Testing - test different versions of content
 */
export const abTests = mysqlTable("ab_tests", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  platform: mysqlEnum("platform", ["linkedin", "twitter", "instagram", "facebook"]).notNull(),
  variantA: text("variant_a").notNull(),
  variantB: text("variant_b").notNull(),
  engagementA: int("engagement_a").default(0).notNull(),
  engagementB: int("engagement_b").default(0).notNull(),
  winner: mysqlEnum("winner", ["a", "b", "tie", "pending"]).default("pending"),
  status: mysqlEnum("status", ["active", "completed"]).default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export type AbTest = typeof abTests.$inferSelect;
export type InsertAbTest = typeof abTests.$inferInsert;

/**
 * Weekly Reports - automated performance reports
 */
export const weeklyReports = mysqlTable("weekly_reports", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  weekStartDate: date("week_start_date").notNull(),
  weekEndDate: date("week_end_date").notNull(),
  totalPosts: int("total_posts").default(0).notNull(),
  totalEngagement: int("total_engagement").default(0).notNull(),
  topPerformingPostId: int("top_performing_post_id"),
  insights: text("insights"), // JSON string with detailed insights
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WeeklyReport = typeof weeklyReports.$inferSelect;
export type InsertWeeklyReport = typeof weeklyReports.$inferInsert;

/**
 * Weekly Report Settings - user preferences for automated reports
 */
export const weeklyReportSettings = mysqlTable("weekly_report_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  email: varchar("email", { length: 255 }).notNull(),
  enabled: tinyint("enabled").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type WeeklyReportSettings = typeof weeklyReportSettings.$inferSelect;
export type InsertWeeklyReportSettings = typeof weeklyReportSettings.$inferInsert;

/**
 * Onboarding Status - track user onboarding tour completion
 */
export const onboardingStatus = mysqlTable("onboarding_status", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  completed: tinyint("completed").default(0).notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type OnboardingStatus = typeof onboardingStatus.$inferSelect;
export type InsertOnboardingStatus = typeof onboardingStatus.$inferInsert;


/**
 * Ideas table - Idé-Bank for quick idea capture
 * Users can save ideas and convert them to posts later
 */
export const ideas = mysqlTable("ideas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  ideaText: text("idea_text").notNull(),
  source: mysqlEnum("source", ["manual", "voice", "trend", "competitor"]).default("manual").notNull(),
  tags: text("tags"), // JSON array of tags
  status: mysqlEnum("status", ["new", "in_progress", "used", "archived"]).default("new").notNull(),
  platform: mysqlEnum("platform", ["linkedin", "twitter", "instagram", "facebook"]),
  convertedPostId: int("converted_post_id"), // Reference to post if converted
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type Idea = typeof ideas.$inferSelect;
export type InsertIdea = typeof ideas.$inferInsert;


/**
 * Drafts table - Auto-save user work in progress
 * Saves form state automatically so users never lose their work
 */
export const drafts = mysqlTable("drafts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  /** Which page/form this draft is for */
  pageType: mysqlEnum("page_type", ["generate", "repurpose", "series", "ab_test", "engagement"]).notNull(),
  /** JSON string containing all form field values */
  formData: text("form_data").notNull(),
  /** Optional title/preview for the draft */
  title: varchar("title", { length: 200 }),
  /** Last auto-save timestamp */
  lastSavedAt: timestamp("last_saved_at").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Draft = typeof drafts.$inferSelect;
export type InsertDraft = typeof drafts.$inferInsert;


/**
 * Telegram Links table - Connect Telegram users to Innlegg accounts
 * SaaS-level bot: one bot serves all users
 */
export const telegramLinks = mysqlTable("telegram_links", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(), // One Telegram per user
  telegramUserId: varchar("telegram_user_id", { length: 64 }).notNull().unique(),
  telegramUsername: varchar("telegram_username", { length: 64 }),
  telegramFirstName: varchar("telegram_first_name", { length: 100 }),
  linkCode: varchar("link_code", { length: 32 }).unique(), // Temporary code for linking
  linkCodeExpiry: timestamp("link_code_expiry"),
  isActive: boolean("is_active").default(true).notNull(),
  linkedAt: timestamp("linked_at").defaultNow().notNull(),
  lastUsedAt: timestamp("last_used_at").defaultNow().onUpdateNow().notNull(),
});

export type TelegramLink = typeof telegramLinks.$inferSelect;
export type InsertTelegramLink = typeof telegramLinks.$inferInsert;
