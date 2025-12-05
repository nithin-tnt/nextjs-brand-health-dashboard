import type {
  DashboardLayout,
  Widget,
  WidgetDataResponse,
  BrandSentimentData,
  MentionsTrendData,
  ShareOfVoiceData,
  TopTopicsData,
  NPSScoreData,
  CompetitorComparisonData,
  AlertsFeedData,
  WidgetType,
  TimeRange,
} from "@/types/dashboard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Generic API error class
 */
export class APIError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = "APIError";
  }
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        code: "UNKNOWN_ERROR",
        message: "An unknown error occurred",
      }));
      throw new APIError(
        error.code,
        error.message,
        response.status
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(
      "NETWORK_ERROR",
      error instanceof Error ? error.message : "Network error occurred"
    );
  }
}

/**
 * Dashboard API
 */
export const dashboardAPI = {
  /**
   * Get dashboard by ID
   */
  async getDashboard(dashboardId: string): Promise<DashboardLayout> {
    return fetchAPI<DashboardLayout>(`/dashboards/${dashboardId}`);
  },

  /**
   * Save dashboard layout
   */
  async saveLayout(
    dashboardId: string,
    layout: Widget[]
  ): Promise<DashboardLayout> {
    return fetchAPI<DashboardLayout>(`/dashboards/${dashboardId}/layout`, {
      method: "PUT",
      body: JSON.stringify({ layout }),
    });
  },

  /**
   * Add widget to dashboard
   */
  async addWidget(dashboardId: string, widget: Widget): Promise<Widget> {
    return fetchAPI<Widget>(`/dashboards/${dashboardId}/widgets`, {
      method: "POST",
      body: JSON.stringify(widget),
    });
  },

  /**
   * Remove widget from dashboard
   */
  async removeWidget(
    dashboardId: string,
    widgetId: string
  ): Promise<void> {
    return fetchAPI<void>(
      `/dashboards/${dashboardId}/widgets/${widgetId}`,
      {
        method: "DELETE",
      }
    );
  },

  /**
   * Update widget settings
   */
  async updateWidget(
    dashboardId: string,
    widgetId: string,
    updates: Partial<Widget>
  ): Promise<Widget> {
    return fetchAPI<Widget>(
      `/dashboards/${dashboardId}/widgets/${widgetId}`,
      {
        method: "PATCH",
        body: JSON.stringify(updates),
      }
    );
  },
};

/**
 * Widget Data API
 */
export const widgetAPI = {
  /**
   * Get widget data
   */
  async getWidgetData<T>(
    widgetId: string,
    type: WidgetType,
    timeRange: TimeRange = "30d"
  ): Promise<WidgetDataResponse<T>> {
    return fetchAPI<WidgetDataResponse<T>>(
      `/widgets/${widgetId}/data?range=${timeRange}&type=${type}`
    );
  },

  /**
   * Get Brand Sentiment data
   */
  async getBrandSentiment(
    widgetId: string,
    timeRange: TimeRange = "30d"
  ): Promise<WidgetDataResponse<BrandSentimentData>> {
    return this.getWidgetData<BrandSentimentData>(
      widgetId,
      "brand-sentiment",
      timeRange
    );
  },

  /**
   * Get Mentions Trend data
   */
  async getMentionsTrend(
    widgetId: string,
    timeRange: TimeRange = "30d"
  ): Promise<WidgetDataResponse<MentionsTrendData>> {
    return this.getWidgetData<MentionsTrendData>(
      widgetId,
      "mentions-trend",
      timeRange
    );
  },

  /**
   * Get Share of Voice data
   */
  async getShareOfVoice(
    widgetId: string,
    timeRange: TimeRange = "30d"
  ): Promise<WidgetDataResponse<ShareOfVoiceData>> {
    return this.getWidgetData<ShareOfVoiceData>(
      widgetId,
      "share-of-voice",
      timeRange
    );
  },

  /**
   * Get Top Topics data
   */
  async getTopTopics(
    widgetId: string,
    timeRange: TimeRange = "30d"
  ): Promise<WidgetDataResponse<TopTopicsData>> {
    return this.getWidgetData<TopTopicsData>(
      widgetId,
      "top-topics",
      timeRange
    );
  },

  /**
   * Get NPS Score data
   */
  async getNPSScore(
    widgetId: string,
    timeRange: TimeRange = "30d"
  ): Promise<WidgetDataResponse<NPSScoreData>> {
    return this.getWidgetData<NPSScoreData>(
      widgetId,
      "nps-score",
      timeRange
    );
  },

  /**
   * Get Competitor Comparison data
   */
  async getCompetitorComparison(
    widgetId: string,
    timeRange: TimeRange = "30d"
  ): Promise<WidgetDataResponse<CompetitorComparisonData>> {
    return this.getWidgetData<CompetitorComparisonData>(
      widgetId,
      "competitor-comparison",
      timeRange
    );
  },

  /**
   * Get Alerts Feed data
   */
  async getAlertsFeed(
    widgetId: string
  ): Promise<WidgetDataResponse<AlertsFeedData>> {
    return this.getWidgetData<AlertsFeedData>(
      widgetId,
      "alerts-feed",
      "7d"
    );
  },

  /**
   * Export widget data
   */
  async exportWidgetData(
    widgetId: string,
    format: "csv" | "png" | "pdf"
  ): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/widgets/${widgetId}/export?format=${format}`
    );
    return response.blob();
  },
};

/**
 * Analytics API
 */
export const analyticsAPI = {
  /**
   * Track event
   */
  async trackEvent(
    event: string,
    properties: Record<string, unknown>
  ): Promise<void> {
    // Fire and forget - don't block UI
    fetch(`${API_BASE_URL}/analytics/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        event,
        properties,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => {
      // Silently fail analytics
    });
  },
};
