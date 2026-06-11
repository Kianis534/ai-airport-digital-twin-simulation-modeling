"use client";

import React from 'react';
import { useSimulation } from '@/context/SimulationContext';
import { BrainCircuit, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAdvisorPanel = () => {
  const { activeAdvice, metrics } = useSimulation();
  
  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] p-10 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/5 rounded-full -mr-32 -mt-32 blur-[100px]" />
      
      <div className="flex flex-col lg:flex-row lg:items-center gap-10 relative z-10">
        <div className="space-y-6 flex-1">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-500/20">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Advisor</h2>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Real-Time Operational Support</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeAdvice ? (
              <motion.div 
                key={activeAdvice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  activeAdvice.type === 'risk' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                }`}>
                  <AlertTriangle className="w-3 h-3" />
                  {activeAdvice.type} Detected
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {activeAdvice.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                  {activeAdvice.message}
                </p>
                
                <div className="p-6 bg-brand-50/50 rounded-[2rem] border border-brand-100/50 space-y-3">
                  <div className="flex items-center gap-2 text-brand-600">
                    <Zap className="w-4 h-4 fill-current" />
                    <span className="text-xs font-black uppercase tracking-widest">Strategic Recommendation</span>
                  </div>
                  <p className="text-slate-900 font-bold text-sm leading-relaxed">
                    {activeAdvice.suggestion}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="healthy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 py-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 className="w-3 h-3" />
                  Operations Optimized
                </div>
                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  Airport Flow is Efficient
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                  AI models (LSTM & XGBoost) indicate that current resource allocation is sufficient for the active traffic load.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:w-72 space-y-4 shrink-0">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">System Confidence</p>
            <div className="relative w-32 h-32 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-200"
                />
                <circle
                  cx="64" cy="64" r="58"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={364}
                  strokeDashoffset={364 - (364 * Math.min(100, metrics.satisfaction + 5)) / 100}
                  className="text-brand-600 transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 leading-none">{Math.round(metrics.satisfaction)}%</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Model Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisorPanel;
