"use client";

import { Plus, Activity } from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";

export function DashboardHeader() {
  const toggleWidgetPalette = useDashboardStore((state) => state.toggleWidgetPalette);
  const canEdit = useDashboardStore((state) => state.canEdit());

  return (
    <header className="sticky top-0 z-30 bg-white/90 border-b border-neutral-200 shadow-sm backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              Brand Health Analytics
            </h1>
            <p className="text-xs text-neutral-500">Real-time insights dashboard</p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">
          {/* Add Widget Button */}
          {canEdit && (
            <button
              onClick={toggleWidgetPalette}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Widget</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
