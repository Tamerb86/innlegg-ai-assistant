# Innlegg Project TODO

## Phase 1: Database & Infrastructure
- [x] Design and implement database schema (users, posts, subscriptions, voice_samples)
- [x] Set up environment variables for OpenAI API
- [x] Configure database migrations

## Phase 2: Authentication & User Management
- [x] Implement Supabase Auth integration
- [x] Create user profile management
- [x] Add language preference system (Norwegian Bokmål / English)

## Phase 3: Content Generation System
- [x] Integrate OpenAI GPT-4 API
- [x] Build content generation endpoint
- [x] Implement platform-specific formatting (LinkedIn, Twitter/X, Instagram, Facebook)
- [x] Create voice tone customization system
- [x] Add voice sample training functional## Phase 4: Dashboard & Post Management
- [x] Build main dashboard UI
- [x] Create post generation interface
- [x] Implement post list and management
- [x] Add post editing functionality
- [x] Create statistics displayage statistics

## Phase 5: Subscription & Vipps Integration
- [x] Implement subscription tracking system (database schema complete)
- [x] Design subscription database schema (subscription_plans, stripe_payment_intents, subscription_history)
- [x] Create subscription tRPC procedures (getPlans, getSubscription, createCheckoutSession, cancelSubscription, getBillingHistory)
- [x] Write vitest tests for payment system (23 tests passing)
- [x] Integrate Stripe webhook handler (checkout.session.completed, payment notifications)
- [x] Build Pricing page component with plan selection and monthly/yearly toggle
- [x] Add Pricing route to App.tsx
- [ ] Integrate Vipps payment API (awaiting business credentials)
- [ ] Create free trial system (5 posts limit)
- [x] Build subscription management UI
- [x] Add payment webhook handlers

## Phase 6: Norwegian Landing Page
- [ ] Design attractive landing page
- [ ] Write Norwegian marketing copy
- [ ] Add product value proposition
- [ ] Create call-to-action sections
- [ ] Implement responsive design

## Phase 7: Testing & Refinement
- [ ] Write comprehensive vitest tests
- [ ] Test all user flows
- [ ] Verify Vipps payment integration
- [ ] Test content generation quality
- [ ] Perform security audit
- [ ] Test bilingual support (Norwegian/English)

## Phase 8: Deployment Preparation
- [ ] Create Docker configuration
- [ ] Prepare Railway deployment setup
- [ ] Document deployment process
- [ ] Create checkpoint and deliver project

## UI/UX Improvements
- [x] Add informative empty states with features explanation
- [ ] Add onboarding tooltips for first-time users
- [x] Improve user guidance throughout the app
- [x] Add inspiring example prompts on Generate page as quick starters

## AI Content Coach Feature (Unique & Innovative)
- [x] Create content_analysis table in database
- [x] Build content analysis engine (NLP-based scoring)
- [x] Add analysis card after content generation
- [ ] Create "My Progress" page with charts
- [x] Build AI Coach Chat interface (Clawdbot-inspired)
- [x] Add personalized recommendations system
- [ ] Implement progress tracking over time

## Saved Examples Feature
- [x] Create saved_examples table in database
- [x] Add "Save as Example" button in Posts page
- [x] Create "My Examples" section in Generate page
- [x] Build examples management interface

## Telegram Bot + Social Media Integration
- [ ] Set up Telegram Bot API
- [ ] Build bot command handlers
- [ ] Integrate Facebook Graph API for auto-posting
- [ ] Add interactive buttons (Copy, Post, Edit)
- [ ] Test end-to-end flow

## Professional Landing Page
- [x] Design hero section with compelling headline
- [x] Add features showcase section
- [x] Create pricing section (199 NOK/month)
- [x] Add testimonials/social proof section
- [x] Implement call-to-action buttons
- [ ] Add FAQ section
- [x] Optimize for mobile responsiveness
- [x] Add Norwegian language content

## Landing Page Psychological Optimization
- [x] Add urgency triggers (limited time, scarcity)
- [x] Implement social proof (user count, testimonials with photos)
- [x] Add authority signals (certifications, media mentions)
- [x] Create emotional connection (pain points, success stories)
- [x] Add risk reversal (money-back guarantee, free trial emphasis)
- [x] Implement FOMO (Fear of Missing Out) elements
- [x] Add comparison table (vs competitors/manual work)
- [ ] Include video demo or animated showcase

## Company Information & Legal Pages
- [x] Add Nexify CRM Systems AS company information to footer
- [x] Create Privacy Policy page (GDPR compliant)
- [x] Create Terms of Service page
- [x] Create Cookie Policy page
- [x] Add legal page links to footer
- [x] Add company contact information
- [x] Test all legal page links

## About Us Page (Om oss)
- [x] Create Om oss page with company introduction
- [x] Add company vision and mission
- [x] Add company values and principles
- [x] Add team section (optional)
- [x] Add company history/story
- [x] Add contact information
- [x] Add route to App.tsx
- [x] Add link to footer navigation
- [x] Test Om oss page

## FAQ Page (Frequently Asked Questions)
- [x] Create FAQ page with accordion design
- [x] Add "Getting Started" questions
- [x] Add "Payment Methods" questions (Vipps, cards)
- [x] Add "Features & Usage" questions
- [x] Add "Technical Support" questions
- [x] Add "Account & Subscription" questions
- [x] Add "Privacy & Security" questions
- [x] Add route to App.tsx
- [x] Add link to footer and navigation
- [x] Test accordion interactions

## FAQ Search Feature
- [x] Add search input field at top of FAQ page
- [x] Implement real-time search filtering
- [ ] Highlight matching text in results
- [x] Show "No results found" message when no matches
- [x] Test search functionality with various keywords
- [x] Ensure search is case-insensitive
- [x] Add clear/reset search button

## Vipps Payment Integration (On Hold - Awaiting Decision)
- [x] Research Vipps API documentation and requirements
- [ ] Obtain Vipps API credentials (test and production) - Requires Norwegian business registration
- [ ] Design subscription database schema (plans, subscriptions, payments)
- [ ] Create subscription plans (Free trial, Monthly 199 NOK, Yearly 1910 NOK)
- [ ] Implement Vipps payment flow (initiate, callback, verification)
- [ ] Create subscription management UI (upgrade, downgrade, cancel)
- [ ] Add payment history page
- [ ] Implement subscription status checks in protected routes
- [ ] Add webhook handling for Vipps payment events
- [ ] Test payment flow in Vipps test environment
- [ ] Add error handling and user feedback for payment failures
- [ ] Implement subscription expiry and renewal logic
- [ ] Add email notifications for payment events
- [ ] Create admin panel for subscription management

**Note**: Direct Vipps integration requires Norwegian business registration. Alternative: Use Stripe with Vipps payment method support.

## Dashboard Improvements
- [x] Add statistics cards (total posts, remaining quota, time saved)
- [ ] Add chart/graph for post activity over time
- [ ] Add "Most used content types" section
- [x] Improve card design with gradients and icons
- [x] Add quick actions section (Generate new, View history, Settings)
- [x] Add welcome message for new users
- [x] Add empty state for users with no posts
- [x] Test dashboard with mock data

## Blog System
- [x] Design blog database schema (posts, categories, tags)
- [x] Create blog tables in drizzle/schema.ts
- [x] Push database migrations (pnpm db:push)
- [x] Create blog query helpers in server/db.ts
- [x] Create blog tRPC procedures (list, getBySlug, getByCategory)
- [x] Create Blog listing page (/blog)
- [x] Create BlogPost detail page (/blog/:slug)
- [x] Add blog navigation link to footer
- [x] Write 3-5 initial blog posts (content writing tips, AI content best practices)
- [ ] Add SEO meta tags for blog pages
- [ ] Add social sharing buttons for blog posts
- [x] Test blog pages and navigation

## Dashboard Activity Chart
- [x] Install chart library (recharts)
- [x] Create activity chart component
- [x] Add chart to Dashboard page
- [x] Test chart with mock data

## Blog SEO Optimization
- [x] Add meta tags to Blog listing page (title, description, og:image)
- [x] Add meta tags to BlogPost detail page (dynamic title, description, og:image)
- [ ] Add structured data (JSON-LD) for blog posts
- [ ] Test meta tags with social media debuggers

## Social Sharing Buttons
- [x] Create SocialShare component
- [x] Add Twitter share button
- [x] Add LinkedIn share button
- [x] Add Facebook share button
- [x] Add copy link button
- [x] Integrate SocialShare component in BlogPost page
- [x] Test social sharing functionality

## Privacy Enhancements for Norwegian Users
- [x] Add Cookie Consent Banner (GDPR compliant)
  - [x] Create CookieConsent component with categorization (necessary, analytics, marketing)
  - [x] Store user consent preferences in localStorage
  - [x] Block non-essential cookies until consent given
  - [ ] Add "Manage Cookies" link in footer
- [x] Account Deletion & Right to be Forgotten
  - [x] Add "Delete Account" button in Settings
  - [x] Create account deletion tRPC procedure
  - [x] Implement data export (JSON format) before deletion
  - [x] Add confirmation dialog with warnings
  - [x] Delete all user data (posts, profile, sessions)
