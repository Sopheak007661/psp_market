// import React, { useContext, useState, useRef, useEffect } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import BrandLogo from '../assets/BrandLogo.png';
// import {
//   ShoppingCart, LayoutDashboard, Search, X, LogOut,
//   Menu, Moon, Sun, LogIn, User, Mail, Lock,
//   Shield, Camera, Eye, EyeOff, Copy, Check,
//   ChevronRight, UserPlus, Edit3,
// } from 'lucide-react';

// // ─── helpers ─────────────────────────────────────────────────────────────────

// function getInitials(email = '') {
//   return email.split('@')[0].slice(0, 2).toUpperCase() || 'ME';
// }

// function getAvatarGradient(email = '') {
//   const palettes = [
//     'linear-gradient(135deg,#1d4ed8,#06b6d4)',
//     'linear-gradient(135deg,#7c3aed,#ec4899)',
//     'linear-gradient(135deg,#059669,#10b981)',
//     'linear-gradient(135deg,#dc2626,#f97316)',
//     'linear-gradient(135deg,#0369a1,#6366f1)',
//     'linear-gradient(135deg,#b45309,#d97706)',
//   ];
//   return palettes[(email.charCodeAt(0) || 0) % palettes.length];
// }

// // ─── localStorage helpers ─────────────────────────────────────────────────────

// function loadAccount(email) {
//   if (!email || email === 'guest') return null;
//   try { return JSON.parse(localStorage.getItem(`psp_acct_${email}`)) || null; }
//   catch { return null; }
// }

// function saveAccount(email, data) {
//   if (!email || email === 'guest') return;
//   try { localStorage.setItem(`psp_acct_${email}`, JSON.stringify(data)); }
//   catch {}
// }

// function initOrIncrementLogin(email, role) {
//   if (!email || email === 'guest') return null;

//   const existing = loadAccount(email) || {
//     email, role,
//     loginCount: 0,
//     firstLogin: Date.now(),
//     lastLogin: null,
//     avatarDataUrl: null,
//     purchaseHistory: [],
//   };

//   const sessionKey = `psp_session_counted_${email}`;
//   const alreadyCounted = sessionStorage.getItem(sessionKey);
//   const updated = alreadyCounted
//     ? { ...existing }
//     : { ...existing, loginCount: (existing.loginCount || 0) + 1, lastLogin: Date.now() };

//   if (!alreadyCounted) {
//     sessionStorage.setItem(sessionKey, '1');
//   }

//   saveAccount(email, updated);
//   return updated;
// }

// // ═════════════════════════════════════════════════════════════════════════════
// // NAVBAR
// // ═════════════════════════════════════════════════════════════════════════════
// export default function Navbar({ setView, userRole, userEmail, handleLogout, loginKey }) {
//   const { cart, searchTerm, setSearchTerm } = useContext(ShopContext);
//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [isDarkMode,     setIsDarkMode]     = useState(false);

//   // ── mobile search state ─────────────────────────────────────────────────
//   const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
//   const mobileSearchRef = useRef(null);

//   const handleToggleDarkMode = () => {
//     const next = !isDarkMode;
//     setIsDarkMode(next);
//     document.body.style.backgroundColor = next ? '#0f172a' : '#ffffff';
//     document.body.style.color           = next ? '#f8fafc' : '#1f2937';
//   };

//   // ── account panel ───────────────────────────────────────────────────────
//   const [acctOpen,     setAcctOpen]     = useState(false);
//   const [acctData,     setAcctData]     = useState(null);
//   const [emailCopied,  setEmailCopied]  = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const acctRef   = useRef(null);
//   const fileInput = useRef(null);

//   const maskedPassword = '••••••••';

//   useEffect(() => {
//     if (!userEmail || userEmail === 'guest' || !userRole || userRole === 'guest') {
//       setAcctData(null);
//       return;
//     }
//     const data = initOrIncrementLogin(userEmail, userRole);
//     setAcctData(data);
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userEmail, userRole, loginKey]);

//   // close account dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (acctRef.current && !acctRef.current.contains(e.target)) setAcctOpen(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   // auto-focus mobile search input when opened
//   useEffect(() => {
//     if (mobileSearchOpen && mobileSearchRef.current) {
//       setTimeout(() => mobileSearchRef.current?.focus(), 50);
//     }
//   }, [mobileSearchOpen]);

//   const isGuest = !userRole || userRole === 'guest';
//   const isAdmin = userRole === 'admin';
//   const avatarUrl = acctData?.avatarDataUrl || null;

//   const copyEmail = () => {
//     navigator.clipboard?.writeText(userEmail).catch(() => {});
//     setEmailCopied(true);
//     setTimeout(() => setEmailCopied(false), 2000);
//   };

