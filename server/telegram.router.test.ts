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

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{
      message: {
        content: JSON.stringify({
          alt1: "Profesjonell versjon av innlegget",
          alt2: "Personlig versjon av innlegget",
          alt3: "Kort og engasjerende versjon"
        })
      }
    }]
  }),
}));

describe("Telegram Router", () => {
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

  describe("generateLinkCode", () => {
    it("should generate a valid link code", async () => {
      mockDb.limit.mockResolvedValueOnce([]); // No existing link
      mockDb.values.mockResolvedValueOnce(undefined);

      const result = await caller.telegram.generateLinkCode();

      expect(result).toHaveProperty("linkCode");
      expect(result).toHaveProperty("expiresAt");
      expect(typeof result.linkCode).toBe("string");
      expect(result.linkCode.length).toBeGreaterThan(0);
    });
  });

  describe("getStatus", () => {
    it("should return status object", async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      const result = await caller.telegram.getStatus();

      expect(result).toHaveProperty("connected");
      expect(typeof result.connected).toBe("boolean");
    });
  });

  describe("disconnect", () => {
    it("should delete telegram link", async () => {
      mockDb.delete.mockReturnThis();
      mockDb.where.mockResolvedValueOnce(undefined);

      const result = await caller.telegram.disconnect();

      expect(result).toEqual({ success: true });
      expect(mockDb.delete).toHaveBeenCalled();
    });
  });

  describe("getRecentPosts", () => {
    it("should call getRecentPosts without errors", async () => {
      mockDb.limit.mockResolvedValueOnce([]);

      const result = await caller.telegram.getRecentPosts();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("generateAlternatives", () => {
    it("should generate 3 alternative versions of a post", async () => {
      const result = await caller.telegram.generateAlternatives({
        postId: 1,
        rawInput: "Test idea for post",
      });

      expect(result).toHaveProperty("alternatives");
      expect(result.alternatives).toHaveLength(3);
      expect(result.alternatives[0]).toContain("Profesjonell");
      expect(result.alternatives[1]).toContain("Personlig");
      expect(result.alternatives[2]).toContain("Kort");
    });

    it("should handle different raw inputs", async () => {
      const result = await caller.telegram.generateAlternatives({
        postId: 2,
        rawInput: "Another test idea",
      });

      expect(result.alternatives).toHaveLength(3);
      expect(Array.isArray(result.alternatives)).toBe(true);
    });
  });
});
