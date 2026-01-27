import { describe, it, expect, beforeEach, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

// Mock database
const mockDb = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
};

// Mock imports
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(mockDb),
}));

describe("Telegram Action Procedures", () => {
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

  beforeEach(async () => {
    vi.clearAllMocks();
    // Reset mock chain
    mockDb.select.mockReturnThis();
    mockDb.from.mockReturnThis();
    mockDb.where.mockReturnThis();
    mockDb.orderBy.mockReturnThis();
    mockDb.limit.mockReturnThis();
    mockDb.insert.mockReturnThis();
    mockDb.values.mockReturnThis();
    mockDb.update.mockReturnThis();
    mockDb.set.mockReturnThis();
    mockDb.delete.mockReturnThis();
    
    const { appRouter: router } = await import("./routers");
    appRouter = router;
    caller = appRouter.createCaller(mockContext);
  });

  describe("savePost", () => {
    it("should return success when saving a post", async () => {
      const result = await caller.telegram.savePost({ postId: 1 });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("message");
    });
  });

  describe("deletePost", () => {
    it("should delete a post successfully", async () => {
      mockDb.where.mockResolvedValueOnce(undefined);

      const result = await caller.telegram.deletePost({ postId: 1 });

      expect(result.success).toBe(true);
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe("moveToIdeaBank", () => {
    it("should move idea to idea bank and delete post", async () => {
      mockDb.values.mockResolvedValueOnce(undefined);
      mockDb.where.mockResolvedValueOnce(undefined);

      const result = await caller.telegram.moveToIdeaBank({
        postId: 1,
        rawInput: "Test idea",
      });

      expect(result.success).toBe(true);
      expect(mockDb.insert).toHaveBeenCalled();
      expect(mockDb.delete).toHaveBeenCalled();
    });

    it("should handle different raw inputs", async () => {
      mockDb.values.mockResolvedValueOnce(undefined);
      mockDb.where.mockResolvedValueOnce(undefined);

      const result = await caller.telegram.moveToIdeaBank({
        postId: 2,
        rawInput: "Another test idea with longer text",
      });

      expect(result.success).toBe(true);
    });
  });
});
