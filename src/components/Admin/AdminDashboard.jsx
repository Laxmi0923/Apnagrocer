import React from 'react';
import { useApp } from '../../context/AppContext';
import { IndianRupee, ShoppingBag, Users, Package, AlertTriangle, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard({ setActiveTab }) {
  const { products, orders, formatPrice } = useApp();

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const lowStockCount = products.filter(p => p.stock < 10).length;

  const stats = [
    { title: 'Total Gross Sales', value: formatPrice(totalRevenue), change: '+18.4% vs last week', icon: IndianRupee, color: 'from-emerald-600 to-teal-700' },
    { title: 'Total Orders Placed', value: totalOrders, change: '100% fulfill rate', icon: Package, color: 'from-blue-600 to-indigo-700' },
    { title: 'Active Catalog Items', value: products.length, change: '16 Categories', icon: ShoppingBag, color: 'from-violet-600 to-purple-700' },
    { title: 'Low Stock Items (<10)', value: lowStockCount, change: 'Requires Restock', icon: AlertTriangle, color: 'from-amber-600 to-orange-700' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const IconComp = s.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.title}</span>
                <div className={`p-2.5 rounded-xl bg-gradient-to-r ${s.color} text-white shadow-md`}>
                  <IconComp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-black text-white mt-3">{s.value}</p>
              <p className="text-[11px] font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {s.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-800/60 rounded-3xl p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded tracking-wider flex items-center gap-1 w-max">
            <Sparkles className="w-3 h-3" /> Retail Operations Smart Assistant
          </span>
          <h3 className="text-xl font-black">Generate Today's AI Demand Forecast</h3>
          <p className="text-xs text-emerald-200">ApnaGrocer AI continuously analyzes search queries, cart additions & stock velocity.</p>
        </div>
        <button
          onClick={() => setActiveTab('insights')}
          className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 shrink-0"
        >
          View Business Insights <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid: Recent Orders & Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-extrabold text-white text-base">Recent Customer Orders</h4>
            <button 
              onClick={() => setActiveTab('orders')}
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              View All Orders →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 font-bold uppercase text-[10px]">
                  <th className="pb-2">Order ID</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-200">
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-bold text-amber-400">#{o.id}</td>
                    <td className="py-3">{o.address?.name || 'Rahul Sharma'}</td>
                    <td className="py-3 font-bold text-emerald-400">{formatPrice(o.totalAmount)}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h4 className="font-extrabold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Low Stock Watchlist
            </h4>
            <button 
              onClick={() => setActiveTab('inventory')}
              className="text-xs text-emerald-400 font-bold hover:underline"
            >
              Manage →
            </button>
          </div>

          <div className="space-y-3">
            {products.filter(p => p.stock < 10).slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={p.image} alt={p.name} className="w-9 h-9 object-contain bg-slate-800 rounded-lg p-1 shrink-0" />
                  <div className="min-w-0">
                    <h5 className="font-bold text-xs text-slate-200 truncate">{p.name}</h5>
                    <p className="text-[10px] text-slate-400">{p.category}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 font-bold text-xs rounded-lg border border-amber-500/30 shrink-0">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
