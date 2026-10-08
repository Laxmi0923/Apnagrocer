import React from 'react';
import { useApp } from '../../context/AppContext';
import { PackageCheck, Truck, CheckCircle2, Clock, Search, ChevronRight } from 'lucide-react';

export default function OrderManager() {
  const { orders, setOrders, formatPrice, addNotification } = useApp();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        addNotification(`Updated status for Order #${orderId} to "${newStatus}"`, 'info');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statuses = ['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered'];

  return (
    <div className="space-y-6 animate-fade-in">
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h4 className="font-extrabold text-white text-sm">Active Orders Queue ({orders.length})</h4>
          <span className="text-xs text-slate-400 font-medium">Real-time status updater</span>
        </div>

        <div className="divide-y divide-slate-800">
          {orders.map((ord) => (
            <div key={ord.id} className="p-5 hover:bg-slate-800/30 transition-colors space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-amber-400 text-sm">#{ord.id}</span>
                    <span className="text-xs text-slate-400 font-medium">• {new Date(ord.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-300 font-semibold mt-0.5">
                    Customer: {ord.address?.name || 'Rahul Sharma'} ({ord.address?.phone || '+91 98765 43210'})
                  </p>
                  <p className="text-[11px] text-slate-400">{ord.address?.street}, {ord.address?.city}</p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-emerald-400 block">{formatPrice(ord.totalAmount)}</span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{ord.paymentMethod || 'UPI Payment'}</span>
                </div>
              </div>

              {/* Items summary */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Items in Bag ({ord.items?.length}):</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                  {ord.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate max-w-[200px]">• {item.name} (x{item.quantity})</span>
                      <span className="font-bold text-slate-400">{formatPrice(item.sellingPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status stepper selector */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                <span className="text-xs font-bold text-slate-400">Update Order Status:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {statuses.map((st) => {
                    const isCurrent = ord.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleStatusChange(ord.id, st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          isCurrent 
                            ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md' 
                            : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