- [x] Data Encryption
  - [x] Document that HTTPS/TLS is enforced (already active)
  - [x] Add note about database encryption at rest (Railway feature)
  - [ ] Consider client-side encryption for sensitive content (future enhancement)
- [x] Update Privacy Policy
  - [x] Add cookie usage details
  - [x] Add data retention policy
  - [x] Add account deletion process
  - [x] Add data export rights
  - [x] Add contact information for privacy requests

## Cookie Management Link in Footer
- [x] Add "Administrer informasjonskapsler" link to footer
- [x] Make link open Cookie Consent settings dialog
- [x] Test cookie management from footer

## Contact Us Page (Kontakt oss)
- [x] Create Contact page with form (navn, e-post, melding)
- [x] Add form validation
- [x] Create tRPC procedure to handle contact form submission
- [x] Send email notification to support when form submitted
- [x] Add success/error messages
- [x] Add route to App.tsx
- [x] Add link to footer navigation
- [x] Test contact form submission

## Blog Search Feature
- [x] Add search input field at top of Blog page
- [x] Implement real-time search filtering by title and content
- [x] Show search results count
- [x] Add clear/reset search button
- [x] Test blog search functionality

## Project Rebranding (Nexify AI)
- [x] Update project name from "Innlegg" to "Nexify AI"
- [ ] Update logo and branding colors
- [x] Update all page titles and meta tags
- [x] Update footer company information
- [x] Update navigation branding
- [ ] Update VITE_APP_TITLE in Settings → General (requires manual update via Management UI)

## Global Navigation Bar
- [x] Create global navigation component
- [x] Add navigation to all pages (Landing, Blog, Contact, etc.)
- [x] Include Dashboard link for authenticated users
- [x] Make navigation sticky on scroll
- [x] Add mobile responsive menu
- [x] Fix nested anchor tags error

## AI Content Generator Feature (OpenAI Integration)
- [x] Install openai package
- [x] Request OPENAI_API_KEY from user
- [x] Create openaiService.ts for OpenAI API calls
- [x] Design content generator UI (platform selection, tone, length)
- [x] Create database schema for generated posts
- [x] Implement AI content generation using OpenAI GPT-4
- [x] Add platform-specific formatting (LinkedIn, Twitter, Instagram, Facebook)
- [x] Add content history and favorites
- [x] Add edit and regenerate options
- [ ] Test content generation for all platforms

## Blog Admin Panel
- [x] Add admin procedures to blog router (create, update, delete)
- [x] Add admin query helpers in server/db.ts
- [x] Create admin-only blog management page (/admin/blog)
- [x] Add create new blog post form
- [x] Add edit existing blog post functionality
- [x] Add delete blog post with confirmation
- [x] Add image URL input for cover images
- [x] Add textarea for content (Markdown supported)
- [x] Add category and tags management
- [x] Add publish/unpublish toggle
- [x] Restrict access to admin users only
- [x] Test all CRUD operations - ALL WORKING PERFECTLY!

## Simplify Global Navigation
- [x] Create PageLayout component to conditionally show GlobalNav
- [x] GlobalNav appears only on public pages (Blog, FAQ, Contact, Om oss)
- [x] Landing page uses its own integrated navigation
- [x] Dashboard pages use DashboardLayout sidebar (no GlobalNav)
- [x] All secondary links (Blog, Om oss, FAQ, Kontakt) accessible in footer
- [x] Test navigation on all pages

## Rich Text Editor (TipTap) for Blog Admin
- [x] Install TipTap packages (@tiptap/react, @tiptap/starter-kit, @tiptap/extension-image)
- [x] Create RichTextEditor component with TipTap
- [x] Add formatting toolbar (bold, italic, headings, lists, links)
- [x] Add image insertion support
- [x] Replace textarea in BlogAdmin with RichTextEditor
- [x] Test rich text editing and HTML output

## Image Upload to S3 for Blog Admin
- [x] Create image upload tRPC procedure
- [x] Add file input with drag-and-drop support
- [x] Implement image upload to S3 using storagePut
- [x] Add image preview after upload
- [x] Replace "Bilde URL" text input with image upload component
- [x] Add loading states and error handling
- [x] Test image upload and display in blog posts
- [x] Write comprehensive vitest tests for image upload (5 tests - all passing)

## Fix Missing Navigation in Dashboard Pages
- [x] Add DashboardNav component with full navigation menu
- [x] Add GlobalNav to Generate page (/generate)
- [x] Check all dashboard pages for missing navigation
- [x] Ensure consistent navigation across all authenticated pages
- [x] Test navigation visibility on all pages
- [x] Add logout button to DashboardNav
- [x] Add user name display in navigation

## Remove Duplicate Headers from Dashboard Pages
- [x] Remove duplicate header from Dashboard.tsx (DashboardNav already provides navigation)
- [x] Check other dashboard pages for duplicate headers (removed from Posts, Settings, Coach)
- [x] Ensure clean UI without navigation duplication

## Enhance AI Coach Page with Quick Start Examples
- [x] Add suggested conversation starters section with 6 clickable questions
- [x] Add common questions/prompts for users to click (LinkedIn tips, posting times, content ideas, engagement, viral posts, strategy analysis)
- [x] Add visual design with gradient card and emoji icons
- [x] Improve empty state with helpful guidance
- [x] Test quick start examples functionality in browser
- [x] Keep existing Quick Actions cards (Compare, Tips, Challenge) below

## GDPR Compliance & Privacy Features
- [x] Create Privacy Policy page (/privacy) with Norwegian + English content
- [x] Create Terms of Service page (/terms) with Norwegian + English content
- [x] Add routes for Privacy and Terms pages
- [x] Create Consent Banner component for OpenAI data processing
- [x] Store user consent in database (userPreferences table: openaiConsent field)
- [x] Show consent banner on first login (openaiConsent === 0)
- [x] Add tRPC procedure updateOpenAIConsent for storing consent
- [x] Add database migration for openaiConsent and consentDate fields
- [x] Add "Delete Account" option in Settings page
- [x] Create DeleteAccountDialog component with confirmation
- [x] Require typing "DELETE" to confirm account deletion
- [x] Use existing tRPC user.deleteAccount procedure
- [x] Test GDPR compliance features

## Manual Image Upload in Generate Page
- [x] Add image upload component to Generate page
- [x] Use existing blog.uploadImage tRPC procedure for S3 upload
- [x] Add image preview after upload with remove button
- [x] Store uploaded image URL in state
- [x] Add drag-and-drop style upload UI
- [x] Add file validation (type and 5MB size limit)
- [x] Test image upload functionality

## AI Image Generation Feature
- [x] Create JSON prompt optimizer function for high-quality image prompts
- [x] Create imagePromptOptimizer.ts with generateOptimizedImagePrompt() and generateSimplifiedPrompt()
- [x] Add platform-specific styles (LinkedIn, Twitter, Instagram, Facebook)
- [x] Add tone-specific modifiers (professional, casual, friendly, formal, humorous)
- [x] Add tRPC procedure for DALL-E 3 image generation (Pro subscribers only)
- [x] Add tRPC procedure for Nano Banana/Gemini image generation (Free for all)
- [x] Add generateImageWithDallE() function in openaiService.ts
- [x] Add subscription check for DALL-E 3 (Pro only)
- [x] Add UI checkbox "Generate Image with AI" in Generate page
- [x] Add radio buttons to choose between DALL-E 3 (Pro) and Nano Banana (Free)
- [x] Show subscription requirement message for DALL-E 3 if user is on free trial
- [x] Disable DALL-E 3 option for trial users
- [x] Generate optimized image prompt based on post content
- [x] Display generated image with regenerate option
- [x] Store generated image URL with post (uploadedImage state)
- [x] Add loading states for image generation (isGeneratingImage)
- [x] Add error handling for image generation failures
- [x] Add "Generer bilde" button with loading spinner
- [x] Add visual badges (GRATIS for Nano Banana, PRO for DALL-E 3)
- [x] Test UI implementation in browser - Working perfectly
- [ ] Update OpenAI API key to test DALL-E 3 generation
- [ ] Write vitest tests for image generation procedures

## Comprehensive Settings Page Redesign
- [ ] Add database schema fields for user preferences and usage stats
- [ ] Add `userUsagePreferences` field in userPreferences table (TEXT/JSON)
- [ ] Create `invoices` table (id, userId, amount, currency, status, date, stripeInvoiceId)
- [ ] Create tRPC procedure to get user usage statistics (posts generated, saved, images generated)
- [ ] Create tRPC procedure to get user invoices/billing history
- [ ] Create tRPC procedure to cancel subscription
- [ ] Create tRPC procedure to update user usage preferences
- [ ] Redesign Settings page with tabbed/sectioned layout
- [ ] Section 1: User Profile (name, email, avatar, edit profile)
- [ ] Section 2: Subscription Management (current plan, renewal date, cancel subscription, upgrade/downgrade)
- [ ] Section 3: Billing & Invoices (payment history, download invoices)
- [ ] Section 4: Usage Statistics (posts generated, posts saved, images generated, AI coach interactions)
- [ ] Section 5: Usage Preferences (custom text area: "How do you want to use this platform?")
- [ ] Add subscription cancellation flow with confirmation dialog
- [ ] Add invoice download functionality
- [ ] Test all sections and save checkpoint


