import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, ShoppingBag, Layers, Users, BarChart3, Tag, Sparkles, ArrowLeft, LogOut, PackageCheck, AlertTriangle } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import ProductManager from './ProductManager';
import InventoryManager from './InventoryManager';
import OrderManager from './OrderManager';
import CustomerManager from './CustomerManager';
import AnalyticsView from './AnalyticsView';
import BusinessInsights from './BusinessInsights';

export default function AdminLayout() {
  const { setViewMode, user, logout } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Product Catalog', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory & Stock', icon: Layers },
    { id: 'orders', label: 'Fulfillment & Orders', icon: PackageCheck },
    { id: 'customers', label: 'Customer Base', icon: Users },
    { id: 'analytics', label: 'Sales Analytics', icon: BarChart3 },
    { id: 'insights', label: 'AI Business Insights', icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 shrink-0 p-4 flex flex-col justify-between">
        <div className="space-y-6">
          
          {/* Logo & Portal Info */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
                Retail Ops Portal
              </span>
              <h2 className="text-xl font-black text-white mt-1">ApnaGrocer <span className="text-emerald-400">Admin</span></h2>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
                    isActive 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50 scale-[1.02]' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Switcher */}
        <div className="pt-4 border-t border-slate-800 space-y-2 mt-6">
          <button
            onClick={() => setViewMode('customer')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Customer Storefront
          </button>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-screen">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-6">
          <div>
            <h1 className="text-2xl font-black text-white capitalize">{activeTab}</h1>
            <p className="text-xs text-slate-400">Real-time enterprise retail management system</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Store Server
            </span>
          </div>
        </div>

        {/* Tab View Switcher */}
        {activeTab === 'dashboard' && <AdminDashboard setActiveTab={setActiveTab} />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'inventory' && <InventoryManager />}
        {activeTab === 'orders' && <OrderManager />}
        {activeTab === 'customers' && <CustomerManager />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'insights' && <BusinessInsights />}

      </main>

    </div>
  );
}
