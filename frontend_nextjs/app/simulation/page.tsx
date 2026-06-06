"use client";

import React from 'react';
import AirportMap from '@/components/AirportMap';
import MetricsCard from '@/components/MetricsCard';
import { Activity, Clock, Users, Zap } from 'lucide-react';

const SimulationPage = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Discrete Event Simulator</h1>
          <p className="text-gray-500">Visualizing high-fidelity agent-based airport logic</p>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700">
          Reset Environment
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Flow Visualizer */}
        <div className="xl:col-span-2">
          <AirportMap />
        </div>

        {/* Live Logs / Stats */}
        <div className="xl:col-span-1 bg-gray-900 rounded-2xl p-6 text-white shadow-xl">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" /> Live Simulation Logs
          </h3>
          <div className="space-y-4 h-96 overflow-y-auto font-mono text-xs text-gray-400">
            <div className="border-l-2 border-blue-500 pl-4 py-1">
              <span className="text-blue-400">[08:12:44]</span> Flight FL-102 predicted delay: 12.4m
            </div>
            <div className="border-l-2 border-green-500 pl-4 py-1">
              <span className="text-green-400">[08:13:01]</span> Pax P-12-04 successfully checked in.
            </div>
            <div className="border-l-2 border-purple-500 pl-4 py-1">
              <span className="text-purple-400">[08:13:15]</span> Security Lane 2 congestion detected.
            </div>
            <div className="border-l-2 border-orange-500 pl-4 py-1">
              <span className="text-orange-400">[08:14:02]</span> ML Update: Avg satisfaction dropping.
            </div>
            <div className="animate-pulse border-l-2 border-gray-700 pl-4 py-1">
              <span className="text-gray-600">Processing next event queue...</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricsCard title="Processing Speed" value="1.2s/Agent" icon={Zap} />
        <MetricsCard title="Active Resources" value="18/25" icon={Users} />
        <MetricsCard title="Event Rate" value="45/min" icon={Activity} />
        <MetricsCard title="Sim Time Scale" value="10x" icon={Clock} />
      </div>
    </div>
  );
};

export default SimulationPage;