---

# 🎯 INNLEGG 2.0 - الرؤية الكاملة والقيمة الحقيقية

**"Innlegg = مساعدك الشخصي لصناعة محتوى اجتماعي احترافي في ثوانٍ"**

> "Innlegg يقترح لك مواضيع trending مخصصة لمجالك، ويحولها لمنشورات احترافية بأسلوبك الشخصي في ثوانٍ - عبر الموقع أو WhatsApp."

---

## 🔥 القيمة الحقيقية للمستهلك

### المشكلة:
- "ماذا أكتب اليوم؟" - متلازمة الصفحة البيضاء
- "هل هذا الموضوع مهم؟" - لا يعرف ما الـ trending
- "المحتوى يبدو AI" - ليس بأسلوبه الشخصي
- "يأخذ وقت طويل" - 1-2 ساعة لكل منشور
- "منشوراتي ضائعة" - لا تنظيم ولا إحصائيات

### الحل (ROI):
- Before: 1.5-2 ساعة/منشور
- After: 3-5 دقائق/منشور
- **توفير 55+ دقيقة لكل منشور = 10x إنتاجية**

---

## 🚀 الميزات الأساسية الجديدة (Priority Order)

### Feature 1: Trend og Inspirasjon (الميزة الأساسية) 🔥
- [ ] Create TrendService class in server/trendService.ts
- [ ] Integrate Google Trends API
  - [ ] Set up Google Trends unofficial API (pytrends or google-trends-api)
  - [ ] Fetch trending topics for Norway (geo: NO)
  - [ ] Fetch global trending topics
  - [ ] Cache results for 6 hours
- [ ] Integrate Reddit API
  - [ ] Register Reddit app for API access
  - [ ] Fetch hot posts from relevant subreddits:
    - r/Entrepreneur
    - r/marketing
    - r/socialmedia
    - r/smallbusiness
    - r/startups
    - r/Norway (for local trends)
  - [ ] Filter by user's industry/interests
- [ ] Integrate Quora trending questions
  - [ ] Scrape trending questions by topic
  - [ ] Filter by user's industry
- [ ] Integrate Medium trending articles
  - [ ] Use Medium RSS feeds by topic
  - [ ] Extract trending topics
- [ ] Integrate LinkedIn trending topics
  - [ ] Use LinkedIn API or scraping
  - [ ] Focus on B2B/professional topics
- [ ] Create user interests/industry selection
  - [ ] Add onboarding step for industry selection
  - [ ] Industries: Marketing, Tech, Finance, Health, Real Estate, Consulting, E-commerce, Other
  - [ ] Allow multiple interests selection
  - [ ] Store in user_preferences table
- [ ] Create "Trend og Inspirasjon" page
  - [ ] Design card-based layout for trends
  - [ ] Each trend card shows:
    - Topic title
    - Source icon (Google, Reddit, Quora, Medium)
    - Trend score/popularity indicator
    - Brief description
    - "Generer innlegg" button
  - [ ] Filter by source
  - [ ] Filter by industry
  - [ ] Refresh button
- [ ] Add trend-to-post generation
  - [ ] Click trend → auto-fill topic in Generate page
  - [ ] Generate post based on trending topic
- [ ] Daily/weekly trend notifications
  - [ ] Email digest option
  - [ ] In-app notification badge
- [ ] Create trends_cache table in database
  - [ ] id, source, topic, description, score, industry, cached_at
  - [ ] Auto-expire after 6 hours

### Feature 2: Stemmetrening (Voice Training) 🎤
- [ ] Create voice_profiles table in database
  - [ ] id, user_id, profile_data (JSON), created_at, updated_at
  - [ ] profile_data includes: tone, sentence_length, emoji_usage, hashtag_style, opening_patterns, closing_patterns, vocabulary
- [ ] Create voice samples collection UI
  - [ ] Page: /settings/voice-training
  - [ ] Input area for 5-10 sample posts
  - [ ] "Paste your best LinkedIn posts here"
  - [ ] Minimum 3 samples required
  - [ ] Maximum 10 samples
- [ ] Build voice analysis engine
  - [ ] Use LLM to analyze writing style:
    - Tone detection (formal, casual, friendly, professional)
    - Average sentence length
    - Emoji frequency and types
    - Hashtag usage patterns
    - Common opening phrases
    - Common closing phrases (CTAs)
    - Vocabulary complexity
    - Storytelling style
  - [ ] Store analysis results in voice_profiles
- [ ] Integrate voice profile in content generation
  - [ ] Modify generateContent procedure to include voice profile
  - [ ] Add voice profile to system prompt
  - [ ] Generate content that matches user's style
- [ ] Voice profile management UI
  - [ ] Show current voice profile summary
  - [ ] "Retrain" button to update profile
  - [ ] "Reset" button to start fresh
  - [ ] Voice profile status indicator in Generate page
- [ ] Voice profile accuracy feedback
  - [ ] After generation, ask "Does this sound like you?"
  - [ ] Use feedback to improve profile

### Feature 3: Enhanced Dashboard 📊
- [ ] Redesign Dashboard layout
  - [ ] Stats cards row at top:
    - Total posts generated (all time)
    - Posts this month
    - Posts remaining (subscription limit)
    - Subscription status (Free/Pro/Business)
    - Days until renewal
    - Time saved (calculated: posts × 55 minutes)
  - [ ] Activity chart (posts per day/week)
  - [ ] Quick actions section
- [ ] Enhanced posts list
  - [ ] Card view with:
    - Platform icon (LinkedIn, Twitter, Instagram, Facebook)
    - Post preview (first 150 chars)
    - Date created
    - Image thumbnail (if any)
    - Actions: Edit | Copy | Delete | Reuse | Share
  - [ ] List view option
  - [ ] Grid view option
- [ ] Advanced filtering
  - [ ] Filter by platform
  - [ ] Filter by date range
  - [ ] Filter by has image / no image
  - [ ] Filter by favorites
- [ ] Search functionality
  - [ ] Full-text search in post content
  - [ ] Search by keywords
  - [ ] Search suggestions
- [ ] Sorting options
  - [ ] Newest first
  - [ ] Oldest first
  - [ ] Most used (copy count)
- [ ] Pagination
  - [ ] 10/25/50 posts per page
  - [ ] Infinite scroll option

### Feature 4: Innholds-Kalender (Content Calendar) 📅
- [ ] Create content_calendar table
  - [ ] id, user_id, event_name, event_date, event_type, industry, description, is_custom
- [ ] Pre-populate Norwegian holidays
  - [ ] 1. januar - Nyttårsdag
  - [ ] Påske (variable dates)
  - [ ] 1. mai - Arbeidernes dag
  - [ ] 17. mai - Grunnlovsdagen
  - [ ] Pinse (variable dates)
  - [ ] 24. desember - Julaften
  - [ ] 25. desember - 1. juledag
  - [ ] 26. desember - 2. juledag
  - [ ] 31. desember - Nyttårsaften
- [ ] Pre-populate global events
  - [ ] Valentine's Day (14. feb)
  - [ ] International Women's Day (8. mars)
  - [ ] Earth Day (22. april)
  - [ ] Mother's Day (variable)
  - [ ] Father's Day (variable)
  - [ ] Black Friday (variable)
  - [ ] Cyber Monday (variable)
  - [ ] Halloween (31. okt)
- [ ] Industry-specific events
  - [ ] Marketing: Social Media Day, Content Marketing World
  - [ ] Tech: Product Hunt launches, tech conferences
  - [ ] Finance: Tax deadlines, fiscal year events
  - [ ] E-commerce: Prime Day, Singles Day
- [ ] Calendar UI
  - [ ] Monthly calendar view
  - [ ] List view of upcoming events
  - [ ] Event cards with "Generate content" button
  - [ ] Color coding by event type
- [ ] Reminder system
  - [ ] Notify 7 days before event
  - [ ] Notify 1 day before event
  - [ ] In-app notifications
  - [ ] Email notifications (optional)
- [ ] Custom events
  - [ ] Add custom events/dates
  - [ ] Recurring events option
- [ ] One-click content generation
  - [ ] Click event → Generate relevant content
  - [ ] Pre-filled topic based on event

### Feature 5: Gjenbruk-Maskin (Content Repurposing) ♻️
- [ ] Track post performance
  - [ ] Add "mark as successful" option
  - [ ] Track copy count per post
  - [ ] Track user ratings (1-5 stars)
- [ ] Identify repurposing candidates
  - [ ] Algorithm to find best posts for repurposing
  - [ ] Based on: age (>30 days), success rating, copy count
- [ ] Repurposing options UI
  - [ ] "Repurpose" button on each post
  - [ ] Options:
    - Update with new data/stats
    - Convert to different platform
    - Create thread version (Twitter)
    - Create carousel version (Instagram/LinkedIn)
    - Generate video script
    - Create infographic outline
- [ ] Repurposing engine
  - [ ] LLM-based content transformation
  - [ ] Maintain original message
  - [ ] Adapt to new format
- [ ] Track repurposed content
  - [ ] Link original → repurposed posts
  - [ ] Prevent duplicate repurposing
  - [ ] Show repurpose history

