import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, ShoppingBag, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';

export default function CustomerManager() {
  const { orders, formatPrice } = useApp();
  const [search, setSearch] = useState('');

  const customers = [
    { id: 'CUST-101', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+91 98765 43210', totalOrders: orders.length, totalSpent: orders.reduce((a, b) => a + (b.totalAmount || 0), 0), registered: '2026-01-15' },
    { id: 'CUST-102', name: 'Priya Patel', email: 'priya@example.com', phone: '+91 98123 45678', totalOrders: 4, totalSpent: 3420, registered: '2026-02-01' },
    { id: 'CUST-103', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 97654 32109', totalOrders: 2, totalSpent: 1850, registered: '2026-02-18' },
    { id: 'CUST-104', name: 'Sneha Rao', email: 'sneha@example.com', phone: '+91 99887 76655', totalOrders: 6, totalSpent: 5900, registered: '2026-03-02' }
  ];

  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search Header */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customer base by name, email or phone..."
          className="w-full bg-transparent text-xs text-white outline-none font-medium"
        />
      </div>

      {/* Customer List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-800">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium text-slate-200">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white font-black flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-xs">{c.name}</h5>
                        <span className="text-[10px] text-amber-400 font-semibold">{c.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 space-y-0.5">
                    <p className="text-slate-300 font-medium flex items-center gap-1.5"><Mail className="w-3 h-3 text-slate-400" /> {c.email}</p>
                    <p className="text-slate-400 text-[11px] flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {c.phone}</p>
                  </td>

                  <td className="p-4 font-bold text-slate-300">{c.totalOrders} orders</td>

                  <td className="p-4 font-black text-emerald-400">{formatPrice(c.totalSpent)}</td>

                  <td className="p-4 text-slate-400 text-[11px]">{c.registered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
