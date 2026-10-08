const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, 'products.json');
const categoriesFilePath = path.join(__dirname, 'categories.json');

let products = [];
let categories = [];
let orders = [
  {
    id: 'APG10245',
    userId: 'USR-CUSTOMER-001',
    customerName: 'Rahul Sharma',
    customerEmail: 'rahul@example.com',
    customerPhone: '+91 98765 43210',
    items: [
      { id: 'PROD-001', name: 'Britannia 100% Whole Wheat Bread', quantity: 2, sellingPrice: 42 },
      { id: 'PROD-002', name: 'Amul Taaza Toned Milk (Pouch)', quantity: 2, sellingPrice: 27 },
      { id: 'PROD-005', name: 'Amul Fresh Malai Paneer', quantity: 1, sellingPrice: 85 }
    ],
    totalAmount: 223,
    status: 'Out for Delivery',
    paymentMethod: 'UPI (rahul@okaxis)',
    address: {
      type: 'Home',
      name: 'Rahul Sharma',
      street: 'Flat 402, Green Valley, MG Road',
      city: 'Mumbai',
      pincode: '400001',
      phone: '+91 98765 43210'
    },
    deliverySlot: '9 AM - 12 PM',
    createdAt: new Date().toISOString()
  }
];

let coupons = [
  { code: 'WELCOME100', discountType: 'fixed', discountAmount: 100, minOrder: 499, description: 'Flat ₹100 OFF on your first grocery order above ₹499' },
  { code: 'APNA20', discountType: 'percentage', percentage: 20, maxDiscount: 300, minOrder: 999, description: '20% OFF on order above ₹999 (Max ₹300)' },
  { code: 'GROCERY10', discountType: 'percentage', percentage: 10, maxDiscount: 150, minOrder: 799, description: '10% OFF on monthly essentials above ₹799' },
  { code: 'SAVE200', discountType: 'fixed', discountAmount: 200, minOrder: 1499, description: 'Flat ₹200 OFF on mega basket above ₹1499' }
];

let reviews = [
  { id: 'REV-1', productId: 'PROD-001', userName: 'Priya Patel', rating: 5, title: 'Super fresh bread', comment: 'Always soft and delivered right on time in the morning.', date: '2026-02-10' },
  { id: 'REV-2', productId: 'PROD-002', userName: 'Amit Kumar', rating: 5, title: 'Best for tea', comment: 'Amul milk is fresh with zero leakage.', date: '2026-02-12' },
  { id: 'REV-3', productId: 'PROD-005', userName: 'Sneha Rao', rating: 4, title: 'Great quality paneer', comment: 'Very soft and fresh malai paneer.', date: '2026-02-14' }
];

function loadData() {
  try {
    if (fs.existsSync(productsFilePath)) {
      products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    }
    if (fs.existsSync(categoriesFilePath)) {
      categories = JSON.parse(fs.readFileSync(categoriesFilePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading store data:', err);
  }
}

function saveData() {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving products:', err);
  }
}

loadData();

module.exports = {
  getProducts: () => products,
  getProductById: (id) => products.find(p => p.id === id),
  updateProduct: (id, updateData) => {
    const idx = products.findIndex(p => p.id === id);
    if (idx !== -1) {
      products[idx] = { ...products[idx], ...updateData };
      saveData();
      return products[idx];
    }
    return null;
  },
  addProduct: (product) => {
    products.unshift(product);
    saveData();
    return product;
  },
  getCategories: () => categories,
  getOrders: () => orders,
  getOrderById: (id) => orders.find(o => o.id === id),
  createOrder: (orderData) => {
    const newOrder = {
      id: 'APG' + Math.floor(10000 + Math.random() * 90000),
      createdAt: new Date().toISOString(),
      status: 'Placed',
      ...orderData
    };

    // Decrement stock
    if (newOrder.items && newOrder.items.length > 0) {
      newOrder.items.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
          if (prod.stock === 0) prod.stockStatus = 'Out of Stock';
          else if (prod.stock < 10) prod.stockStatus = 'Low Stock';
        }
      });
      saveData();
    }

    orders.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus: (orderId, status) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      return order;
    }
    return null;
  },
  getCoupons: () => coupons,
  validateCoupon: (code, subtotal) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { valid: false, message: 'Invalid Coupon Code' };
    if (subtotal < coupon.minOrder) {
      return { valid: false, message: `Coupon requires minimum order of ₹${coupon.minOrder}` };
    }
    let discountAmount = 0;
    if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountAmount;
    } else if (coupon.discountType === 'percentage') {
      discountAmount = Math.min(coupon.maxDiscount || Infinity, Math.round((subtotal * coupon.percentage) / 100));
    }
    return { valid: true, coupon: { ...coupon, discountAmount }, message: `Coupon ${coupon.code} applied! You save ₹${discountAmount}` };
  },
  getReviewsByProductId: (productId) => reviews.filter(r => r.productId === productId),
  addReview: (review) => {
    const newRev = {
      id: 'REV-' + (reviews.length + 1),
      date: new Date().toISOString().split('T')[0],
      ...review
    };
    reviews.unshift(newRev);
    return newRev;
  }
};