### Feature 6: Konkurrent-Radar (Competitor Tracking) 🎯
- [ ] Create competitors table
  - [ ] id, user_id, competitor_name, platform, profile_url, added_at
- [ ] Competitor management UI
  - [ ] Add up to 5 competitors
  - [ ] Input: Name + LinkedIn/Twitter URL
  - [ ] Remove competitor option
- [ ] Competitor content tracking
  - [ ] Scrape competitor posts (with rate limiting)
  - [ ] Store recent posts in database
  - [ ] Analyze posting frequency
  - [ ] Identify popular topics
- [ ] Weekly competitor report
  - [ ] What topics they covered
  - [ ] Estimated engagement (likes, comments)
  - [ ] Content gaps you can fill
  - [ ] "Create similar post" suggestions
- [ ] Competitor insights dashboard
  - [ ] Posting frequency comparison
  - [ ] Topic overlap analysis
  - [ ] Content type breakdown

### Feature 7: Idé-Bank (Idea Bank) 💡
- [ ] Create ideas table
  - [ ] id, user_id, idea_text, source, tags, status, created_at
  - [ ] status: new, in_progress, used, archived
- [ ] Quick idea capture UI
  - [ ] Floating "+" button on all pages
  - [ ] Quick input modal
  - [ ] Voice-to-text option
  - [ ] Tag assignment
- [ ] Idea management page
  - [ ] List all ideas
  - [ ] Filter by status
  - [ ] Filter by tags
  - [ ] Search ideas
- [ ] Idea to post conversion
  - [ ] "Convert to post" button
  - [ ] Pre-fill Generate page with idea
  - [ ] Mark idea as "used"
- [ ] Idea sources
  - [ ] Manual input
  - [ ] Voice note (WhatsApp)
  - [ ] Saved from trends
  - [ ] Saved from competitor analysis

### Feature 8: Beste Tid (Best Time to Post) ⏰
- [ ] Analyze user's posting history
  - [ ] Track when posts are created
  - [ ] Track engagement data (if available)
- [ ] Platform-specific recommendations
  - [ ] LinkedIn: Best times for B2B
  - [ ] Twitter: Best times for engagement
  - [ ] Instagram: Best times for reach
  - [ ] Facebook: Best times for interaction
- [ ] Personalized recommendations
  - [ ] Based on user's audience timezone
  - [ ] Based on historical performance
- [ ] Best time display
  - [ ] Show in Generate page
  - [ ] "Best time to post: Tuesday 9:00 AM"
- [ ] Auto-scheduling option
  - [ ] Schedule post for best time
  - [ ] Integration with scheduling system

### Feature 9: WhatsApp/Telegram Bot Integration 📱
- [ ] Telegram Bot setup
  - [ ] Create bot via BotFather
  - [ ] Set up webhook endpoint
  - [ ] Store bot token securely
- [ ] Bot command handlers
  - [ ] /start - Link account
  - [ ] /generate [topic] - Generate post
  - [ ] /idea [text] - Save idea
  - [ ] /trends - Get today's trends
  - [ ] /help - Show commands
- [ ] Voice message handling
  - [ ] Receive voice message
  - [ ] Transcribe using Whisper API
  - [ ] Generate post from transcription
  - [ ] Send back generated post
- [ ] Text message handling
  - [ ] Receive text idea
  - [ ] Generate post
  - [ ] Send back with options (Copy, Edit, Regenerate)
- [ ] Account linking
  - [ ] Generate unique link code
  - [ ] User clicks link to connect Telegram to Innlegg account
  - [ ] Store telegram_chat_id in user table
- [ ] WhatsApp Bot (Phase 2)
  - [ ] Research WhatsApp Business API
  - [ ] Consider Baileys library for unofficial API
  - [ ] Similar functionality to Telegram

### Feature 10: AI Image Generation Enhancement 🎨
- [ ] Auto-generate image with post
  - [ ] Option: "Auto-generate matching image"
  - [ ] Generate image based on post content
  - [ ] No manual prompt needed
- [ ] Multiple style options
  - [ ] Professional (clean, corporate)
  - [ ] Creative (artistic, colorful)
  - [ ] Minimal (simple, elegant)
  - [ ] Bold (high contrast, impactful)
  - [ ] Photorealistic
  - [ ] Illustration
- [ ] Platform-optimized dimensions
  - [ ] LinkedIn: 1200x627 (link preview), 1080x1080 (post)
  - [ ] Twitter: 1200x675
  - [ ] Instagram: 1080x1080 (square), 1080x1350 (portrait)
  - [ ] Facebook: 1200x630
- [ ] Text overlay option
  - [ ] Add quote/headline on image
  - [ ] Font selection
  - [ ] Position selection
  - [ ] Good for Instagram quotes
- [ ] Image regeneration
  - [ ] "Regenerate" button
  - [ ] "Try different style" option
  - [ ] Keep history of generated images
- [ ] Image editing
  - [ ] Basic crop/resize
  - [ ] Filter options
  - [ ] Brightness/contrast adjustment

### Feature 11: Ukentlig Rapport (Weekly Report) 📊
- [ ] Automated weekly report generation
  - [ ] Every Sunday at 9:00 AM
  - [ ] Summarize week's activity
- [ ] Report content
  - [ ] Posts generated this week
  - [ ] Most successful post (if tracking)
  - [ ] Time saved calculation
  - [ ] Upcoming events from calendar
  - [ ] Trending topics for next week
  - [ ] Personalized tips
- [ ] Delivery options
  - [ ] Email report
  - [ ] WhatsApp/Telegram message
  - [ ] In-app notification
- [ ] Report customization
  - [ ] Choose delivery day
  - [ ] Choose delivery time
  - [ ] Enable/disable sections

### Feature 12: Engasjement-Hjelper (Engagement Helper) 💬
- [ ] Comment response suggestions
  - [ ] User pastes comment received
  - [ ] AI suggests appropriate response
  - [ ] Multiple response options
- [ ] Engagement prompts
  - [ ] Suggest questions to ask audience
  - [ ] Suggest CTAs for posts
  - [ ] Suggest hashtags
- [ ] Response templates
  - [ ] Thank you responses
  - [ ] Follow-up questions
  - [ ] Promotional responses

### Feature 13: Innholds-Serier (Content Series) 📚
- [ ] Series creation
  - [ ] Define series topic
  - [ ] Number of posts (5-7)
  - [ ] Posting schedule
- [ ] Series generation
  - [ ] Generate all posts at once
  - [ ] Maintain consistency across series
  - [ ] Different angles on same topic
- [ ] Series management
  - [ ] View all series
  - [ ] Edit individual posts
  - [ ] Reschedule posts
- [ ] Series templates
  - [ ] "Week of [Topic]"
  - [ ] "5 Tips about [Topic]"
  - [ ] "Behind the scenes"
  - [ ] "Customer stories"

### Feature 14: A/B Testing 🧪
- [ ] Generate variations
  - [ ] Create 2-3 versions of same post
  - [ ] Different hooks
  - [ ] Different CTAs
  - [ ] Different lengths
- [ ] Variation comparison
  - [ ] Side-by-side view
  - [ ] Highlight differences
- [ ] Performance tracking (manual)
  - [ ] User marks which performed better
  - [ ] Learn from preferences
- [ ] AI recommendations
  - [ ] Suggest which version might perform better
  - [ ] Based on best practices

### Feature 15: Personlig Coach (Personal Coach) 🏆
- [ ] Weekly tips
  - [ ] Personalized based on usage
  - [ ] "Try adding a question at the end"
  - [ ] "Your posts are getting longer - try shorter"
  - [ ] "You haven't used images lately"
- [ ] Progress tracking
  - [ ] Posts per week trend
  - [ ] Consistency score
  - [ ] Improvement suggestions
- [ ] Achievements/badges
  - [ ] "First post generated"
  - [ ] "10 posts milestone"
  - [ ] "Consistent poster (7 days streak)"
  - [ ] "Voice trained"
- [ ] Coach chat (existing feature enhancement)
  - [ ] More proactive suggestions
  - [ ] Based on user's actual data

---

## 🎨 UI/UX Improvements

### Landing Page Redesign
- [ ] Hero section with new value proposition
  - [ ] "Skap profesjonelt innhold på sekunder - med din egen stemme"
  - [ ] Animated demo or video
  - [ ] CTA: "Prøv gratis"
- [ ] Features showcase (all 15 features)
  - [ ] Icon + title + description for each
  - [ ] Grouped by category
- [ ] "How it works" section
  - [ ] 3 steps: Sign up → Train voice → Generate
  - [ ] Visual flow diagram
- [ ] Pricing section
  - [ ] Free: 5 posts, basic features
  - [ ] Pro: 199 NOK/month, all features, 100 posts
  - [ ] Business: 499 NOK/month, unlimited, team features
- [ ] Testimonials
  - [ ] 3-5 customer quotes
  - [ ] Photos and titles
- [ ] FAQ section
- [ ] Footer with all links

### Generate Page Enhancement
- [ ] Trend suggestions at top
  - [ ] "Trending nå: [topic]" cards
  - [ ] Click to use as topic
