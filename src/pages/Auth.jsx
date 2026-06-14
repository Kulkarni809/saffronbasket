import React, { useState } from 'react';
import { DirectusService } from '../services/DirectusService';
import { User, LogIn, Lock, Mail, Phone, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function Auth({ onLoginSuccess, setActivePage }) {
  const [activeTab, setActiveTab] = useState('login'); // login | signup
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Processing indicators
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const user = await DirectusService.login(loginEmail, loginPassword);
      onLoginSuccess(user);
      setActivePage('profile');
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await DirectusService.signup(signupEmail, signupPassword, firstName, lastName, phone);
      setSuccessMessage('Registration successful! Please login with your credentials.');
      // Reset forms and toggle to login tab
      setFirstName('');
      setLastName('');
      setSignupEmail('');
      setSignupPassword('');
      setPhone('');
      setActiveTab('login');
      // Autofill email
      setLoginEmail(signupEmail);
    } catch (err) {
      console.error('Signup error:', err);
      setErrorMessage(err.message || 'Registration failed. Try a different email address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container pt-20 md:pt-28 lg:pt-32 pb-20 md:pb-28 lg:pb-32 flex items-center justify-center animate-fade-in-up font-sans text-left">
      <div 
        className="w-full max-w-lg glass-card p-10 md:p-12 border border-white/5 shadow-[0_0_50px_rgba(217,160,67,0.03)] relative rounded-[4px]" 
        style={{ background: 'hsla(var(--color-bg-panel) / 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >
        
        {/* Premium Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-10 text-center">
          <div 
            className="w-16 h-16 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold mb-3 relative group"
            style={{ color: 'hsl(var(--color-primary-gold))', borderColor: 'hsl(var(--color-primary-gold) / 0.15)' }}
          >
            <div className="absolute inset-0 rounded-full bg-gold/5 blur-md opacity-75"></div>
            <Sparkles className="w-8 h-8 relative z-10 animate-pulse text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-gold/80" style={{ color: 'hsl(var(--color-primary-gold) / 0.8)' }}>
            Secure Portal
          </span>
          <h2 className="text-3xl font-serif font-bold text-text-primary mt-2">Saffronbasket Area</h2>
          <p className="text-xs text-text-secondary/80 max-w-xs mt-2 leading-relaxed">
            Access your secure customer account, track sourcing status, and view organic orders.
          </p>
        </div>

        {/* Toggle Headers */}
        <div className="flex border-b border-white/10 mb-10">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-grow pb-4 text-center font-serif text-lg font-bold border-b-2 transition-all relative ${
              activeTab === 'login' 
                ? 'text-gold font-semibold font-bold border-b-2' 
                : 'border-transparent text-text-secondary/60 hover:text-text-secondary'
            }`}
            style={activeTab === 'login' ? { borderBottomColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-primary-gold))' } : {}}
          >
            Customer Login
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-grow pb-4 text-center font-serif text-lg font-bold border-b-2 transition-all relative ${
              activeTab === 'signup' 
                ? 'text-gold font-semibold font-bold border-b-2' 
                : 'border-transparent text-text-secondary/60 hover:text-text-secondary'
            }`}
            style={activeTab === 'signup' ? { borderBottomColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-primary-gold))' } : {}}
          >
            Create Account
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="p-4 rounded-[4px] bg-primary-crimson/5 border border-primary-crimson/20 text-primary-crimson text-sm mb-8 flex items-center gap-3" style={{ color: 'hsl(var(--color-primary-crimson))' }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="font-sans leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-[4px] bg-gold/5 border border-gold/20 text-gold text-sm mb-8 flex items-center gap-3" style={{ color: 'hsl(var(--color-primary-gold))' }}>
            <Sparkles className="w-5 h-5 flex-shrink-0 animate-pulse" />
            <span className="font-sans leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="input-group">
              <label className="input-label text-xs tracking-wider">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input-field w-full pl-12 h-12 rounded-[4px] bg-white/[0.01] border-white/10 hover:border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
                  disabled={loading}
                />
                <Mail className="w-[18px] h-[18px] text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="input-group">
              <div className="flex justify-between items-center">
                <label className="input-label text-xs tracking-wider">Password</label>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input-field w-full pl-12 h-12 rounded-[4px] bg-white/[0.01] border-white/10 hover:border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
                  disabled={loading}
                />
                <Lock className="w-[18px] h-[18px] text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-gold h-12 w-full mt-4 px-8 flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wider uppercase transition-all rounded-[4px]"
              style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <LogIn className="w-[18px] h-[18px]" />
              )}
              Sign In to Saffronbasket
            </button>
          </form>
        ) : (
          // SIGNUP FORM
          <form onSubmit={handleSignup} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="input-group mb-0">
                <label className="input-label text-xs tracking-wider">First Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field w-full pl-12 h-12 rounded-[4px] bg-white/[0.01] border-white/10 hover:border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
                    disabled={loading}
                  />
                  <User className="w-[18px] h-[18px] text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="input-group mb-0">
                <label className="input-label text-xs tracking-wider">Last Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field w-full pl-12 h-12 rounded-[4px] bg-white/[0.01] border-white/10 hover:border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
                    disabled={loading}
                  />
                  <User className="w-[18px] h-[18px] text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label text-xs tracking-wider">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  required
                  placeholder="john@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="input-field w-full pl-12 h-12 rounded-[4px] bg-white/[0.01] border-white/10 hover:border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
                  disabled={loading}
                />
                <Mail className="w-[18px] h-[18px] text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label text-xs tracking-wider">Phone Number</label>
              <div className="relative">
                <input 
                  type="tel" 
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field w-full pl-12 h-12 rounded-[4px] bg-white/[0.01] border-white/10 hover:border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
                  disabled={loading}
                />
                <Phone className="w-[18px] h-[18px] text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label text-xs tracking-wider">Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  required
                  placeholder="Minimum 6 characters"
                  minLength="6"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="input-field w-full pl-12 h-12 rounded-[4px] bg-white/[0.01] border-white/10 hover:border-gold/30 focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all font-sans text-sm"
                  disabled={loading}
                />
                <Lock className="w-[18px] h-[18px] text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-gold h-12 w-full mt-4 px-8 flex items-center justify-center gap-2.5 text-sm font-semibold tracking-wider uppercase transition-all rounded-[4px]"
              style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <User className="w-[18px] h-[18px]" />
              )}
              Register Customer Account
            </button>
          </form>
        )}

        {/* Security pledge */}
        <p className="text-[10px] text-text-muted text-center mt-8 leading-relaxed tracking-wide">
          Your credentials are safe. We protect customer data using system authentication.
        </p>

      </div>
    </div>
  );
}