//   const handlePhotoUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith('image/')) return;
//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const dataUrl = evt.target.result;
//       const updated = { ...acctData, avatarDataUrl: dataUrl };
//       setAcctData(updated);
//       saveAccount(userEmail, updated);
//     };
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   const removePhoto = () => {
//     const updated = { ...acctData, avatarDataUrl: null };
//     setAcctData(updated);
//     saveAccount(userEmail, updated);
//   };

//   // ─────────────────────────────────────────────────────────────────────────
//   // AVATAR BUTTON
//   // ─────────────────────────────────────────────────────────────────────────
//   const AvatarButton = () => (
//     <button
//       onClick={() => setAcctOpen(o => !o)}
//       title="My Account"
//       style={{
//         width: 36, height: 36, borderRadius: '50%',
//         background: isGuest ? '#334155' : getAvatarGradient(userEmail),
//         border: acctOpen ? '2px solid #60a5fa' : '2px solid rgba(255,255,255,0.3)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         cursor: 'pointer', flexShrink: 0, padding: 0, overflow: 'hidden',
//         boxShadow: acctOpen ? '0 0 0 3px rgba(96,165,250,0.35)' : 'none',
//         transition: 'box-shadow 0.2s, border 0.2s',
//       }}
//     >
//       {avatarUrl
//         ? <img src={avatarUrl} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
//         : isGuest
//           ? <User size={16} color="#94a3b8" />
//           : <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
//               {getInitials(userEmail)}
//             </span>
//       }
//     </button>
//   );

//   // ─────────────────────────────────────────────────────────────────────────
//   // ACCOUNT DROPDOWN
//   // ─────────────────────────────────────────────────────────────────────────
//   const AccountDropdown = () => (
//     <div style={{
//       position: 'absolute', top: 'calc(100% + 10px)', right: 0,
//       width: 320, zIndex: 200,
//       background: '#fff', border: '1px solid #e2e8f0',
//       borderRadius: 20,
//       boxShadow: '0 24px 64px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.06)',
//       overflow: 'hidden',
//       animation: 'acctIn 0.2s cubic-bezier(0.16,1,0.3,1)',
//     }}>
//       <style>{`
//         @keyframes acctIn {
//           from { opacity:0; transform:translateY(-8px) scale(0.97); }
//           to   { opacity:1; transform:translateY(0) scale(1); }
//         }
//         .ap-field-label {
//           font-size:9px; font-weight:700; color:#94a3b8;
//           text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;
//         }
//         .ap-field-box {
//           display:flex; align-items:center; gap:8px;
//           background:#f8fafc; border:1px solid #e2e8f0;
//           border-radius:10px; padding:9px 12px;
//         }
//         .ap-action-btn {
//           width:100%; border:none; background:none; cursor:pointer;
//           display:flex; align-items:center; gap:10px;
//           padding:9px 12px; border-radius:10px;
//           transition:background 0.15s; text-align:left;
//         }
//         .ap-action-btn:hover { background:#f1f5f9; }
//       `}</style>

//       {isGuest ? (
//         <>
//           <div style={{ padding:'22px 18px 16px', textAlign:'center', borderBottom:'1px solid #f1f5f9' }}>
//             <div style={{ width:54, height:54, borderRadius:'50%', background:'#f1f5f9', border:'2px dashed #cbd5e1', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
//               <User size={22} color="#94a3b8" />
//             </div>
//             <p style={{ fontSize:14, fontWeight:700, color:'#1e293b', marginBottom:5 }}>Browsing as guest</p>
//             <p style={{ fontSize:11, color:'#94a3b8', lineHeight:1.6 }}>Sign in to manage your account, view orders, and unlock member deals.</p>
//           </div>
//           <div style={{ padding:'14px 14px 6px', display:'flex', flexDirection:'column', gap:8 }}>
//             <button onClick={() => { setView('login-page'); setAcctOpen(false); }}
//               style={{ width:'100%', padding:'11px 0', background:'linear-gradient(135deg,#1d4ed8,#3b82f6)', color:'#fff', fontWeight:700, fontSize:13, borderRadius:12, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
//               <LogIn size={14} /> Sign in to account
//             </button>
//             <button onClick={() => { setView('login-page'); setAcctOpen(false); }}
//               style={{ width:'100%', padding:'11px 0', background:'#f8fafc', color:'#1d4ed8', fontWeight:600, fontSize:13, borderRadius:12, border:'1px solid #e2e8f0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
//               <UserPlus size={14} /> Create free account
//             </button>
//           </div>
//           <div style={{ padding:'8px 14px 16px', display:'flex', gap:8 }}>
//             {[['🔒','Secure'],['🎁','Rewards'],['🚚','Free ship']].map(([icon,label]) => (
//               <div key={label} style={{ flex:1, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'9px 4px', textAlign:'center' }}>
//                 <div style={{ fontSize:16 }}>{icon}</div>
//                 <div style={{ fontSize:9, color:'#64748b', fontWeight:600, marginTop:3 }}>{label}</div>
//               </div>
//             ))}
//           </div>
//         </>
//       ) : (
//         <>
//           <div style={{ background:'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%)', padding:'18px 18px 16px', position:'relative' }}>
//             <button onClick={() => setAcctOpen(false)}
//               style={{ position:'absolute', top:10, right:10, background:'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.7)', padding:4, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
//               <X size={13} />
//             </button>

//             <div style={{ display:'flex', alignItems:'flex-end', gap:14, marginBottom:14 }}>
//               <div style={{ position:'relative', flexShrink:0 }}>
//                 <div style={{
//                   width:64, height:64, borderRadius:'50%', overflow:'hidden',
//                   background: avatarUrl ? 'transparent' : getAvatarGradient(userEmail),
//                   border:'3px solid rgba(255,255,255,0.35)',
//                   display:'flex', alignItems:'center', justifyContent:'center',
//                   boxShadow:'0 4px 16px rgba(31, 7, 186, 0.3)',
//                 }}>
//                   {avatarUrl
//                     ? <img src={avatarUrl} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
//                     : <span style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'0.04em' }}>{getInitials(userEmail)}</span>
//                   }
//                 </div>
//                 <button
//                   onClick={() => fileInput.current?.click()}
//                   title="Upload photo"
//                   style={{
//                     position:'absolute', bottom:-2, right:-2,
//                     width:24, height:24, borderRadius:'50%',
//                     background:'#fff', border:'2px solid #1d4ed8',
//                     display:'flex', alignItems:'center', justifyContent:'center',
//                     cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
//                     transition:'transform 0.15s',
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.transform='scale(1.15)'}
//                   onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
//                 >
//                   <Camera size={11} color="#1d4ed8" />
//                 </button>
//                 <input ref={fileInput} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoUpload} />
//               </div>

