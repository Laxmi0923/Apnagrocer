import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  MapPin, 
  Sparkles, 
  Menu, 
  X, 
  ShieldCheck, 
  Clock, 
  ChevronDown,
  Info,
  ChefHat,
  Calculator,
  Flame,
  LayoutDashboard
} from 'lucide-react';

export default function Header() {
  const { 
    cart, 
    wishlist, 
    user, 
    location, 
    setLocation,
    activeView, 
    setActiveView, 
    searchQuery, 
    setSearchQuery,
    setSelectedCategory,
    setIsCartOpen,
    setIsAIOpen,
    setIsAuthOpen,
    setIsAboutOpen,
    switchDemoRole,
    cartSubtotal
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const cartItemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const locations = [
    { city: "Mumbai", pincode: "400001", label: "Home - Flat 402, Green Valley, MG Road" },
    { city: "Mumbai", pincode: "400019", label: "College Campus - VJTI Hostel Block B" },
    { city: "Bengaluru", pincode: "560001", label: "Indiranagar 100ft Road" },
    { city: "Delhi", pincode: "110001", label: "Connaught Place Block A" }
  ];

  const popularSearches = [
    "Healthy snacks under ₹300",
    "Aashirvaad Atta 5kg",
    "Amul Cow Ghee",
    "India Gate Basmati Rice",
    "Paneer & Butter",
    "Maggi 2-Min Noodles"
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchFocused(false);
    if (searchQuery.trim()) {
      setActiveView('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-header shadow-sm">
      {/* Top Notice Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs font-medium py-1.5 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Startup Edition</span>
            <span>ApnaGrocer AI-Powered Express Retailing Platform</span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1"><Clock size={13} className="text-amber-300"/> 2-Hour Express Delivery</span>
            <span className="flex items-center gap-1"><ShieldCheck size={13} className="text-amber-300"/> 100% Quality Guarantee</span>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className="underline font-bold hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Info size={12}/> Project Viva Sheet
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <button 
              className="lg:hidden text-slate-700 hover:text-emerald-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div 
              onClick={() => { setActiveView('home'); setSelectedCategory('all'); }}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
                <ShoppingBag size={22} className="stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Apna<span className="text-emerald-600">Grocer</span>
                  </span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-black px-1.5 py-0.5 rounded-md border border-emerald-300">
                    AI 2.0
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-500 tracking-tight hidden sm:block">
                  Your Everyday Grocery, Just a Click Away
                </p>
              </div>
            </div>
          </div>

          {/* Delivery Location Selector */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl px-3.5 py-1.5 cursor-pointer relative transition-all"
               onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
          >
            <MapPin size={18} className="text-emerald-600 shrink-0 animate-bounce" />
            <div className="text-left text-xs">
              <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">Deliver To</p>
              <p className="font-extrabold text-slate-900 max-w-[150px] truncate">{location.city} ({location.pincode})</p>
            </div>
            <ChevronDown size={14} className="text-slate-500" />

            {locationDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <p className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase">Select Pincode / Location</p>
                {locations.map((loc, i) => (
                  <div 
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(loc);
                      setLocationDropdownOpen(false);
                    }}
                    className="px-3 py-2 text-xs hover:bg-emerald-50 cursor-pointer font-bold text-slate-700 flex items-center justify-between border-b last:border-0 border-slate-100"
                  >
                    <div>
                      <p className="font-black text-slate-900">{loc.city} - {loc.pincode}</p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[190px]">{loc.label}</p>
                    </div>
                    {location.pincode === loc.pincode && <span className="text-emerald-600 font-black">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prominent Search Bar */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input 
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rice, milk, atta, snacks..."
                className="w-full bg-slate-100/90 focus:bg-white border-2 border-transparent focus:border-emerald-500 rounded-2xl pl-11 pr-24 py-2.5 text-xs font-bold text-slate-900 placeholder-slate-400 outline-none transition-all shadow-inner"
              />
              <Search size={18} className="absolute left-3.5 text-slate-400" />
              
              <button 
                type="button"
                onClick={() => setIsAIOpen(true)}
                className="absolute right-2 btn-accent text-[11px] py-1.5 px-3 rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles size={13} className="animate-spin" />
                <span>AI Search</span>
              </button>
            </form>

            {/* Focused Search Suggestions Dropdown */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] font-extrabold uppercase text-slate-400 mb-2">Popular Searches</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {popularSearches.map((s, idx) => (
                    <button
                      key={idx}
                      onMouseDown={() => {
                        setSearchQuery(s);
                        setActiveView('catalog');
                      }}
                      className="bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-xl border border-slate-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div 
                  onMouseDown={() => setIsAIOpen(true)}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 p-2.5 rounded-xl border border-emerald-200 cursor-pointer flex items-center justify-between text-xs font-extrabold text-emerald-800"
                >
                  <span className="flex items-center gap-1.5"><Sparkles size={14} className="text-emerald-600"/> Search with ApnaGrocer AI</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-lg">Try Prompt</span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            <button 
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3.5 py-2 rounded-2xl text-xs font-extrabold transition-all hover:scale-105"
            >
              <Sparkles size={16} className="text-emerald-600" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            <button 
              onClick={() => setActiveView('wishlist')}
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-2xl transition-all"
              title="Wishlist"
            >
              <Heart size={21} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 btn-primary py-2 px-3.5 rounded-2xl text-xs font-extrabold"
            >
              <div className="relative">
                <ShoppingBag size={19} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
              {cartSubtotal > 0 && (
                <span className="bg-emerald-950/40 px-1.5 py-0.5 rounded text-[11px]">
                  ₹{cartSubtotal}
                </span>
              )}
            </button>

            {/* Account Switcher */}
            <div className="relative group">
              <button 
                onClick={() => user ? setActiveView(user.role === 'admin' ? 'admin' : 'profile') : setIsAuthOpen(true)}
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-slate-700 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200"
              >
                <User size={19} className="text-emerald-600" />
                <span className="text-xs font-bold hidden md:inline max-w-[90px] truncate">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-50">
                <p className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Quick Demo Switcher
                </p>
                <button
                  onClick={() => switchDemoRole('customer')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between mb-1 ${user?.role === 'customer' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>Customer Demo</span>
                  {user?.role === 'customer' && <span className="text-emerald-600 text-[10px]">Active</span>}
                </button>

                <button
                  onClick={() => switchDemoRole('admin')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between ${user?.role === 'admin' ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span className="flex items-center gap-1.5"><LayoutDashboard size={13}/> Admin Dashboard</span>
                  {user?.role === 'admin' && <span className="text-emerald-600 text-[10px]">Active</span>}
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Mobile search bar */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries..."
              className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          </form>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-white border-t border-slate-100 overflow-x-auto scrollbar-none py-2 px-4 shadow-inner">
        <div className="container mx-auto flex items-center justify-between gap-6 min-w-max text-xs font-bold text-slate-700">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => { setActiveView('home'); setSelectedCategory('all'); }}
              className={`hover:text-emerald-600 transition-colors ${activeView === 'home' ? 'text-emerald-600 font-black' : ''}`}
            >
              Home
            </button>

            <button 
              onClick={() => { setActiveView('catalog'); setSelectedCategory('all'); }}
              className={`hover:text-emerald-600 transition-colors ${activeView === 'catalog' ? 'text-emerald-600 font-black' : ''}`}
            >
              All Categories
            </button>

            <button 
              onClick={() => setActiveView('catalog')}
              className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <Flame size={14} className="animate-bounce" /> Flash Sale
            </button>

            <button 
              onClick={() => setActiveView('budgetShop')}
              className={`flex items-center gap-1 hover:text-emerald-600 transition-colors ${activeView === 'budgetShop' ? 'text-emerald-600 font-black' : ''}`}
            >
              <Calculator size={14} className="text-emerald-600" /> Shop By Budget
            </button>

            <button 
              onClick={() => setActiveView('recipeToCart')}
              className={`flex items-center gap-1 hover:text-emerald-600 transition-colors ${activeView === 'recipeToCart' ? 'text-emerald-600 font-black' : ''}`}
            >
              <ChefHat size={14} className="text-rose-500" /> Recipe To Cart
            </button>

            <button 
              onClick={() => setIsAIOpen(true)}
              className="flex items-center gap-1 text-emerald-800 hover:text-emerald-900 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200"
            >
              <Sparkles size={13} className="text-emerald-600" /> AI Assistant
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500 font-semibold">
            {user?.role === 'admin' ? (
              <button 
                onClick={() => setActiveView('admin')}
                className="bg-slate-900 text-white px-3 py-1 rounded-xl flex items-center gap-1 font-bold"
              >
                <LayoutDashboard size={12}/> Admin Portal
              </button>
            ) : (
              <button 
                onClick={() => switchDemoRole('admin')}
                className="hover:text-emerald-600 text-slate-600 underline font-bold"
              >
                Switch to Admin Portal
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
