"use client";

import React, { useEffect, useState } from 'react';
import MetricsCard from '@/components/MetricsCard';
import { Plane, Clock, Smile, Users, BarChart3 } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { apiService } from '@/services/api';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    activeFlights: 12,
    avgDelay: 15.4,
    satisfaction: 88,
    queueLength: 24,
  });

  const [chartData, setChartData] = useState([
    { time: '08:00', pax: 120, wait: 12 },
    { time: '09:00', pax: 450, wait: 28 },
    { time: '10:00', pax: 380, wait: 22 },
    { time: '11:00', pax: 210, wait: 14 },
    { time: '12:00', pax: 540, wait: 35 },
  ]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Airport Digital Twin Dashboard</h1>
          <p className="text-gray-500">Real-time operational monitoring & AI insights</p>
        </div>
        <div className="flex gap-4">
          <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            System Live
          </span>
        </div>
      </header>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard title="Active Flights" value={metrics.activeFlights} icon={Plane} trend="+2" trendColor="text-green-500" />
        <MetricsCard title="Avg Delay" value={`${metrics.avgDelay}m`} icon={Clock} trend="-4.2%" trendColor="text-green-500" />
        <MetricsCard title="Satisfaction" value={`${metrics.satisfaction}%`} icon={Smile} trend="+0.5%" trendColor="text-green-500" />
        <MetricsCard title="Security Queue" value={metrics.queueLength} icon={Users} trend="+5" trendColor="text-red-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" /> Passenger Load Trend
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPax" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="pax" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPax)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" /> Queue Wait Times (mins)
            </h2>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="wait" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
