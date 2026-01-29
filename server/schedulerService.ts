import * as cron from 'node-cron';
import { getDb } from './db';
import { posts } from '../drizzle/schema';
import { eq, and, lte } from 'drizzle-orm';
import { createLinkedInPost } from './linkedinService';
import { getDb as getDatabase } from './db';
import { notifyOwner } from './_core/notification';

/**
 * Scheduler Service for Auto-posting
 * 
 * Checks for scheduled posts every minute and publishes them automatically
 * when their scheduledFor time has passed.
 */

let schedulerTask: cron.ScheduledTask | null = null;

/**
 * Process scheduled posts that are due for publishing
 */
async function processScheduledPosts() {
  try {
    const db = await getDatabase();
    if (!db) {
      console.warn('[Scheduler] Database not available');
      return;
    }

    const now = new Date();
    
    // Find all posts that are scheduled and due for publishing
    const duePosts = await db
      .select()
      .from(posts)
      .where(
        and(
          eq(posts.status, 'scheduled'),
          lte(posts.scheduledFor, now)
        )
      )
      .limit(10); // Process max 10 posts at a time

    if (duePosts.length === 0) {
      return; // No posts to process
    }

    console.log(`[Scheduler] Found ${duePosts.length} posts to publish`);

    for (const post of duePosts) {
      try {
        // Only auto-post to LinkedIn for now
        if (post.platform === 'linkedin') {
          // Get user's LinkedIn connection from database
          const { linkedinConnections } = await import('../drizzle/schema');
          const connection = await db
            .select()
            .from(linkedinConnections)
            .where(eq(linkedinConnections.userId, post.userId))
            .limit(1);

          if (!connection[0]) {
            throw new Error('LinkedIn not connected');
          }

          // Post to LinkedIn
          await createLinkedInPost(
            connection[0].accessToken,
            connection[0].personUrn,
            post.generatedContent
          );
          
          // Update post status to published
          await db
            .update(posts)
            .set({
              status: 'published',
              publishedAt: new Date(),
            })
            .where(eq(posts.id, post.id));

          console.log(`[Scheduler] Successfully published post ${post.id} to LinkedIn`);

          // Notify owner
          await notifyOwner({
            title: 'Innlegg publisert',
            content: `Innlegget ble automatisk publisert til LinkedIn.`,
          });
        } else {
          console.log(`[Scheduler] Skipping post ${post.id} - platform ${post.platform} not supported for auto-posting yet`);
        }
      } catch (error) {
        console.error(`[Scheduler] Failed to publish post ${post.id}:`, error);
        
        // Update post status to failed
        await db
          .update(posts)
          .set({
            status: 'failed',
          })
          .where(eq(posts.id, post.id));

        // Notify owner about failure
        await notifyOwner({
          title: 'Publisering feilet',
          content: `Kunne ikke publisere innlegget til ${post.platform}. Vennligst sjekk innstillingene.`,
        });
      }
    }
  } catch (error) {
    console.error('[Scheduler] Error processing scheduled posts:', error);
  }
}

/**
 * Start the scheduler
 * Runs every minute to check for due posts
 */
export function startScheduler() {
  if (schedulerTask) {
    console.log('[Scheduler] Already running');
    return;
  }

  // Run every minute: '* * * * *'
  schedulerTask = cron.schedule('* * * * *', async () => {
    console.log('[Scheduler] Checking for scheduled posts...');
    await processScheduledPosts();
  });

  console.log('[Scheduler] Started - checking for scheduled posts every minute');
}

/**
 * Stop the scheduler
 */
export function stopScheduler() {
  if (schedulerTask) {
    schedulerTask.stop();
    schedulerTask = null;
    console.log('[Scheduler] Stopped');
  }
}

/**
 * Manually trigger scheduled posts processing (for testing)
 */
export async function triggerScheduledPosts() {
  console.log('[Scheduler] Manually triggered');
  await processScheduledPosts();
}
