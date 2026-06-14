import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowLeft, ArrowRight, Tag, Percent, Sparkles, CircleAlert as AlertCircle } from 'lucide-react';
import { DirectusService } from '../services/DirectusService';

export default function Cart({ cart, updateCartQuantity, removeFromCart, setActivePage }) {
  const [coupon, setCoupon] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Calculate pricing subtotals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Coupon validation
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    const code = coupon.toUpperCase().trim();
    if (code === 'SAFFRON10') {
      setDiscountPercent(10);
      setCouponSuccess('Promo code "SAFFRON10" applied! 10% discount subtracted.');
      setCoupon('');
    } else if (code === 'AFGHAN20') {
      setDiscountPercent(20);
      setCouponSuccess('Promo code "AFGHAN20" applied! 20% discount subtracted.');
      setCoupon('');
    } else {
      setCouponError('Invalid promo code. Try "SAFFRON10" or "AFGHAN20".');
    }
  };

  const discountAmount = subtotal * (discountPercent / 100);
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 50.00;
  const total = subtotal - discountAmount + shipping;

  const handleCheckoutClick = () => {
    // Save discount parameters globally in sessionStorage for checkout
    sessionStorage.setItem('saffron_discount_percent', discountPercent.toString());
    sessionStorage.setItem('saffron_shipping_cost', shipping.toString());
    sessionStorage.setItem('saffron_cart_total', total.toFixed(2));
    setActivePage('checkout');
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

  if (cart.length === 0) {
    return (
      <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 animate-fade-in-up font-sans text-center">
        <div className="p-12 glass-card max-w-lg mx-auto border-white/5 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-2">Your Bag is Empty</h2>
            <p className="text-sm text-text-secondary max-w-sm mx-auto">
              Explore the rich organic saffron, golden mountain shilajit, and wild sun-dried nuts of Afghanistan to start shopping.
            </p>
          </div>
          <button 
            onClick={() => setActivePage('products')}
            className="btn btn-gold px-8 py-3.5"
            style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
          >
            Go to Products Catalog
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 animate-fade-in-up font-sans text-left">
      
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gradient mb-2">Your Shopping Bag</h1>
        <p className="text-text-secondary">Verify quantities and apply organic coupon codes before checkout.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {cart.map((item, idx) => {
            const itemCategory = item.categories?.[0]?.categories_id?.slug || 'saffron';
            const itemTotal = (item.price * item.quantity).toFixed(2);

            return (
              <div
                key={`${item.id}-${item.weight}`}
                className="glass-card p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 sm:gap-6 border-white/5 hover:transform-none"
              >

                {/* Product details block */}
                <div className="flex items-center gap-3 sm:gap-4 flex-grow min-w-0">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/5 relative bg-bg-dark"
                  >
                    {item.image ? (
                      <img
                        src={DirectusService.getImageUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="absolute inset-0 w-full h-full"
                        style={{ background: getFallbackGradient(itemCategory) }}
                      ></div>
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest text-gold border border-white/10" style={{ color: 'hsl(var(--color-primary-gold))' }}>{item.weight}</span>
                  </div>

                  <div className="text-left min-w-0 flex-grow">
                    <span className="text-[10px] sm:text-xs text-gold font-semibold uppercase tracking-wider" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                      {item.origin}
                    </span>
                    <h3 className="font-serif font-bold text-text-primary text-sm sm:text-base md:text-lg mb-0.5 sm:mb-1 leading-snug truncate">
                      {item.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-text-muted">
                      Weight: <span className="font-semibold text-text-secondary">{item.weight}</span>
                    </p>
                  </div>
                </div>

                {/* Quantity adjuster and price blocks */}
                <div className="flex items-center justify-end gap-4 sm:gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-white/5">

                  {/* Quantity selector */}
                  <div className="flex items-center rounded-lg bg-white/5 border border-white/10 p-0.5 sm:p-1">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.weight, item.quantity - 1)}
                      className="p-1.5 sm:p-2 text-text-secondary hover:text-text-primary transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      <span className="text-sm font-bold">-</span>
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.weight, item.quantity + 1)}
                      className="p-1.5 sm:p-2 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <span className="text-sm font-bold">+</span>
                    </button>
                  </div>

                  {/* Pricing Display */}
                  <div className="text-right min-w-[70px] sm:min-w-[80px] flex-shrink-0">
                    <span className="block text-sm font-bold text-text-primary">₹{itemTotal}</span>
                    <span className="block text-[10px] sm:text-3xs text-text-muted mt-0.5">₹{item.price} each</span>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.id, item.weight)}
                    className="p-2 text-text-muted hover:text-primary-crimson transition-colors flex-shrink-0"
                    aria-label="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}

          {/* Sourcing CTA */}
          <button 
            onClick={() => setActivePage('products')}
            className="flex items-center gap-1 text-sm font-semibold text-text-secondary hover:text-gold transition-colors mt-4"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Sourcing Organic Products
          </button>
          
        </div>

        {/* Right Side: Checkout Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Checkout Totals Card */}
          <div className="glass-card p-6 border-white/5" style={{ background: 'hsl(var(--color-bg-panel))' }}>
            <h3 className="font-serif text-xl font-bold text-text-primary mb-6 pb-4 border-b border-white/5">Order Summary</h3>
            
            <div className="flex flex-col gap-4 text-sm text-text-secondary mb-6">
              
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-text-primary font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                  <span className="flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> Promo Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>

              {shipping > 0 && (
                <p className="text-[10px] text-text-muted text-left">
                  *Add ₹{(500 - subtotal).toFixed(2)} more to unlock **FREE shipping**!
                </p>
              )}

            </div>

            {/* Total Price */}
            <div className="flex justify-between items-baseline border-t border-white/5 pt-4 mb-8">
              <span className="font-serif font-bold text-text-primary">Net Total</span>
              <span className="text-2xl font-bold text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>₹{total.toFixed(2)}</span>
            </div>

            {/* CTA checkout button */}
            <button 
              onClick={handleCheckoutClick}
              className="btn btn-gold w-full py-4 px-8 animate-pulse-gold"
              style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

            {/* Secure indicator */}
            <p className="text-3xs text-text-muted text-center mt-3">
              SSL Encrypted Transactions. Safe & Secure Afghan Imports.
            </p>
          </div>

          {/* Coupon Code Panel */}
          <div className="glass-card p-6 border-white/5">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center gap-1">
              <Tag className="w-4 h-4 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} /> Apply Promo Code
            </h4>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input 
                type="text" 
                placeholder="SAFFRON10 or AFGHAN20"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-gold"
              />
              <button
                type="submit"
                className="btn btn-secondary px-4 py-2 text-xs whitespace-nowrap flex-shrink-0"
              >
                Apply
              </button>
            </form>
            
            {couponError && (
              <p className="text-3xs text-primary-crimson flex items-center gap-1 mt-2 text-left" style={{ color: 'hsl(var(--color-primary-crimson))' }}>
                <AlertCircle className="w-3 h-3" /> {couponError}
              </p>
            )}

            {couponSuccess && (
              <p className="text-3xs text-gold flex items-center gap-1 mt-2 text-left" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                <Sparkles className="w-3.5 h-3.5" /> {couponSuccess}
              </p>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
