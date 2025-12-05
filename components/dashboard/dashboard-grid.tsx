"use client";

import { useCallback, useEffect } from "react";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDashboardStore } from "@/store/dashboard-store";
import { useSaveLayout, useAnalytics } from "@/hooks/use-dashboard";
import { debounce } from "@/lib/utils";
import type { Widget } from "@/types/dashboard";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  children: React.ReactNode;
  dashboardId: string;
  readonly?: boolean;
}

export function DashboardGrid({
  children,
  dashboardId,
  readonly = false,
}: DashboardGridProps) {
  const layout = useDashboardStore((state) => state.layout);
  const setLayout = useDashboardStore((state) => state.setLayout);
  const setIsDragging = useDashboardStore((state) => state.setIsDragging);
  const canEdit = useDashboardStore((state) => state.canEdit());
  
  const { mutate: saveLayout } = useSaveLayout();
  const { trackEvent } = useAnalytics();

  const isEditable = canEdit && !readonly;

  // Debounced save function
  const debouncedSave = useCallback(
    debounce((newLayout: Widget[]) => {
      saveLayout({ dashboardId, layout: newLayout });
    }, 1000),
    [dashboardId, saveLayout]
  );

  // Handle layout change
  const handleLayoutChange = useCallback(
    (newLayout: Layout[]) => {
      if (!isEditable) return;

      const updatedLayout = layout.map((widget) => {
        const layoutItem = newLayout.find((l) => l.i === widget.widgetId);
        if (!layoutItem) return widget;

        return {
          ...widget,
          x: layoutItem.x,
          y: layoutItem.y,
          w: layoutItem.w,
          h: layoutItem.h,
        };
      });

      setLayout(updatedLayout);
      debouncedSave(updatedLayout);
    },
    [layout, setLayout, debouncedSave, isEditable]
  );

  // Handle drag start/stop
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragStop = useCallback(
    (newLayout: Layout[]) => {
      setIsDragging(false);
      trackEvent("widget.moved", {
        dashboardId,
        widgetCount: layout.length,
      });
    },
    [setIsDragging, trackEvent, dashboardId, layout.length]
  );

  // Handle resize stop
  const handleResizeStop = useCallback(
    (newLayout: Layout[]) => {
      trackEvent("widget.resized", {
        dashboardId,
      });
    },
    [trackEvent, dashboardId]
  );

  // Convert widgets to grid layout format
  const gridLayout: Layout[] = layout.map((widget) => ({
    i: widget.widgetId,
    x: widget.x,
    y: widget.y,
    w: widget.w,
    h: widget.h,
    minW: widget.minW,
    minH: widget.minH,
    maxW: widget.maxW,
    maxH: widget.maxH,
    static: widget.static || !isEditable,
    isDraggable: widget.isDraggable !== false && isEditable,
    isResizable: widget.isResizable !== false && isEditable,
  }));

  // Breakpoints configuration
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 };

  return (
    <ResponsiveGridLayout
      className="dashboard-grid"
      layouts={{ lg: gridLayout }}
      breakpoints={breakpoints}
      cols={cols}
      rowHeight={80}
      containerPadding={[16, 16]}
      margin={[16, 16]}
      isDraggable={isEditable}
      isResizable={isEditable}
      onLayoutChange={handleLayoutChange}
      onDragStart={handleDragStart}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      draggableHandle=".widget-drag-handle"
      compactType="vertical"
      preventCollision={false}
      useCSSTransforms={true}
    >
      {children}
    </ResponsiveGridLayout>
  );
}
