type StripeWebhookIdempotencyDeps = {
  hasProcessedStripeEvent: (eventId: string) => Promise<boolean>;
  markStripeEventProcessed: (eventId: string) => Promise<boolean>;
};

async function getDefaultDeps(): Promise<StripeWebhookIdempotencyDeps> {
  const { hasProcessedStripeEvent, markStripeEventProcessed } = await import("../db");
  return { hasProcessedStripeEvent, markStripeEventProcessed };
}

export async function shouldProcessStripeEvent(
  eventId: string,
  deps?: StripeWebhookIdempotencyDeps
): Promise<boolean> {
  const {
    hasProcessedStripeEvent,
    markStripeEventProcessed,
  } = deps ?? (await getDefaultDeps());

  const alreadyProcessed = await hasProcessedStripeEvent(eventId);
  if (alreadyProcessed) {
    return false;
  }

  // Reserve this event id before business logic to avoid duplicate concurrent processing.
  return markStripeEventProcessed(eventId);
}
