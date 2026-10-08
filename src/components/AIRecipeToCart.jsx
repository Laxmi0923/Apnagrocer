import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Utensils, Sparkles, Plus, CheckCircle2, ShoppingBag, Loader2 } from 'lucide-react';

export default function AIRecipeToCart() {
  const { addToCart, formatPrice, addNotification } = useApp();
  const [recipe, setRecipe] = useState('Paneer Butter Masala for 4');
  const [loading, setLoading] = useState(false);
  const [recipeResult, setRecipeResult] = useState(null);

  const sampleRecipes = [
    "Paneer Butter Masala for 4",
    "Dal Tadka & Steamed Rice",
    "Healthy Oats & Fruit Smoothie",
    "Masala Chai & Evening Snacks"
  ];

  const handleExtract = async (dishName) => {
    const query = dishName || recipe;
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/recipe-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe: query })
      });
      const data = await res.json();
      setRecipeResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = () => {
    if (!recipeResult || !recipeResult.ingredients) return;
    recipeResult.ingredients.forEach(item => addToCart(item));
    addNotification(`Added recipe ingredients for ${recipeResult.recipeName} to your cart!`, 'success');
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 my-8 shadow-xl relative overflow-hidden">
      
      {/* Decorative background glow */}
      <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-amber-400 text-slate-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-slate-950" /> Cooking Smart
          </span>
          <h3 className="text-2xl font-black">What are you cooking today?</h3>
        </div>
        <p className="text-xs text-emerald-100/80 mb-6 font-medium">
          Type any dish name (e.g. "Veg Biryani for 6 people"), and ApnaGrocer AI will automatically gather all required fresh ingredients from our catalog!
        </p>

        {/* Input Form */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 mb-4">
          <div className="flex items-center gap-3 px-3 py-2 flex-1 w-full">
            <Utensils className="w-5 h-5 text-amber-300 shrink-0" />
            <input
              type="text"
              value={recipe}
              onChange={(e) => setRecipe(e.target.value)}
              placeholder="e.g. Matar Paneer with Butter Naan..."
              className="w-full text-xs font-bold text-white placeholder-emerald-200/60 bg-transparent outline-none"
            />
          </div>
          <button
            onClick={() => handleExtract()}
            disabled={loading || !recipe.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 hover:from-amber-300 hover:to-amber-400 disabled:opacity-50 font-black text-xs rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Gathering Ingredients...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Extract Ingredients to Cart
              </>
            )}
          </button>
        </div>

        {/* Sample chips */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="text-[11px] text-emerald-200 font-semibold">Try:</span>
          {sampleRecipes.map((r, i) => (
            <button
              key={i}
              onClick={() => {
                setRecipe(r);
                handleExtract(r);
              }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-emerald-100 text-xs rounded-full border border-white/10 transition-colors font-medium"
            >
              {r}
            </button>
          ))}
        </div>

        {/* Recipe Ingredient Breakdown */}
        {recipeResult && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h4 className="font-extrabold text-base text-amber-300">{recipeResult.recipeName}</h4>
                <p className="text-xs text-emerald-200">{recipeResult.ingredients.length} essential items matched in stock</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-emerald-200 block">Total Ingredients Cost</span>
                <span className="text-xl font-black text-white">{formatPrice(recipeResult.totalCost)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recipeResult.ingredients.map((ing) => (
                <div key={ing.id} className="bg-slate-950/40 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-2">
                  <img src={ing.image} alt={ing.name} className="w-10 h-10 object-contain rounded-lg bg-white/10 p-1" />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-white truncate">{ing.name}</h5>
                    <p className="text-[11px] text-emerald-200">{ing.quantity} • {formatPrice(ing.sellingPrice)}</p>
                  </div>
                  <button
                    onClick={() => addToCart(ing)}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-end">
              <button
                onClick={handleAddAll}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add All Available Ingredients ({formatPrice(recipeResult.totalCost)})
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
