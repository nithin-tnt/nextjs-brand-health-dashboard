"use client";

import { Heart, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { WidgetCard } from "./widget-card";
import { cn, getSentimentColor, getTrendDirection } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard-store";
import type { BrandSentimentData } from "@/types/dashboard";
import { useState } from "react";
import { createPortal } from "react-dom";

interface BrandSentimentWidgetProps {
  widgetId: string;
  data?: BrandSentimentData;
  isLoading?: boolean;
  error?: string;
  onExpand?: () => void;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

export function BrandSentimentWidget({
  widgetId,
  data,
  isLoading,
  error,
  onExpand,
  onSettings,
  onDuplicate,
  onRemove,
}: BrandSentimentWidgetProps) {
  const getWidget = useDashboardStore((state) => state.getWidget);
  const widget = getWidget(widgetId);
  const [modalOpen, setModalOpen] = useState(false);

  const handleToggleLock = () => {
    // Implement lock toggle
  };

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
        icon={<Heart className="w-5 h-5" />}
        isLoading={isLoading}
        error={error}
        onExpand={handleExpand}
        onSettings={onSettings}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onToggleLock={handleToggleLock}
        isLocked={widget.static}
      >
        {data && (
          <div className="h-full flex flex-col gap-4">
            {/* Score Display */}
            <div className="text-center">
              <div className={cn("text-4xl font-bold", getSentimentColor(data.score))}>
                {data.score}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                Sentiment Score
              </div>
              
              {/* Change Indicator */}
              <div className="flex items-center justify-center gap-1 mt-2">
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
                <span className="text-xs text-neutral-500">vs last period</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-green-50 rounded-lg p-2">
                <div className="text-lg font-semibold text-green-700">
                  {data.breakdown.positive}%
                </div>
                <div className="text-xs text-neutral-600">
                  Positive
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-2">
                <div className="text-lg font-semibold text-yellow-700">
                  {data.breakdown.neutral}%
                </div>
                <div className="text-xs text-neutral-600">
                  Neutral
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-2">
                <div className="text-lg font-semibold text-red-700">
                  {data.breakdown.negative}%
                </div>
                <div className="text-xs text-neutral-600">
                  Negative
                </div>
              </div>
            </div>

            {/* Sparkline */}
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
                  <YAxis hide domain={[0, 100]} />
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
                  <Heart className="w-5 h-5 text-[#56BE8C]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Brand Sentiment Analysis</h2>
                  <p className="text-sm text-neutral-600">Comprehensive sentiment tracking and analysis</p>
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
                  <div className="text-sm text-blue-600 mb-2 font-medium">Current Score</div>
                  <div className={cn("text-4xl font-bold mb-2", getSentimentColor(data.score))}>
                    {data.score}
                  </div>
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">{Math.abs(data.change)}%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                  <div className="text-sm text-green-600 mb-2 font-medium">Positive Mentions</div>
                  <div className="text-4xl font-bold text-green-900">{data.breakdown.positive}%</div>
                  <div className="text-sm text-green-600 mt-2">12.5K mentions</div>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-5 border border-yellow-200">
                  <div className="text-sm text-yellow-600 mb-2 font-medium">Neutral Mentions</div>
                  <div className="text-4xl font-bold text-yellow-900">{data.breakdown.neutral}%</div>
                  <div className="text-sm text-yellow-600 mt-2">8.2K mentions</div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
                  <div className="text-sm text-red-600 mb-2 font-medium">Negative Mentions</div>
                  <div className="text-4xl font-bold text-red-900">{data.breakdown.negative}%</div>
                  <div className="text-sm text-red-600 mt-2">3.1K mentions</div>
                </div>
              </div>

              {/* 30-Day Trend Chart */}
              <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">30-Day Sentiment Trend</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { date: "Day 1", value: 72 },
                      { date: "Day 2", value: 74 },
                      { date: "Day 3", value: 73 },
                      { date: "Day 4", value: 76 },
                      { date: "Day 5", value: 75 },
                      { date: "Day 6", value: 78 },
                      { date: "Day 7", value: 77 },
                      { date: "Day 8", value: 79 },
                      { date: "Day 9", value: 80 },
                      { date: "Day 10", value: 78 },
                      { date: "Day 11", value: 81 },
                      { date: "Day 12", value: 82 },
                      { date: "Day 13", value: 80 },
                      { date: "Day 14", value: 83 },
                      { date: "Day 15", value: 81 },
                      { date: "Day 16", value: 84 },
                      { date: "Day 17", value: 82 },
                      { date: "Day 18", value: 85 },
                      { date: "Day 19", value: 83 },
                      { date: "Day 20", value: 86 },
                      { date: "Day 21", value: 84 },
                      { date: "Day 22", value: 87 },
                      { date: "Day 23", value: 85 },
                      { date: "Day 24", value: 86 },
                      { date: "Day 25", value: 84 },
                      { date: "Day 26", value: 85 },
                      { date: "Day 27", value: 83 },
                      { date: "Day 28", value: 84 },
                      { date: "Day 29", value: 82 },
                      { date: "Day 30", value: data.score },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="rgb(14, 165, 233)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "rgb(14, 165, 233)" }}
                      />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0, 0, 0, 0.8)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                          padding: "12px"
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Detailed Insights */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-4">Sentiment Distribution</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Very Positive</span>
                        <span className="font-semibold text-neutral-900">32%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '32%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Positive</span>
                        <span className="font-semibold text-neutral-900">28%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{width: '28%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Neutral</span>
                        <span className="font-semibold text-neutral-900">{data.breakdown.neutral}%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${data.breakdown.neutral}%`}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Negative</span>
                        <span className="font-semibold text-neutral-900">11%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div className="bg-red-400 h-2 rounded-full" style={{width: '11%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neutral-600">Very Negative</span>
                        <span className="font-semibold text-neutral-900">4%</span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{width: '4%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-4">Top Keywords</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Excellent Service</span>
                          <span className="text-sm font-semibold">4.2K</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Great Quality</span>
                          <span className="text-sm font-semibold">3.8K</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Average Experience</span>
                          <span className="text-sm font-semibold">2.1K</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Poor Support</span>
                          <span className="text-sm font-semibold">1.5K</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5"></div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm text-neutral-600">Shipping Delays</span>
                          <span className="text-sm font-semibold">0.9K</span>
                        </div>
                      </div>
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
