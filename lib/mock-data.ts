import type {
  BrandHealthData,
  BrandSentimentData,
  MentionsTrendData,
  ShareOfVoiceData,
  TopTopicsData,
  NPSScoreData,
  CompetitorComparisonData,
  AlertsFeedData,
  WidgetDataResponse,
  WidgetMeta,
} from "@/types/dashboard";
import { subDays, format } from "date-fns";

/**
 * Generate mock widget meta
 */
function generateMeta(widgetId: string): WidgetMeta {
  return {
    source: "mock_data",
    lastUpdated: new Date().toISOString(),
    nextUpdate: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  };
}

/**
 * Generate time series data
 */
function generateTimeSeries(days: number, min = 50, max = 150) {
  return Array.from({ length: days }, (_, i) => ({
    date: format(subDays(new Date(), days - i - 1), "yyyy-MM-dd"),
    value: Math.floor(Math.random() * (max - min) + min),
  }));
}

/**
 * Mock Brand Health Heart Data
 */
export function mockBrandHealthData(
  widgetId: string
): WidgetDataResponse<BrandHealthData> {
  const score = 78; // 0-100
  const status = score >= 80 ? "healthy" : score >= 50 ? "moderate" : "critical";
  const trend = score >= 75 ? "improving" : score >= 60 ? "stable" : "declining";

  return {
    widgetId,
    title: "Brand Health",
    data: {
      score,
      status,
      change: 3.2,
      trend,
      sparkline: [65, 68, 72, 70, 73, 75, 78, 76, 77, 78],
      factors: {
        sentiment: 72,
        engagement: 85,
        satisfaction: 68,
      },
    },
    meta: generateMeta(widgetId),
  };
}

/**
 * Mock Brand Sentiment Data
 */
export function mockBrandSentimentData(
  widgetId: string
): WidgetDataResponse<BrandSentimentData> {
  return {
    widgetId,
    title: "Brand Sentiment",
    data: {
      score: 72,
      change: 5.3,
      breakdown: {
        positive: 65,
        neutral: 25,
        negative: 10,
      },
      trend: generateTimeSeries(30, 60, 85),
      topPositive: [
        "Excellent customer service",
        "High-quality products",
        "Fast shipping",
      ],
      topNegative: [
        "Expensive pricing",
        "Limited availability",
      ],
    },
    meta: generateMeta(widgetId),
  };
}

/**
 * Mock Mentions Trend Data
 */
export function mockMentionsTrendData(
  widgetId: string
): WidgetDataResponse<MentionsTrendData> {
  return {
    widgetId,
    title: "Mentions Trend",
    data: {
      totalMentions: 8543,
      change: 12.5,
      points: generateTimeSeries(30, 200, 400),
      sources: [
        { name: "Twitter", count: 3200, percentage: 37.5 },
        { name: "Facebook", count: 2100, percentage: 24.6 },
        { name: "Instagram", count: 1800, percentage: 21.1 },
        { name: "LinkedIn", count: 843, percentage: 9.9 },
        { name: "Other", count: 600, percentage: 7.0 },
      ],
    },
    meta: generateMeta(widgetId),
  };
}

/**
 * Mock Share of Voice Data
 */
export function mockShareOfVoiceData(
  widgetId: string
): WidgetDataResponse<ShareOfVoiceData> {
  return {
    widgetId,
    title: "Share of Voice",
    data: {
      brands: [
        { name: "Our Brand", percentage: 35, mentions: 8543, trend: 5.2 },
        { name: "Nike", percentage: 28, mentions: 6840, trend: -2.1 },
        { name: "Adidas", percentage: 22, mentions: 5376, trend: 1.8 },
        { name: "Puma", percentage: 15, mentions: 3660, trend: -0.5 },
      ],
    },
    meta: generateMeta(widgetId),
  };
}

/**
 * Mock Top Topics Data
 */
