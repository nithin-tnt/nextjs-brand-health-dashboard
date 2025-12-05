"use client";

import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { cn, getTrendDirection } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard-store";
import type { BrandHealthData } from "@/types/dashboard";

interface BrandHealthHeartWidgetProps {
  widgetId: string;
  data?: BrandHealthData;
  isLoading?: boolean;
  error?: string;
  onExpand?: () => void;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
}

export function BrandHealthHeartWidget({
  widgetId,
  data,
  isLoading,
  error,
  onExpand,
  onSettings,
  onDuplicate,
  onRemove,
}: BrandHealthHeartWidgetProps) {
  const getWidget = useDashboardStore((state) => state.getWidget);
  const widget = getWidget(widgetId);

  if (!widget) return null;

  const score = data?.score ?? 0;
  const status = data?.status ?? "moderate";
  const trend = data?.trend ?? "stable";

  // Determine heart color and animation based on health score
  const getHeartColor = () => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "danger";
  };

  const heartColor = getHeartColor();

  const getStatusColor = () => {
    if (score >= 80) return "text-success-600";
    if (score >= 50) return "text-warning-600";
    return "text-danger-600";
  };

  const getStatusLabel = () => {
    if (score >= 80) return "Healthy";
    if (score >= 50) return "Needs Attention";
    return "Critical";
  };

  const getStatusBgColor = () => {
    if (score >= 80) return "bg-success-50 border-success-200";
    if (score >= 50) return "bg-warning-50 border-warning-200";
    return "bg-danger-50 border-danger-200";
  };

  const getPulseAnimation = () => {
    if (score >= 80) return { duration: 1.5, scale: [1, 1.08, 1] };
    if (score >= 50) return { duration: 2, scale: [1, 1.05, 1] };
    return { duration: 1, scale: [1, 1.03, 1, 1.03, 1] };
  };

  const trendDirection = getTrendDirection(data?.change ?? 0);
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-danger-600">Error loading data</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6 py-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-1">Brand Health</h2>
        <p className="text-sm text-neutral-500">Overall health score</p>
      </div>
      {data && (
        <div className="h-full flex flex-col items-center justify-between gap-8">
          {/* 3D Heart with Animation */}
          <div className="relative shrink-0">
            <motion.div
              animate={{
                scale: getPulseAnimation().scale,
              }}
              transition={{
                duration: getPulseAnimation().duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative"
            >
              <div
                className={cn(
                  "w-56 h-56 relative",
                  score < 50 && "animate-pulse"
                )}
              >
                {/* Heart SVG with gradient */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-full h-full drop-shadow-2xl"
                >
                  <defs>
                    <linearGradient id={`heartGradient-${widgetId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                      {heartColor === "success" && (
                        <>
                          <stop offset="0%" stopColor="rgb(74, 222, 128)" />
                          <stop offset="100%" stopColor="rgb(22, 163, 74)" />
                        </>
                      )}
                      {heartColor === "warning" && (
                        <>
                          <stop offset="0%" stopColor="rgb(251, 191, 36)" />
                          <stop offset="100%" stopColor="rgb(217, 119, 6)" />
                        </>
                      )}
                      {heartColor === "danger" && (
                        <>
                          <stop offset="0%" stopColor="rgb(248, 113, 113)" />
                          <stop offset="100%" stopColor="rgb(220, 38, 38)" />
                        </>
                      )}
                    </linearGradient>
                    <filter id={`glow-${widgetId}`}>
                      <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                    fill={`url(#heartGradient-${widgetId})`}
                    filter={score >= 80 ? `url(#glow-${widgetId})` : undefined}
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className={score >= 80 ? "text-success-300" : "text-transparent"}
                  />
                </svg>

                {/* Health Score Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white drop-shadow-lg">
                      {score}
                    </div>
                    <div className="text-xs font-medium text-white/90 uppercase tracking-wide">
                      Health
                    </div>
                  </div>
                </div>

                {/* Particle effects for healthy heart */}
                {score >= 80 && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-success-400 rounded-full"
                        style={{
                          top: "50%",
                          left: "50%",
                        }}
                        animate={{
                          x: [0, (Math.cos(i * 60 * Math.PI / 180) * 60)],
                          y: [0, (Math.sin(i * 60 * Math.PI / 180) * 60)],
                          opacity: [1, 0],
                          scale: [1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                          ease: "easeOut",
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.div>

            {/* Heart Rate Overlay Widget */}
            <div className="absolute -top-3 -right-3 bg-white rounded-2xl shadow-lg px-4 py-2 border border-neutral-200">
              <div className="flex items-center gap-2">
                <Activity className={cn("w-5 h-5", getStatusColor())} />
                <div className="text-sm font-bold text-neutral-900">
                  {score >= 80 ? "72" : score >= 50 ? "65" : "85"} BPM
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={cn(
            "px-6 py-3 rounded-2xl border-2 shadow-sm",
            getStatusBgColor()
          )}>
            <div className={cn("text-xl font-bold text-center", getStatusColor())}>
              {getStatusLabel()}
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="flex items-center justify-center gap-3 px-4 py-2 bg-neutral-50 rounded-xl">
            <TrendIcon
              className={cn(
                "w-5 h-5",
                trendDirection === "up" ? "text-success-600" : "text-danger-600"
              )}
            />
            <span className="text-sm font-medium text-neutral-700">
              {data.change > 0 ? '+' : ''}{data.change.toFixed(1)}%
            </span>
            <span className="text-sm text-neutral-500">
              {trend === "improving" && "Improving"}
              {trend === "stable" && "Stable"}
              {trend === "declining" && "Declining"}
            </span>
          </div>

          {/* Sparkline */}
          <div className="w-full">
            <div className="text-xs font-medium text-neutral-500 mb-2 text-center">
              Last 10 days trend
            </div>
            <div className="flex items-end justify-between gap-1 h-16 px-2">
              {data.sparkline?.map((value, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm transition-all",
                    value >= 80 ? "bg-success-400" :
                    value >= 50 ? "bg-warning-400" :
                    "bg-danger-400"
                  )}
                  style={{ height: `${(value / 100) * 100}%` }}
                />
              ))}
            </div>
          </div>

          {/* Health Factors */}
          <div className="w-full space-y-3">
            <div className="text-sm font-medium text-neutral-700 text-center mb-3">
              Health Factors
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-linear-to-r from-neutral-50 to-transparent rounded-xl border border-neutral-100">
                <span className="text-sm font-medium text-neutral-600">Sentiment</span>
                <span className="text-lg font-bold text-neutral-900">{data.factors.sentiment}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-linear-to-r from-neutral-50 to-transparent rounded-xl border border-neutral-100">
                <span className="text-sm font-medium text-neutral-600">Engagement</span>
                <span className="text-lg font-bold text-neutral-900">{data.factors.engagement}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-linear-to-r from-neutral-50 to-transparent rounded-xl border border-neutral-100">
                <span className="text-sm font-medium text-neutral-600">Satisfaction</span>
                <span className="text-lg font-bold text-neutral-900">{data.factors.satisfaction}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
