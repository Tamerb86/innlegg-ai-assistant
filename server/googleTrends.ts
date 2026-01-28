import GoogleTrendsApi from '@alkalisummer/google-trends-js';

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
 * Returns structured data with keyword, traffic, growth rate, etc.
 */
/**
 * Generate mock trends data for fallback
 */
function getMockTrends(geo: string): any[] {
  const norwayTrends = [
    { keyword: 'Kunstig intelligens', traffic: 50000, trafficGrowthRate: 250, activeTime: new Date(), relatedKeywords: ['AI', 'ChatGPT', 'maskinlæring'], articleKeys: [] },
    { keyword: 'Strømpriser', traffic: 35000, trafficGrowthRate: 180, activeTime: new Date(), relatedKeywords: ['energi', 'elektrisitet', 'spotpris'], articleKeys: [] },
    { keyword: 'Fotball-VM', traffic: 28000, trafficGrowthRate: 150, activeTime: new Date(), relatedKeywords: ['fotball', 'landslaget', 'VM'], articleKeys: [] },
    { keyword: 'Kryptovaluta', traffic: 22000, trafficGrowthRate: 120, activeTime: new Date(), relatedKeywords: ['bitcoin', 'ethereum', 'blockchain'], articleKeys: [] },
    { keyword: 'Klimaendringer', traffic: 18000, trafficGrowthRate: 95, activeTime: new Date(), relatedKeywords: ['miljø', 'bærekraft', 'grønn energi'], articleKeys: [] },
  ];
  
  const globalTrends = [
    { keyword: 'Artificial Intelligence', traffic: 500000, trafficGrowthRate: 300, activeTime: new Date(), relatedKeywords: ['AI', 'ChatGPT', 'machine learning'], articleKeys: [] },
    { keyword: 'Climate Change', traffic: 350000, trafficGrowthRate: 200, activeTime: new Date(), relatedKeywords: ['environment', 'sustainability', 'green energy'], articleKeys: [] },
    { keyword: 'Cryptocurrency', traffic: 280000, trafficGrowthRate: 175, activeTime: new Date(), relatedKeywords: ['bitcoin', 'ethereum', 'blockchain'], articleKeys: [] },
    { keyword: 'Remote Work', traffic: 220000, trafficGrowthRate: 140, activeTime: new Date(), relatedKeywords: ['work from home', 'digital nomad', 'hybrid work'], articleKeys: [] },
    { keyword: 'Electric Vehicles', traffic: 180000, trafficGrowthRate: 110, activeTime: new Date(), relatedKeywords: ['Tesla', 'EV', 'sustainable transport'], articleKeys: [] },
  ];
  
  return geo === 'NO' ? norwayTrends : globalTrends;
}

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
    const result = await GoogleTrendsApi.dailyTrends({
      geo,
      hl: geo === 'NO' ? 'no' : 'en',
    });
    
    if (result.error) {
      console.warn('[GoogleTrends] API returned error, using mock data:', result.error.message);
      return getMockTrends(geo);
    }
    
    // Transform data to a more usable format
    const trends = result.data?.map((trend: any) => ({
      keyword: trend.keyword,
      traffic: trend.traffic,
      trafficGrowthRate: trend.trafficGrowthRate,
      activeTime: trend.activeTime ? new Date(trend.activeTime) : null,
      relatedKeywords: trend.relatedKeywords || [],
      articleKeys: trend.articleKeys || [],
    })) || [];
    
    if (trends.length === 0) {
      console.warn('[GoogleTrends] No trends returned, using mock data');
      return getMockTrends(geo);
    }
    
    saveToCache(cacheKey, trends);
    
    return trends;
  } catch (error) {
    console.error('[GoogleTrends] Error fetching daily trends:', error);
    console.log('[GoogleTrends] Falling back to mock data');
    return getMockTrends(geo);
  }
}

/**
 * Fetch interest over time for specific keywords
 * Returns time-series data showing search interest
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
    
    // Calculate period string
    let period = 'now 7-d'; // Default: last 7 days
    if (startTime && endTime) {
      const diffDays = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) {
        period = 'now 1-d';
      } else if (diffDays <= 7) {
        period = 'now 7-d';
      } else if (diffDays <= 30) {
        period = 'today 1-m';
      } else if (diffDays <= 90) {
        period = 'today 3-m';
      } else if (diffDays <= 365) {
        period = 'today 12-m';
      } else {
        period = 'today 5-y';
      }
    }
    
    const result = await GoogleTrendsApi.interestOverTime({
      keyword,
      geo,
      period: period as any, // Type assertion to fix compatibility
      hl: geo === 'NO' ? 'no-NO' : 'en-US',
    });
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch interest data');
    }
    
    saveToCache(cacheKey, result.data);
    
    return result.data;
  } catch (error) {
    console.error('[GoogleTrends] Error fetching interest over time:', error);
    throw new Error('Failed to fetch interest data');
  }
}

/**
 * Fetch related queries for a keyword
 * Note: The new library doesn't have relatedQueries method,
 * so we'll use relatedKeywords from dailyTrends instead
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
    
    // Get daily trends and find matching keyword
    const trends = await getDailyTrends(geo);
    const matchingTrend = trends.find((t: any) => 
      t.keyword.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const relatedKeywords = matchingTrend?.relatedKeywords || [];
    
    saveToCache(cacheKey, relatedKeywords);
    
    return relatedKeywords;
  } catch (error) {
    console.error('[GoogleTrends] Error fetching related queries:', error);
    throw new Error('Failed to fetch related queries');
  }
}

/**
 * Fetch trending articles for specific article keys
 */
export async function getTrendingArticles(
  articleKeys: Array<[number, string, string]>,
  articleCount: number = 5
): Promise<any> {
  const cacheKey = `trending-articles-${JSON.stringify(articleKeys)}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    console.log(`[GoogleTrends] Returning cached trending articles`);
    return cached;
  }
  
  try {
    console.log(`[GoogleTrends] Fetching trending articles...`);
    const result = await GoogleTrendsApi.trendingArticles({
      articleKeys,
      articleCount,
    });
    
    if (result.error) {
      throw new Error(result.error.message || 'Failed to fetch articles');
    }
    
    saveToCache(cacheKey, result.data);
    
    return result.data;
  } catch (error) {
    console.error('[GoogleTrends] Error fetching trending articles:', error);
    throw new Error('Failed to fetch trending articles');
  }
}

/**
 * Clear all cache (useful for testing or manual refresh)
 */
export function clearCache(): void {
  cache.clear();
  console.log('[GoogleTrends] Cache cleared');
}
