import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Package, Heart, MapPin, LogOut, ArrowRight, Clock, CheckCircle, Truck, Eye } from 'lucide-react';

export default function UserProfile() {
  const { user, logout, orders, wishlist, setTrackingOrder, formatPrice, setSelectedCategory } = useApp();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg uppercase">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Verified Customer</span>
            <h1 className="text-2xl md:text-3xl font-black">{user.name}</h1>
            <p className="text-xs text-emerald-200 mt-0.5">{user.email} • {user.role === 'admin' ? 'Admin Access Granted' : 'Customer Account'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'orders' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2"><Package className="w-4 h-4" /> My Orders</span>
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{orders.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'wishlist' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> Wishlist</span>
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">{wishlist.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full text-left p-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-between ${
              activeTab === 'addresses' ? 'bg-emerald-700 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Saved Addresses</span>
            <span className="text-[10px] text-slate-400">2 Addresses</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-xl text-slate-900 mb-4">Order History ({orders.length})</h3>

              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-base">No orders placed yet</h4>
                  <p className="text-xs text-slate-500">Your fresh groceries will show up here once ordered.</p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div key={ord.id} className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 transition-all shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-sm">#{ord.id}</span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                            ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">Placed on {new Date(ord.createdAt).toLocaleDateString()} • {ord.deliverySlot || 'Standard Delivery'}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-lg font-black text-emerald-700">{formatPrice(ord.totalAmount)}</span>
                        <button
                          onClick={() => setTrackingOrder(ord)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 flex items-center gap-1.5 shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5" /> Live Track
                        </button>
                      </div>
                    </div>

                    {/* Item list inside order */}
                    <div className="space-y-2">
                      {ord.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-slate-700">
                          <span className="font-medium">• {item.name} <span className="text-slate-400 font-bold">x{item.quantity}</span></span>
                          <span className="font-bold text-slate-800">{formatPrice(item.sellingPrice * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-xl text-slate-900 mb-4">Saved Wishlist ({wishlist.length})</h3>
              {wishlist.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 space-y-3">
                  <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-base">Your Wishlist is empty</h4>
                  <p className="text-xs text-slate-500">Heart items while browsing to save them for later!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-3 shadow-sm">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-contain bg-slate-50 rounded-xl p-1" />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-900 truncate">{item.name}</h5>
                        <p className="text-[11px] text-slate-500 font-medium">{item.quantity}</p>
                        <p className="text-xs font-black text-emerald-700 mt-1">{formatPrice(item.sellingPrice)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-xl text-slate-900 mb-4">Saved Delivery Addresses</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-emerald-300 ring-2 ring-emerald-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded">Home (Default)</span>
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-sm">Rahul Sharma</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">Flat 402, Green Valley Apartments, MG Road, Bandra West, Mumbai - 400001</p>
                  <p className="text-xs text-slate-500 font-medium">Phone: +91 98765 43210</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-600 uppercase bg-slate-100 px-2 py-0.5 rounded">Office / College</span>
                  </div>
                  <h5 className="font-extrabold text-slate-900 text-sm">VJTI Hostel Block B</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">Room 304, VJTI Campus, Matunga East, Mumbai - 400019</p>
                  <p className="text-xs text-slate-500 font-medium">Phone: +91 98765 43210</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
