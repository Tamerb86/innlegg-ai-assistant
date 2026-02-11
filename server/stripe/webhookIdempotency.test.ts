import { describe, expect, it, vi } from "vitest";

import { shouldProcessStripeEvent } from "./webhookIdempotency";

describe("Stripe webhook idempotency", () => {
  it("first delivery processes event", async () => {
    const deps = {
      hasProcessedStripeEvent: vi.fn().mockResolvedValue(false),
      markStripeEventProcessed: vi.fn().mockResolvedValue(true),
    };

    const shouldProcess = await shouldProcessStripeEvent("evt_1", deps);

    expect(shouldProcess).toBe(true);
    expect(deps.hasProcessedStripeEvent).toHaveBeenCalledWith("evt_1");
    expect(deps.markStripeEventProcessed).toHaveBeenCalledWith("evt_1");
  });

  it("second delivery skips processing", async () => {
    const deps = {
      hasProcessedStripeEvent: vi.fn().mockResolvedValue(true),
      markStripeEventProcessed: vi.fn().mockResolvedValue(true),
    };

    const shouldProcess = await shouldProcessStripeEvent("evt_1", deps);

    expect(shouldProcess).toBe(false);
    expect(deps.hasProcessedStripeEvent).toHaveBeenCalledWith("evt_1");
    expect(deps.markStripeEventProcessed).not.toHaveBeenCalled();
  });
});
