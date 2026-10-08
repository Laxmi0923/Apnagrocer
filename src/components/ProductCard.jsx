import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, Heart, Plus, Minus, Zap } from 'lucide-react';

export default function ProductCard({ product }) {
  const { cart, wishlist, addToCart, updateCartQty, toggleWishlist, setSelectedProduct, setIsCartOpen } = useApp();

  const cartItem = cart.find(item => item.id === product.id);
  const isWishlisted = wishlist.some(item => item.id === product.id);

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (!cartItem) {
      addToCart(product, 1);
    }
    setIsCartOpen(true);
  };

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="product-card group cursor-pointer flex flex-col justify-between p-3.5 h-full"
    >
      <div>
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-1">
            {product.discount > 0 && (
              <span className="badge-discount">
                {product.discount}% OFF
              </span>
            )}
            {product.isFlashSale && (
              <span className="bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded flex items-center gap-0.5 pulse-badge">
                <Zap size={10} /> FLASH
              </span>
            )}
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isWishlisted ? 'bg-rose-50 text-rose-500' : 'bg-slate-100/80 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
            }`}
          >
            <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
          </button>
        </div>

        <div className="relative aspect-square w-full mb-3 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center text-white font-extrabold text-xs uppercase tracking-wider">
              Out of Stock
            </div>
          )}
        </div>

        <div className="mb-2">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{product.brand}</p>
          <h3 className="text-xs font-bold text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{product.weight}</p>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded border border-emerald-200">
            <span>{product.rating}</span>
            <Star size={10} className="fill-current text-emerald-600" />
          </div>
          <span className="text-[10px] text-slate-400">({product.reviewCount})</span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-100">
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-sm font-black text-slate-900">₹{product.sellingPrice}</span>
          {product.mrp > product.sellingPrice && (
            <span className="text-[11px] text-slate-400 line-through font-semibold">₹{product.mrp}</span>
          )}
        </div>

        {product.stock > 0 ? (
          cartItem ? (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between bg-emerald-600 text-white rounded-xl p-1 shadow-sm animate-in zoom-in-95"
            >
              <button 
                onClick={() => updateCartQty(product.id, cartItem.quantity - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-700 font-extrabold"
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-black">{cartItem.quantity}</span>
              <button 
                onClick={() => updateCartQty(product.id, cartItem.quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-700 font-extrabold"
              >
                <Plus size={14} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="btn-secondary py-1.5 text-[11px] font-extrabold justify-center"
              >
                <Plus size={13} /> Add
              </button>
              <button 
                onClick={handleBuyNow}
                className="btn-primary py-1.5 text-[11px] font-extrabold justify-center"
              >
                Buy Now
              </button>
            </div>
          )
        ) : (
          <button 
            disabled 
            className="w-full bg-slate-100 text-slate-400 font-bold text-xs py-2 rounded-xl cursor-not-allowed text-center"
          >
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
}