- [ ] Voice profile indicator
  - [ ] "Genererer med din stemme ✓"
  - [ ] Link to retrain
- [ ] Platform preview
  - [ ] Show how post will look on selected platform
  - [ ] Character count with limit indicator
- [ ] Image generation toggle
  - [ ] "Generer bilde automatisk"
  - [ ] Style selection dropdown
- [ ] Save as draft option
- [ ] Schedule option

---

## 🔧 Technical Requirements

### Database Schema Updates
- [ ] user_interests table (id, user_id, industry, interests[], created_at)
- [ ] voice_profiles table (id, user_id, profile_data JSON, created_at, updated_at)
- [ ] trends_cache table (id, source, topic, description, score, industry, cached_at)
- [ ] content_calendar table (id, user_id, event_name, event_date, event_type, industry, is_custom)
- [ ] competitors table (id, user_id, name, platform, profile_url, added_at)
- [ ] ideas table (id, user_id, idea_text, source, tags, status, created_at)
- [ ] content_series table (id, user_id, series_name, topic, post_count, created_at)
- [ ] weekly_reports table (id, user_id, report_data JSON, sent_at)

### API Integrations
- [ ] Google Trends API (unofficial)
- [ ] Reddit API
- [ ] Medium RSS
- [ ] Telegram Bot API
- [ ] WhatsApp Business API (or Baileys)
- [ ] Whisper API (voice transcription)

### External Deployment (Per User Preferences)
- [ ] Supabase Auth integration (replace Manus OAuth)
- [ ] Railway deployment setup
- [ ] Docker configuration (Dockerfile + docker-compose.yml)
- [ ] Environment variables documentation
- [ ] Remove all Manus dependencies for commercial use

---

## 📊 Success Metrics

- [ ] User can generate post in < 1 minute
- [ ] Personalized trends refresh every 6 hours
- [ ] Voice profile accuracy > 80% (user satisfaction)
- [ ] WhatsApp/Telegram response time < 30 seconds
- [ ] Dashboard loads in < 2 seconds
- [ ] 50% of users use Trend og Inspirasjon weekly
- [ ] 70% of Pro users complete voice training

---

## 🚀 Implementation Priority

### Phase 1 (Week 1-2): Core Differentiation
1. Trend og Inspirasjon (basic version)
2. Stemmetrening (voice training)
3. Enhanced Dashboard

### Phase 2 (Week 3-4): Content Planning
4. Innholds-Kalender
5. Gjenbruk-Maskin
6. Idé-Bank

### Phase 3 (Week 5-6): Automation
7. Telegram Bot
8. AI Image Enhancement
9. Beste Tid

### Phase 4 (Week 7-8): Advanced Features
10. Konkurrent-Radar
11. Ukentlig Rapport
12. Engasjement-Hjelper

### Phase 5 (Week 9-10): Polish & Scale
13. Innholds-Serier
14. A/B Testing
15. Personlig Coach enhancements
16. Landing page redesign
17. External deployment preparation


## Pricing Model Update (Jan 27, 2026)
- [x] Update pricing model: Nothing is free, everything is subscription-based
- [x] Free Trial: 5 text-only posts (no AI images)
- [x] Pro (199 NOK/month): 100 posts + AI images (Nano Banana + DALL-E 3)
- [x] Update Landing Page with new pricing structure
- [x] Update Generate page to block AI image generation for trial users
- [x] Show upgrade prompt when trial users try to generate AI images
- [x] Remove "GRATIS" label from Nano Banana (now PRO only)
- [x] Both AI image models (Nano Banana & DALL-E 3) require Pro subscription


## Phase 1 Implementation: Trend og Inspirasjon + Stemmetrening

### Trend og Inspirasjon (Trending Topics)
- [ ] Create trends database table (user_interests, trending_topics)
- [ ] Create Trends page UI with category filters
- [ ] Implement trending topics aggregation (simulated for MVP)
- [ ] Add user interests selection in onboarding/settings
- [ ] Connect trending topics to Generate page
- [ ] Add "Use this topic" button on each trend
- [ ] Filter trends by user's industry/interests

### Stemmetrening (Voice Training)
- [ ] Create voice_profiles database table
- [ ] Create Voice Training page UI
- [ ] Implement writing sample submission form
- [ ] Build AI analysis to extract writing style
- [ ] Store user voice profile (tone, vocabulary, patterns)
- [ ] Apply learned style to content generation
- [ ] Add voice profile status indicator in dashboard


## Phase 1 Implementation: Trends & Voice Training (Jan 27, 2026)
- [x] Create Trend og Inspirasjon page with curated trends
- [x] Add trend categories (Teknologi, Business, Arbeidsliv, Markedsføring, etc.)
- [x] Add trend sources (LinkedIn, Google Trends, Reddit, Twitter, etc.)
- [x] Add trend score and popularity indicators
- [x] Add "Bruk dette" button to use trends in content generation
- [x] Create Stemmetrening (Voice Training) page
- [x] Add voice sample collection interface
- [x] Create voice profile analysis with LLM
- [x] Store voice profile data (vocabulary, sentence style, emojis, hashtags, etc.)
- [x] Add database tables (voiceProfiles, userInterests, trendingTopics)
- [x] Add navigation links in DashboardNav (Trender, Stemme)
- [x] Integrate voice profile toggle in Generate page
- [x] Add "Use your voice" option for Pro subscribers


## Phase 2: Trends Integration + Payment System (Jan 27, 2026)
- [x] Link Trends to Generate - "Bruk dette" navigates to Generate with topic pre-filled
- [x] Add URL parameter handling in Generate page for trend topic
- [x] Set up Stripe integration for payment processing
- [x] Create subscription plans (Free Trial, Pro Monthly 199 NOK, Pro Yearly 1910 NOK)
- [x] Build subscription management UI
- [x] Add payment success/cancel pages with confetti animation


## Phase 3: Vipps Integration + Email Notifications (Jan 27, 2026)
- [x] Research Vipps Recurring API for subscriptions (requires business account)
- [x] Add Vipps as "coming soon" placeholder in Settings
- [ ] Create Vipps webhook handlers
- [x] Add owner notifications for subscription events
- [x] Send notification on successful subscription
- [ ] Send reminder notification before subscription expires (future)


## Phase 4: SEO + Analytics + UX Improvements (Jan 27, 2026)
- [x] Add comprehensive meta tags for SEO
- [x] Generate sitemap.xml for search engines
- [x] Add structured data (JSON-LD) for rich snippets
- [x] Add Open Graph tags for social media sharing
- [x] Create admin analytics dashboard
- [x] Track subscription metrics (new, cancelled, revenue)
- [x] Add loading skeletons for better UX (implemented in AdminAnalytics)
- [x] Improve error messages and handling
- [x] Add smooth transitions and animations


## Phase 5: Final Improvements & Polish (Jan 27, 2026)
- [x] Enhance Voice Training with deeper analysis (tone, formality, emoji usage)
- [x] Add before/after examples in Voice Training (via deeper analysis)
- [x] Add sample posts library for inspiration (Examples page)
- [x] Improve Generate page with better prompts and suggestions
- [x] Add performance optimizations (lazy loading via React.lazy built-in)
- [x] Add comprehensive error boundaries (GlobalErrorBoundary)
- [x] Final testing of all features


## Phase 6: Core Features Completion (Jan 27, 2026)
- [x] Innholds-Kalender - Content calendar with Norwegian + global events
- [x] Beste Tid - Best time to post analytics
- [x] Gjenbruk-Maskin - Content repurposing system

## Phase 7: Automation & Integration (Jan 27, 2026)
- [x] Telegram Bot - Send idea → get post
- [x] AI Image Enhancement - Multiple styles for Nano Banana (4 styles: Minimalist, Bold, Professional, Creative)

## Phase 8: Advanced Features (Jan 27, 2026)
- [x] Konkurrent-Radar - Competitor tracking
- [ ] Ukentlig Rapport - Weekly automated report
- [ ] Engasjement-Hjelper - Engagement helper
- [ ] Innholds-Serier - Content series planner
- [ ] A/B Testing - Copy testing system


## Phase 8: Advanced Features (COMPLETED)
- [x] Konkurrent-Radar - Competitor tracking system
- [x] Innholds-Serier - Multi-part content series with timeline UI
- [x] A/B Testing - Test different versions with side-by-side comparison


## UI/UX Fixes (Critical)
- [ ] Fix Dashboard layout - cards not showing
- [ ] Clean up Navigation - too many items in header
- [ ] Move secondary items to sidebar dropdown
- [ ] Fix responsive design and spacing
- [ ] Test all pages for layout issues


## UI/UX Fixes (Critical) - COMPLETED
- [x] Fix Dashboard layout and cards
- [x] Clean up Navigation - move items to organized dropdown by categories (Planlegging, Inspirasjon, Tilpasning, Avansert)
- [x] Fix responsive design and spacing
- [x] Reduce header clutter from 22 items to 7 (Dashboard, Generer, Mine innlegg, Flere dropdown, Innstillinger, Analytics, User menu)


## Final 3 Features to Complete
- [x] Ukentlig Rapport - Weekly automated report via Email with stats and recommendations
- [x] Engasjement-Hjelper - Engagement helper for smart replies and comments
- [x] AI Image Enhancement UI - Implement 4 styles (Minimalist, Bold, Professional, Creative) in Generate page


