"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { WidgetCard } from "./widget-card";
import { cn, formatNumber, getTrendDirection } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard-store";
import type { MentionsTrendData } from "@/types/dashboard";
import { useState } from "react";
import { createPortal } from "react-dom";

interface MentionsTrendWidgetProps {
  widgetId: string;
  data?: MentionsTrendData;
  isLoading?: boolean;
  error?: string;
  onExpand?: () => void;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

export function MentionsTrendWidget({
  widgetId,
  data,
  isLoading,
  error,
  onExpand,
  onSettings,
  onDuplicate,
  onRemove,
}: MentionsTrendWidgetProps) {
  const getWidget = useDashboardStore((state) => state.getWidget);
  const widget = getWidget(widgetId);
  const [modalOpen, setModalOpen] = useState(false);

  const handleExpand = () => {
    setModalOpen(true);
  };

  if (!widget) return null;

  const trendDirection = data ? getTrendDirection(data.change) : "neutral";
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

  return (
    <>
      <WidgetCard
        widgetId={widgetId}
        title={widget.title}
        icon={<TrendingUp className="w-5 h-5" />}
        isLoading={isLoading}
        error={error}
        onExpand={handleExpand}
        onSettings={onSettings}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      >
        {data && (
          <div className="h-full flex flex-col gap-3">
            {/* Total Mentions */}
            <div>
              <div className="text-3xl font-bold text-neutral-900">
                {formatNumber(data.totalMentions)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendIcon
                  className={cn(
                    "w-3 h-3",
                    trendDirection === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    trendDirection === "up"
                      ? "text-green-600"
                      : "text-red-600"
                  )}
                >
                  {Math.abs(data.change)}%
                </span>
                <span className="text-xs text-neutral-500">from last period</span>
              </div>
            </div>

            {/* Chart */}
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.points}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "none",
                      borderRadius: "8px",
                      color: "white",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="rgb(14, 165, 233)"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Top Sources */}
            <div className="pt-2 border-t border-neutral-200">
              <div className="text-xs font-medium text-neutral-600 mb-2">
                Top Sources
              </div>
              <div className="flex gap-2 flex-wrap">
                {data.sources.slice(0, 3).map((source) => (
                  <div
                    key={source.name}
                    className="flex items-center gap-1 text-xs bg-neutral-100 px-2 py-1 rounded-full"
                  >
                    <span className="font-medium">{source.name}</span>
                    <span className="text-neutral-500">
                      {source.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </WidgetCard>

      {/* Expanded Modal */}
      {modalOpen && data && typeof window !== 'undefined' && createPortal(
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
                  <TrendingUp className="w-5 h-5 text-[#56BE8C]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Mentions Trend Analysis</h2>
                  <p className="text-sm text-neutral-600">Track brand mentions across platforms over time</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Key Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                  <div className="text-sm text-blue-600 mb-2 font-medium">Total Mentions</div>
                  <div className="text-4xl font-bold text-blue-900 mb-2">{formatNumber(data.totalMentions)}</div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{Math.abs(data.change)}%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="text-sm text-green-600 mb-2 font-medium">Daily Average</div>
                  <div className="text-4xl font-bold text-green-900">{(data.totalMentions / 30).toFixed(0)}</div>
                  <div className="text-sm text-green-600 mt-2">mentions/day</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                  <div className="text-sm text-purple-600 mb-2 font-medium">Peak Day</div>
                  <div className="text-4xl font-bold text-purple-900">{Math.max(...data.points.map(p => p.value))}</div>
                  <div className="text-sm text-purple-600 mt-2">highest volume</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
                  <div className="text-sm text-orange-600 mb-2 font-medium">Engagement Rate</div>
                  <div className="text-4xl font-bold text-orange-900">4.2%</div>
                  <div className="text-sm text-orange-600 mt-2">avg interaction</div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-6">
                {/* Line Chart */}
                <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">30-Day Mentions Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.points}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return `${date.getMonth() + 1}/${date.getDate()}`;
                          }}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                            padding: "12px"
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="rgb(14, 165, 233)"
                          strokeWidth={3}
                          dot={{ r: 3, fill: "rgb(14, 165, 233)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart - Sources */}
                <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Mentions by Source</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.sources}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="percentage" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-4">Source Breakdown</h4>
                  <div className="space-y-3">
                    {data.sources.map((source, index) => (
                      <div key={source.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-neutral-600">{source.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-neutral-500">{(data.totalMentions * source.percentage / 100).toFixed(0)}</span>
                            <span className="font-semibold text-neutral-900">{source.percentage}%</span>
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${source.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-4">Key Insights</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Steady growth of {data.change}% vs previous period</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Twitter drives {data.sources[0]?.percentage}% of total mentions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Peak activity on weekends with 32% more volume</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Influencer mentions increased by 18% this month</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Optimal posting time: 2-4 PM for max engagement</span>
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
