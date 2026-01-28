import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { getDb } from "./db";
import { posts } from "../drizzle/schema";

describe("Dashboard Activity Data", () => {
  let testUserId: number;
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
    if (!db) throw new Error("Database not available");
    
    // Create test user
    testUserId = 999999;
  });

  it("should return activity data for last 7 days", async () => {
    const caller = appRouter.createCaller({
      user: { id: testUserId, openId: "test-open-id", name: "Test User", email: "test@example.com", role: "user" },
      req: {} as any,
      res: {} as any,
    });

    const activityData = await caller.content.getActivityData();

    expect(activityData).toBeDefined();
    expect(Array.isArray(activityData)).toBe(true);
    expect(activityData.length).toBe(7); // Should return 7 days
    
    // Check structure
    activityData.forEach(day => {
      expect(day).toHaveProperty("day");
      expect(day).toHaveProperty("posts");
      expect(typeof day.day).toBe("string");
      expect(typeof day.posts).toBe("number");
    });
  });

  it("should return 0 posts for days with no activity", async () => {
    const caller = appRouter.createCaller({
      user: { id: testUserId, openId: "test-open-id", name: "Test User", email: "test@example.com", role: "user" },
      req: {} as any,
      res: {} as any,
    });

    const activityData = await caller.content.getActivityData();

    // For a new user, all days should have 0 posts
    const allZero = activityData.every(day => day.posts === 0);
    expect(allZero).toBe(true);
  });

  it("should count posts correctly when posts exist", async () => {
    if (!db) throw new Error("Database not available");

    // Insert test posts for today
    const today = new Date();
    await db.insert(posts).values([
      {
        userId: testUserId,
        platform: "linkedin",
        tone: "professional",
        rawInput: "Test post 1",
        generatedContent: "Generated content 1",
        createdAt: today,
      },
      {
        userId: testUserId,
        platform: "twitter",
        tone: "casual",
        rawInput: "Test post 2",
        generatedContent: "Generated content 2",
        createdAt: today,
      },
    ]);

    const caller = appRouter.createCaller({
      user: { id: testUserId, openId: "test-open-id", name: "Test User", email: "test@example.com", role: "user" },
      req: {} as any,
      res: {} as any,
    });

    const activityData = await caller.content.getActivityData();

    // Find today's data
    const dayNames = ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør'];
    const todayName = dayNames[today.getDay()];
    const todayData = activityData.find(day => day.day === todayName);

    expect(todayData).toBeDefined();
    expect(todayData!.posts).toBeGreaterThanOrEqual(2);

    // Cleanup
    const { eq } = await import("drizzle-orm");
    await db.delete(posts).where(eq(posts.userId, testUserId));
  });

  it("should only return data for the authenticated user", async () => {
    if (!db) throw new Error("Database not available");

    const otherUserId = 888888;

    // Insert posts for another user
    await db.insert(posts).values({
      userId: otherUserId,
      platform: "linkedin",
      tone: "professional",
      rawInput: "Other user post",
      generatedContent: "Other user content",
      createdAt: new Date(),
    });

    const caller = appRouter.createCaller({
      user: { id: testUserId, openId: "test-open-id", name: "Test User", email: "test@example.com", role: "user" },
      req: {} as any,
      res: {} as any,
    });

    const activityData = await caller.content.getActivityData();

    // Should only count testUserId's posts (which we cleaned up earlier)
    const allZero = activityData.every(day => day.posts === 0);
    expect(allZero).toBe(true);

    // Cleanup
    const { eq } = await import("drizzle-orm");
    await db.delete(posts).where(eq(posts.userId, otherUserId));
  });
});
