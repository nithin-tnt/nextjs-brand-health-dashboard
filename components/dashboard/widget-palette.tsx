"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus } from "lucide-react";
import * as Icons from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";
import { WIDGET_CATALOG, createWidgetFromCatalog, findOptimalPosition } from "@/lib/widget-catalog";
import { cn } from "@/lib/utils";

export function WidgetPalette() {
  const isOpen = useDashboardStore((state) => state.isWidgetPaletteOpen);
  const setOpen = useDashboardStore((state) => state.setWidgetPaletteOpen);
  const addWidget = useDashboardStore((state) => state.addWidget);
  const removeWidget = useDashboardStore((state) => state.removeWidget);
  const layout = useDashboardStore((state) => state.layout);

  const handleAddWidget = (catalogItem: typeof WIDGET_CATALOG[0]) => {
    const position = findOptimalPosition(layout, catalogItem.defaultSize);
    const newWidget = createWidgetFromCatalog(catalogItem, position);
    addWidget(newWidget);
    setOpen(false);
  };

  const handleRemoveWidget = (widgetType: string) => {
    const widgetToRemove = layout.find(w => w.type === widgetType);
    if (widgetToRemove) {
      removeWidget(widgetToRemove.widgetId);
    }
  };

  const isWidgetAdded = (widgetType: string) => {
    return layout.some(w => w.type === widgetType);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-1040"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-1050 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between" style={{ backgroundColor: '#56BE8C' }}>
              <div>
                <h2 className="text-xl font-bold text-black">
                  Add Widget
                </h2>
                <p className="text-neutral-400 text-sm mt-1">
                  Choose a widget to add to your dashboard
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-800 text-black transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ backgroundColor: '#F6F6F6' }}>
              {/* Categories */}
              {["hero", "metrics", "analytics", "comparison", "alerts"].map((category) => {
                const widgets = WIDGET_CATALOG.filter((w) => w.category === category);
                if (widgets.length === 0) return null;

                return (
                  <div key={category}>
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="h-px flex-1 bg-neutral-200"></div>
                      {category}
                      <div className="h-px flex-1 bg-neutral-200"></div>
                    </h3>
                    <div className="space-y-3">
                      {widgets.map((widget) => {
                        const IconComponent = (Icons as any)[widget.icon] || Plus;
                        const isAdded = isWidgetAdded(widget.type);
                        
                        return (
                          <button
                            key={widget.type}
                            onClick={() => isAdded ? handleRemoveWidget(widget.type) : handleAddWidget(widget)}
                            className={cn(
                              "w-full p-4 rounded-2xl border border-gray-200",
                              "hover:shadow-lg",
                              "bg-white hover:bg-neutral-50",
                              "transition-all duration-200",
                              "text-left group relative overflow-hidden",
                              isAdded && "bg-neutral-50"
                            )}
                          >
                            {/* Hover accent */}
                            <div className={cn(
                              "absolute top-0 left-0 w-1 h-full transition-transform origin-top",
                              isAdded ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                            )} style={{ backgroundColor: '#56BE8C' }}></div>
                            
                            <div className="flex items-start gap-4 pl-2">
                              <div className="p-3 rounded-xl text-white shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all" style={{ backgroundColor: '#56BE8C' }}>
                                <IconComponent className="w-6 h-6" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-neutral-900 mb-1 transition-colors" style={{ color: undefined }}>
                                  {widget.name}
                                </h4>
                                <p className="text-sm text-neutral-600 line-clamp-2">
                                  {widget.description}
                                </p>
                                <div className="mt-2 text-xs text-neutral-400">
                                  Size: {widget.defaultSize.w}×{widget.defaultSize.h}
                                </div>
                              </div>
                              <div className="shrink-0 self-center">
                                <div 
                                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:cursor-pointer"
                                  style={{ backgroundColor: isAdded ? '#56BE8C' : undefined }}
                                  onMouseEnter={(e) => !isAdded && (e.currentTarget.style.backgroundColor = '#56BE8C')}
                                  onMouseLeave={(e) => !isAdded && (e.currentTarget.style.backgroundColor = '')}
                                >
                                  <div className={!isAdded ? "bg-neutral-100 w-8 h-8 rounded-full flex items-center justify-center hover:cursor-pointer" : "hover:cursor-pointer"}>
                                    {isAdded ? (
                                      <Minus className="w-4 h-4 text-white transition-colors" />
                                    ) : (
                                      <Plus className="w-4 h-4 text-neutral-400 transition-colors" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
