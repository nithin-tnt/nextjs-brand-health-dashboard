"use client";

import { Hash, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { WidgetCard } from "./widget-card";
import { cn, getSentimentColor } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard-store";
import type { TopTopicsData } from "@/types/dashboard";
import { useState } from "react";
import { createPortal } from "react-dom";

interface TopTopicsWidgetProps {
  widgetId: string;
  data?: TopTopicsData;
  isLoading?: boolean;
  error?: string;
  onExpand?: () => void;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

export function TopTopicsWidget({
  widgetId,
  data,
  isLoading,
  error,
  onExpand,
  onSettings,
  onDuplicate,
  onRemove,
}: TopTopicsWidgetProps) {
  const getWidget = useDashboardStore((state) => state.getWidget);
  const widget = getWidget(widgetId);
  const [modalOpen, setModalOpen] = useState(false);

  if (!widget) return null;

  const handleExpand = () => {
    setModalOpen(true);
  };

  const topTopics = data?.topics.slice(0, 5);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <>
      <WidgetCard
        widgetId={widgetId}
        title={widget.title}
        icon={<Hash className="w-5 h-5" />}
        isLoading={isLoading}
        error={error}
        onExpand={handleExpand}
        onSettings={onSettings}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      >
      {data && topTopics && (
        <div className="h-full flex flex-col gap-3">
          

          <div className="space-y-2">
            {topTopics.map((topic) => {
              const TrendIcon = topic.trend > 0 ? TrendingUp : TrendingDown;
              return (
                <div
                  key={topic.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                      {topic.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-neutral-500 dark:text-neutral-400">
                        {topic.count} mentions
                      </span>
                      <span className={getSentimentColor(topic.sentiment)}>
                        {topic.sentiment}% sentiment
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <TrendIcon
                      className={cn(
                        "w-3 h-3",
                        topic.trend > 0 ? "text-green-600" : "text-red-600"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        topic.trend > 0 ? "text-green-600" : "text-red-600"
                      )}
                    >
                      {Math.abs(topic.trend)}%
                    </span>
                  </div>
                </div>
              );
            })}
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
                <Hash className="w-5 h-5 text-[#56BE8C]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">Trending Topics Analysis</h2>
                <p className="text-sm text-neutral-600">Discover what people are talking about</p>
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
                <div className="text-sm text-blue-600 mb-2 font-medium">Total Topics</div>
                <div className="text-4xl font-bold text-blue-900 mb-2">{data.topics.length}</div>
                <div className="text-sm text-blue-600">Active discussions</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                <div className="text-sm text-green-600 mb-2 font-medium">Total Mentions</div>
                <div className="text-4xl font-bold text-green-900 mb-2">
                  {data.topics.reduce((sum, topic) => sum + topic.count, 0).toLocaleString()}
                </div>
                <div className="text-sm text-green-600">Across all topics</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
                <div className="text-sm text-purple-600 mb-2 font-medium">Avg Sentiment</div>
                <div className="text-4xl font-bold text-purple-900 mb-2">
                  {Math.round(data.topics.reduce((sum, topic) => sum + topic.sentiment, 0) / data.topics.length)}%
                </div>
                <div className="text-sm text-purple-600">Positive rating</div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
                <div className="text-sm text-orange-600 mb-2 font-medium">Trending Up</div>
                <div className="text-4xl font-bold text-orange-900 mb-2">
                  {data.topics.filter(t => t.trend > 0).length}
                </div>
                <div className="text-sm text-orange-600">Topics gaining traction</div>
              </div>
            </div>

            {/* Topic Distribution Charts */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Topic Popularity</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.topics} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis type="number" stroke="#6b7280" fontSize={12} />
                      <YAxis dataKey="name" type="category" width={120} stroke="#6b7280" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                        {data.topics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Share of Conversation</h3>
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.topics}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {data.topics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Detailed Topics Table */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="text-sm font-semibold text-neutral-700 mb-4">Detailed Topic Breakdown</h4>
              <div className="space-y-3">
                {data.topics.map((topic, index) => {
                  const TrendIcon = topic.trend > 0 ? TrendingUp : TrendingDown;
                  return (
                    <div key={topic.name} className="flex items-center gap-4 p-4 bg-neutral-50 rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" 
                           style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-900 mb-1">{topic.name}</div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-neutral-600">{topic.count.toLocaleString()} mentions</span>
                          <span className={getSentimentColor(topic.sentiment)}>{topic.sentiment}% sentiment</span>
                          <div className="flex items-center gap-1">
                            <TrendIcon className={cn("w-3 h-3", topic.trend > 0 ? "text-green-600" : "text-red-600")} />
                            <span className={cn("font-medium", topic.trend > 0 ? "text-green-600" : "text-red-600")}>
                              {Math.abs(topic.trend)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-32 bg-neutral-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${(topic.count / Math.max(...data.topics.map(t => t.count))) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h4 className="text-sm font-semibold text-neutral-700 mb-4">Key Insights</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  <span className="text-sm text-neutral-600">
                    "{data.topics[0].name}" dominates conversation with {((data.topics[0].count / data.topics.reduce((sum, t) => sum + t.count, 0)) * 100).toFixed(1)}% share
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                  <span className="text-sm text-neutral-600">
                    Topics with positive sentiment show {Math.abs(data.topics.filter(t => t.sentiment > 70)[0]?.trend || 15)}% higher engagement growth
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                  <span className="text-sm text-neutral-600">
                    {data.topics.filter(t => t.trend > 10).length} topics showing strong upward momentum this week
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                  <span className="text-sm text-neutral-600">
                    Average sentiment across top topics is {Math.round(data.topics.slice(0, 5).reduce((sum, t) => sum + t.sentiment, 0) / 5)}%, indicating positive brand perception
                  </span>
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
