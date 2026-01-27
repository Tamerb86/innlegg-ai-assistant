import { describe, it, expect, beforeEach, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

// Mock database
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn(() => ({
    where: vi.fn().mockResolvedValue(undefined),
  })),
};

// Mock imports
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

describe("Telegram Tag Management Procedures", () => {
  let appRouter: any;
  let caller: any;
  
  const mockUser = {
    id: 1,
    openId: "test-open-id",
    name: "Test User",
    email: "test@example.com",
    role: "user" as const,
  };

  const mockContext: TrpcContext = {
    user: mockUser,
  };

  const mockPost = {
    id: 1,
    userId: 1,
    platform: "linkedin" as const,
    tone: "professional",
    rawInput: "Test idea",
    generatedContent: "Test content",
    tags: ["viktig", "utkast"],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset mock chain
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.update.mockReturnThis();
    mockDb.set.mockImplementation(() => ({
      where: vi.fn().mockResolvedValue(undefined),
    }));
    
    const { appRouter: router } = await import("./routers");
    appRouter = router;
    caller = appRouter.createCaller(mockContext);
  });

  describe("addTag", () => {
    it("should not add duplicate tag", async () => {
      // Mock finding the post with existing tag
      mockDb.limit.mockResolvedValueOnce([mockPost]);

      const result = await caller.telegram.addTag({ postId: 1, tag: "viktig" });

      expect(result.success).toBe(true);
      // Update should not be called since tag already exists
      expect(mockDb.update).not.toHaveBeenCalled();
    });

    it("should throw error if post not found", async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      await expect(
        caller.telegram.addTag({ postId: 999, tag: "test" })
      ).rejects.toThrow("Post not found");
    });
  });

  describe("removeTag", () => {
    it("should throw error if post not found", async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      await expect(
        caller.telegram.removeTag({ postId: 999, tag: "test" })
      ).rejects.toThrow("Post not found");
    });
  });

  describe("getAllTags", () => {
    it("should return all unique tags", async () => {
      const mockPosts = [
        { ...mockPost, id: 1, tags: ["viktig", "utkast"] },
        { ...mockPost, id: 2, tags: ["klar", "viktig"] },
        { ...mockPost, id: 3, tags: ["haster"] },
      ];

      mockDb.where.mockResolvedValueOnce(mockPosts);

      const result = await caller.telegram.getAllTags();

      expect(result.tags).toEqual(expect.arrayContaining(["viktig", "utkast", "klar", "haster"]));
      expect(result.tags.length).toBe(4);
      expect(mockDb.select).toHaveBeenCalled();
    });

    it("should return empty array if no posts have tags", async () => {
      const mockPosts = [
        { ...mockPost, id: 1, tags: null },
        { ...mockPost, id: 2, tags: [] },
      ];

      mockDb.where.mockResolvedValueOnce(mockPosts);

      const result = await caller.telegram.getAllTags();

      expect(result.tags).toEqual([]);
    });

    it("should return sorted tags", async () => {
      const mockPosts = [
        { ...mockPost, id: 1, tags: ["zebra", "alpha", "beta"] },
      ];

      mockDb.where.mockResolvedValueOnce(mockPosts);

      const result = await caller.telegram.getAllTags();

      expect(result.tags).toEqual(["alpha", "beta", "zebra"]);
    });
  });
});
