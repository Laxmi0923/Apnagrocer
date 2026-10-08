import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Wallet, Sparkles, CheckCircle2, ShoppingCart, RefreshCw, ArrowRight } from 'lucide-react';

export default function AIBudgetShop() {
  const { products, addToCart, formatPrice, addNotification } = useApp();
  const [budget, setBudget] = useState(1500);
  const [customBudget, setCustomBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [budgetList, setBudgetList] = useState(null);

  const presets = [500, 1000, 1500, 2500, 5000];

  const handleCalculate = async (targetBudget) => {
    const finalBudget = targetBudget || (customBudget ? parseInt(customBudget) : budget);
    if (!finalBudget || finalBudget < 100) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/budget-shop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ budget: finalBudget })
      });
      const data = await res.json();
      setBudgetList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAllToCart = () => {
    if (!budgetList || !budgetList.products) return;
    budgetList.products.forEach(p => addToCart(p));
    addNotification(`Added ${budgetList.products.length} items from budget planner to cart!`, 'success');
  };

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 border border-emerald-200/60 rounded-3xl p-6 md:p-8 my-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500 text-white font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Smart Saver
            </span>
            <h3 className="text-2xl font-black text-slate-900">Shop Within My Budget</h3>
          </div>
          <p className="text-xs text-slate-600 font-medium">
            Tell ApnaGrocer AI your spend limit and let it automatically generate a balanced essential basket for your household.
          </p>
        </div>

        {/* Budget Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {presets.map((b) => (
            <button
              key={b}
              onClick={() => {
                setBudget(b);
                setCustomBudget('');
                handleCalculate(b);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                budget === b && !customBudget 
                  ? 'bg-emerald-700 text-white scale-105 ring-2 ring-emerald-300' 
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
              }`}
            >
              ₹{b}
            </button>
          ))}
        </div>
      </div>

      {/* Input & Trigger */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-2xl border border-emerald-200 shadow-sm mb-6">
        <div className="flex items-center gap-2 px-3 py-2 flex-1 w-full">
          <Wallet className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-bold text-slate-500">₹</span>
          <input
            type="number"
            value={customBudget}
            onChange={(e) => {
              setCustomBudget(e.target.value);
              setBudget(0);
            }}
            placeholder="Or enter custom budget (e.g. 1800)..."
            className="w-full text-xs font-bold text-slate-800 bg-transparent outline-none"
          />
        </div>
        <button
          onClick={() => handleCalculate()}
          disabled={loading}
          className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0 shadow-md"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" /> Calculating Basket...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" /> Generate Optimized Basket
            </>
          )}
        </button>
      </div>

      {/* Result Display */}
      {budgetList && (
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-md animate-fade-in space-y-6">
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-emerald-50/70 rounded-xl border border-emerald-100">
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase">Target Budget</p>
              <p className="text-lg font-black text-slate-900">{formatPrice(budgetList.budget)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase">Basket Total</p>
              <p className="text-lg font-black text-emerald-700">{formatPrice(budgetList.totalEstimated)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase">Remaining Savings</p>
              <p className="text-lg font-black text-amber-600">{formatPrice(budgetList.remaining)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-700 uppercase">Total Items</p>
              <p className="text-lg font-black text-slate-800">{budgetList.products.length} Products</p>
            </div>
          </div>

          {/* List of items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {budgetList.products.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors">
                <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-white rounded-lg p-1" />
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-xs text-slate-800 truncate">{p.name}</h5>
                  <p className="text-[11px] text-slate-500 font-medium">{p.quantity} • <span className="font-bold text-emerald-700">{formatPrice(p.sellingPrice)}</span></p>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="p-1.5 bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-colors shrink-0"
                  title="Add to cart"
                >
                  + Add
                </button>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Perfectly fits your target budget with zero waste!
            </p>
            <button
              onClick={handleAddAllToCart}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Add Entire List to Cart ({budgetList.products.length})
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
