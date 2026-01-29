import type { Express } from "express";

/**
 * Register LinkedIn OAuth callback route
 */
export function registerLinkedInCallback(app: Express) {
  app.get("/api/linkedin/callback", async (req, res) => {
    try {
      const { code, state, error, error_description } = req.query;

      // Handle OAuth errors
      if (error) {
        console.error(`[LinkedIn OAuth] Error: ${error} - ${error_description}`);
        return res.redirect(`/?linkedin_error=${encodeURIComponent(error_description as string || error as string)}`);
      }

      if (!code || !state) {
        console.error("[LinkedIn OAuth] Missing code or state parameter");
        return res.redirect("/?linkedin_error=missing_parameters");
      }

      // Extract user ID from state (format: user_{id}_{timestamp})
      const stateMatch = (state as string).match(/^user_(\d+)_\d+$/);
      if (!stateMatch) {
        console.error("[LinkedIn OAuth] Invalid state format");
        return res.redirect("/?linkedin_error=invalid_state");
      }

      const userId = parseInt(stateMatch[1]);

      // Get app credentials
      const { getDb } = await import("../db");
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { linkedinAppCredentials, linkedinConnections } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");

      const credentials = await db.select().from(linkedinAppCredentials).limit(1);
      if (credentials.length === 0) {
        console.error("[LinkedIn OAuth] No credentials configured");
        return res.redirect("/?linkedin_error=no_credentials");
      }

      // Exchange code for token
      const { exchangeCodeForToken, getLinkedInProfile, calculateExpirationDate } = await import("../linkedinService");
      const redirectUri = `${req.protocol}://${req.get("host")}/api/linkedin/callback`;

      const tokenResponse = await exchangeCodeForToken(
        {
          clientId: credentials[0].clientId,
          clientSecret: credentials[0].clientSecret,
        },
        code as string,
        redirectUri
      );

      // Get user profile
      const profile = await getLinkedInProfile(tokenResponse.access_token);

      // Save connection to database
      const expiresAt = calculateExpirationDate(tokenResponse.expires_in);

      const existingConnection = await db.select()
        .from(linkedinConnections)
        .where(eq(linkedinConnections.userId, userId))
        .limit(1);

      if (existingConnection.length > 0) {
        // Update existing connection
        await db.update(linkedinConnections)
          .set({
            accessToken: tokenResponse.access_token,
            personUrn: profile.sub,
            profileName: profile.name,
            profileEmail: profile.email,
            expiresAt,
          })
          .where(eq(linkedinConnections.userId, userId));
      } else {
        // Insert new connection
        await db.insert(linkedinConnections).values({
          userId,
          accessToken: tokenResponse.access_token,
          personUrn: profile.sub,
          profileName: profile.name,
          profileEmail: profile.email,
          expiresAt,
        });
      }

      console.log(`[LinkedIn OAuth] Successfully connected user ${userId} to LinkedIn`);

      // Redirect to settings page with success message
      return res.redirect("/innstillinger?linkedin_success=true");
    } catch (error: any) {
      console.error("[LinkedIn OAuth] Callback error:", error);
      return res.redirect(`/?linkedin_error=${encodeURIComponent(error.message || "unknown_error")}`);
    }
  });
}
