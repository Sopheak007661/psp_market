// import React, { useState, useEffect, useRef, useContext } from 'react';
// import { ShopProvider, ShopContext } from './context/ShopContext';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import Foot from './components/Foot';
// import LOGO from './assets/BrandLogo.png';
// import Angkor from './assets/Angkor.png';

// import {
//   Eye, EyeOff, Lock, Mail, Shield, User, LogOut,
//   ShoppingBag, Tag, Truck, Headphones, UserPlus,
//   Star, RefreshCw, CheckCircle, ArrowRight, X,
//   Gift, Zap, Home as HomeIcon, Phone, ChevronRight,
//   Heart, ShoppingCart, Search, Filter, Grid, List,
//   TrendingUp, Award, Clock, Package, Menu, Camera,
// } from 'lucide-react';

// import Home from './pages/ClientShop/Home';
// import ProductDetail from './pages/ClientShop/ProductDetail';
// import Cart from './pages/ClientShop/Cart';
// import DashboardHome from './pages/AdminDashboard/DashboardHome';
// import ManageProducts from './pages/AdminDashboard/ManageProducts';
// import Orders from './pages/AdminDashboard/Orders';
// import Graphic from './pages/AdminDashboard/GraphicAnalytics';
// import Users from './pages/AdminDashboard/UserRegister';
// import Checkin from './pages/AdminDashboard/CheckInOut';
// import Evaloute from './pages/AdminDashboard/EvaluatePerformance';
// import TelegramDashboard from './pages/AdminDashboard/TelegramDashboard';


// //Check in





// // ─────────────────────────────────────────────────────────────────────────────
// // USER LEDGER  —  shared localStorage key (same key UserRegister.jsx reads)
// // ─────────────────────────────────────────────────────────────────────────────
// const USER_LEDGER_KEY = 'psp_registered_users';

// // Disposable / obviously-fake domain blocklist
// const BLOCKED_DOMAINS = new Set([
//   'mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com',
//   'throwam.com','yopmail.com','trashmail.com','sharklasers.com',
//   'guerrillamailblock.com','spam4.me','fakeinbox.com','dispostable.com',
//   'maildrop.cc','mailnull.com','spamgourmet.com','trashmail.io',
//   'discard.email','getnada.com','tempr.email','airmail.ac',
//   'spamex.com','trbvm.com','spamoff.de','mailexpire.com','getairmail.com',
//   'throwaway.email','emailondeck.com','mintemail.com','tempinbox.com',
// ]);

// // Basic "real-looking" email check
// function isEmailLegit(email) {
//   if (!email || typeof email !== 'string') return false;
//   const lower = email.toLowerCase().trim();
//   if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(lower)) return false;
//   const domain = lower.split('@')[1];
//   if (!domain || !domain.includes('.')) return false;
//   if (BLOCKED_DOMAINS.has(domain)) return false;
//   return true;
// }

// // Simple FNV-1a hash (obfuscation — NOT real crypto, fine for demo/localStorage)
// function simpleHash(str) {
//   let h = 0x811c9dc5;
//   for (let i = 0; i < str.length; i++) {
//     h ^= str.charCodeAt(i);
//     h = (h * 0x01000193) >>> 0;
//   }
//   return h.toString(16);
// }

// function getLedger() {
//   try { return JSON.parse(localStorage.getItem(USER_LEDGER_KEY) || '[]'); }
//   catch { return []; }
// }
// function saveLedger(arr) {
//   try { localStorage.setItem(USER_LEDGER_KEY, JSON.stringify(arr)); } catch {}
// }

// // Is this email already registered?
// function isEmailRegistered(email) {
//   return getLedger().some(u => u.email.toLowerCase() === email.toLowerCase().trim());
// }

// // Does the password match what was saved for this email?
// function verifyPassword(email, password) {
//   const user = getLedger().find(u => u.email.toLowerCase() === email.toLowerCase().trim());
//   if (!user) return false;
//   return user.passwordHash === simpleHash(password);
// }

// // Save a new user to the ledger (called on Register)
// function saveRegisteredUser(name, email, password) {
//   const ledger = getLedger();
//   if (ledger.some(u => u.email.toLowerCase() === email.toLowerCase().trim())) return;
//   ledger.unshift({
//     id:           `USR-${Date.now()}`,
//     name:         name.trim(),
//     email:        email.trim().toLowerCase(),
//     passwordHash: simpleHash(password),
//     role:         'Customer',
//     status:       'Active',
//     date:         new Date().toISOString().slice(0, 10),
//   });
//   saveLedger(ledger);
//   try { window.dispatchEvent(new Event('psp_user_sync')); } catch {}
// }

