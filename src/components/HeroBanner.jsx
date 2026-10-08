import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, ArrowRight, Truck, Clock, Calculator, ChefHat } from 'lucide-react';

export default function HeroBanner() {
  const { setActiveView, setIsAIOpen } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      title: "Fresh Harvest Organic Grocery Festival",
      subtitle: "Up to 50% OFF on Farm-Fresh Fruits, Vegetables & Essential MP Atta!",
      code: "WELCOME100",
      buttonText: "Shop Fresh Today",
      bgColor: "from-emerald-950 via-emerald-800 to-teal-900",
      badge: "EXCLUSIVE FESTIVAL SALE",
      image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Meet ApnaGrocer AI 2.0 Assistant",
      subtitle: "Ask for budget grocery lists, instant recipe ingredients & smart meal planning!",
      code: "APNA20",
      buttonText: "Try AI Assistant Now",
      bgColor: "from-slate-950 via-teal-900 to-emerald-950",
      badge: "POWERED BY GEMINI AI",
      isAI: true,
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Monthly Grocery Budget Shopping",
      subtitle: "Set your budget ₹1000, ₹2500, or ₹5000 and get optimized shopping bundles!",
      code: "SAVE200",
      buttonText: "Shop By Budget",
      bgColor: "from-emerald-900 via-green-800 to-teal-950",
      badge: "SMART SAVINGS ENGINE",
      isBudget: true,
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[activeSlide];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${slide.bgColor} text-white shadow-2xl min-h-[340px] flex items-center transition-all duration-700 border border-emerald-500/20`}>
        
        <div className="absolute right-0 top-0 bottom-0 w-1/2 md:w-3/5 opacity-30 md:opacity-50 mix-blend-overlay">
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover scale-105" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full mb-4 shadow-md">
            <Sparkles size={12} />
            <span>{slide.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white mb-3 leading-tight drop-shadow-sm">
            {slide.title}
          </h1>

          <p className="text-sm md:text-base text-emerald-100 font-medium mb-6 leading-relaxed opacity-90">
            {slide.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3.5">
            <button 
              onClick={() => {
                if (slide.isAI) setIsAIOpen(true);
                else if (slide.isBudget) setActiveView('budgetShop');
                else setActiveView('catalog');
              }}
              className="btn-accent px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
            >
              {slide.isAI && <Sparkles size={18} className="animate-spin" />}
              <span>{slide.buttonText}</span>
              <ArrowRight size={18} />
            </button>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 shadow-md">
              <span className="text-emerald-200">Use Code:</span>
              <span className="bg-yellow-400 text-slate-950 px-2.5 py-0.5 rounded font-black tracking-widest">{slide.code}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-5 right-6 flex items-center gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeSlide === idx ? 'bg-amber-400 w-9' : 'bg-white/30 hover:bg-white/60 w-2.5'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:border-emerald-300 transition-all hover:shadow-md">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <Truck size={22} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">FREE Delivery</h4>
            <p className="text-[10px] text-slate-500 font-medium">On orders above ₹499</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 hover:border-amber-300 transition-all hover:shadow-md">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <Clock size={22} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">2-Hour Express</h4>
            <p className="text-[10px] text-slate-500 font-medium">Fast local fulfillment</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveView('budgetShop')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 cursor-pointer hover:border-purple-300 transition-all hover:shadow-md"
        >
          <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <Calculator size={22} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">Shop By Budget</h4>
            <p className="text-[10px] text-slate-500 font-medium">Auto-bundle ₹1000 - ₹5000</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveView('recipeToCart')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3.5 cursor-pointer hover:border-rose-300 transition-all hover:shadow-md"
        >
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <ChefHat size={22} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900">Recipe To Cart</h4>
            <p className="text-[10px] text-slate-500 font-medium">Extract ingredients in 1 click</p>
          </div>
        </div>
      </div>
    </div>
  );
}
