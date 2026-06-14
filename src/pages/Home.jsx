import React, { useState, useEffect } from 'react';
import { DirectusService } from '../services/DirectusService';
import { ArrowRight, Star, ShieldCheck, Sparkles, MapPin, Activity, ShoppingCart, Loader as Loader2, ChevronLeft, ChevronRight, Globe } from 'lucide-react';

export default function Home({ setActivePage, setSelectedProductSlug, addToCart, setSelectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Spotlight active ingredient state
  const [activeIngredient, setActiveIngredient] = useState('saffron');

  // Testimonials active slide state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, products] = await Promise.all([
          DirectusService.getCategories(),
          DirectusService.getProducts({ featured: true })
        ]);
        setCategories(cats);
        setFeaturedProducts(products);
      } catch (err) {
        console.error('Error loading home data:', err);
        setError('Failed to load home page content. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

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

  // Ingredient detail data for the interactive spotlight
  const ingredientDetails = {
    saffron: {
      title: "Afghan Super Negin Saffron",
      region: "Herat Province",
      altitude: "920m Elevation",
      attributes: [
        { label: "Purity Grade", value: "Grade A+ (Lab Certified)" },
        { label: "Crocin Strength", value: "272+ (Deep Crimson)" },
        { label: "Harvest Season", value: "Autumn Hand-Pick" },
        { label: "Chemicals", value: "0% Additives" }
      ],
      description: "Cultivated in the rich volcanic soils of Herat, our saffron stems are hand-harvested by local farming cooperatives during the brief autumn flowering window. Every batch is lab tested to confirm crocin (color) and safranal (aroma) parameters exceed international ISO-3632 standard requirements.",
      coordinates: "34.34 N, 62.20 E",
      purityRate: "99.8%"
    },
    shilajit: {
      title: "High-Altitude Wakhan Shilajit",
      region: "Pamir Mountains (Wakhan Corridor)",
      altitude: "3,200m Elevation",
      attributes: [
        { label: "Fulvic Acid", value: "68.4% (Super Pure)" },
        { label: "Trace Minerals", value: "85+ Ionic Minerals" },
        { label: "Purification", value: "Glacial Spring Water" },
        { label: "Form Factor", value: "Raw Gold Resin" }
      ],
      description: "Gathered from pristine sandstone crevices in the Wakhan mountain range at extreme altitudes, our Shilajit is slowly purified using traditional methods at low temperatures. This natural process preserves the rich fulvic and humic acid molecules along with minerals.",
      coordinates: "36.95 N, 72.82 E",
      purityRate: "100%"
    },
    'dry-fruits': {
      title: "Sun-Dried Figs & Jumbo Pine Nuts",
      region: "Kandahar & Hindu Kush Valleys",
      altitude: "1,150m Elevation",
      attributes: [
        { label: "Chilgoza Size", value: "Jumbo King Grade" },
        { label: "Processing", value: "Sun-dried, Unbleached" },
        { label: "Figs Quality", value: "A+ Soft Honey Fig" },
        { label: "Sourcing", value: "Direct-Farm Trade" }
      ],
      description: "Our wild-harvested Chilgoza pine nuts and Kandahar figs represent generations of organic agricultural heritage. Ripened under the dry Afghan sun, they are hand-sorted and packed with zero sulfur dioxide, sugars, or artificial oil glazes.",
      coordinates: "31.62 N, 65.71 E",
      purityRate: "100% Organic"
    }
  };

  const currentSpotlight = ingredientDetails[activeIngredient] || ingredientDetails.saffron;

  const testimonials = [
    {
      quote: "I have used saffron from various sources for my restaurant, but the coloring strength and aroma of Saffronbasket's Super Negin is unmatched. The rich crimson stigmas give our rice dishes a signature golden hue and true floral notes. Absolutely superb quality.",
      author: "Chef Adrian Vance",
      role: "Michelin-Starred Culinary Artist",
      stars: 5
    },
    {
      quote: "Finding genuine shilajit resin in a market saturated with diluted products was a challenge. I tried Saffronbasket's Wakhan Shilajit and felt an immediate natural energy boost. The ultraviolet jar packaging is highly professional, and the lab reports provide immense peace of mind.",
      author: "Elena Rostova",
      role: "Wellness & Holistic Health Coach",
      stars: 5
    },
    {
      quote: "The wild harvested Chilgoza pine nuts are exceptionally buttery and huge in size compared to standard ones. Also, the Kandahar sun-dried figs are a staple in my breakfast bowl. Saffronbasket truly delivers on the premium organic promise of Afghan valleys.",
      author: "Marcus K.",
      role: "Long-Time Organic Customer",
      stars: 5
    }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="animate-fade-in-up font-sans flex flex-col relative overflow-hidden bg-bg-dark">

      {/* Ambient Radial Glow Elements for Obsidian Luxury Feel */}
      <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] luxury-glow-gold rounded-full opacity-25 pointer-events-none z-0"></div>
      <div className="absolute top-[35%] left-[-150px] w-[500px] h-[500px] luxury-glow-crimson rounded-full opacity-15 pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-150px] w-[500px] h-[500px] luxury-glow-gold rounded-full opacity-15 pointer-events-none z-0"></div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-24 pb-12 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden z-10 mt-[15px]">
        <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/5 border border-white/10 w-fit text-xs font-semibold uppercase tracking-widest text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Direct imports from Afghanistan
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light font-serif leading-[1.1] text-text-primary tracking-tight">
              Organic <span className="text-gold-shimmer italic font-normal">Saffron</span>,<br />
              Mountain <span className="text-gold-shimmer italic font-normal">Shilajit</span> &<br />
              Sun-Dried Fruits
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed font-light">
              Ethically harvested from Afghanistan's rich soil, certified for purity, and hand-selected for the ultimate wellness and culinary experience.
            </p>

            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={() => setActivePage('products')}
                className="btn-luxury px-8 py-4 text-xs font-semibold tracking-wider hover:scale-[1.02] transition-transform cursor-pointer"
              >
                Explore Saffron & Dry Fruits
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
              <a
                href="#manifesto"
                className="btn btn-secondary px-8 py-4 font-semibold text-xs tracking-wider border-white/10 hover:border-gold/30 hover:bg-white/5"
              >
                Our Sourcing Story
              </a>
            </div>
          </div>

          {/* Visual Showcase Graphic - Luxury Editorial Card Stack */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative group w-[310px] h-[390px] sm:w-[350px] sm:h-[440px]">

              {/* Back Accent Glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-crimson to-primary-gold rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

              {/* Main Card */}
              <div className="relative w-full h-full glass-card-premium p-6 flex flex-col justify-between overflow-hidden">
                {/* Background Card Shimmer */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>

                {/* Top Image Frame */}
                <div className="w-full h-[70%] rounded-lg overflow-hidden relative border border-white/5 bg-bg-dark">
                  {featuredProducts.length > 0 && featuredProducts[0].image ? (
                    <img
                      src={DirectusService.getImageUrl(featuredProducts[0].image)}
                      alt={featuredProducts[0].name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-bg-card to-bg-panel flex items-center justify-center">
                      <span className="text-xs text-text-muted">Premium Import</span>
                    </div>
                  )}

                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-black/75 border border-white/10 text-[9px] uppercase tracking-[0.15em] font-bold text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                    <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Lab Certified
                  </div>
                </div>

                {/* Bottom Details Frame */}
                <div className="flex items-end justify-between pt-4">
                  <div className="flex flex-col gap-1 text-left">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-gold font-bold" style={{ color: 'hsl(var(--color-primary-gold))' }}>Featured Crop</span>
                    <h4 className="text-lg font-serif font-medium text-text-primary line-clamp-1">
                      {featuredProducts.length > 0 ? featuredProducts[0].name : "Afghan Super Negin Saffron"}
                    </h4>
                    <p className="text-xs text-text-muted font-light">
                      Direct Import - Herat Province
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (featuredProducts.length > 0) {
                        handleProductClick(featuredProducts[0].slug);
                      } else {
                        setActivePage('products');
                      }
                    }}
                    className="p-3 bg-white/5 hover:bg-gold hover:text-bg-dark border border-white/10 hover:border-gold rounded-full text-gold transition-all duration-300 cursor-pointer"
                    aria-label="View Product"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Decorative side badge */}
              <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full border border-white/10 bg-bg-panel/80 backdrop-blur-md hidden sm:flex flex-col items-center justify-center p-2 text-center shadow-xl">
                <span className="text-[10px] font-serif italic text-gold font-medium">Grade A+</span>
                <span className="text-[8px] uppercase tracking-wider text-text-muted mt-0.5">Purity</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS (Sleek Trust Stripe) */}
      <section className="container py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5 rounded-3xl bg-bg-panel/30 backdrop-blur-md divide-y md:divide-y-0 md:divide-x divide-white/5">

          <div className="flex flex-col items-start p-8 sm:p-10 text-left group">
            <div className="w-12 h-12 rounded-xl bg-primary-crimson/5 border border-primary-crimson/15 flex items-center justify-center mb-6 text-primary-crimson transition-transform duration-500 group-hover:rotate-6">
              <ShieldCheck className="w-6 h-6 text-primary-crimson" style={{ color: 'hsl(var(--color-primary-crimson))' }} />
            </div>
            <h3 className="text-xl font-medium font-serif mb-3 text-text-primary">100% Lab Certified Purity</h3>
            <p className="text-sm text-text-secondary leading-relaxed font-light">
              Every harvest undergoes strict third-party testing. Crocin pigment levels in Saffron and fulvic acid percentages in Shilajit are verified.
            </p>
          </div>

          <div className="flex flex-col items-start p-8 sm:p-10 text-left group">
            <div className="w-12 h-12 rounded-xl bg-primary-gold/5 border border-primary-gold/15 flex items-center justify-center mb-6 text-gold transition-transform duration-500 group-hover:rotate-6">
              <MapPin className="w-6 h-6 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} />
            </div>
            <h3 className="text-xl font-medium font-serif mb-3 text-text-primary">Direct Afghan Sourcing</h3>
            <p className="text-sm text-text-secondary leading-relaxed font-light">
              We eliminate middlemen, trading directly with smallholder farming cooperatives in Herat, Wakhan, and Kandahar, ensuring fair ethical trade.
            </p>
          </div>

          <div className="flex flex-col items-start p-8 sm:p-10 text-left group">
            <div className="w-12 h-12 rounded-xl bg-accent-green/5 border border-accent-green/15 flex items-center justify-center mb-6 text-accent-green transition-transform duration-500 group-hover:rotate-6">
              <Activity className="w-6 h-6 text-accent-green" style={{ color: 'hsl(var(--color-accent-green))' }} />
            </div>
            <h3 className="text-xl font-medium font-serif mb-3 text-text-primary">Organic & Traditional</h3>
            <p className="text-sm text-text-secondary leading-relaxed font-light">
              Pure mountain minerals and sun-dried organic fruits. No chemical processing, synthetic additives, or artificial preservatives.
            </p>
          </div>

        </div>
      </section>

      {/* 3. CURATED COLLECTIONS */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold" style={{ color: 'hsl(var(--color-primary-gold))' }}>Curated Collections</span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium mt-2 mb-4">Sourced from Fertile Valleys</h2>
            <p className="text-text-secondary font-light">Select a collection to discover the rich harvesting traditions and premium offerings.</p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-gold animate-spin" style={{ color: 'hsl(var(--color-primary-gold))' }} />
              <p className="text-sm text-text-muted">Loading collections...</p>
            </div>
          ) : error ? (
            <div className="text-center text-primary-crimson py-6">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setActivePage('products');
                  }}
                  className="group relative h-[420px] glass-card-premium overflow-hidden cursor-pointer flex flex-col justify-end p-8 border border-white/5"
                >
                  {/* Floating Serif Number */}
                  <span className="absolute top-6 right-8 font-serif italic text-6xl text-white/5 group-hover:text-gold/15 transition-all duration-500 select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Category Image */}
                  {cat.image ? (
                    <img
                      src={DirectusService.getImageUrl(cat.image)}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105 z-0"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 transition-transform duration-[1000ms] group-hover:scale-105 z-0"
                      style={{ background: getFallbackGradient(cat.slug) }}
                    ></div>
                  )}

                  {/* Multi-layered Dark Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/45 to-transparent z-10 group-hover:opacity-90 transition-opacity duration-500"></div>

                  {/* Category Info */}
                  <div className="relative z-20 flex flex-col text-left">
                    <h3 className="text-2xl font-serif font-medium mb-2 text-text-primary group-hover:text-gold transition-colors duration-300">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-text-secondary leading-relaxed font-light mb-6 opacity-80 line-clamp-2">
                      {cat.description}
                    </p>
                    <span
                      className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold flex items-center gap-1.5 transition-all duration-300"
                      style={{ color: 'hsl(var(--color-primary-gold))' }}
                    >
                      Shop Collection <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. HERITAGE MANIFESTO & INTERACTIVE INGREDIENT SPOTLIGHT */}
      <section id="manifesto" className="container py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* Left: Interactive Spotlight Dashboard */}
          <div className="lg:col-span-6 flex flex-col gap-6 order-2 lg:order-1">
            <div className="glass-card-premium p-5 sm:p-8 flex flex-col gap-5 relative w-full text-left bg-bg-panel/30 border border-white/5 backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] luxury-glow-gold rounded-full opacity-10 pointer-events-none"></div>

              {/* Tabs */}
              <div className="flex border-b border-white/5 pb-2 gap-2 sm:gap-4 overflow-x-auto">
                <button
                  onClick={() => setActiveIngredient('saffron')}
                  className={`pb-2 px-2 text-xs sm:text-sm font-serif tracking-wider transition-colors duration-300 cursor-pointer whitespace-nowrap ${activeIngredient === 'saffron' ? 'border-b-2 border-gold text-gold font-medium' : 'text-text-muted hover:text-text-secondary'}`}
                  style={{
                    borderColor: activeIngredient === 'saffron' ? 'hsl(var(--color-primary-gold))' : '',
                    color: activeIngredient === 'saffron' ? 'hsl(var(--color-primary-gold))' : ''
                  }}
                >
                  Saffron
                </button>
                <button
                  onClick={() => setActiveIngredient('shilajit')}
                  className={`pb-2 px-2 text-xs sm:text-sm font-serif tracking-wider transition-colors duration-300 cursor-pointer whitespace-nowrap ${activeIngredient === 'shilajit' ? 'border-b-2 border-gold text-gold font-medium' : 'text-text-muted hover:text-text-secondary'}`}
                  style={{
                    borderColor: activeIngredient === 'shilajit' ? 'hsl(var(--color-primary-gold))' : '',
                    color: activeIngredient === 'shilajit' ? 'hsl(var(--color-primary-gold))' : ''
                  }}
                >
                  Shilajit
                </button>
                <button
                  onClick={() => setActiveIngredient('dry-fruits')}
                  className={`pb-2 px-2 text-xs sm:text-sm font-serif tracking-wider transition-colors duration-300 cursor-pointer whitespace-nowrap ${activeIngredient === 'dry-fruits' ? 'border-b-2 border-gold text-gold font-medium' : 'text-text-muted hover:text-text-secondary'}`}
                  style={{
                    borderColor: activeIngredient === 'dry-fruits' ? 'hsl(var(--color-primary-gold))' : '',
                    color: activeIngredient === 'dry-fruits' ? 'hsl(var(--color-primary-gold))' : ''
                  }}
                >
                  Dry Fruits
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex flex-col gap-3 sm:gap-4 animate-fade-in-up">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-lg sm:text-2xl font-serif font-medium text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                    {currentSpotlight.title}
                  </h4>
                  <span className="text-[10px] uppercase font-bold tracking-[0.15em] py-0.5 px-2.5 rounded bg-white/5 border border-white/10 text-accent-green" style={{ color: 'hsl(var(--color-accent-green))' }}>
                    {currentSpotlight.purityRate} Pure
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-text-muted font-light">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} /> {currentSpotlight.region}
                  </span>
                  <span className="hidden sm:inline">|</span>
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }} /> {currentSpotlight.altitude}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-text-secondary font-light leading-relaxed">
                  {currentSpotlight.description}
                </p>

                {/* Technical stats boxes */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-1">
                  {currentSpotlight.attributes.map((attr, index) => (
                    <div key={index} className="stats-badge flex flex-col items-start gap-0.5 p-3">
                      <span className="text-[10px] uppercase tracking-wider text-text-muted">{attr.label}</span>
                      <span className="text-xs sm:text-sm font-medium text-text-primary">{attr.value}</span>
                    </div>
                  ))}
                </div>

                {/* Sourcing Location Info */}
                <div className="pt-3 sm:pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-text-muted font-light">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3 text-gold/60" /> GPS: {currentSpotlight.coordinates}
                  </span>
                  <span className="italic">Lab Report Verified</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right: Sourcing Story Text */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-left order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 py-1 px-3.5 rounded-full bg-white/5 border border-white/10 w-fit text-xs font-semibold uppercase tracking-widest text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
              <MapPin className="w-3.5 h-3.5" /> Sourcing Manifesto
            </div>

            <h2 className="text-3xl md:text-5xl font-serif font-medium text-text-primary leading-[1.15]">
              Harvested with Pride, Sourced with Integrity
            </h2>

            <p className="text-text-secondary font-light leading-relaxed">
              For centuries, the volcanic valleys and high-altitude mountain ranges of Afghanistan have produced some of the world's most robust organic products.
            </p>
            <p className="text-text-secondary font-light leading-relaxed">
              From the arid, sun-kissed soil of Herat - perfect for organic saffron stigmas - to the pristine crevices of the Wakhan Corridor where mineral-rich shilajit is gathered, our mission at Saffronbasket is to preserve these direct agricultural links.
            </p>
            <p className="text-text-secondary font-light leading-relaxed">
              We pay our farmers directly, guarantee chemical-free traditional processing, and run laboratory validations for heavy metals, crocin strength, and safety to deliver pure wellness you can trust.
            </p>

            <button
              onClick={() => {
                setSelectedCategory(activeIngredient === 'dry-fruits' ? 'dry-fruits' : activeIngredient);
                setActivePage('products');
              }}
              className="btn-luxury w-fit px-8 py-4 mt-2 text-xs font-semibold tracking-wider cursor-pointer"
            >
              Shop {activeIngredient === 'dry-fruits' ? 'Dry Fruits' : activeIngredient.charAt(0).toUpperCase() + activeIngredient.slice(1)}
            </button>
          </div>

        </div>
      </section>

      {/* 5. FEATURED PRODUCTS (Gourmet Collections) */}
      <section className="py-12 md:py-20 relative z-10">
        <div className="container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold" style={{ color: 'hsl(var(--color-primary-gold))' }}>Gourmet Shop</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium mt-2">Limited Batch Crops</h2>
            </div>
            <button
              onClick={() => setActivePage('products')}
              className="btn btn-secondary text-xs tracking-wider px-5 py-2.5 font-semibold border-white/10 hover:border-gold/30 hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
            >
              View Full Catalog <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 text-gold animate-spin" style={{ color: 'hsl(var(--color-primary-gold))' }} />
              <p className="text-sm text-text-muted">Loading premium products...</p>
            </div>
          ) : error ? (
            <div className="text-center text-primary-crimson py-6">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => {
                const discount = product.compare_at_price
                  ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
                  : 0;

                return (
                  <div
                    key={product.id}
                    className="glass-card-premium relative overflow-hidden flex flex-col h-full group border border-white/5 rounded-xl"
                  >

                    {/* Badge Overlay (Top Left) */}
                    {product.badge && (
                      <span className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur-md px-2.5 py-1 border border-white/10 rounded-full text-[9px] uppercase tracking-wide font-bold text-gold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                        {product.badge}
                      </span>
                    )}

                    {/* Product Image */}
                    <div
                      onClick={() => handleProductClick(product.slug)}
                      className="h-56 w-full relative flex items-center justify-center cursor-pointer overflow-hidden bg-bg-dark"
                    >
                      {product.image ? (
                        <img
                          src={DirectusService.getImageUrl(product.image)}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="absolute inset-0 w-full h-full"
                          style={{ background: getFallbackGradient(product.categories?.[0]?.categories_id?.slug || '') }}
                        ></div>
                      )}

                      {/* Quick Add overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-bg-dark via-bg-dark/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200 flex justify-center z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product, 1);
                          }}
                          className="btn-luxury w-full py-2 px-4 text-xs font-bold tracking-wider cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Quick Add
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 flex flex-col flex-grow gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-gold font-semibold" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                          {product.origin}
                        </span>

                        {/* Rating Display */}
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? 'fill-gold text-gold' : 'text-white/10'}`}
                              style={{
                                fill: i < Math.floor(product.rating || 5) ? 'hsl(var(--color-primary-gold))' : 'transparent',
                                color: i < Math.floor(product.rating || 5) ? 'hsl(var(--color-primary-gold))' : 'rgba(255,255,255,0.1)'
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      <h4
                        onClick={() => handleProductClick(product.slug)}
                        className="text-base font-serif font-medium text-text-primary hover:text-gold cursor-pointer transition-colors line-clamp-1"
                      >
                        {product.name}
                      </h4>

                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-semibold text-text-primary">Rs.{product.price}</span>
                          {product.compare_at_price && (
                            <span className="text-xs text-text-muted line-through">Rs.{product.compare_at_price}</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleProductClick(product.slug)}
                          className="text-xs font-semibold text-gold hover:text-text-primary transition-colors flex items-center gap-1 cursor-pointer"
                          style={{ color: 'hsl(var(--color-primary-gold))' }}
                        >
                          View <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 6. GLOW OF TRUST (Testimonials Slider) */}
      <section className="container py-16 md:py-24 relative z-10">
        <div className="relative glass-card-premium p-8 sm:p-12 md:p-16 text-center overflow-hidden border border-white/5 bg-bg-panel/20 backdrop-blur-md mx-auto max-w-4xl rounded-xl">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] luxury-glow-gold rounded-full opacity-10 pointer-events-none"></div>

          {/* Giant Quote Icon Background */}
          <div className="absolute top-2 left-4 font-serif text-[4rem] sm:text-[6rem] text-gold/5 select-none leading-none pointer-events-none">
            "
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold" style={{ color: 'hsl(var(--color-primary-gold))' }}>Testimonials</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-medium">Glow of Trust</h2>
            </div>

            {/* Slide Area */}
            <div className="w-full flex flex-col items-center">
              <div key={activeTestimonial} className="animate-fade-in-up flex flex-col items-center max-w-2xl mx-auto">

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonials[activeTestimonial].stars)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-gold text-gold"
                      style={{ fill: 'hsl(var(--color-primary-gold))' }}
                    />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-base sm:text-lg font-serif text-text-primary italic leading-relaxed font-light mb-6 text-center px-4">
                  "{testimonials[activeTestimonial].quote}"
                </p>

                {/* Author Name */}
                <h5 className="font-serif font-medium text-gold text-sm sm:text-base tracking-wide text-center" style={{ color: 'hsl(var(--color-primary-gold))' }}>
                  {testimonials[activeTestimonial].author}
                </h5>

                {/* Author Role */}
                <p className="text-xs text-text-muted mt-1 font-light text-center">
                  {testimonials[activeTestimonial].role}
                </p>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full border border-white/10 hover:border-gold/40 hover:bg-white/5 text-text-secondary hover:text-gold transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all ${index === activeTestimonial ? 'w-6 bg-gold' : 'w-2 bg-white/20 hover:bg-white/30'}`}
                    style={index === activeTestimonial ? { backgroundColor: 'hsl(var(--color-primary-gold))' } : {}}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full border border-white/10 hover:border-gold/40 hover:bg-white/5 text-text-secondary hover:text-gold transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