// // ─────────────────────────────────────────────
// // LOADING SCREEN
// // ─────────────────────────────────────────────
// function LoadingScreen({ role }) {
//   const [progress, setProgress] = useState(0);
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress(prev => {
//         if (prev >= 100) { clearInterval(interval); return 100; }
//         return prev + 2;
//       });
//     }, 36);
//     return () => clearInterval(interval);
//   }, []);
//   const isAdmin = role === 'admin';
//   const accentColor = isAdmin ? '#991b1b' : '#1e40af';
//   return (
//     <div style={{
//       position: 'fixed', inset: 0, zIndex: 9999,
//       background: `linear-gradient(to bottom, transparent 10%, #041dd3 100%), url(${Angkor}) center/cover no-repeat`,
//       display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
//       fontFamily: "'Segoe UI', sans-serif",
//     }}>
//       <style>{`
//         @keyframes spin-ring { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
//         @keyframes counter-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
//         @keyframes pulse-center { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.8; } }
//         @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
//         .ring { position: absolute; border-radius: 50%; border-style: solid; }
//       `}</style>
//       <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 48 }}>
//         <div className="ring" style={{ width: 220, height: 220, top: 0, left: 0, borderWidth: 3, borderColor: `${accentColor}30 ${accentColor} ${accentColor}30 ${accentColor}`, animation: 'spin-ring 3s linear infinite' }} />
//         <div className="ring" style={{ width: 185, height: 185, top: 17.5, left: 17.5, borderWidth: 2.5, borderColor: `${accentColor}15 ${accentColor}90 ${accentColor}15 ${accentColor}90`, animation: 'counter-spin 2.2s linear infinite' }} />
//         <div className="ring" style={{ width: 152, height: 152, top: 34, left: 34, borderWidth: 3, borderColor: `${accentColor} ${accentColor}25 ${accentColor} ${accentColor}25`, animation: 'spin-ring 1.8s linear infinite' }} />
//         <div className="ring" style={{ width: 118, height: 118, top: 51, left: 51, borderWidth: 2, borderColor: `${accentColor}60 ${accentColor}ff ${accentColor}60 ${accentColor}ff`, animation: 'counter-spin 1.3s linear infinite' }} />
//         <div className="ring" style={{ width: 86, height: 86, top: 67, left: 67, borderWidth: 2.5, borderColor: `${accentColor} transparent ${accentColor} transparent`, animation: 'spin-ring 0.9s linear infinite' }} />
//         <div style={{
//           position: 'absolute', top: '38%', left: '39%', transform: 'translate(-50%,-50%)',
//           width: 52, height: 52, borderRadius: 14,
//           background: `${accentColor}22`, border: `1.5px solid ${accentColor}60`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           animation: 'pulse-center 2s ease-in-out infinite',
//         }}>
//           {isAdmin ? <Shield size={24} color={accentColor} /> : <User size={24} color={accentColor} />}
//         </div>
//       </div>
//       <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease both' }}>
//         <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: `${accentColor}cc`, textTransform: 'uppercase', marginBottom: 6 }}>
//           {isAdmin ? 'Admin Portal' : 'PSP MART'}
//         </p>
//         <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 28, fontWeight: 400 }}>
//           {isAdmin ? 'Verifying secure session…' : 'Preparing your experience…'}
//         </p>
//         <div style={{ width: 220, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', margin: '0 auto' }}>
//           <div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${accentColor}, ${isAdmin ? '#f87171' : '#60a5fa'})`, width: `${progress}%`, transition: 'width 0.1s linear' }} />
//         </div>
//         <p style={{ fontSize: 11, color: 'rgb(23, 20, 20)', marginTop: 8 }}>{progress}%</p>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // GOOGLE / FACEBOOK ICONS
// // ─────────────────────────────────────────────
// function GoogleIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//     </svg>
//   );
// }
// function FacebookIcon() {
//   return (
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
//       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//     </svg>
//   );
// }

// // ─────────────────────────────────────────────
// // CATEGORY STYLE MAP
// // ─────────────────────────────────────────────
// const CATEGORY_STYLES = {
//   Car:         { emoji: '', bg: 'from-red-100 to-red-50',     text: 'text-red-700',    border: 'border-red-200' },
//   Computer:    { emoji: '', bg: 'from-blue-100 to-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
//   Fruit:       { emoji: '', bg: 'from-green-100 to-green-50', text: 'text-green-700',  border: 'border-green-200' },
//   Vegetable:   { emoji: '', bg: 'from-emerald-100 to-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
//   Clothes:     { emoji: '', bg: 'from-pink-100 to-pink-50',   text: 'text-pink-700',   border: 'border-pink-200' },
//   Phone:       { emoji: '', bg: 'from-violet-100 to-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
//   Accessories: { emoji: '', bg: 'from-amber-100 to-amber-50', text: 'text-amber-700',  border: 'border-amber-200' },
//   'Hotel Book':{ emoji: '', bg: 'from-cyan-100 to-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200' },
//   Meet:        { emoji: '', bg: 'from-orange-100 to-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
// };
// const DEFAULT_STYLE = { emoji: '📦', bg: 'from-slate-100 to-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

// // ─────────────────────────────────────────────
// // SIGN-IN PROMPT MODAL (product click)
// // ─────────────────────────────────────────────
// function SignInPrompt({ product, onClose, onLogin }) {
//   const [email,    setEmail]    = useState('');
//   const [password, setPassword] = useState('');
//   const [showPw,   setShowPw]   = useState(false);
//   const [err,      setErr]      = useState('');

//   const submit = (e) => {
//     e.preventDefault();
//     setErr('');
//     if (!email || !password) { setErr('Please fill in all fields.'); return; }
//     if (!isEmailLegit(email)) { setErr('❌ This email address looks invalid or fake.'); return; }
//     if (!isEmailRegistered(email)) {
//       setErr('🚫 No account found for this email. Please register first.');
//       return;
//     }
//     if (!verifyPassword(email, password)) {
//       setErr('🔑 Incorrect password. Please try again.');
//       return;
//     }
//     const user = getLedger().find(u => u.email.toLowerCase() === email.toLowerCase().trim());
//     onLogin('user', email, user?.name || email.split('@')[0]);
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeUp">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white relative">
//           <button onClick={onClose} className="absolute top-3 right-3 text-white/60 hover:text-white transition"><X size={18} /></button>
//           <div className="flex items-center gap-3">
//             <div className="w-14 h-14 rounded-xl bg-white/20 overflow-hidden flex items-center justify-center flex-shrink-0">
//               {product.image
//                 ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
//                 : <span className="text-3xl">{(CATEGORY_STYLES[product.category] || DEFAULT_STYLE).emoji}</span>}
//             </div>
//             <div>
//               <p className="text-xs text-blue-200 mb-0.5">You selected</p>
//               <p className="font-bold text-sm leading-tight">{product.name}</p>
//               <p className="text-blue-200 text-xs mt-0.5">${Number(product.price || 0).toFixed(2)} · {product.category}</p>
//             </div>
//           </div>
//           <div className="mt-3 bg-white/10 border border-white/20 rounded-lg p-2 text-center">
//             <p className="text-xs text-blue-100">🔒 Sign in to add to cart & checkout securely</p>
//           </div>
//         </div>
//         <div className="p-5">
//           <h3 className="font-bold text-slate-800 text-sm mb-0.5">Sign in to continue</h3>
//           <p className="text-xs text-slate-500 mb-4">Use the email & password you registered with.</p>
//           {err && (
//             <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-xl mb-3 font-medium flex items-center gap-2">
//               <span>⚠️</span><span>{err}</span>
//             </div>
//           )}
//           <form onSubmit={submit} className="space-y-3">
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={13} /></span>
//               <input type="email" placeholder="your@email.com" value={email}
//                 onChange={e => { setEmail(e.target.value); setErr(''); }}
//                 className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
//             </div>
//             <div className="relative">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={13} /></span>
//               <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password}
//                 onChange={e => { setPassword(e.target.value); setErr(''); }}
//                 className="w-full pl-8 pr-9 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
//               <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
//                 {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
//               </button>
//             </div>
//             <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
//               <User size={13} /> Sign in & view product <ArrowRight size={13} />
//             </button>
//           </form>
//           <div className="flex items-center gap-2 my-3">
//             <div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400">or</span><div className="flex-1 h-px bg-slate-200" />
//           </div>
//           <button onClick={() => onLogin('guest', 'guest', 'Guest')} className="w-full py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
//             <Eye size={13} /> Continue as guest
//           </button>
//           <p className="text-center text-[10px] text-slate-400 mt-2">No account? Close this and register first.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // AUTH MODAL
// // ─────────────────────────────────────────────
// function AuthModal({ onClose, onLogin, defaultTab = 'signin' }) {
//   const MY_ADMIN_EMAIL    = "sopheakp175@gmail.com";
//   const MY_ADMIN_PASSWORD = "220927";

//   const [activeTab,    setActiveTab]    = useState(defaultTab);
//   const [email,        setEmail]        = useState('');
//   const [password,     setPassword]     = useState('');
//   const [confirmPass,  setConfirmPass]  = useState('');
//   const [name,         setName]         = useState('');
//   const [rememberMe,   setRememberMe]   = useState(false);
//   const [error,        setError]        = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm,  setShowConfirm]  = useState(false);
//   const [emailHint,    setEmailHint]    = useState('');

//   const switchTab = (tab) => {
//     setActiveTab(tab); setError(''); setEmailHint('');
//     setEmail(''); setPassword(''); setConfirmPass(''); setName('');
//   };

//   // Live hint when user leaves email field
//   const onEmailBlur = () => {
//     if (!email) { setEmailHint(''); return; }
//     if (!isEmailLegit(email)) {
//       setEmailHint('⚠️ This email looks invalid or fake.');
//     } else if (activeTab === 'register' && isEmailRegistered(email)) {
//       setEmailHint('📧 Already registered — sign in instead.');
//     } else if (activeTab === 'signin' && !isEmailRegistered(email)) {
//       setEmailHint('🚫 No account found — please register first.');
//     } else {
//       setEmailHint('');
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');

//     // ── ADMIN ──────────────────────────────────────────────────────────────
//     if (activeTab === 'admin') {
//       if (!email || !password) { setError('Please fill in all fields.'); return; }
//       if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
//         onLogin('admin', email, 'Phy Sopheak');
//       } else {
//         setError('❌ Access denied. Invalid admin credentials.');
//       }
//       return;
//     }

//     // ── REGISTER ───────────────────────────────────────────────────────────
//     if (activeTab === 'register') {
//       if (!name.trim())        { setError('Please enter your full name.'); return; }
//       if (!email)              { setError('Please enter your email.'); return; }
//       if (!isEmailLegit(email)) {
//         setError('❌ This email is invalid or looks fake. Please use a real email address.');
//         return;
//       }
//       if (isEmailRegistered(email)) {
//         setError('📧 This email is already registered. Please sign in instead.');
//         return;
//       }
//       if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
//       if (password !== confirmPass) { setError('Passwords do not match.'); return; }
//       saveRegisteredUser(name.trim(), email.trim(), password);
//       onLogin('user', email, name.trim());
//       return;
//     }

//     // ── SIGN IN ────────────────────────────────────────────────────────────
//     if (!email)    { setError('Please enter your email.'); return; }
//     if (!password) { setError('Please enter your password.'); return; }
//     if (!isEmailLegit(email)) {
//       setError('❌ This email address looks invalid.');
//       return;
//     }
//     if (!isEmailRegistered(email)) {
//       setError('🚫 No account found for this email. Please register first.');
//       return;
//     }
//     if (!verifyPassword(email, password)) {
//       setError('🔑 Incorrect password. Please try again.');
//       return;
//     }
//     const user = getLedger().find(u => u.email.toLowerCase() === email.toLowerCase().trim());
//     onLogin('user', email, user?.name || email.split('@')[0]);
//   };

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center p-4"
//       style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
//       onClick={e => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modalPop">
//         {/* Header */}
//         <div className="relative px-6 pt-6 pb-0 text-center">
//           <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition">
//             <X size={15} />
//           </button>
//           <h2 className="text-lg font-bold text-slate-800 mt-1">
//             {activeTab === 'signin'   && 'Sign in to PSP MARKET'}
//             {activeTab === 'register' && 'Create your account'}
//             {activeTab === 'admin'    && 'Admin Access Only'}
//           </h2>
//           <p className="text-xs text-slate-500 mt-0.5 mb-4">
//             {activeTab === 'signin'   && 'Sign in to see your orders, wishlist & deals'}
//             {activeTab === 'register' && 'Join 50,000+ happy PSP MARKET shoppers'}
//             {activeTab === 'admin'    && 'Restricted to authorised personnel only'}
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="px-6 mb-4">
//           <div className="bg-slate-100 p-1 rounded-xl flex gap-0.5">
//             {[
//               { key: 'signin',   label: 'Sign in',  icon: <User size={12} /> },
//               { key: 'register', label: 'Register', icon: <UserPlus size={12} /> },
//               { key: 'admin',    label: 'Admin',    icon: <Shield size={12} /> },
//             ].map(t => (
//               <button key={t.key} type="button" onClick={() => switchTab(t.key)}
//                 className={`flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
//                   activeTab === t.key
//                     ? (t.key === 'admin' ? 'bg-red-600 text-white shadow-sm' : 'bg-blue-600 text-white shadow-sm')
//                     : 'text-slate-500 hover:text-slate-700'
//                 }`}>
//                 {t.icon} {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Body */}
//         <div className="px-6 pb-6">
//           {activeTab !== 'admin' && (
//             <>
//               <div className="grid grid-cols-2 gap-2 mb-3">
//                 <button type="button" className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"><GoogleIcon /> Google</button>
//                 <button type="button" className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"><FacebookIcon /> Facebook</button>
//               </div>
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400 font-medium">or continue with email</span><div className="flex-1 h-px bg-slate-200" />
//               </div>
//             </>
//           )}

//           {/* Error banner */}
//           {error && (
//             <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl mb-3 font-medium flex items-start gap-2">
//               <span className="flex-shrink-0">⚠️</span><span>{error}</span>
//             </div>
//           )}

//           {activeTab === 'register' && (
//             <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-start gap-2">
//               <Zap size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
//               <p className="text-xs text-amber-700 leading-snug">Register now and use <strong>WELCOME15</strong> at checkout for 15% off!</p>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-3">
//             {/* Full name (register only) */}
//             {activeTab === 'register' && (
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full name</label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={14} /></span>
//                   <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)}
//                     className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
//                 </div>
//               </div>
//             )}

//             {/* Email */}
//             <div>
//               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email address</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={14} /></span>
//                 <input
//                   type="email"
//                   placeholder={activeTab === 'admin' ? 'admin@example.com' : 'your@email.com'}
//                   value={email}
//                   onChange={e => { setEmail(e.target.value); setEmailHint(''); setError(''); }}
//                   onBlur={onEmailBlur}
//                   className={`w-full pl-8 pr-4 py-2.5 border rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 transition ${
//                     emailHint ? 'border-amber-400 focus:ring-amber-300/30' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
//                   }`}
//                 />
//               </div>
//               {emailHint && <p className="text-[11px] text-amber-600 mt-1 ml-1">{emailHint}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <div className="flex items-center justify-between mb-1">
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
//                 {activeTab === 'signin' && <button type="button" className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold transition">Forgot password?</button>}
//               </div>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={14} /></span>
//                 <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
//                   onChange={e => { setPassword(e.target.value); setError(''); }}
//                   className="w-full pl-8 pr-9 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
//                   {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
//                 </button>
//               </div>
//               {/* Password strength bar (register only) */}
//               {activeTab === 'register' && password.length > 0 && (
//                 <div className="mt-1.5">
//                   <div className="flex gap-1">
//                     {[1,2,3,4].map(i => (
//                       <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
//                         password.length >= i * 3
//                           ? password.length < 6  ? 'bg-red-400'
//                           : password.length < 9  ? 'bg-amber-400'
//                           : 'bg-green-500'
//                           : 'bg-slate-200'
//                       }`} />
//                     ))}
//                   </div>
//                   <p className="text-[10px] mt-0.5 text-slate-400">
//                     {password.length < 6 ? 'Too short' : password.length < 9 ? 'Fair' : password.length < 12 ? 'Good' : 'Strong'}
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Confirm password (register only) */}
//             {activeTab === 'register' && (
//               <div>
//                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm password</label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={14} /></span>
//                   <input
//                     type={showConfirm ? 'text' : 'password'}
//                     placeholder="••••••••"
//                     value={confirmPass}
//                     onChange={e => { setConfirmPass(e.target.value); setError(''); }}
//                     className={`w-full pl-8 pr-9 py-2.5 border rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 transition ${
//                       confirmPass && confirmPass !== password ? 'border-red-300 focus:ring-red-300/30'
//                       : confirmPass && confirmPass === password ? 'border-green-400 focus:ring-green-300/30'
//                       : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
//                     }`}
//                   />
//                   <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
//                     {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
//                   </button>
//                   {confirmPass && (
//                     <span className="absolute inset-y-0 right-8 flex items-center pr-1 text-sm">
//                       {confirmPass === password ? '✅' : '❌'}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {activeTab === 'signin' && (
//               <label className="flex items-center gap-2 cursor-pointer select-none">
//                 <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-3.5 h-3.5 rounded accent-blue-600" />
//                 <span className="text-xs text-slate-500">Remember me on this device</span>
//               </label>
//             )}

//             <button type="submit"
//               className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 ${
//                 activeTab === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
//               }`}>
//               {activeTab === 'signin'   && <><User size={14} /> Sign in to PSP MARKET</>}
//               {activeTab === 'register' && <><UserPlus size={14} /> Create my account</>}
//               {activeTab === 'admin'    && <><Shield size={14} /> Verify admin identity</>}
//               <ArrowRight size={14} />
//             </button>
//           </form>

//           {activeTab !== 'admin' && (
//             <>
//               <div className="flex items-center gap-3 my-3"><div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400 font-medium">or</span><div className="flex-1 h-px bg-slate-200" /></div>
//               <button type="button" onClick={() => onLogin('guest', 'guest', 'Guest')} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
//                 <Eye size={14} /> Browse as guest
//               </button>
//               <p className="text-center text-[10px] text-slate-400 mt-2">Guest accounts can't save carts or track orders.</p>
//             </>
//           )}
//           {activeTab === 'admin' && (
//             <p className="text-center text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-100">Private admin channel. All access attempts are logged.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // PRE-LOGIN PRODUCT CARD
// // ─────────────────────────────────────────────
// function PreLoginProductCard({ product, onProductClick }) {
//   const [liked, setLiked] = useState(false);
//   const style = CATEGORY_STYLES[product.category] || DEFAULT_STYLE;
//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden group cursor-pointer" onClick={() => onProductClick(product)}>
//       <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 h-36 overflow-hidden">
//         <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//           onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
//         <div className="absolute inset-0 hidden items-center justify-center text-4xl bg-gradient-to-br from-slate-100 to-slate-200">{style.emoji}</div>
//         <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">{product.category}</span>
//         <button onClick={e => { e.stopPropagation(); setLiked(!liked); }} className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition">
//           <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
//         </button>
//       </div>
//       <div className="p-3">
//         <p className="text-xs font-semibold text-slate-800 leading-tight mb-1 line-clamp-2">{product.name}</p>
//         {product.description && <p className="text-[10px] text-slate-400 leading-snug mb-1 line-clamp-1">{product.description}</p>}
//         {product.variants && product.variants.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-1.5">
//             {product.variants.slice(0, 2).map((v, i) => (
//               <span key={i} className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded text-[9px] font-semibold">{v.label}</span>
//             ))}
//           </div>
//         )}
//         <div className="flex items-center gap-1.5 mb-2">
//           <span className="text-sm font-bold text-blue-700">${Number(product.price || 0).toFixed(2)}</span>
//         </div>
//         <button onClick={e => { e.stopPropagation(); onProductClick(product); }} className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg transition flex items-center justify-center gap-1">
//           <ShoppingCart size={10} /> Add to cart
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // USER COMMENT SECTION
// // ─────────────────────────────────────────────
// function UserCommentSection() {
//   const [comments, setComments] = useState(() => {
//     try { return JSON.parse(localStorage.getItem('psp_comments') || '[]'); } catch { return []; }
//   });
//   const [username, setUsername] = useState('');
//   const [comment,  setComment]  = useState('');
//   const [rating,   setRating]   = useState(5);
//   const [hovered,  setHovered]  = useState(0);
//   const [err,      setErr]      = useState('');
//   const [success,  setSuccess]  = useState(false);

//   const AVATAR_COLORS = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500'];
//   const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
//   const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!username.trim())          { setErr('Please enter your name.'); return; }
//     if (!comment.trim())           { setErr('Please write a comment.'); return; }
//     if (comment.trim().length < 5) { setErr('Comment is too short (minimum 5 characters).'); return; }
//     const newComment = {
//       id: Date.now(), username: username.trim(), comment: comment.trim(), rating,
//       date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//     };
//     const updated = [newComment, ...comments];
//     setComments(updated);
//     try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//     setUsername(''); setComment(''); setRating(5); setErr(''); setSuccess(true);
//     setTimeout(() => setSuccess(false), 3500);
//   };

//   const totalReviews = comments.length;

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       <div className="flex items-center gap-3 mb-2">
//         <h3 className="text-lg font-bold text-slate-800">Customer Reviews</h3>
//         <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">{totalReviews} reviews</span>
//       </div>
//       <div className="bg-blue-700 border border-blue-100 rounded-2xl p-5 mb-8">
//         <h4 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2"><UserPlus size={15} className="text-white" /> Enter your review</h4>
//         {success && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2.5 rounded-xl mb-3"><CheckCircle size={13} /> Thanks for your review! It's now live below.</div>}
//         {err && <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2.5 rounded-xl mb-3">{err}</div>}
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Your name *</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={13} /></span>
//                 <input type="text" placeholder="e.g. Sokha, John…" value={username} onChange={e => { setUsername(e.target.value); setErr(''); }} maxLength={40}
//                   className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
//               </div>
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Rating *</label>
//               <div className="flex items-center gap-1 h-[42px]">
//                 {[1,2,3,4,5].map(star => (
//                   <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(star)} className="text-2xl transition-transform hover:scale-110 focus:outline-none leading-none">
//                     <span className={(hovered || rating) >= star ? 'text-slate-900' : 'text-slate-300'}>★</span>
//                   </button>
//                 ))}
//                 <span className="text-xs text-white ml-1">{RATING_LABELS[hovered || rating]}</span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Your comment *</label>
//             <textarea rows={3} placeholder="Tell others about your experience with PSP MARKET…" value={comment} onChange={e => { setComment(e.target.value); setErr(''); }} maxLength={300}
//               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none" />
//             <p className="text-[10px] text-slate-400 text-right mt-0.5">{comment.length}/300</p>
//           </div>
//           <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm">Post</button>
//         </form>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {comments.map(c => (
//           <div key={c.id} className="bg-white border border-slate-400 rounded-2xl p-5 shadow-sm relative">
//             <span className="absolute top-3 right-3 text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">Customer</span>
//             <div className="flex items-center gap-3 mb-3">
//               <div className={`w-8 h-8 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{c.username[0].toUpperCase()}</div>
//               <div className="flex-1 min-w-0">
//                 <span className="text-sm font-semibold text-slate-700 block truncate">{c.username}</span>
//                 <p className="text-[10px] text-slate-400">{c.date}</p>
//               </div>
//               <span className="text-slate-900 text-xs mt-5 flex-shrink-0">{'★'.repeat(c.rating)}</span>
//             </div>
//             <p className="text-xs text-slate-500 leading-relaxed">"{c.comment}"</p>
//           </div>
//         ))}
//       </div>
//       {comments.length === 0 && <p className="text-center text-xs text-slate-400 mt-4">Be the first to leave a review above!</p>}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // LOGIN PAGE
// // ─────────────────────────────────────────────
// function LoginPage({ onLogin, products }) {
//   const [promoBanner,    setPromoBanner]    = useState(true);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [activeSection,  setActiveSection]  = useState('home');
//   const [activeCategory, setActiveCategory] = useState('');
//   const [searchQuery,    setSearchQuery]    = useState('');
//   const [selectedProduct,setSelectedProduct]= useState(null);
//   const [showAuthModal,  setShowAuthModal]  = useState(false);
//   const [authModalTab,   setAuthModalTab]   = useState('signin');
//   const [heroLogo,       setHeroLogo]       = useState(null);

//   const openAuth = (tab = 'signin') => { setAuthModalTab(tab); setShowAuthModal(true); };

//   const switchSection = (section) => {
//     setActiveSection(section); setMobileMenuOpen(false);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const allProducts      = products || [];
//   const uniqueCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
//   useEffect(() => {
//     if (uniqueCategories.length > 0 && !activeCategory) setActiveCategory(uniqueCategories[0]);
//   }, [uniqueCategories.length]); // eslint-disable-line

//   const searchResults   = searchQuery.trim().length > 1
//     ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     : null;
//   const displayProducts = searchResults || (activeCategory ? allProducts.filter(p => p.category === activeCategory) : allProducts);

//   const stats = [
//     { value: '50K+', label: 'Happy customers' },
//     { value: '10K+', label: 'Products' },
//     { value: '4.8★', label: 'Avg. rating' },
//   ];

//   const OFFERS_DATA = [
//     { code: 'WELCOME15', discount: '15% OFF',      label: 'New Members',  desc: 'First order discount for all new sign-ups',  gradient: 'linear-gradient(135deg,#1e40af,#3b82f6)', icon: '🎉', expires: 'No expiry' },
//     { code: 'SAVE30',    discount: '$30 OFF',       label: 'Orders $150+', desc: 'Spend $150 or more and save $30 instantly',   gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)', icon: '💜', expires: 'Ends Jun 30' },
//     { code: 'FREESHIP',  discount: 'Free Shipping', label: 'All Orders',   desc: 'Free delivery on any order this weekend',     gradient: 'linear-gradient(135deg,#059669,#10b981)', icon: '🚚', expires: 'Weekend only' },
//     { code: 'FLASH50',   discount: '50% OFF',       label: 'Flash Sale',   desc: 'Selected electronics & accessories only',      gradient: 'linear-gradient(135deg,#dc2626,#f97316)', icon: '⚡', expires: 'Today only' },
//   ];

//   const NAV_ITEMS = [
//     { key: 'home',     label: 'Home',     icon: <HomeIcon size={4} /> },
//     { key: 'products', label: 'Products', icon: <Package size={4} /> },
//     { key: 'deals',    label: 'Deals',    icon: <Tag size={4} /> },
//     { key: 'offers',   label: 'Offers',   icon: <Gift size={4} /> },
//     { key: 'contact',  label: 'Contact',  icon: <Phone size={4} /> },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       <style>{`
//         @keyframes fadeUp    { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes slideIn   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
//         @keyframes modalPop  { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
//         .animate-fadeUp      { animation: fadeUp   0.3s ease both; }
//         .animate-slideDown   { animation: slideDown 0.25s ease both; }
//         .animate-modalPop    { animation: modalPop  0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
//         .section-animate     { animation: slideIn   0.35s ease both; }
//         .line-clamp-2        { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
//         .line-clamp-1        { display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
//         .nav-btn             { transition: all 0.2s ease; }
//         .nav-btn:hover       { background: #f1f5f9 !important; color: #1d4ed8 !important; }
//         .deal-hover:hover    { transform: scale(1.02); }
//         .offer-hover:hover   { transform: translateY(-4px); }
//         .mobile-nav-item     { transition: all 0.15s ease; }
//         .mobile-nav-item:hover { background: #f1f5f9 !important; }
//         .hero-btn            { transition: all 0.2s ease; }
//         .hero-btn:hover      { transform: translateY(-2px); filter: brightness(1.08); }
//         .logo-drop:hover .logo-drop-hint { opacity:1; }
//         .logo-drop-hint      { opacity:0; transition: opacity 0.2s; }
//       `}</style>

//       {showAuthModal && (
//         <AuthModal
//           defaultTab={authModalTab}
//           onClose={() => setShowAuthModal(false)}
//           onLogin={(role, email, name) => { setShowAuthModal(false); onLogin(role, email, name); }}
//         />
//       )}
//       {selectedProduct && (
//         <SignInPrompt
//           product={selectedProduct}
//           onClose={() => setSelectedProduct(null)}
//           onLogin={onLogin}
//         />
//       )}

//       {promoBanner && (
//         <div className="bg-gradient-to-r from-gray-500 via-green-600 to-blue-500 text-white py-2 px-4 flex items-center justify-center gap-3 text-xs font-medium relative">
//           <span>New member deal — <strong>15% off</strong> your first order with code <span className="bg-white/40 px-2 py-0.5 rounded font-bold tracking-wide">WELCOME15</span></span>
//           <span className="ml-2 bg-green-600 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Limited time</span>
//           <button onClick={() => setPromoBanner(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"><X size={14} /></button>
//         </div>
//       )}

//       {/* Sticky Navbar */}
//       <div style={{ background: 'linear-gradient(135deg, #0823b9 60%, #0d24ac 5%, #0347a1 100%)' }} className="border-b border-blue-400 shadow-md shadow-blue-800 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
//           <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => switchSection('home')}>
//             <img src={LOGO} alt="PSP MART" className="w-9 h-9 rounded-xl object-cover shadow" />
//           </div>
//           <nav className="hidden md:flex items-center gap-1">
//             {NAV_ITEMS.map(nav => (
//               <button key={nav.key} onClick={() => switchSection(nav.key)} className="nav-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
//                 style={{ background: activeSection === nav.key ? '#eff6ff' : 'transparent', color: activeSection === nav.key ? '#1d4ed8' : '#d9dde4', fontWeight: activeSection === nav.key ? 700 : 500, boxShadow: activeSection === nav.key ? 'inset 0 0 0 1px #bfdbfe' : 'none' }}>
//                 {nav.icon} {nav.label}
//               </button>
//             ))}
//           </nav>
//           <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
//             <Search size={13} className="text-slate-400 flex-shrink-0" />
//             <input type="text" placeholder="Search products…" value={searchQuery}
//               onChange={e => { setSearchQuery(e.target.value); if (e.target.value.length > 1) switchSection('products'); }}
//               className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none flex-1" />
//             {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600"><X size={12} /></button>}
//           </div>
//           <div style={{color:'blue'}} className="hidden md:flex items-center gap-2 text-xl font-extrabold px-3 py-1.5 rounded-lg flex-shrink-0">Online Market</div>
//           <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 active:scale-95 transition flex-shrink-0"
//             onClick={() => setMobileMenuOpen(o => !o)}>
//             {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>

//         {mobileMenuOpen && (
//           <div className="md:hidden border-t border-slate-100 bg-white animate-slideDown">
//             <div className="flex items-center gap-2 bg-slate-50 border-b border-slate-100 px-4 py-2.5">
//               <Search size={13} className="text-slate-400 flex-shrink-0" />
//               <input type="text" placeholder="Search products…" value={searchQuery}
//                 onChange={e => { setSearchQuery(e.target.value); if (e.target.value.length > 1) switchSection('products'); }}
//                 className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1" />
//               {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600"><X size={12} /></button>}
//             </div>
//             <nav className="flex flex-col px-3 py-2 gap-0.5">
//               {NAV_ITEMS.map(nav => (
//                 <button key={nav.key} onClick={() => switchSection(nav.key)}
//                   className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left w-full"
//                   style={{ background: activeSection === nav.key ? '#eff6ff' : 'transparent', color: activeSection === nav.key ? '#1d4ed8' : '#475569', fontWeight: activeSection === nav.key ? 700 : 500 }}>
//                   <span className={activeSection === nav.key ? 'text-blue-600' : 'text-slate-400'}>{nav.icon}</span>
//                   {nav.label}
//                   {activeSection === nav.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>}
//                 </button>
//               ))}
//             </nav>
//             <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-2.5 border-t border-slate-100">
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span> Online Market
//             </div>
//           </div>
//         )}

//         <div className="flex" style={{ height: 3 }}>
//           {NAV_ITEMS.map(nav => (
//             <div key={nav.key} style={{ flex: 1, background: activeSection === nav.key ? 'linear-gradient(90deg,#1d4ed8,#3b82f6)' : 'transparent', transition: 'background 0.25s ease' }} />
//           ))}
//         </div>
//       </div>

//       <main className="flex-1">

//         {/* HOME */}
//         {activeSection === 'home' && (
//           <div className="section-animate">
//             <div className="relative overflow-hidden">
//               <div className="absolute inset-0 opacity-[1.07]" style={{ backgroundImage: `url(${Angkor})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
//               <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-start gap-10">
//                 <div className="flex-1 text-white">
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {[
//                       { icon: <Shield size={11}/>, label: 'Secure checkout', color: '' },
//                       { icon: <Star size={11}/>,   label: '4.8★ rated',      color: '' },
//                       { icon: <Truck size={11}/>,  label: 'Free shipping $30+', color: 'text-green-300' },
//                     ].map((b,i) => (
//                       <span key={i} className={`flex items-center gap-1 text-xs font-medium border border-white/20 rounded-full px-3 py-1 ${b.color || 'text-blue-200'}`}
//                         style={{ background: 'linear-gradient(135deg, #1d3be9 0%, #0320c0 55%, #0369a1 100%)' }}>
//                         {b.icon} {b.label}
//                       </span>
//                     ))}
//                   </div>
//                   <div className="max-w-2xl flex justify-start items-center px-4 py-2 rounded-lg mb-6">
//                     <h1 style={{ color:'blue' }} className="flex flex-col text-4xl md:text-5xl font-extrabold leading-tight mb-3">
//                       WELLCOME <br /> TO PSP MARKET<br /><br />
//                       <span className="text-white font-normal text-2xl md:text-3xl">Your smart market in Cambodia</span>
//                     </h1>
//                   </div>
//                   <div className="grid grid-cols-3 gap-3 mb-6 max-w-xs">
//                     {stats.map((s, i) => (
//                       <div key={i} className="bg-white/10 border border-white/15 rounded-xl p-3 text-center">
//                         <div style={{color:'blue'}} className="text-lg font-bold">{s.value}</div>
//                         <div className="text-[10px] text-blue-300 mt-0.5">{s.label}</div>
//                       </div>
//                     ))}
//                   </div>
//                   <div className="flex gap-3 mt-5 flex-wrap">
//                     <button onClick={() => openAuth('signin')} className="hero-btn flex items-center gap-2 font-extrabold text-sm px-7 py-3 rounded-xl shadow-lg border border-white/30"
//                       style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(224,231,255,0.95))', color: '#1e3a8a' }}>
//                       <User size={15} /> Sign In <ArrowRight size={13} />
//                     </button>
//                     <button onClick={() => openAuth('register')} className="hero-btn flex items-center gap-2 font-extrabold text-sm px-7 py-3 rounded-xl shadow-lg border border-blue-300/40"
//                       style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff' }}>
//                       <UserPlus size={15} /> Register <ArrowRight size={13} />
//                     </button>
//                   </div>
//                   <p className="text-[10px] text-blue-200/70 mt-2 ml-1">New here? Register for free and get 15% off your first order</p>
//                 </div>
//                 <div className="w-full lg:w-[500px] flex-shrink-0 flex flex-col items-center justify-center">
//                   <label className="logo-drop cursor-pointer group relative flex flex-col items-center justify-center">
//                     <div className="relative">
//                       <div className="w-100 h-100 rounded-full overflow-hidden shadow-2xl border-4 border-white/30 bg-white/10 flex items-center justify-center" style={{ backdropFilter: 'blur(8px)' }}>
//                         {heroLogo
//                           ? <img src={heroLogo} alt="Project logo" className="w-full h-full object-cover" />
//                           : <img src={LOGO} alt="PSP MART" className="w-full h-full object-cover hidden md:flex" />}
//                       </div>
//                       <div className="absolute inset-0 rounded-3xl bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
//                         <div className="logo-drop-hint flex flex-col items-center gap-2 text-white"></div>
//                       </div>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>
//             <UserCommentSection />
//             <Foot />
//           </div>
//         )}

//         {/* PRODUCTS */}
//         {activeSection === 'products' && (
//           <div className="section-animate max-w-full mx-auto px-6 py-12 bg-white rounded-2xl shadow border border-slate-200">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Package size={22} className="text-blue-600" /> Products</h2>
//                 <p className="text-xs text-slate-500 mt-1">Browse our catalogue — click any item to sign in & buy</p>
//               </div>
//               <div className="flex md:hidden items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2">
//                 <Search size={13} className="text-slate-400" />
//                 <input type="text" placeholder="Search products…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none flex-1" />
//               </div>
//             </div>
//             {!searchResults && uniqueCategories.length > 0 && (
//               <div className="flex gap-2 flex-wrap mb-6">
//                 {uniqueCategories.map(catLabel => {
//                   const style = CATEGORY_STYLES[catLabel] || DEFAULT_STYLE;
//                   return (
//                     <button key={catLabel} onClick={() => setActiveCategory(catLabel)}
//                       className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition ${activeCategory === catLabel ? `bg-gradient-to-br ${style.bg} ${style.text} ${style.border} shadow-sm` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
//                       <span>{style.emoji}</span> {catLabel}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//             {searchResults && (
//               <div className="flex items-center gap-2 mb-4">
//                 <span className="text-sm text-slate-600">Results for <strong>"{searchQuery}"</strong> — {searchResults.length} items</span>
//                 <button onClick={() => setSearchQuery('')} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><X size={11} /> Clear</button>
//               </div>
//             )}
//             {displayProducts.length > 0 ? (
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//                 {displayProducts.map(product => <PreLoginProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />)}
//               </div>
//             ) : (
//               <div className="text-center py-16 text-slate-400">
//                 <Package size={40} className="mx-auto mb-3 opacity-30" />
//                 <p className="text-sm font-medium text-slate-500">{searchResults ? `No products match "${searchQuery}"` : 'No products in this category yet.'}</p>
//                 <p className="text-xs mt-1">The admin can add products from the dashboard.</p>
//               </div>
//             )}
//             <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
//               <div>
//                 <p className="font-bold text-base">Want to see more products?</p>
//                 <p className="text-blue-200 text-sm mt-0.5">Sign in or create a free account to access our full catalogue of 10,000+ items.</p>
//               </div>
//               <button onClick={() => openAuth('signin')} className="flex-shrink-0 bg-white text-blue-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition flex items-center gap-2">
//                 Sign in now <ArrowRight size={14} />
//               </button>
//             </div>
//             <Foot />
//           </div>
//         )}

//         {/* DEALS */}
//         {activeSection === 'deals' && (
//           <div className="section-animate bg-white py-12 rounded-2xl shadow border border-slate-200">
//             <div className="max-w-7xl mx-auto px-6">
//               <div className="flex items-center justify-between mb-6">
//                 <div>
//                   <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Tag size={22} className="text-orange-500" /> Today's Deals</h2>
//                   <p className="text-xs text-slate-500 mt-1">Featured products — sign in to buy</p>
//                 </div>
//                 <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold bg-red-50 border border-red-100 px-3 py-1.5 rounded-full"><Clock size={12} /> Limited stock</div>
//               </div>
//               {allProducts.length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {allProducts.slice(0, 3).map((product, i) => {
//                     const style = CATEGORY_STYLES[product.category] || DEFAULT_STYLE;
//                     const gradients = ['from-orange-500 to-red-500', 'from-pink-500 to-purple-500', 'from-blue-500 to-teal-500'];
//                     return (
//                       <div key={product.id} onClick={() => setSelectedProduct(product)} className="deal-hover relative rounded-2xl overflow-hidden cursor-pointer transition-transform shadow-md">
//                         <div className={`bg-gradient-to-br ${gradients[i % 3]} p-6 text-white`}>
//                           <div className="w-14 h-14 rounded-xl bg-white/20 overflow-hidden mb-3 flex items-center justify-center">
//                             {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} /> : <span className="text-3xl">{style.emoji}</span>}
//                           </div>
//                           <p className="font-bold text-base leading-tight">{product.name}</p>
//                           <p className="text-white/80 text-xs mt-1 mb-3 line-clamp-2">{product.description || product.category}</p>
//                           <div className="flex items-center gap-2">
//                             <span className="text-xl font-extrabold">${Number(product.price || 0).toFixed(2)}</span>
//                             <span className="ml-auto bg-white/20 border border-white/30 text-white text-xs font-bold px-2.5 py-1 rounded-full">{product.category}</span>
//                           </div>
//                         </div>
//                         <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition flex items-end justify-end p-3">
//                           <span className="text-[10px] text-white/80 bg-black/20 px-2 py-0.5 rounded-full">Sign in to buy →</span>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="text-center py-12 text-slate-400"><Package size={32} className="mx-auto mb-2 opacity-40" /><p className="text-sm">No deals yet — check back after the admin adds products.</p></div>
//               )}
//               {allProducts.length > 3 && (
//                 <div className="mt-8 pb-12 border-b border-slate-200">
//                   <h3 className="text-base font-bold text-slate-700 mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-blue-600" /> Trending this week</h3>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                     {allProducts.slice(-4).map(p => {
//                       const style = CATEGORY_STYLES[p.category] || DEFAULT_STYLE;
//                       return (
//                         <div key={p.id} onClick={() => setSelectedProduct(p)} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer">
//                           <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
//                             {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} /> : <span className="text-xl">{style.emoji}</span>}
//                           </div>
//                           <div className="min-w-0">
//                             <p className="text-xs font-semibold text-slate-800 leading-tight truncate">{p.name}</p>
//                             <p className="text-xs text-blue-700 font-bold mt-0.5">${Number(p.price || 0).toFixed(2)}</p>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <Foot />
//           </div>
//         )}

//         {/* OFFERS */}
//         {activeSection === 'offers' && (
//           <div className="section-animate max-w-full mx-auto px-6 py-12">
//             <div className="text-center mb-10">
//               <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2"><Gift size={22} className="text-pink-500" /> Special Offers</h2>
//               <p className="text-sm text-slate-500 mt-1">Exclusive deals for PSP MART shoppers — sign in to redeem</p>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
//               {OFFERS_DATA.map((offer, i) => (
//                 <div key={i} className="offer-hover rounded-2xl overflow-hidden shadow-md transition-transform cursor-pointer" onClick={() => openAuth('signin')}>
//                   <div style={{ background: offer.gradient }} className="p-6 text-white">
//                     <div className="text-3xl mb-2">{offer.icon}</div>
//                     <div className="text-2xl font-black tracking-tight">{offer.discount}</div>
//                     <div className="text-xs font-bold opacity-80 mt-1">{offer.label}</div>
//                     <p className="text-xs opacity-70 mt-2 leading-relaxed">{offer.desc}</p>
//                   </div>
//                   <div className="bg-white px-5 py-3 flex items-center justify-between">
//                     <div>
//                       <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Promo code</p>
//                       <p className="font-mono font-black text-blue-700 text-sm tracking-wider mt-0.5">{offer.code}</p>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-[10px] text-red-500 font-semibold">{offer.expires}</p>
//                       <button onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(offer.code).catch(() => {}); }}
//                         className="mt-1 text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2.5 py-1 rounded-lg hover:bg-blue-100 transition">Copy</button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="rounded-2xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a8a)' }}>
//               <div className="p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-white">
//                 <div className="flex-1">
//                   <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">⭐ LOYALTY REWARDS</p>
//                   <h3 className="text-2xl font-extrabold">Earn points on every purchase</h3>
//                   <p className="text-blue-300 text-sm mt-3 leading-relaxed max-w-md">Join the PSP MART rewards program. Earn 1 point per $1 spent. Redeem for discounts, free shipping, and exclusive member gifts.</p>
//                   <div className="flex gap-4 mt-5 flex-wrap">
//                     {[['100pts','Free delivery'],['250pts','$5 off'],['500pts','$15 off'],['1000pts','Free gift']].map(([pts,reward],i) => (
//                       <div key={i} className="bg-white/10 border border-white/15 rounded-xl px-4 py-3 text-center">
//                         <div className="text-sm font-extrabold text-yellow-400">{pts}</div>
//                         <div className="text-[10px] text-blue-300 mt-0.5">{reward}</div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//                 <button onClick={() => openAuth('register')} className="flex-shrink-0 bg-white text-blue-900 font-extrabold text-sm px-7 py-3.5 rounded-xl hover:bg-blue-50 transition shadow-lg">Join for free →</button>
//               </div>
//             </div>
//             <Foot />
//           </div>
//         )}

//         {/* CONTACT */}
//         {activeSection === 'contact' && (
//           <div className="section-animate max-w-full mx-auto px-6 py-12">
//             <div className="text-center mb-8">
//               <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2"><Phone size={22} className="text-blue-600" /> Contact Us</h2>
//               <p className="text-sm text-slate-500 mt-1">We're here to help — reach out anytime</p>
//             </div>
//             {(() => {
//               const contacts = [
//                 { icon: 'Call',     title: 'Phone',    value: '+855 93 683 574',       desc: 'Mon–Sat, 8am–6pm (ICT)',    color: 'text-green-600', href: 'tel:+85593683574',                          hoverRing: 'hover:ring-2 hover:ring-blue-300' },
//                 { icon: 'Email',    title: 'Email',    value: 'sopheakp175@gmail.com', desc: 'Reply within 24 hours',     color: 'text-red-600',   href: 'mailto:sopheakp175@gmail.com',              hoverRing: 'hover:ring-2 hover:ring-emerald-300' },
//                 { icon: 'Address',  title: 'Address',  value: 'Phnom Penh, Cambodia',  desc: 'Street 271, Toul Kork',     color: 'text-blue-800',  href: 'https://maps.app.goo.gl/5h1a7zihk76gWojYA', hoverRing: 'hover:ring-2 hover:ring-amber-300' },
//                 { icon: 'Telegram', title: 'Telegram', value: '@pheaklove12',           desc: 'Chat with us instantly',    color: 'text-sky-600',   href: 'https://t.me/pheaklove12',                  hoverRing: 'hover:ring-2 hover:ring-sky-300' },
//                 { icon: 'Facebook', title: 'Facebook', value: 'Phy Sopheak',            desc: 'Chat with us instantly',    color: 'text-blue-600',  href: 'https://web.facebook.com/?_rdc=1&_rdr#',    hoverRing: 'hover:ring-2 hover:ring-sky-300' },
//               ];
//               return (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
//                   {contacts.map((c, i) => (
//                     <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
//                       className={`group bg-slate-400 border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer no-underline block ${c.hoverRing}`}
//                       style={{ textDecoration: 'none' }}>
//                       <div className={`w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>{c.icon}</div>
//                       <p className="font-bold text-slate-800 mb-1">{c.title}</p>
//                       <p className="text-sm font-semibold text-blue-700 break-all">{c.value}</p>
//                       <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
//                     </a>
//                   ))}
//                 </div>
//               );
//             })()}
//             <div style={{ background: 'linear-gradient(135deg, #2359cf 0%, #0320c0 55%, #0369a1 100%)' }} className="max-w-lg mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
//               <h3 className="font-bold text-slate-900 mb-4 text-center">Send us a Email message</h3>
//               <form onSubmit={async (event) => {
//                 event.preventDefault();
//                 const button = event.target.querySelector('button[type="submit"]');
//                 const originalText = button.innerHTML;
//                 button.innerText = "Sending..."; button.disabled = true;
//                 const formData = new FormData(event.target);
//                 formData.append("access_key", "b6e4d480-6acd-4232-b023-3df1c7b31e3f");
//                 try {
//                   const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
//                   const data = await response.json();
//                   if (data.success) { alert('Message sent! We will get back to you soon.'); event.target.reset(); }
//                   else { alert('Oops! Something went wrong. Please try again.'); }
//                 } catch { alert('Network error. Please check your connection.'); }
//                 finally { button.innerHTML = originalText; button.disabled = false; }
//               }} className="space-y-3">
//                 <input type="text" name="name" required placeholder="Your name" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
//                 <input type="email" name="email" required placeholder="your@email.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
//                 <textarea rows={3} name="message" required placeholder="How can we help you?" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none" />
//                 <button type="submit" className="w-full py-2.5 bg-blue-800 hover:bg-slate-900 text-white hover:text-blue-200 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
//                   <Mail size={14} /> Send Message
//                 </button>
//               </form>
//             </div>
//             <Foot />
//           </div>
//         )}

//       </main>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // INNER APP
// // ─────────────────────────────────────────────
// function AppInner() {
//   const { products } = useContext(ShopContext);
//   const [isLoggedIn,        setIsLoggedIn]        = useState(false);
//   const [userRole,          setUserRole]           = useState(null);
//   const [email,             setEmail]              = useState('');
//   const [isLoading,         setIsLoading]          = useState(false);
//   const [pendingRole,       setPendingRole]        = useState(null);
//   const [pendingEmail,      setPendingEmail]       = useState('');
//   const [pendingView,       setPendingView]        = useState('shop-home');
//   const [view,              setView]               = useState('shop-home');
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [loginKey,          setLoginKey]           = useState(0);
//   const isAdminView = view.startsWith('admin-');

//   useEffect(() => {
//     if (!isLoading) return;
//     const timer = setTimeout(() => {
//       setIsLoading(false); setIsLoggedIn(true);
//       setUserRole(pendingRole); setEmail(pendingEmail); setView(pendingView);
//     }, 2200);
//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   const handleLogin = (role, userEmail, userName) => {
//     setPendingRole(role);
//     setPendingEmail(userEmail);
//     setPendingView(role === 'admin' ? 'admin-home' : 'shop-home');
//     setLoginKey(k => k + 1);
//     setIsLoading(true);
//   };

//   const handleLogout = () => { setIsLoggedIn(false); setUserRole(null); setEmail(''); setView('shop-home'); };

//   if (isLoading)   return <LoadingScreen role={pendingRole} />;
//   if (!isLoggedIn) return <LoginPage onLogin={handleLogin} products={products} />;

//   return (
//     <div className="min-h-screen pt-10 bg-blue-400/20  text-gray-800 tracking-tight flex flex-col ">
//       {!isAdminView && (
//         <div className="relative">
//           <Navbar setView={setView} userRole={userRole} handleLogout={handleLogout} userEmail={email} loginKey={loginKey} />
//           <div className="absolute top-4 right-44 items-center gap-2  border border-slate-200 py-1 px-3 rounded-lg text-xs">
//             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//           </div>
//         </div>
//       )}
//       <div className="flex flex-1">
//         {isAdminView && (
//           <div className="flex flex-col md:flex md:flex-col bg-white text-white min-h-screen">
//             <div className="p-4 border-b border-gray-800 flex absolute top-0 left-0 right-0 items-center justify-between gap-2 bg-blue-800">
//               <div className="flex items-center gap-2 ">
//                 <Shield size={16} className="text-green-600" />
//                 <span className="text-xs font-bold text-gray-300 truncate max-w-[100px]">{email}</span>
//               </div>
//               <button onClick={handleLogout} className="p-1.5 bg-green-600 hover:bg-red-900 border border-red-900/50 rounded-lg text-red-900 hover:text-green-600 transition" title="Logout Session">
//                 <LogOut size={14} />
//               </button>
//             </div>
//             <Sidebar setView={setView} currentView={view} />
//           </div>
//         )}
//         <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
//           {view === 'shop-home'      && <Home setView={setView} setSelectedProductId={setSelectedProductId} />}
//           {view === 'shop-detail'    && <ProductDetail productId={selectedProductId} setView={setView} />}
//           {view === 'shop-cart'      && <Cart userEmail={email} userRole={userRole} />}
//           {view === 'admin-home'     && <DashboardHome />}
//           {view === 'admin-products' && <ManageProducts />}
//           {view === 'admin-orders'   && <Orders />}
//           {view === 'admin-graphic'  && <Graphic />}
//           {view === 'admin-users'    && <Users />}
//           {view === 'admin-checkout' && <Checkin />}
//           {view === 'admin-evaluate' && <Evaloute />}
//           {view === 'admin-telegram' && <TelegramDashboard userRole={userRole} userEmail={email} />}
//         </main>
//       </div>
//       <Foot />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // ROOT APP
// // ─────────────────────────────────────────────
// export default function App() {
//   return (
//     <ShopProvider>
//       <AppInner />
//     </ShopProvider>
//   );
// }






















import React, { useState, useEffect, useRef, useContext } from 'react';
import { ShopProvider, ShopContext } from './context/ShopContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Foot from './components/Foot';
import LOGO from './assets/BrandLogo.png';
import Angkor from './assets/Angkor.png';

import {
  Eye, EyeOff, Lock, Mail, Shield, User, LogOut,
  ShoppingBag, Tag, Truck, Headphones, UserPlus,
  Star, RefreshCw, CheckCircle, ArrowRight, X,
  Gift, Zap, Home as HomeIcon, Phone, ChevronRight,
  Heart, ShoppingCart, Search, Filter, Grid, List,
  TrendingUp, Award, Clock, Package, Menu, Camera,
} from 'lucide-react';

import Home from './pages/ClientShop/Home';
import ProductDetail from './pages/ClientShop/ProductDetail';
import Cart from './pages/ClientShop/Cart';
import DashboardHome from './pages/AdminDashboard/DashboardHome';
import ManageProducts from './pages/AdminDashboard/ManageProducts';
import Orders from './pages/AdminDashboard/Orders';
import Graphic from './pages/AdminDashboard/GraphicAnalytics';
import Users from './pages/AdminDashboard/UserRegister';
import Checkin from './pages/AdminDashboard/CheckInOut';
import Evaloute from './pages/AdminDashboard/EvaluatePerformance';
import TelegramDashboard from './pages/AdminDashboard/TelegramDashboard';

// ─────────────────────────────────────────────────────────────────────────────
// API BASE URL  — change this to your deployed backend URL
// ─────────────────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────────────────────────
// Disposable / fake email blocklist
// ─────────────────────────────────────────────────────────────────────────────
const BLOCKED_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com',
  'throwam.com','yopmail.com','trashmail.com','sharklasers.com',
  'guerrillamailblock.com','spam4.me','fakeinbox.com','dispostable.com',
  'maildrop.cc','mailnull.com','spamgourmet.com','trashmail.io',
  'discard.email','getnada.com','tempr.email','airmail.ac',
  'spamex.com','trbvm.com','spamoff.de','mailexpire.com','getairmail.com',
  'throwaway.email','emailondeck.com','mintemail.com','tempinbox.com',
]);

function isEmailLegit(email) {
  if (!email || typeof email !== 'string') return false;
  const lower = email.toLowerCase().trim();
  if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(lower)) return false;
  const domain = lower.split('@')[1];
  if (!domain || !domain.includes('.')) return false;
  if (BLOCKED_DOMAINS.has(domain)) return false;
  return true;
}

