"use client";

import { PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { WidgetCard } from "./widget-card";
import { useDashboardStore } from "@/store/dashboard-store";
import type { ShareOfVoiceData } from "@/types/dashboard";
import { useState } from "react";
import { createPortal } from "react-dom";

interface ShareOfVoiceWidgetProps {
  widgetId: string;
  data?: ShareOfVoiceData;
  isLoading?: boolean;
  error?: string;
  onExpand?: () => void;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

const COLORS = ["#0EA5E9", "#A855F7", "#22C55E", "#F59E0B"];

export function ShareOfVoiceWidget({
  widgetId,
  data,
  isLoading,
  error,
  onExpand,
  onSettings,
  onDuplicate,
  onRemove,
}: ShareOfVoiceWidgetProps) {
  const getWidget = useDashboardStore((state) => state.getWidget);
  const widget = getWidget(widgetId);
  const [modalOpen, setModalOpen] = useState(false);

  const handleExpand = () => {
    setModalOpen(true);
  };

  if (!widget) return null;

  const chartData = data?.brands.map((brand) => ({
    name: brand.name,
    value: brand.percentage,
  }));

  return (
    <>
      <WidgetCard
        widgetId={widgetId}
        title={widget.title}
        icon={<PieChartIcon className="w-5 h-5" />}
        isLoading={isLoading}
        error={error}
        onExpand={handleExpand}
        onSettings={onSettings}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      >
        {data && (
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {data.brands.map((brand, index) => (
                <div key={brand.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-neutral-700">
                      {brand.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">
                    {brand.percentage}%
                  </span>
                </div>
              ))}
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
                  <PieChartIcon className="w-5 h-5 text-[#56BE8C]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">Share of Voice Analysis</h2>
                  <p className="text-sm text-neutral-600">Competitive brand visibility and market presence</p>
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
              {/* Brand Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                {data.brands.map((brand, index) => (
                  <div 
                    key={brand.name}
                    className="rounded-xl p-5 border-2"
                    style={{ 
                      borderColor: COLORS[index % COLORS.length],
                      background: `linear-gradient(to bottom right, ${COLORS[index % COLORS.length]}10, ${COLORS[index % COLORS.length]}30)`
                    }}
                  >
                    <div className="text-sm font-medium mb-2" style={{ color: COLORS[index % COLORS.length] }}>
                      {brand.name}
                    </div>
                    <div className="text-4xl font-bold text-neutral-900 mb-2">{brand.percentage}%</div>
                    <div className="text-sm text-neutral-600">{(brand.percentage * 247).toFixed(0)} mentions</div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-2 gap-6">
                {/* Pie Chart */}
                <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Market Distribution</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Mention Volume Comparison</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.brands.map((brand, i) => ({
                        name: brand.name,
                        mentions: (brand.percentage * 247).toFixed(0),
                        fill: COLORS[i % COLORS.length]
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="mentions" radius={[8, 8, 0, 0]}>
                          {data.brands.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-4">Brand Performance</h4>
                  <div className="space-y-3">
                    {data.brands.map((brand, index) => (
                      <div key={brand.name}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-neutral-600">{brand.name}</span>
                          <span className="font-semibold text-neutral-900">{brand.percentage}%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${brand.percentage}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
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
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Your brand leads with {data.brands[0]?.percentage}% market share</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Competitor gap: {(data.brands[0]?.percentage - data.brands[1]?.percentage).toFixed(1)}% ahead of next brand</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Total conversation volume: 24.7K mentions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Growing presence in social media channels</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                      <span className="text-sm text-neutral-600">Opportunity to capture {(100 - data.brands.reduce((sum, b) => sum + b.percentage, 0)).toFixed(1)}% unbranded mentions</span>
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
