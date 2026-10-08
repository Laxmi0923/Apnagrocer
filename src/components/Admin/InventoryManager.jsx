import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, RefreshCw, AlertTriangle, CheckCircle, Plus, Minus } from 'lucide-react';

export default function InventoryManager() {
  const { products, setProducts, addNotification } = useApp();
  const [filter, setFilter] = useState('all');

  const handleStockAdjust = async (id, delta) => {
    const target = products.find(p => p.id === id);
    if (!target) return;
    const newStock = Math.max(0, target.stock + delta);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p.id === id ? data.product : p));
        addNotification(`Updated inventory stock for ${data.product.name} to ${newStock}`, 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = products.filter(p => {
    if (filter === 'low') return p.stock < 10 && p.stock > 0;
    if (filter === 'out') return p.stock === 0;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Filter Chips */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          All Inventory ({products.length})
        </button>
        <button
          onClick={() => setFilter('low')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'low' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          Low Stock Watchlist ({products.filter(p => p.stock < 10 && p.stock > 0).length})
        </button>
        <button
          onClick={() => setFilter('out')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            filter === 'out' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          Out of Stock ({products.filter(p => p.stock === 0).length})
        </button>
      </div>

      {/* Grid of stock cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((p) => {
          const isLow = p.stock < 10;
          const isOut = p.stock === 0;

          return (
            <div key={p.id} className={`bg-slate-900 border rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm ${
              isOut ? 'border-rose-800/80 bg-rose-950/20' : isLow ? 'border-amber-800/80 bg-amber-950/20' : 'border-slate-800'
            }`}>
              <div className="flex items-start gap-3">
                <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-slate-950 rounded-xl p-1 shrink-0" />
                <div className="min-w-0 flex-1">
                  <h5 className="font-bold text-xs text-white truncate">{p.name}</h5>
                  <p className="text-[10px] text-slate-400">{p.category}</p>
                  <div className="mt-1">
                    {isOut ? (
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded">OUT OF STOCK</span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded">LOW STOCK</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded">HEALTHY STOCK</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Adjust buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-300 font-bold">In Stock: <span className="text-lg text-white font-black">{p.stock}</span></span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStockAdjust(p.id, -5)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold"
                    title="Remove 5 units"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => handleStockAdjust(p.id, 10)}
                    className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                    title="Restock 10 units"
                  >
                    <Plus className="w-3.5 h-3.5" /> 10
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