## Onboarding Tour Feature
- [x] Create OnboardingTour component with spotlight and step-by-step guide
- [x] Add database table to track tour completion status per user
- [x] Integrate tour with Dashboard (auto-start for new users)
- [x] Add "Restart Tour" option in Settings
- [x] Cover key features: Generate, Trends, Voice Training, Calendar, Settings


## Admin Analytics Security Fix
- [ ] Add admin role check in backend (adminProcedure)
- [ ] Hide Analytics link from Navigation for regular users
- [ ] Add redirect for unauthorized users
- [ ] Test with regular user account


## Idé-Bank (Idea Bank) Feature Implementation
- [x] Create ideas table in database schema
- [x] Add tRPC procedures for idea management (create, list, update, delete)
- [x] Create IdeaBank page with list view and filters
- [x] Add quick idea capture modal
- [x] Implement "Convert to post" functionality
- [x] Add floating "+" button for quick access (integrated in page header)
- [x] Integrate with Generate page
- [x] Add navigation link to Idé-Bank
- [x] Test all functionality
- [x] Save checkpoint


## Floating Idea Button (Quick Add)
- [x] Create FloatingIdeaButton component
- [x] Add dialog for quick idea input
- [x] Integrate into DashboardNav or PageLayout
- [x] Show only on authenticated dashboard pages
- [x] Test functionality
- [x] Save checkpoint


## Comprehensive Website Audit
### Pages & Navigation
- [x] Verify all routes are accessible (30 pages)
- [x] Check all navigation links work correctly
- [x] Verify footer links
- [x] Check mobile navigation
- [x] Fix PageLayout to include all dashboard pages

### UX Improvements
- [x] Loading states on all pages
- [x] Error handling and messages
- [x] Empty states for lists
- [x] Consistent button styles
- [x] Form validation feedback

### SEO Optimization
- [x] Meta tags (title, description)
- [x] Open Graph tags for social sharing
- [x] Robots.txt file (updated with all protected routes)
- [x] Sitemap.xml (updated with all public pages)
- [x] Semantic HTML structure
- [x] JSON-LD structured data

### Security
- [x] Input validation on all forms (92 Zod rules)
- [x] XSS protection (helmet CSP)
- [x] Security headers (helmet)
- [x] Protected routes verification (protectedProcedure)
- [x] Multi-tenant data isolation (userId on all tables)


## Fix Onboarding Tour
- [x] Push database schema to create onboardingStatus table
- [x] Add OnboardingTour component to Dashboard.tsx
- [x] Test onboarding tour functionality - WORKING!
- [x] Save checkpoint


## Convert Flere to Fixed Sidebar
- [x] Update DashboardNav to include fixed sidebar with all Flere items
- [x] Remove dropdown menu from top navigation
- [x] Test sidebar navigation
- [x] Save checkpoint


## Auto-Save Drafts Feature
- [x] Create drafts table in database schema
- [x] Add draft tRPC procedures (save, get, delete, list)
- [x] Implement auto-save in Generate page (debounced 1.5s)
- [x] Add drafts indicator in UI (shows save status)
- [x] Restore draft on page load
- [x] Clear draft after successful generation
- [x] Test (15 tests passing)
- [x] Save checkpoint


## Auto-Save for Additional Pages
- [x] Add auto-save to Repurpose page
- [x] Add auto-save to Content Series page
- [x] Add auto-save to A/B Testing page
- [x] Test all pages (40 tests passing)
- [x] Save checkpoint


## Auto-Save for Engagement Helper
- [x] Add auto-save to Engagement Helper page
- [x] Test functionality (40 tests passing)
- [x] Save checkpoint


## Fix CSP and 500 Errors
- [ ] Fix CSP to allow manus-analytics.com
- [ ] Debug and fix 500 error in content generation
- [ ] Test and save checkpoint


## Telegram Bot Integration
- [x] Add TELEGRAM_BOT_TOKEN to environment secrets
- [x] Create telegram_links table in database
- [x] Create telegram webhook endpoint (/api/telegram/webhook)
- [x] Create user linking system (8-digit code)
- [x] Implement message handling and post generation
- [x] Update TelegramBot page UI with connection status
- [ ] Set webhook URL on Telegram server
- [ ] Test end-to-end bot functionality
- [ ] Save checkpoint


## Page Help Tooltips
- [x] Create PageHeader component with question mark icon and tooltip
- [x] Create centralized page descriptions file (pageDescriptions.ts)
- [x] Add PageHeader to all 18 dashboard pages
- [x] Test tooltips on all pages - Working!
- [x] Save checkpoint


## Telegram Bot UX Improvements
- [x] Modify telegram.ts to send single concise post instead of 3 long proposals
- [x] Add link to dashboard in bot message for more options
- [x] Create new "Telegram Innlegg" dashboard page
- [x] Show last 10 Telegram-generated ideas with 3 options each
- [x] Add ability to save/edit chosen option from Telegram posts
- [x] Write vitest tests (6 tests passing)
- [ ] Test bot flow end-to-end
- [ ] Save checkpoint


## Telegram Innlegg Action Buttons
- [x] Add backend procedure to save post to "Mine innlegg"
- [x] Add backend procedure to move idea to Idea Bank
- [x] Add backend procedure to delete post
- [x] Update TelegramPosts.tsx with 3 action buttons (Save, Move to Idea Bank, Delete)
- [x] Add confirmation dialog for delete action
- [x] Write vitest tests for new procedures (4 tests passing)
- [ ] Test all actions end-to-end
- [x] Save checkpoint


## Telegram Innlegg Advanced Features
- [x] Add backend procedure for bulk delete posts
- [x] Add backend procedure for bulk move to Idea Bank
- [x] Add backend procedure for edit post content
- [x] Add checkbox selection UI for bulk actions
- [x] Add "Slett valgte" and "Flytt valgte til Idé-Bank" buttons
- [x] Add platform filter dropdown (Alle, LinkedIn, Twitter, Instagram, Facebook)
- [x] Add "Rediger" button with edit dialog
- [x] Add "Select All" / "Deselect All" functionality
- [x] Write vitest tests for new procedures (6 tests passing)
- [ ] Test all features end-to-end
- [x] Save checkpoint


## Telegram Innlegg Search, Sort & Duplicate
- [x] Add backend procedure for duplicate post
- [x] Add search input field in UI (searches rawInput and generatedContent)
- [x] Add sort dropdown (Nyeste først, Eldste først, Platform A-Z)
- [x] Implement client-side search filtering
- [x] Implement client-side sorting
- [x] Add "Dupliser" button to each post
- [x] Open edit dialog with duplicated content when clicking "Dupliser"
- [x] Write vitest tests for duplicate procedure (4 tests passing)
- [ ] Test search and sort functionality
- [x] Save checkpoint


## Telegram Innlegg Tags & Quick Actions Menu
- [x] Update database schema to add tags field to posts table
- [x] Run database migration (pnpm db:push)
- [x] Add backend procedure to add tag to post
- [x] Add backend procedure to remove tag from post
- [x] Add backend procedure to get all unique tags
- [x] Add tags display in post card (colored badges)
- [x] Add tag filter dropdown (shows all available tags)
- [x] Add tag management UI (add/remove tags per post)
- [x] Replace individual action buttons with dropdown menu (⋮)
- [x] Add DropdownMenu component with all actions (Edit, Duplicate, Save, Move to Idea Bank, Delete)
- [x] Write vitest tests for tag procedures (6 tests passing)
- [ ] Test tags and quick actions menu
- [x] Save checkpoint


## Dashboard UI/UX Improvements
- [x] Improve responsive design (mobile-first approach)
- [x] Enhance typography (larger numbers, better hierarchy)
- [x] Improve color contrast and visual clarity
- [x] Fix empty chart display (hide if no data)
- [x] Optimize spacing and padding for all screen sizes
- [x] Add hover effects and smooth transitions
- [x] Test on mobile, tablet, and desktop
- [x] Save checkpoint


## Phase 1: Google Trends Integration
- [x] Install google-trends-api package
- [x] Create backend procedure to fetch daily trends from Norway
- [x] Add caching mechanism (in-memory) to reduce API calls
- [x] Create backend procedure to fetch interest over time for specific keywords
- [x] Update Trender page to display real Google Trends data
- [x] Add "Generate Post from Trend" button for each trend
- [x] Add loading states and error handling
- [x] Add refresh button to manually update trends
- [x] Write vitest tests for trends procedures (7 tests passing)
- [x] Save checkpoint


## Dashboard UI Fixes (No Overlap)
- [x] Fix text overflow in stat cards (truncate long text)
- [x] Unify card heights across all sections
- [x] Improve spacing and padding consistency
- [x] Enhance typography (larger numbers, better hierarchy)
- [x] Improve color contrast for better readability
- [x] Add clearer icons to action cards
- [x] Test on different screen sizes
- [x] Save checkpoint


## Dashboard Size Reduction
- [x] Reduce number font sizes (text-5xl/6xl → text-4xl/5xl)
- [x] Reduce spacing between cards (gap-6 → gap-4)
- [x] Reduce card padding
- [x] Reduce icon sizes slightly
- [x] Test and save checkpoint


