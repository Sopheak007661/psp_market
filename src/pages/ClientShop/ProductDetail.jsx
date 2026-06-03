// import React, { useState, useContext, useRef, useCallback } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import {
//   ChevronLeft, ShoppingCart, CheckCircle2, ZoomIn, Plus, Minus,
//   X, Package, Shield, Truck, RefreshCw, ChevronRight, ChevronDown,
//   GitBranch, Image as ImageIcon
// } from 'lucide-react';

// const ZOOM_SCALE   = 2.2;
// const LENS_SIZE    = 180;
// const PREVIEW_SIZE = 420;

// const COLOR_MAP = {
//   red:'#ef4444',blue:'#3b82f6',green:'#22c55e',black:'#1a1a1a',white:'#f8fafc',
//   yellow:'#eab308',purple:'#a855f7',pink:'#ec4899',orange:'#f97316',gray:'#6b7280',
//   grey:'#6b7280',navy:'#1e3a8a',brown:'#92400e',beige:'#d4b483',teal:'#14b8a6',
//   gold:'#f59e0b',silver:'#94a3b8',rose:'#fb7185',cyan:'#06b6d4',lime:'#84cc16',
// };

// // ─────────────────────────────────────────────────────────────────────────────
// export default function ProductDetail({ productId, setView }) {
//   const { products, addToCart } = useContext(ShopContext);
//   const product = products.find(p => p.id === productId);

//   // ── which model is active (parent=null, child=index)
//   const [activeModelIdx, setActiveModelIdx] = useState(null); // null = parent

//   // ── derive active model data
//   const activeModel = activeModelIdx === null
//     ? product
//     : product?.childModels?.[activeModelIdx];

//   // ── gallery
//   const allImages  = activeModel?.images?.length ? activeModel.images : (activeModel?.image ? [activeModel.image] : []);
//   const [activeImg, setActiveImg] = useState(0);

//   // reset active image when model changes
//   const switchModel = (idx) => { setActiveModelIdx(idx); setActiveImg(0); setSelectedOptions({}); };

//   // ── zoom
//   const [isHovering, setIsHovering] = useState(false);
//   const [lensPos,    setLensPos]    = useState({ x:0, y:0 });
//   const [previewBg,  setPreviewBg]  = useState({ x:0, y:0 });
//   const [mousePageY, setMousePageY] = useState(0);
//   const imgWrapRef = useRef(null);

//   const handleMouseMove = useCallback(e => {
//     const wrap = imgWrapRef.current;
//     if (!wrap) return;
//     const rect   = wrap.getBoundingClientRect();
//     const mouseX = e.clientX - rect.left;
//     const mouseY = e.clientY - rect.top;
//     const half   = LENS_SIZE / 2;
//     const lensX  = Math.max(0, Math.min(mouseX - half, rect.width  - LENS_SIZE));
//     const lensY  = Math.max(0, Math.min(mouseY - half, rect.height - LENS_SIZE));
//     setLensPos({ x:lensX, y:lensY });
//     setPreviewBg({
//       x: -((lensX+half)/rect.width  * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE/2),
//       y: -((lensY+half)/rect.height * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE/2),
//     });
//     setMousePageY(e.clientY + window.scrollY);
//   }, []);

//   // ── variant selection
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const handleSelect = (label, option) =>
//     setSelectedOptions(prev => ({ ...prev, [label]: option }));

//   // ── resolve price + stock from selected combo
//   const getActiveVariantData = () => {
//     if (!activeModel) return { price:0, stock:null };
//     const vars = activeModel.variants || [];
//     const allSelected = vars.every(v => selectedOptions[v.label]);
//     if (!allSelected || !activeModel.variantPricing)
//       return { price: Number(activeModel.price||0), stock: activeModel.stock??null };
//     const comboKey = vars.map(v => `${v.label}:${selectedOptions[v.label]}`).join('|');
//     const entry    = activeModel.variantPricing[comboKey];
//     if (entry) return { price: Number(entry.price||activeModel.price), stock: entry.stock??null };
//     return { price: Number(activeModel.price||0), stock: activeModel.stock??null };
//   };
//   const { price: activePrice, stock: activeStock } = getActiveVariantData();

//   const hasVariants  = (activeModel?.variants||[]).length > 0;
//   const allSelected  = !hasVariants || (activeModel?.variants||[]).every(v => selectedOptions[v.label]);
//   const isOutOfStock = activeStock !== null && activeStock <= 0;
//   const lowStock     = activeStock !== null && activeStock > 0 && activeStock <= 5;

//   // ── cart
//   const [quantity,      setQuantity]    = useState(1);
//   const [showCart,      setShowCart]    = useState(false);
//   const [cartItems,     setCartItems]   = useState([]);
//   const [toast,         setToast]       = useState(false);
//   const [toastMsg,      setToastMsg]    = useState('');
//   const toastTimer = useRef(null);

//   const handleAddToCart = () => {
//     if (!allSelected || isOutOfStock || !activeModel) return;
//     const item = { ...product, ...activeModel, selectedOptions, price: activePrice };
//     addToCart(item);
//     setCartItems(prev => {
//       const key = `${activeModelIdx}|${JSON.stringify(selectedOptions)}`;
//       const existing = prev.find(it => it._cartKey && it._cartKey === key);
//       if (existing) return prev.map(it => it._cartKey===key ? { ...it, quantity: it.quantity+quantity } : it);
//       return [...prev, { ...item, quantity, _cartKey: key, _uid: Date.now() }];
//     });
//     setToastMsg(`${activeModel.name} × ${quantity} added!`);
//     setToast(true);
//     clearTimeout(toastTimer.current);
//     toastTimer.current = setTimeout(() => setToast(false), 3000);
//     setShowCart(true);
//   };