//               <div style={{ flex:1, minWidth:0 }}>
//                 <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
//                   <span style={{ fontSize:15, fontWeight:800, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>
//                     {userEmail?.split('@')[0] || 'User'}
//                   </span>
//                   {isAdmin
//                     ? <span style={{ fontSize:8, background:'#dc2626', color:'#fff', borderRadius:99, padding:'2px 7px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', flexShrink:0 }}>Admin</span>
//                     : <span style={{ fontSize:8, background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.85)', borderRadius:99, padding:'2px 7px', fontWeight:600, flexShrink:0 }}>Customer</span>
//                   }
//                 </div>
//                 <div style={{ display:'flex', gap:8 }}>
//                   <button onClick={() => fileInput.current?.click()}
//                     style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.7)', fontSize:10, fontWeight:600, padding:0, display:'flex', alignItems:'center', gap:3 }}>
//                     <Edit3 size={10} /> {avatarUrl ? 'Change photo' : 'Upload photo'}
//                   </button>
//                   {avatarUrl && (
//                     <button onClick={removePhoto}
//                       style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,100,100,0.85)', fontSize:10, fontWeight:600, padding:0 }}>
//                       Remove
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginBottom:10 }}>
//               <div className="ap-field-label" style={{ color:'rgba(255,255,255,0.5)' }}>Email address</div>
//               <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 12px' }}>
//                 <Mail size={13} color="rgba(255,255,255,0.5)" style={{ flexShrink:0 }} />
//                 <span style={{ fontSize:12, color:'#fff', fontWeight:500, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
//                   {userEmail}
//                 </span>
//                 <button onClick={copyEmail}
//                   title={emailCopied ? 'Copied!' : 'Copy email'}
//                   style={{ background:'none', border:'none', cursor:'pointer', padding:0, color: emailCopied ? '#4ade80' : 'rgba(255,255,255,0.45)', transition:'color 0.2s', display:'flex' }}>
//                   {emailCopied ? <Check size={12} /> : <Copy size={12} />}
//                 </button>
//               </div>
//             </div>

//             <div>
//               <div className="ap-field-label" style={{ color:'rgba(255,255,255,0.5)' }}>Password</div>
//               <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 12px' }}>
//                 <Lock size={13} color="rgba(255,255,255,0.5)" style={{ flexShrink:0 }} />
//                 <span style={{ fontSize:13, color:'#fff', fontWeight:500, flex:1, letterSpacing: showPassword ? 'normal' : '0.18em' }}>
//                   {showPassword ? '(hidden for security)' : maskedPassword}
//                 </span>
//                 <button onClick={() => setShowPassword(s => !s)}
//                   title={showPassword ? 'Hide' : 'Show'}
//                   style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'rgba(255,255,255,0.45)', display:'flex' }}>
//                   {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div style={{ padding:'10px 8px' }}>
//             {isAdmin && (
//               <button className="ap-action-btn" onClick={() => { setView('admin-home'); setAcctOpen(false); }}>
//                 <div style={{ width:30, height:30, borderRadius:9, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
//                   <LayoutDashboard size={14} color="#dc2626" />
//                 </div>
//                 <span style={{ fontSize:13, fontWeight:600, color:'#dc2626', flex:1 }}>Admin Dashboard</span>
//                 <ChevronRight size={13} color="#94a3b8" />
//               </button>
//             )}

//             <button className="ap-action-btn" onClick={() => fileInput.current?.click()}>
//               <div style={{ width:30, height:30, borderRadius:9, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
//                 <Camera size={14} color="#1d4ed8" />
//               </div>
//               <div style={{ flex:1 }}>
//                 <div style={{ fontSize:13, fontWeight:600, color:'#334155' }}>
//                   {avatarUrl ? 'Change profile photo' : 'Upload profile photo'}
//                 </div>
//                 <div style={{ fontSize:10, color:'#94a3b8' }}>JPG, PNG, GIF supported</div>
//               </div>
//               <ChevronRight size={13} color="#94a3b8" />
//             </button>
//           </div>

//           <div style={{ padding:'0 8px 10px' }}>
//             <button
//               onClick={() => { if (handleLogout) handleLogout(); setAcctOpen(false); }}
//               style={{
//                 width:'100%', padding:'10px 0',
//                 background:'#fff5f5', border:'1px solid #fecaca',
//                 color:'#dc2626', fontWeight:700, fontSize:13,
//                 borderRadius:11, cursor:'pointer',
//                 display:'flex', alignItems:'center', justifyContent:'center', gap:7,
//               }}
//             >
//               <LogOut size={14} /> Sign out
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );

//   // ═══════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════════════════
//   return (
//     <section className='pb-20'>
//       <style>{`
//         @keyframes searchExpand {
//           from { opacity: 0; transform: translateY(-6px) scaleY(0.92); }
//           to   { opacity: 1; transform: translateY(0) scaleY(1); }
//         }
//         .mobile-search-bar {
//           animation: searchExpand 0.22s cubic-bezier(0.16,1,0.3,1) both;
//           transform-origin: top center;
//         }
//         .search-icon-btn {
//           position: relative;
//           width: 36px; height: 36px;
//           border-radius: 10px;
//           border: none;
//           display: flex; align-items: center; justify-content: center;
//           cursor: pointer;
//           transition: background 0.15s, transform 0.15s;
//         }
//         .search-icon-btn:active { transform: scale(0.92); }
//       `}</style>