// Simple FNV-1a hash — same algorithm used in server password_hash column
function simpleHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16);
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoadingScreen({ role }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100; }
        return prev + 2;
      });
    }, 36);
    return () => clearInterval(interval);
  }, []);
  const isAdmin = role === 'admin';
  const accentColor = isAdmin ? '#991b1b' : '#1e40af';
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: `linear-gradient(to bottom, transparent 10%, #041dd3 100%), url(${Angkor}) center/cover no-repeat`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
    }}>
      <style>{`
        @keyframes spin-ring { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes counter-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
        @keyframes pulse-center { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.8; } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .ring { position: absolute; border-radius: 50%; border-style: solid; }
      `}</style>
      <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 48 }}>
        <div className="ring" style={{ width: 220, height: 220, top: 0, left: 0, borderWidth: 3, borderColor: `${accentColor}30 ${accentColor} ${accentColor}30 ${accentColor}`, animation: 'spin-ring 3s linear infinite' }} />
        <div className="ring" style={{ width: 185, height: 185, top: 17.5, left: 17.5, borderWidth: 2.5, borderColor: `${accentColor}15 ${accentColor}90 ${accentColor}15 ${accentColor}90`, animation: 'counter-spin 2.2s linear infinite' }} />
        <div className="ring" style={{ width: 152, height: 152, top: 34, left: 34, borderWidth: 3, borderColor: `${accentColor} ${accentColor}25 ${accentColor} ${accentColor}25`, animation: 'spin-ring 1.8s linear infinite' }} />
        <div className="ring" style={{ width: 118, height: 118, top: 51, left: 51, borderWidth: 2, borderColor: `${accentColor}60 ${accentColor}ff ${accentColor}60 ${accentColor}ff`, animation: 'counter-spin 1.3s linear infinite' }} />
        <div className="ring" style={{ width: 86, height: 86, top: 67, left: 67, borderWidth: 2.5, borderColor: `${accentColor} transparent ${accentColor} transparent`, animation: 'spin-ring 0.9s linear infinite' }} />
        <div style={{
          position: 'absolute', top: '38%', left: '39%', transform: 'translate(-50%,-50%)',
          width: 52, height: 52, borderRadius: 14,
          background: `${accentColor}22`, border: `1.5px solid ${accentColor}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'pulse-center 2s ease-in-out infinite',
        }}>
          {isAdmin ? <Shield size={24} color={accentColor} /> : <User size={24} color={accentColor} />}
        </div>
      </div>
      <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease both' }}>
        <p style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.22em', color: `${accentColor}cc`, textTransform: 'uppercase', marginBottom: 6 }}>
          {isAdmin ? 'Admin Portal' : 'PSP MART'}
        </p>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 28, fontWeight: 400 }}>
          {isAdmin ? 'Verifying secure session…' : 'Preparing your experience…'}
        </p>
        <div style={{ width: 220, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.07)', overflow: 'hidden', margin: '0 auto' }}>
          <div style={{ height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${accentColor}, ${isAdmin ? '#f87171' : '#60a5fa'})`, width: `${progress}%`, transition: 'width 0.1s linear' }} />
        </div>
        <p style={{ fontSize: 11, color: 'rgb(23, 20, 20)', marginTop: 8 }}>{progress}%</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GOOGLE / FACEBOOK ICONS