//   const updateQty  = (uid, d) => setCartItems(prev => prev.map(it => it._uid===uid ? { ...it, quantity:it.quantity+d } : it).filter(it => it.quantity>0));
//   const removeItem = (uid)    => setCartItems(prev => prev.filter(it => it._uid!==uid));

//   const cartTotal     = cartItems.reduce((s,it) => s + Number(it.price)*it.quantity, 0);
//   const cartItemCount = cartItems.reduce((s,it) => s + it.quantity, 0);

//   const getOptionPriceRange = (label, option) => {
//     if (!activeModel?.variantPricing) return null;
//     const keys   = Object.keys(activeModel.variantPricing).filter(k => k.includes(`${label}:${option}`));
//     if (!keys.length) return null;
//     const prices = keys.map(k => Number(activeModel.variantPricing[k].price));
//     const mn = Math.min(...prices), mx = Math.max(...prices);
//     return mn===mx ? `$${mn.toFixed(0)}` : `$${mn.toFixed(0)}–$${mx.toFixed(0)}`;
//   };

//   if (!product) return (
//     <div className="flex items-center justify-center min-h-screen" style={{ background:'#080810' }}>
//       <p style={{ color:'rgba(232,232,240,0.4)' }}>Product not found.</p>
//     </div>
//   );

//   const hasChildren = product.childModels?.length > 0;
//   const currentImg  = allImages[activeImg] || product.image || '';

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
//         .pd-root { font-family:'DM Sans',sans-serif; }
//         .pd-head { font-family:'Syne',sans-serif; }
//         .opt-pill { transition:all 0.18s cubic-bezier(.4,0,.2,1); }
//         .opt-pill:hover { transform:translateY(-1px); }
//         .btn-glow:not(:disabled):hover { box-shadow:0 0 28px rgba(99,216,180,0.3); }
//         .model-tab { transition:all 0.2s; }
//         @keyframes slideUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
//         @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
//         .toast-in  { animation:slideUp 0.38s cubic-bezier(.16,1,.3,1) forwards; }
//         .img-in    { animation:fadeIn 0.4s ease forwards; }
//         ::-webkit-scrollbar{width:4px;height:4px}
//         ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:99px}
//       `}</style>

//       <div className="pd-root left-0 right-0 top-20 shadow-xl shadow-blue-800 absolute min-h-400 flex flex-col" style={{ background:'#0e2f8a', color:'#e8e8f0' }}>

//         {/* ── TOAST ────────────────────────────────────────────────────────── */}
//         {toast && (
//           <div className="fixed top-5 left-1/2 z-[200] toast-in" style={{ transform:'translateX(-50%)' }}>
//             <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
//               style={{ background:'linear-gradient(135deg,#1a2f26,#0f1f1a)', border:'1px solid rgba(99,216,180,0.3)' }}>
//               <CheckCircle2 className="h-4 w-4 flex-shrink-0" style={{ color:'#63d8b4' }} />
//               <span className="text-sm font-semibold" style={{ color:'#e0f7f0' }}>{toastMsg}</span>
//               <button onClick={() => setToast(false)} className="ml-1 opacity-40 hover:opacity-100 transition">
//                 <X className="h-3.5 w-3.5" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* ── CART PANEL ───────────────────────────────────────────────────── */}
//         {showCart && (
//           <div className="fixed inset-0 z-[80]"
//             style={{ background:'rgba(0, 0, 0, 0.6)', backdropFilter:'blur(6px)' }}
//             onClick={() => setShowCart(false)} />
//         )}
//         <div className="fixed top-0 right-0 h-full z-[90] flex flex-col"
//           style={{
//             width:380, maxWidth:'95vw',
//             background:'#132aa8',
//             borderLeft:'1px solid rgba(255,255,255,0.07)',
//             transform: showCart ? 'translateX(0)' : 'translateX(110%)',
//             transition:'transform 0.4s cubic-bezier(.16,1,.3,1)',
//           }}>
//           <div className="flex items-center justify-between px-6 py-5"
//             style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
//             <div className="flex items-center gap-3">
//               <ShoppingCart className="h-4 w-4" style={{ color:'#63d8b4' }} />
//               <span className="pd-head font-bold text-sm">Your Bag</span>
//               {cartItemCount>0 && (
//                 <span className="text-[10px] font-black px-2 py-0.5 rounded-full"
//                   style={{ background:'rgba(99,216,180,0.15)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.3)' }}>
//                   {cartItemCount}
//                 </span>
//               )}
//             </div>
//             <button onClick={() => setShowCart(false)} className="opacity-40 hover:opacity-100 transition">
//               <X className="h-4 w-4" />
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
//             {cartItems.length===0
//               ? <div className="flex flex-col items-center justify-center h-full gap-4 opacity-25">
//                   <Package className="h-10 w-10" />
//                   <p className="text-sm font-medium">Empty bag</p>
//                 </div>
//               : cartItems.map(item => (
//                 <div key={item._uid} className="flex gap-3 p-3 rounded-2xl"
//                   style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
//                   {item.image && (
//                     <img src={item.images?.[0]||item.image} alt={item.name}
//                       className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
//                       style={{ border:'1px solid rgba(255,255,255,0.08)' }} />
//                   )}
//                   <div className="flex-1 min-w-0">
//                     <p className="text-xs font-bold truncate">{item.name}</p>
//                     {Object.entries(item.selectedOptions||{}).map(([k,v]) => (
//                       <p key={k} className="text-[10px] opacity-40">{k}: {v}</p>
//                     ))}
//                     <p className="text-xs font-black mt-1" style={{ color:'#63d8b4' }}>
//                       ${(Number(item.price)*item.quantity).toFixed(2)}
//                     </p>
//                     <div className="flex items-center gap-2 mt-2">
//                       <button onClick={() => updateQty(item._uid,-1)}
//                         className="w-6 h-6 rounded-full flex items-center justify-center"
//                         style={{ background:'rgba(255,255,255,0.08)' }}>
//                         <Minus className="h-3 w-3" />
//                       </button>
//                       <span className="text-xs font-black w-5 text-center">{item.quantity}</span>
//                       <button onClick={() => updateQty(item._uid,+1)}
//                         className="w-6 h-6 rounded-full flex items-center justify-center"
//                         style={{ background:'rgba(255,255,255,0.08)' }}>
//                         <Plus className="h-3 w-3" />
//                       </button>
//                       <button onClick={() => removeItem(item._uid)} className="ml-auto opacity-30 hover:opacity-100 transition">
//                         <X className="h-3.5 w-3.5" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             }
//           </div>
//           {cartItems.length>0 && (
//             <div className="px-5 py-5 space-y-3" style={{ borderTop:'1px solid rgba(255,255,255,0.07)' }}>
//               <div className="flex justify-between items-center">
//                 <span className="text-xs opacity-50 uppercase tracking-widest font-semibold">Total</span>
//                 <span className="pd-head text-2xl font-bold">${cartTotal.toFixed(2)}</span>
//               </div>
//               <button onClick={() => setShowCart(false)}
//                 className="w-full py-3 rounded-xl text-sm font-semibold transition"
//                 style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
//                 Continue Shopping
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── TOPBAR ───────────────────────────────────────────────────────── */}
//         <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
//           style={{ background:'rgb(20, 62, 202)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
//           <button onClick={() => setView('shop-home')}
//             className="flex items-center gap-2 text-xl font-semibold opacity-50 hover:opacity-100 transition group text-black">
//             <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform text-red-800" />
//             Back
//           </button>
//           <span className="pd-head text-md font-bold tracking-normal uppercase opacity-50 text-white">{product.category}</span>
//           <button onClick={() => setShowCart(true)}
//             className="relative text-xl opacity-70 hover:opacity-100 transition">
//             <ShoppingCart className="h-5 w-5 text-white" />
//             {cartItemCount>0 && (
//               <span className="absolute -top-2 -right-2 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center"
//                 style={{ background:'#63d8b4', color:'#080810' }}>
//                 {cartItemCount}
//               </span>
//             )}
//           </button>
//         </nav>

