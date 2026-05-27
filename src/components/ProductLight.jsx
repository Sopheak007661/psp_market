import React, { useRef, useState, useEffect, useContext } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ShopContext } from '../context/ShopContext';

export default function ProductLight({ setView, setSelectedProductId }) {
  const { products } = useContext(ShopContext);
  const trackRef = useRef(null);
  const [idx, setIdx] = useState(0);
  const [hoveredId, setHoveredId] = useState(null);
  const autoRef = useRef(null);

  const CARD_W = 176;
  const VISIBLE = 4;
  const maxIdx = Math.max(0, products.length - VISIBLE);

  useEffect(() => {
    autoRef.current = setInterval(() => {
      setIdx(prev => (prev < maxIdx ? prev + 1 : 0));
    }, 2800);
    return () => clearInterval(autoRef.current);
  }, [maxIdx]);

  const resetAuto = () => {
    clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setIdx(prev => (prev < maxIdx ? prev + 1 : 0));
    }, 2800);
  };

  const goTo = (n) => {
    setIdx(Math.max(0, Math.min(n, maxIdx)));
    resetAuto();
  };

  // ✅ Fix 1: takes the individual card's product, not the outer prop
  const handleCardClick = (productId) => {
    setSelectedProductId(productId);
    setView('shop-detail');
  };

  return (
    <div className="w-full px-4 py-6 bg-white rounded-xl shadow-sm relative left=0 right-0 mx-auto abuse-pointer-events">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <h2 className="text-base font-semibold text-gray-800">Live products</h2>
        </div>
        <span className="text-xs text-gray-600">New product</span>
      </div>

      <div className="relative">
        <button
          onClick={() => goTo(idx - 1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        <div className="overflow-hidden mx-10">
          <div
            ref={trackRef}
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${idx * CARD_W}px)` }}
          >
            {products.map(product => (
              <div
                key={product.id}
                className="flex-none w-40 rounded-xl border border-gray-100 bg-white overflow-hidden cursor-pointer relative"
                style={{
                  transform: hoveredId === product.id ? 'scale(1.07)' : 'scale(1)',
                  transition: 'transform 0.25s ease, border-color 0.2s',
                  borderColor: hoveredId === product.id ? '#378ADD' : '',
                  zIndex: hoveredId === product.id ? 2 : 1,
                }}
                onMouseEnter={() => setHoveredId(product.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="w-full h-32 overflow-hidden bg-gray-50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* <div className="p-2.5">
                  <p className="text-xs font-semibold text-gray-800 truncate">{product.name}</p>
                  <p className="text-xs text-blue-600 mt-0.5">${product.price}</p>
                  <p className="text-[11px] text-gray-400">{product.category}</p>
                </div> */}

                <div
                  className="absolute inset-0 flex items-end justify-center pb-3 transition-opacity duration-200"
                  style={{
                    background: 'rgba(24,95,165,0.12)',
                    opacity: hoveredId === product.id ? 1 : 0,
                  }}
                >
                  {/* ✅ Fix 2: passes product.id directly, Fix 3: valid py-1.5 class */}
                  <button
                    onClick={() => handleCardClick(product.id)}
                    className="bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full hover:bg-blue-800 transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => goTo(idx + 1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      <div className="flex justify-center gap-1.5 mt-4">
        {Array.from({ length: maxIdx + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-blue-600' : 'bg-gray-400'}`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}