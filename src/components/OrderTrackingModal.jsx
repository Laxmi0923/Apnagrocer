import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, Clock, Truck, PackageCheck, MapPin, AlertCircle, ShoppingBag } from 'lucide-react';

export default function OrderTrackingModal() {
  const { trackingOrder, setTrackingOrder, formatPrice } = useApp();

  if (!trackingOrder) return null;

  const steps = [
    { key: 'Placed', label: 'Order Placed', desc: 'Received & verified by ApnaGrocer', icon: Clock },
    { key: 'Confirmed', label: 'Order Confirmed', desc: 'Merchant acknowledged order', icon: CheckCircle },
    { key: 'Packed', label: 'Packed & Sealed', desc: 'Quality checked at fulfillment center', icon: PackageCheck },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Rider is on the way with your bag', icon: Truck },
    { key: 'Delivered', label: 'Delivered', desc: 'Handed over cleanly', icon: CheckCircle }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Confirmed': return 1;
      case 'Packed': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const currentIndex = getStepIndex(trackingOrder.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-emerald-100">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/30 text-emerald-100 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Live Tracking</span>
              <span className="text-emerald-200 text-sm font-medium">#{trackingOrder.id}</span>
            </div>
            <h2 className="text-2xl font-black mt-1">Track Your Groceries</h2>
          </div>
          <button 
            onClick={() => setTrackingOrder(null)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Estimated Delivery Banner */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Truck className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">Estimated Arrival</p>
                <p className="text-lg font-black text-slate-800">
                  {trackingOrder.status === 'Delivered' ? 'Delivered Today!' : (trackingOrder.deliverySlot || 'Within 2 Hours')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-full shadow-sm">
                Status: {trackingOrder.status}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="relative py-4 px-2">
            <div className="space-y-6">
              {steps.map((step, idx) => {
                const IconComponent = step.icon;
                const isDone = idx < currentIndex;
                const isCurrent = idx === currentIndex;
                const isPending = idx > currentIndex;

                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    {/* Vertical Connector Line */}
                    {idx < steps.length - 1 && (
                      <div className={`absolute left-5 top-10 bottom-0 w-0.5 -mb-6 ${idx < currentIndex ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                    )}

                    {/* Icon Circle */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isDone ? 'bg-emerald-500 text-white shadow-md' :
                      isCurrent ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-lg scale-110' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Label & Details */}
                    <div className="pt-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-bold text-base ${isCurrent ? 'text-emerald-700 font-extrabold' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                          {step.label}
                        </h4>
                        {isDone && <span className="text-xs text-emerald-600 font-semibold">Completed</span>}
                        {isCurrent && <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold animate-pulse">In Progress</span>}
                      </div>
                      <p className={`text-xs mt-0.5 ${isCurrent || isDone ? 'text-slate-600' : 'text-slate-400'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Delivery Address</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">
              {trackingOrder.address ? `${trackingOrder.address.street}, ${trackingOrder.address.city} (${trackingOrder.address.pincode})` : 'Mumbai, India'}
            </p>
          </div>

          {/* Order Summary Snapshot */}
          <div className="border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between font-bold text-slate-800 mb-3 pb-2 border-b">
              <span className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-600" /> Items Summary ({trackingOrder.items?.length || 0})
              </span>
              <span className="text-emerald-700">{formatPrice(trackingOrder.totalAmount)}</span>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
              {trackingOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs text-slate-600">
                  <span className="truncate max-w-[240px] font-medium">• {item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                  <span className="font-bold text-slate-700">{formatPrice(item.sellingPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <span className="text-xs text-slate-500 font-medium">Need assistance? Call ApnaGrocer Support 1800-APNA-GROCER</span>
          <button 
            onClick={() => setTrackingOrder(null)}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Close Tracking
          </button>
        </div>

      </div>
    </div>
  );
}
