/**
 * Stripe Products and Prices Configuration
 * 
 * This file defines all subscription plans for Innlegg/Nexify AI
 */

export const STRIPE_PRODUCTS = {
  PRO_MONTHLY: {
    name: "Pro Månedlig",
    description: "100 AI-genererte innlegg per måned + AI-bilder",
    priceNOK: 199,
    interval: "month" as const,
    features: [
      "100 AI-genererte innlegg per måned",
      "AI-bildegenerering (DALL-E 3 + Nano Banana)",
      "Alle plattformer (LinkedIn, Twitter, Instagram, Facebook)",
      "Stemmetrening - AI lærer din skrivestil",
      "Trend og Inspirasjon - Kuraterte emner",
      "AI Content Coach",
      "Prioritert support",
    ],
  },
  PRO_YEARLY: {
    name: "Pro Årlig",
    description: "100 AI-genererte innlegg per måned + AI-bilder (spar 20%)",
    priceNOK: 1910, // 199 * 12 * 0.8 = 1910.4 rounded
    interval: "year" as const,
    features: [
      "Alt i Pro Månedlig",
      "Spar 20% sammenlignet med månedlig",
      "1200 innlegg totalt per år",
    ],
  },
};

export const TRIAL_LIMITS = {
  posts: 5,
  durationDays: 14,
};

export type ProductKey = keyof typeof STRIPE_PRODUCTS;
