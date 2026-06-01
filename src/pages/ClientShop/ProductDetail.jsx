// import React, { useState, useContext, useRef, useCallback } from 'react';
// import Foot from '../../components/Foot';
// import { ShopContext } from '../../context/ShopContext';
// import { ChevronLeft, ShoppingCart, CheckCircle2, ZoomIn, Plus, Minus, X, Package, ArrowRight } from 'lucide-react';


// // ── Zoom constants ──────────────────────────────────────────────────────────
// const ZOOM_SCALE   = 1.8;
// const LENS_SIZE    = 200;
// const PREVIEW_SIZE = 400;

// export default function ProductDetail({ productId, setView }) {
//   const { products, addToCart } = useContext(ShopContext);
//   const product = products.find((p) => p.id === productId);

//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [quantity,        setQuantity]        = useState(1);
//   const [isHovering,      setIsHovering]      = useState(false);
//   const [lensPos,         setLensPos]         = useState({ x: 0, y: 0 });
//   const [previewBg,       setPreviewBg]       = useState({ x: 0, y: 0 });
//   const [mousePageY,      setMousePageY]      = useState(0);

//   // ── cart toast state ───────────────────────────────────────────────────────
//   const [showCart,  setShowCart]  = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const [toast,     setToast]     = useState(false);

//   const imgWrapRef = useRef(null);
//   const imgElRef   = useRef(null);
//   const toastTimer = useRef(null);

//   const handleMouseMove = useCallback((e) => {
//     const wrap = imgWrapRef.current;
//     const img  = imgElRef.current;
//     if (!wrap || !img) return;
//     const rect     = wrap.getBoundingClientRect();
//     const mouseX   = e.clientX - rect.left;
//     const mouseY   = e.clientY - rect.top;
//     const halfLens = LENS_SIZE / 2;
//     const lensX    = Math.max(0, Math.min(mouseX - halfLens, rect.width  - LENS_SIZE));
//     const lensY    = Math.max(0, Math.min(mouseY - halfLens, rect.height - LENS_SIZE));
//     const ratioX   = (lensX + halfLens) / rect.width;
//     const ratioY   = (lensY + halfLens) / rect.height;
//     setLensPos({ x: lensX, y: lensY });
//     setPreviewBg({
//       x: -(ratioX * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE / 2),
//       y: -(ratioY * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE / 2),
//     });
//     setMousePageY(e.clientY + window.scrollY);
//   }, []);

//   if (!product) {
//     return <p className="text-gray-500 text-center py-12">Product configuration error.</p>;
//   }

//   const hasVariants = product.variants && product.variants.length > 0;
//   const allSelected = !hasVariants || product.variants.every((v) => selectedOptions[v.label]);

//   const handleSelect = (label, option) =>
//     setSelectedOptions((prev) => ({ ...prev, [label]: option }));

//   const handleAddToCart = () => {
//     if (!allSelected) return;

//     // call the shared context addToCart
//     for (let i = 0; i < quantity; i++) addToCart({ ...product, selectedOptions });

//     // update local sidebar cart list
//     setCartItems((prev) => {
//       const existing = prev.find(
//         (it) => it.id === product.id &&
//                 JSON.stringify(it.selectedOptions) === JSON.stringify(selectedOptions)
//       );
//       if (existing) {
//         return prev.map((it) =>
//           it.id === product.id &&
//           JSON.stringify(it.selectedOptions) === JSON.stringify(selectedOptions)
//             ? { ...it, quantity: it.quantity + quantity }
//             : it
//         );
//       }
//       return [...prev, { ...product, selectedOptions, quantity, cartKey: Date.now() }];
//     });

//     // toast
//     setToast(true);
//     clearTimeout(toastTimer.current);
//     toastTimer.current = setTimeout(() => setToast(false), 2800);

//     setShowCart(true);
//   };

//   const updateCartQty = (cartKey, delta) =>
//     setCartItems((prev) =>
//       prev
//         .map((it) => it.cartKey === cartKey ? { ...it, quantity: it.quantity + delta } : it)
//         .filter((it) => it.quantity > 0)
//     );

//   const removeCartItem = (cartKey) =>
//     setCartItems((prev) => prev.filter((it) => it.cartKey !== cartKey));

//   const cartTotal     = cartItems.reduce((s, it) => s + Number(it.price) * it.quantity, 0);
//   const cartItemCount = cartItems.reduce((s, it) => s + it.quantity, 0);

//   const colorMap = {
//     red: '#ef4444', blue: '#3b82f6', green: '#22c55e', black: '#111827',
//     white: '#f9fafb', yellow: '#eab308', purple: '#a855f7', pink: '#ec4899',
//     orange: '#f97316', gray: '#9ca3af', grey: '#9ca3af', navy: '#1e3a8a',
//     brown: '#92400e', beige: '#d4b483', teal: '#14b8a6',
//   };

//   return (
//     <div className="w-full min-h-screen bg-gray-100 flex flex-col">

