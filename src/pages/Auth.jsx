import React, { useState } from 'react';
import { DirectusService } from '../services/DirectusService';
import { User, LogIn, Lock, Mail, Phone, Sparkles, Loader as Loader2, CircleAlert as AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center pt-20 pb-20 animate-fade-in-up font-sans">
      <div
        className="w-full max-w-md mx-4 sm:mx-auto glass-card border border-white/5 shadow-lg relative rounded-lg"
        style={{ padding: '32px', background: 'hsla(var(--color-bg-panel) / 0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
      >

        {/* Premium Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div
            className="w-14 h-14 rounded-full bg-gold/5 border border-gold/15 flex items-center justify-center text-gold mb-2 relative"
            style={{ color: 'hsl(var(--color-primary-gold))', borderColor: 'hsl(var(--color-primary-gold) / 0.15)' }}
          >
            <Sparkles className="w-7 h-7 relative z-10 animate-pulse text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold/80" style={{ color: 'hsl(var(--color-primary-gold) / 0.8)' }}>
            Secure Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary mt-1">Customer Account</h2>
          <p className="text-xs text-text-secondary/80 max-w-xs mt-1 leading-relaxed">
            Sign in to track orders, or create an account.
          </p>
        </div>

        {/* Toggle Headers */}
        <div className="flex border-b border-white/10 mb-8">
          <button
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 pb-3 text-center font-serif text-base font-semibold border-b-2 transition-all ${
              activeTab === 'login'
                ? 'text-gold border-gold'
                : 'border-transparent text-text-secondary/60 hover:text-text-secondary'
            }`}
            style={activeTab === 'login' ? { borderBottomColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-primary-gold))' } : {}}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 pb-3 text-center font-serif text-base font-semibold border-b-2 transition-all ${
              activeTab === 'signup'
                ? 'text-gold border-gold'
                : 'border-transparent text-text-secondary/60 hover:text-text-secondary'
            }`}
            style={activeTab === 'signup' ? { borderBottomColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-primary-gold))' } : {}}
          >
            Sign Up
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
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs tracking-wider text-text-secondary mb-2 uppercase">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input-field w-full pl-12"
                  disabled={loading}
                />
                <Mail className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider text-text-secondary mb-2 uppercase">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input-field w-full pl-12"
                  disabled={loading}
                />
                <Lock className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold w-full h-12"
              style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        ) : (
          // SIGNUP FORM
          <form onSubmit={handleSignup} className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs tracking-wider text-text-secondary mb-2 uppercase">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="input-field w-full pl-12"
                    disabled={loading}
                  />
                  <User className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-wider text-text-secondary mb-2 uppercase">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="input-field w-full pl-12"
                    disabled={loading}
                  />
                  <User className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider text-text-secondary mb-2 uppercase">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="input-field w-full pl-12"
                  disabled={loading}
                />
                <Mail className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider text-text-secondary mb-2 uppercase">Phone</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field w-full pl-12"
                  disabled={loading}
                />
                <Phone className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wider text-text-secondary mb-2 uppercase">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  minLength="6"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  className="input-field w-full pl-12"
                  disabled={loading}
                />
                <Lock className="w-4 h-4 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold w-full h-12 mt-2"
              style={{ backgroundColor: 'hsl(var(--color-primary-gold))', color: 'hsl(var(--color-bg-dark))' }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Create Account
                </>
              )}
            </button>
          </form>
        )}

        {/* Security pledge */}
        <p className="text-[10px] text-text-muted text-center mt-6 leading-relaxed">
          Your credentials are protected with secure authentication.
        </p>

      </div>
    </div>
  );
}
