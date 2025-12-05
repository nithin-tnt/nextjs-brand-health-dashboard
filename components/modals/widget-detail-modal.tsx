"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Calendar, Download, Filter, RefreshCw, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Widget, TimeRange } from "@/types/dashboard";

interface WidgetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  widget: Widget;
  children?: React.ReactNode;
}

const timeRanges: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "1y", label: "Last year" },
  { value: "custom", label: "Custom" },
];

export function WidgetDetailModal({
  isOpen,
  onClose,
  widget,
  children,
}: WidgetDetailModalProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>(
    widget.settings.timeRange || "30d"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleExport = (format: "csv" | "png" | "pdf") => {
    console.log(`Exporting ${widget.title} as ${format}`);
    // Implement export logic
  };

  const handleShare = () => {
    console.log(`Sharing ${widget.title}`);
    // Implement share logic
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={widget.title} size="xl">
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          {/* Time Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-neutral-500" />
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as TimeRange)}
              className={cn(
                "px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700",
                "bg-white dark:bg-neutral-800 text-sm",
                "text-neutral-900 dark:text-neutral-100",
                "focus:outline-none focus:ring-2 focus:ring-primary-500"
              )}
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "text-neutral-600 hover:text-neutral-900",
                "dark:text-neutral-400 dark:hover:text-neutral-100",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label="Refresh data"
            >
              <RefreshCw className={cn("w-4 h-4", isRefreshing && "animate-spin")} />
            </button>

            <button
              onClick={handleShare}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "text-neutral-600 hover:text-neutral-900",
                "dark:text-neutral-400 dark:hover:text-neutral-100",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
              aria-label="Share widget"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <div className="relative group">
              <button
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  "text-neutral-600 hover:text-neutral-900",
                  "dark:text-neutral-400 dark:hover:text-neutral-100",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
                aria-label="Export data"
              >
                <Download className="w-4 h-4" />
              </button>
              
              {/* Export Dropdown */}
              <div className={cn(
                "absolute right-0 top-full mt-2 w-32 py-1",
                "bg-white dark:bg-neutral-800 rounded-lg shadow-lg",
                "border border-neutral-200 dark:border-neutral-700",
                "opacity-0 invisible group-hover:opacity-100 group-hover:visible",
                "transition-all duration-200 z-10"
              )}>
                <button
                  onClick={() => handleExport("csv")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport("png")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  Export PNG
                </button>
                <button
                  onClick={() => handleExport("pdf")}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700"
                >
                  Export PDF
                </button>
              </div>
            </div>

            <button
              className={cn(
                "p-2 rounded-lg transition-colors",
                "text-neutral-600 hover:text-neutral-900",
                "dark:text-neutral-400 dark:hover:text-neutral-100",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
              aria-label="Filter data"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="min-h-[400px]">
          {children || (
            <div className="flex items-center justify-center h-[400px] text-neutral-500">
              Detailed view for {widget.title}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
