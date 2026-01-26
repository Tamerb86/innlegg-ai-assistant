import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin-openid",
    email: "admin@test.com",
    name: "Test Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "test-user-openid",
    email: "user@test.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("Blog Image Upload", () => {
  it("should upload image successfully with valid admin user", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    // Create a small test image in base64 (1x1 red pixel PNG)
    const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";
    
    const result = await caller.blog.uploadImage({
      fileName: "test-image.png",
      fileData: `data:image/png;base64,${testImageBase64}`,
      contentType: "image/png",
    });

    expect(result).toBeDefined();
    expect(result.url).toBeDefined();
    expect(result.fileKey).toBeDefined();
    expect(result.url).toContain("https://");
    expect(result.fileKey).toContain("blog-images/");
    expect(result.fileKey).toContain("test-image.png");
  });

  it("should fail when non-admin user tries to upload", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.blog.uploadImage({
        fileName: "test-image.png",
        fileData: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
        contentType: "image/png",
      })
    ).rejects.toThrow("Unauthorized: Admin access required");
  });

  it("should handle base64 data with or without prefix", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";
    
    // Test with prefix
    const resultWithPrefix = await caller.blog.uploadImage({
      fileName: "test-with-prefix.png",
      fileData: `data:image/png;base64,${testImageBase64}`,
      contentType: "image/png",
    });

    expect(resultWithPrefix.url).toBeDefined();
    expect(resultWithPrefix.fileKey).toContain("test-with-prefix.png");

    // Test without prefix
    const resultWithoutPrefix = await caller.blog.uploadImage({
      fileName: "test-without-prefix.png",
      fileData: testImageBase64,
      contentType: "image/png",
    });

    expect(resultWithoutPrefix.url).toBeDefined();
    expect(resultWithoutPrefix.fileKey).toContain("test-without-prefix.png");
  });

  it("should generate unique file keys for same filename", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";
    
    const result1 = await caller.blog.uploadImage({
      fileName: "duplicate.png",
      fileData: testImageBase64,
      contentType: "image/png",
    });

    // Wait a bit to ensure different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));

    const result2 = await caller.blog.uploadImage({
      fileName: "duplicate.png",
      fileData: testImageBase64,
      contentType: "image/png",
    });

    expect(result1.fileKey).not.toBe(result2.fileKey);
    expect(result1.url).not.toBe(result2.url);
  });

  it("should accept different image formats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    
    const testImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";
    
    // Test PNG
    const pngResult = await caller.blog.uploadImage({
      fileName: "test.png",
      fileData: testImageBase64,
      contentType: "image/png",
    });
    expect(pngResult.url).toBeDefined();

    // Test JPEG
    const jpegResult = await caller.blog.uploadImage({
      fileName: "test.jpg",
      fileData: testImageBase64,
      contentType: "image/jpeg",
    });
    expect(jpegResult.url).toBeDefined();

    // Test WebP
    const webpResult = await caller.blog.uploadImage({
      fileName: "test.webp",
      fileData: testImageBase64,
      contentType: "image/webp",
    });
    expect(webpResult.url).toBeDefined();
  });
});
