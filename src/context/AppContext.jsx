import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('apnagrocer_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('apnagrocer_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('apnagrocer_user');
      return saved ? JSON.parse(saved) : {
        id: "USR-CUSTOMER-001",
        name: "Rahul Sharma",
        email: "customer@apnagrocer.com",
        role: "customer",
        phone: "+91 98765 43210"
      };
    } catch (e) {
      return null;
    }
  });

  const [location, setLocation] = useState({
    city: "Mumbai",
    pincode: "400001",
    label: "Home - Flat 402, Green Valley, MG Road"
  });

  const [activeView, setActiveView] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    rating: 0,
    brand: 'all',
    minDiscount: 0,
    inStockOnly: false
  });
  const [sortOption, setSortOption] = useState('popular');

  useEffect(() => {
    localStorage.setItem('apnagrocer_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('apnagrocer_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('apnagrocer_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('apnagrocer_user');
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, searchQuery, filters, sortOption]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'all') queryParams.append('category', selectedCategory);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (filters.brand && filters.brand !== 'all') queryParams.append('brand', filters.brand);
      if (filters.minPrice > 0) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice < 2000) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.rating > 0) queryParams.append('rating', filters.rating);
      if (filters.minDiscount > 0) queryParams.append('minDiscount', filters.minDiscount);
      if (filters.inStockOnly) queryParams.append('inStockOnly', 'true');
      if (sortOption) queryParams.append('sort', sortOption);

      const res = await fetch(`/api/products?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const addToCart = (product, quantityToAdd = 1) => {
    if (!product) return;
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        showToast(`Updated ${product.name} quantity!`, 'info');
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      } else {
        showToast(`Added ${product.name} to cart!`, 'success');
        return [...prev, { ...product, quantity: quantityToAdd }];
      }
    });
  };

  const addMultipleToCart = (items) => {
    if (!items || items.length === 0) return;
    setCart(prev => {
      let updated = [...prev];
      items.forEach(newItem => {
        const index = updated.findIndex(i => i.id === newItem.id);
        const qtyToAdd = newItem.quantity || newItem.qty || 1;
        if (index !== -1) {
          updated[index].quantity += qtyToAdd;
        } else {
          updated.push({ ...newItem, quantity: qtyToAdd });
        }
      });
      return updated;
    });
    showToast(`Added ${items.length} items to cart!`, 'success');
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQty = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast(`Removed from Wishlist`, 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`Saved to Wishlist!`, 'success');
        return [...prev, product];
      }
    });
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.sellingPrice * item.quantity), 0);
  const cartMRP = cart.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
  const productDiscount = cartMRP - cartSubtotal;
  const couponDiscountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const deliveryFee = cartSubtotal >= 499 || cart.length === 0 ? 0 : 40;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscountAmount + deliveryFee);
  const freeDeliveryThresholdRemaining = Math.max(0, 499 - cartSubtotal);

  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthOpen(false);
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const logoutUser = () => {
    setUser(null);
    setActiveView('home');
    showToast('Logged out successfully', 'info');
  };

  const switchDemoRole = (role) => {
    if (role === 'admin') {
      setUser({
        id: "USR-ADMIN-001",
        name: "ApnaGrocer Admin",
        email: "admin@apnagrocer.com",
        role: "admin",
        phone: "+91 91234 56789"
      });
      setActiveView('admin');
      showToast('Switched to Admin Portal', 'info');
    } else {
      setUser({
        id: "USR-CUSTOMER-001",
        name: "Rahul Sharma",
        email: "customer@apnagrocer.com",
        role: "customer",
        phone: "+91 98765 43210"
      });
      setActiveView('home');
      showToast('Switched to Customer Account', 'info');
    }
  };

  return (
    <AppContext.Provider value={{
      products,
      categories,
      cart,
      wishlist,
      user,
      location,
      activeView,
      selectedCategory,
      searchQuery,
      selectedProduct,
      activeOrder,
      appliedCoupon,
      isCartOpen,
      isAIOpen,
      isAuthOpen,
      isAboutOpen,
      toast,
      filters,
      sortOption,
      cartSubtotal,
      cartMRP,
      productDiscount,
      couponDiscountAmount,
      deliveryFee,
      cartTotal,
      freeDeliveryThresholdRemaining,
      setActiveView,
      setSelectedCategory,
      setSearchQuery,
      setSelectedProduct,
      setActiveOrder,
      setAppliedCoupon,
      setIsCartOpen,
      setIsAIOpen,
      setIsAuthOpen,
      setIsAboutOpen,
      setFilters,
      setSortOption,
      setLocation,
      addToCart,
      addMultipleToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      loginUser,
      logoutUser,
      switchDemoRole,
      showToast,
      refetchProducts: fetchProducts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