//       <nav className={`fixed top-0 left-0 right-0 z-50 border-b shadow-sm transition-colors duration-300
//         ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-800 border-gray-100'}`}
//       >
//         {/* ── MAIN NAV ROW ── */}
//         <div className='px-4 md:px-8 h-16 flex justify-between items-center gap-3'>

//           {/* Brand Logo */}
//           <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => setView('shop-home')}>
//             <img src={BrandLogo} alt="logo" className='w-[100px] h-[100px] rounded-[100px] p-5' />
//           </div>

//           {/* Desktop Search — hidden on mobile */}
//           <div className="hidden md:flex flex-1 max-w-md mx-4">
//             <div className="relative w-full">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-4 w-4 text-blue-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchTerm}
//                 onChange={(e) => { setSearchTerm(e.target.value); setView('shop-home'); }}
//                 className={`w-full pl-10 pr-10 py-1.5 border text-sm outline-none transition-all duration-200 block rounded
//                   ${isDarkMode
//                     ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600'
//                     : 'bg-blue-800 border-gray-200 text-gray-900 focus:bg-white'}`}
//               />
//               {searchTerm && (
//                 <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition">
//                   <X className="h-4 w-4" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Right actions */}
//           <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">

//             {/* ── MOBILE SEARCH ICON — visible only on mobile ── */}
//             <button
//               className="md:hidden search-icon-btn"
//               onClick={() => {
//                 setMobileSearchOpen(o => !o);
//                 setIsSettingsOpen(false);
//               }}
//               aria-label="Search"
//               style={{
//                 background: mobileSearchOpen
//                   ? 'rgba(255,255,255,0.25)'
//                   : 'rgba(255,255,255,0.12)',
//               }}
//             >
//               {mobileSearchOpen
//                 ? <X className="h-4 w-4 text-white" />
//                 : <Search className="h-4 w-4 text-white" />
//               }
//               {/* pulse dot when search has a term and bar is closed */}
//               {searchTerm && !mobileSearchOpen && (
//                 <span style={{
//                   position:'absolute', top:5, right:5,
//                   width:7, height:7, borderRadius:'50%',
//                   background:'#4ade80',
//                   border:'1.5px solid #1d4ed8',
//                 }} />
//               )}
//             </button>

//             {/* Cart */}
//             <button onClick={() => setView('shop-cart')} className="relative p-2 text-green-400 hover:text-white transition">
//               <ShoppingCart className="h-5 w-5" />
//               {totalItems > 0 && (
//                 <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
//                   {totalItems}
//                 </span>
//               )}
//             </button>

//             {/* Admin shortcut */}
//             {userRole === 'admin' && (
//               <button onClick={() => setView('admin-home')} className="hidden md:flex items-center space-x-1.5 bg-green-800 text-white rounded-full text-xl font-semibold hover:bg-blue-500 transition">
//                 <LayoutDashboard className="h-4 w-4" />
//               </button>
//             )}

//             {/* Account avatar + dropdown */}
//             <div ref={acctRef} style={{ position:'relative' }}>
//               <AvatarButton />
//               {acctOpen && <AccountDropdown />}
//             </div>

//             {/* Settings menu */}
//             <div className="relative">
//               <button
//                 onClick={() => { setIsSettingsOpen(!isSettingsOpen); setMobileSearchOpen(false); }}
//                 className="p-2 text-green-400 hover:text-white transition focus:outline-none"
//                 title="Menu"
//               >
//                 <Menu className={`h-5 w-5 transition-transform duration-200 ${isSettingsOpen ? 'rotate-90' : ''}`} />
//               </button>

//               {isSettingsOpen && (
//                 <div className={`absolute right-0 mt-2 w-60 border rounded-lg shadow-xl py-2 z-50 transition-colors duration-200
//                   ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>

//                   <div className="px-4 py-1.5 text-xs font-semibold text-gray-900 uppercase tracking-wider bg-blue-800 rounded-md">Menu</div>
//                   <button onClick={() => { setView('shop-home'); setIsSettingsOpen(false); }} className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>Home</span></button>
//                   <button onClick={() => { setView('shop-home'); setIsSettingsOpen(false); }} className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>Shop</span></button>
//                   <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>Help center</span></button>

//                   <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

//                   <div className="px-4 py-1.5 text-xs font-semibold text-gray-900 uppercase tracking-wider bg-blue-800 rounded-md">Sell on PSP</div>
//                   <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>For brands</span></button>
//                   <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>For creators</span></button>
//                   <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>Build your store</span></button>

//                   <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

//                   <div className="px-4 py-1.5 text-xs font-semibold text-gray-900 uppercase tracking-wider bg-blue-800 rounded-md">Follow us</div>
//                   <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
//                     <span><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a></span>
//                   </button>
//                   <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
//                     <span><a href="https://www.instagram.com/sopheak123.pheak/" target="_blank" rel="noopener noreferrer">Instagram</a></span>
//                   </button>
//                   <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
//                     <span><a href="https://x.com/PSopheak23887" target="_blank" rel="noopener noreferrer">X (Twitter)</a></span>
//                   </button>

//                   <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

//                   <div className="px-4 py-1.5 text-xs font-semibold text-gray-900 uppercase tracking-wider bg-blue-800 rounded-md">Preferences</div>
//                   <button onClick={handleToggleDarkMode} className={`w-full flex items-center justify-between px-4 py-2 text-sm transition text-left ${isDarkMode ? 'hover:bg-slate-700 text-gray-200' : 'hover:bg-blue-400 text-gray-700'}`}>
//                     <div className="flex items-center gap-2">
//                       {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
//                       <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
//                     </div>
//                   </button>

//                   <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

