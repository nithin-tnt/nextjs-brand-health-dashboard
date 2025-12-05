/**
 * User roles for permission management
 */
export type UserRole = "viewer" | "editor" | "admin";

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

/**
 * Widget types available in the dashboard
 */
export type WidgetType =
  | "brand-health-heart"
  | "brand-sentiment"
  | "mentions-trend"
  | "share-of-voice"
  | "top-topics"
  | "nps-score"
  | "competitor-comparison"
  | "alerts-feed";

/**
 * Time range options for widgets
 */
export type TimeRange = "7d" | "30d" | "90d" | "1y" | "custom";

/**
 * Base widget configuration
 */
export interface BaseWidget {
  widgetId: string;
  type: WidgetType;
  title: string;
  description?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
  static?: boolean; // Cannot be dragged or resized
  isDraggable?: boolean;
  isResizable?: boolean;
}

/**
 * Widget settings that can be customized per instance
 */
export interface WidgetSettings {
  timeRange?: TimeRange;
  refreshInterval?: number; // in seconds
  autoRefresh?: boolean;
  customStartDate?: string;
  customEndDate?: string;
  filters?: Record<string, unknown>;
}

/**
 * Complete widget with settings
 */
export interface Widget extends BaseWidget {
  settings: WidgetSettings;
}

/**
 * Widget data meta information
 */
export interface WidgetMeta {
  source: string;
  lastUpdated: string;
  nextUpdate?: string;
  isLoading?: boolean;
  error?: string;
}

/**
 * Brand Health Heart Widget Data (Hero Widget)
 */
export interface BrandHealthData {
  score: number; // 0-100 overall health score
  status: "healthy" | "moderate" | "critical";
  change: number; // percentage change
  trend: "improving" | "stable" | "declining";
  sparkline: number[]; // last 7-14 data points for mini trend
  factors: {
    sentiment: number;
    engagement: number;
    satisfaction: number;
  };
}

/**
 * Brand Sentiment Widget Data
 */
export interface BrandSentimentData {
  score: number; // 0-100
  change: number; // percentage change
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  trend: Array<{
    date: string;
    value: number;
  }>;
  topPositive?: string[];
  topNegative?: string[];
}

/**
 * Mentions Trend Widget Data
 */
export interface MentionsTrendData {
  totalMentions: number;
  change: number;
  points: Array<{
    date: string;
    value: number;
    platform?: string;
  }>;
  sources: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

/**
 * Share of Voice Widget Data
 */
export interface ShareOfVoiceData {
  brands: Array<{
    name: string;
    percentage: number;
    mentions: number;
    trend: number;
  }>;
  timeSeries?: Array<{
    date: string;
    [brand: string]: number | string;
  }>;
}

/**
 * Top Topics Widget Data
 */
export interface TopTopicsData {
  topics: Array<{
    name: string;
    count: number;
    sentiment: number;
    trend: number;
  }>;
  wordCloud?: Array<{
    text: string;
    value: number;
  }>;
}

/**
 * NPS Score Widget Data
 */
export interface NPSScoreData {
  score: number; // -100 to 100
  change: number;
  distribution: {
    promoters: number;
    passives: number;
    detractors: number;
  };
  trend: Array<{
    date: string;
    value: number;
  }>;
}

/**
 * Competitor Comparison Widget Data
 */
export interface CompetitorComparisonData {
  metrics: Array<{
    name: string;
    our: number;
    competitors: Array<{
      name: string;
      value: number;
    }>;
  }>;
}

/**
 * Alerts Feed Widget Data
 */
export interface AlertsFeedData {
  alerts: Array<{
    id: string;
    title: string;
    description: string;
    severity: "low" | "medium" | "high" | "critical";
    timestamp: string;
    read: boolean;
    actionable: boolean;
  }>;
  unreadCount: number;
}

/**
 * Generic widget data response
 */
export interface WidgetDataResponse<T = unknown> {
  widgetId: string;
  title: string;
  data: T;
  meta: WidgetMeta;
}

/**
 * Dashboard layout configuration
 */
export interface DashboardLayout {
  dashboardId: string;
  name: string;
  description?: string;
  layout: Widget[];
  metadata: {
    theme: "light" | "dark" | "system";
    timeRange: TimeRange;
    lastModifiedBy?: string;
    lastModifiedAt?: string;
    createdAt: string;
  };
}

/**
 * Widget catalog item (available widgets to add)
 */
export interface WidgetCatalogItem {
  type: WidgetType;
  name: string;
  description: string;
  icon: string;
  category: "hero" | "metrics" | "analytics" | "alerts" | "comparison";
  defaultSize: {
    w: number;
    h: number;
  };
  minSize: {
    w: number;
    h: number;
  };
  previewImage?: string;
}

/**
 * Layout change event
 */
export interface LayoutChangeEvent {
  layout: Widget[];
  timestamp: string;
  action: "add" | "remove" | "move" | "resize" | "update";
  widgetId?: string;
}

/**
 * Analytics event
 */
export interface AnalyticsEvent {
  event: string;
  properties: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

/**
 * Permission check result
 */
export interface Permission {
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canShare: boolean;
  canExport: boolean;
}

/**
 * Export format options
 */
export type ExportFormat = "png" | "pdf" | "csv" | "json";

/**
 * API Error response
 */
export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/**
 * Pagination
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}
