"use client";

import { TrendingUp, BarChart3, Maximize2, GripVertical, Heart } from "lucide-react";
import { Line } from "react-chartjs-2";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

interface MetricCardProps {
  title: string;
  value: string;
  trend: string;
  onDetail: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  index: number;
  isDragOver: boolean;
}

function MetricCard({ title, value, trend, onDetail, onDragStart, onDragOver, onDrop, index, isDragOver }: MetricCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div 
      className={`rounded-xl p-4 border cursor-move transition-all group ${
        isDragOver
          ? 'bg-gray-100 border-dashed border-gray-400'
          : isDragging 
          ? 'opacity-40' 
          : 'bg-neutral-50 border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e, index);
      }}
      onDragEnd={() => setIsDragging(false)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
    >
      {isDragOver ? (
        <div className="flex items-center justify-center h-20 text-gray-400">
          <GripVertical className="w-6 h-6" />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
              <h3 className="text-sm font-medium text-neutral-700">{title}</h3>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDetail();
              }}
              className="text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              aria-label="Expand details"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
          <div className="text-2xl font-bold text-neutral-900 mb-1">{value}</div>
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        </>
      )}
    </div>
  );
}

export function BrandHealthOverviewWidget() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [metrics, setMetrics] = useState([
    { title: "Sentiment Score", value: "85%", trend: "+5.2%" },
    { title: "Engagement", value: "92%", trend: "+3.8%" },
    { title: "Satisfaction", value: "84%", trend: "+2.1%" },
  ]);

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [65, 70, 68, 75, 72, 78, 80],
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  const handleMetricDetail = (metricTitle: string) => {
    setSelectedMetric(metricTitle);
    setModalOpen(true);
  };

  const getMetricDetails = (metricTitle: string) => {
    switch (metricTitle) {
      case "Sentiment Score":
        return {
          stats: [
            { label: "Overall Sentiment", value: "85%", sublabel: "+5.2% vs last month", color: "blue" },
            { label: "Positive Mentions", value: "12.5K", sublabel: "68% of total", color: "green" },
            { label: "Brand Favorability", value: "92%", sublabel: "Industry avg: 78%", color: "purple" },
            { label: "Negative Mentions", value: "3.1K", sublabel: "15% of total", color: "orange" }
          ],
          currentValue: "85%",
          trend: "+5.2%",
          avgValue: "78%",
          avgVariance: "±4.1%",
          peak: "92%",
          peakTime: "2 days ago",
          low: "65%",
          lowTime: "21 days ago",
          week1: "68%",
          week2: "75%",
          week3: "83%",
          week4: "85%",
          insights: [
            "Strong positive sentiment surge in social media mentions",
            "Brand perception improved after recent product launch",
            "Customer reviews showing 15% increase in positive ratings",
            "Sentiment peak coincided with influencer campaign"
          ]
        };
      case "Engagement":
        return {
          stats: [
            { label: "Engagement Rate", value: "92%", sublabel: "+3.8% this week", color: "blue" },
            { label: "Active Users", value: "45.2K", sublabel: "Daily average", color: "green" },
            { label: "Interaction Score", value: "96%", sublabel: "All-time high", color: "purple" },
            { label: "Content Reach", value: "2.8M", sublabel: "+22% growth", color: "orange" }
          ],
          currentValue: "92%",
          trend: "+3.8%",
          avgValue: "87%",
          avgVariance: "±2.8%",
          peak: "96%",
          peakTime: "Yesterday",
          low: "79%",
          lowTime: "18 days ago",
          week1: "82%",
          week2: "88%",
          week3: "91%",
          week4: "92%",
          insights: [
            "Social media engagement rate exceeds industry benchmark",
            "Video content driving 40% more interactions",
            "User-generated content campaigns boosting participation",
            "Peak engagement during weekend posts"
          ]
        };
      case "Satisfaction":
        return {
          stats: [
            { label: "CSAT Score", value: "84%", sublabel: "+2.1% improvement", color: "blue" },
            { label: "NPS Score", value: "67", sublabel: "Promoters: 72%", color: "green" },
            { label: "Resolution Rate", value: "89%", sublabel: "First contact: 76%", color: "purple" },
            { label: "Avg Response Time", value: "2.3h", sublabel: "30% faster", color: "orange" }
          ],
          currentValue: "84%",
          trend: "+2.1%",
          avgValue: "81%",
          avgVariance: "±3.5%",
          peak: "89%",
          peakTime: "5 days ago",
          low: "72%",
          lowTime: "25 days ago",
          week1: "75%",
          week2: "82%",
          week3: "87%",
          week4: "84%",
          insights: [
            "Customer satisfaction improved after service updates",
            "Support response time reduced by 30%",
            "Product quality ratings up 12% this month",
            "Recent NPS score shows strong loyalty indicators"
          ]
        };
      default:
        return {
          stats: [
            { label: "Current Value", value: "85%", sublabel: "+5.2% this period", color: "blue" },
            { label: "30-Day Average", value: "81%", sublabel: "±3.2%", color: "purple" },
            { label: "Peak Performance", value: "95%", sublabel: "Yesterday", color: "green" },
            { label: "Lowest Point", value: "68%", sublabel: "14 days ago", color: "orange" }
          ],
          currentValue: "85%",
          trend: "+5.2%",
          avgValue: "81%",
          avgVariance: "±3.2%",
          peak: "95%",
          peakTime: "Yesterday",
          low: "68%",
          lowTime: "14 days ago",
          week1: "72%",
          week2: "81%",
          week3: "91%",
          week4: "87%",
          insights: [
            "Consistent upward trend in week 3",
            "Above average performance for 18 days",
            "Slight decline in recent 5 days",
            "Peak reached on day 22"
          ]
        };
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newMetrics = [...metrics];
    const draggedItem = newMetrics[draggedIndex];
    newMetrics.splice(draggedIndex, 1);
    newMetrics.splice(dropIndex, 0, draggedItem);
    
    setMetrics(newMetrics);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <div className="h-full bg-white rounded-2xl border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900">Brand Health Metrics</h2>
        </div>

        {/* Three Small Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              trend={metric.trend}
              index={index}
              isDragOver={dragOverIndex === index && draggedIndex !== index}
              onDetail={() => handleMetricDetail(metric.title)}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>

        {/* Bottom Card with Number and Chart */}
        <div className="bg-neutral-50 rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-6">
            {/* Left: Number Card */}
            <div className="flex-shrink-0">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="text-sm text-neutral-600 mb-1">Overall Score</div>
                <div className="text-4xl font-bold text-neutral-900">87</div>
                <div className="flex items-center gap-1 text-green-600 text-sm mt-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>+5.2%</span>
                </div>
              </div>
            </div>

            {/* Right: Chart */}
            <div className="flex-1">
              <div className="text-sm font-medium text-neutral-700 mb-2">7-Day Trend</div>
              <div className="h-24">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
          onClick={() => setModalOpen(false)}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#56BE8C]/10 rounded-lg">
                  <Heart className="w-5 h-5 text-[#56BE8C]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900">{selectedMetric}</h2>
                  <p className="text-sm text-neutral-600">Detailed analytics and performance metrics</p>
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
              {/* Main Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                {selectedMetric && getMetricDetails(selectedMetric).stats.map((stat, idx) => {
                  const colorClasses = {
                    blue: { bg: 'from-blue-50 to-blue-100', border: 'border-blue-200', text: 'text-blue-600', value: 'text-blue-900' },
                    green: { bg: 'from-green-50 to-green-100', border: 'border-green-200', text: 'text-green-600', value: 'text-green-900' },
                    purple: { bg: 'from-purple-50 to-purple-100', border: 'border-purple-200', text: 'text-purple-600', value: 'text-purple-900' },
                    orange: { bg: 'from-orange-50 to-orange-100', border: 'border-orange-200', text: 'text-orange-600', value: 'text-orange-900' }
                  }[stat.color as 'blue' | 'green' | 'purple' | 'orange'];

                  return (
                    <div key={idx} className={`bg-gradient-to-br ${colorClasses.bg} rounded-xl p-5 border ${colorClasses.border}`}>
                      <div className={`text-sm ${colorClasses.text} mb-2 font-medium`}>{stat.label}</div>
                      <div className={`text-4xl font-bold ${colorClasses.value} mb-2`}>
                        {stat.value}
                      </div>
                      <div className={`text-sm ${colorClasses.text}`}>
                        {stat.sublabel}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 30-Day Trend Chart */}
              <div className="bg-neutral-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">30-Day Performance Trend</h3>
                <div className="h-72">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* Detailed Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-4">Performance Breakdown</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Week 1 Avg</span>
                      <span className="font-semibold text-neutral-900">
                        {selectedMetric && getMetricDetails(selectedMetric).week1}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Week 2 Avg</span>
                      <span className="font-semibold text-neutral-900">
                        {selectedMetric && getMetricDetails(selectedMetric).week2}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Week 3 Avg</span>
                      <span className="font-semibold text-neutral-900">
                        {selectedMetric && getMetricDetails(selectedMetric).week3}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Week 4 Avg</span>
                      <span className="font-semibold text-neutral-900">
                        {selectedMetric && getMetricDetails(selectedMetric).week4}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border border-gray-200">
                  <h4 className="text-sm font-semibold text-neutral-700 mb-4">Key Insights</h4>
                  <div className="space-y-3">
                    {selectedMetric && getMetricDetails(selectedMetric).insights.map((insight, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          idx === 0 ? 'bg-green-500' :
                          idx === 1 ? 'bg-blue-500' :
                          idx === 2 ? 'bg-yellow-500' :
                          'bg-purple-500'
                        }`}></div>
                        <span className="text-sm text-neutral-600">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