//       {/* ══ TOP TOAST ══════════════════════════════════════════════════════════ */}
//       <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pointer-events-none">
//         <div
//           className="mt-4 flex items-center gap-3 bg-green-600 text-white text-sm font-bold
//                      px-6 py-3.5 rounded-2xl shadow-2xl pointer-events-auto"
//           style={{
//             transform:  toast ? 'translateY(0)' : 'translateY(-140%)',
//             opacity:    toast ? 1 : 0,
//             transition: 'transform 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s',
//           }}
//         >
//           <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
//           <span>
//             <span className="font-black">{product.name}</span> × {quantity} added to bag!
//           </span>
//           <button className="ml-2 opacity-70 hover:opacity-100" onClick={() => setToast(false)}>
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       </div>

//       {/* ══ CART SLIDE-IN PANEL ════════════════════════════════════════════════ */}
//       {showCart && (
//         <div
//           className="fixed inset-0 z-[80] bg-black/30 backdrop-blur-sm"
//           onClick={() => setShowCart(false)}
//         />
//       )}
//       <div
//         className="fixed top-0 right-0 h-full z-[90] w-[360px] max-w-[95vw] bg-white shadow-2xl flex flex-col"
//         style={{
//           transform:  showCart ? 'translateX(0)' : 'translateX(100%)',
//           transition: 'transform 0.38s cubic-bezier(.4,0,.2,1)',
//         }}
//       >
//         {/* header */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <ShoppingCart className="h-5 w-5 text-gray-700" />
//             <h2 className="text-base font-black text-gray-900">Your Bag</h2>
//             {cartItemCount > 0 && (
//               <span className="bg-blue-800 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-1">
//                 {cartItemCount}
//               </span>
//             )}
//           </div>
//           <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-700 transition">
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* items */}
//         <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
//           {cartItems.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
//               <Package className="h-12 w-12 opacity-30" />
//               <p className="text-sm font-semibold">Your bag is empty</p>
//             </div>
//           ) : (
//             cartItems.map((item) => (
//               <div key={item.cartKey}
//                 className="flex gap-4 p-3 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition shadow-sm">
//                 {item.image && (
//                   <img src={item.image} alt={item.name}
//                     className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-gray-200" />
//                 )}
//                 <div className="flex-1 min-w-0 ">
//                   <p className="text-xs font-black  text-gray-900  truncate">{item.name}</p>
//                   {Object.entries(item.selectedOptions || {}).map(([k, v]) => (
//                     <p key={k} className="text-[10px] text-gray-400 font-medium">{k}: {v}</p>
//                   ))}
//                   <p className="text-xs font-black text-blue-800 mt-1">
//                     ${(Number(item.price) * item.quantity).toFixed(2)}
//                   </p>
//                   <div className="flex items-center gap-2 mt-2">
//                     <button onClick={() => updateCartQty(item.cartKey, -1)}
//                       className="w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition">
//                       <Minus className="h-3 w-3" />
//                     </button>
//                     <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
//                     <button onClick={() => updateCartQty(item.cartKey, 1)}
//                       className="w-6 h-6 rounded-full bg-gray-200 hover:bg-green-100 hover:text-green-700 flex items-center justify-center transition">
//                       <Plus className="h-3 w-3" />
//                     </button>
//                     <button onClick={() => removeCartItem(item.cartKey)}
//                       className="ml-auto text-gray-300 hover:text-red-500 transition">
//                       <X className="h-3.5 w-3.5" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* footer */}
//         {cartItems.length > 0 && (
//           <div className="border-t border-gray-100 px-6 py-5 space-y-3">
//             <div className="flex justify-between items-center">
//               <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total</span>
//               <span className="text-xl font-black text-gray-900">${cartTotal.toFixed(2)}</span>
//             </div>
//             {/* ✅ Fixed: just navigate to 'cart' view — cartItems live in ShopContext */}
//             {/* <button
//               onClick={() => { setShowCart(false); setView('cart'); }}
//               className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-2xl
//                          text-sm flex items-center justify-center gap-2 transition shadow-lg"
//             >
//               Checkout
//               <ArrowRight className="h-4 w-4" />
//             </button> */}
//             <button
//               onClick={() => setShowCart(false)}
//               className="w-full text-xs text-gray-400 hover:text-blue-400 font-semibold py-1 transition rounded-lg flex items-center justify-center gap-1 bg-blue-800 border border-gray-00 hover:border-gray-400"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ── TOP BAR ── */}
//       <div className="w-full bg-gray-200 px-6 py-4 border-b border-gray-300 flex items-center justify-between">
//         <button
//           onClick={() => setView('shop-home')}
//           className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 text-xs font-semibold transition"
//         >
//           <ChevronLeft className="h-4 w-4" />
//           <span>Back to Directory</span>
//         </button>
//         <button
//           onClick={() => setShowCart(true)}
//           className="relative flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
//         >
//           <ShoppingCart className="h-5 w-5" />
//           {cartItemCount > 0 && (
//             <span className="absolute -top-1.5 -right-1.5 bg-blue-800 text-white text-[9px]
//                              font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
//               {cartItemCount}
//             </span>
//           )}
//         </button>
//       </div>

