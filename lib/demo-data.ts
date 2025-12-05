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
} from "@/types/dashboard";
import { mockBrandHealthData } from "./mock-data";

/**
 * Generate variations of Brand Health data for different states
 */
export function getBrandHealthVariations(): {
  healthy: WidgetDataResponse<BrandHealthData>;
  moderate: WidgetDataResponse<BrandHealthData>;
  critical: WidgetDataResponse<BrandHealthData>;
} {
  return {
    healthy: {
      widgetId: "demo-healthy",
      title: "Brand Health - Healthy",
      data: {
        score: 87,
        status: "healthy",
        change: 5.2,
        trend: "improving",
        sparkline: [75, 78, 80, 82, 83, 85, 86, 84, 85, 87],
        factors: {
          sentiment: 85,
          engagement: 92,
          satisfaction: 84,
        },
      },
      meta: {
        source: "demo_data",
        lastUpdated: new Date().toISOString(),
      },
    },
    moderate: {
      widgetId: "demo-moderate",
      title: "Brand Health - Needs Attention",
      data: {
        score: 65,
        status: "moderate",
        change: -2.3,
        trend: "stable",
        sparkline: [70, 68, 67, 66, 65, 66, 65, 64, 65, 65],
        factors: {
          sentiment: 62,
          engagement: 68,
          satisfaction: 65,
        },
      },
      meta: {
        source: "demo_data",
        lastUpdated: new Date().toISOString(),
      },
    },
    critical: {
      widgetId: "demo-critical",
      title: "Brand Health - Critical",
      data: {
        score: 42,
        status: "critical",
        change: -8.7,
        trend: "declining",
        sparkline: [58, 55, 52, 50, 48, 45, 44, 43, 42, 42],
        factors: {
          sentiment: 38,
          engagement: 45,
          satisfaction: 43,
        },
      },
      meta: {
        source: "demo_data",
        lastUpdated: new Date().toISOString(),
      },
    },
  };
}

/**
 * Demo scenarios for testing different dashboard states
 */
export const DEMO_SCENARIOS = {
  // All widgets showing positive metrics
  allPositive: {
    brandHealth: 87,
    brandSentiment: 82,
    npsScore: 45,
    mentionsChange: 15.2,
    alertSeverity: "low" as const,
  },
  
  // Mixed performance
  mixed: {
    brandHealth: 65,
    brandSentiment: 58,
    npsScore: 12,
    mentionsChange: -3.5,
    alertSeverity: "medium" as const,
  },
  
  // Crisis mode
  crisis: {
    brandHealth: 42,
    brandSentiment: 35,
    npsScore: -18,
    mentionsChange: -25.8,
    alertSeverity: "critical" as const,
  },
  
  // Recovering trend
  recovering: {
    brandHealth: 68,
    brandSentiment: 72,
    npsScore: 28,
    mentionsChange: 8.3,
    alertSeverity: "medium" as const,
  },
};

/**
 * Get demo data based on scenario
 */
export function getDemoDataForScenario(
  scenario: keyof typeof DEMO_SCENARIOS,
  widgetType: string
): any {
  const config = DEMO_SCENARIOS[scenario];
  
  switch (widgetType) {
    case "brand-health-heart":
      return {
        widgetId: "demo",
        title: "Brand Health",
        data: {
          score: config.brandHealth,
          status: 
            config.brandHealth >= 80 ? "healthy" :
            config.brandHealth >= 50 ? "moderate" : "critical",
          change: config.brandHealth > 70 ? 3.2 : -2.5,
          trend: 
            config.brandHealth >= 75 ? "improving" :
            config.brandHealth >= 60 ? "stable" : "declining",
          sparkline: generateSparkline(config.brandHealth),
          factors: {
            sentiment: config.brandSentiment,
            engagement: config.brandHealth,
            satisfaction: Math.round((config.brandHealth + config.brandSentiment) / 2),
          },
        },
        meta: {
          source: "demo_data",
          lastUpdated: new Date().toISOString(),
        },
      };
    
    default:
      return null;
  }
}

function generateSparkline(targetScore: number): number[] {
  const variation = 5;
  return Array.from({ length: 10 }, (_, i) => {
    const progress = i / 9;
    const randomVariation = (Math.random() - 0.5) * variation;
    return Math.round(targetScore * (0.85 + progress * 0.15) + randomVariation);
  });
}