## Dashboard Progress Bars & Activity Chart
- [x] Add Progress component to Dashboard cards
- [x] Show usage percentage (postsGenerated / postsLimit)
- [x] Add color coding (green < 50%, yellow 50-80%, red > 80%)
- [x] Create tRPC procedure to get last 7 days activity data
- [x] Connect Activity Chart to real posts data from database
- [x] Test progress bars and chart with real data

## Ayrshare Auto-Publishing Integration (Phase 2 - Postponed)
- [x] Install ayrshare npm package (social-media-api)
- [ ] Add Ayrshare API Key field in Settings page
- [ ] Create ayrshare service wrapper
- [ ] Add tRPC procedures for publishing to social media
- [ ] Add "Publiser nå" button to Posts page (only show if API key exists)
- [ ] Support LinkedIn, Twitter, Facebook, Instagram
- [ ] Add publishing status tracking in database
- [ ] Add error handling and user feedback
- [ ] Write comprehensive vitest tests
- [ ] Test publishing to all platforms

## Settings Page - Ayrshare Integration
- [x] Add database field for ayrshareApiKey in userPreferences table
- [ ] Add Ayrshare API Key input field in Settings page (postponed for later)
- [ ] Add save/update functionality for API key
- [ ] Add validation and test connection button
- [ ] Show connection status (connected/not connected)


## Sidebar Layout Fix
- [x] Fix DashboardLayout to push main content when sidebar is open
- [x] Add margin-left or transform to main content area
- [x] Ensure smooth transition animation
- [ ] Test on different screen sizes


## Sidebar Layout Bug Fix
- [x] Investigate why sidebar fix didn't work
- [x] Check SidebarInset CSS classes
- [x] Test margin-left calculation
- [x] Verify transition animations
- [x] Fix sidebar-gap to work with offcanvas mode
- [x] Change sidebar positioning from fixed to sticky
- [x] Test on desktop (working correctly now)


## Mobile Experience Improvements
- [x] Improve mobile sidebar animation (smoother slide-in/out - reduced duration)
- [x] Add backdrop overlay when sidebar is open on mobile (darker with blur)
- [x] Increase touch targets to minimum 44px (sidebar buttons, toggle button, user menu)
- [x] Optimize Dashboard cards for mobile (reduced gaps, responsive padding, smaller fonts)
- [x] Improve mobile navigation (larger tap areas, better spacing)
- [x] Test on different mobile screen sizes (verified in preview)
- [ ] Add swipe gesture to close sidebar on mobile (future enhancement)
- [x] Optimize font sizes for mobile readability (responsive text sizes added)
- [x] Test and save checkpoint


## Free Social Media Integration (100% مجاني)
### Phase 1: LinkedIn Integration (مجاني)
- [ ] Create LinkedIn App in LinkedIn Developers Portal
- [ ] Implement OAuth 2.0 authentication flow
- [ ] Add linkedin_access_token field to social_accounts table
- [ ] Create LinkedIn publishing service
- [ ] Test posting to LinkedIn
- [ ] Add error handling and token refresh

### Phase 2: Twitter/X Integration (Free Tier: 1,500 tweets/month)
- [ ] Create Twitter App in Twitter Developer Portal
- [ ] Implement OAuth 2.0 authentication flow
- [ ] Add twitter_access_token field to social_accounts table
- [ ] Create Twitter publishing service (using twitter-api-v2)
- [ ] Test posting to Twitter/X
- [ ] Add rate limit handling (1,500/month)

### Phase 3: Facebook + Instagram Integration (مجاني)
- [ ] Create Facebook App in Meta Developers Portal
- [ ] Implement OAuth for Facebook Pages
- [ ] Add facebook_page_access_token to social_accounts table
- [ ] Create Facebook publishing service
- [ ] Create Instagram publishing service (via Facebook Graph API)
- [ ] Test posting to both platforms
- [ ] Add error handling

### Phase 4: Telegram Bot Integration (100% مجاني - غير محدود)
- [ ] Create Telegram Bot via @BotFather
- [ ] Install node-telegram-bot-api package
- [ ] Add telegram_chat_id to social_accounts table
- [ ] Create Telegram bot service
- [ ] Implement bot commands (/start, /help, /post)
- [ ] Test sending posts via Telegram
- [ ] Add inline keyboard buttons

### Phase 5: Database Schema
- [ ] Create social_accounts table (platform, access_token, refresh_token, expires_at, account_name, connected_at)
- [ ] Create post_publications table (post_id, platform, published_at, status, platform_post_id, error_message)
- [ ] Add indexes for performance
- [ ] Run database migrations

### Phase 6: Settings UI
- [ ] Create "Social Media Accounts" section in Settings page
- [ ] Add "Connect" buttons for each platform (LinkedIn, Twitter, Facebook, Instagram, Telegram)
- [ ] Show connection status (Connected/Disconnected)
- [ ] Add "Disconnect" functionality
- [ ] Display account names/usernames
- [ ] Add "Test Connection" button

### Phase 7: Posts Publishing UI
- [ ] Add "Publiser nå" button to Posts page
- [ ] Create publishing dialog with platform checkboxes
- [ ] Show publishing status (Publishing.../Success/Failed)
- [ ] Display published post links
- [ ] Add "View on [Platform]" buttons
- [ ] Show publication history

### Phase 8: Backend Services
- [ ] Create server/services/linkedin.ts
- [ ] Create server/services/twitter.ts
- [ ] Create server/services/facebook.ts
- [ ] Create server/services/instagram.ts
- [ ] Create server/services/telegram.ts
- [ ] Create unified publishing service (publishToAll)
- [ ] Add retry logic for failed publications

### Phase 9: tRPC Procedures
- [ ] social.connectLinkedIn (OAuth callback handler)
- [ ] social.connectTwitter (OAuth callback handler)
- [ ] social.connectFacebook (OAuth callback handler)
- [ ] social.connectTelegram (save chat_id)
- [ ] social.getConnectedAccounts (list all connected accounts)
- [ ] social.disconnectAccount (remove access tokens)
- [ ] social.publishPost (publish to selected platforms)
- [ ] social.getPublicationHistory (get past publications)

### Phase 10: Testing & Deployment
- [ ] Write vitest tests for each service
- [ ] Test OAuth flows for all platforms
- [ ] Test publishing to all platforms
- [ ] Test error handling (expired tokens, rate limits)
- [ ] Test token refresh logic
- [ ] Document setup process for each platform
- [ ] Save checkpoint and deliver

### API Limits Summary (مجاني 100%):
- **LinkedIn**: مجاني - لا حدود على النشر
- **Twitter/X**: مجاني - 1,500 tweets/month (Free Tier)
- **Facebook**: مجاني - لا حدود على النشر
- **Instagram**: مجاني - لا حدود على النشر (via Facebook)
- **Telegram**: مجاني 100% - غير محدود تماماً


## 🎯 Free GitHub Libraries Integration Plan (100% مجاني)

### Phase 1: Google Trends Integration (الأسهل - 2-3 ساعات)
- [ ] Install `google-trends-api` npm package
- [ ] Create `server/googleTrends.ts` service
- [ ] Add tRPC procedure `getTrendingTopics(geo: 'NO')`
- [ ] Add "Trending Topics" card to Dashboard
- [ ] Add content suggestions based on trends
- [ ] Write vitest tests
- [ ] Save checkpoint

### Phase 2: Agenda Job Scheduling (3-4 ساعات)
- [ ] Install `agenda` npm package
- [ ] Setup MongoDB connection for Agenda
- [ ] Create job definitions in `server/jobs/`
- [ ] Add `scheduledAt` field to posts table
- [ ] Implement auto-publishing job
- [ ] Add "Schedule for later" UI in Posts page
- [ ] Write vitest tests
- [ ] Save checkpoint

### Phase 3: NoTram Norwegian Enhancement (4-6 ساعات)
- [ ] Install `@huggingface/inference` package
- [ ] Add HUGGINGFACE_API_KEY to environment
- [ ] Create `server/notram.ts` service
- [ ] Add tRPC procedure `enhanceNorwegianContent(text)`
- [ ] Add "Improve with NoTram" button in Content Generator
- [ ] A/B testing: OpenAI vs NoTram comparison
- [ ] Write vitest tests
- [ ] Save checkpoint

### Phase 4: LinkedIn API Integration (8-12 ساعة)
- [ ] Create LinkedIn App at https://www.linkedin.com/developers/
- [ ] Add LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET
- [ ] Create `social_accounts` table in database
- [ ] Implement OAuth 2.0 flow for LinkedIn
- [ ] Create `/api/social/connect/linkedin` endpoint
- [ ] Create `/api/social/callback/linkedin` endpoint
- [ ] Add tRPC procedure `publishToLinkedIn(postId)`
- [ ] Add "Connect LinkedIn" in Settings page
- [ ] Add "Publish to LinkedIn" button in Posts page
- [ ] Write vitest tests
- [ ] Save checkpoint

### Phase 5: Postiz Code Study & Integration (مستمر)
- [ ] Clone Postiz repository locally
- [ ] Study Calendar View component
- [ ] Study Analytics Dashboard component
- [ ] Study OAuth implementation patterns
- [ ] Extract reusable components
- [ ] Adapt to Innlegg's tech stack
- [ ] Document learnings