//       {/* ══ ZOOM PREVIEW ═══════════════════════════════════════════════════════ */}
//       {isHovering && !showCart && (
//         <div
//           className="fixed z-50 pointer-events-none rounded-2xl border-2 border-indigo-400 shadow-2xl overflow-hidden"
//           style={{
//             left:               'calc(55% + 16px)',
//             top:                mousePageY - PREVIEW_SIZE / 2,
//             width:              PREVIEW_SIZE,
//             height:             PREVIEW_SIZE,
//             backgroundImage:    `url(${product.image})`,
//             backgroundRepeat:   'no-repeat',
//             backgroundSize:     `${ZOOM_SCALE * PREVIEW_SIZE}px ${ZOOM_SCALE * PREVIEW_SIZE}px`,
//             backgroundPosition: `${previewBg.x}px ${previewBg.y}px`,
//           }}
//         >
//           <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.18)' }} />
//           <span className="absolute top-3 right-3 bg-indigo-600/90 backdrop-blur text-white
//                            text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
//             {ZOOM_SCALE}× Zoom
//           </span>
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <div className="w-3 h-3 rounded-full border-2 border-white/60 bg-white/20" />
//           </div>
//         </div>
//       )}

//       {/* ── MAIN CONTENT ── */}
//       <div className="w-full flex flex-col lg:flex-row min-h-[calc(100vh-56px)]">

//         {/* LEFT — image */}
//         <div className="w-full lg:w-[55%] bg-white border-b lg:border-b-0 lg:border-r border-gray-200
//                         flex items-center justify-center p-6 lg:p-10">
//           <div
//             ref={imgWrapRef}
//             className="relative w-full select-none cursor-crosshair"
//             style={{ maxHeight: 'calc(100vh - 120px)' }}
//             onMouseEnter={() => setIsHovering(true)}
//             onMouseLeave={() => setIsHovering(false)}
//             onMouseMove={handleMouseMove}
//           >
//             <img
//               ref={imgElRef}
//               src={product.image}
//               alt={product.name}
//               className="w-full h-full object-contain rounded-2xl"
//               style={{ maxHeight: 'calc(100vh - 120px)' }}
//               draggable={false}
//             />
//             <span
//               className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center  gap-1.5
//                          bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full
//                          pointer-events-none transition-opacity duration-300 whitespace-nowrap"
//               style={{ opacity: isHovering ? 0 : 1 }}
//             >
//               <ZoomIn className="h-3 w-3" />
//               Hover to zoom
//             </span>
//             {isHovering && (
//               <div
//                 className="absolute pointer-events-none rounded-lg"
//                 style={{
//                   width: LENS_SIZE, height: LENS_SIZE,
//                   left: lensPos.x, top: lensPos.y,
//                   border: '2px solid rgba(99,102,241,0.9)',
//                   boxShadow: '0 0 0 1px rgba(99,102,241,0.3), 0 4px 20px rgba(99,102,241,0.2)',
//                   background: 'rgba(99,102,241,0.06)',
//                   transition: 'none',
//                 }}
//               />
//             )}
//           </div>
//         </div>

//         {/* RIGHT — product info */}
//         <div className="w-full lg:w-[45%] bg-white flex flex-col justify-between p-8 lg:p-12 overflow-y-auto">
//           <div className="space-y-10">

//             <span className="text-[10px] uppercase tracking-widest font-extrabold text-white bg-blue-500
//                              px-3.5 py-1 shadow-md shadow-blue-800 rounded-md inline-block">
//               {product.category}
//             </span>

//             <div>
//               <h1 className="text-4xl font-black text-gray-900 leading-tight">{product.name}</h1>
//               <p className="text-3xl font-black text-gray-800 mt-2">${Number(product.price || 0).toFixed(2)}</p>
//             </div>

//             <div className="h-px bg-gray-100 w-full" />

//             <p className="text-gray-800 text-sm  text-left  whitespace-pre-line">
//               {product.description ||
//                 'This is a standard frontend design description mock view. This product represents verified, highly responsive layout scaling options configured specifically within React framework properties.'}
//             </p>

//             {/* VARIANT SELECTORS */}
//             {hasVariants && (
//               <div className="space-y-10">
//                 {product.variants.map((variant) => (
//                   <div key={variant.label}>
//                     <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
//                       {variant.label}
//                       {selectedOptions[variant.label] && (
//                         <span className="ml-2 text-indigo-600 normal-case font-semibold tracking-normal">
//                           — {selectedOptions[variant.label]}
//                         </span>
//                       )}
//                     </p>
//                     <div className="flex flex-wrap gap-2">
//                       {variant.options.map((option) => {
//                         const isSelected     = selectedOptions[variant.label] === option;
//                         const isColorVariant = variant.label.toLowerCase().includes('color') ||
//                                                variant.label.toLowerCase().includes('colour');
//                         const colorHex = colorMap[option.toLowerCase()];

