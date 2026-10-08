import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, MapPin, Clock, CreditCard, CheckCircle2, ShieldCheck, Smartphone, Banknote
} from 'lucide-react';

export default function CheckoutModal() {
  const { 
    cart, 
    cartSubtotal, 
    cartTotal, 
    couponDiscountAmount, 
    appliedCoupon, 
    deliveryFee,
    user, 
    clearCart, 
    activeView,
    setActiveView, 
    setActiveOrder, 
    showToast 
  } = useApp();

  const [step, setStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("9 AM - 12 PM");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("rahul@okaxis");
  const [cardDetails] = useState({ number: '4532 •••• •••• 8821', expiry: '12/28', cvv: '•••' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  if (activeView !== 'checkout') return null;

  if (cart.length === 0 && step < 5) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <X size={32} />
          </div>
          <h3 className="text-lg font-black text-slate-900">Your Cart is Empty</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please add fresh groceries to your cart before proceeding to checkout & payment.
          </p>
          <div className="pt-2 flex gap-2">
            <button 
              onClick={() => setActiveView('catalog')}
              className="flex-1 btn-primary py-3 text-xs"
            >
              Browse Grocery Catalog
            </button>
            <button 
              onClick={() => setActiveView('home')}
              className="px-4 btn-outline py-3 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const addresses = [
    {
      type: "Home",
      name: user?.name || "Rahul Sharma",
      phone: user?.phone || "+91 98765 43210",
      street: "Flat 402, Green Valley Apartments, MG Road",
      city: "Mumbai",
      pincode: "400001"
    },
    {
      type: "College Campus",
      name: user?.name || "Rahul Sharma",
      phone: user?.phone || "+91 98765 43210",
      street: "Hostel Block B, Room 204, VJTI Engineering College",
      city: "Mumbai",
      pincode: "400019"
    }
  ];

  const slots = [
    "9 AM - 12 PM (Tomorrow Morning)",
    "12 PM - 3 PM (Afternoon Express)",
    "3 PM - 6 PM (Evening Delivery)",
    "6 PM - 9 PM (Night Slot)"
  ];

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      const orderPayload = {
        userId: user?.id || 'USR-CUSTOMER-001',
        customerName: user?.name || 'Rahul Sharma',
        customerEmail: user?.email || 'customer@apnagrocer.com',
        customerPhone: user?.phone || '+91 98765 43210',
        items: cart,
        subtotal: cartSubtotal,
        discount: 0,
        couponDiscount: couponDiscountAmount,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        deliveryCharge: deliveryFee,
        total: cartTotal,
        paymentMethod: paymentMethod === 'UPI' ? `UPI (${upiId})` : paymentMethod,
        deliveryAddress: addresses[selectedAddress],
        deliverySlot: selectedSlot
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();
      if (data.success) {
        setCreatedOrder(data.order);
        setActiveOrder(data.order);
        clearCart();
        setStep(5);
        showToast('Payment Successful & Order Placed!', 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error processing order payment', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
        
        {step < 5 && (
          <div className="border-b border-slate-100 pb-4 mb-6">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 mb-2">
              <span className={step >= 1 ? 'text-emerald-600' : ''}>1. Cart Review</span>
              <span className={step >= 2 ? 'text-emerald-600' : ''}>2. Address</span>
              <span className={step >= 3 ? 'text-emerald-600' : ''}>3. Delivery Slot</span>
              <span className={step >= 4 ? 'text-emerald-600' : ''}>4. Payment</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-4">Step 1: Review Items ({cart.length})</h3>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {cart.map(i => (
                <div key={i.id} className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={i.image} alt={i.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-slate-900 line-clamp-1">{i.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {i.quantity} x ₹{i.sellingPrice}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">₹{i.sellingPrice * i.quantity}</span>
                </div>
              ))}
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-xs text-slate-700 flex justify-between font-bold mb-6">
              <span>Total Payable Amount:</span>
              <span className="text-emerald-700 text-sm font-black">₹{cartTotal}</span>
            </div>

            <div className="flex justify-end gap-2">
              <button onClick={() => setActiveView('home')} className="btn-outline text-xs">Cancel</button>
              <button onClick={() => setStep(2)} className="btn-primary text-xs">Continue to Address</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-emerald-600" /> Step 2: Select Delivery Address
            </h3>

            <div className="space-y-3 mb-6">
              {addresses.map((addr, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedAddress(idx)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedAddress === idx ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900">{addr.type} ({addr.name})</span>
                    {selectedAddress === idx && <span className="text-emerald-600 font-extrabold text-xs">✓ Selected</span>}
                  </div>
                  <p className="text-xs text-slate-600">{addr.street}, {addr.city} - {addr.pincode}</p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-1">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className="btn-outline text-xs">Back</button>
              <button onClick={() => setStep(3)} className="btn-primary text-xs">Select Delivery Slot</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-emerald-600" /> Step 3: Choose Convenient Delivery Slot
            </h3>

            <div className="space-y-2 mb-6">
              {slots.map((slot, idx) => (
                <label 
                  key={idx}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all text-xs font-bold ${
                    selectedSlot === slot ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="slot" 
                    checked={selectedSlot === slot}
                    onChange={() => setSelectedSlot(slot)}
                    className="accent-emerald-600"
                  />
                  <span>{slot}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-outline text-xs">Back</button>
              <button onClick={() => setStep(4)} className="btn-primary text-xs">Proceed to Payment</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-base font-extrabold text-slate-900 mb-2 flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-600" /> Step 4: Payment Gateway Sandbox
            </h3>
            <p className="text-xs text-slate-500 mb-4">Demo payment mode • No real payment required</p>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { id: 'UPI', label: 'UPI / GPay', icon: Smartphone },
                { id: 'Card', label: 'Card', icon: CreditCard },
                { id: 'NetBanking', label: 'NetBanking', icon: ShieldCheck },
                { id: 'COD', label: 'Cash on Delivery', icon: Banknote }
              ].map((m) => {
                const IconComponent = m.icon;
                return (
                  <button 
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                      paymentMethod === m.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-extrabold' : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="text-[10px]">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'UPI' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 text-xs">
                <label className="font-bold text-slate-700 block mb-1">Enter VPA / UPI ID</label>
                <input 
                  type="text" 
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                />
              </div>
            )}

            {paymentMethod === 'Card' && (
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 text-xs space-y-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Card Number</label>
                  <input type="text" value={cardDetails.number} readOnly className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Expiry</label>
                    <input type="text" value={cardDetails.expiry} readOnly className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-mono" />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">CVV</label>
                    <input type="text" value={cardDetails.cvv} readOnly className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 font-mono" />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 flex justify-between items-center text-xs mb-6">
              <span className="font-bold text-slate-700">Order Payable Amount:</span>
              <span className="text-emerald-700 text-base font-black">₹{cartTotal}</span>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className="btn-outline text-xs">Back</button>
              <button 
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="btn-accent py-3 px-6 text-xs font-extrabold"
              >
                {isProcessing ? 'Processing Sandbox Payment...' : `Pay ₹${cartTotal} & Place Order`}
              </button>
            </div>
          </div>
        )}

        {step === 5 && createdOrder && (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 size={36} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-1">Order Placed Successfully!</h2>
            <p className="text-xs text-slate-500 mb-6">
              Thank you for shopping with ApnaGrocer. Your order ID is <strong className="text-emerald-600 font-mono text-sm">{createdOrder.id}</strong>.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs max-w-md mx-auto mb-6 space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Delivery Address:</span>
                <span className="font-bold text-slate-800">{createdOrder.deliveryAddress.type} ({createdOrder.deliveryAddress.pincode})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Delivery Slot:</span>
                <span className="font-bold text-slate-800">{createdOrder.deliverySlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Paid:</span>
                <span className="font-black text-emerald-600">₹{createdOrder.total}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => {
                  setActiveView('tracking');
                }}
                className="btn-primary text-xs px-6"
              >
                Track Order #{createdOrder.id}
              </button>

              <button 
                onClick={() => {
                  setActiveView('home');
                }}
                className="btn-outline text-xs px-6"
              >
                Back to Homepage
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
