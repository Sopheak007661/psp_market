import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Zap, ShoppingBag, Clock, Flame, Star, Tag, TrendingDown, ArrowRight } from 'lucide-react';

// Deterministically assign a "deal discount" to each product using its id
function getDealDiscount(product) {
  const seed = (product.id * 7 + 13) % 5;
  return [10, 15, 20, 25, 30][seed];
}

// Mark ~40% of products as "flash deal" based on id parity
function isFlashDeal(product) {
  return product.id % 3 === 0;
}

function CountdownTimer({ label }) {
  const [time, setTime] = useState({ h: 5, m: 59, s: 42 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = n => String(n).padStart(2, '0');

  return (
    <div className="flex items-center gap-2">
      <Clock className="h-4 w-4 text-orange-400" />
      <span className="text-xs text-orange-200 font-medium">{label} ends in:</span>
      <div className="flex items-center gap-1">
        {[pad(time.h), pad(time.m), pad(time.s)].map((unit, i) => (
          <React.Fragment key={i}>
            <span className="bg-orange-500 text-white text-xs font-black px-2 py-0.5 rounded-md tabular-nums">{unit}</span>
            {i < 2 && <span className="text-orange-300 font-bold text-xs">:</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function DealCard({ product, discount, flash, setView, setSelectedProductId }) {
  const { addToCart } = useContext(ShopContext);
  const originalPrice = Number(product.price || 0);
  const dealPrice = originalPrice * (1 - discount / 100);

  return (
    <div
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${flash ? 'border-orange-200' : 'border-gray-100'}`}
      style={{ animation: 'fadeUp 0.4s ease both' }}
    >
      {/* Flash badge */}
      {flash && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full shadow">
          <Flame className="h-3 w-3" /> FLASH
        </div>
      )}

      {/* Discount badge */}
      <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full shadow">
        -{discount}%
      </div>

      {/* Image */}
      <div
        className="h-40 bg-gray-50 overflow-hidden cursor-pointer relative"
        onClick={() => { setSelectedProductId(product.id); setView('shop-detail'); }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div
          className="cursor-pointer"
          onClick={() => { setSelectedProductId(product.id); setView('shop-detail'); }}
        >
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{product.category}</span>
          <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mt-0.5 group-hover:text-blue-700 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
          )}
        </div>

        {/* Stars mock */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
          ))}
          <span className="text-[10px] text-gray-400 ml-1">(4.0)</span>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
            <p className="text-lg font-black text-red-600">${dealPrice.toFixed(2)}</p>
          </div>
          <button
            onClick={() => addToCart({ ...product, price: dealPrice })}
            className="flex items-center gap-1.5 bg-blue-800 hover:bg-red-600 text-white text-[11px] font-bold px-3 py-2 rounded-xl transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Grab Deal
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Deals({ setView, setSelectedProductId }) {
  const { products } = useContext(ShopContext);
  const [activeTab, setActiveTab] = useState('all');

  // Assign deals to all products
  const dealsData = products.map(p => ({
    ...p,
    discount: getDealDiscount(p),
    flash: isFlashDeal(p),
  }));

  const flashDeals  = dealsData.filter(p => p.flash);
  const bigSavings  = dealsData.filter(p => p.discount >= 20);
  const displayed   = activeTab === 'flash' ? flashDeals : activeTab === 'big' ? bigSavings : dealsData;

  const totalSavings = dealsData.reduce((sum, p) => sum + (p.price * p.discount / 100), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #fb923c, #fbbf24, #fb923c);
          background-size: 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2s linear infinite;
        }
      `}</style>

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 px-6 py-12 text-white">
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Today's Deals</span>
          </div>

          <h1 className="text-4xl font-black mb-1">
            <span className="shimmer-text">Hot Savings</span>{' '}
            <span className="text-white">on PSP MART</span>
          </h1>
          <p className="text-blue-200 text-sm mb-5">
            {dealsData.length} deals live · Potential savings of <strong className="text-orange-300">${totalSavings.toFixed(0)}</strong> across all products
          </p>

          <div className="flex flex-wrap gap-4">
            <CountdownTimer label="Flash deals" />
            <div className="flex items-center gap-2 text-xs text-blue-300">
              <TrendingDown className="h-4 w-4 text-green-400" />
              <span>Up to <strong className="text-green-400">30% off</strong> today</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-6">
          {[
            { label: 'Total Deals',  value: dealsData.length,                     icon: <Tag className="h-4 w-4 text-blue-600" /> },
            { label: 'Flash Deals',  value: flashDeals.length,                    icon: <Flame className="h-4 w-4 text-orange-500" /> },
            { label: 'Max Discount', value: '30%',                                icon: <Zap className="h-4 w-4 text-yellow-500" /> },
            { label: 'Savings Pool', value: `$${totalSavings.toFixed(0)}`,        icon: <TrendingDown className="h-4 w-4 text-green-500" /> },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              {s.icon}
              <div>
                <p className="text-xs text-gray-400 leading-none">{s.label}</p>
                <p className="text-sm font-black text-gray-900">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ── Filter Tabs ── */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all',   label: '🔥 All Deals',     count: dealsData.length },
            { key: 'flash', label: '⚡ Flash Deals',   count: flashDeals.length },
            { key: 'big',   label: '💰 Big Savings',   count: bigSavings.length },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition ${
                activeTab === tab.key
                  ? 'bg-blue-800 text-white border-blue-800 shadow'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
              }`}
            >
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${activeTab === tab.key ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ── Deals Grid ── */}
        {displayed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <Zap className="h-10 w-10 text-gray-200 mb-3" />
            <p className="text-sm font-semibold text-gray-400">No deals in this category yet</p>
            <p className="text-xs text-gray-300 mt-1">Add more products in the admin panel to generate deals</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {displayed.map((product, i) => (
              <div key={product.id} style={{ animationDelay: `${i * 35}ms` }}>
                <DealCard
                  product={product}
                  discount={product.discount}
                  flash={product.flash}
                  setView={setView}
                  setSelectedProductId={setSelectedProductId}
                />
              </div>
            ))}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="mt-10 bg-gradient-to-r from-blue-800 to-blue-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-black text-lg">Want to see all products?</h3>
            <p className="text-blue-200 text-sm mt-0.5">Browse our full catalogue with every category</p>
          </div>
          <button
            onClick={() => setView('shop-products')}
            className="flex items-center gap-2 bg-white text-blue-900 font-bold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm flex-shrink-0"
          >
            Browse All <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}