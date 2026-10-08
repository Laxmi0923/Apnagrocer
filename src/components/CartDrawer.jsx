import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, Truck, Check } from 'lucide-react';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQty, 
    removeFromCart, 
    cartSubtotal, 
    cartMRP, 
    productDiscount, 
    couponDiscountAmount, 
    deliveryFee, 
    cartTotal, 
    freeDeliveryThresholdRemaining,
    appliedCoupon,
    setAppliedCoupon,
    setActiveView,
    showToast
  } = useApp();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const availableCoupons = [
    { code: 'WELCOME100', desc: 'Flat ₹100 OFF above ₹499' },
    { code: 'APNA20', desc: '20% OFF above ₹999 (Max ₹300)' },
    { code: 'GROCERY10', desc: '10% OFF above ₹799' },
    { code: 'SAVE200', desc: 'Flat ₹200 OFF above ₹1499' }
  ];

  const handleApplyCoupon = async (codeToApply) => {
    const code = codeToApply || couponCodeInput;
    if (!code) return;

    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          cartSubtotal
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponCodeInput('');
        showToast(data.message, 'success');
      } else {
        showToast(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error validating coupon', 'error');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-300">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-emerald-600" />
            <h2 className="text-base font-extrabold text-slate-900">Your Cart</h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items
            </span>
          </div>

          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3 border-b border-emerald-100 text-xs font-bold text-slate-700">
          {freeDeliveryThresholdRemaining > 0 ? (
            <div className="flex items-center gap-2">
              <Truck size={16} className="text-emerald-600 shrink-0" />
              <span>Add <strong className="text-emerald-700">₹{freeDeliveryThresholdRemaining}</strong> more for <strong>FREE Delivery</strong>!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
              <Check size={16} className="text-emerald-600" />
              <span>🎉 Congratulations! You unlocked FREE Delivery!</span>
            </div>
          )}
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (cartSubtotal / 499) * 100)}%` }}
            />
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div key={item.id} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-500">{item.weight} • ₹{item.sellingPrice}</p>
                  
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
                      <button 
                        onClick={() => updateCartQty(item.id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center text-xs font-extrabold">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQty(item.id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-500 text-xs p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-slate-900">₹{item.sellingPrice * item.quantity}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <ShoppingBag size={28} />
              </div>
              <h3 className="text-sm font-extrabold text-slate-800">Your cart is empty</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">Add fresh groceries to get started!</p>
              <button 
                onClick={() => { setIsCartOpen(false); setActiveView('catalog'); }}
                className="btn-primary text-xs"
              >
                Browse Grocery Catalog
              </button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-100 shadow-lg">
            <div className="mb-3">
              {appliedCoupon ? (
                <div className="bg-emerald-100 text-emerald-800 p-2.5 rounded-xl border border-emerald-300 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} className="text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> Applied! (-₹{appliedCoupon.discountAmount})</span>
                  </div>
                  <button 
                    onClick={() => setAppliedCoupon(null)}
                    className="text-rose-600 font-extrabold hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <div className="flex gap-2 mb-2">
                    <input 
                      type="text"
                      placeholder="Enter promo coupon..."
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs uppercase font-extrabold outline-none focus:border-emerald-500"
                    />
                    <button 
                      onClick={() => handleApplyCoupon()}
                      disabled={couponLoading || !couponCodeInput}
                      className="btn-secondary py-1.5 px-3 text-xs"
                    >
                      Apply
                    </button>
                  </div>

                  <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                    {availableCoupons.map(c => (
                      <button
                        key={c.code}
                        onClick={() => handleApplyCoupon(c.code)}
                        className="bg-white border border-slate-200 text-[10px] font-bold text-slate-600 px-2 py-0.5 rounded-lg whitespace-nowrap hover:border-emerald-500"
                      >
                        {c.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 mb-4 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Product Savings</span>
                <span className="font-bold">-₹{productDiscount}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Coupon Discount ({appliedCoupon.code})</span>
                  <span>-₹{appliedCoupon.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span className="font-bold">{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Final Amount Payable</span>
                <span className="text-emerald-600">₹{cartTotal}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setIsCartOpen(false);
                setActiveView('checkout');
              }}
              className="w-full btn-primary py-3.5 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Proceed to Checkout (₹{cartTotal})</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