// ─────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// CATEGORY STYLE MAP
// ─────────────────────────────────────────────
const CATEGORY_STYLES = {
  Car:         { emoji: '', bg: 'from-red-100 to-red-50',     text: 'text-red-700',    border: 'border-red-200' },
  Computer:    { emoji: '', bg: 'from-blue-100 to-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  Fruit:       { emoji: '', bg: 'from-green-100 to-green-50', text: 'text-green-700',  border: 'border-green-200' },
  Vegetable:   { emoji: '', bg: 'from-emerald-100 to-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Clothes:     { emoji: '', bg: 'from-pink-100 to-pink-50',   text: 'text-pink-700',   border: 'border-pink-200' },
  Phone:       { emoji: '', bg: 'from-violet-100 to-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  Accessories: { emoji: '', bg: 'from-amber-100 to-amber-50', text: 'text-amber-700',  border: 'border-amber-200' },
  'Hotel Book':{ emoji: '', bg: 'from-cyan-100 to-cyan-50',   text: 'text-cyan-700',   border: 'border-cyan-200' },
  Meet:        { emoji: '', bg: 'from-orange-100 to-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
};
const DEFAULT_STYLE = { emoji: '📦', bg: 'from-slate-100 to-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

// ─────────────────────────────────────────────
// SIGN-IN PROMPT MODAL (product click when not logged in)
// ─────────────────────────────────────────────
function SignInPrompt({ product, onClose, onLogin }) {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [err,      setErr]      = useState('');
  const [loading,  setLoading]  = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!email || !password) { setErr('Please fill in all fields.'); return; }
    if (!isEmailLegit(email)) { setErr('❌ This email address looks invalid or fake.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), passwordHash: simpleHash(password) }),
      });
      const data = await res.json();
      if (res.status === 404) { setErr('🚫 No account found for this email. Please register first.'); return; }
      if (res.status === 401) { setErr('🔑 Incorrect password. Please try again.'); return; }
      if (!res.ok)            { setErr(data.error || 'Sign in failed.'); return; }
      onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
    } catch {
      setErr('⚠️ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fadeUp">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white relative">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/60 hover:text-white transition"><X size={18} /></button>
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-white/20 overflow-hidden flex items-center justify-center flex-shrink-0">
              {product.image
                ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                : <span className="text-3xl">{(CATEGORY_STYLES[product.category] || DEFAULT_STYLE).emoji}</span>}
            </div>
            <div>
              <p className="text-xs text-blue-200 mb-0.5">You selected</p>
              <p className="font-bold text-sm leading-tight">{product.name}</p>
              <p className="text-blue-200 text-xs mt-0.5">${Number(product.price || 0).toFixed(2)} · {product.category}</p>
            </div>
          </div>
          <div className="mt-3 bg-white/10 border border-white/20 rounded-lg p-2 text-center">
            <p className="text-xs text-blue-100">🔒 Sign in to add to cart & checkout securely</p>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-slate-800 text-sm mb-0.5">Sign in to continue</h3>
          <p className="text-xs text-slate-500 mb-4">Use the email & password you registered with.</p>
          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-2.5 rounded-xl mb-3 font-medium flex items-center gap-2">
              <span>⚠️</span><span>{err}</span>
            </div>
          )}
          <form onSubmit={submit} className="space-y-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={13} /></span>
              <input type="email" placeholder="your@email.com" value={email}
                onChange={e => { setEmail(e.target.value); setErr(''); }}
                className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={13} /></span>
              <input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password}
                onChange={e => { setPassword(e.target.value); setErr(''); }}
                className="w-full pl-8 pr-9 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <RefreshCw size={13} className="animate-spin" /> : <><User size={13} /> Sign in & view product <ArrowRight size={13} /></>}
            </button>
          </form>
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400">or</span><div className="flex-1 h-px bg-slate-200" />
          </div>
          <button onClick={() => onLogin('guest', 'guest', 'Guest', null, null)} className="w-full py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
            <Eye size={13} /> Continue as guest
          </button>
          <p className="text-center text-[10px] text-slate-400 mt-2">No account? Close this and register first.</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────
function AuthModal({ onClose, onLogin, defaultTab = 'signin' }) {
  const MY_ADMIN_EMAIL    = "sopheakp175@gmail.com";
  const MY_ADMIN_PASSWORD = "220927";

  const [activeTab,    setActiveTab]    = useState(defaultTab);
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [name,         setName]         = useState('');
  const [rememberMe,   setRememberMe]   = useState(false);
  const [error,        setError]        = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [emailHint,    setEmailHint]    = useState('');
  const [loading,      setLoading]      = useState(false);

  const switchTab = (tab) => {
    setActiveTab(tab); setError(''); setEmailHint('');
    setEmail(''); setPassword(''); setConfirmPass(''); setName('');
  };

  // Live email hint on blur — checks API
  const onEmailBlur = async () => {
    if (!email) { setEmailHint(''); return; }
    if (!isEmailLegit(email)) {
      setEmailHint('⚠️ This email looks invalid or fake.');
      return;
    }
    if (activeTab === 'admin') { setEmailHint(''); return; }

    try {
      const res  = await fetch(`${API}/api/users/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      const exists = data.exists;

      if (activeTab === 'register' && exists) {
        setEmailHint('📧 Already registered — sign in instead.');
      } else if (activeTab === 'signin' && !exists) {
        setEmailHint('🚫 No account found — please register first.');
      } else {
        setEmailHint('');
      }
    } catch {
      setEmailHint('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // ── ADMIN ──────────────────────────────────────────────────────────────
    if (activeTab === 'admin') {
      if (!email || !password) { setError('Please fill in all fields.'); return; }
      if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
        onLogin('admin', email, 'Phy Sopheak', 'ADMIN-001', null);
      } else {
        setError('❌ Access denied. Invalid admin credentials.');
      }
      return;
    }

    // ── REGISTER ───────────────────────────────────────────────────────────
    if (activeTab === 'register') {
      if (!name.trim())        { setError('Please enter your full name.'); return; }
      if (!email)              { setError('Please enter your email.'); return; }
      if (!isEmailLegit(email)) {
        setError('❌ This email is invalid or looks fake. Please use a real email address.');
        return;
      }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPass) { setError('Passwords do not match.'); return; }

      setLoading(true);
      try {
        const res = await fetch(`${API}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id:           `USR-${Date.now()}`,
            name:         name.trim(),
            email:        email.trim().toLowerCase(),
            passwordHash: simpleHash(password),
          }),
        });
        const data = await res.json();
        if (res.status === 409) { setError('📧 This email is already registered. Please sign in instead.'); return; }
        if (!res.ok)            { setError(data.error || 'Registration failed. Please try again.'); return; }
        onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
      } catch {
        setError('⚠️ Network error. Check your connection and try again.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // ── SIGN IN ────────────────────────────────────────────────────────────
    if (!email)    { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter your password.'); return; }
    if (!isEmailLegit(email)) {
      setError('❌ This email address looks invalid.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:        email.trim().toLowerCase(),
          passwordHash: simpleHash(password),
        }),
      });
      const data = await res.json();
      if (res.status === 404) { setError('🚫 No account found for this email. Please register first.'); return; }
      if (res.status === 401) { setError('🔑 Incorrect password. Please try again.'); return; }
      if (!res.ok)            { setError(data.error || 'Sign in failed.'); return; }
      onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
    } catch {
      setError('⚠️ Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modalPop">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-0 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition">
            <X size={15} />
          </button>
          <h2 className="text-lg font-bold text-slate-800 mt-1">
            {activeTab === 'signin'   && 'Sign in to PSP MARKET'}
            {activeTab === 'register' && 'Create your account'}
            {activeTab === 'admin'    && 'Admin Access Only'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 mb-4">
            {activeTab === 'signin'   && 'Sign in to see your orders, wishlist & deals'}
            {activeTab === 'register' && 'Join 50,000+ happy PSP MARKET shoppers'}
            {activeTab === 'admin'    && 'Restricted to authorised personnel only'}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-6 mb-4">
          <div className="bg-slate-100 p-1 rounded-xl flex gap-0.5">
            {[
              { key: 'signin',   label: 'Sign in',  icon: <User size={12} /> },
              { key: 'register', label: 'Register', icon: <UserPlus size={12} /> },
              { key: 'admin',    label: 'Admin',    icon: <Shield size={12} /> },
            ].map(t => (
              <button key={t.key} type="button" onClick={() => switchTab(t.key)}
                className={`flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  activeTab === t.key
                    ? (t.key === 'admin' ? 'bg-red-600 text-white shadow-sm' : 'bg-blue-600 text-white shadow-sm')
                    : 'text-slate-500 hover:text-slate-700'
                }`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 pb-6">
          {activeTab !== 'admin' && (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button type="button" className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"><GoogleIcon /> Google</button>
                <button type="button" className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"><FacebookIcon /> Facebook</button>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400 font-medium">or continue with email</span><div className="flex-1 h-px bg-slate-200" />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 border border-red-200 text-xs p-3 rounded-xl mb-3 font-medium flex items-start gap-2">
              <span className="flex-shrink-0">⚠️</span><span>{error}</span>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-start gap-2">
              <Zap size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 leading-snug">Register now and use <strong>WELCOME15</strong> at checkout for 15% off!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {activeTab === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={14} /></span>
                  <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)}
                    className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={14} /></span>
                <input
                  type="email"
                  placeholder={activeTab === 'admin' ? 'admin@example.com' : 'your@email.com'}
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailHint(''); setError(''); }}
                  onBlur={onEmailBlur}
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 transition ${
                    emailHint ? 'border-amber-400 focus:ring-amber-300/30' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {emailHint && <p className="text-[11px] text-amber-600 mt-1 ml-1">{emailHint}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                {activeTab === 'signin' && <button type="button" className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold transition">Forgot password?</button>}
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={14} /></span>
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-8 pr-9 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {activeTab === 'register' && password.length > 0 && (
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${
                        password.length >= i * 3
                          ? password.length < 6  ? 'bg-red-400'
                          : password.length < 9  ? 'bg-amber-400'
                          : 'bg-green-500'
                          : 'bg-slate-200'
                      }`} />
                    ))}
                  </div>
                  <p className="text-[10px] mt-0.5 text-slate-400">
                    {password.length < 6 ? 'Too short' : password.length < 9 ? 'Fair' : password.length < 12 ? 'Good' : 'Strong'}
                  </p>
                </div>
              )}
            </div>

            {activeTab === 'register' && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={14} /></span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPass}
                    onChange={e => { setConfirmPass(e.target.value); setError(''); }}
                    className={`w-full pl-8 pr-9 py-2.5 border rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 transition ${
                      confirmPass && confirmPass !== password ? 'border-red-300 focus:ring-red-300/30'
                      : confirmPass && confirmPass === password ? 'border-green-400 focus:ring-green-300/30'
                      : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {confirmPass && (
                    <span className="absolute inset-y-0 right-8 flex items-center pr-1 text-sm">
                      {confirmPass === password ? '✅' : '❌'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'signin' && (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-3.5 h-3.5 rounded accent-blue-600" />
                <span className="text-xs text-slate-500">Remember me on this device</span>
              </label>
            )}

            <button type="submit" disabled={loading}
              className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 ${
                activeTab === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}>
              {loading
                ? <RefreshCw size={14} className="animate-spin" />
                : <>
                    {activeTab === 'signin'   && <><User size={14} /> Sign in to PSP MARKET</>}
                    {activeTab === 'register' && <><UserPlus size={14} /> Create my account</>}
                    {activeTab === 'admin'    && <><Shield size={14} /> Verify admin identity</>}
                    <ArrowRight size={14} />
                  </>
              }
            </button>
          </form>

          {activeTab !== 'admin' && (
            <>
              <div className="flex items-center gap-3 my-3"><div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400 font-medium">or</span><div className="flex-1 h-px bg-slate-200" /></div>
              <button type="button" onClick={() => onLogin('guest', 'guest', 'Guest', null, null)} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
                <Eye size={14} /> Browse as guest
              </button>
              <p className="text-center text-[10px] text-slate-400 mt-2">Guest accounts can't save carts or track orders.</p>
            </>
          )}
          {activeTab === 'admin' && (
            <p className="text-center text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-100">Private admin channel. All access attempts are logged.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRE-LOGIN PRODUCT CARD
// ─────────────────────────────────────────────
function PreLoginProductCard({ product, onProductClick }) {
  const [liked, setLiked] = useState(false);
  const style = CATEGORY_STYLES[product.category] || DEFAULT_STYLE;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden group cursor-pointer" onClick={() => onProductClick(product)}>
      <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 h-36 overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        <div className="absolute inset-0 hidden items-center justify-center text-4xl bg-gradient-to-br from-slate-100 to-slate-200">{style.emoji}</div>
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-gray-700 text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">{product.category}</span>
        <button onClick={e => { e.stopPropagation(); setLiked(!liked); }} className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:scale-110 transition">
          <Heart size={13} className={liked ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
        </button>
      </div>
      <div className="p-3">
        <p className="text-xs font-semibold text-slate-800 leading-tight mb-1 line-clamp-2">{product.name}</p>
        {product.description && <p className="text-[10px] text-slate-400 leading-snug mb-1 line-clamp-1">{product.description}</p>}
        {product.variants && product.variants.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1.5">
            {product.variants.slice(0, 2).map((v, i) => (
              <span key={i} className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded text-[9px] font-semibold">{v.label}</span>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm font-bold text-blue-700">${Number(product.price || 0).toFixed(2)}</span>
        </div>
        <button onClick={e => { e.stopPropagation(); onProductClick(product); }} className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded-lg transition flex items-center justify-center gap-1">
          <ShoppingCart size={10} /> Add to cart
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// USER COMMENT SECTION
// ─────────────────────────────────────────────
function UserCommentSection() {
  const [comments, setComments] = useState(() => {
    try { return JSON.parse(localStorage.getItem('psp_comments') || '[]'); } catch { return []; }
  });
  const [username, setUsername] = useState('');
  const [comment,  setComment]  = useState('');
  const [rating,   setRating]   = useState(5);
  const [hovered,  setHovered]  = useState(0);
  const [err,      setErr]      = useState('');
  const [success,  setSuccess]  = useState(false);

  const AVATAR_COLORS = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500'];
  const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
  const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim())          { setErr('Please enter your name.'); return; }
    if (!comment.trim())           { setErr('Please write a comment.'); return; }
    if (comment.trim().length < 5) { setErr('Comment is too short (minimum 5 characters).'); return; }
    const newComment = {
      id: Date.now(), username: username.trim(), comment: comment.trim(), rating,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    const updated = [newComment, ...comments];
    setComments(updated);
    try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
    setUsername(''); setComment(''); setRating(5); setErr(''); setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
  };

  const totalReviews = comments.length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-3 mb-2">
        <h3 className="text-lg font-bold text-slate-800">Customer Reviews</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">{totalReviews} reviews</span>
      </div>
      <div className="bg-blue-700 border border-blue-100 rounded-2xl p-5 mb-8">
        <h4 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2"><UserPlus size={15} className="text-white" /> Enter your review</h4>
        {success && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2.5 rounded-xl mb-3"><CheckCircle size={13} /> Thanks for your review! It's now live below.</div>}
        {err && <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2.5 rounded-xl mb-3">{err}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Your name *</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={13} /></span>
                <input type="text" placeholder="e.g. Sokha, John…" value={username} onChange={e => { setUsername(e.target.value); setErr(''); }} maxLength={40}
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Rating *</label>
              <div className="flex items-center gap-1 h-[42px]">
                {[1,2,3,4,5].map(star => (
                  <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(star)} className="text-2xl transition-transform hover:scale-110 focus:outline-none leading-none">
                    <span className={(hovered || rating) >= star ? 'text-slate-900' : 'text-slate-300'}>★</span>
                  </button>
                ))}
                <span className="text-xs text-white ml-1">{RATING_LABELS[hovered || rating]}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Your comment *</label>
            <textarea rows={3} placeholder="Tell others about your experience with PSP MARKET…" value={comment} onChange={e => { setComment(e.target.value); setErr(''); }} maxLength={300}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none" />
            <p className="text-[10px] text-slate-400 text-right mt-0.5">{comment.length}/300</p>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm">Post</button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {comments.map(c => (
          <div key={c.id} className="bg-white border border-slate-400 rounded-2xl p-5 shadow-sm relative">
            <span className="absolute top-3 right-3 text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">Customer</span>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{c.username[0].toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-slate-700 block truncate">{c.username}</span>
                <p className="text-[10px] text-slate-400">{c.date}</p>
              </div>
              <span className="text-slate-900 text-xs mt-5 flex-shrink-0">{'★'.repeat(c.rating)}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">"{c.comment}"</p>
          </div>
        ))}
      </div>
      {comments.length === 0 && <p className="text-center text-xs text-slate-400 mt-4">Be the first to leave a review above!</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────
function LoginPage({ onLogin, products }) {
  const [promoBanner,    setPromoBanner]    = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection,  setActiveSection]  = useState('home');
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [selectedProduct,setSelectedProduct]= useState(null);
  const [showAuthModal,  setShowAuthModal]  = useState(false);
  const [authModalTab,   setAuthModalTab]   = useState('signin');
  const [heroLogo,       setHeroLogo]       = useState(null);

  const openAuth = (tab = 'signin') => { setAuthModalTab(tab); setShowAuthModal(true); };

  const switchSection = (section) => {
    setActiveSection(section); setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allProducts      = products || [];
  const uniqueCategories = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
  useEffect(() => {
    if (uniqueCategories.length > 0 && !activeCategory) setActiveCategory(uniqueCategories[0]);
  }, [uniqueCategories.length]); // eslint-disable-line

  const searchResults   = searchQuery.trim().length > 1
    ? allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;
  const displayProducts = searchResults || (activeCategory ? allProducts.filter(p => p.category === activeCategory) : allProducts);

  const stats = [
    { value: '50K+', label: 'Happy customers' },
    { value: '10K+', label: 'Products' },
    { value: '4.8★', label: 'Avg. rating' },
  ];

  const OFFERS_DATA = [
    { code: 'WELCOME15', discount: '15% OFF',      label: 'New Members',  desc: 'First order discount for all new sign-ups',  gradient: 'linear-gradient(135deg,#1e40af,#3b82f6)', icon: '🎉', expires: 'No expiry' },
    { code: 'SAVE30',    discount: '$30 OFF',       label: 'Orders $150+', desc: 'Spend $150 or more and save $30 instantly',   gradient: 'linear-gradient(135deg,#7c3aed,#a855f7)', icon: '💜', expires: 'Ends Jun 30' },
    { code: 'FREESHIP',  discount: 'Free Shipping', label: 'All Orders',   desc: 'Free delivery on any order this weekend',     gradient: 'linear-gradient(135deg,#059669,#10b981)', icon: '🚚', expires: 'Weekend only' },
    { code: 'FLASH50',   discount: '50% OFF',       label: 'Flash Sale',   desc: 'Selected electronics & accessories only',      gradient: 'linear-gradient(135deg,#dc2626,#f97316)', icon: '⚡', expires: 'Today only' },
  ];

  const NAV_ITEMS = [
    { key: 'home',     label: 'Home',     icon: <HomeIcon size={4} /> },
    { key: 'products', label: 'Products', icon: <Package size={4} /> },
    { key: 'deals',    label: 'Deals',    icon: <Tag size={4} /> },
    { key: 'offers',   label: 'Offers',   icon: <Gift size={4} /> },
    { key: 'contact',  label: 'Contact',  icon: <Phone size={4} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <style>{`
        @keyframes fadeUp    { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideIn   { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes modalPop  { from { opacity:0; transform:scale(0.94) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        .animate-fadeUp      { animation: fadeUp   0.3s ease both; }
        .animate-slideDown   { animation: slideDown 0.25s ease both; }
        .animate-modalPop    { animation: modalPop  0.28s cubic-bezier(0.34,1.56,0.64,1) both; }
        .section-animate     { animation: slideIn   0.35s ease both; }
        .line-clamp-2        { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
        .line-clamp-1        { display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
        .nav-btn             { transition: all 0.2s ease; }
        .nav-btn:hover       { background: #f1f5f9 !important; color: #1d4ed8 !important; }
        .deal-hover:hover    { transform: scale(1.02); }
        .offer-hover:hover   { transform: translateY(-4px); }
        .mobile-nav-item     { transition: all 0.15s ease; }
        .mobile-nav-item:hover { background: #f1f5f9 !important; }
        .hero-btn            { transition: all 0.2s ease; }
        .hero-btn:hover      { transform: translateY(-2px); filter: brightness(1.08); }
      `}</style>

      {showAuthModal && (
        <AuthModal
          defaultTab={authModalTab}
          onClose={() => setShowAuthModal(false)}
          onLogin={(role, email, name, id, avatar) => {
            setShowAuthModal(false);
            onLogin(role, email, name, id, avatar);
          }}
        />
      )}
      {selectedProduct && (
        <SignInPrompt
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onLogin={onLogin}
        />
      )}

      {promoBanner && (
        <div className="bg-gradient-to-r from-gray-500 via-green-600 to-blue-500 text-white py-2 px-4 flex items-center justify-center gap-3 text-xs font-medium relative">
          <span>New member deal — <strong>15% off</strong> your first order with code <span className="bg-white/40 px-2 py-0.5 rounded font-bold tracking-wide">WELCOME15</span></span>
          <span className="ml-2 bg-green-600 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Limited time</span>
          <button onClick={() => setPromoBanner(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"><X size={14} /></button>
        </div>
      )}

      {/* Sticky Navbar */}
      <div style={{ background: 'linear-gradient(135deg, #0823b9 60%, #0d24ac 5%, #0347a1 100%)' }} className="border-b border-blue-400 shadow-md shadow-blue-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer" onClick={() => switchSection('home')}>
            <img src={LOGO} alt="PSP MART" className="w-9 h-9 rounded-xl object-cover shadow" />
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(nav => (
              <button key={nav.key} onClick={() => switchSection(nav.key)} className="nav-btn flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
                style={{ background: activeSection === nav.key ? '#eff6ff' : 'transparent', color: activeSection === nav.key ? '#1d4ed8' : '#d9dde4', fontWeight: activeSection === nav.key ? 700 : 500, boxShadow: activeSection === nav.key ? 'inset 0 0 0 1px #bfdbfe' : 'none' }}>
                {nav.icon} {nav.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 flex-1 max-w-xs">
            <Search size={13} className="text-slate-400 flex-shrink-0" />
            <input type="text" placeholder="Search products…" value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); if (e.target.value.length > 1) switchSection('products'); }}
              className="bg-transparent text-xs text-slate-700 placeholder-slate-400 outline-none flex-1" />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600"><X size={12} /></button>}
          </div>
          <div style={{color:'blue'}} className="hidden md:flex items-center gap-2 text-xl font-extrabold px-3 py-1.5 rounded-lg flex-shrink-0">Online Market</div>
          <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 active:scale-95 transition flex-shrink-0"
            onClick={() => setMobileMenuOpen(o => !o)}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white animate-slideDown">
            <div className="flex items-center gap-2 bg-slate-50 border-b border-slate-100 px-4 py-2.5">
              <Search size={13} className="text-slate-400 flex-shrink-0" />
              <input type="text" placeholder="Search products…" value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); if (e.target.value.length > 1) switchSection('products'); }}
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none flex-1" />
              {searchQuery && <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600"><X size={12} /></button>}
            </div>
            <nav className="flex flex-col px-3 py-2 gap-0.5">
              {NAV_ITEMS.map(nav => (
                <button key={nav.key} onClick={() => switchSection(nav.key)}
                  className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left w-full"
                  style={{ background: activeSection === nav.key ? '#eff6ff' : 'transparent', color: activeSection === nav.key ? '#1d4ed8' : '#475569', fontWeight: activeSection === nav.key ? 700 : 500 }}>
                  <span className={activeSection === nav.key ? 'text-blue-600' : 'text-slate-400'}>{nav.icon}</span>
                  {nav.label}
                  {activeSection === nav.key && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>}
                </button>
              ))}
            </nav>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 py-2.5 border-t border-slate-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span> Online Market
            </div>
          </div>
        )}

        <div className="flex" style={{ height: 3 }}>
          {NAV_ITEMS.map(nav => (
            <div key={nav.key} style={{ flex: 1, background: activeSection === nav.key ? 'linear-gradient(90deg,#1d4ed8,#3b82f6)' : 'transparent', transition: 'background 0.25s ease' }} />
          ))}
        </div>
      </div>

      <main className="flex-1">

        {activeSection === 'home' && (
          <div className="section-animate">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 opacity-[1.07]" style={{ backgroundImage: `url(${Angkor})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-start gap-10">
                <div className="flex-1 text-white">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {[
                      { icon: <Shield size={11}/>, label: 'Secure checkout', color: '' },
                      { icon: <Star size={11}/>,   label: '4.8★ rated',      color: '' },
                      { icon: <Truck size={11}/>,  label: 'Free shipping $30+', color: 'text-green-300' },
                    ].map((b,i) => (
                      <span key={i} className={`flex items-center gap-1 text-xs font-medium border border-white/20 rounded-full px-3 py-1 ${b.color || 'text-blue-200'}`}
                        style={{ background: 'linear-gradient(135deg, #1d3be9 0%, #0320c0 55%, #0369a1 100%)' }}>
                        {b.icon} {b.label}
                      </span>
                    ))}
                  </div>
                  <div className="max-w-2xl flex justify-start items-center px-4 py-2 rounded-lg mb-6">
                    <h1 style={{ color:'blue' }} className="flex flex-col text-4xl md:text-5xl font-extrabold leading-tight mb-3">
                      WELLCOME <br /> TO PSP MARKET<br /><br />
                      <span className="text-white font-normal text-2xl md:text-3xl">Your smart market in Cambodia</span>
                    </h1>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6 max-w-xs">
                    {stats.map((s, i) => (
                      <div key={i} className="bg-white/10 border border-white/15 rounded-xl p-3 text-center">
                        <div style={{color:'blue'}} className="text-lg font-bold">{s.value}</div>
                        <div className="text-[10px] text-blue-300 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-5 flex-wrap">
                    <button onClick={() => openAuth('signin')} className="hero-btn flex items-center gap-2 font-extrabold text-sm px-7 py-3 rounded-xl shadow-lg border border-white/30"
                      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(224,231,255,0.95))', color: '#1e3a8a' }}>
                      <User size={15} /> Sign In <ArrowRight size={13} />
                    </button>
                    <button onClick={() => openAuth('register')} className="hero-btn flex items-center gap-2 font-extrabold text-sm px-7 py-3 rounded-xl shadow-lg border border-blue-300/40"
                      style={{ background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', color: '#fff' }}>
                      <UserPlus size={15} /> Register <ArrowRight size={13} />
                    </button>
                  </div>
                  <p className="text-[10px] text-blue-200/70 mt-2 ml-1">New here? Register for free and get 15% off your first order</p>
                </div>
                <div className="w-full lg:w-[500px] flex-shrink-0 flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="w-100 h-100 rounded-full overflow-hidden shadow-2xl border-4 border-white/30 bg-white/10 flex items-center justify-center" style={{ backdropFilter: 'blur(8px)' }}>
                      {heroLogo
                        ? <img src={heroLogo} alt="Project logo" className="w-full h-full object-cover" />
                        : <img src={LOGO} alt="PSP MART" className="w-full h-full object-cover hidden md:flex" />}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <UserCommentSection />
            <Foot />
          </div>
        )}

        {activeSection === 'products' && (
          <div className="section-animate max-w-full mx-auto px-6 py-12 bg-white rounded-2xl shadow border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Package size={22} className="text-blue-600" /> Products</h2>
                <p className="text-xs text-slate-500 mt-1">Browse our catalogue — click any item to sign in & buy</p>
              </div>
            </div>
            {!searchResults && uniqueCategories.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6">
                {uniqueCategories.map(catLabel => {
                  const style = CATEGORY_STYLES[catLabel] || DEFAULT_STYLE;
                  return (
                    <button key={catLabel} onClick={() => setActiveCategory(catLabel)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition ${activeCategory === catLabel ? `bg-gradient-to-br ${style.bg} ${style.text} ${style.border} shadow-sm` : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                      <span>{style.emoji}</span> {catLabel}
                    </button>
                  );
                })}
              </div>
            )}
            {searchResults && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-slate-600">Results for <strong>"{searchQuery}"</strong> — {searchResults.length} items</span>
                <button onClick={() => setSearchQuery('')} className="text-xs text-blue-600 hover:underline flex items-center gap-1"><X size={11} /> Clear</button>
              </div>
            )}
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {displayProducts.map(product => <PreLoginProductCard key={product.id} product={product} onProductClick={setSelectedProduct} />)}
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400">
                <Package size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium text-slate-500">{searchResults ? `No products match "${searchQuery}"` : 'No products in this category yet.'}</p>
              </div>
            )}
            <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
              <div>
                <p className="font-bold text-base">Want to see more products?</p>
                <p className="text-blue-200 text-sm mt-0.5">Sign in or create a free account to access our full catalogue.</p>
              </div>
              <button onClick={() => openAuth('signin')} className="flex-shrink-0 bg-white text-blue-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition flex items-center gap-2">
                Sign in now <ArrowRight size={14} />
              </button>
            </div>
            <Foot />
          </div>
        )}

        {activeSection === 'deals' && (
          <div className="section-animate bg-white py-12 rounded-2xl shadow border border-slate-200">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Tag size={22} className="text-orange-500" /> Today's Deals</h2>
                  <p className="text-xs text-slate-500 mt-1">Featured products — sign in to buy</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold bg-red-50 border border-red-100 px-3 py-1.5 rounded-full"><Clock size={12} /> Limited stock</div>
              </div>
              {allProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {allProducts.slice(0, 3).map((product, i) => {
                    const style = CATEGORY_STYLES[product.category] || DEFAULT_STYLE;
                    const gradients = ['from-orange-500 to-red-500', 'from-pink-500 to-purple-500', 'from-blue-500 to-teal-500'];
                    return (
                      <div key={product.id} onClick={() => setSelectedProduct(product)} className="deal-hover relative rounded-2xl overflow-hidden cursor-pointer transition-transform shadow-md">
                        <div className={`bg-gradient-to-br ${gradients[i % 3]} p-6 text-white`}>
                          <div className="w-14 h-14 rounded-xl bg-white/20 overflow-hidden mb-3 flex items-center justify-center">
                            {product.image ? <img src={product.image} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} /> : <span className="text-3xl">{style.emoji}</span>}
                          </div>
                          <p className="font-bold text-base leading-tight">{product.name}</p>
                          <p className="text-white/80 text-xs mt-1 mb-3 line-clamp-2">{product.description || product.category}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-extrabold">${Number(product.price || 0).toFixed(2)}</span>
                            <span className="ml-auto bg-white/20 border border-white/30 text-white text-xs font-bold px-2.5 py-1 rounded-full">{product.category}</span>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition flex items-end justify-end p-3">
                          <span className="text-[10px] text-white/80 bg-black/20 px-2 py-0.5 rounded-full">Sign in to buy →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400"><Package size={32} className="mx-auto mb-2 opacity-40" /><p className="text-sm">No deals yet — check back after the admin adds products.</p></div>
              )}
            </div>
            <Foot />
          </div>
        )}

        {activeSection === 'offers' && (
          <div className="section-animate max-w-full mx-auto px-6 py-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2"><Gift size={22} className="text-pink-500" /> Special Offers</h2>
              <p className="text-sm text-slate-500 mt-1">Exclusive deals for PSP MART shoppers — sign in to redeem</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
              {OFFERS_DATA.map((offer, i) => (
                <div key={i} className="offer-hover rounded-2xl overflow-hidden shadow-md transition-transform cursor-pointer" onClick={() => openAuth('signin')}>
                  <div style={{ background: offer.gradient }} className="p-6 text-white">
                    <div className="text-3xl mb-2">{offer.icon}</div>
                    <div className="text-2xl font-black tracking-tight">{offer.discount}</div>
                    <div className="text-xs font-bold opacity-80 mt-1">{offer.label}</div>
                    <p className="text-xs opacity-70 mt-2 leading-relaxed">{offer.desc}</p>
                  </div>
                  <div className="bg-white px-5 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Promo code</p>
                      <p className="font-mono font-black text-blue-700 text-sm tracking-wider mt-0.5">{offer.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-red-500 font-semibold">{offer.expires}</p>
                      <button onClick={e => { e.stopPropagation(); navigator.clipboard?.writeText(offer.code).catch(() => {}); }}
                        className="mt-1 text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-bold px-2.5 py-1 rounded-lg hover:bg-blue-100 transition">Copy</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Foot />
          </div>
        )}

        {activeSection === 'contact' && (
          <div className="section-animate max-w-full mx-auto px-6 py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2"><Phone size={22} className="text-blue-600" /> Contact Us</h2>
              <p className="text-sm text-slate-500 mt-1">We're here to help — reach out anytime</p>
            </div>
            {(() => {
              const contacts = [
                { icon: 'Call',     title: 'Phone',    value: '+855 93 683 574',       desc: 'Mon–Sat, 8am–6pm (ICT)',    color: 'text-green-600', href: 'tel:+85593683574',                          hoverRing: 'hover:ring-2 hover:ring-blue-300' },
                { icon: 'Email',    title: 'Email',    value: 'sopheakp175@gmail.com', desc: 'Reply within 24 hours',     color: 'text-red-600',   href: 'mailto:sopheakp175@gmail.com',              hoverRing: 'hover:ring-2 hover:ring-emerald-300' },
                { icon: 'Address',  title: 'Address',  value: 'Phnom Penh, Cambodia',  desc: 'Street 271, Toul Kork',     color: 'text-blue-800',  href: 'https://maps.app.goo.gl/5h1a7zihk76gWojYA', hoverRing: 'hover:ring-2 hover:ring-amber-300' },
                { icon: 'Telegram', title: 'Telegram', value: '@pheaklove12',           desc: 'Chat with us instantly',    color: 'text-sky-600',   href: 'https://t.me/pheaklove12',                  hoverRing: 'hover:ring-2 hover:ring-sky-300' },
                { icon: 'Facebook', title: 'Facebook', value: 'Phy Sopheak',            desc: 'Chat with us instantly',    color: 'text-blue-600',  href: 'https://web.facebook.com/?_rdc=1&_rdr#',    hoverRing: 'hover:ring-2 hover:ring-sky-300' },
              ];
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                  {contacts.map((c, i) => (
                    <a key={i} href={c.href} target={c.href.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer"
                      className={`group bg-slate-400 border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer no-underline block ${c.hoverRing}`}
                      style={{ textDecoration: 'none' }}>
                      <div className={`w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center text-2xl mx-auto mb-3 group-hover:scale-110 transition-transform duration-200`}>{c.icon}</div>
                      <p className="font-bold text-slate-800 mb-1">{c.title}</p>
                      <p className="text-sm font-semibold text-blue-700 break-all">{c.value}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
                    </a>
                  ))}
                </div>
              );
            })()}
            <div style={{ background: 'linear-gradient(135deg, #2359cf 0%, #0320c0 55%, #0369a1 100%)' }} className="max-w-lg mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4 text-center">Send us a Email message</h3>
              <form onSubmit={async (event) => {
                event.preventDefault();
                const button = event.target.querySelector('button[type="submit"]');
                const originalText = button.innerHTML;
                button.innerText = "Sending..."; button.disabled = true;
                const formData = new FormData(event.target);
                formData.append("access_key", "b6e4d480-6acd-4232-b023-3df1c7b31e3f");
                try {
                  const response = await fetch("https://api.web3forms.com/submit", { method: "POST", body: formData });
                  const data = await response.json();
                  if (data.success) { alert('Message sent! We will get back to you soon.'); event.target.reset(); }
                  else { alert('Oops! Something went wrong. Please try again.'); }
                } catch { alert('Network error. Please check your connection.'); }
                finally { button.innerHTML = originalText; button.disabled = false; }
              }} className="space-y-3">
                <input type="text" name="name" required placeholder="Your name" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                <input type="email" name="email" required placeholder="your@email.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
                <textarea rows={3} name="message" required placeholder="How can we help you?" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none" />
                <button type="submit" className="w-full py-2.5 bg-blue-800 hover:bg-slate-900 text-white hover:text-blue-200 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50">
                  <Mail size={14} /> Send Message
                </button>
              </form>
            </div>
            <Foot />
          </div>
        )}

      </main>
    </div>
  );
}

// ─────────────────────────────────────────────
// INNER APP
// ─────────────────────────────────────────────
function AppInner() {
  const { products } = useContext(ShopContext);
  const [isLoggedIn,        setIsLoggedIn]        = useState(false);
  const [userRole,          setUserRole]           = useState(null);
  const [email,             setEmail]              = useState('');
  const [userId,            setUserId]             = useState(null);
  const [userAvatar,        setUserAvatar]         = useState(null);
  const [isLoading,         setIsLoading]          = useState(false);
  const [pendingRole,       setPendingRole]        = useState(null);
  const [pendingEmail,      setPendingEmail]       = useState('');
  const [pendingName,       setPendingName]        = useState('');
  const [pendingId,         setPendingId]          = useState(null);
  const [pendingAvatar,     setPendingAvatar]      = useState(null);
  const [pendingView,       setPendingView]        = useState('shop-home');
  const [view,              setView]               = useState('shop-home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [loginKey,          setLoginKey]           = useState(0);
  const isAdminView = view.startsWith('admin-');

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      setUserRole(pendingRole);
      setEmail(pendingEmail);
      setUserId(pendingId);
      setUserAvatar(pendingAvatar);
      setView(pendingView);
    }, 2200);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // handleLogin now receives id and avatar from the API response
  const handleLogin = (role, userEmail, userName, id, avatar) => {
    setPendingRole(role);
    setPendingEmail(userEmail);
    setPendingName(userName);
    setPendingId(id);
    setPendingAvatar(avatar || null);
    setPendingView(role === 'admin' ? 'admin-home' : 'shop-home');
    setLoginKey(k => k + 1);
    setIsLoading(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setEmail('');
    setUserId(null);
    setUserAvatar(null);
    setView('shop-home');
  };

  if (isLoading)   return <LoadingScreen role={pendingRole} />;
  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} products={products} />;

  return (
    <div className="min-h-screen pt-10 bg-blue-400/20 text-gray-800 tracking-tight flex flex-col">
      {!isAdminView && (
        <div className="relative">
          <Navbar
            setView={setView}
            userRole={userRole}
            handleLogout={handleLogout}
            userEmail={email}
            userId={userId}
            userAvatarFromDB={userAvatar}
            loginKey={loginKey}
          />
          <div className="absolute top-4 right-44 items-center gap-2 border border-slate-200 py-1 px-3 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
        </div>
      )}
      <div className="flex flex-1">
        {isAdminView && (
          <div className="flex flex-col md:flex md:flex-col bg-white text-white min-h-screen">
            <div className="p-4 border-b border-gray-800 flex absolute top-0 left-0 right-0 items-center justify-between gap-2 bg-blue-800">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-600" />
                <span className="text-xs font-bold text-gray-300 truncate max-w-[100px]">{email}</span>
              </div>
              <button onClick={handleLogout} className="p-1.5 bg-green-600 hover:bg-red-900 border border-red-900/50 rounded-lg text-red-900 hover:text-green-600 transition" title="Logout Session">
                <LogOut size={14} />
              </button>
            </div>
            <Sidebar setView={setView} currentView={view} />
          </div>
        )}
        <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {view === 'shop-home'      && <Home setView={setView} setSelectedProductId={setSelectedProductId} />}
          {view === 'shop-detail'    && <ProductDetail productId={selectedProductId} setView={setView} />}
          {view === 'shop-cart'      && <Cart userEmail={email} userRole={userRole} />}
          {view === 'admin-home'     && <DashboardHome />}
          {view === 'admin-products' && <ManageProducts />}
          {view === 'admin-orders'   && <Orders />}
          {view === 'admin-graphic'  && <Graphic />}
          {view === 'admin-users'    && <Users />}
          {view === 'admin-checkout' && <Checkin />}
          {view === 'admin-evaluate' && <Evaloute />}
          {view === 'admin-telegram' && <TelegramDashboard userRole={userRole} userEmail={email} />}
        </main>
      </div>
      <Foot />
    </div>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  return (
    <ShopProvider>
      <AppInner />
    </ShopProvider>
  );
}