export function mockTopTopicsData(
  widgetId: string
): WidgetDataResponse<TopTopicsData> {
  return {
    widgetId,
    title: "Top Topics",
    data: {
      topics: [
        { name: "Customer Service", count: 1250, sentiment: 78, trend: 12 },
        { name: "Product Quality", count: 980, sentiment: 82, trend: 8 },
        { name: "Pricing", count: 756, sentiment: 45, trend: -3 },
        { name: "Shipping", count: 623, sentiment: 71, trend: 5 },
        { name: "Returns", count: 485, sentiment: 68, trend: -2 },
        { name: "Support", count: 412, sentiment: 75, trend: 15 },
        { name: "Features", count: 389, sentiment: 80, trend: 10 },
        { name: "Mobile App", count: 301, sentiment: 65, trend: 7 },
      ],
      wordCloud: [
        { text: "quality", value: 150 },
        { text: "service", value: 120 },
        { text: "fast", value: 100 },
        { text: "support", value: 90 },
        { text: "product", value: 85 },
        { text: "shipping", value: 75 },
        { text: "price", value: 70 },
        { text: "excellent", value: 65 },
      ],
    },
    meta: generateMeta(widgetId),
  };
}

/**
 * Mock NPS Score Data
 */
export function mockNPSScoreData(
  widgetId: string
): WidgetDataResponse<NPSScoreData> {
  return {
    widgetId,
    title: "NPS Score",
    data: {
      score: 45,
      change: 3.2,
      distribution: {
        promoters: 58,
        passives: 29,
        detractors: 13,
      },
      trend: generateTimeSeries(30, 35, 55),
    },
    meta: generateMeta(widgetId),
  };
}

/**
 * Mock Competitor Comparison Data
 */
export function mockCompetitorComparisonData(
  widgetId: string
): WidgetDataResponse<CompetitorComparisonData> {
  return {
    widgetId,
    title: "Competitor Comparison",
    data: {
      metrics: [
        {
          name: "Brand Sentiment",
          our: 72,
          competitors: [
            { name: "Competitor A", value: 68 },
            { name: "Competitor B", value: 65 },
            { name: "Competitor C", value: 70 },
          ],
        },
        {
          name: "Share of Voice",
          our: 35,
          competitors: [
            { name: "Competitor A", value: 28 },
            { name: "Competitor B", value: 22 },
            { name: "Competitor C", value: 15 },
          ],
        },
        {
          name: "NPS Score",
          our: 45,
          competitors: [
            { name: "Competitor A", value: 42 },
            { name: "Competitor B", value: 38 },
            { name: "Competitor C", value: 40 },
          ],
        },
      ],
    },
    meta: generateMeta(widgetId),
  };
}

/**
 * Mock Alerts Feed Data
 */
export function mockAlertsFeedData(
  widgetId: string
): WidgetDataResponse<AlertsFeedData> {
  return {
    widgetId,
    title: "Alerts & Mentions",
    data: {
      alerts: [
        {
          id: "1",
          title: "Spike in negative mentions",
          description: "Detected 35% increase in negative sentiment on Twitter",
          severity: "high",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionable: true,
        },
        {
          id: "2",
          title: "Viral positive review",
          description: "Product review trending with 10K+ engagements",
          severity: "medium",
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          read: false,
          actionable: true,
        },
        {
          id: "3",
          title: "Competitor launched new product",
          description: "Competitor A announced new product line",
          severity: "medium",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionable: false,
        },
        {
          id: "4",
          title: "Customer support inquiry",
          description: "Multiple mentions requesting feature update",
          severity: "low",
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          read: true,
          actionable: true,
        },
      ],
      unreadCount: 2,
    },
    meta: generateMeta(widgetId),
  };
}

/**
 * Get mock data by widget type
 */
export function getMockWidgetData(widgetId: string, type: string) {
  switch (type) {
    case "brand-health-heart":
      return mockBrandHealthData(widgetId);
    case "brand-sentiment":
      return mockBrandSentimentData(widgetId);
    case "mentions-trend":
      return mockMentionsTrendData(widgetId);
    case "share-of-voice":
      return mockShareOfVoiceData(widgetId);
    case "top-topics":
      return mockTopTopicsData(widgetId);
    case "nps-score":
      return mockNPSScoreData(widgetId);
    case "competitor-comparison":
      return mockCompetitorComparisonData(widgetId);
    case "alerts-feed":
      return mockAlertsFeedData(widgetId);
    default:
      throw new Error(`Unknown widget type: ${type}`);
  }
}
