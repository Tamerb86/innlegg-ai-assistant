// @ts-ignore - no types available for google-trends-api
import googleTrends from 'google-trends-api';

// Simple in-memory cache
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache: Map<string, CacheEntry> = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get data from cache if available and not expired
 */
function getFromCache(key: string): any | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  const now = Date.now();
  if (now - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

/**
 * Save data to cache
 */
function saveToCache(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

/**
 * Fetch daily trends from Google Trends for a specific country
 */
export async function getDailyTrends(geo: string = 'NO'): Promise<any> {
  const cacheKey = `daily-trends-${geo}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[GoogleTrends] Returning cached daily trends for ${geo}`);
    return cached;
  }
  
  try {
    console.log(`[GoogleTrends] Fetching daily trends for ${geo}...`);
    const results = await googleTrends.dailyTrends({
      geo,
    });
    
    const parsed = JSON.parse(results);
    saveToCache(cacheKey, parsed);
    
    return parsed;
  } catch (error) {
    console.error('[GoogleTrends] Error fetching daily trends:', error);
    throw new Error('Failed to fetch Google Trends data');
  }
}

/**
 * Fetch interest over time for specific keywords
 */
export async function getInterestOverTime(
  keyword: string,
  geo: string = 'NO',
  startTime?: Date,
  endTime?: Date
): Promise<any> {
  const cacheKey = `interest-${keyword}-${geo}-${startTime?.getTime()}-${endTime?.getTime()}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[GoogleTrends] Returning cached interest for "${keyword}" in ${geo}`);
    return cached;
  }
  
  try {
    console.log(`[GoogleTrends] Fetching interest over time for "${keyword}" in ${geo}...`);
    const results = await googleTrends.interestOverTime({
      keyword,
      geo,
      startTime,
      endTime,
    });
    
    const parsed = JSON.parse(results);
    saveToCache(cacheKey, parsed);
    
    return parsed;
  } catch (error) {
    console.error('[GoogleTrends] Error fetching interest over time:', error);
    throw new Error('Failed to fetch interest data');
  }
}

/**
 * Fetch related queries for a keyword
 */
export async function getRelatedQueries(
  keyword: string,
  geo: string = 'NO'
): Promise<any> {
  const cacheKey = `related-queries-${keyword}-${geo}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[GoogleTrends] Returning cached related queries for "${keyword}" in ${geo}`);
    return cached;
  }
  
  try {
    console.log(`[GoogleTrends] Fetching related queries for "${keyword}" in ${geo}...`);
    const results = await googleTrends.relatedQueries({
      keyword,
      geo,
    });
    
    const parsed = JSON.parse(results);
    saveToCache(cacheKey, parsed);
    
    return parsed;
  } catch (error) {
    console.error('[GoogleTrends] Error fetching related queries:', error);
    throw new Error('Failed to fetch related queries');
  }
}

/**
 * Clear all cache (useful for testing or manual refresh)
 */
export function clearCache(): void {
  cache.clear();
  console.log('[GoogleTrends] Cache cleared');
}
