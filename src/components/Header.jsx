import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, Menu, X, Leaf } from 'lucide-react';

export default function Header({ activePage, setActivePage, cart, user, onLogout, selectedCategory, setSelectedCategory }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavClick = (page) => {
    setActivePage(page);
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleCategoryNavClick = (categorySlug) => {
    setSelectedCategory(categorySlug);
    setActivePage('products');
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const handleHomeClick = () => {
    setSelectedCategory('');
    handleNavClick('home');
  };

  return (
    <header className="glass-nav sticky top-0 left-0 w-full z-50 transition-all duration-300">
      <div className="container h-16 flex items-center justify-between">

        {/* Brand Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => handleNavClick('home')}
        >
          <Leaf className="w-5 h-5 text-gold group-hover:rotate-12 transition-transform duration-300" style={{ color: 'hsl(var(--color-primary-gold))' }} />
          <span className="font-serif text-lg md:text-xl font-bold tracking-tight">
            saffron<span className="text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>basket</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-medium">
          <button
            onClick={handleHomeClick}
            className={`h-10 px-3 transition-all duration-300 hover:text-gold ${activePage === 'home' ? 'text-gold font-semibold' : 'text-text-secondary'}`}
            style={{ color: activePage === 'home' ? 'hsl(var(--color-primary-gold))' : '' }}
          >
            Home
          </button>
          <button
            onClick={() => handleCategoryNavClick('saffron')}
            className={`h-10 px-3 transition-all duration-300 hover:text-gold ${activePage === 'products' && selectedCategory === 'saffron' ? 'text-gold font-semibold' : 'text-text-secondary'}`}
            style={{ color: activePage === 'products' && selectedCategory === 'saffron' ? 'hsl(var(--color-primary-gold))' : '' }}
          >
            Saffron
          </button>
          <button
            onClick={() => handleCategoryNavClick('shilajit')}
            className={`h-10 px-3 transition-all duration-300 hover:text-gold ${activePage === 'products' && selectedCategory === 'shilajit' ? 'text-gold font-semibold' : 'text-text-secondary'}`}
            style={{ color: activePage === 'products' && selectedCategory === 'shilajit' ? 'hsl(var(--color-primary-gold))' : '' }}
          >
            Shilajit
          </button>
          <button
            onClick={() => handleCategoryNavClick('dry-fruits')}
            className={`h-10 px-3 transition-all duration-300 hover:text-gold ${activePage === 'products' && selectedCategory === 'dry-fruits' ? 'text-gold font-semibold' : 'text-text-secondary'}`}
            style={{ color: activePage === 'products' && selectedCategory === 'dry-fruits' ? 'hsl(var(--color-primary-gold))' : '' }}
          >
            Dry Fruits
          </button>
          <button
            onClick={() => {
              handleHomeClick();
              setTimeout(() => {
                const element = document.getElementById('manifesto');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="h-10 px-3 transition-all duration-300 text-text-secondary hover:text-gold cursor-pointer"
          >
            Story
          </button>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-3">

          {/* Cart Icon */}
          <button
            onClick={() => handleNavClick('cart')}
            className="relative w-10 h-10 rounded-full border border-white/10 hover:border-gold/30 hover:bg-white/5 text-text-primary hover:text-gold transition-all duration-300 cursor-pointer flex items-center justify-center"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-crimson text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse-gold" style={{ backgroundColor: 'hsl(var(--color-primary-crimson))' }}>
                {cartItemsCount}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="h-10 flex items-center gap-2 px-4 rounded-full bg-white/5 border border-white/10 hover:border-gold/30 hover:bg-white/10 transition-all text-sm font-medium cursor-pointer"
                >
                  <User className="w-4 h-4 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
                  <span className="hidden sm:inline">Salam, {user.first_name || 'Guest'}</span>
                </button>
                
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md bg-bg-panel border border-glass-border shadow-lg py-1 z-50 animate-fade-in-up font-sans" style={{ backgroundColor: 'hsl(var(--color-bg-panel))', borderColor: 'var(--glass-border)' }}>
                    <button 
                      onClick={() => handleNavClick('profile')}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-gold hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      My Orders & Account
                    </button>
                    <hr className="border-white/5 my-1" />
                    <button 
                      onClick={() => {
                        onLogout();
                        handleNavClick('home');
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-primary-crimson hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ color: 'hsl(var(--color-primary-crimson))' }}
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('auth')}
                className="h-10 flex items-center gap-2 px-5 rounded-full border border-primary-gold/40 hover:bg-gold hover:text-bg-dark hover:border-gold hover:shadow-[0_0_15px_hsl(var(--color-primary-gold)/0.3)] text-gold text-sm font-semibold transition-all duration-300 cursor-pointer"
                style={{ color: 'hsl(var(--color-primary-gold))', borderColor: 'hsl(var(--color-primary-gold) / 0.4)' }}
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 md:hidden hover:text-gold transition-colors"
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-bg-panel py-6 px-6 flex flex-col gap-5 font-sans animate-fade-in-up shadow-xl" style={{ backgroundColor: 'hsl(var(--color-bg-panel))' }}>
          <button 
            onClick={handleHomeClick}
            className={`text-left py-1 text-base transition-colors ${activePage === 'home' ? 'text-gold' : 'text-text-secondary'}`}
            style={{ color: activePage === 'home' ? 'hsl(var(--color-primary-gold))' : '' }}
          >
            Home
          </button>
          
          <div className="flex flex-col gap-2.5 pl-4 border-l border-white/10 my-1">
            <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold block mb-1">Collections</span>
            <button 
              onClick={() => handleCategoryNavClick('saffron')}
              className={`text-left py-1 text-sm transition-colors ${activePage === 'products' && selectedCategory === 'saffron' ? 'text-gold' : 'text-text-secondary'}`}
              style={{ color: activePage === 'products' && selectedCategory === 'saffron' ? 'hsl(var(--color-primary-gold))' : '' }}
            >
              Afghan Saffron
            </button>
            <button 
              onClick={() => handleCategoryNavClick('shilajit')}
              className={`text-left py-1 text-sm transition-colors ${activePage === 'products' && selectedCategory === 'shilajit' ? 'text-gold' : 'text-text-secondary'}`}
              style={{ color: activePage === 'products' && selectedCategory === 'shilajit' ? 'hsl(var(--color-primary-gold))' : '' }}
            >
              Mountain Shilajit
            </button>
            <button 
              onClick={() => handleCategoryNavClick('dry-fruits')}
              className={`text-left py-1 text-sm transition-colors ${activePage === 'products' && selectedCategory === 'dry-fruits' ? 'text-gold' : 'text-text-secondary'}`}
              style={{ color: activePage === 'products' && selectedCategory === 'dry-fruits' ? 'hsl(var(--color-primary-gold))' : '' }}
            >
              Organic Dry Fruits
            </button>
          </div>

          <button 
            onClick={() => handleCategoryNavClick('')}
            className={`text-left py-1 text-base transition-colors ${activePage === 'products' && selectedCategory === '' ? 'text-gold' : 'text-text-secondary'}`}
            style={{ color: activePage === 'products' && selectedCategory === '' ? 'hsl(var(--color-primary-gold))' : '' }}
          >
            Explore All Harvests
          </button>
          <button 
            onClick={() => handleNavClick('cart')}
            className={`text-left py-1 text-base transition-colors ${activePage === 'cart' ? 'text-gold' : 'text-text-secondary'}`}
            style={{ color: activePage === 'cart' ? 'hsl(var(--color-primary-gold))' : '' }}
          >
            Shopping Bag ({cartItemsCount})
          </button>
          {user && (
            <button 
              onClick={() => handleNavClick('profile')}
              className={`text-left py-1 text-base transition-colors ${activePage === 'profile' ? 'text-gold' : 'text-text-secondary'}`}
              style={{ color: activePage === 'profile' ? 'hsl(var(--color-primary-gold))' : '' }}
            >
              My Orders & Profile
            </button>
          )}
        </div>
      )}
    </header>
  );
}
