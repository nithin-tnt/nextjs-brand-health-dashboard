"use client";

import { Star, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import { WidgetCard } from "./widget-card";
import { cn, getTrendDirection } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard-store";
import type { NPSScoreData } from "@/types/dashboard";
import { useState } from "react";
import { createPortal } from "react-dom";

interface NPSScoreWidgetProps {
  widgetId: string;
  data?: NPSScoreData;
  isLoading?: boolean;
  error?: string;
  onExpand?: () => void;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

export function NPSScoreWidget({
  widgetId,
  data,
  isLoading,
  error,
  onExpand,
  onSettings,
  onDuplicate,
  onRemove,
}: NPSScoreWidgetProps) {
  const getWidget = useDashboardStore((state) => state.getWidget);
  const widget = getWidget(widgetId);
  const [modalOpen, setModalOpen] = useState(false);

  if (!widget) return null;

  const handleExpand = () => {
    setModalOpen(true);
  };

  const trendDirection = data ? getTrendDirection(data.change) : "neutral";
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

  const getScoreColor = (score: number) => {
    if (score >= 50) return "text-green-600";
    if (score >= 0) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <>
      <WidgetCard
        widgetId={widgetId}
        title={widget.title}
        icon={<Star className="w-5 h-5" />}
        isLoading={isLoading}
        error={error}
        onExpand={handleExpand}
        onSettings={onSettings}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      >
      {data && (
        <div className="h-full flex flex-col gap-4">
          <div className="text-center">
            <div className={cn("text-4xl font-bold", getScoreColor(data.score))}>
              {data.score}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              NPS Score
            </div>
            
            <div className="flex items-center justify-center gap-1 mt-2">
              <TrendIcon
                className={cn(
                  "w-3 h-3",
                  trendDirection === "up" ? "text-success-600" : "text-danger-600"
                )}
              />
              <span
                className={cn(
                  "text-sm font-medium",
                  trendDirection === "up" ? "text-success-600" : "text-danger-600"
                )}
              >
                {Math.abs(data.change)}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 rounded-lg p-2">
              <div className="text-lg font-semibold text-green-700">
                {data.distribution.promoters}%
              </div>
              <div className="text-xs text-neutral-600">
                Promoters
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-2">
              <div className="text-lg font-semibold text-yellow-700">
                {data.distribution.passives}%
              </div>
              <div className="text-xs text-neutral-600">
                Passives
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-2">
              <div className="text-lg font-semibold text-red-700">
                {data.distribution.detractors}%
              </div>
              <div className="text-xs text-neutral-600">
                Detractors
              </div>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="rgb(14, 165, 233)"
                  strokeWidth={2}
                  dot={false}
                />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={[-100, 100]} />
              </LineChart>
            </ResponsiveContainer>
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
                <Star className="w-5 h-5 text-[#56BE8C]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Net Promoter Score Analysis</h2>
                <p className="text-sm text-neutral-600">Customer loyalty and satisfaction metrics</p>
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
                <div className="text-sm text-blue-600 mb-2 font-medium">Current NPS</div>
                <div className={cn("text-4xl font-bold mb-2", getScoreColor(data.score))}>
                  {data.score}
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendIcon className="w-4 h-4" />
                  <span className="text-sm font-medium">{Math.abs(data.change)}%</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                <div className="text-sm text-green-600 mb-2 font-medium">Promoters (9-10)</div>
                <div className="text-4xl font-bold text-green-900">{data.distribution.promoters}%</div>
                <div className="text-sm text-green-600 mt-2">8,460 customers</div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200">
                <div className="text-sm text-yellow-600 mb-2 font-medium">Passives (7-8)</div>
                <div className="text-4xl font-bold text-yellow-900">{data.distribution.passives}%</div>
                <div className="text-sm text-yellow-600 mt-2">3,120 customers</div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
                <div className="text-sm text-red-600 mb-2 font-medium">Detractors (0-6)</div>
                <div className="text-4xl font-bold text-red-900">{data.distribution.detractors}%</div>
                <div className="text-sm text-red-600 mt-2">1,820 customers</div>
              </div>
            </div>

            {/* 30-Day Trend Chart */}
            <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">30-Day NPS Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: "Day 1", value: 62 },
                    { date: "Day 2", value: 64 },
                    { date: "Day 3", value: 63 },
                    { date: "Day 4", value: 65 },
                    { date: "Day 5", value: 66 },
                    { date: "Day 6", value: 68 },
                    { date: "Day 7", value: 67 },
                    { date: "Day 8", value: 69 },
                    { date: "Day 9", value: 70 },
                    { date: "Day 10", value: 68 },
                    { date: "Day 11", value: 71 },
                    { date: "Day 12", value: 72 },
                    { date: "Day 13", value: 70 },
                    { date: "Day 14", value: 73 },
                    { date: "Day 15", value: 71 },
                    { date: "Day 16", value: 74 },
                    { date: "Day 17", value: 72 },
                    { date: "Day 18", value: 75 },
                    { date: "Day 19", value: 73 },
                    { date: "Day 20", value: 76 },
                    { date: "Day 21", value: 74 },
                    { date: "Day 22", value: 77 },
                    { date: "Day 23", value: 75 },
                    { date: "Day 24", value: 76 },
                    { date: "Day 25", value: 74 },
                    { date: "Day 26", value: 75 },
                    { date: "Day 27", value: 73 },
                    { date: "Day 28", value: 74 },
                    { date: "Day 29", value: 72 },
                    { date: "Day 30", value: data.score }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tickLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "rgb(59, 130, 246)" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Score Distribution by Rating */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="text-sm font-semibold text-neutral-700 mb-4">Response Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { rating: "0-6", count: 1820, color: "#ef4444" },
                      { rating: "7-8", count: 3120, color: "#eab308" },
                      { rating: "9-10", count: 8460, color: "#22c55e" }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="rating" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="text-sm font-semibold text-neutral-700 mb-4">Key Insights</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <span className="text-sm text-neutral-600">Strong promoter base growing 12% month-over-month</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    <span className="text-sm text-neutral-600">NPS score above industry average of 45</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                    <span className="text-sm text-neutral-600">23% of passives converted to promoters this quarter</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                    <span className="text-sm text-neutral-600">Customer support improvements reduced detractors by 18%</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                    <span className="text-sm text-neutral-600">Product features driving 85% of promoter feedback</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Benchmark Comparison */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="text-sm font-semibold text-neutral-700 mb-4">Industry Benchmark Comparison</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-600">Your NPS</span>
                    <span className="text-sm font-semibold text-neutral-900">{data.score}</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{width: `${(data.score + 100) / 2}%`}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-600">Industry Average</span>
                    <span className="text-sm font-semibold text-neutral-900">45</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-3">
                    <div className="bg-neutral-400 h-3 rounded-full" style={{width: '72.5%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-600">Top Performer</span>
                    <span className="text-sm font-semibold text-neutral-900">82</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{width: '91%'}}></div>
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
