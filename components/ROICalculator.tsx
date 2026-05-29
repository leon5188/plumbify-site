"use client";
import { useState, useEffect } from "react";
import { TrendingUp, PhoneOff, DollarSign } from "lucide-react";

export default function ROICalculator() {
  const [calls, setCalls] = useState(10);
  const [value, setValue] = useState(350);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    // 10% missed call conversion rate estimation
    const lostRev = calls * 0.8 * value * 12; // 80% missed calls saved * job value * 12 months
    setRevenue(lostRev);
  }, [calls, value]);

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <TrendingUp size={200} />
      </div>
      
      <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 className="text-2xl font-bold mb-6">The "Revenue Leak" Calculator</h3>
          <p className="text-slate-400 mb-8">See how much money is slipping through your fingers every month.</p>
          
          <div className="space-y-8">
            <div>
              <label className="flex justify-between mb-2">
                <span>Missed Calls / Month</span>
                <span className="font-bold text-blue-400">{calls}</span>
              </label>
              <input 
                type="range" min="1" max="100" value={calls} 
                onChange={(e) => setCalls(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
            
            <div>
              <label className="flex justify-between mb-2">
                <span>Avg. Job Value ($)</span>
                <span className="font-bold text-blue-400">${value}</span>
              </label>
              <input 
                type="range" min="100" max="2000" step="50" value={value} 
                onChange={(e) => setValue(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <p className="text-slate-400 text-sm uppercase tracking-widest mb-2 font-semibold">Estimated Annual Recovery</p>
          <div className="text-5xl md:text-6xl font-black text-blue-400 mb-4 tracking-tighter">
            ${revenue.toLocaleString()}
          </div>
          <p className="text-slate-300 text-sm italic">
            *Based on saving 80% of your current missed opportunities with Plumbify AI.
          </p>
          <button className="mt-8 w-full py-4 bg-blue-500 hover:bg-blue-400 transition-colors rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20">
            Plug the Leak Now
          </button>
        </div>
      </div>
    </div>
  );
}
