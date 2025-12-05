"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Bell, AlertCircle, AlertTriangle, Info, X, TrendingUp, TrendingDown, Clock, CheckCircle } from "lucide-react";
import { WidgetCard } from "./widget-card";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard-store";
import type { AlertsFeedData } from "@/types/dashboard";
import { formatDistanceToNow } from "date-fns";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AlertsFeedWidgetProps {
  widgetId: string;
  data?: AlertsFeedData;
  isLoading?: boolean;
  error?: string;
  onExpand?: () => void;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

export function AlertsFeedWidget({
  widgetId,
  data,
  isLoading,
  error,
  onExpand,
  onSettings,
  onDuplicate,
  onRemove,
}: AlertsFeedWidgetProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const getWidget = useDashboardStore((state) => state.getWidget);
  const widget = getWidget(widgetId);

  if (!widget) return null;

  const handleExpand = () => {
    setModalOpen(true);
  };

  // 30-day alert volume data
  const alertVolumeData = Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    critical: Math.floor(Math.random() * 15) + 5,
    high: Math.floor(Math.random() * 25) + 10,
    medium: Math.floor(Math.random() * 40) + 20,
    low: Math.floor(Math.random() * 30) + 15,
  }));

  // Severity distribution data
  const severityData = [
    { severity: "Critical", count: 124, color: "#EF4444" },
    { severity: "High", count: 287, color: "#F59E0B" },
    { severity: "Medium", count: 456, color: "#3B82F6" },
    { severity: "Low", count: 312, color: "#10B981" },
  ];

  // Source breakdown data
  const sourceData = [
    { source: "Social Media", alerts: 487, percentage: 41 },
    { source: "News & Media", alerts: 298, percentage: 25 },
    { source: "Forums", alerts: 215, percentage: 18 },
    { source: "Reviews", alerts: 156, percentage: 13 },
    { source: "Other", alerts: 23, percentage: 3 },
  ];

  // Response metrics
  const responseMetrics = [
    { metric: "Avg Response Time", value: "2.4 hours", trend: "down", trendValue: "18% faster" },
    { metric: "Resolution Rate", value: "94%", trend: "up", trendValue: "5% improvement" },
    { metric: "Pending Alerts", value: "23", trend: "down", trendValue: "12 fewer" },
    { metric: "Escalated Issues", value: "8", trend: "down", trendValue: "3 fewer" },
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return AlertCircle;
      case "medium":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "high":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      default:
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
    }
  };

  return (
    <>
      <WidgetCard
        widgetId={widgetId}
        title={widget.title}
        icon={<Bell className="w-5 h-5" />}
        isLoading={isLoading}
        error={error}
        onExpand={handleExpand}
        onSettings={onSettings}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      >
        {data && (
          <div className="h-full flex flex-col">
            {data.unreadCount > 0 && (
              <div className="mb-3 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
                {data.unreadCount} unread alert{data.unreadCount > 1 ? "s" : ""}
              </div>
            )}

            <div className="flex-1 overflow-auto space-y-2 -mx-4 px-4">
              {data.alerts.map((alert) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                
                return (
                  <div
                    key={alert.id}
                    className={cn(
                      "p-3 rounded-lg border transition-colors",
                      alert.read
                        ? "border-neutral-200 bg-white"
                        : "border-blue-200 bg-blue-50"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "p-1.5 rounded-lg mt-0.5",
                          getSeverityColor(alert.severity)
                        )}
                      >
                        <SeverityIcon className="w-3.5 h-3.5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-neutral-900 mb-0.5">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-neutral-600 mb-1 line-clamp-2">
                          {alert.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                          <span>
                            {formatDistanceToNow(new Date(alert.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                          {alert.actionable && (
                            <span className="px-1.5 py-0.5 bg-[#56BE8C]/10 text-[#56BE8C] rounded">
                              Actionable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </WidgetCard>

      {modalOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#56BE8C]/10 rounded-lg">
                    <Bell className="w-5 h-5 text-[#56BE8C]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                      Alerts & Mentions Analytics
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Comprehensive alert monitoring and response tracking
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 bg-white">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Alerts (30d)</p>
                      <AlertCircle className="w-4 h-4 text-[#56BE8C]" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">1,179</p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3" />
                      8% decrease from last month
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Avg Response Time</p>
                      <Clock className="w-4 h-4 text-[#56BE8C]" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">2.4 hrs</p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3" />
                      18% faster than target
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Resolution Rate</p>
                      <CheckCircle className="w-4 h-4 text-[#56BE8C]" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">94%</p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" />
                      5% above industry avg
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Critical Alerts</p>
                      <AlertTriangle className="w-4 h-4 text-[#56BE8C]" />
                    </div>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">124</p>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3" />
                      15% fewer than last month
                    </p>
                  </div>
                </div>

                {/* Alert Volume Trend */}
                <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Alert Volume Trend (30 Days)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={alertVolumeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12 }}
                        stroke="#9CA3AF"
                      />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#FFFFFF",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="critical"
                        stroke="#EF4444"
                        strokeWidth={2}
                        dot={false}
                        name="Critical"
                      />
                      <Line
                        type="monotone"
                        dataKey="high"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={false}
                        name="High"
                      />
                      <Line
                        type="monotone"
                        dataKey="medium"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                        name="Medium"
                      />
                      <Line
                        type="monotone"
                        dataKey="low"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={false}
                        name="Low"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Severity Distribution and Source Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Severity Distribution */}
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Severity Distribution
                    </h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={severityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="severity"
                          tick={{ fontSize: 12 }}
                          stroke="#9CA3AF"
                        />
                        <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #E5E7EB",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="count" fill="#56BE8C" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Source Breakdown */}
                  <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                      Alert Sources
                    </h3>
                    <div className="space-y-4">
                      {sourceData.map((source) => (
                        <div key={source.source}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {source.source}
                            </span>
                            <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                              {source.alerts} ({source.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                            <div
                              className="bg-[#56BE8C] h-2 rounded-full transition-all"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Response Metrics */}
                <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Response Performance Metrics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {responseMetrics.map((item) => (
                      <div key={item.metric} className="p-4 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-1">{item.metric}
                          {item.metric}
                        </p>
                        <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                          {item.value}
                        </p>
                        <p
                          className={cn(
                            "text-xs flex items-center gap-1",
                            item.trend === "up"
                              ? "text-green-600 dark:text-green-400"
                              : "text-green-600 dark:text-green-400"
                          )}
                        >
                          {item.trend === "up" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {item.trendValue}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-gray-50 dark:bg-neutral-700 rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Key Insights & Recommendations
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200">
                      <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg mt-0.5">
                        <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          Alert Volume Decreasing
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          Total alerts decreased by 8% this month, indicating improved brand health and proactive issue management.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200">
                      <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg mt-0.5">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          Response Time Improved
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          Average response time dropped to 2.4 hours, 18% faster than the 3-hour target. Team efficiency is at an all-time high.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200">
                      <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg mt-0.5">
                        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          Social Media Leading Source
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          41% of alerts originate from social media platforms. Consider enhancing social listening tools for earlier detection.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200">
                      <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg mt-0.5">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          High Resolution Rate
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          94% resolution rate exceeds industry average by 5%. Only 23 alerts remain pending with no critical items outstanding.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-white dark:bg-neutral-800 rounded-lg border border-gray-200">
                      <div className="p-1.5 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mt-0.5">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          Monitor Medium Severity Trends
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          Medium severity alerts (456) represent the largest category. Implement automated workflows to prevent escalation to high/critical.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
