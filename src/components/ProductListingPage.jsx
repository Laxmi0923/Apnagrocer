import React from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import { Filter, SlidersHorizontal, RotateCcw, Frown } from 'lucide-react';

export default function ProductListingPage() {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    filters,
    setFilters,
    sortOption,
    setSortOption
  } = useApp();

  const brands = Array.from(new Set(products.map(p => p.brand))).filter(Boolean);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setFilters({
      minPrice: 0,
      maxPrice: 2000,
      rating: 0,
      brand: 'all',
      minDiscount: 0,
      inStockOnly: false
    });
    setSortOption('popular');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Explore Grocery Catalog'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {products.length} fresh products
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <SlidersHorizontal size={14} /> Sort By:
          </span>
          <select 
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-slate-100 text-xs font-bold text-slate-800 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-emerald-500"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        <div className="w-full lg:w-64 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm h-fit">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Filter size={16} className="text-emerald-600" /> Filters
            </h3>
            <button 
              onClick={resetFilters}
              className="text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1"
            >
              <RotateCcw size={12} /> Reset All
            </button>
          </div>

          <div className="mb-5">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Category</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  selectedCategory === 'all' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">({cat.itemCount})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Brand</h4>
            <select 
              value={filters.brand}
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
              className="w-full bg-slate-100 text-xs font-semibold text-slate-800 border border-slate-200 rounded-xl p-2"
            >
              <option value="all">All Brands</option>
              {brands.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-center text-xs font-extrabold text-slate-700 mb-2">
              <span>Max Price:</span>
              <span className="text-emerald-600">₹{filters.maxPrice}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="mb-5">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Rating</h4>
            <div className="space-y-1">
              {[0, 4, 4.5].map(r => (
                <label key={r} className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                  <input 
                    type="radio" 
                    name="rating" 
                    checked={filters.rating === r} 
                    onChange={() => setFilters({ ...filters, rating: r })}
                    className="accent-emerald-600"
                  />
                  <span>{r === 0 ? 'All Ratings' : `${r}★ & above`}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={filters.inStockOnly} 
                onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
                className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
              />
              <span>In-Stock Only</span>
            </label>
          </div>

        </div>

        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-8">
              <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4">
                <Frown size={32} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mb-1">No products found</h3>
              <p className="text-xs text-slate-500 mb-6">
                We couldn't find any products matching your current search or filters.
              </p>
              <button 
                onClick={resetFilters}
                className="btn-primary text-xs"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
