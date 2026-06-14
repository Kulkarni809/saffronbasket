import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { DirectusService } from './services/DirectusService';

export default function App() {
  const [activePage, setActivePage] = useState('home'); // home | products | product-detail | cart | checkout | auth | profile
  const [selectedProductSlug, setSelectedProductSlug] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Routing sync from Pathname -> State
  useEffect(() => {
    const handlePathChange = () => {
      const path = window.location.pathname || '/';
      
      if (path === '/' || path === '/home') {
        setActivePage('home');
      } else if (path.startsWith('/products')) {
        const parts = path.split('/');
        if (parts[2]) {
          setSelectedCategory(parts[2]);
        } else {
          setSelectedCategory('');
        }
        setActivePage('products');
      } else if (path.startsWith('/product/')) {
        const slug = path.replace('/product/', '');
        setSelectedProductSlug(slug);
        setActivePage('product-detail');
      } else if (path === '/cart') {
        setActivePage('cart');
      } else if (path === '/checkout') {
        setActivePage('checkout');
      } else if (path === '/auth') {
        setActivePage('auth');
      } else if (path === '/profile') {
        setActivePage('profile');
      }
    };

    window.addEventListener('popstate', handlePathChange);
    handlePathChange(); // Sync initial load

    return () => window.removeEventListener('popstate', handlePathChange);
  }, []);

  // Routing sync from State -> Pathname
  useEffect(() => {
    let targetPath = '/';
    if (activePage === 'home') {
      targetPath = '/';
    } else if (activePage === 'products') {
      targetPath = selectedCategory ? `/products/${selectedCategory}` : '/products';
    } else if (activePage === 'product-detail') {
      targetPath = `/product/${selectedProductSlug}`;
    } else {
      targetPath = `/${activePage}`;
    }

    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [activePage, selectedCategory, selectedProductSlug]);
  
  // Localized state: Shopping Cart
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('saffron_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Authenticated user state
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync cart state to localStorage
  useEffect(() => {
    localStorage.setItem('saffron_cart', JSON.stringify(cart));
  }, [cart]);

  // Check active session on mount
  useEffect(() => {
    async function checkAuth() {
      if (DirectusService.isAuthenticated()) {
        try {
          const currentUser = await DirectusService.getCurrentUser();
          setUser(currentUser);
        } catch (e) {
          console.error('Session validation failed:', e);
          setUser(null);
        }
      }
      setAuthLoading(false);
    }
    checkAuth();
  }, []);

  // Cart Actions
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      // Find matching item by BOTH id AND weight configuration!
      const existingItemIdx = prevCart.findIndex(
        (item) => item.id === product.id && item.weight === product.weight
      );

      if (existingItemIdx > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIdx].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });

    // Automatically navigate to cart view for feedback, or let them stay.
    // Let's open the cart page so they can review their selection.
    setActivePage('cart');
  };

  const updateCartQuantity = (id, weight, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id, weight);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.weight === weight
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (id, weight) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.weight === weight))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    DirectusService.logout();
    setUser(null);
  };

  // Route Dispatcher
  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <Home 
            setActivePage={setActivePage} 
            setSelectedProductSlug={setSelectedProductSlug}
            addToCart={addToCart}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'products':
        return (
          <Products 
            setSelectedProductSlug={setSelectedProductSlug}
            setActivePage={setActivePage}
            addToCart={addToCart}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'product-detail':
        return (
          <ProductDetail 
            slug={selectedProductSlug}
            setActivePage={setActivePage}
            addToCart={addToCart}
          />
        );
      case 'cart':
        return (
          <Cart 
            cart={cart}
            updateCartQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
            setActivePage={setActivePage}
          />
        );
      case 'checkout':
        return (
          <Checkout 
            cart={cart}
            clearCart={clearCart}
            setActivePage={setActivePage}
            user={user}
          />
        );
      case 'auth':
        return (
          <Auth 
            onLoginSuccess={handleLoginSuccess}
            setActivePage={setActivePage}
          />
        );
      case 'profile':
        return (
          <Profile 
            user={user}
            setActivePage={setActivePage}
          />
        );
      default:
        return (
          <Home 
            setActivePage={setActivePage} 
            setSelectedProductSlug={setSelectedProductSlug}
            addToCart={addToCart}
            setSelectedCategory={setSelectedCategory}
          />
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark text-text-primary">
      
      {/* Sticky Header */}
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage} 
        cart={cart} 
        user={user}
        onLogout={handleLogout}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      
      {/* Core Page Content Body */}
      <main className="flex-grow">
        {authLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-8 h-8 text-gold animate-spin" style={{ color: 'hsl(var(--color-primary-gold))' }} />
            <p className="text-sm text-text-muted">Verifying secure customer session...</p>
          </div>
        ) : (
          renderPage()
        )}
      </main>

      {/* Footer */}
      <Footer 
        setActivePage={setActivePage} 
        setSelectedCategory={setSelectedCategory} 
      />

    </div>
  );
}

function Loader2({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`lucide lucide-loader-2 ${className}`}
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
