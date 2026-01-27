import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  
  // Security headers with helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://fonts.googleapis.com", "https://*.manus.im"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://*.manus.im", "https://api.stripe.com", "wss:"],
        frameSrc: ["'self'", "https://js.stripe.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }));
  
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Stripe webhook - MUST be before express.json() middleware for signature verification
  // Note: We need raw body for Stripe signature verification
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
      const { constructWebhookEvent } = await import("../stripe/stripeService");
      const { updateSubscriptionFromStripe, updateSubscriptionStatus } = await import("../db");
      const { notifyNewSubscription, notifySubscriptionCancelled, notifyPaymentFailed } = await import("../subscriptionNotifications");
      
      const signature = req.headers["stripe-signature"] as string;
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
      
      if (!signature || !webhookSecret) {
        console.error("[Stripe Webhook] Missing signature or webhook secret");
        return res.status(400).json({ error: "Missing signature or webhook secret" });
      }
      
      const event = constructWebhookEvent(req.body, signature, webhookSecret);
      
      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);
      
      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }
      
      // Handle different event types
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as any;
          const userId = parseInt(session.metadata?.user_id || session.client_reference_id);
          
          if (userId) {
            await updateSubscriptionFromStripe(userId, {
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
              status: "active",
            });
            console.log(`[Stripe Webhook] Subscription activated for user ${userId}`);
            
            // Send notification to owner
            const productKey = session.metadata?.product_key || "PRO_MONTHLY";
            const planName = productKey === "PRO_YEARLY" ? "Pro Årlig" : "Pro Månedlig";
            const amount = productKey === "PRO_YEARLY" ? "1910" : "199";
            
            await notifyNewSubscription({
              userName: session.metadata?.customer_name || "Ukjent",
              userEmail: session.metadata?.customer_email || session.customer_email || "Ukjent",
              planName,
              amount,
              currency: "NOK",
            });
          }
          break;
        }
        
        case "customer.subscription.updated": {
          const subscription = event.data.object as any;
          const customerId = subscription.customer;
          
          // Update subscription status based on Stripe status
          if (subscription.status === "active") {
            // Subscription is active
          } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
            // Handle cancellation
          }
          break;
        }
        
        case "customer.subscription.deleted": {
          const subscription = event.data.object as any;
          console.log(`[Stripe Webhook] Subscription deleted: ${subscription.id}`);
          break;
        }
        
        case "invoice.paid": {
          const invoice = event.data.object as any;
          console.log(`[Stripe Webhook] Invoice paid: ${invoice.id}`);
          break;
        }
        
        case "invoice.payment_failed": {
          const invoice = event.data.object as any;
          console.log(`[Stripe Webhook] Invoice payment failed: ${invoice.id}`);
          
          // Notify owner about failed payment
          await notifyPaymentFailed({
            userName: invoice.customer_name || "Ukjent",
            userEmail: invoice.customer_email || "Ukjent",
            errorMessage: invoice.last_finalization_error?.message,
          });
          break;
        }
        
        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }
      
      res.json({ received: true });
    } catch (error: any) {
      console.error("[Stripe Webhook] Error:", error.message);
      res.status(400).json({ error: error.message });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
