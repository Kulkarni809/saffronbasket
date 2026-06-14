import React, { useState, useEffect } from 'react';
import { DirectusService } from '../services/DirectusService';
import { Search, Star, ShoppingCart, Loader2, ArrowUpDown, SlidersHorizontal } from 'lucide-react';

export default function Products({ setSelectedProductSlug, setActivePage, addToCart, selectedCategory, setSelectedCategory }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Interactive filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  // Fetch categories once on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await DirectusService.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever filters or search terms change
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        let sortParam = '';
        if (sortOption === 'price-asc') sortParam = 'price';
        if (sortOption === 'price-desc') sortParam = '-price';
        if (sortOption === 'rating-desc') sortParam = '-rating';
        
        const data = await DirectusService.getProducts({
          categorySlug: selectedCategory,
          search: activeSearch,
          sort: sortParam
        });
        
        setProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to fetch product list. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, activeSearch, sortOption]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
  };

  const getFallbackGradient = (slug) => {
    switch (slug) {
      case 'saffron':
        return 'linear-gradient(135deg, #4A0002 0%, #B30006 50%, #FF7A00 100%)';
      case 'shilajit':
        return 'linear-gradient(135deg, #0A0A0A 0%, #201C19 50%, #FFB800 100%)';
      case 'dry-fruits':
        return 'linear-gradient(135deg, #1C1814 0%, #5C4033 50%, #8A9A5B 100%)';
      default:
        return 'linear-gradient(135deg, #1C1814 0%, #2B1E17 100%)';
    }
  };

  const handleProductClick = (slug) => {
    setSelectedProductSlug(slug);
    setActivePage('product-detail');
  };

  return (
    <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 animate-fade-in-up font-sans text-left">
      
      {/* Title Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gradient mb-2">Our Premium Harvests</h1>
        <p className="text-text-secondary">Pure Afghan organic goods, directly sourced and tested for superior quality.</p>
      </div>

      {/* Filters and Search Bar Container */}
      <div className="flex flex-col lg:flex-row items-stretch gap-6 mb-10 pb-6 border-b border-white/5">
        
        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="relative flex-grow flex items-center">
          <input 
            type="text"
            placeholder="Search saffron, shilajit, dry fruits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-b border-white/15 pl-10 pr-12 py-3 text-sm text-text-primary focus:outline-none focus:border-gold transition-all"
          />
          <Search className="w-4 h-4 text-text-muted absolute left-2 top-1/2 -translate-y-1/2" />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gold hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            style={{ color: 'hsl(var(--color-primary-gold))' }}
          >
            Search
          </button>
        </form>

        {/* Sorters and Selectors Grid */}
        <div className="flex flex-wrap items-center gap-4">
          
          <div className="flex items-center gap-2 py-2 px-4 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-text-secondary">
            <SlidersHorizontal className="w-4 h-4" /> Filter & Sort
          </div>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-bg-panel border border-white/10 rounded-md px-4 py-2.5 text-sm text-text-secondary focus:outline-none focus:border-gold cursor-pointer"
            style={{ backgroundColor: 'hsl(var(--color-bg-panel))' }}
          >
            <option value="">Default Sorting</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Customer Rating</option>
          </select>
          
          {/* Reset Filters button */}
          {(selectedCategory || activeSearch || sortOption) && (
            <button
              onClick={() => {
                setSelectedCategory('');
                setSearchTerm('');
                setActiveSearch('');
                setSortOption('');
              }}
              className="text-xs font-semibold text-primary-crimson hover:underline"
              style={{ color: 'hsl(var(--color-primary-crimson))' }}
            >
              Clear All Filters
            </button>
          )}

        </div>

      </div>

      {/* Category Tabs Section */}
      <div className="flex items-center gap-6 mb-10 overflow-x-auto pb-2 border-b border-white/5 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('')}
          className={`tab-link ${selectedCategory === '' ? 'active' : ''}`}
        >
          All Collections
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`tab-link ${selectedCategory === cat.slug ? 'active' : ''}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Display Board */}
      {loading ? (
        // Beautiful Skeleton Loader Grid
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card overflow-hidden flex flex-col h-[400px] animate-pulse border-white/5 bg-bg-panel/40">
              <div className="h-48 w-full bg-white/5 border-b border-white/5"></div>
              <div className="p-6 flex flex-col flex-grow gap-4">
                <div className="w-1/3 h-4 bg-white/5 rounded"></div>
                <div className="w-2/3 h-6 bg-white/5 rounded"></div>
                <div className="w-full h-12 bg-white/5 rounded mt-2"></div>
                <div className="w-1/2 h-6 bg-white/5 rounded mt-auto"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-primary-crimson py-12 text-lg">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 glass-card p-12 border-white/5">
          <p className="text-lg text-text-secondary mb-2">No harvests found matching your criteria.</p>
          <p className="text-sm text-text-muted">Try clearing filters or adjusting your search term.</p>
          <button
            onClick={() => {
              setSelectedCategory('');
              setSearchTerm('');
              setActiveSearch('');
              setSortOption('');
            }}
            className="btn btn-gold mt-6"
            style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
          >
            Show All Products
          </button>
        </div>
      ) : (
        // Products Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => {
            const discount = product.compare_at_price 
              ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100) 
              : 0;

            const categorySlug = product.categories?.[0]?.categories_id?.slug || 'saffron';

            return (
              <div 
                key={product.id}
                className="glass-card relative overflow-hidden flex flex-col h-full group"
                style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}
              >
                
                {/* Badge Overlay */}
                {(product.badge || discount > 0) && (
                  <span className="absolute top-4 left-4 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 border border-white/10 rounded text-[9px] uppercase tracking-[0.1em] font-semibold text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                    {product.badge || `${discount}% OFF`}
                  </span>
                )}

                {/* Product Image */}
                <div 
                  onClick={() => handleProductClick(product.slug)}
                  className="h-60 w-full relative flex items-center justify-center cursor-pointer overflow-hidden border-b border-white/5 bg-bg-dark"
                >
                  {product.image ? (
                    <img 
                      src={DirectusService.getImageUrl(product.image)} 
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{ background: getFallbackGradient(categorySlug) }}
                    ></div>
                  )}
                </div>

                {/* Card details contents */}
                <div className="p-5 flex flex-col flex-grow text-left gap-1.5">
                  
                  {/* Origin & Rating block */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-gold font-medium" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                      {product.origin}
                    </span>
                    <span className="text-xs text-text-secondary flex items-center gap-0.5">
                      ★ {product.rating} <span className="text-text-muted text-[10px]">({product.reviews_count})</span>
                    </span>
                  </div>
                  
                  <h4 
                    onClick={() => handleProductClick(product.slug)}
                    className="text-base font-serif font-medium text-text-primary hover:text-gold cursor-pointer transition-colors line-clamp-1"
                  >
                    {product.name}
                  </h4>
                  
                  {/* Card bottom actions */}
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-text-muted uppercase tracking-wider mb-0.5 font-semibold">Weight: {product.weight}</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-bold text-text-primary">₹{product.price}</span>
                        {product.compare_at_price && (
                          <span className="text-xs text-text-muted line-through">₹{product.compare_at_price}</span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="p-2.5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 rounded-full text-text-secondary hover:text-gold transition-colors cursor-pointer"
                      aria-label="Add to Cart"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
