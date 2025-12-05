"use client";

import { useEffect } from "react";
import { DashboardGrid } from "./dashboard-grid";
import { DashboardHeader } from "./dashboard-header-new";
import { FilterHeader } from "./filter-header";
import { BrandHealthPanel } from "./brand-health-panel";
import { BrandHealthOverviewWidget } from "../widgets/brand-health-overview-widget";
import { WidgetPalette } from "./widget-palette";
import { WidgetFactory } from "../widgets/widget-factory";
import { WidgetDetailModal } from "../modals/widget-detail-modal";
import { useDashboardStore } from "@/store/dashboard-store";
import { DEFAULT_LAYOUTS } from "@/lib/widget-catalog";

interface DashboardContainerProps {
  dashboardId?: string;
}

export function DashboardContainer({
  dashboardId = "default",
}: DashboardContainerProps) {
  const layout = useDashboardStore((state) => state.layout);
  const loadDashboard = useDashboardStore((state) => state.loadDashboard);
  const modalWidgetId = useDashboardStore((state) => state.modalWidgetId);
  const openWidgetModal = useDashboardStore((state) => state.openWidgetModal);
  const getWidget = useDashboardStore((state) => state.getWidget);
  const toggleWidgetPalette = useDashboardStore((state) => state.toggleWidgetPalette);

  const modalWidget = modalWidgetId ? getWidget(modalWidgetId) : null;

  // Initialize with default layout if empty
  useEffect(() => {
    if (layout.length === 0) {
      loadDashboard({
        dashboardId,
        name: "My Dashboard",
        layout: DEFAULT_LAYOUTS.marketing,
        metadata: {
          theme: "light",
          timeRange: "30d",
          createdAt: new Date().toISOString(),
        },
      });
    }
  }, [layout.length, loadDashboard, dashboardId]);

  // Filter out brand health heart widget (now in left panel)
  const otherWidgets = layout.filter(w => w.type !== 'brand-health-heart');

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor: '#F6F6F6' }}>
      <DashboardHeader />
      <FilterHeader onAddWidget={toggleWidgetPalette} />
      
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Fixed 40% with Brand Health Heart */}
        <div className="w-[40%] shrink-0 border-r border-gray-200">
          <BrandHealthPanel />
        </div>

        {/* Right Panel - Draggable Widgets 60% */}
        <div className="w-[60%] shrink-0 overflow-y-auto" style={{ backgroundColor: '#F6F6F6' }}>
          <div className="p-6">
            <BrandHealthOverviewWidget />
            
            {otherWidgets.length > 0 && (
              <div className="mt-6">
                <DashboardGrid dashboardId={dashboardId}>
                  {otherWidgets.map((widget) => (
                    <div key={widget.widgetId} data-grid={widget}>
                      <WidgetFactory widget={widget} />
                    </div>
                  ))}
                </DashboardGrid>
              </div>
            )}
          </div>
        </div>
      </main>

      <WidgetPalette />

      {/* Widget Detail Modal */}
      {modalWidget && (
        <WidgetDetailModal
          isOpen={!!modalWidgetId}
          onClose={() => openWidgetModal(null)}
          widget={modalWidget}
        >
          <WidgetFactory widget={modalWidget} />
        </WidgetDetailModal>
      )}
    </div>
  );
}
