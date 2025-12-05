import type { WidgetCatalogItem, Widget } from "@/types/dashboard";

/**
 * Widget catalog - all available widgets
 */
export const WIDGET_CATALOG: WidgetCatalogItem[] = [
  {
    type: "brand-sentiment",
    name: "Brand Sentiment",
    description: "Track overall brand sentiment score and trends over time",
    icon: "Heart",
    category: "metrics",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
  },
  {
    type: "mentions-trend",
    name: "Mentions Trend",
    description: "Monitor brand mentions across different platforms",
    icon: "TrendingUp",
    category: "analytics",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
  },
  {
    type: "share-of-voice",
    name: "Share of Voice",
    description: "Compare your brand's visibility against competitors",
    icon: "PieChart",
    category: "comparison",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
  },
  {
    type: "top-topics",
    name: "Top Topics",
    description: "Discover trending topics and themes in conversations",
    icon: "Hash",
    category: "analytics",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
  },
  {
    type: "nps-score",
    name: "NPS Score",
    description: "Track Net Promoter Score and customer satisfaction",
    icon: "Star",
    category: "metrics",
    defaultSize: { w: 6, h: 4 },
    minSize: { w: 4, h: 3 },
  },
  {
    type: "alerts-feed",
    name: "Alerts & Mentions",
    description: "Real-time feed of critical mentions and alerts",
    icon: "Bell",
    category: "alerts",
    defaultSize: { w: 6, h: 6 },
    minSize: { w: 4, h: 4 },
  },
];

/**
 * Create a new widget instance from catalog
 */
export function createWidgetFromCatalog(
  catalogItem: WidgetCatalogItem,
  position?: { x: number; y: number }
): Widget {
  const timestamp = Date.now();
  const id = `${catalogItem.type}-${timestamp}`;

  return {
    widgetId: id,
    type: catalogItem.type,
    title: catalogItem.name,
    description: catalogItem.description,
    x: position?.x ?? 0,
    y: position?.y ?? 0,
    w: catalogItem.defaultSize.w,
    h: catalogItem.defaultSize.h,
    minW: catalogItem.minSize.w,
    minH: catalogItem.minSize.h,
    isDraggable: true,
    isResizable: true,
    settings: {
      timeRange: "30d",
      autoRefresh: true,
      refreshInterval: 300, // 5 minutes
    },
  };
}

/**
 * Get catalog item by type
 */
export function getCatalogItem(type: string): WidgetCatalogItem | undefined {
  return WIDGET_CATALOG.find((item) => item.type === type);
}

/**
 * Get widgets by category
 */
export function getWidgetsByCategory(category: WidgetCatalogItem["category"]) {
  return WIDGET_CATALOG.filter((item) => item.category === category);
}

/**
 * Find optimal position for new widget in grid
 */
export function findOptimalPosition(
  existingWidgets: Widget[],
  newWidget: { w: number; h: number },
  cols = 12
): { x: number; y: number } {
  // Simple algorithm: try to place in first available spot
  if (existingWidgets.length === 0) {
    return { x: 0, y: 0 };
  }

  // Get max Y position
  const maxY = Math.max(...existingWidgets.map((w) => w.y + w.h));

  // Try each row
  for (let y = 0; y <= maxY + 1; y++) {
    for (let x = 0; x <= cols - newWidget.w; x++) {
      const position = { x, y };
      const overlaps = existingWidgets.some((widget) =>
        checkOverlap(
          position,
          newWidget,
          { x: widget.x, y: widget.y },
          widget
        )
      );

      if (!overlaps) {
        return position;
      }
    }
  }

  // If no spot found, place at bottom
  return { x: 0, y: maxY + 1 };
}

/**
 * Check if two widgets overlap
 */
function checkOverlap(
  pos1: { x: number; y: number },
  size1: { w: number; h: number },
  pos2: { x: number; y: number },
  size2: { w: number; h: number }
): boolean {
  return !(
    pos1.x + size1.w <= pos2.x ||
    pos2.x + size2.w <= pos1.x ||
    pos1.y + size1.h <= pos2.y ||
    pos2.y + size2.h <= pos1.y
  );
}

/**
 * Default dashboard layouts for new users
 */
export const DEFAULT_LAYOUTS = {
  marketing: [
    createWidgetFromCatalog(WIDGET_CATALOG[0], { x: 0, y: 0 }), // Brand Sentiment
    createWidgetFromCatalog(WIDGET_CATALOG[1], { x: 4, y: 0 }), // Mentions Trend
    createWidgetFromCatalog(WIDGET_CATALOG[2], { x: 0, y: 4 }), // Share of Voice
    createWidgetFromCatalog(WIDGET_CATALOG[3], { x: 6, y: 4 }), // Top Topics
  ],
  executive: [
    createWidgetFromCatalog(WIDGET_CATALOG[0], { x: 0, y: 0 }), // Brand Sentiment
    createWidgetFromCatalog(WIDGET_CATALOG[4], { x: 4, y: 0 }), // NPS Score
    createWidgetFromCatalog(WIDGET_CATALOG[2], { x: 8, y: 0 }), // Share of Voice
  ],
  analyst: [
    createWidgetFromCatalog(WIDGET_CATALOG[1], { x: 0, y: 0 }), // Mentions Trend
    createWidgetFromCatalog(WIDGET_CATALOG[3], { x: 6, y: 0 }), // Top Topics
    createWidgetFromCatalog(WIDGET_CATALOG[5], { x: 0, y: 4 }), // Alerts Feed
  ],
};
