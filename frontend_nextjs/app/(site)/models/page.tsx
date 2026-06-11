import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Smile, LineChart, Timer, Database, Zap } from 'lucide-react';

export default function ModelsPage() {
  const models = [
    {
      title: "Flight Delay Regressor",
      icon: ShieldAlert,
      tag: "XGBoost",
      desc: "Predicts arrival delays. Vital for simulation schedule ripple effects.",
      dataset: "US DOT Aviation Dataset (1.2M Records)",
      trainTime: "142s (on NVIDIA RTX 3080)",
      speed: "0.04ms Inference",
      features: ["rush_hour", "weather_cat", "TAXI_OUT"],
      metric: "~4.2m MAE"
    },
    {
      title: "Satisfaction Classifier",
      icon: Smile,
      tag: "XGBoost",
      desc: "Categorizes passenger CX based on cumulative wait trajectory.",
      dataset: "Kaggle Airline Passenger Satisfaction",
      trainTime: "88s",
      speed: "0.02ms Inference",
      features: ["wait_time", "age", "class"],
      metric: "88.5% Accuracy"
    },
    {
      title: "Traffic Forecaster",
      icon: LineChart,
      tag: "LSTM (RNN)",
      desc: "Predicts future demand loads to scale airport resources.",
      dataset: "IATA Traffic Stats (5 Years History)",
      trainTime: "620s (100 Epochs)",
      speed: "0.15ms Inference",
      features: ["month", "prev_load", "holiday"],
      metric: "~25.6 pax/hr RMSE"
    }
  ];

  return (
    <div className="space-y-24 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Page Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          Training & Datasets
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-slate-900 leading-tight">
          Model Specifications <br className="hidden md:block" />
          <span className="text-brand-600">& Training Data.</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
          Comprehensive details on the datasets, training speed, and inference performance of our neural core. 
          Each model is represented in real-time on our <a href="/graphs-stats" className="text-brand-600 font-black hover:underline underline-offset-4">Live Analytics Suite</a>.
        </p>
      </div>

      {/* Integration Callout */}
      <section className="bg-brand-600 text-white rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
         <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl">
               <h2 className="text-3xl font-black tracking-tight leading-tight">Live Simulation Integration</h2>
               <p className="text-brand-100 font-medium">
                  Our models are not static experiments. The **LSTM** drives the passenger inflow rates in the 3D scene, while **XGBoost** provides the real-time latency and satisfaction metrics you see on the Graphs page. 
               </p>
            </div>
            <Link href="/graphs-stats" className="px-10 py-5 bg-white text-brand-600 font-black rounded-2xl hover:bg-brand-50 transition-all shrink-0 shadow-xl">
               PROVE THE CORRELATION
            </Link>
         </div>
      </section>

      {/* Models Grid */}
      <section className="grid grid-cols-1 gap-12">
        {models.map((model, idx) => {
          const Icon = model.icon;
          return (
            <div 
              key={idx}
              className="bg-white border border-slate-100 p-10 md:p-14 rounded-[3.5rem] shadow-sm hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              {/* Info Column */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center shadow-sm">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-widest rounded-lg mb-2">
                      {model.tag} Engine
                    </span>
                    <h3 className="font-black text-3xl text-slate-900 tracking-tight leading-none">
                      {model.title}
                    </h3>
                  </div>
                </div>

                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                  {model.desc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                   <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-brand-400" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Dataset</p>
                        <p className="text-xs font-bold text-slate-900">{model.dataset}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-brand-400" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Train Time</p>
                        <p className="text-xs font-bold text-slate-900">{model.trainTime}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-brand-400" />
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Inference</p>
                        <p className="text-xs font-bold text-slate-900">{model.speed}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Specs Column */}
              <div className="bg-slate-950 p-8 rounded-[2.5rem] flex flex-col justify-between gap-8 shadow-2xl border border-white/5">
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Input Features</span>
                  <div className="flex flex-wrap gap-2">
                    {model.features.map((f, fIdx) => (
                      <span 
                        key={fIdx}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-brand-400 uppercase"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col gap-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Performance</span>
                  <span className="text-xl font-black text-white font-mono tracking-tighter">{model.metric}</span>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