//         {/* ── ZOOM PREVIEW ─────────────────────────────────────────────────── */}
//         {isHovering && !showCart && currentImg && (
//           <div className="fixed z-50 pointer-events-none rounded-2xl overflow-hidden"
//             style={{
//               left:'calc(50% + 20px)', top: mousePageY - PREVIEW_SIZE/2,
//               width:PREVIEW_SIZE, height:PREVIEW_SIZE,
//               backgroundImage:`url(${currentImg})`,
//               backgroundRepeat:'no-repeat',
//               backgroundSize:`${ZOOM_SCALE*PREVIEW_SIZE}px ${ZOOM_SCALE*PREVIEW_SIZE}px`,
//               backgroundPosition:`${previewBg.x}px ${previewBg.y}px`,
//               border:'1px solid rgba(99,216,180,0.3)',
//               boxShadow:'0 30px 80px rgba(0,0,0,0.8)',
//             }}>
//             <div className="absolute inset-0" style={{ boxShadow:'inset 0 0 60px rgba(0,0,0,0.3)' }} />
//             <span className="absolute top-3 right-3 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-widest"
//               style={{ background:'rgba(99,216,180,0.2)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.3)', backdropFilter:'blur(8px)' }}>
//               {ZOOM_SCALE}× zoom
//             </span>
//           </div>
//         )}

//         {/* ── MAIN LAYOUT ──────────────────────────────────────────────────── */}
//         <div className="flex-1 flex flex-col lg:flex-row">

//           {/* LEFT — image area */}
//           <div className="w-full lg:w-1/2 flex flex-col items-center justify-start p-6 lg:p-12 gap-4"
//             style={{ background:'linear-gradient(215deg,gray,white)', borderRight:'1px solid rgba(14, 102, 129, 0.99)' ,boxShadow:'0 0 10px blue',borderRadius:'20px'}}>

//             {/* Main image with zoom */}
//             <div ref={imgWrapRef}
//               className="relative w-full max-w-md cursor-crosshair select-none"
//               onMouseEnter={() => setIsHovering(true)}
//               onMouseLeave={() => setIsHovering(false)}
//               onMouseMove={handleMouseMove}>
//               <div className="rounded-3xl overflow-hidden"
//                 style={{ background:'rgba(230, 235, 245, 0.9)', border:'1px solid rgba(255,255,255,0.07)', aspectRatio:'1/1', }}>
//                 {currentImg
//                   ? <img src={currentImg} alt={activeModel?.name||product.name}
//                       key={currentImg}
//                       className="w-full h-full object-contain p-6 img-in"
//                       draggable={false}
//                       style={{ maxHeight:'calc(100vh - 260px)' }} />
//                   : <div className="w-full h-full flex items-center justify-center opacity-20">
//                       <ImageIcon className="h-16 w-16" />
//                     </div>}
//               </div>
//               {!isHovering && currentImg && (
//                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap"
//                   style={{ background:'rgb(9, 45, 204)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.4)', fontSize:'10px', fontWeight:600 }}>
//                   <ZoomIn className="h-3 w-3 text-white" /> Hover to zoom
//                 </div>
//               )}
//               {isHovering && (
//                 <div className="absolute pointer-events-none rounded-xl"
//                   style={{
//                     width:LENS_SIZE, height:LENS_SIZE,
//                     left:lensPos.x, top:lensPos.y,
//                     border:'2px solid rgba(99,216,180,0.8)',
//                     background:'rgba(99, 101, 216, 0.05)',
//                     boxShadow:'0 0 20px rgba(99,216,180,0.15)',
//                   }} />
//               )}
//             </div>

