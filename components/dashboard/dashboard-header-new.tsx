"use client";

import { Avatar, Badge, Input } from "antd";
import { BellOutlined, SearchOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useState } from "react";

export function DashboardHeader() {
  return (
    <header className="px-8 py-4" style={{ backgroundColor: '#F6F6F6' }}>
      <div className="flex items-center justify-between">
        {/* Left: Logo and Navigation */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Pipaltree Logo" 
              width={160} 
              height={160}
              className="rounded-lg"
            />
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex items-center gap-1 rounded-full p-1 bg-[#EFEFEF]">
            <button className="px-6 py-2 rounded-full bg-white text-neutral-900 font-medium shadow-sm transition-all">
              Dashboard
            </button>
            <button className="px-6 py-2 rounded-full text-neutral-600 font-medium hover:text-neutral-900 transition-all">
              Analytics
            </button>
            <button className="px-6 py-2 rounded-full text-neutral-600 font-medium hover:text-neutral-900 transition-all">
              Reports
            </button>
            <button className="px-6 py-2 rounded-full text-neutral-600 font-medium hover:text-neutral-900 transition-all">
              Insights
            </button>
          </nav>
        </div>

        {/* Right: Search, Notification, Profile */}
        <div className="flex items-center gap-3">
          {/* Search Bar */}
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined className="text-neutral-400" />}
            className="w-64"
            style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              height: '40px'
            }}
          />

          {/* Notification Bell */}
          <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-200 transition-colors">
            <Badge dot>
              <BellOutlined className="text-xl text-neutral-700" />
            </Badge>
          </button>

          {/* Profile Avatar */}
          <Avatar
            size={30}
            style={{ backgroundColor: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', height: '42px' }}
            className="cursor-pointer"
          >
            <span style={{ fontSize: '16px', lineHeight: '1' }}>U</span>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
