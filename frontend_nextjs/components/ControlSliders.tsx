import React from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (val: number) => void;
  suffix?: string;
}

const ControlSliders: React.FC<{
  params: any;
  setParams: (params: any) => void;
}> = ({ params, setParams }) => {
  const sliders = [
    { key: 'increase_flights_percent', label: 'Flight Traffic Increase', min: 0, max: 100, step: 5, suffix: '%' },
    { key: 'security_counters', label: 'Active Security Lanes', min: 1, max: 20, step: 1, suffix: '' },
    { key: 'delay_offset_minutes', label: 'Injected Delay Offset', min: 0, max: 60, step: 5, suffix: 'm' },
    { key: 'checkin_counters', label: 'Check-in Counters', min: 1, max: 30, step: 1, suffix: '' },
  ];

  const handleChange = (key: string, value: number) => {
    setParams({ ...params, [key]: value });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Simulation Parameters</h2>
      {sliders.map((s) => (
        <div key={s.key} className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-600">{s.label}</label>
            <span className="text-sm font-bold text-blue-600">
              {params[s.key]}{s.suffix}
            </span>
          </div>
          <input
            type="range"
            min={s.min}
            max={s.max}
            step={s.step}
            value={params[s.key]}
            onChange={(e) => handleChange(s.key, parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>
      ))}
    </div>
  );
};

export default ControlSliders;
