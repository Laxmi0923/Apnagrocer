import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import HeroBanner from './components/HeroBanner';
import FlashSale from './components/FlashSale';
import ProductCard from './components/ProductCard';
import ProductListingPage from './components/ProductListingPage';
import ProductDetailsModal from './components/ProductDetailsModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingModal from './components/OrderTrackingModal';
import AIAssistantModal from './components/AIAssistantModal';
import AIBudgetShop from './components/AIBudgetShop';
import AIRecipeToCart from './components/AIRecipeToCart';
import AuthModal from './components/AuthModal';
import AboutProjectModal from './components/AboutProjectModal';
import UserProfile from './components/UserProfile';
import AdminLayout from './components/Admin/AdminLayout';
import { Sparkles, ShoppingBag, CheckCircle2, ShieldCheck, Award, ChefHat, Calculator } from 'lucide-react';

function MainContent() {
  const { 
    activeView, 
    setActiveView, 
    products, 
    toast, 
    user, 
    setIsAboutOpen, 
    setIsAIOpen,
    setSelectedCategory
  } = useApp();

  if (activeView === 'admin' || user?.role === 'admin') {
    return <AdminLayout />;
  }

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 8);
  const todaysDeals = products.filter(p => p.discount >= 15).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-2 animate-in slide-in-from-right duration-300">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toast.message}</span>
        </div>
      )}

      <Header />

      <main className="flex-1">
        {activeView === 'home' && (
          <div>
            <HeroBanner />
            <CategoryBar />
            <FlashSale />

            <section className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Today's Mega Deals</h2>
                  <p className="text-xs text-slate-500 font-medium">Unbeatable prices on daily Indian essentials</p>
                </div>
                <button 
                  onClick={() => { setSelectedCategory('all'); setActiveView('catalog'); }}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  View All Deals →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {todaysDeals.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>

            <section className="container mx-auto px-4 py-4">
              <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase mb-2">
                    <Sparkles size={12} /> Powered by Gemini AI
                  </div>
                  <h3 className="text-2xl font-black mb-2">Not Sure What to Buy? Ask ApnaGrocer AI!</h3>
                  <p className="text-xs text-emerald-100 max-w-xl">
                    Get instant grocery recommendations tailored for your family size, budget limits, or recipe ingredients in seconds.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setIsAIOpen(true)}
                    className="btn-accent px-6 py-3 text-xs font-extrabold flex items-center gap-2"
                  >
                    <Sparkles size={16} /> Open AI Chatbot
                  </button>

                  <button 
                    onClick={() => setActiveView('budgetShop')}
                    className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2"
                  >
                    <Calculator size={16} /> Shop By Budget
                  </button>
                </div>
              </div>
            </section>

            <section className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Best Selling Groceries</h2>
                  <p className="text-xs text-slate-500 font-medium">Most loved products ordered by customers daily</p>
                </div>
                <button 
                  onClick={() => { setSelectedCategory('all'); setActiveView('catalog'); }}
                  className="text-xs font-bold text-emerald-600 hover:underline"
                >
                  Explore Catalog →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {bestSellers.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeView === 'catalog' && <ProductListingPage />}
        {activeView === 'budgetShop' && <AIBudgetShop />}
        {activeView === 'recipeToCart' && <AIRecipeToCart />}
        {(activeView === 'tracking' || activeView === 'orders') && <OrderTrackingModal />}
        {(activeView === 'profile' || activeView === 'wishlist') && <UserProfile />}
      </main>

      <ProductDetailsModal />
      <CartDrawer />
      <CheckoutModal />
      <AIAssistantModal />
      <AuthModal />
      <AboutProjectModal />

      <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-slate-800 pb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black">
                  <ShoppingBag size={18} />
                </div>
                <span className="text-xl font-black text-white">Apna<span className="text-emerald-500">Grocer</span></span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                “Your Everyday Grocery, Just a Click Away”
              </p>
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <Award size={14} /> E-Business & Retailing Project Edition
              </p>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Grocery Categories</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => { setSelectedCategory('fruits-vegetables'); setActiveView('catalog'); }} className="hover:text-emerald-400">Fresh Fruits & Veggies</button></li>
                <li><button onClick={() => { setSelectedCategory('dairy-eggs'); setActiveView('catalog'); }} className="hover:text-emerald-400">Dairy & Paneer</button></li>
                <li><button onClick={() => { setSelectedCategory('atta-flour'); setActiveView('catalog'); }} className="hover:text-emerald-400">Chakki Fresh Atta</button></li>
                <li><button onClick={() => { setSelectedCategory('rice-grains'); setActiveView('catalog'); }} className="hover:text-emerald-400">Basmati Rice & Dal</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">AI Shopping Suite</h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li><button onClick={() => setIsAIOpen(true)} className="hover:text-emerald-400 flex items-center gap-1"><Sparkles size={12}/> ApnaGrocer AI Assistant</button></li>
                <li><button onClick={() => setActiveView('budgetShop')} className="hover:text-emerald-400 flex items-center gap-1"><Calculator size={12}/> Shop Within My Budget</button></li>
                <li><button onClick={() => setActiveView('recipeToCart')} className="hover:text-emerald-400 flex items-center gap-1"><ChefHat size={12}/> Recipe To Cart Extractor</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-3">Project Demonstration</h4>
              <button 
                onClick={() => setIsAboutOpen(true)}
                className="btn-secondary text-xs w-full py-2.5 justify-center font-bold mb-3"
              >
                View Project Features Sheet
              </button>
              <p className="text-[11px] text-slate-500">
                Created for E-Business & Retailing viva presentation. Includes working REST API backend, Gemini AI integration, persistent database, order tracking & admin analytics.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 ApnaGrocer. All Rights Reserved. Designed for College Project Viva.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-400"><ShieldCheck size={14}/> 100% Safe Demo Payment Sandbox</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
