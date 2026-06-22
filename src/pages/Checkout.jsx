import React, { useState, useEffect } from 'react';
import { DirectusService } from '../services/DirectusService';
import { CreditCard, ShieldCheck, ArrowRight, Loader as Loader2, CircleCheck as CheckCircle2, ShoppingBag, Truck, Check } from 'lucide-react';

export default function Checkout({ cart, clearCart, setActivePage, user }) {
  // Form input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Card input states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Processing checkout states
  const [checkoutStatus, setCheckoutStatus] = useState('idle'); // idle | processing | success | error
  const [processingStep, setProcessingStep] = useState(0);
  const [createdOrderId, setCreatedOrderId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Settle form inputs based on user session on mount
  useEffect(() => {
    if (user) {
      setName(`${user.first_name || ''} ${user.last_name || ''}`.trim());
      setEmail(user.email || '');
    }
  }, [user]);

  // Read calculation data from sessionStorage
  const discountPercent = parseInt(sessionStorage.getItem('saffron_discount_percent') || '0');
  const shipping = parseFloat(sessionStorage.getItem('saffron_shipping_cost') || '0');
  const total = parseFloat(sessionStorage.getItem('saffron_cart_total') || '0');

  const subtotal = cart.reduce((tot, item) => tot + (item.price * item.quantity), 0);
  const discountAmount = subtotal * (discountPercent / 100);

  const processingTexts = [
    'Connecting to Secure Payment Gateway...',
    'Verifying Transaction Credentials...',
    'Securing Cargo Sourcing...',
    'Finalizing Saffronbasket Order...'
  ];

  // Simulated Payment processing
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setCheckoutStatus('processing');
    setProcessingStep(0);
    
    // Cycle processing message texts to simulate transaction phases
    const interval = setInterval(() => {
      setProcessingStep(prev => {
        if (prev < processingTexts.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          submitOrderToBackend();
          return prev;
        }
      });
    }, 1200);
  };

  const submitOrderToBackend = async () => {
    try {
      const checkoutData = {
        name,
        email,
        phone,
        address,
        totalPrice: total,
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          weight: item.weight
        }))
      };

      const orderResult = await DirectusService.createOrder(checkoutData);
      setCreatedOrderId(orderResult.id);
      setCheckoutStatus('success');
      clearCart();
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Payment authorized, but order creation failed. Please contact support.');
      setCheckoutStatus('error');
    }
  };

  if (checkoutStatus === 'processing') {
    return (
      <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 animate-fade-in-up font-sans text-center">
        <div className="p-12 glass-card max-w-md mx-auto border-white/5 flex flex-col items-center gap-6">
          <Loader2 className="w-12 h-12 text-gold animate-spin" style={{ color: 'hsl(var(--color-primary-gold))' }} />
          <div>
            <h2 className="text-xl font-serif font-bold text-text-primary mb-2">Processing Order</h2>
            <p className="text-sm text-gold font-medium animate-pulse" style={{ color: 'hsl(var(--color-primary-gold))' }}>
              {processingTexts[processingStep]}
            </p>
          </div>
          <p className="text-xs text-text-muted">
            Do not refresh the page or click back. Your transaction is securely encrypted.
          </p>
        </div>
      </div>
    );
  }

  if (checkoutStatus === 'success') {
    return (
      <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 animate-fade-in-up font-sans text-center">
        <div className="p-12 glass-card max-w-lg mx-auto border-glass-border gold-glow">
          <div className="w-16 h-16 rounded-full bg-accent-green/10 border border-accent-green/30 flex items-center justify-center text-accent-green mx-auto mb-6" style={{ color: 'hsl(var(--color-accent-green))' }}>
            <CheckCircle2 className="w-10 h-10" />
          </div>
          
          <span className="text-xs uppercase tracking-widest text-gold font-bold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
            Order Confirmed
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-gradient mt-2 mb-4">Tashakor! Thank You</h2>
          
          <p className="text-sm text-text-secondary mb-8">
            Your Saffronbasket purchase has been securely processed. Our sourcing center is packaging your organic batch. A tracking number will be emailed shortly.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-left text-sm text-text-secondary flex flex-col gap-3 mb-8">
            <div>
              <span className="text-text-muted text-xs block mb-0.5">Order ID</span>
              <code className="text-gold font-mono font-bold" style={{ color: 'hsl(var(--color-primary-gold))' }}>{createdOrderId}</code>
            </div>
            <hr className="border-white/5" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-text-muted text-xs block mb-0.5">Shipped To</span>
                <span className="font-semibold text-text-primary line-clamp-1">{name}</span>
              </div>
              <div>
                <span className="text-text-muted text-xs block mb-0.5">Estimated Arrival</span>
                <span className="font-semibold text-accent-green flex items-center gap-1" style={{ color: 'hsl(var(--color-accent-green))' }}>
                  <Truck className="w-4 h-4" /> 3-5 Business Days
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActivePage('products')}
            className="btn btn-gold h-12 px-8"
            style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
          >
            Continue Sourcing Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 animate-fade-in-up font-sans text-left">
      
      {/* Title */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-gradient mb-2">Secure Checkout</h1>
        <p className="text-text-secondary">Provide your shipping address and complete payment details.</p>
      </div>

      {checkoutStatus === 'error' && (
        <div className="p-4 rounded-lg bg-primary-crimson/10 border border-primary-crimson/20 text-primary-crimson text-sm mb-6 max-w-4xl" style={{ color: 'hsl(var(--color-primary-crimson))' }}>
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Side: Shipping & Payment Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Shipping Form */}
          <div className="glass-card p-6 border-white/5">
            <h3 className="font-serif text-lg font-bold text-text-primary mb-6 pb-2 border-b border-white/5">
              1. Shipping Address
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field w-full"
                  pattern="^\+?[0-9\s\-]{10,15}$"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Shipping Address</label>
              <textarea
                required
                placeholder="Flat/House No., Area, City, State, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="textarea-field w-full"
                rows="3"
              />
            </div>

          </div>

          {/* Payment Form */}
          <div className="glass-card p-6 border-white/5">
            <h3 className="font-serif text-lg font-bold text-text-primary mb-6 pb-2 border-b border-white/5 flex items-center justify-between">
              <span>2. Payment Information</span>
              <CreditCard className="w-5 h-5 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Card Number</label>
                <input
                  type="text"
                  required
                  placeholder="4111 2222 3333 4444"
                  maxLength="19"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div className="input-group">
                <label className="input-label">Name on Card</label>
                <input
                  type="text"
                  required
                  placeholder="Cardholder name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="input-field w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Expiration Date</label>
                <input
                  type="text"
                  required
                  placeholder="MM / YY"
                  maxLength="7"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div className="input-group">
                <label className="input-label">CVV / Security Code</label>
                <input
                  type="password"
                  required
                  placeholder="***"
                  maxLength="4"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="input-field w-full"
                />
              </div>
            </div>

            <p className="text-3xs text-text-muted flex items-center gap-1.5 mt-2">
              <ShieldCheck className="w-4 h-4 text-accent-green" style={{ color: 'hsl(var(--color-accent-green))' }} /> Secured SSL payment. Funds are held in escrow until dispatch verification.
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-gold h-12 w-full text-base shadow-lg"
            style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
          >
            Authorize Payment & Place Order (₹{total.toFixed(2)})
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

        </form>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 border-white/5" style={{ background: 'hsl(var(--color-bg-panel))' }}>
            <h3 className="font-serif text-lg font-bold text-text-primary mb-6 pb-2 border-b border-white/5">Order Details</h3>
            
            {/* List items preview */}
            <div className="flex flex-col gap-3 mb-6 max-h-[220px] overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={`${item.id}-${item.weight}`} className="flex items-center justify-between text-xs text-text-secondary py-1">
                  <div className="text-left max-w-[70%]">
                    <span className="font-semibold text-text-primary block line-clamp-1">{item.name}</span>
                    <span className="text-3xs text-text-muted">{item.weight} × {item.quantity}</span>
                  </div>
                  <span className="font-bold text-text-primary">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="flex flex-col gap-3 text-xs text-text-secondary border-t border-white/5 pt-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Surcharge</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline border-t border-white/5 pt-4">
              <span className="font-serif font-bold text-text-primary">Total Charge</span>
              <span className="text-xl font-bold text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>₹{total.toFixed(2)}</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
