import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Edit3, Trash2, Check, X, ShoppingBag } from 'lucide-react';

export default function ProductManager() {
  const { products, setProducts, formatPrice, addNotification } = useApp();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));

  const handleEditClick = (p) => {
    setEditingId(p.id);
    setEditForm({ ...p });
  };

  const handleSave = async (id) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (data.success) {
        setProducts(products.map(p => p.id === id ? data.product : p));
        setEditingId(null);
        addNotification(`Updated product "${data.product.name}" successfully!`, 'success');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product catalog by name, brand or category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
        <div className="text-xs text-slate-400 font-medium">
          Total Products: <span className="font-bold text-emerald-400">{filtered.length}</span>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <th className="p-3">Product</th>
                <th className="p-3">Category</th>
                <th className="p-3">MRP</th>
                <th className="p-3">Selling Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium text-slate-200">
              {filtered.map((p) => {
                const isEditing = editingId === p.id;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/40">
                    <td className="p-3 flex items-center gap-3 min-w-[200px]">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-contain bg-slate-950 rounded-lg p-1 shrink-0" />
                      <div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                          />
                        ) : (
                          <>
                            <h5 className="font-bold text-white text-xs">{p.name}</h5>
                            <p className="text-[10px] text-slate-400">{p.brand} • {p.quantity}</p>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-slate-400">{p.category}</td>

                    <td className="p-3 line-through text-slate-500">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.mrp}
                          onChange={(e) => setEditForm({ ...editForm, mrp: parseFloat(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-1 text-xs text-white"
                        />
                      ) : (
                        formatPrice(p.mrp)
                      )}
                    </td>

                    <td className="p-3 font-bold text-emerald-400">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.sellingPrice}
                          onChange={(e) => setEditForm({ ...editForm, sellingPrice: parseFloat(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-1 text-xs text-white"
                        />
                      ) : (
                        formatPrice(p.sellingPrice)
                      )}
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.stock}
                          onChange={(e) => setEditForm({ ...editForm, stock: parseInt(e.target.value) })}
                          className="w-16 bg-slate-950 border border-slate-700 rounded px-1 text-xs text-white"
                        />
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.stock < 10 ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400'}`}>
                          {p.stock} units
                        </span>
                      )}
                    </td>

                    <td className="p-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleSave(p.id)}
                            className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-500"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-slate-800 text-slate-300 rounded hover:bg-slate-700"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(p)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