//                         if (isColorVariant && colorHex) {
//                           return (
//                             <button key={option} type="button"
//                               onClick={() => handleSelect(variant.label, option)} title={option}
//                               className={`w-9 h-9 rounded-full border-2 transition-all ${
//                                 isSelected ? 'border-indigo-600 scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
//                               }`}
//                               style={{ backgroundColor: colorHex }}
//                             />
//                           );
//                         }
//                         return (
//                           <button key={option} type="button"
//                             onClick={() => handleSelect(variant.label, option)}
//                             className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all ${
//                               isSelected
//                                 ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
//                                 : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-400 hover:text-indigo-600'
//                             }`}
//                           >
//                             {option}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 ))}
//                 {!allSelected && (
//                   <p className="text-[11px] text-amber-500 font-semibold">
//                     ⚠ Please select all options before adding to bag.
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* QUANTITY + ADD TO CART */}
//           <div className="mt-10 space-y-4">
//             <div className="flex items-center gap-3">
//               <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Qty</span>
//               <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//                 <button
//                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                   className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100
//                              text-gray-600 hover:text-gray-900 transition border-r border-gray-200"
//                 >
//                   <Minus className="h-3.5 w-3.5" />
//                 </button>
//                 <span className="w-12 text-center text-sm font-black text-gray-900">{quantity}</span>
//                 <button
//                   onClick={() => setQuantity((q) => q + 1)}
//                   className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100
//                              text-gray-600 hover:text-gray-900 transition border-l border-gray-200"
//                 >
//                   <Plus className="h-3.5 w-3.5" />
//                 </button>
//               </div>
//               <span className="text-xs text-gray-400 font-medium">
//                 Subtotal:{' '}
//                 <span className="text-gray-700 font-black">
//                   ${(Number(product.price || 0) * quantity).toFixed(2)}
//                 </span>
//               </span>
//             </div>

//             <div className="flex gap-3">
//               <button
//                 onClick={handleAddToCart}
//                 disabled={!allSelected}
//                 className={`flex-1 font-bold py-4 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 transition shadow-md ${
//                   !allSelected
//                     ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                     : 'bg-green-800 hover:bg-green-700 text-white'
//                 }`}
//               >
//                 <ShoppingCart className="h-5 w-5" />
//                 Add to Bag
//               </button>

//               {cartItems.length > 0 && (
//                 <button
//                   onClick={() => setShowCart(true)}
//                   className="relative flex items-center justify-center px-5 py-4 rounded-2xl
//                              border-2 border-blue-600 text-blue-600 hover:bg-blue-50
//                              font-bold text-sm transition shadow-sm flex-shrink-0"
//                 >
//                   <ShoppingCart className="h-5 w-5" />
//                   <span className="absolute -top-2 -right-2 bg-blue-800 text-white text-[9px]
//                                    font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
//                     {cartItemCount}
//                   </span>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* FOOTER */}
//       <footer className="w-full mt-auto  border-t ">
//         </footer>
//     </div>
//   );
// }













import React, { useState, useContext, useRef, useCallback } from 'react';
import { ShopContext } from '../../context/ShopContext';
import {
  ChevronLeft, ShoppingCart, CheckCircle2, ZoomIn, Plus, Minus,
  X, Package, Shield, Truck, RefreshCw, ChevronRight, ChevronDown,
  GitBranch, Image as ImageIcon
} from 'lucide-react';

const ZOOM_SCALE   = 2.2;
const LENS_SIZE    = 180;
const PREVIEW_SIZE = 420;

const COLOR_MAP = {
  red:'#ef4444',blue:'#3b82f6',green:'#22c55e',black:'#1a1a1a',white:'#f8fafc',
  yellow:'#eab308',purple:'#a855f7',pink:'#ec4899',orange:'#f97316',gray:'#6b7280',
  grey:'#6b7280',navy:'#1e3a8a',brown:'#92400e',beige:'#d4b483',teal:'#14b8a6',
  gold:'#f59e0b',silver:'#94a3b8',rose:'#fb7185',cyan:'#06b6d4',lime:'#84cc16',
};

