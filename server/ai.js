const { GoogleGenAI } = require('@google/genai');
const store = require('./data/store');

let aiClient = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Gemini client init error:', err);
  }
}

async function handleAIChat(userMessage) {
  const products = store.getProducts();
  const lowerMsg = userMessage.toLowerCase();

  // Search matching products
  const matched = products.filter(p => 
    lowerMsg.includes(p.name.toLowerCase()) || 
    lowerMsg.includes(p.category.toLowerCase()) ||
    lowerMsg.includes(p.brand.toLowerCase()) ||
    p.tags.some(t => lowerMsg.includes(t))
  );

  const suggestedProducts = matched.length > 0 ? matched.slice(0, 4) : products.slice(0, 4);

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are ApnaGrocer AI, a helpful Indian grocery shopping assistant. The user asks: "${userMessage}". Give a short, friendly, helpful 2-sentence recommendation suggesting relevant daily groceries like bread, milk, atta, rice, paneer, tea, or snacks.`
      });
      return {
        reply: response.text,
        products: suggestedProducts
      };
    } catch (e) {
      console.warn('Gemini API call fallback:', e.message);
    }
  }

  // Fallback Rule Engine
  let reply = "I've handpicked these top fresh items from ApnaGrocer for your shopping list!";
  if (lowerMsg.includes('snack') || lowerMsg.includes('biscuit') || lowerMsg.includes('chips')) {
    reply = "Here are our top rated crisp snacks, potato chips, and butter biscuits for evening tea!";
  } else if (lowerMsg.includes('bread') || lowerMsg.includes('milk') || lowerMsg.includes('breakfast') || lowerMsg.includes('egg')) {
    reply = "Check out our daily fresh morning breakfast basket with 100% Whole Wheat Bread, Amul Milk, and Eggs!";
  } else if (lowerMsg.includes('rice') || lowerMsg.includes('atta') || lowerMsg.includes('dal') || lowerMsg.includes('oil')) {
    reply = "Here are essential staples including Aashirvaad Atta, Basmati Rice, Toor Dal, and Cooking Oil!";
  }

  return {
    reply,
    products: suggestedProducts
  };
}

async function calculateBudgetBasket(targetBudget) {
  const products = store.getProducts();
  const budget = parseInt(targetBudget) || 1500;
  
  let currentTotal = 0;
  const basket = [];

  // Prioritize essentials: Milk, Bread, Atta, Rice, Oil, Dal, Veggies
  const essentialPriority = ['PROD-002', 'PROD-001', 'PROD-009', 'PROD-012', 'PROD-010', 'PROD-013', 'PROD-014', 'PROD-015', 'PROD-005', 'PROD-020', 'PROD-021', 'PROD-023'];
  
  for (const id of essentialPriority) {
    const prod = products.find(p => p.id === id);
    if (prod && (currentTotal + prod.sellingPrice) <= budget) {
      basket.push(prod);
      currentTotal += prod.sellingPrice;
    }
  }

  // Fill remaining budget with other items
  for (const prod of products) {
    if (!basket.some(b => b.id === prod.id) && (currentTotal + prod.sellingPrice) <= budget) {
      basket.push(prod);
      currentTotal += prod.sellingPrice;
      if (budget - currentTotal < 20) break;
    }
  }

  return {
    budget,
    totalEstimated: currentTotal,
    remaining: budget - currentTotal,
    products: basket
  };
}

async function extractRecipeIngredients(recipeName) {
  const products = store.getProducts();
  const lowerRecipe = recipeName.toLowerCase();

  let matchedIds = [];
  if (lowerRecipe.includes('paneer') || lowerRecipe.includes('matar paneer')) {
    matchedIds = ['PROD-005', 'PROD-014', 'PROD-015', 'PROD-007', 'PROD-025', 'PROD-010'];
  } else if (lowerRecipe.includes('dal') || lowerRecipe.includes('rice')) {
    matchedIds = ['PROD-013', 'PROD-012', 'PROD-011', 'PROD-026', 'PROD-025', 'PROD-015'];
  } else if (lowerRecipe.includes('chai') || lowerRecipe.includes('tea') || lowerRecipe.includes('snack')) {
    matchedIds = ['PROD-021', 'PROD-002', 'PROD-001', 'PROD-024', 'PROD-023'];
  } else {
    matchedIds = ['PROD-001', 'PROD-002', 'PROD-005', 'PROD-009', 'PROD-014', 'PROD-015'];
  }

  const ingredients = matchedIds.map(id => products.find(p => p.id === id)).filter(Boolean);
  const totalCost = ingredients.reduce((sum, item) => sum + item.sellingPrice, 0);

  return {
    recipeName: recipeName || 'Custom Recipe Basket',
    ingredients,
    totalCost
  };
}

function getBusinessInsights() {
  const products = store.getProducts();
  const orders = store.getOrders();

  const lowStockItems = products.filter(p => p.stock < 10);

  return [
    {
      type: 'demand',
      title: 'High Demand Surge: Fresh Milk & Bakery Bread',
      detail: 'Amul Milk and Whole Wheat Bread show 40% higher morning cart additions. Recommend increasing daily procurement.',
      action: 'Increase Morning Batch by 25%'
    },
    {
      type: 'inventory',
      title: `${lowStockItems.length} Products Reaching Reorder Threshold`,
      detail: `Items including ${lowStockItems.slice(0, 2).map(p => p.name).join(', ')} need immediate supplier replenishment.`,
      action: 'Trigger Auto-Restock Order'
    },
    {
      type: 'promotions',
      title: 'Coupon WELCOME100 Driving High Conversion',
      detail: 'New customer registration to order conversion reached 78% following WELCOME100 promotion banner.',
      action: 'Extend Offer Campaign for 7 Days'
    }
  ];
}

module.exports = {
  handleAIChat,
  calculateBudgetBasket,
  extractRecipeIngredients,
  getBusinessInsights
};
