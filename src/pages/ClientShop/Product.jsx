import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { ShoppingBag, Search, X, SlidersHorizontal, Tag, PackageOpen } from 'lucide-react';

const CATEGORIES = [
  'All', 'Car', 'Computer', 'Fruit', 'Vegetable',
  'Clothes', 'Phone', 'Accessories', 'Hotel Book', 'Meet'
];

const CATEGORY_META = {
  Car:         { emoji: '🚗', color: 'from-red-500/10 to-orange-500/10',   border: 'border-red-200',   badge: 'bg-red-50 text-red-700' },
  Computer:    { emoji: '💻', color: 'from-blue-500/10 to-cyan-500/10',    border: 'border-blue-200',  badge: 'bg-blue-50 text-blue-700' },
  Fruit:       { emoji: '🍎', color: 'from-green-500/10 to-lime-500/10',   border: 'border-green-200', badge: 'bg-green-50 text-green-700' },
  Vegetable:   { emoji: '🥦', color: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-200', badge: 'bg-emerald-50 text-emerald-700' },
  Clothes:     { emoji: '👔', color: 'from-pink-500/10 to-rose-500/10',    border: 'border-pink-200',  badge: 'bg-pink-50 text-pink-700' },
  Phone:       { emoji: '📱', color: 'from-violet-500/10 to-purple-500/10',border: 'border-violet-200',badge: 'bg-violet-50 text-violet-700' },
  Accessories: { emoji: '⌚', color: 'from-amber-500/10 to-yellow-500/10', border: 'border-amber-200', badge: 'bg-amber-50 text-amber-700' },
  'Hotel Book':{ emoji: '🏨', color: 'from-sky-500/10 to-indigo-500/10',   border: 'border-sky-200',   badge: 'bg-sky-50 text-sky-700' },
  Meet:        { emoji: '🤝', color: 'from-slate-500/10 to-gray-500/10',   border: 'border-slate-200', badge: 'bg-slate-50 text-slate-700' },
};

function ProductCard({ product, setView, setSelectedProductId }) {
  const { addToCart } = useContext(ShopContext);
  const meta = CATEGORY_META[product.category] || { emoji: '📦', color: 'from-gray-100 to-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-700' };

  return (
    <div
      className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
      style={{ animation: 'fadeSlideUp 0.4s ease both' }}
    >
      {/* Image */}
      <div
        className={`relative h-44 bg-gradient-to-br ${meta.color} overflow-hidden cursor-pointer`}
        onClick={() => { setSelectedProductId(product.id); setView('shop-detail'); }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${meta.badge} border ${meta.border} backdrop-blur-sm`}>
          {meta.emoji} {product.category}
        </span>
        {product.variants && product.variants.length > 0 && (
          <span className="absolute top-3 right-3 bg-white/90 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-full border border-gray-200">
            {product.variants.length} variant{product.variants.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div
          className="cursor-pointer"
          onClick={() => { setSelectedProductId(product.id); setView('shop-detail'); }}
        >
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 group-hover:text-blue-700 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Variants preview */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {product.variants.slice(0, 2).map((v, i) => (
              <span key={i} className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded font-semibold">
                {v.label}: {v.options.slice(0,3).join(', ')}{v.options.length > 3 ? '…' : ''}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
          <span className="text-base font-black text-gray-900">${Number(product.price || 0).toFixed(2)}</span>
          <button
            onClick={() => addToCart(product)}
            className="flex items-center gap-1.5 bg-blue-800 hover:bg-green-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition-colors duration-200"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Products({ setView, setSelectedProductId }) {
  const { products, searchTerm, setSearchTerm } = useContext(ShopContext);
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = products
    .filter(p => {
      const matchCat = category === 'All' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name')       return a.name.localeCompare(b.name);
      return 0;
    });

  // Count per category
  const counts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = cat === 'All' ? products.length : products.filter(p => p.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-10 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-blue-300 text-xs font-semibold mb-2 uppercase tracking-widest">
            <Tag className="h-3.5 w-3.5" /> All Products
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1">Browse Our Catalogue</h1>
          <p className="text-blue-200 text-sm">{products.length} items available across {CATEGORIES.length - 1} categories</p>

          {/* Search bar */}
          <div className="relative mt-5 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
            <input
              type="text"
              placeholder="Search products by name…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 text-sm focus:outline-none focus:bg-white/20 transition"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              counts[cat] > 0 || cat === 'All' ? (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                    category === cat
                      ? 'bg-blue-800 text-white border-blue-800 shadow'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {CATEGORY_META[cat]?.emoji || '📦'} {cat}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${category === cat ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                    {counts[cat]}
                  </span>
                </button>
              ) : null
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-blue-400"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name: A → Z</option>
            </select>
            <span className="text-xs text-gray-400 font-medium">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* ── Search feedback ── */}
        {searchTerm && (
          <p className="text-xs text-gray-500 mb-4">
            Results for <span className="font-bold text-gray-800">"{searchTerm}"</span> in <span className="font-bold text-gray-800">{category}</span> — {filtered.length} found
          </p>
        )}

        {/* ── Grid ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <PackageOpen className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-semibold text-gray-400">No products found</p>
            <p className="text-xs text-gray-300 mt-1">Try a different category or clear your search</p>
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="mt-4 px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition">
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((product, i) => (
              <div key={product.id} style={{ animationDelay: `${i * 40}ms` }}>
                <ProductCard
                  product={product}
                  setView={setView}
                  setSelectedProductId={setSelectedProductId}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}