import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, TrendingUp, AlertCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';

export default function BusinessInsights() {
  const { formatPrice } = useApp();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/insights');
      const data = await res.json();
      setInsights(data.insights || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-700/60 rounded-3xl p-6 text-white flex items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Gemini Retail Intelligence</span>
          </div>
          <h3 className="text-xl font-black">Automated Grocery Demand & Inventory Insights</h3>
          <p className="text-xs text-emerald-200">
            Real-time analytics analyzing customer search queries, regional stock velocity & checkout conversions.
          </p>
        </div>

        <button
          onClick={fetchInsights}
          disabled={loading}
          className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh AI Insights
        </button>
      </div>

      {/* Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 hover:border-emerald-700/80 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                item.type === 'demand' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                item.type === 'inventory' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                'bg-blue-950 text-blue-400 border border-blue-800'
              }`}>
                {item.type} Analysis
              </span>
              <span className="text-xs font-bold text-slate-500">Confidence 98%</span>
            </div>

            <h4 className="font-black text-white text-base leading-snug">{item.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">{item.detail}</p>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Action: {item.action}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
