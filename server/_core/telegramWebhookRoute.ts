/**
 * Telegram Webhook Route Registration
 * Registers the webhook endpoint with Express
 */

import type { Express } from "express";
import express from "express";
import { handleTelegramWebhook } from "../telegramWebhook";

export function registerTelegramWebhook(app: Express) {
  // Telegram webhook must use raw body for signature verification
  app.post(
    "/api/telegram/webhook",
    express.raw({ type: "application/json" }),
    handleTelegramWebhook
  );
  
  console.log("[Telegram] Webhook endpoint registered at /api/telegram/webhook");
}
