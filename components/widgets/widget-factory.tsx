"use client";

import { BrandHealthHeartWidget } from "./brand-health-heart-widget";
import { BrandSentimentWidget } from "./brand-sentiment-widget";
import { MentionsTrendWidget } from "./mentions-trend-widget";
import { ShareOfVoiceWidget } from "./share-of-voice-widget";
import { TopTopicsWidget } from "./top-topics-widget";
import { NPSScoreWidget } from "./nps-score-widget";
import { AlertsFeedWidget } from "./alerts-feed-widget";
import type { Widget } from "@/types/dashboard";
import { getMockWidgetData } from "@/lib/mock-data";
import { useDashboardStore } from "@/store/dashboard-store";

interface WidgetFactoryProps {
  widget: Widget;
}

export function WidgetFactory({ widget }: WidgetFactoryProps) {
  const expandWidget = useDashboardStore((state) => state.expandWidget);
  const duplicateWidget = useDashboardStore((state) => state.duplicateWidget);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const openWidgetModal = useDashboardStore((state) => state.openWidgetModal);

  // In a real app, this would use the appropriate hook based on widget type
  // For now, we'll use mock data
  const mockData = getMockWidgetData(widget.widgetId, widget.type) as any;

  const handleExpand = () => {
    openWidgetModal(widget.widgetId);
  };

  const handleSettings = () => {
    // Implement settings modal
    console.log("Settings for", widget.widgetId);
  };

  const handleDuplicate = () => {
    duplicateWidget(widget.widgetId);
  };

  const handleRemove = () => {
    removeWidget(widget.widgetId);
  };

  const commonProps = {
    widgetId: widget.widgetId,
    isLoading: false,
    error: undefined,
    onExpand: handleExpand,
    onSettings: handleSettings,
    onDuplicate: handleDuplicate,
    onRemove: handleRemove,
  };

  switch (widget.type) {
    case "brand-health-heart":
      return (
        <BrandHealthHeartWidget
          {...commonProps}
          data={mockData.data}
        />
      );

    case "brand-sentiment":
      return (
        <BrandSentimentWidget
          {...commonProps}
          data={mockData.data}
        />
      );

    case "mentions-trend":
      return (
        <MentionsTrendWidget
          {...commonProps}
          data={mockData.data}
        />
      );

    case "share-of-voice":
      return (
        <ShareOfVoiceWidget
          {...commonProps}
          data={mockData.data}
        />
      );

    case "top-topics":
      return (
        <TopTopicsWidget
          {...commonProps}
          data={mockData.data}
        />
      );

    case "nps-score":
      return (
        <NPSScoreWidget
          {...commonProps}
          data={mockData.data}
        />
      );

    case "alerts-feed":
      return (
        <AlertsFeedWidget
          {...commonProps}
          data={mockData.data}
        />
      );

    default:
      return (
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Widget type "{widget.type}" not implemented yet
          </p>
        </div>
      );
  }
}
