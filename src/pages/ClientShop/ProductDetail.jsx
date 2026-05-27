
// import React, { useContext } from 'react';
// import Foot from '../../components/Foot'
// import { ShopContext } from '../../context/ShopContext';
// import { ChevronLeft, ShoppingCart } from 'lucide-react';

// export default function ProductDetail({ productId, setView }) {
//   const { products, addToCart } = useContext(ShopContext);
//   const product = products.find(p => p.id === productId);

//   if (!product) {
//     return <p className="text-gray-500 text-center py-12">Product configuration error.</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4 bg-gray-300 rounded-2xl shadow-md mt-10 mb-20">
//       <div className=''>
//           <button onClick={() => setView('shop-home')} className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 text-xs font-semibold mb-6 transition">
//             <ChevronLeft className="h-4 w-4" />
//             <span>Back to Directory</span>
//           </button>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8  p-6 border border-gray-200 rounded-3xl shadow-xs">
//             <div className="w-200 h-200  p-3 overflow-hidden  border-r-4 border-gray-500">
//               <img src={product.image} alt={product.name} className="w-full object-cover " />
//             </div>
//             <div className="flex flex-col justify-between py-2">
//               <div>
//                 <span className="text-[10px] uppercase tracking-widest font-extrabold text-white  bg-blue-500 px-3.5 py-0 shadow-md shadow-blue-800 rounded-md">{product.category}</span>
//                 <h1 className="text-2xl font-black text-gray-900 mt-3">{product.name}</h1>
//                 <p className="text-2xl font-black text-gray-900 mt-2">${Number(product.price||0).toFixed(2)}</p>
                
//                 {/* 🔥 STREAMING DYNAMIC INPUT DESCRIPTION FROM CONTEXT STORE MEMORY */}
//                 <p className="text-gray-600 text-md mt-4 leading-relaxed whitespace-pre-line text-left">
//                   {product.description || "This is a standard frontend design description mock view. This product represents verified, highly responsive layout scaling options configured specifically within React framework properties."}
//                 </p>
//               </div>
//               <button 
//                 onClick={() => addToCart(product)}
//                 className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-sm shadow-indigo-100 mt-6"
//               >
//                 <ShoppingCart className="h-4 w-4" />
//                 <span>Secure to Bag</span>
//               </button>
//             </div>
//           </div>
//         </div>
//         <Foot/>
//     </div>
//   );
// }













import React, { useState, useContext, useRef, useCallback } from 'react';
import Foot from '../../components/Foot';
import { ShopContext } from '../../context/ShopContext';
import { ChevronLeft, ShoppingCart, CheckCircle2, ZoomIn, Plus, Minus, X, Package, ArrowRight } from 'lucide-react';


// ── Zoom constants ──────────────────────────────────────────────────────────
const ZOOM_SCALE   = 1.8;
const LENS_SIZE    = 100;
const PREVIEW_SIZE = 780;