//             {/* Thumbnail strip */}
//             {allImages.length > 1 && (
//               <div className="flex gap-2 flex-wrap justify-center max-w-md">
//                 {allImages.map((img, i) => (
//                   <button key={i} onClick={() => setActiveImg(i)}
//                     className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 transition"
//                     style={{
//                       border: activeImg===i ? '2px solid #63d8b4' : '1px solid rgba(255,255,255,0.08)',
//                       opacity: activeImg===i ? 1 : 0.55,
//                       transform: activeImg===i ? 'scale(1.05)' : 'scale(1)',
//                     }}>
//                     <img src={img} alt="" className="w-full h-full object-cover" />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* RIGHT — info */}
//           <div className="w-full lg:w-1/2 overflow-y-auto px-8 lg:px-14 py-10 flex flex-col gap-7">

//             {/* Category */}
//             <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg w-fit"
//               style={{ background:'rgba(99,216,180,0.1)', color:'#e0e1e9', border:'1px solid rgba(99,216,180,0.2)' }}>
//               {product.category}
//             </span>

//             {/* ── MODEL SWITCHER (if child models exist) ── */}
//             {hasChildren && (
//               <div>
//                 <p className="text-[10px] font-bold uppercase tracking-normal mb-3"
//                   style={{ color:'rgba(232,232,240,0.3)' }}>
//                   <GitBranch className="inline h-3 w-3 mr-1.5 opacity-60" />
//                   Select Model
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {/* parent tab */}
//                   <button onClick={() => switchModel(null)}
//                     className="model-tab flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
//                     style={activeModelIdx===null
//                       ? { background:'rgba(99,216,180,0.15)', color:'#63d8b4', border:'1.5px solid rgba(99,216,180,0.6)' }
//                       : { background:'rgba(255,255,255,0.04)', color:'rgba(232,232,240,0.5)', border:'1px solid rgba(0, 12, 51, 0.08)' }}>
//                     <Package className="h-3.5 w-3.5 " />
//                     {product.name}
//                     <span className="text-[9px] px-1.5 py-0.5 rounded-md ml-0.5"
//                       style={{ background:'rgba(99,216,180,0.12)', color:'#63d8b4' }}>
//                       ${Number(product.price||0).toFixed(0)}
//                     </span>
//                   </button>
//                   {/* child tabs */}
//                   {product.childModels.map((cm, i) => (
//                     <button key={i} onClick={() => switchModel(i)}
//                       className="model-tab flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold"
//                       style={activeModelIdx===i
//                         ? { background:'rgba(167,139,250,0.15)', color:'#a78bfa', border:'1.5px solid rgba(167,139,250,0.6)' }
//                         : { background:'rgba(255,255,255,0.04)', color:'rgba(232,232,240,0.5)', border:'1px solid rgba(255,255,255,0.08)' }}>
//                       <GitBranch className="h-3.5 w-3.5" />
//                       {cm.name || `Model ${i+1}`}
//                       <span className="text-[9px] px-1.5 py-0.5 rounded-md ml-0.5"
//                         style={{ background:'rgba(167,139,250,0.12)', color:'#a78bfa' }}>
//                         ${Number(cm.price||0).toFixed(0)}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Name + price */}
//             <div>
//               <h1 className="pd-head font-bold leading-[1.1]"
//                 style={{ fontSize:'clamp(1.6rem,3.5vw,2.6rem)' ,fontFamily:'senserif',color:'lightblue' }}>
//                 {activeModel?.name || product.name}
//               </h1>
//               <div className="flex items-baseline gap-3 mt-3">
//                 <span className="pd-head font-bold"
//                   style={{ fontSize:'clamp(1.4rem,2.5vw,2rem)',fontFamily:'monospace', color: activeModelIdx===null ? 'gray' : '#a78bfa' }}>
//                   ${activePrice.toFixed(2)}
//                 </span>
//                 {allSelected && activeStock !== null && (
//                   <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
//                     isOutOfStock ? 'text-red-400 bg-red-400/10 border border-red-400/20'
//                     : lowStock   ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
//                     :              'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20'
//                   }`}>
//                     {isOutOfStock ? 'Out of stock' : lowStock ? `Only ${activeStock} left` : `${activeStock} in stock`}
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div style={{ height:'1px', background:'rgba(255,255,255,0.06)' }} />

//             {/* Description */}
//             <p className="text-sm leading-relaxed" style={{ color:'rgba(232,232,240,0.6)' }}>
//               {activeModel?.description || 'Premium product with exceptional quality.'}
//             </p>

