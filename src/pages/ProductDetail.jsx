import React, { useState, useEffect } from 'react';
import { DirectusService } from '../services/DirectusService';
import { Star, ShieldCheck, MapPin, Sparkles, ShoppingCart, ArrowLeft, Plus, Minus, Info, ClipboardList, Loader2 } from 'lucide-react';

export default function ProductDetail({ slug, setActivePage, addToCart }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Interactive detail states
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        const data = await DirectusService.getProductBySlug(slug);
        setProduct(data);
        // Set default weight from product
        setSelectedWeight(data.weight || '');
      } catch (err) {
        console.error('Error loading product details:', err);
        setError('Failed to load product details. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 flex flex-col items-center justify-center gap-4 animate-fade-in-up">
        <LoaderSpinner />
        <p className="text-text-secondary text-sm">Loading premium product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 text-center animate-fade-in-up">
        <div className="p-8 glass-card max-w-md mx-auto border-white/5">
          <p className="text-primary-crimson text-lg mb-4">{error || 'Product not found.'}</p>
          <button onClick={() => setActivePage('products')} className="btn btn-secondary flex items-center gap-1 mx-auto">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  // Weight & price multiplier logic
  const getWeightOptions = () => {
    const catSlug = product.categories?.[0]?.categories_id?.slug || 'saffron';
    if (catSlug.includes('saffron')) {
      return [
        { label: '1 Gram', value: '1g', multiplier: 1.0 },
        { label: '2 Grams', value: '2g', multiplier: 1.85 },
        { label: '5 Grams', value: '5g', multiplier: 4.25 }
      ];
    } else if (catSlug.includes('shilajit')) {
      return [
        { label: '20 Grams', value: '20g', multiplier: 1.0 },
        { label: '50 Grams', value: '50g', multiplier: 2.25 }
      ];
    } else { // Dry fruits & Nuts
      return [
        { label: '250g Standard', value: '250g', multiplier: 0.5 },
        { label: '500g Value Pack', value: '500g', multiplier: 1.0 },
        { label: '1kg Bulk Saver', value: '1kg', multiplier: 1.85 }
      ];
    }
  };

  const weightOptions = getWeightOptions();
  const currentOption = weightOptions.find(o => o.value === selectedWeight) || weightOptions[1] || { multiplier: 1.0 };
  
  // Calculate pricing based on selected weight size
  const calculatedPrice = (product.price * currentOption.multiplier).toFixed(2);
  const calculatedComparePrice = product.compare_at_price 
    ? (product.compare_at_price * currentOption.multiplier).toFixed(2) 
    : null;

  const handleWeightChange = (weightVal) => {
    setSelectedWeight(weightVal);
  };

  const handleAddToCart = () => {
    // Add product to cart with dynamic weight and price updates
    const cartProduct = {
      ...product,
      weight: selectedWeight,
      price: parseFloat(calculatedPrice),
      compare_at_price: calculatedComparePrice ? parseFloat(calculatedComparePrice) : null
    };
    addToCart(cartProduct, quantity);
  };

  const getFallbackGradient = () => {
    const catSlug = product.categories?.[0]?.categories_id?.slug || 'saffron';
    switch (catSlug) {
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

  return (
    <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 animate-fade-in-up font-sans text-left">
      
      {/* Back Button */}
      <button 
        onClick={() => setActivePage('products')}
        className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-gold transition-colors mb-10"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products Catalog
      </button>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        {/* Left Side: Images Gallery Carousel */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div 
            className="w-full h-80 sm:h-[450px] rounded-3xl overflow-hidden border border-glass-border shadow-lg relative flex items-center justify-center bg-bg-dark"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            {product.gallery && product.gallery.length > 0 && product.gallery[activeImageIdx] ? (
              <img 
                src={DirectusService.getImageUrl(product.gallery[activeImageIdx])} 
                alt={`${product.name} - View ${activeImageIdx + 1}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            ) : (
              <>
                <div 
                  className="absolute inset-0"
                  style={{ background: getFallbackGradient() }}
                ></div>
                {/* Main Visual Display placeholder */}
                <div className="text-center p-8 text-white relative z-10 animate-fade-in-up">
                  <span className="text-xs uppercase tracking-widest font-semibold text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                    Organic Afghanistan
                  </span>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-wide mt-2">{product.name}</h2>
                  <p className="text-sm font-medium uppercase mt-3 tracking-widest opacity-90">{product.origin}</p>
                </div>
              </>
            )}
            
            {/* Top Right Origin Indicator */}
            <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-black/40 border border-white/10 text-xs font-semibold text-white backdrop-blur-md z-20">
              <MapPin className="w-3.5 h-3.5 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} /> {product.origin}
            </span>
          </div>

          {/* Gallery Selector Indicators */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3">
              {product.gallery.map((imgId, idx) => (
                <button
                  key={imgId || idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border transition-all relative ${
                    activeImageIdx === idx 
                      ? 'border-gold scale-105' 
                      : 'border-white/10 opacity-70 hover:opacity-100'
                  }`}
                  style={{ borderColor: activeImageIdx === idx ? 'hsl(var(--color-primary-gold))' : '' }}
                >
                  <img 
                    src={DirectusService.getImageUrl(imgId)} 
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute inset-0 bg-black/20 hover:bg-black/0 transition-colors ${activeImageIdx === idx ? 'bg-black/0' : ''}`}></div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Cart Actions */}
        <div className="lg:col-span-6 flex flex-col gap-6 text-left">
          
          <div className="flex items-center gap-3">
            {product.badge && (
              <span className="py-1 px-3.5 rounded-full bg-primary-crimson text-white text-xs font-bold uppercase tracking-wider" style={{ backgroundColor: 'hsl(var(--color-primary-crimson))' }}>
                {product.badge}
              </span>
            )}
            <span className="inline-flex items-center gap-1 py-1 px-3.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Saffronbasket Premium
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-gradient leading-tight">{product.name}</h1>

          {/* Rating block */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4.5 h-4.5 stroke-none ${i < Math.floor(product.rating) ? 'fill-primary-gold' : 'fill-white/10'}`} 
                  style={{ fill: i < Math.floor(product.rating) ? 'hsl(var(--color-primary-gold))' : '' }}
                />
              ))}
            </div>
            <span className="text-sm font-semibold text-text-primary">{product.rating}</span>
            <span className="text-xs text-text-muted">({product.reviews_count} reviews)</span>
          </div>

          {/* Dynamic Pricing displays */}
          <div className="flex items-baseline gap-3 py-4 border-t border-b border-white/5">
            <span className="text-3xl font-bold text-text-primary">₹{calculatedPrice}</span>
            {calculatedComparePrice && (
              <span className="text-lg text-text-muted line-through">₹{calculatedComparePrice}</span>
            )}
            <span className="text-xs text-text-muted ml-2">({selectedWeight} Sizing)</span>
          </div>

          {/* 1. Interactive Size/Weight Selector */}
          <div>
            <h4 className="text-[10px] font-semibold text-text-secondary uppercase tracking-[0.15em] mb-2.5">Select Sizing</h4>
            <div className="flex flex-wrap gap-2">
              {weightOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleWeightChange(opt.value)}
                  className={`py-2 px-4 rounded border text-xs font-medium transition-all cursor-pointer ${
                    selectedWeight === opt.value
                      ? 'border-gold bg-gold/5 text-gold font-medium'
                      : 'border-white/10 text-text-secondary hover:border-white/20'
                  }`}
                  style={selectedWeight === opt.value ? { borderColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-primary-gold))' } : {}}
                >
                  {opt.label} (₹{(product.price * opt.multiplier).toFixed(0)})
                </button>
              ))}
            </div>
          </div>

          {/* Product quick highlights checklist */}
          {product.highlights && product.highlights.length > 0 && (
            <div className="py-2">
              <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Product Highlights</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-text-secondary">
                {product.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-gold" style={{ backgroundColor: 'hsl(var(--color-primary-gold))' }}></span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Cart Quantity and Add-to-cart controls */}
          <div className="flex items-center gap-4 pt-4 mt-2">
            
            {/* Quantity select */}
            <div className="flex items-center rounded-xl bg-white/5 border border-white/10 px-2 py-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-semibold text-sm">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add button */}
            <button 
              onClick={handleAddToCart}
              className="btn btn-gold flex-grow py-4 px-8"
              style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
            >
              <ShoppingCart className="w-4.5 h-4.5" />
              Add to Shopping Bag
            </button>

          </div>

          {/* Shipping Trust Label */}
          <p className="text-xs text-text-muted flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-accent-green" style={{ color: 'hsl(var(--color-accent-green))' }} /> Lab analysis certification included in shipment packaging.
          </p>

        </div>

      </div>

      {/* Sleek Tabs Navigation */}
      <div className="flex items-center gap-8 border-b border-white/5 mb-10 mt-16 pb-1">
        <button 
          onClick={() => setActiveTab('description')}
          className={`tab-link py-3 text-xs md:text-sm font-semibold tracking-wider uppercase transition-all ${activeTab === 'description' ? 'active' : ''}`}
        >
          The Story
        </button>
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <button 
            onClick={() => setActiveTab('specifications')}
            className={`tab-link py-3 text-xs md:text-sm font-semibold tracking-wider uppercase transition-all ${activeTab === 'specifications' ? 'active' : ''}`}
          >
            Lab Certified Analysis
          </button>
        )}
        <button 
          onClick={() => setActiveTab('sourcing')}
          className={`tab-link py-3 text-xs md:text-sm font-semibold tracking-wider uppercase transition-all ${activeTab === 'sourcing' ? 'active' : ''}`}
        >
          Ethical Sourcing
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[250px] border-b border-white/5 pb-16">
        {activeTab === 'description' && (
          <section className="animate-fade-in-up text-left">
            <div 
              className="prose prose-invert max-w-none text-sm md:text-base text-text-secondary leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description || '' }}
            />
          </section>
        )}

        {activeTab === 'specifications' && product.specifications && Object.keys(product.specifications).length > 0 && (
          <section className="animate-fade-in-up text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="rounded-lg overflow-hidden border border-white/10 bg-bg-panel/40 p-1">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10 text-text-primary">
                      <th className="p-3 font-serif font-medium">Tested Parameter</th>
                      <th className="p-3 font-serif font-medium">Certified Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-3 font-medium capitalize text-text-primary">
                          {key.replace(/_/g, ' ')}
                        </td>
                        <td className="p-3 text-gold font-semibold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex flex-col gap-4 p-5 rounded-lg bg-white/3 border border-white/5 text-xs md:text-sm">
                <h4 className="font-serif font-semibold text-text-primary flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} /> Quality Assurance Note
                </h4>
                <p className="text-text-secondary leading-relaxed">
                  Every organic batch undergoes strict laboratory verification prior to custom export. Coloring strength levels for saffron (Crocin) and active adaptogen parameters for shilajit (Fulvic Acid) are verified in state-of-the-art facilities.
                </p>
                <p className="text-2xs text-text-muted flex items-center gap-1.5 mt-1">
                  <Info className="w-3.5 h-3.5" /> Full chemical analysis certificate copies are packed with orders.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'sourcing' && (
          <section className="animate-fade-in-up text-left">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 flex flex-col gap-4 text-sm md:text-base">
                <h3 className="text-lg font-serif font-medium text-text-primary">Originating Province: {product.origin}</h3>
                <p className="text-text-secondary leading-relaxed">
                  This product is cultivated and harvested using age-old organic traditions passed down through generations in rural Afghanistan. 
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Saffronbasket maintains a direct trade pipeline. We pay our harvesting groups above market wages, empowering rural farming communities (particularly in Herat, where saffron picking provides key female employment).
                </p>
                <p className="text-text-secondary leading-relaxed">
                  Our products are harvested under pristine conditions, naturally processed (sun-dried/cold-water filtered), and securely packed in ultraviolet glass containers to maintain structural bioactivity.
                </p>
              </div>
              
              <div className="lg:col-span-5 p-5 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-4 text-xs md:text-sm">
                <h4 className="font-serif font-bold text-gold flex items-center gap-1.5" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                  <MapPin className="w-4 h-4" /> Traceability Journey
                </h4>
                <div className="flex flex-col gap-3 relative pl-6 border-l border-white/10">
                  <div className="relative">
                    <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-gold animate-pulse" style={{ backgroundColor: 'hsl(var(--color-primary-gold))' }}></span>
                    <strong className="text-text-primary block text-2xs uppercase tracking-wider">1. HARVESTING</strong>
                    <span className="text-text-muted text-xs">Hand-picked in rural valleys ({product.origin})</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-gold" style={{ backgroundColor: 'hsl(var(--color-primary-gold))' }}></span>
                    <strong className="text-text-primary block text-2xs uppercase tracking-wider">2. TRADITIONAL PROCESSING</strong>
                    <span className="text-text-muted text-xs">Cleaned with spring water & naturally sun-dried</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-gold" style={{ backgroundColor: 'hsl(var(--color-primary-gold))' }}></span>
                    <strong className="text-text-primary block text-2xs uppercase tracking-wider">3. LAB CERTIFICATION</strong>
                    <span className="text-text-muted text-xs">Tested for color strength, heavy metals & safety</span>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[30px] top-1.5 w-2 h-2 rounded-full bg-gold" style={{ backgroundColor: 'hsl(var(--color-primary-gold))' }}></span>
                    <strong className="text-text-primary block text-2xs uppercase tracking-wider">4. SECURE PACKAGING</strong>
                    <span className="text-text-muted text-xs">Vacuum-sealed in ultraviolet glass to lock in potency</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

    </div>
  );
}

function LoaderSpinner() {
  return (
    <Loader2 className="w-8 h-8 text-gold animate-spin" style={{ color: 'hsl(var(--color-primary-gold))' }} />
  );
}
