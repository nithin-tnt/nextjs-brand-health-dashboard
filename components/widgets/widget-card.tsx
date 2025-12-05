"use client";

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreVertical,
  Maximize2,
  Settings,
  Copy,
  Trash2,
  Lock,
  Unlock,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDashboardStore } from "@/store/dashboard-store";

interface WidgetCardProps {
  widgetId: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  showMenu?: boolean;
  onExpand?: () => void;
  onSettings?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onToggleLock?: () => void;
  isLocked?: boolean;
  isLoading?: boolean;
  error?: string;
}

export const WidgetCard = memo(function WidgetCard({
  widgetId,
  title,
  children,
  className,
  icon,
  showMenu = true,
  onExpand,
  onSettings,
  onDuplicate,
  onRemove,
  onToggleLock,
  isLocked = false,
  isLoading = false,
  error,
}: WidgetCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isDragging = useDashboardStore((state) => state.isDragging);
  const canEdit = useDashboardStore((state) => state.canEdit());

  const handleExpand = () => {
    if (onExpand) {
      onExpand();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "relative h-full flex flex-col",
        "bg-white",
        "rounded-2xl",
        "border border-gray-200",
        "overflow-hidden",
        "transition-all duration-200",
        !isDragging && "hover:shadow-lg hover:border-gray-300",
        className
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false);
        setMenuOpen(false);
      }}
      role="article"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {canEdit && !isLocked && (
            <div
              className="widget-drag-handle cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Drag handle"
            >
              <GripVertical className="w-5 h-5" />
            </div>
          )}
          
          {icon && (
            <div className="text-neutral-700 shrink-0">
              {icon}
            </div>
          )}

          <h3 className="font-semibold text-neutral-900 truncate text-lg">
            {title}
          </h3>
          
          {isLocked && (
            <Lock className="w-3 h-3 text-neutral-400 ml-2" aria-label="Locked" />
          )}
        </div>

        {/* Actions */}
        {showMenu && (
          <div className="flex items-center gap-1">
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center gap-1"
                >
                  {onExpand && (
                    <button
                      onClick={handleExpand}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                      aria-label="Expand widget"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  )}

                  {canEdit && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                        aria-label="Widget menu"
                        aria-expanded={menuOpen}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {menuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-neutral-200 py-1 z-10"
                            role="menu"
                          >

                            {onRemove && (
                              <>
                                <div className="h-px bg-neutral-200 my-1" />
                                <button
                                  onClick={() => {
                                    onRemove();
                                    setMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-red-700 hover:text-white cursor-pointer"
                                  role="menuitem"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </button>
                              </>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 overflow-auto p-4 cursor-pointer"
        onClick={handleExpand}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="text-danger-600">
              <p className="text-sm font-medium">Error loading data</p>
              <p className="text-xs mt-1">{error}</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  );
});