//             {/* Variants */}
//             {hasVariants && (
//               <div className="space-y-5">
//                 {(activeModel?.variants||[]).map(variant => {
//                   const isColor = variant.label.toLowerCase().includes('color')||variant.label.toLowerCase().includes('colour');
//                   return (
//                     <div key={variant.label}>
//                       <div className="flex items-center gap-2 mb-3">
//                         <p className="text-[14px] font-bold uppercase tracking-widest "
//                           style={{ color:'rgb(194, 194, 194)' }}>{variant.label}</p>
//                         {selectedOptions[variant.label] && (
//                           <span className="text-[11px] font-semibold"
//                             style={{ color: activeModelIdx===null ? '#109e1c' : '#8e89ca' }}>
//                             — {selectedOptions[variant.label]}
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {variant.options.map(option => {
//                           const isSel      = selectedOptions[variant.label]===option;
//                           const colorHex   = COLOR_MAP[option.toLowerCase()];
//                           const priceRange = getOptionPriceRange(variant.label, option);
//                           const accent     = activeModelIdx===null ? '#4c7fca' : '#0a30ac';

//                           if (isColor && colorHex) return (
//                             <button key={option} onClick={() => handleSelect(variant.label,option)} title={option}
//                               className="opt-pill w-10 h-10 rounded-full flex-shrink-0"
//                               style={{
//                                 backgroundColor:colorHex,
//                                 border: isSel ? `3px solid ${accent}` : '2px solid rgba(255,255,255,0.1)',
//                                 boxShadow: isSel ? `0 0 0 2px #080810, 0 0 0 4px ${accent}` : 'none',
//                                 transform: isSel ? 'scale(1.12)' : 'scale(1)',
//                               }} />
//                           );
//                           return (
//                             <button key={option} onClick={() => handleSelect(variant.label,option)}
//                               className="opt-pill flex flex-col items-center px-4 py-2.5 rounded-xl text-xs font-bold"
//                               style={{
//                                 background: isSel ? `${accent}1a` : 'rgba(255,255,255,0.04)',
//                                 border: isSel ? `1.5px solid ${accent}aa` : '1.5px solid rgba(255,255,255,0.08)',
//                                 color: isSel ? accent : 'rgba(232,232,240,0.65)',
//                                 boxShadow: isSel ? `0 0 14px ${accent}22` : 'none',
//                               }}>
//                               <span>{option}</span>
//                               {priceRange && <span className="text-[9px] mt-0.5 opacity-55">{priceRange}</span>}
//                             </button>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   );
//                 })}
//                 {!allSelected && (
//                   <p className="text-[11px] font-semibold" style={{ color:'#fbbf24', opacity:.7 }}>
//                     ⚠ Select all options to see final price
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Quantity */}
//             <div className="flex items-center gap-4">
//               <span className="text-[14px] font-bold uppercase tracking-widest opacity-35">Qty</span>
//               <div className="flex items-center rounded-xl overflow-hidden"
//                 style={{ border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.03)' }}>
//                 <button onClick={() => setQuantity(q => Math.max(1,q-1))}
//                   className="w-11 h-11 flex items-center justify-center hover:bg-white/5 transition">
//                   <Minus className="h-3.5 w-3.5" />
//                 </button>
//                 <span className="w-12 text-center text-sm font-black">{quantity}</span>
//                 <button onClick={() => setQuantity(q => q+1)}
//                   className="w-11 h-11 flex items-center justify-center hover:bg-white/5 transition">
//                   <Plus className="h-3.5 w-3.5" />
//                 </button>
//               </div>
//               <span className="text-md opacity-45">
//                 Subtotal: <span className="font-black opacity-100 text-white">${(activePrice*quantity).toFixed(2)}</span>
//               </span>
//             </div>

//             {/* Add to cart */}
//             <div className="flex gap-3">
//               <button onClick={handleAddToCart} disabled={!allSelected||isOutOfStock}
//                 className="btn-glow flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl  text-sm font-bold transition-all"
//                 style={!allSelected||isOutOfStock
//                   ? { background:'rgba(8, 23, 150, 0.04)', color:'rgba(46, 46, 66, 0.2)', cursor:'not-allowed' }
//                   : activeModelIdx===null
//                     ? { background:'linear-gradient(135deg,#1a4a3a,#0f3028)', color:'#1216d8', border:'1px solid rgba(234, 239, 245, 0.33)' }
//                     : { background:'linear-gradient(135deg,#2a1a4a,#1a0f35)', color:'#a78bfa', border:'1px solid rgba(167,139,250,0.3)' }}>
//                 <ShoppingCart className="h-5 w-5" />
//                 {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
//               </button>
//               {cartItemCount>0 && (
//                 <button onClick={() => setShowCart(true)}
//                   className="relative px-5 rounded-2xl flex items-center justify-center transition"
//                   style={{ border:'1px solid rgba(99,216,180,0.3)', color:'#63d8b4', background:'rgba(99,216,180,0.05)' }}>
//                   <ShoppingCart className="h-5 w-5" />
//                   <span className="absolute -top-2 -right-2 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center"
//                     style={{ background:'#63d8b4', color:'#080810' }}>
//                     {cartItemCount}
//                   </span>
//                 </button>
//               )}
//             </div>

//             {/* Trust badges */}
//             <div className="grid grid-cols-3 gap-3 pt-1">
//               {[
//                 { icon:Shield,    text:'Secure Payment' },
//                 { icon:Truck,     text:'Fast Shipping'  },
//                 { icon:RefreshCw, text:'Easy Returns'   },
//               ].map(({ icon:Icon, text }) => (
//                 <div key={text} className="flex flex-col items-center gap-2 py-3 rounded-xl text-center"
//                   style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
//                   <Icon className="h-4 w-4 opacity-30" />
//                   <span className="text-[10px] font-semibold opacity-30">{text}</span>
//                 </div>
//               ))}
//             </div>

//           </div>
//         </div>
//       </div>
//       <div className='min-h-[900px]'>
        
//       </div>
//     </>
//   );
// }















import React, { useState, useContext, useRef, useCallback } from 'react';
import { ShopContext } from '../../context/ShopContext';
import {
  ChevronLeft, ShoppingCart, CheckCircle2, ZoomIn, Plus, Minus,
  X, Package, Shield, Truck, RefreshCw, GitBranch, Image as ImageIcon
} from 'lucide-react';

const ZOOM_SCALE   = 2.2;
const LENS_SIZE    = 180;
const PREVIEW_SIZE = 420;

const COLOR_MAP = {
  red:'#ef4444', blue:'#3b82f6', green:'#22c55e', black:'#1a1a1a', white:'#ffffff',
  yellow:'#eab308', purple:'#a855f7', pink:'#ec4899', orange:'#f97316', gray:'#6b7280',
  grey:'#6b7280', navy:'#1e3a8a', brown:'#92400e', beige:'#d4b483', teal:'#14b8a6',
  gold:'#f59e0b', silver:'#94a3b8', rose:'#fb7185', cyan:'#06b6d4', lime:'#84cc16',
};

export default function ProductDetail({ productId, setView }) {
  const { products, addToCart } = useContext(ShopContext);
  const product = products.find(p => p.id === productId);

  // Active Model State
  const [activeModelIdx, setActiveModelIdx] = useState(null);

  const activeModel = activeModelIdx === null
    ? product
    : product?.childModels?.[activeModelIdx];

  // Gallery Image State
  const allImages = activeModel?.images?.length ? activeModel.images : (activeModel?.image ? [activeModel.image] : []);
  const [activeImg, setActiveImg] = useState(0);

  // Variant Selection State
  const [selectedOptions, setSelectedOptions] = useState({});

  const switchModel = (idx) => { 
    setActiveModelIdx(idx); 
    setActiveImg(0); 
    setSelectedOptions({}); 
  };

  // Magnifying Zoom Hooks
  const [isHovering, setIsHovering] = useState(false);
  const [lensPos, setLensPos] = useState({ x:0, y:0 });
  const [previewBg, setPreviewBg] = useState({ x:0, y:0 });
  const [mousePageY, setMousePageY] = useState(0);
  const imgWrapRef = useRef(null);

  const handleMouseMove = useCallback(e => {
    const wrap = imgWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const half = LENS_SIZE / 2;
    const lensX = Math.max(0, Math.min(mouseX - half, rect.width - LENS_SIZE));
    const lensY = Math.max(0, Math.min(mouseY - half, rect.height - LENS_SIZE));
    
    setLensPos({ x:lensX, y:lensY });
    setPreviewBg({
      x: -((lensX + half) / rect.width * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE / 2),
      y: -((lensY + half) / rect.height * ZOOM_SCALE * PREVIEW_SIZE - PREVIEW_SIZE / 2),
    });
    setMousePageY(e.clientY + window.scrollY);
  }, []);

  const handleSelect = (label, option) =>
    setSelectedOptions(prev => ({ ...prev, [label]: option }));

  // Pricing & Stock Logic
  const getActiveVariantData = () => {
    if (!activeModel) return { price: 0, stock: null };
    const vars = activeModel.variants || [];
    const allSelected = vars.every(v => selectedOptions[v.label]);
    
    if (!allSelected || !activeModel.variantPricing)
      return { price: Number(activeModel.price || 0), stock: activeModel.stock ?? null };
    
    const comboKey = vars.map(v => `${v.label}:${selectedOptions[v.label]}`).join('|');
    const entry = activeModel.variantPricing[comboKey];
    
    if (entry) return { price: Number(entry.price || activeModel.price), stock: entry.stock ?? null };
    return { price: Number(activeModel.price || 0), stock: activeModel.stock ?? null };
  };

  const { price: activePrice, stock: activeStock } = getActiveVariantData();
  const hasVariants = (activeModel?.variants || []).length > 0;
  const allSelected = !hasVariants || (activeModel?.variants || []).every(v => selectedOptions[v.label]);
  const isOutOfStock = activeStock !== null && activeStock <= 0;
  const lowStock = activeStock !== null && activeStock > 0 && activeStock <= 5;

  // Cart Functions
  const [quantity, setQuantity] = useState(1);
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const toastTimer = useRef(null);

  const handleAddToCart = () => {
    if (!allSelected || isOutOfStock || !activeModel) return;
    const item = { ...product, ...activeModel, selectedOptions, price: activePrice };
    addToCart(item);
    
    setCartItems(prev => {
      const key = `${activeModelIdx}|${JSON.stringify(selectedOptions)}`;
      const existing = prev.find(it => it._cartKey === key);
      if (existing) return prev.map(it => it._cartKey === key ? { ...it, quantity: it.quantity + quantity } : it);
      return [...prev, { ...item, quantity, _cartKey: key, _uid: Date.now() }];
    });

    setToastMsg(`${activeModel.name} added to your bag!`);
    setToast(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(false), 3000);
    setShowCart(true);
  };

  const updateQty = (uid, delta) => setCartItems(prev => prev.map(it => it._uid === uid ? { ...it, quantity: it.quantity + delta } : it).filter(it => it.quantity > 0));
  const removeItem = (uid) => setCartItems(prev => prev.filter(it => it._uid !== uid));

  const cartTotal = cartItems.reduce((acc, it) => acc + Number(it.price) * it.quantity, 0);
  const cartItemCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);

  const getOptionPriceRange = (label, option) => {
    if (!activeModel?.variantPricing) return null;
    const keys = Object.keys(activeModel.variantPricing).filter(k => k.includes(`${label}:${option}`));
    if (!keys.length) return null;
    const prices = keys.map(k => Number(activeModel.variantPricing[k].price));
    const minPrice = Math.min(...prices), maxPrice = Math.max(...prices);
    return minPrice === maxPrice ? `$${minPrice.toFixed(0)}` : `$${minPrice.toFixed(0)}–$${maxPrice.toFixed(0)}`;
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-50 text-slate-700 p-6">
        <p className="font-medium text-sm">Product metadata payload could not be loaded.</p>
      </div>
    );
  }

  const hasChildren = product.childModels?.length > 0;
  const currentImg = allImages[activeImg] || product.image || '';

  return (
    <div className="min-h-screen bg-blue-50/60 text-slate-800 antialiased selection:bg-blue-200">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .pd-root { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes slideUp { from{transform:translateY(1rem); opacity:0} to{transform:translateY(0); opacity:1} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .toast-in { animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .img-in { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>

      <div className="pd-root max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* ── NOTIFICATION TOAST ────────────────────────────────────────── */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[200] toast-in">
            <div className="flex items-center gap-3 px-4 py-3 bg-white border border-blue-200 rounded-xl shadow-xl">
              <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <span className="text-sm font-semibold text-slate-800">{toastMsg}</span>
              <button onClick={() => setToast(false)} className="text-slate-400 hover:text-slate-600 transition ml-2">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── SIDE DRAWER SHOPPING BAG ────────────────────────────────────── */}
        {showCart && (
          <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)} />
        )}
        <div className={`fixed top-0 right-0 h-full w-full max-w-md z-[110] bg-white border-l border-blue-100 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-blue-50">
            <div className="flex items-center gap-2.5">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <h2 className="text-base font-bold tracking-tight text-slate-900">Shopping Bag</h2>
              {cartItemCount > 0 && (
                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">
                  {cartItemCount}
                </span>
              )}
            </div>
            <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-slate-600 transition">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-400">
                <Package className="h-12 w-12 stroke-[1.5]" />
                <p className="text-sm font-medium">Your shopping bag is empty</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item._uid} className="flex gap-4 p-3 bg-white border border-blue-100/80 rounded-xl shadow-sm">
                  {item.image && (
                    <img src={item.images?.[0] || item.image} alt={item.name} className="w-16 h-16 object-cover bg-blue-50/50 rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-bold truncate text-slate-800">{item.name}</h4>
                      {Object.entries(item.selectedOptions || {}).map(([key, val]) => (
                        <p key={key} className="text-xs text-slate-500">{key}: <span className="text-slate-700 font-medium">{val}</span></p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-blue-600">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-0.5 border border-slate-200">
                        <button onClick={() => updateQty(item._uid, -1)} className="p-1 text-slate-500 hover:text-slate-800 transition">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateQty(item._uid, 1)} className="p-1 text-slate-500 hover:text-slate-800 transition">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item._uid)} className="text-slate-400 hover:text-rose-500 transition self-start p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 bg-white border-t border-blue-50 space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Subtotal</span>
                <span className="text-2xl font-black text-slate-900">${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => setShowCart(false)} className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-100">
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* ── TOP UTILITY NAVIGATION BAR ──────────────────────────────────── */}
        <nav className="flex items-center justify-between mb-8 pb-4 border-b border-blue-100">
          <button onClick={() => setView('shop-home')} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition group">
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Catalog
          </button>
          <span className="text-xs font-extrabold tracking-widest uppercase text-blue-600/80 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/50">
            {product.category}
          </span>
          <button onClick={() => setShowCart(true)} className="relative p-2 text-slate-600 hover:text-blue-600 transition">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 text-[10px] font-bold bg-blue-600 text-white w-4 h-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1 ring-2 ring-white">
                {cartItemCount}
              </span>
            )}
          </button>
        </nav>

        {/* ── CENTRALIZED HOVER ZOOM MODAL PREVIEW ────────────────────────── */}
        {isHovering && !showCart && currentImg && (
          <div className="fixed z-50 pointer-events-none rounded-2xl overflow-hidden hidden lg:block border border-blue-200 shadow-2xl bg-white"
            style={{
              left: 'calc(50% + 40px)', 
              top: Math.max(80, mousePageY - PREVIEW_SIZE / 2),
              width: PREVIEW_SIZE, 
              height: PREVIEW_SIZE,
              backgroundImage: `url(${currentImg})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${ZOOM_SCALE * PREVIEW_SIZE}px ${ZOOM_SCALE * PREVIEW_SIZE}px`,
              backgroundPosition: `${previewBg.x}px ${previewBg.y}px`,
            }}>
            <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-1 bg-white/90 border border-blue-100 text-blue-600 rounded-md tracking-wider uppercase backdrop-blur-sm">
              {ZOOM_SCALE}x Magnified View
            </span>
          </div>
        )}

        {/* ── MAIN LAYOUT GRID ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT CONTAINER: Visual previews */}
          <div className="space-y-4">
            <div ref={imgWrapRef}
              className="relative aspect-square w-full max-w-xl mx-auto bg-white border border-blue-100 rounded-2xl overflow-hidden cursor-crosshair select-none flex items-center justify-center p-8 shadow-sm shadow-blue-100"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}>
              
              {currentImg ? (
                <img src={currentImg} alt={activeModel?.name || product.name} key={currentImg} className="max-h-full max-w-full object-contain img-in" draggable={false} />
              ) : (
                <div className="text-slate-300 flex flex-col items-center gap-2">
                  <ImageIcon className="h-12 w-12 stroke-[1.2]" />
                  <span className="text-xs text-slate-400">Image unserviceable</span>
                </div>
              )}

              {!isHovering && currentImg && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-100 rounded-full text-[11px] font-semibold text-slate-600 shadow-sm">
                  <ZoomIn className="h-3.5 w-3.5 text-blue-600" /> Hover artwork to inspect
                </div>
              )}

              {isHovering && (
                <div className="absolute pointer-events-none rounded-xl border-2 border-blue-500 bg-blue-500/5 hidden lg:block"
                  style={{ width: LENS_SIZE, height: LENS_SIZE, left: lensPos.x, top: lensPos.y }} />
              )}
            </div>

            {/* Thumbstrip Dynamic Row */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 flex-wrap justify-center max-w-xl mx-auto">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden bg-white p-1 border transition-all ${activeImg === i ? 'border-blue-600 scale-[1.07] ring-2 ring-blue-100' : 'border-blue-100 opacity-100 hover:opacity-120'}`}>
                    <img src={img} alt="" className="w-full h-full  rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT CONTAINER: Information Hierarchy */}
          <div className="flex flex-col space-y-6 max-w-xl mx-auto lg:mx-0 w-full">
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {activeModel?.name || product.name}
              </h1>
              
              <div className="flex items-baseline gap-4 mt-3">
                <span className="text-2xl font-black font-mono text-slate-900">
                  ${activePrice.toFixed(2)}
                </span>
                {allSelected && activeStock !== null && (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    isOutOfStock ? 'text-rose-600 bg-rose-50 border-rose-100'
                    : lowStock ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-blue-700 bg-blue-50 border-blue-100'
                  }`}>
                    {isOutOfStock ? 'Sold Out' : lowStock ? `Limited Stock (${activeStock})` : 'In Stock & Ready'}
                  </span>
                )}
              </div>
            </div>

            {/* Description Text area */}
            <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 border border-blue-100 rounded-xl shadow-sm shadow-blue-50/50">
              {activeModel?.description || 'Premium specification built with high durability parameters and responsive architecture optimizations.'}
            </p>

            {/* Configurable Variant Child-Models Switcher */}
            {hasChildren && (
              <div className="pt-1">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2.5">
                  <GitBranch className="h-3.5 w-3.5 text-blue-500" /> Build Configuration
                </label>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => switchModel(null)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${activeModelIdx === null ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white border-blue-100 text-slate-600 hover:border-blue-200'}`}>
                    <Package className="h-3.5 w-3.5" />
                    Standard Pack
                  </button>
                  {product.childModels.map((cm, i) => (
                    <button key={i} onClick={() => switchModel(i)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${activeModelIdx === i ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white border-blue-100 text-slate-600 hover:border-blue-200'}`}>
                      <GitBranch className="h-3.5 w-3.5" />
                      {cm.name || `Option ${i + 1}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product Custom Sub-options Variants */}
            {hasVariants && (
              <div className="space-y-4 pt-1">
                {(activeModel?.variants || []).map(variant => {
                  const isColor = variant.label.toLowerCase().includes('color') || variant.label.toLowerCase().includes('colour');
                  return (
                    <div key={variant.label} className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">{variant.label}</span>
                        {selectedOptions[variant.label] && (
                          <span className="text-xs font-bold text-slate-700">— Selected: {selectedOptions[variant.label]}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map(option => {
                          const isSel = selectedOptions[variant.label] === option;
                          const colorHex = COLOR_MAP[option.toLowerCase()];
                          const priceRange = getOptionPriceRange(variant.label, option);

                          if (isColor && colorHex) {
                            return (
                              <button key={option} onClick={() => handleSelect(variant.label, option)} title={option}
                                className={`w-8 h-8 rounded-full border-2 transition-transform ${isSel ? 'border-blue-600 scale-110 ring-4 ring-blue-50' : 'border-white ring-1 ring-blue-100 hover:scale-105'}`}
                                style={{ backgroundColor: colorHex }} />
                            );
                          }
                          return (
                            <button key={option} onClick={() => handleSelect(variant.label, option)}
                              className={`px-3.5 py-2 text-xs font-bold rounded-xl border transition-all text-left ${isSel ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white border-blue-100 text-slate-600 hover:border-blue-200'}`}>
                              <span>{option}</span>
                              {priceRange && <span className="block text-[10px] font-medium opacity-75 mt-0.5">{priceRange}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                {!allSelected && (
                  <p className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg w-fit">
                    * Finalize specifications above to calculate precise checkout total.
                  </p>
                )}
              </div>
            )}

            <hr className="border-blue-100 my-1" />

            {/* Quantity Controller & Summary calculations */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Quantity</span>
                <div className="flex items-center bg-white border border-blue-100 rounded-xl p-1 w-fit shadow-sm">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 transition rounded-lg hover:bg-slate-50">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-800">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 transition rounded-lg hover:bg-slate-50">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col justify-end pt-4">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Subtotal Amount</span>
                <span className="text-2xl font-black text-slate-900 font-mono">${(activePrice * quantity).toFixed(2)}</span>
              </div>
            </div>

            {/* Core Action Callouts */}
            <div className="flex gap-3 pt-1">
              <button onClick={handleAddToCart} disabled={!allSelected || isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl text-sm font-bold transition-all ${
                  !allSelected || isOutOfStock
                    ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-blue-700 shadow-md shadow-blue-100'
                }`}>
                <ShoppingCart className="h-4 w-4 stroke-[2.5]" />
                {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
              </button>
              
              {cartItemCount > 0 && (
                <button onClick={() => setShowCart(true)} className="px-4 border border-blue-200 bg-white hover:bg-blue-50 text-slate-700 rounded-xl transition flex items-center justify-center relative shadow-sm">
                  <ShoppingCart className="h-4 w-4" />
                  <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-blue-600 text-white font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white">
                    {cartItemCount}
                  </span>
                </button>
              )}
            </div>

            {/* Lower Info Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, text: 'Secure Checkout' },
                { icon: Truck,  text: 'Fast Shipping' },
                { icon: RefreshCw, text: 'Easy Returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 bg-white border border-blue-100 rounded-xl text-center sm:text-left shadow-sm shadow-blue-50/30">
                  <Icon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-slate-600 tracking-tight">{text}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
