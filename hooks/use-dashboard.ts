import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardAPI, widgetAPI, analyticsAPI } from "@/lib/api-client";
import type {
  DashboardLayout,
  Widget,
  WidgetType,
  TimeRange,
} from "@/types/dashboard";
import { useDashboardStore } from "@/store/dashboard-store";

/**
 * Hook to fetch dashboard data
 */
export function useDashboard(dashboardId: string) {
  return useQuery({
    queryKey: ["dashboard", dashboardId],
    queryFn: () => dashboardAPI.getDashboard(dashboardId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to save dashboard layout
 */
export function useSaveLayout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({
      dashboardId,
      layout,
    }: {
      dashboardId: string;
      layout: Widget[];
    }) => dashboardAPI.saveLayout(dashboardId, layout),
    onSuccess: (data) => {
      queryClient.setQueryData(["dashboard", data.dashboardId], data);
      analyticsAPI.trackEvent("dashboard.layout_saved", {
        dashboardId: data.dashboardId,
        widgetCount: data.layout.length,
      });
    },
  });
}

/**
 * Hook to add widget
 */
export function useAddWidget() {
  const queryClient = useQueryClient();
  const addWidget = useDashboardStore((state) => state.addWidget);
  
  return useMutation({
    mutationFn: ({
      dashboardId,
      widget,
    }: {
      dashboardId: string;
      widget: Widget;
    }) => dashboardAPI.addWidget(dashboardId, widget),
    onSuccess: (widget, variables) => {
      addWidget(widget);
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.dashboardId],
      });
      analyticsAPI.trackEvent("widget.added", {
        widgetType: widget.type,
        widgetId: widget.widgetId,
      });
    },
  });
}

/**
 * Hook to remove widget
 */
export function useRemoveWidget() {
  const queryClient = useQueryClient();
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  
  return useMutation({
    mutationFn: ({
      dashboardId,
      widgetId,
    }: {
      dashboardId: string;
      widgetId: string;
    }) => dashboardAPI.removeWidget(dashboardId, widgetId),
    onSuccess: (_, variables) => {
      removeWidget(variables.widgetId);
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.dashboardId],
      });
      analyticsAPI.trackEvent("widget.removed", {
        widgetId: variables.widgetId,
      });
    },
  });
}

/**
 * Hook to update widget
 */
export function useUpdateWidget() {
  const queryClient = useQueryClient();
  const updateWidget = useDashboardStore((state) => state.updateWidget);
  
  return useMutation({
    mutationFn: ({
      dashboardId,
      widgetId,
      updates,
    }: {
      dashboardId: string;
      widgetId: string;
      updates: Partial<Widget>;
    }) => dashboardAPI.updateWidget(dashboardId, widgetId, updates),
    onSuccess: (widget, variables) => {
      updateWidget(variables.widgetId, widget);
      queryClient.invalidateQueries({
        queryKey: ["dashboard", variables.dashboardId],
      });
    },
  });
}

/**
 * Generic hook to fetch widget data
 */
export function useWidgetData<T>(
  widgetId: string,
  type: WidgetType,
  timeRange: TimeRange = "30d",
  enabled = true
) {
  return useQuery({
    queryKey: ["widget", widgetId, type, timeRange],
    queryFn: () => widgetAPI.getWidgetData<T>(widgetId, type, timeRange),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch Brand Sentiment data
 */
export function useBrandSentiment(
  widgetId: string,
  timeRange: TimeRange = "30d",
  enabled = true
) {
  return useQuery({
    queryKey: ["widget", widgetId, "brand-sentiment", timeRange],
    queryFn: () => widgetAPI.getBrandSentiment(widgetId, timeRange),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch Mentions Trend data
 */
export function useMentionsTrend(
  widgetId: string,
  timeRange: TimeRange = "30d",
  enabled = true
) {
  return useQuery({
    queryKey: ["widget", widgetId, "mentions-trend", timeRange],
    queryFn: () => widgetAPI.getMentionsTrend(widgetId, timeRange),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch Share of Voice data
 */
export function useShareOfVoice(
  widgetId: string,
  timeRange: TimeRange = "30d",
  enabled = true
) {
  return useQuery({
    queryKey: ["widget", widgetId, "share-of-voice", timeRange],
    queryFn: () => widgetAPI.getShareOfVoice(widgetId, timeRange),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch Top Topics data
 */
export function useTopTopics(
  widgetId: string,
  timeRange: TimeRange = "30d",
  enabled = true
) {
  return useQuery({
    queryKey: ["widget", widgetId, "top-topics", timeRange],
    queryFn: () => widgetAPI.getTopTopics(widgetId, timeRange),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch NPS Score data
 */
export function useNPSScore(
  widgetId: string,
  timeRange: TimeRange = "30d",
  enabled = true
) {
  return useQuery({
    queryKey: ["widget", widgetId, "nps-score", timeRange],
    queryFn: () => widgetAPI.getNPSScore(widgetId, timeRange),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to track analytics events
 */
export function useAnalytics() {
  const trackEvent = (event: string, properties: Record<string, unknown>) => {
    analyticsAPI.trackEvent(event, properties);
  };

  const trackWidgetExpanded = (widgetId: string, widgetType: WidgetType) => {
    trackEvent("widget.expanded", { widgetId, widgetType });
  };

  const trackWidgetFiltered = (
    widgetId: string,
    filter: Record<string, unknown>
  ) => {
    trackEvent("widget.filtered", { widgetId, filter });
  };

  return {
    trackEvent,
    trackWidgetExpanded,
    trackWidgetFiltered,
  };
}
