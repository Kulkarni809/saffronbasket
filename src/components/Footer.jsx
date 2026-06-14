import React, { useState } from 'react';
import { Leaf, Send, ShieldCheck, Truck, Award, Heart } from 'lucide-react';

export default function Footer({ setActivePage, setSelectedCategory }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-bg-panel border-t border-white/5 pt-16 pb-8 font-sans mt-8 md:mt-12" style={{ backgroundColor: 'hsl(var(--color-bg-panel))' }}>
      
      {/* Upper Footer: Grid of Content */}
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand narrative Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActivePage('home')}>
            <Leaf className="w-5 h-5 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
            <span className="font-serif text-lg font-bold">
              saffron<span className="text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>basket</span>
            </span>
          </div>
          <p className="text-sm text-text-muted">
            Importing the purest organic saffron, mountain shilajit, and sun-dried fruits directly from the valleys of Afghanistan. Sourced ethically, tested globally, and delivered to your doorstep.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-6">Explore</h4>
          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            <li>
              <button onClick={() => { setSelectedCategory(''); setActivePage('products'); }} className="hover:text-gold transition-colors text-left cursor-pointer">
                All Products
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory('saffron'); setActivePage('products'); }} className="hover:text-gold transition-colors text-left cursor-pointer">
                Afghan Saffron
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory('shilajit'); setActivePage('products'); }} className="hover:text-gold transition-colors text-left cursor-pointer">
                Pure Mountain Shilajit
              </button>
            </li>
            <li>
              <button onClick={() => { setSelectedCategory('dry-fruits'); setActivePage('products'); }} className="hover:text-gold transition-colors text-left cursor-pointer">
                Organic Dry Fruits
              </button>
            </li>
          </ul>
        </div>

        {/* Contact info Column */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-6">Heritage & Source</h4>
          <ul className="flex flex-col gap-3 text-sm text-text-secondary">
            <li>Saffron: Herat Province, AF</li>
            <li>Shilajit: Hindu Kush/Pamir Range, AF</li>
            <li>Dry Fruits: Kandahar & Khost, AF</li>
            <li className="mt-2 text-xs text-text-muted">Lab Analysis reports available upon request.</li>
          </ul>
        </div>

        {/* Newsletter Signup Column */}
        <div>
          <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-6">Stay Connected</h4>
          <p className="text-sm text-text-secondary mb-4">
            Join the Saffronbasket family to receive sourcing updates, organic recipes, and exclusive seasonal offers.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex">
            <input 
              type="email" 
              placeholder="Your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-l-md px-4 py-2.5 text-sm text-text-primary focus:outline-none focus:border-gold"
              style={{ borderRight: 'none' }}
            />
            <button 
              type="submit" 
              className="bg-gold px-4 py-2.5 rounded-r-md text-bg-dark hover:opacity-90 transition-all flex items-center justify-center"
              style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
              aria-label="Subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {subscribed && (
            <p className="text-xs text-gold mt-2 animate-fade-in-up" style={{ color: 'hsl(var(--color-primary-gold))' }}>
              Tashakor! Thank you for subscribing.
            </p>
          )}
        </div>

      </div>

      {/* Middle Footer: Trust Badges */}
      <div className="border-t border-b border-white/5 py-8 mb-8">
        <div className="container grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-6 h-6 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
            <div className="text-left">
              <h5 className="text-sm font-semibold">100% Lab Certified</h5>
              <p className="text-xs text-text-muted">Rigorous testing for purity</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Award className="w-6 h-6 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
            <div className="text-left">
              <h5 className="text-sm font-semibold">Direct Sourcing</h5>
              <p className="text-xs text-text-muted">Ethically bought from farmers</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Truck className="w-6 h-6 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
            <div className="text-left">
              <h5 className="text-sm font-semibold">Express Shipping</h5>
              <p className="text-xs text-text-muted">Securely packaged at source</p>
            </div>
          </div>

        </div>
      </div>

      {/* Lower Footer: Copyright */}
      <div className="container flex flex-col sm:flex-row items-center justify-between text-xs text-text-muted">
        <p>© {new Date().getFullYear()} Saffronbasket. All Rights Reserved.</p>
        <p className="flex items-center gap-1 mt-2 sm:mt-0">
          Made with <Heart className="w-3.5 h-3.5 text-primary-crimson fill-primary-crimson" style={{ color: 'hsl(var(--color-primary-crimson))' }} /> for pure organic heritage.
        </p>
      </div>

    </footer>
  );
}
