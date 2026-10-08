const express = require('express');
const router = express.Router();
const store = require('../data/store');
const ai = require('../ai');

// ----------------------------------------------------
// PRODUCT & CATALOG ENDPOINTS
// ----------------------------------------------------

// GET /api/products (supports category, search, brand, minPrice, maxPrice, rating, minDiscount, inStockOnly, sort)
router.get('/products', (req, res) => {
  let products = [...store.getProducts()];
  const { category, search, brand, minPrice, maxPrice, rating, minDiscount, inStockOnly, sort } = req.query;

  if (category && category !== 'all') {
    products = products.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  if (brand && brand !== 'all') {
    products = products.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  if (minPrice) {
    products = products.filter(p => p.sellingPrice >= parseFloat(minPrice));
  }

  if (maxPrice) {
    products = products.filter(p => p.sellingPrice <= parseFloat(maxPrice));
  }

  if (rating) {
    products = products.filter(p => p.rating >= parseFloat(rating));
  }

  if (minDiscount) {
    products = products.filter(p => p.discount >= parseFloat(minDiscount));
  }

  if (inStockOnly === 'true') {
    products = products.filter(p => p.stock > 0);
  }

  // Sorting
  if (sort === 'price-low') {
    products.sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (sort === 'price-high') {
    products.sort((a, b) => b.sellingPrice - a.sellingPrice);
  } else if (sort === 'rating') {
    products.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'discount') {
    products.sort((a, b) => b.discount - a.discount);
  } else if (sort === 'newest') {
    products.sort((a, b) => b.id.localeCompare(a.id));
  }

  res.json({ success: true, count: products.length, products });
});

// GET /api/products/:id
router.get('/products/:id', (req, res) => {
  const product = store.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const reviews = store.getReviewsByProductId(product.id);
  
  // Frequently bought together recommendation
  const allProducts = store.getProducts();
  const frequentlyBoughtTogether = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 2);

  res.json({
    success: true,
    product,
    reviews,
    frequentlyBoughtTogether
  });
});

// GET /api/categories
router.get('/categories', (req, res) => {
  res.json({ success: true, categories: store.getCategories() });
});

// ----------------------------------------------------
// AI SHOPPING ENDPOINTS
// ----------------------------------------------------

// POST /api/ai/chat
router.post('/ai/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message prompt required' });

    const result = await ai.handleAIChat(message);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ success: false, message: 'AI Assistant temporary error' });
  }
});

// POST /api/ai/budget-shop
router.post('/ai/budget-shop', async (req, res) => {
  try {
    const { budget } = req.body;
    const result = await ai.calculateBudgetBasket(budget);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Budget shop error:', err);
    res.status(500).json({ success: false, message: 'Budget calculation error' });
  }
});

// POST /api/ai/recipe-ingredients
router.post('/api/ai/recipe-ingredients', async (req, res) => {
  try {
    const { recipe } = req.body;
    const result = await ai.extractRecipeIngredients(recipe);
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Recipe error:', err);
    res.status(500).json({ success: false, message: 'Recipe ingredient extraction error' });
  }
});

// ----------------------------------------------------
// COUPON & CART ENDPOINTS
// ----------------------------------------------------

// GET /api/coupons
router.get('/coupons', (req, res) => {
  res.json({ success: true, coupons: store.getCoupons() });
});

// POST /api/coupons/validate
router.post('/coupons/validate', (req, res) => {
  const { code, cartSubtotal } = req.body;
  if (!code) return res.status(400).json({ success: false, message: 'Coupon code required' });

  const result = store.validateCoupon(code, cartSubtotal || 0);
  if (result.valid) {
    res.json({ success: true, coupon: result.coupon, message: result.message });
  } else {
    res.status(400).json({ success: false, message: result.message });
  }
});

// ----------------------------------------------------
// ORDER & CHECKOUT ENDPOINTS
// ----------------------------------------------------

// GET /api/orders
router.get('/orders', (req, res) => {
  res.json({ success: true, orders: store.getOrders() });
});

// GET /api/orders/:id
router.get('/orders/:id', (req, res) => {
  const order = store.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
});

// POST /api/orders
router.post('/orders', (req, res) => {
  const orderData = req.body;
  if (!orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
  }

  const created = store.createOrder(orderData);
  res.status(201).json({ success: true, message: 'Order created successfully', order: created });
});

// ----------------------------------------------------
// REVIEWS ENDPOINTS
// ----------------------------------------------------

// POST /api/reviews
router.post('/reviews', (req, res) => {
  const { productId, userName, rating, title, comment } = req.body;
  if (!productId || !comment) {
    return res.status(400).json({ success: false, message: 'Product ID and comment required' });
  }

  const newReview = store.addReview({ productId, userName: userName || 'Customer', rating: parseInt(rating) || 5, title, comment });
  res.status(201).json({ success: true, review: newReview });
});

// ----------------------------------------------------
// AUTH ENDPOINTS
// ----------------------------------------------------

// POST /api/auth/login
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@apnagrocer.com') {
    return res.json({
      success: true,
      user: {
        id: 'USR-ADMIN-001',
        name: 'ApnaGrocer Admin',
        email: 'admin@apnagrocer.com',
        role: 'admin',
        phone: '+91 91234 56789'
      }
    });
  }

  res.json({
    success: true,
    user: {
      id: 'USR-CUSTOMER-001',
      name: 'Rahul Sharma',
      email: email || 'rahul@example.com',
      role: 'customer',
      phone: '+91 98765 43210'
    }
  });
});

// POST /api/auth/signup
router.post('/auth/signup', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    success: true,
    user: {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: name || 'New Customer',
      email: email,
      role: 'customer',
      phone: '+91 98765 43210'
    }
  });
});

// ----------------------------------------------------
// ADMIN ENDPOINTS
// ----------------------------------------------------

// PUT /api/admin/products/:id
router.put('/admin/products/:id', (req, res) => {
  const updated = store.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product: updated });
});

// POST /api/admin/products
router.post('/admin/products', (req, res) => {
  const newProd = {
    id: 'PROD-' + Math.floor(100 + Math.random() * 900),
    rating: 4.5,
    reviewCount: 0,
    tags: [],
    ...req.body
  };
  const created = store.addProduct(newProd);
  res.status(201).json({ success: true, product: created });
});

// PUT /api/admin/orders/:id/status
router.put('/admin/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const updated = store.updateOrderStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order: updated });
});

// GET /api/admin/insights
router.get('/admin/insights', (req, res) => {
  const insights = ai.getBusinessInsights();
  res.json({ success: true, insights });
});

module.exports = router;
