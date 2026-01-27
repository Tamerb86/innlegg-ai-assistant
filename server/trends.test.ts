import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDailyTrends, getInterestOverTime, getRelatedQueries, clearCache } from './googleTrends';

// Mock google-trends-api
vi.mock('google-trends-api', () => ({
  default: {
    dailyTrends: vi.fn(),
    interestOverTime: vi.fn(),
    relatedQueries: vi.fn(),
  },
}));

describe('Google Trends Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearCache();
  });

  describe('getDailyTrends', () => {
    it('should fetch daily trends for Norway', async () => {
      const googleTrends = await import('google-trends-api');
      const mockData = JSON.stringify({
        default: {
          trendingSearchesDays: [{
            trendingSearches: [{
              title: { query: 'Test Trend' },
              formattedTraffic: '100K+',
            }],
          }],
        },
      });
      
      vi.mocked(googleTrends.default.dailyTrends).mockResolvedValue(mockData);

      const result = await getDailyTrends('NO');
      
      expect(result).toBeDefined();
      expect(googleTrends.default.dailyTrends).toHaveBeenCalledWith({ geo: 'NO' });
    });

    it('should use cache on second call', async () => {
      const googleTrends = await import('google-trends-api');
      const mockData = JSON.stringify({
        default: {
          trendingSearchesDays: [{
            trendingSearches: [{
              title: { query: 'Test Trend' },
            }],
          }],
        },
      });
      
      vi.mocked(googleTrends.default.dailyTrends).mockResolvedValue(mockData);

      // First call
      await getDailyTrends('NO');
      // Second call (should use cache)
      await getDailyTrends('NO');
      
      // Should only call API once
      expect(googleTrends.default.dailyTrends).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      const googleTrends = await import('google-trends-api');
      vi.mocked(googleTrends.default.dailyTrends).mockRejectedValue(new Error('API Error'));

      await expect(getDailyTrends('NO')).rejects.toThrow('Failed to fetch Google Trends data');
    });
  });

  describe('getInterestOverTime', () => {
    it('should fetch interest over time for a keyword', async () => {
      const googleTrends = await import('google-trends-api');
      const mockData = JSON.stringify({
        default: {
          timelineData: [{ value: [100] }],
        },
      });
      
      vi.mocked(googleTrends.default.interestOverTime).mockResolvedValue(mockData);

      const result = await getInterestOverTime('AI', 'NO');
      
      expect(result).toBeDefined();
      expect(googleTrends.default.interestOverTime).toHaveBeenCalledWith({
        keyword: 'AI',
        geo: 'NO',
        startTime: undefined,
        endTime: undefined,
      });
    });

    it('should cache results', async () => {
      const googleTrends = await import('google-trends-api');
      const mockData = JSON.stringify({ default: { timelineData: [] } });
      
      vi.mocked(googleTrends.default.interestOverTime).mockResolvedValue(mockData);

      await getInterestOverTime('AI', 'NO');
      await getInterestOverTime('AI', 'NO');
      
      expect(googleTrends.default.interestOverTime).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRelatedQueries', () => {
    it('should fetch related queries for a keyword', async () => {
      const googleTrends = await import('google-trends-api');
      const mockData = JSON.stringify({
        default: {
          rankedList: [{
            rankedKeyword: [{ query: 'Related Query' }],
          }],
        },
      });
      
      vi.mocked(googleTrends.default.relatedQueries).mockResolvedValue(mockData);

      const result = await getRelatedQueries('AI', 'NO');
      
      expect(result).toBeDefined();
      expect(googleTrends.default.relatedQueries).toHaveBeenCalledWith({
        keyword: 'AI',
        geo: 'NO',
      });
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', async () => {
      const googleTrends = await import('google-trends-api');
      const mockData = JSON.stringify({ default: { trendingSearchesDays: [] } });
      
      vi.mocked(googleTrends.default.dailyTrends).mockResolvedValue(mockData);

      // First call
      await getDailyTrends('NO');
      // Clear cache
      clearCache();
      // Second call (should hit API again)
      await getDailyTrends('NO');
      
      expect(googleTrends.default.dailyTrends).toHaveBeenCalledTimes(2);
    });
  });
});
