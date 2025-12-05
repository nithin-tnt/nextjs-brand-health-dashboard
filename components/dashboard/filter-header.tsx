"use client";

import { DatePicker } from "antd";
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useState } from "react";

const { RangePicker } = DatePicker;

interface FilterHeaderProps {
  onAddWidget?: () => void;
}

export function FilterHeader({ onAddWidget }: FilterHeaderProps) {
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
    dayjs().subtract(7, 'days'),
    dayjs()
  ]);
  const [timeframe, setTimeframe] = useState<string>("Daily");

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="px-8 py-4 border-t border-gray-200" style={{ backgroundColor: '#F6F6F6' }}>
      <div className="flex items-center justify-between">
        {/* Left: Title or Greeting */}
        <div>
          <h2 className="text-2xl font-semibold text-neutral-900">
            {getGreeting()}, Analyst!
          </h2>
          <p className="text-md text-neutral-900 mt-2">
            Your Brand Health Overview
          </p>
        </div>

        {/* Right: Date Range Picker, Timeframe Toggle, and Add Widget Button */}
        <div className="flex items-center gap-3">
          {/* Date Range Picker */}
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
            suffixIcon={<CalendarOutlined />}
            className="h-10"
            format="MMM DD, YYYY"
            presets={[
              { label: 'Last 7 Days', value: [dayjs().subtract(7, 'days'), dayjs()] },
              { label: 'Last 30 Days', value: [dayjs().subtract(30, 'days'), dayjs()] },
              { label: 'Last 90 Days', value: [dayjs().subtract(90, 'days'), dayjs()] },
            ]}
          />

          {/* Daily/Weekly/Monthly Toggle - iOS Style */}
          <div className="flex items-center gap-1 bg-[#EFEFEF] rounded-full p-1">
            <button
              onClick={() => setTimeframe('Daily')}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                timeframe === 'Daily'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('Weekly')}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                timeframe === 'Weekly'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('Monthly')}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                timeframe === 'Monthly'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Add Widget Button */}
          <button
            onClick={onAddWidget}
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full font-medium hover:bg-neutral-700 hover:text-black transition-all shadow-sm cursor-pointer hover:shadow-md"
          >
            <PlusOutlined className="text-sm" />
            Add Widget
          </button>
        </div>
      </div>
    </div>
  );
}
