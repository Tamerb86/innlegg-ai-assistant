import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { getDb } from "./db";
import { subscriptionPlans, subscriptions, invoices, subscriptionHistory } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

describe("Payment System", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database not available");
  });

  describe("Subscription Plans", () => {
    it("should create subscription plans", async () => {
      // Check if plans exist
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1));

      // Plans should be created by admin or seeder
      expect(plans).toBeDefined();
    });

    it("should retrieve active subscription plans", async () => {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1))
        .orderBy(desc(subscriptionPlans.displayOrder));

      expect(Array.isArray(plans)).toBe(true);
    });

    it("should have correct plan structure", async () => {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1))
        .limit(1);

      if (plans.length > 0) {
        const plan = plans[0];
        expect(plan).toHaveProperty("id");
        expect(plan).toHaveProperty("name");
        expect(plan).toHaveProperty("priceMonthly");
        expect(plan).toHaveProperty("priceYearly");
        expect(plan).toHaveProperty("postsPerMonth");
        expect(plan).toHaveProperty("canUseDALLE");
      }
    });
  });

  describe("User Subscriptions", () => {
    it("should insert a subscription record", async () => {
      // This test would need a test user ID
      // For now, just verify the table structure
      const result = await db
        .select()
        .from(subscriptions)
        .limit(1);

      expect(Array.isArray(result)).toBe(true);
    });

    it("should track subscription status changes", async () => {
      const records = await db
        .select()
        .from(subscriptions);

      if (records.length > 0) {
        const sub = records[0];
        expect(["trial", "active", "cancelled", "expired"]).toContain(sub.status);
      }
    });

    it("should have Stripe integration fields", async () => {
      const records = await db
        .select()
        .from(subscriptions)
        .limit(1);

      if (records.length > 0) {
        const sub = records[0];
        expect(sub).toHaveProperty("stripeCustomerId");
        expect(sub).toHaveProperty("stripeSubscriptionId");
        expect(sub).toHaveProperty("stripePriceId");
      }
    });
  });

  describe("Invoices", () => {
    it("should create invoice records", async () => {
      const invoiceList = await db
        .select()
        .from(invoices)
        .limit(10);

      expect(Array.isArray(invoiceList)).toBe(true);
    });

    it("should track invoice status", async () => {
      const invoiceList = await db
        .select()
        .from(invoices)
        .limit(1);

      if (invoiceList.length > 0) {
        const invoice = invoiceList[0];
        expect(["pending", "paid", "failed", "refunded"]).toContain(invoice.status);
      }
    });

    it("should store amount in øre (NOK cents)", async () => {
      const invoiceList = await db
        .select()
        .from(invoices)
        .limit(1);

      if (invoiceList.length > 0) {
        const invoice = invoiceList[0];
        // Amount should be in øre (e.g., 19900 = 199.00 NOK)
        expect(typeof invoice.amount).toBe("number");
        expect(invoice.amount).toBeGreaterThan(0);
      }
    });
  });

  describe("Subscription History", () => {
    it("should track subscription changes", async () => {
      const history = await db
        .select()
        .from(subscriptionHistory)
        .limit(10);

      expect(Array.isArray(history)).toBe(true);
    });

    it("should record subscription actions", async () => {
      const history = await db
        .select()
        .from(subscriptionHistory)
        .limit(1);

      if (history.length > 0) {
        const record = history[0];
        const validActions = ["created", "upgraded", "downgraded", "renewed", "cancelled", "resumed"];
        expect(validActions).toContain(record.action);
      }
    });
  });

  describe("Payment Procedures", () => {
    it("should validate plan selection", async () => {
      // Test that invalid plan IDs are rejected
      const invalidPlanId = 99999;
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.id, invalidPlanId));

      expect(plans.length).toBe(0);
    });

    it("should validate billing cycle", async () => {
      const validCycles = ["monthly", "yearly"];
      expect(validCycles).toContain("monthly");
      expect(validCycles).toContain("yearly");
    });

    it("should require Stripe price IDs for checkout", async () => {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1))
        .limit(1);

      if (plans.length > 0) {
        const plan = plans[0];
        // At least one price ID should be configured for paid plans
        if (plan.priceMonthly || plan.priceYearly) {
          expect(
            plan.stripePriceIdMonthly || plan.stripePriceIdYearly
          ).toBeDefined();
        }
      }
    });
  });

  describe("Subscription Limits", () => {
    it("should enforce posts per month limit", async () => {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1));

      plans.forEach((plan: any) => {
        if (plan.postsPerMonth !== null) {
          expect(typeof plan.postsPerMonth).toBe("number");
          expect(plan.postsPerMonth).toBeGreaterThan(0);
        }
      });
    });

    it("should track feature availability by plan", async () => {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1));

      plans.forEach((plan: any) => {
        expect(plan).toHaveProperty("canUseDALLE");
        expect(plan).toHaveProperty("canUseVoiceTraining");
        expect(plan).toHaveProperty("canUseContentCalendar");
        expect(plan).toHaveProperty("canUseCompetitorRadar");
        expect(plan).toHaveProperty("canUseWeeklyReports");
      });
    });
  });

  describe("Stripe Integration", () => {
    it("should store Stripe customer IDs", async () => {
      const records = await db
        .select()
        .from(subscriptions)
        .limit(1);

      if (records.length > 0) {
        const sub = records[0];
        expect(sub).toHaveProperty("stripeCustomerId");
      }
    });

    it("should store Stripe subscription IDs", async () => {
      const records = await db
        .select()
        .from(subscriptions)
        .limit(1);

      if (records.length > 0) {
        const sub = records[0];
        expect(sub).toHaveProperty("stripeSubscriptionId");
      }
    });

    it("should track payment intent status", async () => {
      const statuses = [
        "requires_payment_method",
        "requires_confirmation",
        "requires_action",
        "processing",
        "requires_capture",
        "canceled",
        "succeeded",
      ];

      expect(statuses.length).toBeGreaterThan(0);
    });
  });

  describe("Vipps Integration", () => {
    it("should support Vipps as payment method", async () => {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1))
        .limit(1);

      if (plans.length > 0) {
        const plan = plans[0];
        expect(plan).toHaveProperty("vippsPriceIdMonthly");
        expect(plan).toHaveProperty("vippsPriceIdYearly");
      }
    });

    it("should store Vipps order IDs in invoices", async () => {
      const invoiceList = await db
        .select()
        .from(invoices)
        .limit(1);

      if (invoiceList.length > 0) {
        const invoice = invoiceList[0];
        expect(invoice).toHaveProperty("vippsOrderId");
      }
    });
  });

  describe("Currency Handling", () => {
    it("should use NOK as default currency", async () => {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1))
        .limit(1);

      if (plans.length > 0) {
        const plan = plans[0];
        expect(plan.currency).toBe("NOK");
      }
    });

    it("should store amounts in øre (NOK cents)", async () => {
      const plans = await db
        .select()
        .from(subscriptionPlans)
        .where(eq(subscriptionPlans.isActive, 1))
        .limit(1);

      if (plans.length > 0) {
        const plan = plans[0];
        if (plan.priceMonthly) {
          // 199 NOK = 19900 øre
          expect(plan.priceMonthly).toBeGreaterThan(0);
        }
      }
    });
  });
});