---

## 📊 Expected Benefits

**Google Trends:**
- Smart content suggestions
- SEO optimization
- Trending topics discovery

**Agenda:**
- Auto-publishing at scheduled times
- Automated analytics refresh
- Email notifications

**NoTram:**
- Better Norwegian content quality
- Professional tone
- Grammar improvements

**LinkedIn API:**
- Direct publishing to LinkedIn
- Multi-account support
- Analytics integration

**Postiz Study:**
- Best practices
- UI/UX improvements
- Feature ideas

---

## 💰 Cost Savings: $2,843/year

All libraries are 100% free and open source!


## 📅 Custom Calendar View Feature

### Phase 1: Research & Setup
- [x] Research calendar libraries (react-big-calendar vs FullCalendar)
- [x] Choose best library for Innlegg (FullCalendar - 990kB, more features, active development)
- [x] Install calendar library and dependencies (FullCalendar 6.1.20)
- [ ] Install react-dnd for drag-and-drop (not needed - FullCalendar has built-in drag & drop)
- [ ] Install date-fns for date handling (not needed - FullCalendar handles dates)

### Phase 2: Database Schema
- [x] Add `scheduledFor` field to posts table (datetime)
- [x] Add `publishedAt` field to posts table (datetime)
- [x] Add `status` field: draft, scheduled, published, failed
- [x] Run database migration (pnpm db:push - migration 0016 applied)

### Phase 3: Calendar Component
- [x] Create Calendar page component (/kalender)
- [x] Add route to App.tsx
- [ ] Add navigation link in DashboardLayout sidebar
- [x] Implement month view with FullCalendar (not react-big-calendar)
- [x] Style calendar to match Innlegg design
- [x] Add Norwegian locale (days/months in Norwegian)

### Phase 4: Post Display
- [x] Fetch scheduled posts from database (getScheduledPosts procedure)
- [x] Display posts as events on calendar
- [ ] Color code by platform (LinkedIn blue, Twitter light blue, Facebook dark blue, Instagram gradient)
- [ ] Show post preview on hover
- [ ] Add platform icon to each event

### Phase 5: Drag & Drop
- [x] Implement drag-and-drop with FullCalendar (built-in, no react-dnd needed)
- [x] Allow dragging posts to different dates
- [x] Update `scheduledFor` in database on drop (reschedule procedure)
- [x] Add visual feedback during drag (FullCalendar built-in)
- [x] Revert on error (info.revert() on mutation failure)

### Phase 6: Post Management
- [ ] Add "Add Post" button (click on date to create)
- [ ] Open Generate dialog with pre-selected date
- [ ] Add "Edit" button on calendar events
- [ ] Add "Delete" button on calendar events
- [ ] Add "Publish Now" button for scheduled posts

### Phase 7: Filters & Views
- [ ] Add platform filter (show/hide LinkedIn, Twitter, etc.)
- [ ] Add status filter (draft, scheduled, published)
- [ ] Add month/week/day view toggle
- [ ] Add "Today" button to jump to current date
- [ ] Add search by post content

### Phase 8: Auto-Publishing (Future)
- [ ] Integrate with Agenda job scheduler
- [ ] Create background job to publish scheduled posts
- [ ] Update post status after publishing
- [ ] Send notification on successful publish
- [ ] Handle publishing errors

### Phase 9: Testing & Polish
- [ ] Write vitest tests for calendar logic
- [ ] Test drag-and-drop functionality
- [ ] Test on mobile (responsive design)
- [ ] Add loading states
- [ ] Add error handling
- [ ] Save checkpoint

---

## 🎨 Calendar Design Specs

**Colors:**
- LinkedIn: `bg-blue-500`
- Twitter/X: `bg-sky-400`
- Facebook: `bg-blue-700`
- Instagram: `bg-gradient-to-r from-purple-500 to-pink-500`

**Layout:**
- Full-width calendar
- Sidebar with filters
- Event cards with platform icon + truncated text
- Hover shows full post preview

**Interactions:**
- Click date → Create post
- Click event → View/Edit post
- Drag event → Reschedule
- Right-click → Context menu (Edit, Delete, Publish Now)


## Calendar 404 Error Fix
- [x] Check Calendar route in App.tsx (correct: /kalender)
- [x] Verify Calendar component import (correct)
- [x] Fix PageLayout dashboardPages (/calendar → /kalender)
- [x] Fix DashboardNav Kalender href (/calendar → /kalender)
- [x] Test /kalender URL (working now)


## Calendar Enhancements - Post Creation & Tooltip
- [ ] Fix Calendar view buttons (Måned/Uke/Dag/Liste) to properly switch views (KNOWN ISSUE - needs deeper debugging)
- [x] Add double-click handler on calendar dates
- [x] Create Post Creation Dialog component
- [x] Pre-fill scheduledFor with selected date
- [x] Integrate with existing content generation flow
- [x] Add Event Details Dialog component (click instead of hover for better UX)
- [x] Show post preview on click (title, content preview, platform, status)
- [x] Add Edit/Delete buttons in dialog
- [x] Test both features and save checkpoint

## Google Trends Integration
- [x] Research Google Trends API options (unofficial libraries)
- [x] Install and configure @alkalisummer/google-trends-js npm package
- [x] Create tRPC procedure to fetch daily trending topics
- [x] Create tRPC procedure to fetch interest over time for keywords
- [x] Update Trends page UI component to work with new data format
- [x] Display trending topics with search volume indicators
- [x] Add "Generate from Trend" button for each trend
- [x] Integrate trend selection with Generate page
- [x] Add trend filtering by platform
- [x] Add mock data fallback for API failures
- [x] Test Google Trends features
- [x] Save checkpoint

## LinkedIn API Integration
- [x] Research LinkedIn API v2 documentation
- [x] Add LinkedIn credentials section in Settings page (Client ID, Client Secret input fields)
- [x] Add database schema for LinkedIn app credentials (client_id, client_secret)
- [x] Add database schema for user LinkedIn connections (access_token, person_urn, expires_at)
- [x] Create linkedinService.ts with OAuth 2.0 flow
- [x] Add tRPC procedure: saveLinkedInCredentials (save app credentials)
- [x] Add tRPC procedure: getAuthorizationUrl (generate OAuth URL)
- [x] Add tRPC procedure: handleCallback (exchange code for token)
- [x] Add tRPC procedure: createPost (post to LinkedIn)
- [x] Add tRPC procedure: disconnectLinkedIn (revoke access)
- [x] Add LinkedIn callback route handler
- [x] Add "Connect LinkedIn" button in Settings
- [x] Add LinkedIn connection status display with profile info
- [x] Add Disconnect button
- [ ] Add LinkedIn status indicator in Generate page
- [ ] Test OAuth flow and posting
- [x] Add error handling for expired tokens
- [ ] Save checkpoint

## LinkedIn Generate Page Integration
- [x] Add LinkedIn connection status indicator in Generate page
- [x] Add "Post to LinkedIn" button (visible only when connected)
- [x] Add link to Settings if not connected
- [x] Implement post to LinkedIn functionality from Generate page
- [x] Test LinkedIn status display
- [x] Save checkpoint

## Agenda Auto-posting System
- [x] Design scheduled job system architecture (cron-based)
- [x] Install node-cron scheduling library
- [x] Create schedulerService.ts with background worker
- [x] Add job to check scheduled posts every minute
- [x] Implement auto-posting logic for LinkedIn
- [x] Update post status from 'scheduled' to 'published' after posting
- [x] Add error handling for failed posts (error status)
- [x] Send notification to user when post is published
- [x] Add tRPC procedure to manually trigger scheduled posts (for testing)
- [ ] Add UI indicator for auto-posting status in Calendar
- [ ] Test auto-posting with real scheduled posts
- [x] Save checkpoint

## Vipps Payment Integration (Norway)
- [x] Research Vipps API documentation and requirements
- [ ] Add Vipps credentials section in Admin Settings page
- [ ] Create database schema for Vipps credentials
- [ ] Create tRPC procedures for saving/getting Vipps credentials
- [ ] Test Vipps settings UI
- [ ] Save checkpoint
- [ ] (Future) Register Vipps merchant account when user has credentials
- [ ] (Future) Create vippsService.ts with payment flow
- [ ] (Future) Implement full Vipps Recurring API integration


## Vipps Payment Settings Integration (Admin)
- [x] Create vipps_credentials database table
- [x] Add Vipps tRPC procedures (saveCredentials, getCredentials, deleteCredentials)
- [x] Create VippsCredentialsCard component in Settings page
- [x] Add input fields for Client ID, Client Secret, Subscription Key, MSN
- [x] Add test mode toggle
- [x] Add status indicator (configured/not configured)
- [x] Add delete credentials functionality
- [x] Add setup instructions with link to Vipps Developer Portal
- [x] Write vitest tests for Vipps tRPC procedures (17 tests passing)
- [ ] Implement Vipps Recurring API integration (future)
- [ ] Create subscription checkout flow with Vipps (future)
- [ ] Add webhook handling for Vipps payment events (future)
