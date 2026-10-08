import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Apple, Milk, Wheat, CircleDot, Droplet, Flame, Package, Cookie, Coffee, Sparkles, Home, Heart, Snowflake, Cake, Zap, Grid
} from 'lucide-react';

const iconMap = {
  Apple, Milk, Wheat, CircleDot, Droplet, Flame, Package, Cookie, Coffee, Sparkles, Home, Heart, Snowflake, Cake, Zap
};

const categoryColors = [
  "from-emerald-500/10 to-green-500/10 text-emerald-600 border-emerald-200/60",
  "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-200/60",
  "from-amber-500/10 to-yellow-500/10 text-amber-600 border-amber-200/60",
  "from-yellow-500/10 to-orange-500/10 text-yellow-700 border-yellow-200/60",
  "from-orange-500/10 to-rose-500/10 text-orange-600 border-orange-200/60",
  "from-teal-500/10 to-cyan-500/10 text-teal-600 border-teal-200/60",
  "from-red-500/10 to-rose-500/10 text-red-600 border-red-200/60",
  "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-200/60",
  "from-rose-500/10 to-pink-500/10 text-rose-600 border-rose-200/60",
  "from-amber-600/10 to-orange-600/10 text-amber-700 border-amber-300/60",
  "from-violet-500/10 to-indigo-500/10 text-violet-600 border-violet-200/60",
  "from-sky-500/10 to-blue-500/10 text-sky-600 border-sky-200/60",
  "from-pink-500/10 to-rose-500/10 text-pink-600 border-pink-200/60",
  "from-cyan-500/10 to-teal-500/10 text-cyan-600 border-cyan-200/60",
  "from-amber-500/10 to-yellow-600/10 text-amber-700 border-amber-200/60",
  "from-emerald-600/10 to-teal-600/10 text-emerald-700 border-emerald-300/60"
];

export default function CategoryBar() {
  const { categories, selectedCategory, setSelectedCategory, setActiveView } = useApp();

  return (
    <div className="bg-white py-8 border-b border-slate-100/80 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase mb-1">
              <span>EXPLORE STORE</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Shop By Category</h2>
            <p className="text-xs text-slate-500 font-medium">16+ Premium Fresh Indian Grocery Categories</p>
          </div>

          <button 
            onClick={() => { setSelectedCategory('all'); setActiveView('catalog'); }}
            className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-2xl border border-emerald-200 transition-all flex items-center gap-1.5"
          >
            <Grid size={15}/> View All Categories
          </button>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3.5">
          {categories.map((cat, idx) => {
            const IconComponent = iconMap[cat.icon] || Package;
            const isSelected = selectedCategory === cat.id;
            const colorStyle = categoryColors[idx % categoryColors.length];

            return (
              <div 
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveView('catalog');
                }}
                className={`group cursor-pointer flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/25 scale-105' 
                    : `bg-gradient-to-b ${colorStyle} hover:scale-105 hover:shadow-md`
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl mb-2 flex items-center justify-center transition-transform group-hover:rotate-6 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-white shadow-sm'
                }`}>
                  <IconComponent size={24} />
                </div>

                <span className="text-[11px] font-extrabold line-clamp-1 leading-snug">
                  {cat.name}
                </span>

                <span className={`text-[9px] font-bold mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {cat.itemCount} items
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
