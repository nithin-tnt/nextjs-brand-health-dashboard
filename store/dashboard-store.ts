import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Widget, DashboardLayout, UserRole } from "@/types/dashboard";

interface DashboardState {
  // Layout state
  layout: Widget[];
  dashboardId: string;
  theme: "light" | "dark" | "system";
  
  // User state
  userRole: UserRole;
  
  // UI state
  isWidgetPaletteOpen: boolean;
  expandedWidgetId: string | null;
  selectedWidgetId: string | null;
  isDragging: boolean;
  modalWidgetId: string | null;
  
  // Actions
  setLayout: (layout: Widget[]) => void;
  updateWidget: (widgetId: string, updates: Partial<Widget>) => void;
  addWidget: (widget: Widget) => void;
  removeWidget: (widgetId: string) => void;
  duplicateWidget: (widgetId: string) => void;
  
  // UI actions
  toggleWidgetPalette: () => void;
  setWidgetPaletteOpen: (isOpen: boolean) => void;
  expandWidget: (widgetId: string | null) => void;
  selectWidget: (widgetId: string | null) => void;
  setIsDragging: (isDragging: boolean) => void;
  openWidgetModal: (widgetId: string | null) => void;
  
  // Theme
  setTheme: (theme: "light" | "dark" | "system") => void;
  
  // Role
  setUserRole: (role: UserRole) => void;
  
  // Utilities
  canEdit: () => boolean;
  getWidget: (widgetId: string) => Widget | undefined;
  resetDashboard: () => void;
  loadDashboard: (dashboard: DashboardLayout) => void;
}

const initialState = {
  layout: [],
  dashboardId: "default",
  theme: "system" as const,
  userRole: "editor" as UserRole,
  isWidgetPaletteOpen: false,
  expandedWidgetId: null,
  selectedWidgetId: null,
  isDragging: false,
  modalWidgetId: null,
};

export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Layout actions
        setLayout: (layout) =>
          set({ layout }, false, "setLayout"),

        updateWidget: (widgetId, updates) =>
          set(
            (state) => ({
              layout: state.layout.map((widget) =>
                widget.widgetId === widgetId
                  ? { ...widget, ...updates }
                  : widget
              ),
            }),
            false,
            "updateWidget"
          ),

        addWidget: (widget) =>
          set(
            (state) => ({
              layout: [...state.layout, widget],
            }),
            false,
            "addWidget"
          ),

        removeWidget: (widgetId) =>
          set(
            (state) => ({
              layout: state.layout.filter((w) => w.widgetId !== widgetId),
              selectedWidgetId:
                state.selectedWidgetId === widgetId
                  ? null
                  : state.selectedWidgetId,
              expandedWidgetId:
                state.expandedWidgetId === widgetId
                  ? null
                  : state.expandedWidgetId,
            }),
            false,
            "removeWidget"
          ),

        duplicateWidget: (widgetId) =>
          set(
            (state) => {
              const widget = state.layout.find((w) => w.widgetId === widgetId);
              if (!widget) return state;

              const newWidget: Widget = {
                ...widget,
                widgetId: `${widget.type}-${Date.now()}`,
                x: widget.x + 1,
                y: widget.y + 1,
              };

              return {
                layout: [...state.layout, newWidget],
              };
            },
            false,
            "duplicateWidget"
          ),

        // UI actions
        toggleWidgetPalette: () =>
          set(
            (state) => ({
              isWidgetPaletteOpen: !state.isWidgetPaletteOpen,
            }),
            false,
            "toggleWidgetPalette"
          ),

        setWidgetPaletteOpen: (isOpen) =>
          set({ isWidgetPaletteOpen: isOpen }, false, "setWidgetPaletteOpen"),

        expandWidget: (widgetId) =>
          set({ expandedWidgetId: widgetId }, false, "expandWidget"),

        selectWidget: (widgetId) =>
          set({ selectedWidgetId: widgetId }, false, "selectWidget"),

        setIsDragging: (isDragging) =>
          set({ isDragging }, false, "setIsDragging"),

        openWidgetModal: (widgetId) =>
          set({ modalWidgetId: widgetId }, false, "openWidgetModal"),

        // Theme
        setTheme: (theme) => {
          set({ theme }, false, "setTheme");
          
          // Apply theme to document
          if (theme === "dark") {
            document.documentElement.classList.add("dark");
          } else if (theme === "light") {
            document.documentElement.classList.remove("dark");
          } else {
            // System preference
            const isDark = window.matchMedia(
              "(prefers-color-scheme: dark)"
            ).matches;
            if (isDark) {
              document.documentElement.classList.add("dark");
            } else {
              document.documentElement.classList.remove("dark");
            }
          }
        },

        // Role
        setUserRole: (role) =>
          set({ userRole: role }, false, "setUserRole"),

        // Utilities
        canEdit: () => {
          const { userRole } = get();
          return userRole === "editor" || userRole === "admin";
        },

        getWidget: (widgetId) => {
          const { layout } = get();
          return layout.find((w) => w.widgetId === widgetId);
        },

        resetDashboard: () =>
          set(
            {
              ...initialState,
              theme: get().theme,
              userRole: get().userRole,
            },
            false,
            "resetDashboard"
          ),

        loadDashboard: (dashboard) =>
          set(
            {
              layout: dashboard.layout,
              dashboardId: dashboard.dashboardId,
              theme: dashboard.metadata.theme,
            },
            false,
            "loadDashboard"
          ),
      }),
      {
        name: "dashboard-storage",
        partialize: (state) => ({
          layout: state.layout,
          dashboardId: state.dashboardId,
          theme: state.theme,
        }),
      }
    )
  )
);
