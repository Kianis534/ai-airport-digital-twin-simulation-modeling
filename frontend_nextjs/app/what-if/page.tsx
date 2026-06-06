"use client";

import React, { useState } from 'react';
import ControlSliders from '@/components/MetricsCard'; // Reusing visual but in what-if it will have sliders
import MetricsCard from '@/components/MetricsCard';
import { Play, RotateCcw, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiService } from '@/services/api';
import Sliders from '@/components/ControlSliders';

const WhatIfPage = () => {
  const [params, setParams] = useState({
    scenario_name: 'Custom Test',
    increase_flights_percent: 20,
    security_counters: 4,
    delay_offset_minutes: 10,
    checkin_counters: 8,
  });

  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await apiService.runWhatIf(params);
      setResults(res.metrics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">What-If Scenario Planner</h1>
        <p className="text-gray-500">Simulate infrastructure changes and predict AI-driven outcomes</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          <Sliders params={params} setParams={setParams} />
          <button
            onClick={handleRun}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
            }`}
          >
            {loading ? (
              <RotateCcw className="w-5 h-5 animate-spin" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            {loading ? 'Simulating...' : 'Run Analysis'}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-8">
          {results ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricsCard title="Predicted Satisfaction" value={`${(results.avg_satisfaction * 100).toFixed(1)}%`} icon={TrendingUp} />
                <MetricsCard title="Max Queue Depth" value={results.max_security_queue} icon={AlertTriangle} />
                <MetricsCard title="Throughput" value={results.total_processed} icon={TrendingUp} />
              </div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Analytic Insight</h3>
                <p className="text-gray-600 leading-relaxed">
                  Based on the <strong>{params.increase_flights_percent}%</strong> increase in flights and 
                  <strong> {params.security_counters}</strong> security counters, the AI model predicts a 
                  significant bottleneck at the security checkpoint. Customer satisfaction is expected to 
                  drop by <strong>{((0.88 - results.avg_satisfaction) * 100).toFixed(1)}%</strong> compared to baseline.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50 p-12 text-center">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <TrendingUp className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-500">Ready to Analyze</h3>
              <p className="text-gray-400 max-w-xs mx-auto">
                Adjust the sliders on the left and click "Run Analysis" to see predicted simulation outcomes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatIfPage;