export default function ProductDetail({ productId, setView }) {
  const { products, addToCart } = useContext(ShopContext);
  const product = products.find((p) => p.id === productId);

  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity,        setQuantity]        = useState(1);
  const [isHovering,      setIsHovering]      = useState(false);
  const [lensPos,         setLensPos]         = useState({ x: 0, y: 0 });
  const [previewBg,       setPreviewBg]       = useState({ x: 0, y: 0 });
  const [mousePageY,      setMousePageY]      = useState(0);

  // ── cart toast state ───────────────────────────────────────────────────────
  const [showCart,  setShowCart]  = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast,     setToast]     = useState(false);

  const imgWrapRef = useRef(null);
  const imgElRef   = useRef(null);
  const toastTimer = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const wrap = imgWrapRef.current;
    const img  = imgElRef.current;
    if (!wrap || !img) return;
    const rect     = wrap.getBoundingClientRect();
    const mouseX   = e.clientX - rect.left;
    const mouseY   = e.clientY - rect.top;
    const halfLens = LENS_SIZE / 2;
    const lensX    = Math.max(0, Math.min(mouseX - halfLens, rect.width  - LENS_SIZE));
    const lensY    = Math.max(0, Math.min(mouseY - halfLens, rect.height - LENS_SIZE));
    const ratioX   = (lensX + halfLens) / rect.width;
    const ratioY   = (lensY + halfLens) / rect.height;
    setLensPos({ x: lensX, y: lensY });
    setPreviewBg({
      x: -(ratioX * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE / 2),
      y: -(ratioY * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE / 2),
    });
    setMousePageY(e.clientY + window.scrollY);
  }, []);

  if (!product) {
    return <p className="text-gray-500 text-center py-12">Product configuration error.</p>;
  }

  const hasVariants = product.variants && product.variants.length > 0;
  const allSelected = !hasVariants || product.variants.every((v) => selectedOptions[v.label]);

  const handleSelect = (label, option) =>
    setSelectedOptions((prev) => ({ ...prev, [label]: option }));

  const handleAddToCart = () => {
    if (!allSelected) return;

    // call the shared context addToCart
    for (let i = 0; i < quantity; i++) addToCart({ ...product, selectedOptions });

    // update local sidebar cart list
    setCartItems((prev) => {
      const existing = prev.find(
        (it) => it.id === product.id &&
                JSON.stringify(it.selectedOptions) === JSON.stringify(selectedOptions)
      );
      if (existing) {
        return prev.map((it) =>
          it.id === product.id &&
          JSON.stringify(it.selectedOptions) === JSON.stringify(selectedOptions)
            ? { ...it, quantity: it.quantity + quantity }
            : it
        );
      }
      return [...prev, { ...product, selectedOptions, quantity, cartKey: Date.now() }];
    });

    // toast
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 2800);

    setShowCart(true);
  };

  const updateCartQty = (cartKey, delta) =>
    setCartItems((prev) =>
      prev
        .map((it) => it.cartKey === cartKey ? { ...it, quantity: it.quantity + delta } : it)
        .filter((it) => it.quantity > 0)
    );

  const removeCartItem = (cartKey) =>
    setCartItems((prev) => prev.filter((it) => it.cartKey !== cartKey));

  const cartTotal     = cartItems.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
  const cartItemCount = cartItems.reduce((s, it) => s + it.quantity, 0);

  const colorMap = {
    red: '#ef4444', blue: '#3b82f6', green: '#22c55e', black: '#111827',
    white: '#f9fafb', yellow: '#eab308', purple: '#a855f7', pink: '#ec4899',
    orange: '#f97316', gray: '#9ca3af', grey: '#9ca3af', navy: '#1e3a8a',
    brown: '#92400e', beige: '#d4b483', teal: '#14b8a6',
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col">

      {/* ══ TOP TOAST ══════════════════════════════════════════════════════════ */}
      <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
        <div
          className="mt-4 flex items-center gap-3 bg-green-600 text-white text-sm font-bold
                     px-6 py-3.5 rounded-2xl shadow-2xl pointer-events-auto"
          style={{
            transform:  toast ? 'translateY(0)' : 'translateY(-140%)',
            opacity:    toast ? 1 : 0,
            transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s',
          }}
        >
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>
            <span className="font-black">{product.name}</span> × {quantity} added to bag!
          </span>
          <button className="ml-2 opacity-70 hover:opacity-100" onClick={() => setToast(false)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ══ CART SLIDE-IN PANEL ════════════════════════════════════════════════ */}
      {showCart && (
        <div
          className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
          onClick={() => setShowCart(false)}
        />
      )}
      <div
        className="fixed top-0 right-0 h-full z-[90] w-[360px] max-w-[95vw] bg-white shadow-2xl flex flex-col"
        style={{
          transform:  showCart ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(.4,0,.2,1)',
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gray-700" />
            <h2 className="text-base font-black text-gray-900">Your Bag</h2>
            {cartItemCount > 0 && (
              <span className="bg-blue-800 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1">
                {cartItemCount}
              </span>
            )}
          </div>
          <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-700 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <Package className="h-12 w-12 opacity-30" />
              <p className="text-sm font-semibold">Your bag is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.cartKey}
                className="flex gap-4 p-3 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition shadow-sm">
                {item.image && (
                  <img src={item.image} alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-gray-200" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate">{item.name}</p>
                  {Object.entries(item.selectedOptions || {}).map(([k, v]) => (
                    <p key={k} className="text-[10px] text-gray-400 font-medium">{k}: {v}</p>
                  ))}
                  <p className="text-xs font-black text-blue-800 mt-1">
                    ${(Number(item.price) * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateCartQty(item.cartKey, -1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateCartQty(item.cartKey, 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-green-100 hover:text-green-700 flex items-center justify-center transition">
                      <Plus className="h-3 w-3" />
                    </button>
                    <button onClick={() => removeCartItem(item.cartKey)}
                      className="ml-auto text-gray-300 hover:text-red-500 transition">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-100 px-6 py-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-xl font-black text-gray-900">${cartTotal.toFixed(2)}</span>
            </div>
            {/* ✅ Fixed: just navigate to 'cart' view — cartItems live in ShopContext */}
            {/* <button
              onClick={() => { setShowCart(false); setView('cart'); }}
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-2xl
                         text-sm flex items-center justify-center gap-2 transition shadow-lg"
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </button> */}
            <button
              onClick={() => setShowCart(false)}
              className="w-full text-xs text-gray-400 hover:text-blue-400 font-semibold py-1 transition rounded-lg flex items-center justify-center gap-1 bg-blue-800 border border-gray-00 hover:border-gray-400"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* ── TOP BAR ── */}
      <div className="w-full bg-gray-200 px-6 py-4 border-b border-gray-300 flex items-center justify-between">
        <button
          onClick={() => setView('shop-home')}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 text-xs font-semibold transition"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Directory</span>
        </button>
        <button
          onClick={() => setShowCart(true)}
          className="relative flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-blue-800 text-white text-[9px]
                             font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* ══ ZOOM PREVIEW ═══════════════════════════════════════════════════════ */}
      {isHovering && !showCart && (
        <div
          className="fixed z-50 pointer-events-none rounded-2xl border-2 border-indigo-400 shadow-2xl overflow-hidden"
          style={{
            left:               'calc(55% + 16px)',
            top:                mousePageY - PREVIEW_SIZE / 2,
            width:              PREVIEW_SIZE,
            height:             PREVIEW_SIZE,
            backgroundImage:    `url(${product.image})`,
            backgroundRepeat:   'no-repeat',
            backgroundSize:     `${ZOOM_SCALE * PREVIEW_SIZE}px ${ZOOM_SCALE * PREVIEW_SIZE}px`,
            backgroundPosition: `${previewBg.x}px ${previewBg.y}px`,
          }}
        >
          <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.18)' }} />
          <span className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur text-white
                           text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {ZOOM_SCALE}× Zoom
          </span>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 rounded-full border-2 border-white/60 bg-white/20" />
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">

        {/* LEFT — image */}
        <div className="w-full lg:w-[55%] bg-white border-b lg:border-b-0 lg:border-r border-gray-200
                        flex items-center justify-center p-6 lg:p-10">
          <div
            ref={imgWrapRef}
            className="relative w-full select-none cursor-crosshair"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              ref={imgElRef}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain rounded-2xl"
              style={{ maxHeight: 'calc(100vh - 120px)' }}
              draggable={false}
            />
            <span
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5
                         bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full
                         pointer-events-none transition-opacity duration-300 whitespace-nowrap"
              style={{ opacity: isHovering ? 0 : 1 }}
            >
              <ZoomIn className="h-3 w-3" />
              Hover to zoom
            </span>
            {isHovering && (
              <div
                className="absolute pointer-events-none rounded-lg"
                style={{
                  width: LENS_SIZE, height: LENS_SIZE,
                  left: lensPos.x, top: lensPos.y,
                  border: '2px solid rgba(99,102,241,0.9)',
                  boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 4px 20px rgba(99,102,241,0.2)',
                  background: 'rgba(99,102,241,0.06)',
                  transition: 'none',
                }}
              />
            )}
          </div>
        </div>

        {/* RIGHT — product info */}
        <div className="w-full lg:w-[45%] bg-white flex flex-col justify-between p-8 lg:p-12 overflow-y-auto">
          <div className="space-y-10">

            <span className="text-[10px] uppercase tracking-widest font-extrabold text-white bg-blue-500
                             px-3.5 py-1 shadow-md shadow-blue-800 rounded-md inline-block">
              {product.category}
            </span>

            <div>
              <h1 className="text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
              <p className="text-3xl font-black text-gray-800 mt-2">${Number(product.price || 0).toFixed(2)}</p>
            </div>

            <div className="h-px bg-gray-100 w-full" />

            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
              {product.description ||
                'This is a standard frontend design description mock view. This product represents verified, highly responsive layout scaling options configured specifically within React framework properties.'}
            </p>

            {/* VARIANT SELECTORS */}
            {hasVariants && (
              <div className="space-y-10">
                {product.variants.map((variant) => (
                  <div key={variant.label}>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      {variant.label}
                      {selectedOptions[variant.label] && (
                        <span className="ml-2 text-indigo-600 normal-case font-semibold tracking-normal">
                          — {selectedOptions[variant.label]}
                        </span>
                      )}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => {
                        const isSelected     = selectedOptions[variant.label] === option;
                        const isColorVariant = variant.label.toLowerCase().includes('color') ||
                                               variant.label.toLowerCase().includes('colour');
                        const colorHex = colorMap[option.toLowerCase()];

                        if (isColorVariant && colorHex) {
                          return (
                            <button key={option} type="button"
                              onClick={() => handleSelect(variant.label, option)} title={option}
                              className={`w-9 h-9 rounded-full border-2 transition-all ${
                                isSelected ? 'border-indigo-600 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: colorHex }}
                            />
                          );
                        }
                        return (
                          <button key={option} type="button"
                            onClick={() => handleSelect(variant.label, option)}
                            className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {!allSelected && (
                  <p className="text-[11px] text-amber-500 font-semibold">
                    ⚠ Please select all options before adding to bag.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* QUANTITY + ADD TO CART */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100
                             text-gray-600 hover:text-gray-900 transition border-r border-gray-200"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-black text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100
                             text-gray-600 hover:text-gray-900 transition border-l border-gray-200"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Subtotal:{' '}
                <span className="text-gray-700 font-black">
                  ${(Number(product.price || 0) * quantity).toFixed(2)}
                </span>
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!allSelected}
                className={`flex-1 font-bold py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 transition shadow-md ${
                  !allSelected
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-800 hover:bg-green-700 text-white'
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Bag
              </button>

              {cartItems.length > 0 && (
                <button
                  onClick={() => setShowCart(true)}
                  className="relative flex items-center justify-center px-5 py-4 rounded-2xl
                             border-2 border-blue-600 text-blue-600 hover:bg-blue-50
                             font-bold text-sm transition shadow-sm flex-shrink-0"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 bg-blue-800 text-white text-[9px]
                                   font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                    {cartItemCount}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full mt-auto  border-t border-gray-700">
        <Foot />
      </footer>
    </div>
  );
}