import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Flame, Clock } from 'lucide-react';

export default function FlashSale() {
  const { products } = useApp();
  const flashProducts = products.filter(p => p.isFlashSale).slice(0, 4);

  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 34, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 2, minutes: 45, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashProducts.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-rose-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-300">
              <Flame size={28} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">FLASH SALE</h2>
                <span className="bg-yellow-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">Up to 40% OFF</span>
              </div>
              <p className="text-xs text-orange-100 font-medium">Limited stock items ending soon!</p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <Clock size={16} className="text-yellow-300" />
            <span className="text-xs font-bold text-orange-100">Ends In:</span>
            <div className="flex items-center gap-1 font-mono font-black text-sm">
              <span className="bg-white text-slate-950 px-2 py-0.5 rounded-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-white text-slate-950 px-2 py-0.5 rounded-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span>:</span>
              <span className="bg-white text-slate-950 px-2 py-0.5 rounded-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {flashProducts.map(product => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              
              <div className="mt-2 bg-slate-950/30 p-2 rounded-xl backdrop-blur-xs">
                <div className="flex justify-between text-[10px] font-bold text-orange-100 mb-1">
                  <span>Stock Remaining:</span>
                  <span className="text-yellow-300">{product.stock} units left</span>
                </div>
                <div className="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-yellow-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (product.stock / 30) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
