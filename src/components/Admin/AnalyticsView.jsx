import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, DollarSign, PieChart, ShoppingBag, ArrowUpRight } from 'lucide-react';

export default function AnalyticsView() {
  const { products, orders, formatPrice } = useApp();

  const totalSales = orders.reduce((a, b) => a + (b.totalAmount || 0), 0);
  const aov = orders.length ? Math.round(totalSales / orders.length) : 0;

  const categoryBreakdown = [
    { category: 'Fruits & Vegetables', share: '32%', revenue: Math.round(totalSales * 0.32) },
    { category: 'Atta & Pulses', share: '24%', revenue: Math.round(totalSales * 0.24) },
    { category: 'Dairy & Eggs', share: '18%', revenue: Math.round(totalSales * 0.18) },
    { category: 'Snacks & Beverages', share: '16%', revenue: Math.round(totalSales * 0.16) },
    { category: 'Personal & Household', share: '10%', revenue: Math.round(totalSales * 0.10) }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">Gross Revenue</span>
          <p className="text-3xl font-black text-emerald-400 mt-2">{formatPrice(totalSales)}</p>
          <p className="text-[11px] text-emerald-500 mt-1 font-semibold">↑ 22.4% vs last month</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">Average Order Value (AOV)</span>
          <p className="text-3xl font-black text-white mt-2">{formatPrice(aov)}</p>
          <p className="text-[11px] text-emerald-500 mt-1 font-semibold">↑ High retention basket</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs font-bold text-slate-400 uppercase">Repeat Customer Rate</span>
          <p className="text-3xl font-black text-amber-400 mt-2">68.5%</p>
          <p className="text-[11px] text-amber-500 mt-1 font-semibold">↑ High loyalty grocery segment</p>
        </div>
      </div>

      {/* Category Sales Share */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h4 className="font-extrabold text-white text-base">Category Revenue Performance</h4>
            <p className="text-xs text-slate-400">Share of wallet breakdown across major grocery departments</p>
          </div>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-xl font-bold">This Month</span>
        </div>

        <div className="space-y-4">
          {categoryBreakdown.map((cat, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-200">{cat.category}</span>
                <span className="text-emerald-400">{formatPrice(cat.revenue)} ({cat.share})</span>
              </div>
              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                  style={{ width: cat.share }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
