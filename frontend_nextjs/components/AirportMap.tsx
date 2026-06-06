"use client";

import React, { useEffect, useState } from 'react';
import { Plane, Users, ShieldCheck, DoorOpen } from 'lucide-react';

const AirportMap = () => {
  const [simStep, setSimStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSimStep((prev) => (prev + 1) % 4);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stages = [
    { id: 0, label: 'Arrival', icon: Plane, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 1, label: 'Check-In', icon: Users, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 2, label: 'Security', icon: ShieldCheck, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 3, label: 'Boarding', icon: DoorOpen, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-bold text-gray-800 mb-8">Live Simulation Flow</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
        {/* Connection Lines */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 -z-0" />
        
        {stages.map((stage, idx) => {
          const isActive = simStep === stage.id;
          const Icon = stage.icon;
          
          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center gap-4 group">
              <div className={`
                w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500
                ${isActive ? `${stage.bg} scale-110 shadow-lg ring-4 ring-offset-4 ring-${stage.color.split('-')[1]}-200` : 'bg-white border border-gray-100 shadow-sm'}
              `}>
                <Icon className={`w-10 h-10 ${isActive ? stage.color : 'text-gray-300'}`} />
              </div>
              <span className={`text-sm font-bold ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                {stage.label}
              </span>
              
              {isActive && (
                <div className="absolute -top-12 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md animate-bounce">
                  PASSENGERS IN FLOW
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl">
          <span className="text-xs text-gray-500 uppercase font-bold">Process Load</span>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '65%' }} />
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-xl">
          <span className="text-xs text-gray-500 uppercase font-bold">Efficiency</span>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: '92%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirportMap;