//                   {!userRole || userRole === 'guest' ? (
//                     <button onClick={() => { setView('login-page'); setIsSettingsOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50/10 font-semibold transition text-left">
//                       <LogIn className="h-4 w-4" /><span>Login to account</span>
//                     </button>
//                   ) : (
//                     <button onClick={() => { if (handleLogout) handleLogout(); setIsSettingsOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50/10 font-semibold transition text-left">
//                       <LogOut className="h-4 w-4" /><span>Sign out ({userRole})</span>
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>

//           </div>
//         </div>

//         {/* ── MOBILE SEARCH BAR — drops below nav when open ── */}
//         {mobileSearchOpen && (
//           <div
//             className="md:hidden mobile-search-bar px-3 pb-3"
//             style={{
//               borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.15)',
//               background: isDarkMode ? '#1e293b' : '#1d4ed8',
//             }}
//           >
//             <div style={{
//               marginTop: 10,
//               display: 'flex', alignItems: 'center', gap: 10,
//               background: 'rgba(255,255,255,0.12)',
//               border: '1.5px solid rgba(255,255,255,0.25)',
//               borderRadius: 14,
//               padding: '0 14px',
//               backdropFilter: 'blur(8px)',
//               boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//             }}>
//               <Search size={15} color="rgba(255,255,255,0.55)" style={{ flexShrink:0 }} />
//               <input
//                 ref={mobileSearchRef}
//                 type="text"
//                 placeholder="Search products…"
//                 value={searchTerm}
//                 onChange={(e) => { setSearchTerm(e.target.value); setView('shop-home'); }}
//                 style={{
//                   flex: 1,
//                   background: 'transparent',
//                   border: 'none',
//                   outline: 'none',
//                   color: '#fff',
//                   fontSize: 14,
//                   fontWeight: 500,
//                   padding: '12px 0',
//                   caretColor: '#60a5fa',
//                 }}
//                 placeholder="Search products…"
//               />
//               {searchTerm ? (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   style={{
//                     background: 'rgba(255,255,255,0.15)',
//                     border: 'none', cursor: 'pointer',
//                     width: 24, height: 24, borderRadius: 6,
//                     display: 'flex', alignItems: 'center', justifyContent: 'center',
//                     flexShrink: 0,
//                     transition: 'background 0.15s',
//                   }}
//                 >
//                   <X size={13} color="rgba(255,255,255,0.8)" />
//                 </button>
//               ) : (
//                 <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', flexShrink:0, fontWeight:500 }}>
//                   PSP
//                 </span>
//               )}
//             </div>

//             {/* hint text */}
//             {!searchTerm && (
//               <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', textAlign:'center', marginTop:7, fontWeight:500 }}>
//                 Type to search across all products
//               </p>
//             )}
//             {searchTerm && (
//               <p style={{ fontSize:10, color:'rgba(255,255,255,0.5)', textAlign:'center', marginTop:7, fontWeight:500 }}>
//                 Showing results for <span style={{ color:'#93c5fd', fontWeight:700 }}>"{searchTerm}"</span>
//               </p>
//             )}
//           </div>
//         )}

//       </nav>
//     </section>
//   );
// }


























