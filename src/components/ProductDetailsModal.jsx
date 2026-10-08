import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Star, Heart, ShieldCheck, Truck, Plus, Minus, ShoppingBag, CheckCircle, MessageSquare } from 'lucide-react';

export default function ProductDetailsModal() {
  const { selectedProduct, setSelectedProduct, addToCart, addMultipleToCart, toggleWishlist, wishlist, cart, updateCartQty, setIsCartOpen, showToast } = useApp();

  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      fetchDetail(selectedProduct.id);
    }
  }, [selectedProduct]);

  const fetchDetail = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setProductDetail(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.some(i => i.id === selectedProduct.id);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          userName: 'Rahul Sharma',
          rating: newReview.rating,
          title: newReview.title || 'Great product',
          comment: newReview.comment
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Review submitted successfully!', 'success');
        setNewReview({ rating: 5, title: '', comment: '' });
        fetchDetail(selectedProduct.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95">
        
        <button 
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
        >
          <X size={20} />
        </button>

        {loading || !productDetail ? (
          <div className="p-12 text-center">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-xs font-bold text-slate-500">Loading product details...</p>
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div>
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 relative">
                  <img 
                    src={productDetail.product.image} 
                    alt={productDetail.product.name} 
                    className="w-full h-full object-cover"
                  />
                  {productDetail.product.discount > 0 && (
                    <span className="absolute top-3 left-3 badge-discount">
                      {productDetail.product.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-600">
                  <div className="bg-emerald-50 p-2.5 rounded-xl flex items-center gap-2 border border-emerald-100">
                    <Truck size={16} className="text-emerald-600 shrink-0" />
                    <span>{productDetail.product.deliveryInfo}</span>
                  </div>
                  <div className="bg-blue-50 p-2.5 rounded-xl flex items-center gap-2 border border-blue-100">
                    <ShieldCheck size={16} className="text-blue-600 shrink-0" />
                    <span>100% Quality Assured</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
                    {productDetail.product.brand}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    ID: {productDetail.product.id}
                  </span>
                </div>

                <h1 className="text-xl font-extrabold text-slate-900 mt-1 mb-2 leading-tight">
                  {productDetail.product.name}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 text-xs font-extrabold px-2 py-0.5 rounded-lg border border-emerald-200">
                    <span>{productDetail.product.rating}</span>
                    <Star size={12} className="fill-current text-emerald-600" />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {productDetail.product.reviewCount} Ratings & Reviews
                  </span>
                  <span className={productDetail.product.stock > 10 ? 'badge-stock' : 'badge-low-stock'}>
                    {productDetail.product.stockStatus} ({productDetail.product.stock} available)
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl mb-5 border border-slate-100">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-slate-900">₹{productDetail.product.sellingPrice}</span>
                    {productDetail.product.mrp > productDetail.product.sellingPrice && (
                      <span className="text-sm text-slate-400 line-through font-bold">₹{productDetail.product.mrp}</span>
                    )}
                    <span className="text-xs font-extrabold text-rose-500 bg-rose-100 px-2 py-0.5 rounded-lg">
                      Save ₹{productDetail.product.mrp - productDetail.product.sellingPrice}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">Inclusive of all taxes • Weight: {productDetail.product.weight}</p>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded-lg"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-xs font-extrabold">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-200 rounded-lg"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      addToCart(productDetail.product, quantity);
                    }}
                    className="flex-1 btn-primary py-3 text-xs"
                  >
                    <ShoppingBag size={16} /> Add {quantity} To Cart
                  </button>

                  <button 
                    onClick={() => toggleWishlist(productDetail.product)}
                    className={`p-3 rounded-xl border transition-colors ${
                      isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-4">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(productDetail.product.specifications || {}).map(([key, val]) => (
                      <div key={key} className="bg-slate-50 p-2 rounded-lg">
                        <span className="text-slate-400 font-semibold block text-[10px]">{key}</span>
                        <span className="text-slate-800 font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-1">Description</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{productDetail.product.description}</p>
                </div>
              </div>

            </div>

            {productDetail.frequentlyBoughtTogether?.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" /> Frequently Bought Together Bundle
                </h3>

                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center -space-x-3">
                      <img src={productDetail.product.image} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                      {productDetail.frequentlyBoughtTogether.map(item => (
                        <img key={item.id} src={item.image} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                      ))}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {productDetail.product.name} + {productDetail.frequentlyBoughtTogether.map(i => i.name).join(' + ')}
                      </h4>
                      <p className="text-[11px] text-slate-500">Buy together and get complete grocery recipe satisfaction!</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      addMultipleToCart([productDetail.product, ...productDetail.frequentlyBoughtTogether]);
                    }}
                    className="btn-accent py-2 px-4 text-xs shrink-0"
                  >
                    Add Bundle to Cart
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-600" /> Customer Reviews ({productDetail.reviews.length})
                </h3>
              </div>

              <form onSubmit={handleReviewSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Write a Review</h4>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-slate-500 font-semibold">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star}
                        size={18}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                        className={`cursor-pointer ${star <= newReview.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <input 
                  type="text"
                  placeholder="Review Title (optional)"
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs mb-2 outline-none"
                />

                <textarea 
                  rows={2}
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs mb-3 outline-none"
                  required
                />

                <button 
                  type="submit" 
                  disabled={submittingReview}
                  className="btn-primary py-2 px-4 text-xs"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>

              <div className="space-y-3">
                {productDetail.reviews.map(rev => (
                  <div key={rev.id} className="bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                      <span className="text-[10px] text-slate-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className={i < rev.rating ? 'text-amber-400 fill-current' : 'text-slate-300'} />
                      ))}
                      <span className="text-[11px] font-bold text-slate-800 ml-1">{rev.title}</span>
                    </div>
                    <p className="text-xs text-slate-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
