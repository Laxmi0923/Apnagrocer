import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function AuthModal() {
  const { isAuthOpen, setIsAuthOpen, login, user, logout } = useApp();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('rahul@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Rahul Sharma');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const body = isSignUp ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');

      login(data.user);
      setIsAuthOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (role) => {
    if (role === 'customer') {
      setEmail('rahul@example.com');
      setPassword('password123');
      setName('Rahul Sharma');
      setIsSignUp(false);
    } else {
      setEmail('admin@apnagrocer.com');
      setPassword('admin123');
      setName('ApnaGrocer Admin');
      setIsSignUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-emerald-100 relative">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Banner */}
        <div className="p-6 bg-gradient-to-br from-emerald-800 to-teal-900 text-white relative">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">ApnaGrocer Account</span>
          </div>
          <h2 className="text-2xl font-black">{isSignUp ? 'Create Customer Account' : 'Welcome Back!'}</h2>
          <p className="text-xs text-emerald-100 mt-1 font-medium">
            {isSignUp ? 'Sign up to track orders, save wishlist & unlock offers.' : 'Sign in to access your saved groceries & 1-click checkout.'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4">
          
          {/* Quick Demo Credentials Switcher */}
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
            <p className="text-[11px] font-bold text-emerald-800 uppercase mb-2">⚡ Quick Fill Demo Logins:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('customer')}
                className="px-3 py-1.5 bg-white border border-emerald-300 hover:bg-emerald-100 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-emerald-600" /> Customer Demo
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('admin')}
                className="px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" /> Admin Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Authenticating...' : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center pt-2 border-t border-slate-100">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up Free"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