import React, { useContext, useState, useRef, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import BrandLogo from '../assets/BrandLogo.png';
import {
  ShoppingCart, LayoutDashboard, Search, X, LogOut,
  Menu, Moon, Sun, LogIn, User, Mail, Lock,
  Shield, Camera, Eye, EyeOff, Copy, Check,
  ChevronRight, UserPlus, Edit3,
} from 'lucide-react';

// ─── API base URL — must match App.jsx ───────────────────────────────────────
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─── helpers ─────────────────────────────────────────────────────────────────
function getInitials(email = '') {
  return email.split('@')[0].slice(0, 2).toUpperCase() || 'ME';
}

function getAvatarGradient(email = '') {
  const palettes = [
    'linear-gradient(135deg,#1d4ed8,#06b6d4)',
    'linear-gradient(135deg,#7c3aed,#ec4899)',
    'linear-gradient(135deg,#059669,#10b981)',
    'linear-gradient(135deg,#dc2626,#f97316)',
    'linear-gradient(135deg,#0369a1,#6366f1)',
    'linear-gradient(135deg,#b45309,#d97706)',
  ];
  return palettes[(email.charCodeAt(0) || 0) % palettes.length];
}

// ═════════════════════════════════════════════════════════════════════════════
// NAVBAR
// Props:
//   setView          — navigate to a view
//   userRole         — 'admin' | 'user' | 'guest' | null
//   userEmail        — logged-in email string
//   userId           — DB user id (e.g. "USR-1234567890")
//   userAvatarFromDB — avatar data URL loaded from DB on login
//   handleLogout     — logout callback
//   loginKey         — increments on each login to trigger re-fetch
// ═════════════════════════════════════════════════════════════════════════════
export default function Navbar({ setView, userRole, userEmail, userId, userAvatarFromDB, handleLogout, loginKey }) {
  const { cart, searchTerm, setSearchTerm } = useContext(ShopContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode,     setIsDarkMode]     = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef(null);

  const handleToggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.body.style.backgroundColor = next ? '#0f172a' : '#ffffff';
    document.body.style.color           = next ? '#f8fafc' : '#1f2937';
  };

  // ── account panel ───────────────────────────────────────────────────────
  const [acctOpen,     setAcctOpen]     = useState(false);
  const [avatarUrl,    setAvatarUrl]    = useState(null);
  const [emailCopied,  setEmailCopied]  = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const acctRef   = useRef(null);
  const fileInput = useRef(null);

  const maskedPassword = '••••••••';

  // Seed avatar from DB on login
  useEffect(() => {
    setAvatarUrl(userAvatarFromDB || null);
  }, [userAvatarFromDB, loginKey]);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (acctRef.current && !acctRef.current.contains(e.target)) setAcctOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      setTimeout(() => mobileSearchRef.current?.focus(), 50);
    }
  }, [mobileSearchOpen]);

  const isGuest = !userRole || userRole === 'guest';
  const isAdmin = userRole === 'admin';

  const copyEmail = () => {
    navigator.clipboard?.writeText(userEmail).catch(() => {});
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // Upload photo → save as base64 → PATCH to API
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target.result;
      setAvatarUrl(dataUrl);   // update UI immediately

      // Save to DB if we have a real userId
      if (userId) {
        setUploading(true);
        try {
          await fetch(`${API}/api/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ avatar: dataUrl }),
          });
        } catch (err) {
          console.error('Failed to save avatar:', err);
        } finally {
          setUploading(false);
        }
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removePhoto = async () => {
    setAvatarUrl(null);
    if (userId) {
      try {
        await fetch(`${API}/api/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar: null }),
        });
      } catch (err) {
        console.error('Failed to remove avatar:', err);
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // AVATAR BUTTON
  // ─────────────────────────────────────────────────────────────────────────
  const AvatarButton = () => (
    <button
      onClick={() => setAcctOpen(o => !o)}
      title="My Account"
      style={{
        width: 36, height: 36, borderRadius: '50%',
        background: isGuest ? '#334155' : getAvatarGradient(userEmail),
        border: acctOpen ? '2px solid #60a5fa' : '2px solid rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0, padding: 0, overflow: 'hidden',
        boxShadow: acctOpen ? '0 0 0 3px rgba(96,165,250,0.35)' : 'none',
        transition: 'box-shadow 0.2s, border 0.2s',
      }}
    >
      {avatarUrl
        ? <img src={avatarUrl} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        : isGuest
          ? <User size={16} color="#94a3b8" />
          : <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
              {getInitials(userEmail)}
            </span>
      }
    </button>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // ACCOUNT DROPDOWN
  // ─────────────────────────────────────────────────────────────────────────
  const AccountDropdown = () => (
    <div style={{
      position: 'absolute', top: 'calc(100% + 10px)', right: 0,
      width: 320, zIndex: 200,
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 20,
      boxShadow: '0 24px 64px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      animation: 'acctIn 0.2s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <style>{`
        @keyframes acctIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        .ap-field-label {
          font-size:9px; font-weight:700; color:#94a3b8;
          text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;
        }
        .ap-field-box {
          display:flex; align-items:center; gap:8px;
          background:#f8fafc; border:1px solid #e2e8f0;
          border-radius:10px; padding:9px 12px;
        }
        .ap-action-btn {
          width:100%; border:none; background:none; cursor:pointer;
          display:flex; align-items:center; gap:10px;
          padding:9px 12px; border-radius:10px;
          transition:background 0.15s; text-align:left;
        }
        .ap-action-btn:hover { background:#f1f5f9; }
      `}</style>

      {isGuest ? (
        <>
          <div style={{ padding:'22px 18px 16px', textAlign:'center', borderBottom:'1px solid #f1f5f9' }}>
            <div style={{ width:54, height:54, borderRadius:'50%', background:'#f1f5f9', border:'2px dashed #cbd5e1', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
              <User size={22} color="#94a3b8" />
            </div>
            <p style={{ fontSize:14, fontWeight:700, color:'#1e293b', marginBottom:5 }}>Browsing as guest</p>
            <p style={{ fontSize:11, color:'#94a3b8', lineHeight:1.6 }}>Sign in to manage your account, view orders, and unlock member deals.</p>
          </div>
          <div style={{ padding:'14px 14px 6px', display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={() => { setView('login-page'); setAcctOpen(false); }}
              style={{ width:'100%', padding:'11px 0', background:'linear-gradient(135deg,#1d4ed8,#3b82f6)', color:'#fff', fontWeight:700, fontSize:13, borderRadius:12, border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <LogIn size={14} /> Sign in to account
            </button>
            <button onClick={() => { setView('login-page'); setAcctOpen(false); }}
              style={{ width:'100%', padding:'11px 0', background:'#f8fafc', color:'#1d4ed8', fontWeight:600, fontSize:13, borderRadius:12, border:'1px solid #e2e8f0', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
              <UserPlus size={14} /> Create free account
            </button>
          </div>
          <div style={{ padding:'8px 14px 16px', display:'flex', gap:8 }}>
            {[['🔒','Secure'],['🎁','Rewards'],['🚚','Free ship']].map(([icon,label]) => (
              <div key={label} style={{ flex:1, background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'9px 4px', textAlign:'center' }}>
                <div style={{ fontSize:16 }}>{icon}</div>
                <div style={{ fontSize:9, color:'#64748b', fontWeight:600, marginTop:3 }}>{label}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div style={{ background:'linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 100%)', padding:'18px 18px 16px', position:'relative' }}>
            <button onClick={() => setAcctOpen(false)}
              style={{ position:'absolute', top:10, right:10, background:'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.7)', padding:4, borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={13} />
            </button>

            <div style={{ display:'flex', alignItems:'flex-end', gap:14, marginBottom:14 }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{
                  width:64, height:64, borderRadius:'50%', overflow:'hidden',
                  background: avatarUrl ? 'transparent' : getAvatarGradient(userEmail),
                  border:'3px solid rgba(255,255,255,0.35)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:'0 4px 16px rgba(31, 7, 186, 0.3)',
                }}>
                  {avatarUrl
                    ? <img src={avatarUrl} alt="profile" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                    : <span style={{ fontSize:22, fontWeight:800, color:'#fff', letterSpacing:'0.04em' }}>{getInitials(userEmail)}</span>
                  }
                </div>
                <button
                  onClick={() => fileInput.current?.click()}
                  title={uploading ? 'Saving…' : 'Upload photo'}
                  style={{
                    position:'absolute', bottom:-2, right:-2,
                    width:24, height:24, borderRadius:'50%',
                    background:'#fff', border:'2px solid #1d4ed8',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.2)',
                    transition:'transform 0.15s',
                    opacity: uploading ? 0.6 : 1,
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.15)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                >
                  <Camera size={11} color="#1d4ed8" />
                </button>
                <input ref={fileInput} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoUpload} />
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                  <span style={{ fontSize:15, fontWeight:800, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>
                    {userEmail?.split('@')[0] || 'User'}
                  </span>
                  {isAdmin
                    ? <span style={{ fontSize:8, background:'#dc2626', color:'#fff', borderRadius:99, padding:'2px 7px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', flexShrink:0 }}>Admin</span>
                    : <span style={{ fontSize:8, background:'rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.85)', borderRadius:99, padding:'2px 7px', fontWeight:600, flexShrink:0 }}>Customer</span>
                  }
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => fileInput.current?.click()}
                    style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.7)', fontSize:10, fontWeight:600, padding:0, display:'flex', alignItems:'center', gap:3 }}>
                    <Edit3 size={10} /> {avatarUrl ? 'Change photo' : 'Upload photo'}
                  </button>
                  {avatarUrl && (
                    <button onClick={removePhoto}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,100,100,0.85)', fontSize:10, fontWeight:600, padding:0 }}>
                      Remove
                    </button>
                  )}
                </div>
                {uploading && <p style={{ fontSize:9, color:'rgba(255,255,255,0.5)', marginTop:4 }}>Saving to database…</p>}
              </div>
            </div>

            <div style={{ marginBottom:10 }}>
              <div className="ap-field-label" style={{ color:'rgba(255,255,255,0.5)' }}>Email address</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 12px' }}>
                <Mail size={13} color="rgba(255,255,255,0.5)" style={{ flexShrink:0 }} />
                <span style={{ fontSize:12, color:'#fff', fontWeight:500, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {userEmail}
                </span>
                <button onClick={copyEmail}
                  title={emailCopied ? 'Copied!' : 'Copy email'}
                  style={{ background:'none', border:'none', cursor:'pointer', padding:0, color: emailCopied ? '#4ade80' : 'rgba(255,255,255,0.45)', transition:'color 0.2s', display:'flex' }}>
                  {emailCopied ? <Check size={12} /> : <Copy size={12} />}
                </button>
              </div>
            </div>

            <div>
              <div className="ap-field-label" style={{ color:'rgba(255,255,255,0.5)' }}>Password</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:10, padding:'8px 12px' }}>
                <Lock size={13} color="rgba(255,255,255,0.5)" style={{ flexShrink:0 }} />
                <span style={{ fontSize:13, color:'#fff', fontWeight:500, flex:1, letterSpacing: showPassword ? 'normal' : '0.18em' }}>
                  {showPassword ? '(hidden for security)' : maskedPassword}
                </span>
                <button onClick={() => setShowPassword(s => !s)}
                  title={showPassword ? 'Hide' : 'Show'}
                  style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'rgba(255,255,255,0.45)', display:'flex' }}>
                  {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          </div>

          <div style={{ padding:'10px 8px' }}>
            {isAdmin && (
              <button className="ap-action-btn" onClick={() => { setView('admin-home'); setAcctOpen(false); }}>
                <div style={{ width:30, height:30, borderRadius:9, background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <LayoutDashboard size={14} color="#dc2626" />
                </div>
                <span style={{ fontSize:13, fontWeight:600, color:'#dc2626', flex:1 }}>Admin Dashboard</span>
                <ChevronRight size={13} color="#94a3b8" />
              </button>
            )}

            <button className="ap-action-btn" onClick={() => fileInput.current?.click()}>
              <div style={{ width:30, height:30, borderRadius:9, background:'#eff6ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Camera size={14} color="#1d4ed8" />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#334155' }}>
                  {avatarUrl ? 'Change profile photo' : 'Upload profile photo'}
                </div>
                <div style={{ fontSize:10, color:'#94a3b8' }}>Saved to your account — persists across devices</div>
              </div>
              <ChevronRight size={13} color="#94a3b8" />
            </button>
          </div>

          <div style={{ padding:'0 8px 10px' }}>
            <button
              onClick={() => { if (handleLogout) handleLogout(); setAcctOpen(false); }}
              style={{
                width:'100%', padding:'10px 0',
                background:'#fff5f5', border:'1px solid #fecaca',
                color:'#dc2626', fontWeight:700, fontSize:13,
                borderRadius:11, cursor:'pointer',
                display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              }}
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <section className='pb-20'>
      <style>{`
        @keyframes searchExpand {
          from { opacity: 0; transform: translateY(-6px) scaleY(0.92); }
          to   { opacity: 1; transform: translateY(0) scaleY(1); }
        }
        .mobile-search-bar {
          animation: searchExpand 0.22s cubic-bezier(0.16,1,0.3,1) both;
          transform-origin: top center;
        }
        .search-icon-btn {
          position: relative;
          width: 36px; height: 36px;
          border-radius: 10px;
          border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.15s, transform 0.15s;
        }
        .search-icon-btn:active { transform: scale(0.92); }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 border-b shadow-sm transition-colors duration-300
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-800 border-gray-100'}`}
      >
        {/* ── MAIN NAV ROW ── */}
        <div className='px-4 md:px-8 h-16 flex justify-between items-center gap-3'>

          {/* Brand Logo */}
          <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => setView('shop-home')}>
            <img src={BrandLogo} alt="logo" className='w-[100px] h-[100px] rounded-[100px] p-5' />
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setView('shop-home'); }}
                className={`w-full pl-10 pr-10 py-1.5 border text-sm outline-none transition-all duration-200 block rounded
                  ${isDarkMode
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600'
                    : 'bg-blue-800 border-gray-200 text-gray-900 focus:bg-white'}`}
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">

            {/* Mobile search icon */}
            <button
              className="md:hidden search-icon-btn"
              onClick={() => { setMobileSearchOpen(o => !o); setIsSettingsOpen(false); }}
              aria-label="Search"
              style={{
                background: mobileSearchOpen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)',
              }}
            >
              {mobileSearchOpen ? <X className="h-4 w-4 text-white" /> : <Search className="h-4 w-4 text-white" />}
              {searchTerm && !mobileSearchOpen && (
                <span style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:'#4ade80', border:'1.5px solid #1d4ed8' }} />
              )}
            </button>

            {/* Cart */}
            <button onClick={() => setView('shop-cart')} className="relative p-2 text-green-400 hover:text-white transition">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Admin shortcut */}
            {userRole === 'admin' && (
              <button onClick={() => setView('admin-home')} className="hidden md:flex items-center space-x-1.5 bg-green-800 text-white rounded-full text-xl font-semibold hover:bg-blue-500 transition">
                <LayoutDashboard className="h-4 w-4" />
              </button>
            )}

            {/* Account avatar + dropdown */}
            <div ref={acctRef} style={{ position:'relative' }}>
              <AvatarButton />
              {acctOpen && <AccountDropdown />}
            </div>

            {/* Settings menu */}
            <div className="relative">
              <button
                onClick={() => { setIsSettingsOpen(!isSettingsOpen); setMobileSearchOpen(false); }}
                className="p-2 text-green-400 hover:text-white transition focus:outline-none"
                title="Menu"
              >
                <Menu className={`h-5 w-5 transition-transform duration-200 ${isSettingsOpen ? 'rotate-90' : ''}`} />
              </button>

              {isSettingsOpen && (
                <div className={`absolute right-0 mt-2 w-60 border rounded-lg shadow-xl py-2 z-50 transition-colors duration-200
                  ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>

                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-900 uppercase tracking-wider bg-blue-800 rounded-md">Menu</div>
                  <button onClick={() => { setView('shop-home'); setIsSettingsOpen(false); }} className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>Home</span></button>
                  <button onClick={() => { setView('shop-home'); setIsSettingsOpen(false); }} className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>Shop</span></button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>Help center</span></button>

                  <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-900 uppercase tracking-wider bg-blue-800 rounded-md">Sell on PSP</div>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>For brands</span></button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>For creators</span></button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}><span>Build your store</span></button>

                  <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-900 uppercase tracking-wider bg-blue-800 rounded-md">Follow us</div>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    <span><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a></span>
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    <span><a href="https://www.instagram.com/sopheak123.pheak/" target="_blank" rel="noopener noreferrer">Instagram</a></span>
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    <span><a href="https://x.com/PSopheak23887" target="_blank" rel="noopener noreferrer">X (Twitter)</a></span>
                  </button>

                  <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-900 uppercase tracking-wider bg-blue-800 rounded-md">Preferences</div>
                  <button onClick={handleToggleDarkMode} className={`w-full flex items-center justify-between px-4 py-2 text-sm transition text-left ${isDarkMode ? 'hover:bg-slate-700 text-gray-200' : 'hover:bg-blue-400 text-gray-700'}`}>
                    <div className="flex items-center gap-2">
                      {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
                      <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                    </div>
                  </button>

                  <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

                  {!userRole || userRole === 'guest' ? (
                    <button onClick={() => { setView('login-page'); setIsSettingsOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50/10 font-semibold transition text-left">
                      <LogIn className="h-4 w-4" /><span>Login to account</span>
                    </button>
                  ) : (
                    <button onClick={() => { if (handleLogout) handleLogout(); setIsSettingsOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50/10 font-semibold transition text-left">
                      <LogOut className="h-4 w-4" /><span>Sign out ({userRole})</span>
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── MOBILE SEARCH BAR ── */}
        {mobileSearchOpen && (
          <div
            className="md:hidden mobile-search-bar px-3 pb-3"
            style={{
              borderTop: isDarkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.15)',
              background: isDarkMode ? '#1e293b' : '#1d4ed8',
            }}
          >
            <div style={{
              marginTop: 10,
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              borderRadius: 14, padding: '0 14px',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}>
              <Search size={15} color="rgba(255,255,255,0.55)" style={{ flexShrink:0 }} />
              <input
                ref={mobileSearchRef}
                type="text"
                placeholder="Search products…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setView('shop-home'); }}
                style={{
                  flex: 1, background: 'transparent', border: 'none', outline: 'none',
                  color: '#fff', fontSize: 14, fontWeight: 500, padding: '12px 0', caretColor: '#60a5fa',
                }}
              />
              {searchTerm ? (
                <button onClick={() => setSearchTerm('')}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <X size={13} color="rgba(255,255,255,0.8)" />
                </button>
              ) : (
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)', flexShrink:0, fontWeight:500 }}>PSP</span>
              )}
            </div>
            {!searchTerm && (
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', textAlign:'center', marginTop:7, fontWeight:500 }}>
                Type to search across all products
              </p>
            )}
            {searchTerm && (
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.5)', textAlign:'center', marginTop:7, fontWeight:500 }}>
                Showing results for <span style={{ color:'#93c5fd', fontWeight:700 }}>"{searchTerm}"</span>
              </p>
            )}
          </div>
        )}

      </nav>
    </section>
  );
}