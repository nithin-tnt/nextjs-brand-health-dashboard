"use client";

import Image from "next/image";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler
);

export function BrandHealthPanel() {
  const healthScore = 87;
  const trend = 5.2;
  const isPositive = trend > 0;

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [75, 78, 80, 82, 83, 85, 87],
        fill: true,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
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
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  };

  return (
    <div className="h-full relative overflow-hidden" style={{ backgroundColor: '#F6F6F6' }}>
      {/* Beating Heart Background - Large and Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          <Image
            src="/Heart.png"
            alt="Heart Hero"
            width={1400}
            height={1400}
            className="object-contain"
            style={{
              animation: 'heartbeat 2s ease-in-out infinite'
            }}
            priority
          />
        </div>
      </div>

      {/* Scattered Glassomorphic Cards */}
      <div className="relative z-10 h-full">
        {/* Health Score Card - Top Right */}
        <div 
          className="absolute top-20 right-16 w-56 backdrop-blur-xl bg-white/70 border border-white/50 rounded-2xl p-4 shadow-xl"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="text-center">
            <div className="inline-flex items-baseline gap-1.5 mb-1">
              <span className="text-5xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-600 to-emerald-600">
                {healthScore}
              </span>
              <span className="text-lg text-neutral-500">/ 100</span>
            </div>
            <h3 className="text-sm font-semibold text-neutral-800 mb-2">
              Brand Health Score
            </h3>
            <div className="flex items-center justify-center gap-1.5">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '+' : ''}{trend}%
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge Card - Right Middle */}
        <div 
          className="absolute right-8 top-1/2 -translate-y-1/2 backdrop-blur-xl bg-white/70 border border-white/50 rounded-2xl p-4 shadow-xl"
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="px-4 py-2 rounded-full bg-green-100 border border-green-200">
            <span className="text-green-700 font-semibold text-sm">Healthy</span>
          </div>
        </div>
      </div>

      {/* Heartbeat Animation */}
      <style jsx>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.05); }
          20% { transform: scale(1); }
          30% { transform: scale(1.05); }
          40% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
