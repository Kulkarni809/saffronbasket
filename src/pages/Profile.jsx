import React, { useState, useEffect } from 'react';
import { DirectusService } from '../services/DirectusService';
import { Calendar, ShoppingBag, Package, ChevronDown, ChevronUp, Loader2, User, Mail, MapPin } from 'lucide-react';

export default function Profile({ user, setActivePage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const userOrders = await DirectusService.getUserOrders();
        setOrders(userOrders);
      } catch (err) {
        console.error('Error loading user orders:', err);
        setError('Failed to load your order history. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderId(prev => (prev === orderId ? null : orderId));
  };

  // Color-coded order status badges
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-white/5 border-white/10 text-text-secondary';
      case 'processing':
        return 'bg-primary-gold/10 border-primary-gold/20 text-gold';
      case 'shipped':
        return 'bg-accent-green/10 border-accent-green/20 text-accent-green';
      case 'completed':
        return 'bg-accent-green/10 border-accent-green/20 text-accent-green';
      case 'cancelled':
        return 'bg-primary-crimson/10 border-primary-crimson/20 text-primary-crimson';
      default:
        return 'bg-white/5 border-white/10 text-text-secondary';
    }
  };

  return (
    <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 animate-fade-in-up font-sans text-left">
      
      {/* Welcome Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-gradient mb-2">
            Salam, {user?.first_name || 'Customer'}!
          </h1>
          <p className="text-text-secondary">Welcome to your dashboard. Track your organic harvests and orders below.</p>
        </div>
        
        {/* User Card Details */}
        <div className="flex items-center gap-3 py-3 px-5 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
            <User className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-text-primary block">{user?.first_name} {user?.last_name}</span>
            <span className="text-text-muted flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {user?.email}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Orders List Grid Column */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h3 className="font-serif text-2xl font-bold text-text-primary mb-2 flex items-center gap-2">
            <Package className="w-6 h-6 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} /> Sourced Order History
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-gold animate-spin" style={{ color: 'hsl(var(--color-primary-gold))' }} />
              <p className="text-sm text-text-muted">Querying order history...</p>
            </div>
          ) : error ? (
            <div className="text-center text-primary-crimson py-6">{error}</div>
          ) : orders.length === 0 ? (
            <div className="p-12 glass-card border-white/5 text-center flex flex-col items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-muted">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-serif font-bold text-text-primary mb-1">No Orders Found</h4>
                <p className="text-sm text-text-secondary max-w-sm mx-auto">
                  You haven't placed any orders yet. Start exploring our organic products to place your first order!
                </p>
              </div>
              <button
                onClick={() => setActivePage('products')}
                className="btn btn-gold py-2.5 px-6"
                style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
              >
                Explore Saffron & Dry Fruits
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {orders.map((order) => {
                const isExpanded = expandedOrderId === order.id;
                const orderDate = new Date(order.date_created).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });

                return (
                  <div 
                    key={order.id}
                    className="glass-card overflow-hidden border-white/5 hover:transform-none"
                  >
                    
                    {/* Order Header Summary Row */}
                    <div 
                      onClick={() => toggleOrderExpand(order.id)}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/3 transition-colors text-left"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-3xs font-mono font-bold text-text-muted uppercase tracking-wider">Order Reference</span>
                        <code className="text-xs text-gold font-bold font-mono" style={{ color: 'hsl(var(--color-primary-gold))' }}>{order.id}</code>
                        <span className="text-xs text-text-secondary flex items-center gap-1 mt-0.5"><Calendar className="w-3.5 h-3.5" /> {orderDate}</span>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-left sm:text-right">
                          <span className="text-3xs font-bold text-text-muted uppercase tracking-wider block">Total Paid</span>
                          <span className="text-base font-bold text-text-primary">₹{parseFloat(order.total_price).toFixed(2)}</span>
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full border text-2xs font-bold uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>

                        {isExpanded ? <ChevronUp className="w-5 h-5 text-text-muted" /> : <ChevronDown className="w-5 h-5 text-text-muted" />}
                      </div>

                    </div>

                    {/* Order Details Body Accordion */}
                    {isExpanded && (
                      <div className="p-5 bg-white/3 border-t border-white/5 animate-fade-in-up text-left">
                        <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Items Sourced</h4>
                        <div className="flex flex-col gap-2.5">
                          {order.items?.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-xs text-text-secondary">
                              <div className="flex flex-col">
                                <span className="font-semibold text-text-primary">{item.name}</span>
                                <span className="text-3xs text-text-muted">Weight: {item.weight}</span>
                              </div>
                              <span>{item.quantity} × ₹{parseFloat(item.price).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Side: Quick Sourcing tips & Support info */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card p-6 border-white/5" style={{ background: 'hsl(var(--color-bg-panel))' }}>
            <h3 className="font-serif text-lg font-bold text-text-primary mb-4 pb-2 border-b border-white/5">Customer Support</h3>
            <p className="text-sm text-text-secondary mb-4">
              Need to modify a pending order or inquire about shipping logistics? Saffronbasket is here to help.
            </p>
            <ul className="flex flex-col gap-2.5 text-xs text-text-secondary">
              <li>Email: <span className="text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>support@saffronbasket.com</span></li>
              <li>Phone: +91 1800-120-5566 (Toll Free)</li>
              <li>Hours: Mon - Sat, 9AM - 6PM IST</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
