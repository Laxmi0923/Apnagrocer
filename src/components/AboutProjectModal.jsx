import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, CheckCircle, Database, Cpu, Layers, ShoppingBag, ShieldCheck, Zap, BarChart } from 'lucide-react';

export default function AboutProjectModal() {
  const { isAboutOpen, setIsAboutOpen } = useApp();

  if (!isAboutOpen) return null;

  const highlights = [
    { title: 'Full-Stack Architecture', desc: 'Node.js/Express backend + React SPA frontend served over single port architecture.', icon: Layers },
    { title: 'Gemini AI Integration', desc: 'Real natural language search, conversational budget planner & recipe ingredient extractor.', icon: Cpu },
    { title: 'Complete Retail Lifecycle', desc: 'Catalog, smart filters, coupons, checkout, demo payment gateway, order tracking & reviews.', icon: ShoppingBag },
    { title: 'Real-Time Inventory & Admin', desc: 'Live stock decrement on checkout, admin analytics dashboard & customer management.', icon: BarChart }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-emerald-100">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">E-Business & Retailing Project</span>
              <h2 className="text-2xl font-black">ApnaGrocer Platform Overview</h2>
            </div>
          </div>
          <button 
            onClick={() => setIsAboutOpen(false)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 text-xs leading-relaxed">
          
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
            <h4 className="font-extrabold text-emerald-900 text-sm mb-1">🎓 College Project & Production Startup Standard</h4>
            <p className="text-slate-600">
              ApnaGrocer was built to demonstrate a fully functional, production-ready Indian e-grocery tech startup experience. Unlike traditional static CRUD assignments, it incorporates real-time data persistence, AI-powered conversational recommendations, dynamic cart calculation, order fulfillment tracking, and administrative business intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h, i) => {
              const IconComp = h.icon;
              return (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs mb-1">{h.title}</h5>
                    <p className="text-slate-500 text-[11px] leading-tight">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Technical Specifications & Stack</h4>
            <ul className="grid grid-cols-2 gap-2 text-[11px]">
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Frontend: React 18, Vite, Tailwind CSS</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Backend: Express.js, REST API Architecture</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> AI Layer: @google/genai (Gemini API)</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Database: Local Persistent Store</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> State: React Context API</li>
              <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Analytics: Real-time Metrics & Insights</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-semibold">ApnaGrocer © 2026 • E-Business & Retailing Project</span>
          <button 
            onClick={() => setIsAboutOpen(false)}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-md"
          >
            Got it, Let's Shop!
          </button>
        </div>

      </div>
    </div>
  );
}