// ─────────────────────────────────────────────────────────────────────────────
export default function ProductDetail({ productId, setView }) {
  const { products, addToCart } = useContext(ShopContext);
  const product = products.find(p => p.id === productId);

  // ── which model is active (parent=null, child=index)
  const [activeModelIdx, setActiveModelIdx] = useState(null); // null = parent

  // ── derive active model data
  const activeModel = activeModelIdx === null
    ? product
    : product?.childModels?.[activeModelIdx];

  // ── gallery
  const allImages  = activeModel?.images?.length ? activeModel.images : (activeModel?.image ? [activeModel.image] : []);
  const [activeImg, setActiveImg] = useState(0);

  // reset active image when model changes
  const switchModel = (idx) => { setActiveModelIdx(idx); setActiveImg(0); setSelectedOptions({}); };

  // ── zoom
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos,    setLensPos]    = useState({ x:0, y:0 });
  const [previewBg,  setPreviewBg]  = useState({ x:0, y:0 });
  const [mousePageY, setMousePageY] = useState(0);
  const imgWrapRef = useRef(null);

  const handleMouseMove = useCallback(e => {
    const wrap = imgWrapRef.current;
    if (!wrap) return;
    const rect   = wrap.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const half   = LENS_SIZE / 2;
    const lensX  = Math.max(0, Math.min(mouseX - half, rect.width  - LENS_SIZE));
    const lensY  = Math.max(0, Math.min(mouseY - half, rect.height - LENS_SIZE));
    setLensPos({ x:lensX, y:lensY });
    setPreviewBg({
      x: -((lensX+half)/rect.width  * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE/2),
      y: -((lensY+half)/rect.height * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE/2),
    });
    setMousePageY(e.clientY + window.scrollY);
  }, []);

  // ── variant selection
  const [selectedOptions, setSelectedOptions] = useState({});
  const handleSelect = (label, option) =>
    setSelectedOptions(prev => ({ ...prev, [label]: option }));

  // ── resolve price + stock from selected combo
  const getActiveVariantData = () => {
    if (!activeModel) return { price:0, stock:null };
    const vars = activeModel.variants || [];
    const allSelected = vars.every(v => selectedOptions[v.label]);
    if (!allSelected || !activeModel.variantPricing)
      return { price: Number(activeModel.price||0), stock: activeModel.stock??null };
    const comboKey = vars.map(v => `${v.label}:${selectedOptions[v.label]}`).join('|');
    const entry    = activeModel.variantPricing[comboKey];
    if (entry) return { price: Number(entry.price||activeModel.price), stock: entry.stock??null };
    return { price: Number(activeModel.price||0), stock: activeModel.stock??null };
  };
  const { price: activePrice, stock: activeStock } = getActiveVariantData();

  const hasVariants  = (activeModel?.variants||[]).length > 0;
  const allSelected  = !hasVariants || (activeModel?.variants||[]).every(v => selectedOptions[v.label]);
  const isOutOfStock = activeStock !== null && activeStock <= 0;
  const lowStock     = activeStock !== null && activeStock > 0 && activeStock <= 5;

  // ── cart
  const [quantity,      setQuantity]    = useState(1);
  const [showCart,      setShowCart]    = useState(false);
  const [cartItems,     setCartItems]   = useState([]);
  const [toast,         setToast]       = useState(false);
  const [toastMsg,      setToastMsg]    = useState('');
  const toastTimer = useRef(null);

  const handleAddToCart = () => {
    if (!allSelected || isOutOfStock || !activeModel) return;
    const item = { ...product, ...activeModel, selectedOptions, price: activePrice };
    addToCart(item);
    setCartItems(prev => {
      const key = `${activeModelIdx}|${JSON.stringify(selectedOptions)}`;
      const existing = prev.find(it => it._cartKey && it._cartKey === key);
      if (existing) return prev.map(it => it._cartKey===key ? { ...it, quantity: it.quantity+quantity } : it);
      return [...prev, { ...item, quantity, _cartKey: key, _uid: Date.now() }];
    });
    setToastMsg(`${activeModel.name} × ${quantity} added!`);
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 3000);
    setShowCart(true);
  };

  const updateQty  = (uid, d) => setCartItems(prev => prev.map(it => it._uid===uid ? { ...it, quantity:it.quantity+d } : it).filter(it => it.quantity>0));
  const removeItem = (uid)    => setCartItems(prev => prev.filter(it => it._uid!==uid));

  const cartTotal     = cartItems.reduce((s,it) => s + Number(it.price)*it.quantity, 0);
  const cartItemCount = cartItems.reduce((s,it) => s + it.quantity, 0);

  const getOptionPriceRange = (label, option) => {
    if (!activeModel?.variantPricing) return null;
    const keys   = Object.keys(activeModel.variantPricing).filter(k => k.includes(`${label}:${option}`));
    if (!keys.length) return null;
    const prices = keys.map(k => Number(activeModel.variantPricing[k].price));
    const mn = Math.min(...prices), mx = Math.max(...prices);
    return mn===mx ? `$${mn.toFixed(0)}` : `$${mn.toFixed(0)}–$${mx.toFixed(0)}`;
  };

  if (!product) return (
    <div className="flex items-center justify-center min-h-screen" style={{ background:'#080810' }}>
      <p style={{ color:'rgba(232,232,240,0.4)' }}>Product not found.</p>
    </div>
  );

  const hasChildren = product.childModels?.length > 0;
  const currentImg  = allImages[activeImg] || product.image || '';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .pd-root { font-family:'DM Sans',sans-serif; }
        .pd-head { font-family:'Syne',sans-serif; }
        .opt-pill { transition:all 0.18s cubic-bezier(.4,0,.2,1); }
        .opt-pill:hover { transform:translateY(-1px); }
        .btn-glow:not(:disabled):hover { box-shadow:0 0 28px rgba(99,216,180,0.3); }
        .model-tab { transition:all 0.2s; }
        @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        .toast-in  { animation:slideUp 0.38s cubic-bezier(.16,1,.3,1) forwards; }
        .img-in    { animation:fadeIn 0.4s ease forwards; }
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px}
      `}</style>

      <div className="pd-root w-full min-h-screen flex flex-col" style={{ background:'#080810', color:'#e8e8f0' }}>

        {/* ── TOAST ────────────────────────────────────────────────────────── */}
        {toast && (
          <div className="fixed top-5 left-1/2 z-[200] toast-in" style={{ transform:'translateX(-50%)' }}>
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
              style={{ background:'linear-gradient(135deg,#1a2f26,#0f1f1a)', border:'1px solid rgba(99,216,180,0.3)' }}>
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color:'#63d8b4' }} />
              <span className="text-sm font-semibold" style={{ color:'#e0f7f0' }}>{toastMsg}</span>
              <button onClick={() => setToast(false)} className="ml-1 opacity-40 hover:opacity-100 transition">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ── CART PANEL ───────────────────────────────────────────────────── */}
        {showCart && (
          <div className="fixed inset-0 z-[80]"
            style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)' }}
            onClick={() => setShowCart(false)} />
        )}
        <div className="fixed top-0 right-0 h-full z-[90] flex flex-col"
          style={{
            width:380, maxWidth:'95vw',
            background:'#0d0d1a',
            borderLeft:'1px solid rgba(255,255,255,0.07)',
            transform: showCart ? 'translateX(0)' : 'translateX(110%)',
            transition:'transform 0.4s cubic-bezier(.16,1,.3,1)',
          }}>
          <div className="flex items-center justify-between px-6 py-5"
            style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-4 w-4" style={{ color:'#63d8b4' }} />
              <span className="pd-head font-bold text-sm">Your Bag</span>
              {cartItemCount>0 && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
                  style={{ background:'rgba(99,216,180,0.15)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.3)' }}>
                  {cartItemCount}
                </span>
              )}
            </div>
            <button onClick={() => setShowCart(false)} className="opacity-40 hover:opacity-100 transition">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {cartItems.length===0
              ? <div className="flex flex-col items-center justify-center h-full gap-4 opacity-25">
                  <Package className="h-10 w-10" />
                  <p className="text-sm font-medium">Empty bag</p>
                </div>
              : cartItems.map(item => (
                <div key={item._uid} className="flex gap-3 p-3 rounded-2xl"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  {item.image && (
                    <img src={item.images?.[0]||item.image} alt={item.name}
                      className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                      style={{ border:'1px solid rgba(255,255,255,0.08)' }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{item.name}</p>
                    {Object.entries(item.selectedOptions||{}).map(([k,v]) => (
                      <p key={k} className="text-[10px] opacity-40">{k}: {v}</p>
                    ))}
                    <p className="text-xs font-black mt-1" style={{ color:'#63d8b4' }}>
                      ${(Number(item.price)*item.quantity).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item._uid,-1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background:'rgba(255,255,255,0.08)' }}>
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item._uid,+1)}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background:'rgba(255,255,255,0.08)' }}>
                        <Plus className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeItem(item._uid)} className="ml-auto opacity-30 hover:opacity-100 transition">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          {cartItems.length>0 && (
            <div className="px-5 py-5 space-y-3" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex justify-between items-center">
                <span className="text-xs opacity-50 uppercase tracking-widest font-semibold">Total</span>
                <span className="pd-head text-2xl font-bold">${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => setShowCart(false)}
                className="w-full py-3 rounded-xl text-sm font-semibold transition"
                style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* ── TOPBAR ───────────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
          style={{ background:'rgba(8,8,16,0.85)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setView('shop-home')}
            className="flex items-center gap-2 text-xs font-semibold opacity-50 hover:opacity-100 transition group">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <span className="pd-head text-xs font-bold tracking-widest uppercase opacity-25">{product.category}</span>
          <button onClick={() => setShowCart(true)}
            className="relative text-sm opacity-70 hover:opacity-100 transition">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount>0 && (
              <span className="absolute -top-2 -right-2 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background:'#63d8b4', color:'#080810' }}>
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>

        {/* ── ZOOM PREVIEW ─────────────────────────────────────────────────── */}
        {isHovering && !showCart && currentImg && (
          <div className="fixed z-50 pointer-events-none rounded-2xl overflow-hidden"
            style={{
              left:'calc(50% + 20px)', top: mousePageY - PREVIEW_SIZE/2,
              width:PREVIEW_SIZE, height:PREVIEW_SIZE,
              backgroundImage:`url(${currentImg})`,
              backgroundRepeat:'no-repeat',
              backgroundSize:`${ZOOM_SCALE*PREVIEW_SIZE}px ${ZOOM_SCALE*PREVIEW_SIZE}px`,
              backgroundPosition:`${previewBg.x}px ${previewBg.y}px`,
              border:'1px solid rgba(99,216,180,0.3)',
              boxShadow:'0 30px 80px rgba(0,0,0,0.8)',
            }}>
            <div className="absolute inset-0" style={{ boxShadow:'inset 0 0 60px rgba(0,0,0,0.3)' }} />
            <span className="absolute top-3 right-3 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest"
              style={{ background:'rgba(99,216,180,0.2)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.3)', backdropFilter:'blur(8px)' }}>
              {ZOOM_SCALE}× zoom
            </span>
          </div>
        )}

        {/* ── MAIN LAYOUT ──────────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col lg:flex-row">

          {/* LEFT — image area */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-start p-6 lg:p-12 gap-4"
            style={{ background:'linear-gradient(145deg,#0c0c18,#080810)', borderRight:'1px solid rgba(255,255,255,0.05)' }}>

            {/* Main image with zoom */}
            <div ref={imgWrapRef}
              className="relative w-full max-w-md cursor-crosshair select-none"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}>
              <div className="rounded-3xl overflow-hidden"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', aspectRatio:'1/1' }}>
                {currentImg
                  ? <img src={currentImg} alt={activeModel?.name||product.name}
                      key={currentImg}
                      className="w-full h-full object-contain p-6 img-in"
                      draggable={false}
                      style={{ maxHeight:'calc(100vh - 260px)' }} />
                  : <div className="w-full h-full flex items-center justify-center opacity-20">
                      <ImageIcon className="h-16 w-16" />
                    </div>}
              </div>
              {!isHovering && currentImg && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap"
                  style={{ background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', fontSize:'10px', fontWeight:600 }}>
                  <ZoomIn className="h-3 w-3" /> Hover to zoom
                </div>
              )}
              {isHovering && (
                <div className="absolute pointer-events-none rounded-xl"
                  style={{
                    width:LENS_SIZE, height:LENS_SIZE,
                    left:lensPos.x, top:lensPos.y,
                    border:'2px solid rgba(99,216,180,0.8)',
                    background:'rgba(99,216,180,0.05)',
                    boxShadow:'0 0 20px rgba(99,216,180,0.15)',
                  }} />
              )}
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 flex-wrap justify-center max-w-md">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition"
                    style={{
                      border: activeImg===i ? '2px solid #63d8b4' : '1px solid rgba(255,255,255,0.08)',
                      opacity: activeImg===i ? 1 : 0.55,
                      transform: activeImg===i ? 'scale(1.05)' : 'scale(1)',
                    }}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — info */}
          <div className="w-full lg:w-1/2 overflow-y-auto px-8 lg:px-14 py-10 flex flex-col gap-7">

            {/* Category */}
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg w-fit"
              style={{ background:'rgba(99,216,180,0.1)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.2)' }}>
              {product.category}
            </span>

            {/* ── MODEL SWITCHER (if child models exist) ── */}
            {hasChildren && (
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color:'rgba(232,232,240,0.3)' }}>
                  <GitBranch className="inline h-3 w-3 mr-1.5 opacity-60" />
                  Select Model
                </p>
                <div className="flex flex-wrap gap-2">
                  {/* parent tab */}
                  <button onClick={() => switchModel(null)}
                    className="model-tab flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                    style={activeModelIdx===null
                      ? { background:'rgba(99,216,180,0.15)', color:'#63d8b4', border:'1.5px solid rgba(99,216,180,0.6)' }
                      : { background:'rgba(255,255,255,0.04)', color:'rgba(232,232,240,0.5)', border:'1px solid rgba(255,255,255,0.08)' }}>
                    <Package className="h-3.5 w-3.5" />
                    {product.name}
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md ml-0.5"
                      style={{ background:'rgba(99,216,180,0.12)', color:'#63d8b4' }}>
                      ${Number(product.price||0).toFixed(0)}
                    </span>
                  </button>
                  {/* child tabs */}
                  {product.childModels.map((cm, i) => (
                    <button key={i} onClick={() => switchModel(i)}
                      className="model-tab flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
                      style={activeModelIdx===i
                        ? { background:'rgba(167,139,250,0.15)', color:'#a78bfa', border:'1.5px solid rgba(167,139,250,0.6)' }
                        : { background:'rgba(255,255,255,0.04)', color:'rgba(232,232,240,0.5)', border:'1px solid rgba(255,255,255,0.08)' }}>
                      <GitBranch className="h-3.5 w-3.5" />
                      {cm.name || `Model ${i+1}`}
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md ml-0.5"
                        style={{ background:'rgba(167,139,250,0.12)', color:'#a78bfa' }}>
                        ${Number(cm.price||0).toFixed(0)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Name + price */}
            <div>
              <h1 className="pd-head font-extrabold leading-[1.1]"
                style={{ fontSize:'clamp(1.6rem,3.5vw,2.6rem)' }}>
                {activeModel?.name || product.name}
              </h1>
              <div className="flex items-baseline gap-3 mt-3">
                <span className="pd-head font-bold"
                  style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)', color: activeModelIdx===null ? '#63d8b4' : '#a78bfa' }}>
                  ${activePrice.toFixed(2)}
                </span>
                {allSelected && activeStock !== null && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    isOutOfStock ? 'text-red-400 bg-red-400/10 border border-red-400/20'
                    : lowStock   ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                    :              'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
                  }`}>
                    {isOutOfStock ? 'Out of stock' : lowStock ? `Only ${activeStock} left` : `${activeStock} in stock`}
                  </span>
                )}
              </div>
            </div>

            <div style={{ height:'1px', background:'rgba(255,255,255,0.06)' }} />

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color:'rgba(232,232,240,0.6)' }}>
              {activeModel?.description || 'Premium product with exceptional quality.'}
            </p>

            {/* Variants */}
            {hasVariants && (
              <div className="space-y-5">
                {(activeModel?.variants||[]).map(variant => {
                  const isColor = variant.label.toLowerCase().includes('color')||variant.label.toLowerCase().includes('colour');
                  return (
                    <div key={variant.label}>
                      <div className="flex items-center gap-2 mb-3">
                        <p className="text-[11px] font-bold uppercase tracking-widest"
                          style={{ color:'rgba(232,232,240,0.35)' }}>{variant.label}</p>
                        {selectedOptions[variant.label] && (
                          <span className="text-[11px] font-semibold"
                            style={{ color: activeModelIdx===null ? '#63d8b4' : '#a78bfa' }}>
                            — {selectedOptions[variant.label]}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map(option => {
                          const isSel      = selectedOptions[variant.label]===option;
                          const colorHex   = COLOR_MAP[option.toLowerCase()];
                          const priceRange = getOptionPriceRange(variant.label, option);
                          const accent     = activeModelIdx===null ? '#63d8b4' : '#a78bfa';

                          if (isColor && colorHex) return (
                            <button key={option} onClick={() => handleSelect(variant.label,option)} title={option}
                              className="opt-pill w-10 h-10 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor:colorHex,
                                border: isSel ? `3px solid ${accent}` : '2px solid rgba(255,255,255,0.1)',
                                boxShadow: isSel ? `0 0 0 2px #080810, 0 0 0 4px ${accent}` : 'none',
                                transform: isSel ? 'scale(1.12)' : 'scale(1)',
                              }} />
                          );
                          return (
                            <button key={option} onClick={() => handleSelect(variant.label,option)}
                              className="opt-pill flex flex-col items-center px-4 py-2.5 rounded-xl text-xs font-bold"
                              style={{
                                background: isSel ? `${accent}1a` : 'rgba(255,255,255,0.04)',
                                border: isSel ? `1.5px solid ${accent}aa` : '1.5px solid rgba(255,255,255,0.08)',
                                color: isSel ? accent : 'rgba(232,232,240,0.65)',
                                boxShadow: isSel ? `0 0 14px ${accent}22` : 'none',
                              }}>
                              <span>{option}</span>
                              {priceRange && <span className="text-[9px] mt-0.5 opacity-55">{priceRange}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {!allSelected && (
                  <p className="text-[11px] font-semibold" style={{ color:'#fbbf24', opacity:.7 }}>
                    ⚠ Select all options to see final price
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-bold uppercase tracking-widest opacity-35">Qty</span>
              <div className="flex items-center rounded-xl overflow-hidden"
                style={{ border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.03)' }}>
                <button onClick={() => setQuantity(q => Math.max(1,q-1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-white/5 transition">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-12 text-center text-sm font-black">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-white/5 transition">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="text-xs opacity-45">
                Subtotal: <span className="font-black opacity-100 text-white">${(activePrice*quantity).toFixed(2)}</span>
              </span>
            </div>

            {/* Add to cart */}
            <div className="flex gap-3">
              <button onClick={handleAddToCart} disabled={!allSelected||isOutOfStock}
                className="btn-glow flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold transition-all"
                style={!allSelected||isOutOfStock
                  ? { background:'rgba(255,255,255,0.04)', color:'rgba(232,232,240,0.2)', cursor:'not-allowed' }
                  : activeModelIdx===null
                    ? { background:'linear-gradient(135deg,#1a4a3a,#0f3028)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.3)' }
                    : { background:'linear-gradient(135deg,#2a1a4a,#1a0f35)', color:'#a78bfa', border:'1px solid rgba(167,139,250,0.3)' }}>
                <ShoppingCart className="h-5 w-5" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
              </button>
              {cartItemCount>0 && (
                <button onClick={() => setShowCart(true)}
                  className="relative px-5 rounded-2xl flex items-center justify-center transition"
                  style={{ border:'1px solid rgba(99,216,180,0.3)', color:'#63d8b4', background:'rgba(99,216,180,0.05)' }}>
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-2 -right-2 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background:'#63d8b4', color:'#080810' }}>
                    {cartItemCount}
                  </span>
                </button>
              )}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              {[
                { icon:Shield,    text:'Secure Payment' },
                { icon:Truck,     text:'Fast Shipping'  },
                { icon:RefreshCw, text:'Easy Returns'   },
              ].map(({ icon:Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-2 py-3 rounded-xl text-center"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                  <Icon className="h-4 w-4 opacity-30" />
                  <span className="text-[10px] font-semibold opacity-30">{text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
