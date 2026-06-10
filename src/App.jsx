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

// // ─────────────────────────────────────────────────────────────────────────────
// // API BASE URL  — change this to your deployed backend URL
// // ─────────────────────────────────────────────────────────────────────────────
// const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// // ─────────────────────────────────────────────────────────────────────────────
// // Disposable / fake email blocklist
// // ─────────────────────────────────────────────────────────────────────────────
// const BLOCKED_DOMAINS = new Set([
//   'mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com',
//   'throwam.com','yopmail.com','trashmail.com','sharklasers.com',
//   'guerrillamailblock.com','spam4.me','fakeinbox.com','dispostable.com',
//   'maildrop.cc','mailnull.com','spamgourmet.com','trashmail.io',
//   'discard.email','getnada.com','tempr.email','airmail.ac',
//   'spamex.com','trbvm.com','spamoff.de','mailexpire.com','getairmail.com',
//   'throwaway.email','emailondeck.com','mintemail.com','tempinbox.com',
// ]);

// function isEmailLegit(email) {
//   if (!email || typeof email !== 'string') return false;
//   const lower = email.toLowerCase().trim();
//   if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(lower)) return false;
//   const domain = lower.split('@')[1];
//   if (!domain || !domain.includes('.')) return false;
//   if (BLOCKED_DOMAINS.has(domain)) return false;
//   return true;
// }

// // Simple FNV-1a hash — same algorithm used in server password_hash column
// function simpleHash(str) {
//   let h = 0x811c9dc5;
//   for (let i = 0; i < str.length; i++) {
//     h ^= str.charCodeAt(i);
//     h = (h * 0x01000193) >>> 0;
//   }
//   return h.toString(16);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // LOADING SCREEN
// // ─────────────────────────────────────────────────────────────────────────────
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
// // SIGN-IN PROMPT MODAL (product click when not logged in)
// // ─────────────────────────────────────────────
// function SignInPrompt({ product, onClose, onLogin }) {
//   const [email,    setEmail]    = useState('');
//   const [password, setPassword] = useState('');
//   const [showPw,   setShowPw]   = useState(false);
//   const [err,      setErr]      = useState('');
//   const [loading,  setLoading]  = useState(false);

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr('');
//     if (!email || !password) { setErr('Please fill in all fields.'); return; }
//     if (!isEmailLegit(email)) { setErr('❌ This email address looks invalid or fake.'); return; }

//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/api/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email.trim().toLowerCase(), passwordHash: simpleHash(password) }),
//       });
//       const data = await res.json();
//       if (res.status === 404) { setErr('🚫 No account found for this email. Please register first.'); return; }
//       if (res.status === 401) { setErr('🔑 Incorrect password. Please try again.'); return; }
//       if (!res.ok)            { setErr(data.error || 'Sign in failed.'); return; }
//       onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//     } catch {
//       setErr('⚠️ Network error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
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
//             <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60">
//               {loading ? <RefreshCw size={13} className="animate-spin" /> : <><User size={13} /> Sign in & view product <ArrowRight size={13} /></>}
//             </button>
//           </form>
//           <div className="flex items-center gap-2 my-3">
//             <div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400">or</span><div className="flex-1 h-px bg-slate-200" />
//           </div>
//           <button onClick={() => onLogin('guest', 'guest', 'Guest', null, null)} className="w-full py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
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
//   const [loading,      setLoading]      = useState(false);

//   const switchTab = (tab) => {
//     setActiveTab(tab); setError(''); setEmailHint('');
//     setEmail(''); setPassword(''); setConfirmPass(''); setName('');
//   };

//   // Live email hint on blur — checks API
//   const onEmailBlur = async () => {
//     if (!email) { setEmailHint(''); return; }
//     if (!isEmailLegit(email)) {
//       setEmailHint('⚠️ This email looks invalid or fake.');
//       return;
//     }
//     if (activeTab === 'admin') { setEmailHint(''); return; }

//     try {
//       const res  = await fetch(`${API}/api/users/check-email`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email.trim().toLowerCase() }),
//       });
//       const data = await res.json();
//       const exists = data.exists;

//       if (activeTab === 'register' && exists) {
//         setEmailHint('📧 Already registered — sign in instead.');
//       } else if (activeTab === 'signin' && !exists) {
//         setEmailHint('🚫 No account found — please register first.');
//       } else {
//         setEmailHint('');
//       }
//     } catch {
//       setEmailHint('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     // ── ADMIN ──────────────────────────────────────────────────────────────
//     if (activeTab === 'admin') {
//       if (!email || !password) { setError('Please fill in all fields.'); return; }
//       if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
//         onLogin('admin', email, 'Phy Sopheak', 'ADMIN-001', null);
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
//       if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
//       if (password !== confirmPass) { setError('Passwords do not match.'); return; }

//       setLoading(true);
//       try {
//         const res = await fetch(`${API}/api/users/register`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             id:           `USR-${Date.now()}`,
//             name:         name.trim(),
//             email:        email.trim().toLowerCase(),
//             passwordHash: simpleHash(password),
//           }),
//         });
//         const data = await res.json();
//         if (res.status === 409) { setError('📧 This email is already registered. Please sign in instead.'); return; }
//         if (!res.ok)            { setError(data.error || 'Registration failed. Please try again.'); return; }
//         onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//       } catch {
//         setError('⚠️ Network error. Check your connection and try again.');
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     // ── SIGN IN ────────────────────────────────────────────────────────────
//     if (!email)    { setError('Please enter your email.'); return; }
//     if (!password) { setError('Please enter your password.'); return; }
//     if (!isEmailLegit(email)) {
//       setError('❌ This email address looks invalid.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/api/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           email:        email.trim().toLowerCase(),
//           passwordHash: simpleHash(password),
//         }),
//       });
//       const data = await res.json();
//       if (res.status === 404) { setError('🚫 No account found for this email. Please register first.'); return; }
//       if (res.status === 401) { setError('🔑 Incorrect password. Please try again.'); return; }
//       if (!res.ok)            { setError(data.error || 'Sign in failed.'); return; }
//       onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//     } catch {
//       setError('⚠️ Network error. Check your connection and try again.');
//     } finally {
//       setLoading(false);
//     }
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

//             <button type="submit" disabled={loading}
//               className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 ${
//                 activeTab === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
//               }`}>
//               {loading
//                 ? <RefreshCw size={14} className="animate-spin" />
//                 : <>
//                     {activeTab === 'signin'   && <><User size={14} /> Sign in to PSP MARKET</>}
//                     {activeTab === 'register' && <><UserPlus size={14} /> Create my account</>}
//                     {activeTab === 'admin'    && <><Shield size={14} /> Verify admin identity</>}
//                     <ArrowRight size={14} />
//                   </>
//               }
//             </button>
//           </form>

//           {activeTab !== 'admin' && (
//             <>
//               <div className="flex items-center gap-3 my-3"><div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400 font-medium">or</span><div className="flex-1 h-px bg-slate-200" /></div>
//               <button type="button" onClick={() => onLogin('guest', 'guest', 'Guest', null, null)} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
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

// // // ─────────────────────────────────────────────
// // // USER COMMENT SECTION
// // // ─────────────────────────────────────────────
// // function UserCommentSection() {
// //   const [comments, setComments] = useState(() => {
// //     try { return JSON.parse(localStorage.getItem('psp_comments') || '[]'); } catch { return []; }
// //   });
// //   const [username, setUsername] = useState('');
// //   const [comment,  setComment]  = useState('');
// //   const [rating,   setRating]   = useState(5);
// //   const [hovered,  setHovered]  = useState(0);
// //   const [err,      setErr]      = useState('');
// //   const [success,  setSuccess]  = useState(false);

// //   const AVATAR_COLORS = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500'];
// //   const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
// //   const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (!username.trim())          { setErr('Please enter your name.'); return; }
// //     if (!comment.trim())           { setErr('Please write a comment.'); return; }
// //     if (comment.trim().length < 5) { setErr('Comment is too short (minimum 5 characters).'); return; }
// //     const newComment = {
// //       id: Date.now(), username: username.trim(), comment: comment.trim(), rating,
// //       date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
// //     };
// //     const updated = [newComment, ...comments];
// //     setComments(updated);
// //     try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
// //     setUsername(''); setComment(''); setRating(5); setErr(''); setSuccess(true);
// //     setTimeout(() => setSuccess(false), 3500);
// //   };

// //   const totalReviews = comments.length;

// //   return (
// //     <div className="max-w-7xl mx-auto px-6 py-10">
// //       <div className="flex items-center gap-3 mb-2">
// //         <h3 className="text-lg font-bold text-slate-800">Customer Reviews</h3>
// //         <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">{totalReviews} reviews</span>
// //       </div>
// //       <div className="bg-blue-700 border border-blue-100 rounded-2xl p-5 mb-8">
// //         <h4 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2"><UserPlus size={15} className="text-white" /> Enter your review</h4>
// //         {success && <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2.5 rounded-xl mb-3"><CheckCircle size={13} /> Thanks for your review! It's now live below.</div>}
// //         {err && <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2.5 rounded-xl mb-3">{err}</div>}
// //         <form onSubmit={handleSubmit} className="space-y-3">
// //           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Your name *</label>
// //               <div className="relative">
// //                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={13} /></span>
// //                 <input type="text" placeholder="e.g. Sokha, John…" value={username} onChange={e => { setUsername(e.target.value); setErr(''); }} maxLength={40}
// //                   className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
// //               </div>
// //             </div>
// //             <div>
// //               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Rating *</label>
// //               <div className="flex items-center gap-1 h-[42px]">
// //                 {[1,2,3,4,5].map(star => (
// //                   <button key={star} type="button" onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(star)} className="text-2xl transition-transform hover:scale-110 focus:outline-none leading-none">
// //                     <span className={(hovered || rating) >= star ? 'text-slate-900' : 'text-slate-300'}>★</span>
// //                   </button>
// //                 ))}
// //                 <span className="text-xs text-white ml-1">{RATING_LABELS[hovered || rating]}</span>
// //               </div>
// //             </div>
// //           </div>
// //           <div>
// //             <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Your comment *</label>
// //             <textarea rows={3} placeholder="Tell others about your experience with PSP MARKET…" value={comment} onChange={e => { setComment(e.target.value); setErr(''); }} maxLength={300}
// //               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none" />
// //             <p className="text-[10px] text-slate-400 text-right mt-0.5">{comment.length}/300</p>
// //           </div>
// //           <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm">Post</button>
// //         </form>
// //       </div>
// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //         {comments.map(c => (
// //           <div key={c.id} className="bg-white border border-slate-400 rounded-2xl p-5 shadow-sm relative">
// //             <span className="absolute top-3 right-3 text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">Customer</span>
// //             <div className="flex items-center gap-3 mb-3">
// //               <div className={`w-8 h-8 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>{c.username[0].toUpperCase()}</div>
// //               <div className="flex-1 min-w-0">
// //                 <span className="text-sm font-semibold text-slate-700 block truncate">{c.username}</span>
// //                 <p className="text-[10px] text-slate-400">{c.date}</p>
// //               </div>
// //               <span className="text-slate-900 text-xs mt-5 flex-shrink-0">{'★'.repeat(c.rating)}</span>
// //             </div>
// //             <p className="text-xs text-slate-500 leading-relaxed">"{c.comment}"</p>
// //           </div>
// //         ))}
// //       </div>
// //       {comments.length === 0 && <p className="text-center text-xs text-slate-400 mt-4">Be the first to leave a review above!</p>}
// //     </div>
// //   );
// // }





// // ─────────────────────────────────────────────────────────────────────────────
// // REPLACE the existing UserCommentSection function in App.jsx with this one.
// // Everything else in App.jsx stays exactly the same.
// //
// // Changes vs original:
// //   • On mount  — fetches comments from GET  /api/comments  (falls back to localStorage)
// //   • On submit — POSTs new comment to       POST /api/comments, then refreshes list
// //   • localStorage is still kept as offline/fallback mirror
// // ─────────────────────────────────────────────────────────────────────────────

// function UserCommentSection() {
//   const [comments,  setComments]  = useState([]);
//   const [username,  setUsername]  = useState('');
//   const [comment,   setComment]   = useState('');
//   const [rating,    setRating]    = useState(5);
//   const [hovered,   setHovered]   = useState(0);
//   const [err,       setErr]       = useState('');
//   const [success,   setSuccess]   = useState(false);
//   const [submitting,setSubmitting]= useState(false);
//   const [loading,   setLoading]   = useState(true);

//   const AVATAR_COLORS  = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500'];
//   const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
//   const RATING_LABELS  = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

//   // ── Load comments from API (falls back to localStorage) ───────────────────
//   const loadComments = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/comments');
//       if (res.ok) {
//         const data = await res.json();
//         setComments(data);
//         // mirror to localStorage so admin dashboard still works offline
//         try { localStorage.setItem('psp_comments', JSON.stringify(data)); } catch {}
//       } else {
//         throw new Error('non-200');
//       }
//     } catch {
//       // fallback to localStorage
//       try {
//         const saved = localStorage.getItem('psp_comments');
//         setComments(saved ? JSON.parse(saved) : []);
//       } catch {
//         setComments([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadComments();
//   }, []);

//   // ── Submit handler ────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!username.trim())          { setErr('Please enter your name.');                        return; }
//     if (!comment.trim())           { setErr('Please write a comment.');                        return; }
//     if (comment.trim().length < 5) { setErr('Comment is too short (minimum 5 characters).'); return; }

//     const dateLabel  = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//     const newComment = {
//       id:       Date.now(),
//       username: username.trim(),
//       comment:  comment.trim(),
//       rating,
//       date:     dateLabel,
//     };

//     setSubmitting(true);
//     setErr('');

//     try {
//       const res = await fetch('/api/comments', {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body:    JSON.stringify(newComment),
//       });

//       if (res.ok) {
//         // Reload from DB so the list is authoritative
//         await loadComments();
//       } else {
//         // Graceful degradation — show it locally even if DB failed
//         const updated = [newComment, ...comments];
//         setComments(updated);
//         try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//       }
//     } catch {
//       // Network failure — keep locally
//       const updated = [newComment, ...comments];
//       setComments(updated);
//       try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//     } finally {
//       setSubmitting(false);
//     }

//     setUsername('');
//     setComment('');
//     setRating(5);
//     setSuccess(true);
//     setTimeout(() => setSuccess(false), 3500);
//   };

//   const totalReviews = comments.length;

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       {/* ── Heading ── */}
//       <div className="flex items-center gap-3 mb-2">
//         <h3 className="text-lg font-bold text-slate-800">Customer Reviews</h3>
//         <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
//           {loading ? '…' : totalReviews} reviews
//         </span>
//       </div>

//       {/* ── Review form ── */}
//       <div className="bg-blue-700 border border-blue-100 rounded-2xl p-5 mb-8">
//         <h4 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2">
//           <UserPlus size={15} className="text-white" /> Enter your review
//         </h4>

//         {success && (
//           <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
//             <CheckCircle size={13} /> Thanks for your review! It's now live below.
//           </div>
//         )}
//         {err && (
//           <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2.5 rounded-xl mb-3">
//             {err}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {/* Name */}
//             <div>
//               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">
//                 Your name *
//               </label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
//                   <User size={13} />
//                 </span>
//                 <input
//                   type="text"
//                   placeholder="e.g. Sokha, John…"
//                   value={username}
//                   onChange={e => { setUsername(e.target.value); setErr(''); }}
//                   maxLength={40}
//                   className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
//                 />
//               </div>
//             </div>

//             {/* Star rating */}
//             <div>
//               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">
//                 Rating *
//               </label>
//               <div className="flex items-center gap-1 h-[42px]">
//                 {[1,2,3,4,5].map(star => (
//                   <button
//                     key={star}
//                     type="button"
//                     onMouseEnter={() => setHovered(star)}
//                     onMouseLeave={() => setHovered(0)}
//                     onClick={() => setRating(star)}
//                     className="text-2xl transition-transform hover:scale-110 focus:outline-none leading-none"
//                   >
//                     <span className={(hovered || rating) >= star ? 'text-slate-900' : 'text-slate-300'}>★</span>
//                   </button>
//                 ))}
//                 <span className="text-xs text-white ml-1">{RATING_LABELS[hovered || rating]}</span>
//               </div>
//             </div>
//           </div>

//           {/* Comment textarea */}
//           <div>
//             <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">
//               Your comment *
//             </label>
//             <textarea
//               rows={3}
//               placeholder="Tell others about your experience with PSP MARKET…"
//               value={comment}
//               onChange={e => { setComment(e.target.value); setErr(''); }}
//               maxLength={300}
//               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none"
//             />
//             <p className="text-[10px] text-slate-400 text-right mt-0.5">{comment.length}/300</p>
//           </div>

//           <button
//             type="submit"
//             disabled={submitting}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm"
//           >
//             {submitting
//               ? <RefreshCw size={13} className="animate-spin" />
//               : 'Post'
//             }
//           </button>
//         </form>
//       </div>

//       {/* ── Comment cards ── */}
//       {loading ? (
//         <div className="flex items-center justify-center py-10 gap-3 text-slate-400">
//           <RefreshCw size={18} className="animate-spin" />
//           <span className="text-sm">Loading reviews…</span>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {comments.map(c => (
//               <div key={c.id} className="bg-white border border-slate-400 rounded-2xl p-5 shadow-sm relative">
//                 <span className="absolute top-3 right-3 text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
//                   Customer
//                 </span>
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className={`w-8 h-8 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
//                     {c.username[0].toUpperCase()}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <span className="text-sm font-semibold text-slate-700 block truncate">{c.username}</span>
//                     <p className="text-[10px] text-slate-400">{c.date}</p>
//                   </div>
//                   <span className="text-slate-900 text-xs mt-5 flex-shrink-0">{'★'.repeat(c.rating)}</span>
//                 </div>
//                 <p className="text-xs text-slate-500 leading-relaxed">"{c.comment}"</p>
//               </div>
//             ))}
//           </div>
//           {comments.length === 0 && (
//             <p className="text-center text-xs text-slate-400 mt-4">
//               Be the first to leave a review above!
//             </p>
//           )}
//         </>
//       )}
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
//       `}</style>

//       {showAuthModal && (
//         <AuthModal
//           defaultTab={authModalTab}
//           onClose={() => setShowAuthModal(false)}
//           onLogin={(role, email, name, id, avatar) => {
//             setShowAuthModal(false);
//             onLogin(role, email, name, id, avatar);
//           }}
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
//                   <div className="relative">
//                     <div className="w-100 h-100 rounded-full overflow-hidden shadow-2xl border-4 border-white/30 bg-white/10 flex items-center justify-center" style={{ backdropFilter: 'blur(8px)' }}>
//                       {heroLogo
//                         ? <img src={heroLogo} alt="Project logo" className="w-full h-full object-cover" />
//                         : <img src={LOGO} alt="PSP MART" className="w-full h-full object-cover hidden md:flex" />}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <UserCommentSection />
//             <Foot />
//           </div>
//         )}

//         {activeSection === 'products' && (
//           <div className="section-animate max-w-full mx-auto px-6 py-12 bg-white rounded-2xl shadow border border-slate-200">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Package size={22} className="text-blue-600" /> Products</h2>
//                 <p className="text-xs text-slate-500 mt-1">Browse our catalogue — click any item to sign in & buy</p>
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
//               </div>
//             )}
//             <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
//               <div>
//                 <p className="font-bold text-base">Want to see more products?</p>
//                 <p className="text-blue-200 text-sm mt-0.5">Sign in or create a free account to access our full catalogue.</p>
//               </div>
//               <button onClick={() => openAuth('signin')} className="flex-shrink-0 bg-white text-blue-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition flex items-center gap-2">
//                 Sign in now <ArrowRight size={14} />
//               </button>
//             </div>
//             <Foot />
//           </div>
//         )}

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
//             </div>
//             <Foot />
//           </div>
//         )}

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
//             <Foot />
//           </div>
//         )}

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
//   const [userId,            setUserId]             = useState(null);
//   const [userAvatar,        setUserAvatar]         = useState(null);
//   const [isLoading,         setIsLoading]          = useState(false);
//   const [pendingRole,       setPendingRole]        = useState(null);
//   const [pendingEmail,      setPendingEmail]       = useState('');
//   const [pendingName,       setPendingName]        = useState('');
//   const [pendingId,         setPendingId]          = useState(null);
//   const [pendingAvatar,     setPendingAvatar]      = useState(null);
//   const [pendingView,       setPendingView]        = useState('shop-home');
//   const [view,              setView]               = useState('shop-home');
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [loginKey,          setLoginKey]           = useState(0);
//   const isAdminView = view.startsWith('admin-');

//   useEffect(() => {
//     if (!isLoading) return;
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//       setIsLoggedIn(true);
//       setUserRole(pendingRole);
//       setEmail(pendingEmail);
//       setUserId(pendingId);
//       setUserAvatar(pendingAvatar);
//       setView(pendingView);
//     }, 2200);
//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   // handleLogin now receives id and avatar from the API response
//   const handleLogin = (role, userEmail, userName, id, avatar) => {
//     setPendingRole(role);
//     setPendingEmail(userEmail);
//     setPendingName(userName);
//     setPendingId(id);
//     setPendingAvatar(avatar || null);
//     setPendingView(role === 'admin' ? 'admin-home' : 'shop-home');
//     setLoginKey(k => k + 1);
//     setIsLoading(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserRole(null);
//     setEmail('');
//     setUserId(null);
//     setUserAvatar(null);
//     setView('shop-home');
//   };

//   if (isLoading)   return <LoadingScreen role={pendingRole} />;
//   if (!isLoggedIn) return <LoginPage onLogin={handleLogin} products={products} />;

//   return (
//     <div className="min-h-screen pt-10 bg-blue-400/20 text-gray-800 tracking-tight flex flex-col">
//       {!isAdminView && (
//         <div className="relative">
//           <Navbar
//             setView={setView}
//             userRole={userRole}
//             handleLogout={handleLogout}
//             userEmail={email}
//             userId={userId}
//             userAvatarFromDB={userAvatar}
//             loginKey={loginKey}
//           />
//           <div className="absolute top-4 right-44 items-center gap-2 border border-slate-200 py-1 px-3 rounded-lg text-xs">
//             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//           </div>
//         </div>
//       )}
//       <div className="flex flex-1">
//         {isAdminView && (
//           <div className="flex flex-col md:flex md:flex-col bg-white text-white min-h-screen">
//             <div className="p-4 border-b border-gray-800 flex absolute top-0 left-0 right-0 items-center justify-between gap-2 bg-blue-800">
//               <div className="flex items-center gap-2">
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

// // ─────────────────────────────────────────────────────────────────────────────
// // API BASE URL — reads from .env  VITE_API_URL, fallback to localhost
// // ─────────────────────────────────────────────────────────────────────────────
// const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// // ─────────────────────────────────────────────────────────────────────────────
// // Disposable / fake email blocklist
// // ─────────────────────────────────────────────────────────────────────────────
// const BLOCKED_DOMAINS = new Set([
//   'mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com',
//   'throwam.com','yopmail.com','trashmail.com','sharklasers.com',
//   'guerrillamailblock.com','spam4.me','fakeinbox.com','dispostable.com',
//   'maildrop.cc','mailnull.com','spamgourmet.com','trashmail.io',
//   'discard.email','getnada.com','tempr.email','airmail.ac',
//   'spamex.com','trbvm.com','spamoff.de','mailexpire.com','getairmail.com',
//   'throwaway.email','emailondeck.com','mintemail.com','tempinbox.com',
// ]);

// function isEmailLegit(email) {
//   if (!email || typeof email !== 'string') return false;
//   const lower = email.toLowerCase().trim();
//   if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(lower)) return false;
//   const domain = lower.split('@')[1];
//   if (!domain || !domain.includes('.')) return false;
//   if (BLOCKED_DOMAINS.has(domain)) return false;
//   return true;
// }

// // Simple FNV-1a hash — same algorithm used in server password_hash column
// function simpleHash(str) {
//   let h = 0x811c9dc5;
//   for (let i = 0; i < str.length; i++) {
//     h ^= str.charCodeAt(i);
//     h = (h * 0x01000193) >>> 0;
//   }
//   return h.toString(16);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // LOADING SCREEN
// // ─────────────────────────────────────────────────────────────────────────────
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
// // SIGN-IN PROMPT MODAL
// // ─────────────────────────────────────────────
// function SignInPrompt({ product, onClose, onLogin }) {
//   const [email,    setEmail]    = useState('');
//   const [password, setPassword] = useState('');
//   const [showPw,   setShowPw]   = useState(false);
//   const [err,      setErr]      = useState('');
//   const [loading,  setLoading]  = useState(false);

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr('');
//     if (!email || !password) { setErr('Please fill in all fields.'); return; }
//     if (!isEmailLegit(email)) { setErr('❌ This email address looks invalid or fake.'); return; }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/api/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email.trim().toLowerCase(), passwordHash: simpleHash(password) }),
//       });
//       const data = await res.json();
//       if (res.status === 404) { setErr('🚫 No account found for this email. Please register first.'); return; }
//       if (res.status === 401) { setErr('🔑 Incorrect password. Please try again.'); return; }
//       if (!res.ok)            { setErr(data.error || 'Sign in failed.'); return; }
//       onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//     } catch {
//       setErr('⚠️ Network error. Please try again.');
//     } finally {
//       setLoading(false);
//     }
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
//             <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60">
//               {loading ? <RefreshCw size={13} className="animate-spin" /> : <><User size={13} /> Sign in & view product <ArrowRight size={13} /></>}
//             </button>
//           </form>
//           <div className="flex items-center gap-2 my-3">
//             <div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400">or</span><div className="flex-1 h-px bg-slate-200" />
//           </div>
//           <button onClick={() => onLogin('guest', 'guest', 'Guest', null, null)} className="w-full py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium hover:bg-slate-50 transition flex items-center justify-center gap-2">
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
//   const [loading,      setLoading]      = useState(false);

//   const switchTab = (tab) => {
//     setActiveTab(tab); setError(''); setEmailHint('');
//     setEmail(''); setPassword(''); setConfirmPass(''); setName('');
//   };

//   const onEmailBlur = async () => {
//     if (!email) { setEmailHint(''); return; }
//     if (!isEmailLegit(email)) { setEmailHint('⚠️ This email looks invalid or fake.'); return; }
//     if (activeTab === 'admin') { setEmailHint(''); return; }
//     try {
//       const res  = await fetch(`${API}/api/users/check-email`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email.trim().toLowerCase() }),
//       });
//       const data = await res.json();
//       const exists = data.exists;
//       if (activeTab === 'register' && exists)  setEmailHint('📧 Already registered — sign in instead.');
//       else if (activeTab === 'signin' && !exists) setEmailHint('🚫 No account found — please register first.');
//       else setEmailHint('');
//     } catch { setEmailHint(''); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (activeTab === 'admin') {
//       if (!email || !password) { setError('Please fill in all fields.'); return; }
//       if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
//         onLogin('admin', email, 'Phy Sopheak', 'ADMIN-001', null);
//       } else {
//         setError('❌ Access denied. Invalid admin credentials.');
//       }
//       return;
//     }

//     if (activeTab === 'register') {
//       if (!name.trim())        { setError('Please enter your full name.'); return; }
//       if (!email)              { setError('Please enter your email.'); return; }
//       if (!isEmailLegit(email)) { setError('❌ This email is invalid or looks fake. Please use a real email address.'); return; }
//       if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
//       if (password !== confirmPass) { setError('Passwords do not match.'); return; }
//       setLoading(true);
//       try {
//         const res = await fetch(`${API}/api/users/register`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ id: `USR-${Date.now()}`, name: name.trim(), email: email.trim().toLowerCase(), passwordHash: simpleHash(password) }),
//         });
//         const data = await res.json();
//         if (res.status === 409) { setError('📧 This email is already registered. Please sign in instead.'); return; }
//         if (!res.ok)            { setError(data.error || 'Registration failed. Please try again.'); return; }
//         onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//       } catch { setError('⚠️ Network error. Check your connection and try again.'); }
//       finally { setLoading(false); }
//       return;
//     }

//     if (!email)    { setError('Please enter your email.'); return; }
//     if (!password) { setError('Please enter your password.'); return; }
//     if (!isEmailLegit(email)) { setError('❌ This email address looks invalid.'); return; }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/api/users/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email.trim().toLowerCase(), passwordHash: simpleHash(password) }),
//       });
//       const data = await res.json();
//       if (res.status === 404) { setError('🚫 No account found for this email. Please register first.'); return; }
//       if (res.status === 401) { setError('🔑 Incorrect password. Please try again.'); return; }
//       if (!res.ok)            { setError(data.error || 'Sign in failed.'); return; }
//       onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//     } catch { setError('⚠️ Network error. Check your connection and try again.'); }
//     finally { setLoading(false); }
//   };

//   return (
//   <div
//     className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300"
//     style={{ 
//       // Blends a dark translucent overlay with your custom background image
//       backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)), url('https://img.sanishtech.com/u/1633594ef766e0b33213011add414d67.png')`,
//       backgroundPosition: 'center',
//       backgroundSize: 'cover',
//       backgroundRepeat: 'no-repeat',
//       backdropFilter: 'blur(6px)',
//       WebkitBackdropFilter: 'blur(6px)' // Safeguard for Safari support
//     }}
//     onClick={e => { if (e.target === e.currentTarget) onClose(); }}
//   >
//       <div className="bg-blue-100 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modalPop shadow-xl shadow-blue-800">
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

//         <div className="px-6 mb-4 bg-blue-200">
//           <div className="bg-blue-100 px-3 py-2 rounded-xl flex gap-0.5 shadow-xl shadow-blue-400">
//             {[
//               { key: 'signin',   label: 'Sign in',  icon: <User size={12} /> },
//               { key: 'register', label: 'Register', icon: <UserPlus size={12} /> },
//               { key: 'admin',    label: 'Admin',    icon: <Shield size={12} /> },
//             ].map(t => (
//               <button key={t.key} type="button" onClick={() => switchTab(t.key)}
//                 className={`flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center  gap-1.5 ${
//                   activeTab === t.key
//                     ? (t.key === 'admin' ? 'bg-red-600 text-white shadow-sm' : 'bg-blue-600 text-white shadow-sm')
//                     : 'text-slate-500 hover:text-slate-700 bg-white'
//                 }`}>
//                 {t.icon} {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="px-6 pb-6 bg-blue-100">
//           {activeTab !== 'admin' && (
//             <>
//               <div className="grid grid-cols-2 gap-2 mb-3">
//                 <button type="button" className="flex items-center bg-white justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"><GoogleIcon /> Google</button>
//                 <button type="button" className="flex items-center bg-white justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"><FacebookIcon /> Facebook</button>
//               </div>
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400 font-medium">or continue with email</span><div className="flex-1 h-px bg-slate-200" />
//               </div>
//             </>
//           )}

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

//           <form onSubmit={handleSubmit} className="space-y-3 bg-blue-200 p-5 shadow-xl  shadow-white rounded-xl ">
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

//             <button type="submit" disabled={loading}
//               className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 ${
//                 activeTab === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
//               }`}>
//               {loading
//                 ? <RefreshCw size={14} className="animate-spin" />
//                 : <>
//                     {activeTab === 'signin'   && <><User size={14} /> Sign in to PSP MARKET</>}
//                     {activeTab === 'register' && <><UserPlus size={14} /> Create my account</>}
//                     {activeTab === 'admin'    && <><Shield size={14} /> Verify admin identity</>}
//                     <ArrowRight size={14} />
//                   </>
//               }
//             </button>
//           </form>

//           {activeTab !== 'admin' && (
//             <>
//               <div className="flex items-center gap-3 my-3"><div className="flex-1 h-px bg-slate-200" /><span className="text-[10px] text-slate-400 font-medium">or</span><div className="flex-1 h-px bg-slate-200" /></div>
//               <button type="button" onClick={() => onLogin('guest', 'guest', 'Guest', null, null)} className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2">
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

// // ─────────────────────────────────────────────────────────────────────────────
// // USER COMMENT SECTION — saves to MySQL via API_BASE/api/comments
// // ─────────────────────────────────────────────────────────────────────────────
// function UserCommentSection() {
//   const [comments,   setComments]   = useState([]);
//   const [username,   setUsername]   = useState('');
//   const [comment,    setComment]    = useState('');
//   const [rating,     setRating]     = useState(5);
//   const [hovered,    setHovered]    = useState(0);
//   const [err,        setErr]        = useState('');
//   const [success,    setSuccess]    = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loading,    setLoading]    = useState(true);

//   const AVATAR_COLORS  = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500'];
//   const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
//   const RATING_LABELS  = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

//   // ── Load from MySQL DB (with localStorage fallback) ───────────────────────
//   const loadComments = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/api/comments`);
//       if (res.ok) {
//         const data = await res.json();
//         setComments(data);
//         try { localStorage.setItem('psp_comments', JSON.stringify(data)); } catch {}
//       } else {
//         throw new Error('non-200');
//       }
//     } catch {
//       try {
//         const saved = localStorage.getItem('psp_comments');
//         setComments(saved ? JSON.parse(saved) : []);
//       } catch { setComments([]); }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadComments(); }, []);

//   // ── Submit new comment → POST to MySQL DB ────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!username.trim())          { setErr('Please enter your name.'); return; }
//     if (!comment.trim())           { setErr('Please write a comment.'); return; }
//     if (comment.trim().length < 5) { setErr('Comment is too short (minimum 5 characters).'); return; }

//     const dateLabel = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

//     const payload = {
//       id:       Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
//       username: username.trim(),
//       // email required by server — use a placeholder for anonymous storefront reviews
//       email:    `${username.trim().toLowerCase().replace(/\s+/g, '.')}@pspmarket.guest`,
//       comment:  comment.trim(),
//       rating,
//       date:     dateLabel,
//     };

//     setSubmitting(true);
//     setErr('');

//     try {
//       const res = await fetch(`${API}/api/comments`, {
//         method:  'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body:    JSON.stringify(payload),
//       });

//       if (res.ok) {
//         // Reload from DB so the list is authoritative
//         await loadComments();
//       } else {
//         // Graceful degradation — show locally even if DB failed
//         const updated = [{ ...payload, date: dateLabel }, ...comments];
//         setComments(updated);
//         try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//       }
//     } catch {
//       // Network failure — keep locally
//       const updated = [{ ...payload, date: dateLabel }, ...comments];
//       setComments(updated);
//       try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//     } finally {
//       setSubmitting(false);
//     }

//     setUsername('');
//     setComment('');
//     setRating(5);
//     setSuccess(true);
//     setTimeout(() => setSuccess(false), 3500);
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-6 py-10">
//       <div className="flex items-center gap-3 mb-2">
//         <h3 className="text-lg font-bold text-slate-800">Customer Reviews</h3>
//         <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
//           {loading ? '…' : comments.length} reviews
//         </span>
//         <button onClick={loadComments} disabled={loading}
//           className="ml-auto flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50 transition">
//           <RefreshCw size={11} className={loading ? 'animate-spin' : ''} /> Refresh
//         </button>
//       </div>

//       {/* Review form */}
//       <div className="bg-blue-700 border border-blue-100 rounded-2xl p-5 mb-8">
//         <h4 className="font-semibold text-slate-900 text-sm mb-4 flex items-center gap-2">
//           <UserPlus size={15} className="text-white" /> Enter your review
//         </h4>
//         {success && (
//           <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-2.5 rounded-xl mb-3">
//             <CheckCircle size={13} /> Thanks for your review! It's now live and saved in the database.
//           </div>
//         )}
//         {err && <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2.5 rounded-xl mb-3">{err}</div>}

//         <form onSubmit={handleSubmit} className="space-y-3">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Your name *</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={13} /></span>
//                 <input type="text" placeholder="e.g. Sokha, John…" value={username}
//                   onChange={e => { setUsername(e.target.value); setErr(''); }} maxLength={40}
//                   className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition" />
//               </div>
//             </div>
//             <div>
//               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Rating *</label>
//               <div className="flex items-center gap-1 h-[42px]">
//                 {[1,2,3,4,5].map(star => (
//                   <button key={star} type="button"
//                     onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)}
//                     onClick={() => setRating(star)}
//                     className="text-2xl transition-transform hover:scale-110 focus:outline-none leading-none">
//                     <span className={(hovered || rating) >= star ? 'text-slate-900' : 'text-slate-300'}>★</span>
//                   </button>
//                 ))}
//                 <span className="text-xs text-white ml-1">{RATING_LABELS[hovered || rating]}</span>
//               </div>
//             </div>
//           </div>
//           <div>
//             <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-wider mb-1">Your comment *</label>
//             <textarea rows={3} placeholder="Tell others about your experience with PSP MARKET…"
//               value={comment} onChange={e => { setComment(e.target.value); setErr(''); }} maxLength={300}
//               className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none" />
//             <p className="text-[10px] text-slate-400 text-right mt-0.5">{comment.length}/300</p>
//           </div>
//           <button type="submit" disabled={submitting}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm">
//             {submitting ? <RefreshCw size={13} className="animate-spin" /> : 'Post Review'}
//           </button>
//         </form>
//       </div>

//       {/* Comment cards */}
//       {loading ? (
//         <div className="flex items-center justify-center py-10 gap-3 text-slate-400">
//           <RefreshCw size={18} className="animate-spin" />
//           <span className="text-sm">Loading reviews from database…</span>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {comments.map(c => (
//               <div key={c.id} className="bg-white border border-slate-400 rounded-2xl p-5 shadow-sm relative">
//                 <span className="absolute top-3 right-3 text-[9px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">Customer</span>
//                 <div className="flex items-center gap-3 mb-3">
//                   <div className={`w-8 h-8 rounded-full ${getAvatarColor(c.username || 'A')} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
//                     {(c.username || 'A')[0].toUpperCase()}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <span className="text-sm font-semibold text-slate-700 block truncate">{c.username}</span>
//                     <p className="text-[10px] text-slate-400">{c.date}</p>
//                   </div>
//                   <span className="text-slate-900 text-xs mt-5 flex-shrink-0">{'★'.repeat(c.rating || 0)}</span>
//                 </div>
//                 <p className="text-xs text-slate-500 leading-relaxed">"{c.comment}"</p>
//               </div>
//             ))}
//           </div>
//           {comments.length === 0 && (
//             <p className="text-center text-xs text-slate-400 mt-4">Be the first to leave a review above!</p>
//           )}
//         </>
//       )}
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
//       `}</style>

//       {showAuthModal && (
//         <AuthModal
//           defaultTab={authModalTab}
//           onClose={() => setShowAuthModal(false)}
//           onLogin={(role, email, name, id, avatar) => { setShowAuthModal(false); onLogin(role, email, name, id, avatar); }}
//         />
//       )}
//       {selectedProduct && (
//         <SignInPrompt product={selectedProduct} onClose={() => setSelectedProduct(null)} onLogin={onLogin} />
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
//                   <div className="relative">
//                     <div className="w-100 h-100 rounded-full overflow-hidden shadow-2xl border-4 border-white/30 bg-white/10 flex items-center justify-center" style={{ backdropFilter: 'blur(8px)' }}>
//                       {heroLogo
//                         ? <img src={heroLogo} alt="Project logo" className="w-full h-full object-cover" />
//                         : <img src={LOGO} alt="PSP MART" className="w-full h-full object-cover hidden md:flex" />}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* ── Customer Reviews — DB-backed ── */}
//             <UserCommentSection />
//             <Foot />
//           </div>
//         )}

//         {activeSection === 'products' && (
//           <div className="section-animate max-w-full mx-auto px-6 py-12 bg-white rounded-2xl shadow border border-slate-200">
//             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Package size={22} className="text-blue-600" /> Products</h2>
//                 <p className="text-xs text-slate-500 mt-1">Browse our catalogue — click any item to sign in & buy</p>
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
//               </div>
//             )}
//             <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
//               <div>
//                 <p className="font-bold text-base">Want to see more products?</p>
//                 <p className="text-blue-200 text-sm mt-0.5">Sign in or create a free account to access our full catalogue.</p>
//               </div>
//               <button onClick={() => openAuth('signin')} className="flex-shrink-0 bg-white text-blue-700 font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-blue-50 transition flex items-center gap-2">
//                 Sign in now <ArrowRight size={14} />
//               </button>
//             </div>
//             <Foot />
//           </div>
//         )}

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
//                 <div className="text-center py-12 text-slate-400"><Package size={32} className="mx-auto mb-2 opacity-40" /><p className="text-sm">No deals yet.</p></div>
//               )}
//             </div>
//             <Foot />
//           </div>
//         )}

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
//             <Foot />
//           </div>
//         )}

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
//   const [userId,            setUserId]             = useState(null);
//   const [userAvatar,        setUserAvatar]         = useState(null);
//   const [isLoading,         setIsLoading]          = useState(false);
//   const [pendingRole,       setPendingRole]        = useState(null);
//   const [pendingEmail,      setPendingEmail]       = useState('');
//   const [pendingName,       setPendingName]        = useState('');
//   const [pendingId,         setPendingId]          = useState(null);
//   const [pendingAvatar,     setPendingAvatar]      = useState(null);
//   const [pendingView,       setPendingView]        = useState('shop-home');
//   const [view,              setView]               = useState('shop-home');
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [loginKey,          setLoginKey]           = useState(0);
//   const isAdminView = view.startsWith('admin-');

//   useEffect(() => {
//     if (!isLoading) return;
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//       setIsLoggedIn(true);
//       setUserRole(pendingRole);
//       setEmail(pendingEmail);
//       setUserId(pendingId);
//       setUserAvatar(pendingAvatar);
//       setView(pendingView);
//     }, 2200);
//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   const handleLogin = (role, userEmail, userName, id, avatar) => {
//     setPendingRole(role);
//     setPendingEmail(userEmail);
//     setPendingName(userName);
//     setPendingId(id);
//     setPendingAvatar(avatar || null);
//     setPendingView(role === 'admin' ? 'admin-home' : 'shop-home');
//     setLoginKey(k => k + 1);
//     setIsLoading(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserRole(null);
//     setEmail('');
//     setUserId(null);
//     setUserAvatar(null);
//     setView('shop-home');
//   };

//   if (isLoading)   return <LoadingScreen role={pendingRole} />;
//   if (!isLoggedIn) return <LoginPage onLogin={handleLogin} products={products} />;

//   return (
//     <div className="min-h-screen pt-10 bg-blue-400/20 text-gray-800 tracking-tight flex flex-col">
//       {!isAdminView && (
//         <div className="relative">
//           <Navbar
//             setView={setView}
//             userRole={userRole}
//             handleLogout={handleLogout}
//             userEmail={email}
//             userId={userId}
//             userAvatarFromDB={userAvatar}
//             loginKey={loginKey}
//           />
//           <div className="absolute top-4 right-44 items-center gap-2 border border-slate-200 py-1 px-3 rounded-lg text-xs">
//             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//           </div>
//         </div>
//       )}
//       <div className="flex flex-1">
//         {isAdminView && (
//           <div className="flex flex-col md:flex md:flex-col bg-white text-white min-h-screen">
//             <div className="p-4 border-b border-gray-800 flex absolute top-0 left-0 right-0 items-center justify-between gap-2 bg-blue-800">
//               <div className="flex items-center gap-2">
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






















// import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
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
//   Moon, Sun, Sparkles,
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

// // ─────────────────────────────────────────────────────────────────────────────
// // DARK MODE CONTEXT
// // ─────────────────────────────────────────────────────────────────────────────
// const DarkModeContext = createContext({ dark: false, toggleDark: () => {} });
// function useDark() { return useContext(DarkModeContext); }

// // ─────────────────────────────────────────────────────────────────────────────
// // API BASE URL
// // ─────────────────────────────────────────────────────────────────────────────
// const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// // ─────────────────────────────────────────────────────────────────────────────
// // Disposable email blocklist
// // ─────────────────────────────────────────────────────────────────────────────
// const BLOCKED_DOMAINS = new Set([
//   'mailinator.com','guerrillamail.com','10minutemail.com','tempmail.com',
//   'throwam.com','yopmail.com','trashmail.com','sharklasers.com',
//   'guerrillamailblock.com','spam4.me','fakeinbox.com','dispostable.com',
//   'maildrop.cc','mailnull.com','spamgourmet.com','trashmail.io',
//   'discard.email','getnada.com','tempr.email','airmail.ac',
//   'spamex.com','trbvm.com','spamoff.de','mailexpire.com','getairmail.com',
//   'throwaway.email','emailondeck.com','mintemail.com','tempinbox.com',
// ]);
// function isEmailLegit(email) {
//   if (!email || typeof email !== 'string') return false;
//   const lower = email.toLowerCase().trim();
//   if (!/^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/.test(lower)) return false;
//   const domain = lower.split('@')[1];
//   if (!domain || !domain.includes('.')) return false;
//   return !BLOCKED_DOMAINS.has(domain);
// }
// function simpleHash(str) {
//   let h = 0x811c9dc5;
//   for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
//   return h.toString(16);
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // GLOBAL STYLES INJECTED ONCE
// // ─────────────────────────────────────────────────────────────────────────────
// const GLOBAL_CSS = `
//   :root {
//     --blue-deep: #0820c2;
//     --blue-mid:  #1d4ed8;
//     --blue-vivid:#3b82f6;
//     --blue-light:#bfdbfe;
//     --red-admin: #991b1b;
//     --red-vivid: #ef4444;

//     /* light */
//     --bg-base:   #f0f4ff;
//     --bg-card:   #ffffff;
//     --bg-glass:  rgba(255,255,255,0.75);
//     --text-main: #0f172a;
//     --text-muted:#64748b;
//     --border:    #e2e8f0;
//     --nav-bg:    linear-gradient(135deg,#0820c2 0%,#1d4ed8 60%,#0369a1 100%);
//   }
//   .dark-mode {
//     --bg-base:   #080f2a;
//     --bg-card:   #101831;
//     --bg-glass:  rgba(16,24,49,0.85);
//     --text-main: #e2e8f0;
//     --text-muted:#94a3b8;
//     --border:    #1e2d52;
//     --nav-bg:    linear-gradient(135deg,#050d1f 0%,#0d1f4a 60%,#0c2353 100%);
//   }

//   /* ── transitions ── */
//   *, *::before, *::after { box-sizing: border-box; transition: background-color .25s ease, border-color .25s ease, color .15s ease; }

//   /* ── scrollbar ── */
//   ::-webkit-scrollbar { width:6px; height:6px; }
//   ::-webkit-scrollbar-track { background: transparent; }
//   ::-webkit-scrollbar-thumb { background: #3b82f680; border-radius:99px; }
//   ::-webkit-scrollbar-thumb:hover { background:#1d4ed8; }

//   /* ── keyframes ── */
//   @keyframes fadeUp      { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
//   @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
//   @keyframes slideDown   { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
//   @keyframes slideLeft   { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
//   @keyframes modalPop    { from{opacity:0;transform:scale(.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
//   @keyframes spinRing    { to{transform:rotate(360deg)} }
//   @keyframes counterSpin { to{transform:rotate(-360deg)} }
//   @keyframes pulseCenter { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.12);opacity:.8} }
//   @keyframes shimmer     { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
//   @keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
//   @keyframes glow        { 0%,100%{box-shadow:0 0 18px #3b82f640} 50%{box-shadow:0 0 36px #3b82f6a0} }
//   @keyframes particleDrift { 0%{transform:translateY(0) translateX(0);opacity:0} 20%{opacity:.6} 100%{transform:translateY(-90px) translateX(30px);opacity:0} }
//   @keyframes scanLine    { 0%{top:-2%} 100%{top:102%} }
//   @keyframes borderFlow  { 0%{border-color:#1d4ed8} 33%{border-color:#3b82f6} 66%{border-color:#0369a1} 100%{border-color:#1d4ed8} }
//   @keyframes neonPulse   { 0%,100%{text-shadow:0 0 8px #3b82f680} 50%{text-shadow:0 0 22px #3b82f6,0 0 40px #1d4ed880} }

//   .anim-fadeUp   { animation: fadeUp   .45s cubic-bezier(.22,1,.36,1) both; }
//   .anim-fadeIn   { animation: fadeIn   .35s ease both; }
//   .anim-slideDown{ animation: slideDown .3s ease both; }
//   .anim-slideLeft{ animation: slideLeft .4s cubic-bezier(.22,1,.36,1) both; }
//   .anim-modalPop { animation: modalPop  .32s cubic-bezier(.34,1.56,.64,1) both; }
//   .anim-float    { animation: float    3s ease-in-out infinite; }
//   .anim-glow     { animation: glow     2.5s ease-in-out infinite; }
//   .anim-neon     { animation: neonPulse 2s ease-in-out infinite; }

//   /* ── glass card ── */
//   .glass {
//     background: var(--bg-glass);
//     backdrop-filter: blur(16px) saturate(1.6);
//     -webkit-backdrop-filter: blur(16px) saturate(1.6);
//     border: 1px solid rgba(255,255,255,0.12);
//   }
//   .dark-mode .glass {
//     border: 1px solid rgba(255,255,255,0.07);
//   }

//   /* ── shimmer skeleton ── */
//   .shimmer {
//     background: linear-gradient(90deg, var(--bg-card) 25%, var(--border) 50%, var(--bg-card) 75%);
//     background-size: 200% 100%;
//     animation: shimmer 1.5s infinite;
//   }

//   /* ── hover lift ── */
//   .lift { transition: transform .2s ease, box-shadow .2s ease; }
//   .lift:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(29,78,216,.22); }

//   /* ── input base ── */
//   .inp {
//     width: 100%;
//     padding: 10px 12px 10px 36px;
//     border: 1.5px solid var(--border);
//     border-radius: 12px;
//     font-size: 13px;
//     background: var(--bg-base);
//     color: var(--text-main);
//     outline: none;
//     transition: border-color .2s, box-shadow .2s;
//   }
//   .inp:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px #3b82f622; }

//   /* ── card base ── */
//   .card {
//     background: var(--bg-card);
//     border: 1px solid var(--border);
//     border-radius: 18px;
//   }

//   /* ── nav active indicator ── */
//   .nav-indicator {
//     position:absolute; bottom:0; left:50%; transform:translateX(-50%);
//     width:0; height:2px; background:#60a5fa; border-radius:99px;
//     transition: width .25s ease;
//   }
//   .nav-btn-active .nav-indicator { width:70%; }

//   /* ── particle dots ── */
//   .particle {
//     position:absolute; border-radius:50%; pointer-events:none;
//     animation: particleDrift var(--dur,4s) var(--delay,0s) ease-out infinite;
//   }

//   /* line-clamp utilities */
//   .lc1 { display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden; }
//   .lc2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
//   .lc3 { display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

//   /* Dark mode card overrides for Tailwind colors */
//   .dark-mode .bg-white   { background-color: #101831 !important; }
//   .dark-mode .bg-slate-50{ background-color: #080f2a !important; }
//   .dark-mode .bg-blue-100{ background-color: #0d1a3a !important; }
//   .dark-mode .bg-blue-200{ background-color: #111e40 !important; }
//   .dark-mode .text-slate-800 { color:#e2e8f0 !important; }
//   .dark-mode .text-slate-700 { color:#cbd5e1 !important; }
//   .dark-mode .text-slate-600 { color:#94a3b8 !important; }
//   .dark-mode .text-slate-500 { color:#64748b !important; }
//   .dark-mode .border-slate-200 { border-color:#1e2d52 !important; }
//   .dark-mode .border-slate-100 { border-color:#162040 !important; }
//   .dark-mode .bg-slate-100 { background-color:#111e40 !important; }
//   .dark-mode .bg-slate-200 { background-color:#162447 !important; }
// `;

// function StyleTag() {
//   return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />;
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // DARK TOGGLE BUTTON
// // ─────────────────────────────────────────────────────────────────────────────
// function DarkToggle({ style: extraStyle }) {
//   const { dark, toggleDark } = useDark();
//   return (
//     <button
//       onClick={toggleDark}
//       title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
//       style={{
//         display:'flex', alignItems:'center', justifyContent:'center',
//         width:38, height:38, borderRadius:10,
//         background: dark ? '#1e2d52' : 'rgba(255,255,255,0.15)',
//         border: `1.5px solid ${dark ? '#2d4170' : 'rgba(255,255,255,0.25)'}`,
//         cursor:'pointer', flexShrink:0, transition:'all .25s',
//         ...extraStyle,
//       }}
//     >
//       {dark
//         ? <Sun size={16} color="#fbbf24" />
//         : <Moon size={16} color="#e2e8f0" />}
//     </button>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // LOADING SCREEN
// // ─────────────────────────────────────────────────────────────────────────────
// function LoadingScreen({ role }) {
//   const [progress, setProgress] = useState(0);
//   const [phase, setPhase] = useState(0); // 0=init,1=loading,2=almost
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress(prev => {
//         const next = prev + (prev < 70 ? 2.2 : prev < 90 ? 1.1 : 0.7);
//         if (next >= 100) { clearInterval(interval); return 100; }
//         return next;
//       });
//     }, 36);
//     return () => clearInterval(interval);
//   }, []);
//   useEffect(() => {
//     if (progress > 30) setPhase(1);
//     if (progress > 80) setPhase(2);
//   }, [progress]);

//   const isAdmin = role === 'admin';
//   const ac = isAdmin ? '#ef4444' : '#3b82f6';
//   const ac2 = isAdmin ? '#f97316' : '#60a5fa';

//   const phases = ['Connecting…','Loading resources…','Almost ready…'];

//   return (
//     <div style={{
//       position:'fixed', inset:0, zIndex:9999,
//       background:`linear-gradient(to bottom, #030818 0%, #050d2e 40%, #0a1a52 100%)`,
//       display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
//       fontFamily:"'Segoe UI', sans-serif", overflow:'hidden',
//     }}>
//       {/* Ambient particles */}
//       {[...Array(18)].map((_,i)=>(
//         <div key={i} className="particle" style={{
//           width: Math.random()*4+2, height: Math.random()*4+2,
//           background: i%3===0 ? ac : i%3===1 ? '#60a5fa' : '#ffffff40',
//           left: `${Math.random()*100}%`, bottom:`${Math.random()*30}%`,
//           '--dur':`${3+Math.random()*4}s`, '--delay':`${Math.random()*4}s`,
//         }}/>
//       ))}

//       {/* Scan line */}
//       <div style={{
//         position:'absolute', left:0, right:0, height:2,
//         background:`linear-gradient(90deg,transparent,${ac}60,transparent)`,
//         animation:'scanLine 3s linear infinite', pointerEvents:'none',
//       }}/>

//       {/* Rings */}
//       <div style={{position:'relative', width:200, height:200, marginBottom:40}}>
//         {[200,168,138,110,84].map((sz,i)=>(
//           <div key={i} style={{
//             position:'absolute',
//             width:sz, height:sz,
//             top:(200-sz)/2, left:(200-sz)/2,
//             borderRadius:'50%',
//             border:`${i%2===0?2.5:2}px solid`,
//             borderColor: i%2===0
//               ? `${ac}80 ${ac} ${ac}30 ${ac}`
//               : `${ac}20 ${ac}70 ${ac}20 ${ac}70`,
//             animation:`${i%2===0?'spinRing':'counterSpin'} ${[3,2.2,1.8,1.4,1].map(v=>v+'s')[i]} linear infinite`,
//           }}/>
//         ))}
//         {/* Center icon */}
//         <div style={{
//           position:'absolute', top:'50%', left:'50%',
//           transform:'translate(-50%,-50%)',
//           width:50, height:50, borderRadius:14,
//           background:`${ac}18`, border:`1.5px solid ${ac}50`,
//           display:'flex', alignItems:'center', justifyContent:'center',
//           animation:'pulseCenter 2s ease-in-out infinite',
//         }}>
//           {isAdmin ? <Shield size={22} color={ac} /> : <User size={22} color={ac} />}
//         </div>
//       </div>

//       <div style={{textAlign:'center', animation:'fadeUp .6s ease both'}}>
//         <p style={{fontSize:11, fontWeight:800, letterSpacing:'.22em', color:`${ac}cc`, textTransform:'uppercase', marginBottom:4}}>
//           {isAdmin ? 'Admin Portal' : 'PSP MARKET'}
//         </p>
//         <p style={{fontSize:14, color:'rgba(255,255,255,.5)', marginBottom:28, minHeight:20, transition:'all .3s'}}>
//           {phases[phase]}
//         </p>
//         {/* Progress bar */}
//         <div style={{width:220, height:4, borderRadius:99, background:'rgba(255,255,255,.07)', overflow:'hidden', margin:'0 auto', position:'relative'}}>
//           <div style={{
//             height:'100%', borderRadius:99,
//             background:`linear-gradient(90deg,${isAdmin?'#991b1b':' #1e40af'},${ac},${ac2})`,
//             width:`${progress}%`, transition:'width .08s linear',
//             boxShadow:`0 0 8px ${ac}80`,
//           }}/>
//         </div>
//         <p style={{fontSize:11, color:'rgba(255,255,255,.35)', marginTop:8}}>{Math.round(progress)}%</p>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // CATEGORY STYLE MAP
// // ─────────────────────────────────────────────
// const CATEGORY_STYLES = {
//   Car:        { emoji:'🚗', bg:'from-red-100 to-red-50',     text:'text-red-700',    border:'border-red-200' },
//   Computer:   { emoji:'💻', bg:'from-blue-100 to-blue-50',   text:'text-blue-700',   border:'border-blue-200' },
//   Fruit:      { emoji:'🍎', bg:'from-green-100 to-green-50', text:'text-green-700',  border:'border-green-200' },
//   Vegetable:  { emoji:'🥦', bg:'from-emerald-100 to-emerald-50', text:'text-emerald-700', border:'border-emerald-200' },
//   Clothes:    { emoji:'👕', bg:'from-pink-100 to-pink-50',   text:'text-pink-700',   border:'border-pink-200' },
//   Phone:      { emoji:'📱', bg:'from-violet-100 to-violet-50', text:'text-violet-700', border:'border-violet-200' },
//   Accessories:{ emoji:'💎', bg:'from-amber-100 to-amber-50', text:'text-amber-700',  border:'border-amber-200' },
//   'Hotel Book':{ emoji:'🏨', bg:'from-cyan-100 to-cyan-50',  text:'text-cyan-700',   border:'border-cyan-200' },
//   Meet:       { emoji:'🤝', bg:'from-orange-100 to-orange-50', text:'text-orange-700', border:'border-orange-200' },
// };
// const DEFAULT_STYLE = { emoji:'📦', bg:'from-slate-100 to-slate-50', text:'text-slate-700', border:'border-slate-200' };

// // ─────────────────────────────────────────────
// // GOOGLE / FACEBOOK ICONS
// // ─────────────────────────────────────────────
// function GoogleIcon() {
//   return (
//     <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
//       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//     </svg>
//   );
// }
// function FacebookIcon() {
//   return (
//     <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
//       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//     </svg>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // INPUT WRAPPER (icon + input)
// // ─────────────────────────────────────────────────────────────────────────────
// function InputField({ icon, type='text', placeholder, value, onChange, onBlur, right, className='', ...rest }) {
//   return (
//     <div style={{position:'relative'}}>
//       <span style={{position:'absolute',inset:'0 auto 0 0',display:'flex',alignItems:'center',paddingLeft:11,color:'var(--text-muted)',pointerEvents:'none'}}>
//         {icon}
//       </span>
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//         onBlur={onBlur}
//         className={`inp ${className}`}
//         {...rest}
//       />
//       {right && (
//         <span style={{position:'absolute',inset:'0 0 0 auto',display:'flex',alignItems:'center',paddingRight:11}}>
//           {right}
//         </span>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // SIGN-IN PROMPT MODAL
// // ─────────────────────────────────────────────────────────────────────────────
// function SignInPrompt({ product, onClose, onLogin }) {
//   const { dark } = useDark();
//   const [email,    setEmail]    = useState('');
//   const [password, setPassword] = useState('');
//   const [showPw,   setShowPw]   = useState(false);
//   const [err,      setErr]      = useState('');
//   const [loading,  setLoading]  = useState(false);

//   const submit = async (e) => {
//     e.preventDefault();
//     setErr('');
//     if (!email || !password) { setErr('Please fill in all fields.'); return; }
//     if (!isEmailLegit(email)) { setErr('❌ This email address looks invalid or fake.'); return; }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/api/users/login`, {
//         method: 'POST', headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: email.trim().toLowerCase(), passwordHash: simpleHash(password) }),
//       });
//       const data = await res.json();
//       if (res.status === 404) { setErr('🚫 No account found. Please register first.'); return; }
//       if (res.status === 401) { setErr('🔑 Incorrect password.'); return; }
//       if (!res.ok)            { setErr(data.error || 'Sign in failed.'); return; }
//       onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//     } catch { setErr('⚠️ Network error. Please try again.'); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div
//       onClick={e => e.target===e.currentTarget && onClose()}
//       style={{
//         position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16,
//         background:'rgba(3,8,24,.72)', backdropFilter:'blur(8px)',
//       }}
//     >
//       <div className="anim-modalPop card" style={{width:'100%',maxWidth:380,overflow:'hidden'}}>
//         {/* Header */}
//         <div style={{
//           background:'linear-gradient(135deg,#0820c2,#1d4ed8,#0369a1)',
//           padding:'20px 20px 16px', color:'#fff', position:'relative',
//         }}>
//           <button onClick={onClose} style={{position:'absolute',top:12,right:12,background:'rgba(255,255,255,.12)',border:'none',borderRadius:8,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff'}}>
//             <X size={14}/>
//           </button>
//           <div style={{display:'flex',gap:12,alignItems:'center'}}>
//             <div style={{width:52,height:52,borderRadius:12,background:'rgba(255,255,255,.15)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
//               {product.image
//                 ? <img src={product.image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}}/>
//                 : <span style={{fontSize:28}}>{(CATEGORY_STYLES[product.category]||DEFAULT_STYLE).emoji}</span>}
//             </div>
//             <div>
//               <p style={{fontSize:10,color:'#93c5fd',marginBottom:2}}>You selected</p>
//               <p style={{fontWeight:700,fontSize:13,lineHeight:1.3}}>{product.name}</p>
//               <p style={{color:'#93c5fd',fontSize:11,marginTop:2}}>${Number(product.price||0).toFixed(2)} · {product.category}</p>
//             </div>
//           </div>
//           <div style={{marginTop:12,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:10,padding:'7px 12px',textAlign:'center'}}>
//             <p style={{fontSize:11,color:'#bfdbfe'}}>🔒 Sign in to add to cart & checkout securely</p>
//           </div>
//         </div>

//         {/* Body */}
//         <div style={{padding:'18px 20px 20px',background:'var(--bg-card)'}}>
//           <h3 style={{fontWeight:700,color:'var(--text-main)',fontSize:14,marginBottom:2}}>Sign in to continue</h3>
//           <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:14}}>Use the email & password you registered with.</p>
//           {err && (
//             <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',fontSize:11,padding:'8px 12px',borderRadius:10,marginBottom:12,display:'flex',gap:6,alignItems:'center'}}>
//               ⚠️ {err}
//             </div>
//           )}
//           <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:10}}>
//             <InputField icon={<Mail size={13}/>} type="email" placeholder="your@email.com" value={email}
//               onChange={e=>{setEmail(e.target.value);setErr('')}} />
//             <InputField icon={<Lock size={13}/>} type={showPw?'text':'password'} placeholder="••••••••" value={password}
//               onChange={e=>{setPassword(e.target.value);setErr('')}}
//               right={<button type="button" onClick={()=>setShowPw(!showPw)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex'}}>
//                 {showPw?<EyeOff size={13}/>:<Eye size={13}/>}
//               </button>}
//             />
//             <button type="submit" disabled={loading} style={{
//               padding:'10px',borderRadius:12,border:'none',cursor:'pointer',
//               background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',
//               color:'#fff',fontWeight:700,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',gap:6,
//               opacity:loading?.65:1,boxShadow:'0 4px 14px #3b82f640',
//             }}>
//               {loading ? <RefreshCw size={13} style={{animation:'spinRing .8s linear infinite'}}/> : <><User size={13}/> Sign in & view product <ArrowRight size={13}/></>}
//             </button>
//           </form>
//           <div style={{display:'flex',alignItems:'center',gap:8,margin:'12px 0'}}>
//             <div style={{flex:1,height:1,background:'var(--border)'}}/><span style={{fontSize:10,color:'var(--text-muted)'}}>or</span><div style={{flex:1,height:1,background:'var(--border)'}}/>
//           </div>
//           <button onClick={()=>onLogin('guest','guest','Guest',null,null)} style={{
//             width:'100%',padding:'9px',borderRadius:12,border:'1.5px solid var(--border)',
//             background:'transparent',color:'var(--text-main)',fontSize:13,fontWeight:600,
//             cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
//           }}>
//             <Eye size={13}/> Continue as guest
//           </button>
//           <p style={{textAlign:'center',fontSize:10,color:'var(--text-muted)',marginTop:8}}>No account? Close this and register first.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // AUTH MODAL
// // ─────────────────────────────────────────────────────────────────────────────
// function AuthModal({ onClose, onLogin, defaultTab = 'signin' }) {
//   const MY_ADMIN_EMAIL    = "sopheakp175@gmail.com";
//   const MY_ADMIN_PASSWORD = "220927";
//   const { dark } = useDark();

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
//   const [loading,      setLoading]      = useState(false);

//   const switchTab = (tab) => {
//     setActiveTab(tab); setError(''); setEmailHint('');
//     setEmail(''); setPassword(''); setConfirmPass(''); setName('');
//   };

//   const onEmailBlur = async () => {
//     if (!email) { setEmailHint(''); return; }
//     if (!isEmailLegit(email)) { setEmailHint('⚠️ This email looks invalid or fake.'); return; }
//     if (activeTab === 'admin') { setEmailHint(''); return; }
//     try {
//       const res  = await fetch(`${API}/api/users/check-email`, {
//         method:'POST', headers:{'Content-Type':'application/json'},
//         body: JSON.stringify({ email: email.trim().toLowerCase() }),
//       });
//       const data = await res.json();
//       if (activeTab === 'register' && data.exists) setEmailHint('📧 Already registered — sign in instead.');
//       else if (activeTab === 'signin' && !data.exists) setEmailHint('🚫 No account found — please register first.');
//       else setEmailHint('');
//     } catch { setEmailHint(''); }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (activeTab === 'admin') {
//       if (!email || !password) { setError('Please fill in all fields.'); return; }
//       if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
//         onLogin('admin', email, 'Phy Sopheak', 'ADMIN-001', null);
//       } else { setError('❌ Access denied. Invalid admin credentials.'); }
//       return;
//     }

//     if (activeTab === 'register') {
//       if (!name.trim())         { setError('Please enter your full name.'); return; }
//       if (!email)               { setError('Please enter your email.'); return; }
//       if (!isEmailLegit(email)) { setError('❌ Invalid or fake email address.'); return; }
//       if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
//       if (password !== confirmPass) { setError('Passwords do not match.'); return; }
//       setLoading(true);
//       try {
//         const res = await fetch(`${API}/api/users/register`, {
//           method:'POST', headers:{'Content-Type':'application/json'},
//           body: JSON.stringify({ id:`USR-${Date.now()}`, name:name.trim(), email:email.trim().toLowerCase(), passwordHash:simpleHash(password) }),
//         });
//         const data = await res.json();
//         if (res.status === 409) { setError('📧 Email already registered. Sign in instead.'); return; }
//         if (!res.ok)            { setError(data.error || 'Registration failed.'); return; }
//         onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//       } catch { setError('⚠️ Network error. Check your connection.'); }
//       finally { setLoading(false); }
//       return;
//     }

//     if (!email)    { setError('Please enter your email.'); return; }
//     if (!password) { setError('Please enter your password.'); return; }
//     if (!isEmailLegit(email)) { setError('❌ Invalid email address.'); return; }
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/api/users/login`, {
//         method:'POST', headers:{'Content-Type':'application/json'},
//         body: JSON.stringify({ email:email.trim().toLowerCase(), passwordHash:simpleHash(password) }),
//       });
//       const data = await res.json();
//       if (res.status === 404) { setError('🚫 No account found. Please register first.'); return; }
//       if (res.status === 401) { setError('🔑 Incorrect password.'); return; }
//       if (!res.ok)            { setError(data.error || 'Sign in failed.'); return; }
//       onLogin('user', data.user.email, data.user.name, data.user.id, data.user.avatar);
//     } catch { setError('⚠️ Network error. Check your connection.'); }
//     finally { setLoading(false); }
//   };

//   const tabConfig = [
//     { key:'signin',   label:'Sign In',  icon:<User size={12}/> },
//     { key:'register', label:'Register', icon:<UserPlus size={12}/> },
//     { key:'admin',    label:'Admin',    icon:<Shield size={12}/> },
//   ];

//   const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 9 ? 2 : password.length < 12 ? 3 : 4;
//   const pwLabels = ['','Too short','Fair','Good','Strong'];
//   const pwColors = ['','#ef4444','#f97316','#22c55e','#10b981'];

//   return (
//     <div
//       onClick={e=>e.target===e.currentTarget && onClose()}
//       style={{
//         position:'fixed',inset:0,zIndex:50,display:'flex',alignItems:'center',justifyContent:'center',padding:16,
//         backgroundImage:`linear-gradient(rgba(3,8,24,.78),rgba(3,8,24,.85)), url('https://img.sanishtech.com/u/1633594ef766e0b33213011add414d67.png')`,
//         backgroundPosition:'center', backgroundSize:'cover',
//         backdropFilter:'blur(4px)',
//       }}
//     >
//       <div className="anim-modalPop card" style={{width:'100%',maxWidth:420,overflow:'hidden',boxShadow:'0 32px 80px rgba(3,8,40,.6), 0 0 0 1px rgba(59,130,246,.2)'}}>

//         {/* Modal header */}
//         <div style={{
//           padding:'22px 22px 0',
//           background:'var(--bg-card)',
//           position:'relative',
//           textAlign:'center',
//         }}>
//           <button onClick={onClose} style={{position:'absolute',top:14,right:14,background:'var(--bg-base)',border:'1px solid var(--border)',borderRadius:8,width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-muted)'}}>
//             <X size={14}/>
//           </button>

//           {/* Animated logo */}
//           <div className="anim-glow" style={{width:52,height:52,borderRadius:14,overflow:'hidden',margin:'0 auto 10px',border:'2px solid #3b82f640'}}>
//             <img src={LOGO} alt="PSP MART" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
//           </div>

//           <h2 style={{fontSize:16,fontWeight:800,color:'var(--text-main)',marginBottom:2}}>
//             {activeTab==='signin'   && 'Sign in to PSP MARKET'}
//             {activeTab==='register' && 'Create your account'}
//             {activeTab==='admin'    && 'Admin Access Only'}
//           </h2>
//           <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:16}}>
//             {activeTab==='signin'   && 'Access your orders, wishlist & deals'}
//             {activeTab==='register' && 'Join 50,000+ happy PSP MARKET shoppers'}
//             {activeTab==='admin'    && 'Restricted to authorised personnel only'}
//           </p>

//           {/* Tabs */}
//           <div style={{display:'flex',gap:4,background:'var(--bg-base)',border:'1px solid var(--border)',borderRadius:12,padding:4,marginBottom:0}}>
//             {tabConfig.map(t=>(
//               <button key={t.key} type="button" onClick={()=>switchTab(t.key)} style={{
//                 flex:1, padding:'8px 4px', borderRadius:9, border:'none', cursor:'pointer',
//                 display:'flex', alignItems:'center', justifyContent:'center', gap:5,
//                 fontSize:11, fontWeight:700,
//                 background: activeTab===t.key ? (t.key==='admin' ? '#991b1b' : '#1d4ed8') : 'transparent',
//                 color: activeTab===t.key ? '#fff' : 'var(--text-muted)',
//                 transition:'all .2s', boxShadow: activeTab===t.key ? '0 2px 8px rgba(0,0,0,.25)' : 'none',
//               }}>
//                 {t.icon} {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Modal body */}
//         <div style={{padding:'18px 22px 22px',background:'var(--bg-card)'}}>
//           {activeTab !== 'admin' && (
//             <>
//               <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:12}}>
//                 {[['Google',<GoogleIcon/>],['Facebook',<FacebookIcon/>]].map(([lbl,ico])=>(
//                   <button key={lbl} type="button" style={{
//                     display:'flex',alignItems:'center',justifyContent:'center',gap:7,
//                     padding:'9px',borderRadius:11,border:'1.5px solid var(--border)',
//                     background:'var(--bg-base)',color:'var(--text-main)',fontSize:12,fontWeight:600,
//                     cursor:'pointer',transition:'all .2s',
//                   }}
//                     onMouseEnter={e=>e.currentTarget.style.borderColor='#3b82f6'}
//                     onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}
//                   >
//                     {ico} {lbl}
//                   </button>
//                 ))}
//               </div>
//               <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
//                 <div style={{flex:1,height:1,background:'var(--border)'}}/><span style={{fontSize:10,color:'var(--text-muted)',whiteSpace:'nowrap'}}>or continue with email</span><div style={{flex:1,height:1,background:'var(--border)'}}/>
//               </div>
//             </>
//           )}

//           {error && (
//             <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',fontSize:11,padding:'9px 12px',borderRadius:10,marginBottom:12,display:'flex',gap:6,alignItems:'flex-start'}}>
//               ⚠️ <span>{error}</span>
//             </div>
//           )}

//           {activeTab==='register' && (
//             <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:10,padding:'9px 12px',marginBottom:12,display:'flex',gap:7,alignItems:'flex-start'}}>
//               <Zap size={13} color="#f59e0b" style={{marginTop:1,flexShrink:0}}/>
//               <p style={{fontSize:11,color:'#92400e'}}>Register now and use <strong>WELCOME15</strong> at checkout for 15% off!</p>
//             </div>
//           )}

//           <div style={{display:'flex',flexDirection:'column',gap:10}}>
//             {activeTab==='register' && (
//               <div>
//                 <label style={{display:'block',fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Full name</label>
//                 <InputField icon={<User size={13}/>} placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)}/>
//               </div>
//             )}

//             <div>
//               <label style={{display:'block',fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Email address</label>
//               <InputField icon={<Mail size={13}/>} type="email"
//                 placeholder={activeTab==='admin'?'admin@example.com':'your@email.com'}
//                 value={email}
//                 onChange={e=>{setEmail(e.target.value);setEmailHint('');setError('')}}
//                 onBlur={onEmailBlur}
//               />
//               {emailHint && <p style={{fontSize:11,color:'#d97706',marginTop:4,marginLeft:4}}>{emailHint}</p>}
//             </div>

//             <div>
//               <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
//                 <label style={{fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em'}}>Password</label>
//                 {activeTab==='signin' && <button type="button" style={{fontSize:10,color:'#3b82f6',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Forgot password?</button>}
//               </div>
//               <InputField icon={<Lock size={13}/>} type={showPassword?'text':'password'} placeholder="••••••••"
//                 value={password} onChange={e=>{setPassword(e.target.value);setError('')}}
//                 right={<button type="button" onClick={()=>setShowPassword(!showPassword)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex'}}>
//                   {showPassword?<EyeOff size={13}/>:<Eye size={13}/>}
//                 </button>}
//               />
//               {activeTab==='register' && password.length>0 && (
//                 <div style={{marginTop:6}}>
//                   <div style={{display:'flex',gap:3}}>
//                     {[1,2,3,4].map(i=>(
//                       <div key={i} style={{height:3,flex:1,borderRadius:99,background:pwStrength>=i?pwColors[pwStrength]:'var(--border)',transition:'background .3s'}}/>
//                     ))}
//                   </div>
//                   <p style={{fontSize:10,color:pwColors[pwStrength]||'var(--text-muted)',marginTop:3,fontWeight:600}}>{pwLabels[pwStrength]}</p>
//                 </div>
//               )}
//             </div>

//             {activeTab==='register' && (
//               <div>
//                 <label style={{display:'block',fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Confirm password</label>
//                 <InputField
//                   icon={<Lock size={13}/>}
//                   type={showConfirm?'text':'password'}
//                   placeholder="••••••••"
//                   value={confirmPass}
//                   onChange={e=>{setConfirmPass(e.target.value);setError('')}}
//                   right={
//                     <div style={{display:'flex',alignItems:'center',gap:4}}>
//                       {confirmPass && <span style={{fontSize:13}}>{confirmPass===password?'✅':'❌'}</span>}
//                       <button type="button" onClick={()=>setShowConfirm(!showConfirm)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex'}}>
//                         {showConfirm?<EyeOff size={13}/>:<Eye size={13}/>}
//                       </button>
//                     </div>
//                   }
//                   style={{paddingRight:56}}
//                 />
//               </div>
//             )}

//             {activeTab==='signin' && (
//               <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer',fontSize:12,color:'var(--text-muted)'}}>
//                 <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{accentColor:'#3b82f6',width:13,height:13}}/>
//                 Remember me on this device
//               </label>
//             )}

//             <button type="button" onClick={handleSubmit} disabled={loading} style={{
//               padding:'11px',borderRadius:12,border:'none',cursor:'pointer',
//               background: activeTab==='admin'
//                 ? 'linear-gradient(135deg,#7f1d1d,#dc2626)'
//                 : 'linear-gradient(135deg,#0820c2,#1d4ed8,#3b82f6)',
//               color:'#fff', fontWeight:700, fontSize:13,
//               display:'flex',alignItems:'center',justifyContent:'center',gap:7,
//               opacity:loading?.65:1,
//               boxShadow: activeTab==='admin' ? '0 4px 14px #dc262640' : '0 4px 18px #1d4ed840',
//               transition:'filter .2s,transform .15s',
//               marginTop:4,
//             }}
//               onMouseEnter={e=>e.currentTarget.style.filter='brightness(1.1)'}
//               onMouseLeave={e=>e.currentTarget.style.filter='brightness(1)'}
//             >
//               {loading
//                 ? <RefreshCw size={14} style={{animation:'spinRing .8s linear infinite'}}/>
//                 : <>
//                     {activeTab==='signin'   && <><User size={13}/> Sign in to PSP MARKET</>}
//                     {activeTab==='register' && <><UserPlus size={13}/> Create my account</>}
//                     {activeTab==='admin'    && <><Shield size={13}/> Verify admin identity</>}
//                     <ArrowRight size={13}/>
//                   </>
//               }
//             </button>
//           </div>

//           {activeTab !== 'admin' && (
//             <>
//               <div style={{display:'flex',alignItems:'center',gap:8,margin:'14px 0 10px'}}>
//                 <div style={{flex:1,height:1,background:'var(--border)'}}/><span style={{fontSize:10,color:'var(--text-muted)'}}>or</span><div style={{flex:1,height:1,background:'var(--border)'}}/>
//               </div>
//               <button type="button" onClick={()=>onLogin('guest','guest','Guest',null,null)} style={{
//                 width:'100%',padding:'10px',borderRadius:12,border:'1.5px solid var(--border)',
//                 background:'transparent',color:'var(--text-main)',fontSize:12,fontWeight:600,
//                 cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,
//               }}>
//                 <Eye size={13}/> Browse as guest
//               </button>
//               <p style={{textAlign:'center',fontSize:10,color:'var(--text-muted)',marginTop:8}}>Guest accounts can't save carts or track orders.</p>
//             </>
//           )}
//           {activeTab==='admin' && (
//             <p style={{textAlign:'center',fontSize:10,color:'var(--text-muted)',marginTop:14,paddingTop:10,borderTop:'1px solid var(--border)'}}>Private admin channel. All access attempts are logged.</p>
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
//   const [hovered, setHovered] = useState(false);
//   const style = CATEGORY_STYLES[product.category] || DEFAULT_STYLE;
//   return (
//     <div
//       className="lift"
//       onMouseEnter={()=>setHovered(true)}
//       onMouseLeave={()=>setHovered(false)}
//       onClick={()=>onProductClick(product)}
//       style={{
//         background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:18,
//         overflow:'hidden', cursor:'pointer',
//         boxShadow: hovered ? '0 16px 40px rgba(29,78,216,.18)' : '0 2px 8px rgba(0,0,0,.06)',
//         transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
//         transition:'all .25s cubic-bezier(.22,1,.36,1)',
//       }}
//     >
//       <div style={{position:'relative',background:'linear-gradient(135deg,#f0f4ff,#e8eeff)',height:140,overflow:'hidden'}}>
//         <img src={product.image} alt={product.name}
//           style={{width:'100%',height:'100%',objectFit:'cover',transform:hovered?'scale(1.08)':'scale(1)',transition:'transform .4s ease'}}
//           onError={e=>{e.target.style.display='none'}}
//         />
//         <span style={{position:'absolute',top:8,left:8,background:'rgba(255,255,255,.9)',backdropFilter:'blur(6px)',fontSize:9,fontWeight:700,padding:'3px 8px',borderRadius:99,color:'#475569',letterSpacing:'.05em',textTransform:'uppercase'}}>
//           {product.category}
//         </span>
//         <button onClick={e=>{e.stopPropagation();setLiked(!liked)}} style={{
//           position:'absolute',bottom:8,right:8,width:28,height:28,borderRadius:'50%',
//           background:'rgba(255,255,255,.9)',border:'none',cursor:'pointer',
//           display:'flex',alignItems:'center',justifyContent:'center',
//           transform:liked?'scale(1.2)':'scale(1)', transition:'transform .2s',
//         }}>
//           <Heart size={13} style={{fill:liked?'#ef4444':'none',color:liked?'#ef4444':'#94a3b8'}}/>
//         </button>
//       </div>
//       <div style={{padding:'10px 12px 12px'}}>
//         <p className="lc2" style={{fontSize:12,fontWeight:700,color:'var(--text-main)',marginBottom:4,lineHeight:1.4}}>{product.name}</p>
//         {product.description && <p className="lc1" style={{fontSize:10,color:'var(--text-muted)',marginBottom:6}}>{product.description}</p>}
//         {product.variants?.length > 0 && (
//           <div style={{display:'flex',flexWrap:'wrap',gap:3,marginBottom:6}}>
//             {product.variants.slice(0,2).map((v,i)=>(
//               <span key={i} style={{background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe',padding:'2px 6px',borderRadius:6,fontSize:9,fontWeight:700}}>{v.label}</span>
//             ))}
//           </div>
//         )}
//         <p style={{fontSize:15,fontWeight:800,color:'#1d4ed8',marginBottom:8}}>${Number(product.price||0).toFixed(2)}</p>
//         <button onClick={e=>{e.stopPropagation();onProductClick(product)}} style={{
//           width:'100%',padding:'7px 0',borderRadius:10,border:'none',cursor:'pointer',
//           background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',color:'#fff',
//           fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:5,
//           boxShadow:'0 3px 10px #3b82f640',
//         }}>
//           <ShoppingCart size={11}/> Add to cart
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // USER COMMENT SECTION
// // ─────────────────────────────────────────────────────────────────────────────
// function UserCommentSection() {
//   const [comments,   setComments]   = useState([]);
//   const [username,   setUsername]   = useState('');
//   const [comment,    setComment]    = useState('');
//   const [rating,     setRating]     = useState(5);
//   const [hovered,    setHovered]    = useState(0);
//   const [err,        setErr]        = useState('');
//   const [success,    setSuccess]    = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [loading,    setLoading]    = useState(true);

//   const AVATAR_COLORS = ['#3b82f6','#10b981','#8b5cf6','#ec4899','#f59e0b','#06b6d4','#ef4444'];
//   const getAvatarColor = (name) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
//   const RATING_LABELS  = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

//   const loadComments = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API}/api/comments`);
//       if (res.ok) {
//         const data = await res.json();
//         setComments(data);
//         try { localStorage.setItem('psp_comments', JSON.stringify(data)); } catch {}
//       } else throw new Error('non-200');
//     } catch {
//       try { const s=localStorage.getItem('psp_comments'); setComments(s?JSON.parse(s):[]); } catch { setComments([]); }
//     } finally { setLoading(false); }
//   };

//   useEffect(() => { loadComments(); }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!username.trim())          { setErr('Please enter your name.'); return; }
//     if (!comment.trim())           { setErr('Please write a comment.'); return; }
//     if (comment.trim().length < 5) { setErr('Comment is too short (minimum 5 characters).'); return; }

//     const dateLabel = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
//     const payload = {
//       id: Date.now().toString(36)+Math.random().toString(36).slice(2,6),
//       username:username.trim(),
//       email:`${username.trim().toLowerCase().replace(/\s+/g,'.')}@pspmarket.guest`,
//       comment:comment.trim(), rating, date:dateLabel,
//     };

//     setSubmitting(true); setErr('');
//     try {
//       const res = await fetch(`${API}/api/comments`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
//       if (res.ok) await loadComments();
//       else { const u=[{...payload,date:dateLabel},...comments]; setComments(u); try{localStorage.setItem('psp_comments',JSON.stringify(u))}catch{} }
//     } catch { const u=[{...payload,date:dateLabel},...comments]; setComments(u); try{localStorage.setItem('psp_comments',JSON.stringify(u))}catch{} }
//     finally { setSubmitting(false); }

//     setUsername(''); setComment(''); setRating(5); setSuccess(true);
//     setTimeout(()=>setSuccess(false), 3500);
//   };

//   return (
//     <div style={{maxWidth:1200,margin:'0 auto',padding:'40px 24px'}}>
//       {/* Section header */}
//       <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
//         <h3 style={{fontSize:20,fontWeight:800,color:'var(--text-main)'}}>Customer Reviews</h3>
//         <span style={{fontSize:11,background:'var(--bg-base)',color:'var(--text-muted)',border:'1px solid var(--border)',padding:'2px 10px',borderRadius:99,fontWeight:600}}>
//           {loading ? '…' : comments.length} reviews
//         </span>
//         <button onClick={loadComments} disabled={loading} style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#3b82f6',background:'none',border:'none',cursor:'pointer',fontWeight:700,opacity:loading?.5:1}}>
//           <RefreshCw size={12} style={loading?{animation:'spinRing .8s linear infinite'}:{}} /> Refresh
//         </button>
//       </div>

//       {/* Review form */}
//       <div style={{
//         background:'linear-gradient(135deg,#0820c2 0%,#1d4ed8 70%,#0369a1 100%)',
//         borderRadius:20, padding:24, marginBottom:32,
//         boxShadow:'0 8px 32px rgba(8,32,194,.35)',
//       }}>
//         <h4 style={{fontWeight:700,color:'#fff',fontSize:14,marginBottom:16,display:'flex',alignItems:'center',gap:7}}>
//           <UserPlus size={15}/> Leave your review
//         </h4>
//         {success && (
//           <div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(16,185,129,.15)',border:'1px solid rgba(16,185,129,.4)',color:'#6ee7b7',fontSize:12,fontWeight:600,padding:'9px 14px',borderRadius:10,marginBottom:12}}>
//             <CheckCircle size={13}/> Thanks! Your review is now live.
//           </div>
//         )}
//         {err && <div style={{background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.35)',color:'#fca5a5',fontSize:11,padding:'8px 12px',borderRadius:10,marginBottom:12}}>{err}</div>}

//         <form onSubmit={handleSubmit}>
//           <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}}>
//             <div>
//               <label style={{display:'block',fontSize:10,fontWeight:700,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Your name *</label>
//               <div style={{position:'relative'}}>
//                 <span style={{position:'absolute',inset:'0 auto 0 0',display:'flex',alignItems:'center',paddingLeft:10,color:'rgba(255,255,255,.5)',pointerEvents:'none'}}><User size={13}/></span>
//                 <input type="text" placeholder="e.g. Sokha…" value={username} onChange={e=>{setUsername(e.target.value);setErr('')}} maxLength={40}
//                   style={{width:'100%',paddingLeft:32,paddingRight:12,paddingTop:9,paddingBottom:9,borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,outline:'none'}}
//                 />
//               </div>
//             </div>
//             <div>
//               <label style={{display:'block',fontSize:10,fontWeight:700,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Rating *</label>
//               <div style={{display:'flex',alignItems:'center',gap:2,height:38}}>
//                 {[1,2,3,4,5].map(star=>(
//                   <button key={star} type="button"
//                     onMouseEnter={()=>setHovered(star)} onMouseLeave={()=>setHovered(0)}
//                     onClick={()=>setRating(star)}
//                     style={{background:'none',border:'none',cursor:'pointer',fontSize:24,lineHeight:1,padding:0,transform:(hovered||rating)>=star?'scale(1.15)':'scale(1)',transition:'transform .15s'}}>
//                     <span style={{color:(hovered||rating)>=star?'#fbbf24':'rgba(255,255,255,.3)'}}>★</span>
//                   </button>
//                 ))}
//                 <span style={{fontSize:11,color:'rgba(255,255,255,.7)',marginLeft:4}}>{RATING_LABELS[hovered||rating]}</span>
//               </div>
//             </div>
//           </div>
//           <div style={{marginBottom:14}}>
//             <label style={{display:'block',fontSize:10,fontWeight:700,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Your comment *</label>
//             <textarea rows={3} placeholder="Tell others about your experience with PSP MARKET…"
//               value={comment} onChange={e=>{setComment(e.target.value);setErr('')}} maxLength={300}
//               style={{width:'100%',padding:'9px 12px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,outline:'none',resize:'none'}}
//             />
//             <p style={{fontSize:10,color:'rgba(255,255,255,.4)',textAlign:'right',marginTop:2}}>{comment.length}/300</p>
//           </div>
//           <button type="submit" disabled={submitting} style={{
//             display:'flex',alignItems:'center',gap:7,
//             background:'rgba(255,255,255,.15)',border:'1.5px solid rgba(255,255,255,.3)',
//             color:'#fff',fontSize:13,fontWeight:700,padding:'9px 20px',borderRadius:10,cursor:'pointer',
//             transition:'background .2s',
//           }}
//             onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.25)'}
//             onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.15)'}
//           >
//             {submitting ? <RefreshCw size={13} style={{animation:'spinRing .8s linear infinite'}}/> : 'Post Review ✨'}
//           </button>
//         </form>
//       </div>

//       {/* Comment cards */}
//       {loading ? (
//         <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 0',gap:10,color:'var(--text-muted)'}}>
//           <RefreshCw size={18} style={{animation:'spinRing 1s linear infinite'}}/> <span style={{fontSize:13}}>Loading reviews…</span>
//         </div>
//       ) : (
//         <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:16}}>
//           {comments.map((c,idx)=>(
//             <div key={c.id} className="card anim-fadeUp" style={{padding:18,animationDelay:`${idx*0.05}s`}}>
//               <span style={{float:'right',fontSize:9,background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe',padding:'2px 8px',borderRadius:99,fontWeight:700}}>Customer</span>
//               <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
//                 <div style={{width:34,height:34,borderRadius:'50%',background:getAvatarColor(c.username||'A'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0}}>
//                   {(c.username||'A')[0].toUpperCase()}
//                 </div>
//                 <div style={{flex:1,minWidth:0}}>
//                   <p style={{fontSize:13,fontWeight:700,color:'var(--text-main)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.username}</p>
//                   <p style={{fontSize:10,color:'var(--text-muted)'}}>{c.date}</p>
//                 </div>
//               </div>
//               <div style={{display:'flex',gap:1,marginBottom:8}}>
//                 {[1,2,3,4,5].map(s=>(
//                   <span key={s} style={{color:s<=(c.rating||0)?'#f59e0b':'var(--border)',fontSize:13}}>★</span>
//                 ))}
//               </div>
//               <p className="lc3" style={{fontSize:12,color:'var(--text-muted)',lineHeight:1.6}}>"{c.comment}"</p>
//             </div>
//           ))}
//           {comments.length===0 && (
//             <p style={{textAlign:'center',fontSize:12,color:'var(--text-muted)',gridColumn:'1/-1',paddingTop:16}}>Be the first to leave a review above!</p>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // LOGIN PAGE (full pre-auth experience)
// // ─────────────────────────────────────────────────────────────────────────────
// function LoginPage({ onLogin, products }) {
//   const { dark, toggleDark } = useDark();
//   const [promoBanner,     setPromoBanner]    = useState(true);
//   const [mobileMenuOpen,  setMobileMenuOpen] = useState(false);
//   const [activeSection,   setActiveSection]  = useState('home');
//   const [activeCategory,  setActiveCategory] = useState('');
//   const [searchQuery,     setSearchQuery]    = useState('');
//   const [selectedProduct, setSelectedProduct]= useState(null);
//   const [showAuthModal,   setShowAuthModal]  = useState(false);
//   const [authModalTab,    setAuthModalTab]   = useState('signin');
//   const [heroLogo,        setHeroLogo]       = useState(null);
//   const [scrolled,        setScrolled]       = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 40);
//     window.addEventListener('scroll', onScroll);
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   const openAuth = (tab='signin') => { setAuthModalTab(tab); setShowAuthModal(true); };
//   const switchSection = (section) => {
//     setActiveSection(section); setMobileMenuOpen(false);
//     window.scrollTo({ top:0, behavior:'smooth' });
//   };

//   const allProducts      = products || [];
//   const uniqueCategories = [...new Set(allProducts.map(p=>p.category).filter(Boolean))];
//   useEffect(() => { if (uniqueCategories.length>0 && !activeCategory) setActiveCategory(uniqueCategories[0]); }, [uniqueCategories.length]);

//   const searchResults   = searchQuery.trim().length > 1
//     ? allProducts.filter(p=>p.name.toLowerCase().includes(searchQuery.toLowerCase()))
//     : null;
//   const displayProducts = searchResults || (activeCategory ? allProducts.filter(p=>p.category===activeCategory) : allProducts);

//   const NAV_ITEMS = [
//     { key:'home',     label:'Home',     icon:<HomeIcon size={13}/> },
//     { key:'products', label:'Products', icon:<Package size={13}/> },
//     { key:'deals',    label:'Deals',    icon:<Tag size={13}/> },
//     { key:'offers',   label:'Offers',   icon:<Gift size={13}/> },
//     { key:'contact',  label:'Contact',  icon:<Phone size={13}/> },
//   ];

//   const OFFERS_DATA = [
//     { code:'WELCOME15', discount:'15% OFF',      label:'New Members',   desc:'First order discount for all new sign-ups', gradient:'linear-gradient(135deg,#0820c2,#3b82f6)', icon:'🎉', expires:'No expiry' },
//     { code:'SAVE30',    discount:'$30 OFF',       label:'Orders $150+',  desc:'Spend $150 or more and save $30 instantly',  gradient:'linear-gradient(135deg,#7c3aed,#a855f7)', icon:'💜', expires:'Ends Jun 30' },
//     { code:'FREESHIP',  discount:'Free Shipping', label:'All Orders',    desc:'Free delivery on any order this weekend',    gradient:'linear-gradient(135deg,#059669,#10b981)', icon:'🚚', expires:'Weekend only' },
//     { code:'FLASH50',   discount:'50% OFF',       label:'Flash Sale',    desc:'Selected electronics & accessories only',    gradient:'linear-gradient(135deg,#dc2626,#f97316)', icon:'⚡', expires:'Today only' },
//   ];

//   return (
//     <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',background:'var(--bg-base)'}}>

//       {showAuthModal && (
//         <AuthModal defaultTab={authModalTab} onClose={()=>setShowAuthModal(false)}
//           onLogin={(role,email,name,id,avatar)=>{ setShowAuthModal(false); onLogin(role,email,name,id,avatar); }}
//         />
//       )}
//       {selectedProduct && (
//         <SignInPrompt product={selectedProduct} onClose={()=>setSelectedProduct(null)} onLogin={onLogin}/>
//       )}

//       {/* Promo banner */}
//       {promoBanner && (
//         <div style={{
//           background:'linear-gradient(90deg,#0820c2,#1d4ed8,#0369a1)',
//           color:'#fff', padding:'8px 16px',
//           display:'flex', alignItems:'center', justifyContent:'center', gap:10,
//           fontSize:12, fontWeight:500, position:'relative',
//         }}>
//           <Sparkles size={12} color="#fbbf24"/>
//           New member deal — <strong>15% off</strong> your first order with code{' '}
//           <span style={{background:'rgba(255,255,255,.2)',padding:'2px 8px',borderRadius:6,fontFamily:'monospace',fontWeight:800,letterSpacing:'.08em'}}>WELCOME15</span>
//           <span style={{background:'#16a34a',color:'#fff',fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:99,marginLeft:4}}>Limited time</span>
//           <button onClick={()=>setPromoBanner(false)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(255,255,255,.6)',cursor:'pointer',display:'flex'}}>
//             <X size={14}/>
//           </button>
//         </div>
//       )}

//       {/* ── STICKY NAVBAR ── */}
//       <div style={{
//         background: scrolled ? (dark?'rgba(8,15,42,.95)':'rgba(8,32,194,.97)') : 'var(--nav-bg)',
//         backdropFilter: scrolled?'blur(16px)':'none',
//         borderBottom:'1px solid rgba(255,255,255,.1)',
//         boxShadow: scrolled ? '0 4px 24px rgba(3,8,40,.4)' : 'none',
//         position:'sticky', top:0, zIndex:40,
//         transition:'all .3s ease',
//       }}>
//         <div style={{maxWidth:1280,margin:'0 auto',padding:'12px 20px',display:'flex',alignItems:'center',gap:12}}>
//           {/* Logo */}
//           <div onClick={()=>switchSection('home')} style={{display:'flex',alignItems:'center',gap:9,cursor:'pointer',flexShrink:0}}>
//             <img src={LOGO} alt="PSP MART" style={{width:36,height:36,borderRadius:10,objectFit:'cover',boxShadow:'0 2px 8px rgba(0,0,0,.3)'}}/>
//             <span style={{fontSize:14,fontWeight:800,color:'#fff',letterSpacing:'.02em',display:'none'}} className="md-show">PSP MARKET</span>
//           </div>

//           {/* Desktop nav */}
//           <nav style={{display:'flex',alignItems:'center',gap:2,marginLeft:8,flex:1}}>
//             {NAV_ITEMS.map(nav=>(
//               <button key={nav.key} onClick={()=>switchSection(nav.key)} style={{
//                 display:'flex',alignItems:'center',gap:5,padding:'7px 13px',borderRadius:9,border:'none',
//                 cursor:'pointer', fontSize:12, fontWeight:activeSection===nav.key?700:500,
//                 background: activeSection===nav.key ? 'rgba(255,255,255,.15)' : 'transparent',
//                 color: activeSection===nav.key ? '#fff' : 'rgba(255,255,255,.7)',
//                 transition:'all .2s', position:'relative',
//               }}
//                 onMouseEnter={e=>{if(activeSection!==nav.key){e.currentTarget.style.background='rgba(255,255,255,.08)';e.currentTarget.style.color='#fff'}}}
//                 onMouseLeave={e=>{if(activeSection!==nav.key){e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,.7)'}}}
//               >
//                 {nav.icon} {nav.label}
//                 {activeSection===nav.key && (
//                   <span style={{position:'absolute',bottom:2,left:'50%',transform:'translateX(-50%)',width:'40%',height:2,background:'#60a5fa',borderRadius:99}}/>
//                 )}
//               </button>
//             ))}
//           </nav>

//           {/* Search */}
//           <div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:10,padding:'7px 12px',flex:1,maxWidth:240}}>
//             <Search size={12} color="rgba(255,255,255,.6)" style={{flexShrink:0}}/>
//             <input type="text" placeholder="Search products…" value={searchQuery}
//               onChange={e=>{setSearchQuery(e.target.value); if(e.target.value.length>1) switchSection('products')}}
//               style={{background:'transparent',border:'none',color:'#fff',fontSize:12,outline:'none',flex:1,minWidth:0}}
//             />
//             {searchQuery && <button onClick={()=>setSearchQuery('')} style={{background:'none',border:'none',color:'rgba(255,255,255,.5)',cursor:'pointer',display:'flex'}}><X size={11}/></button>}
//           </div>

//           {/* Dark toggle + Auth buttons */}
//           <DarkToggle/>
//           <div style={{display:'flex',gap:7,flexShrink:0}}>
//             <button onClick={()=>openAuth('signin')} style={{
//               padding:'7px 14px',borderRadius:9,border:'1.5px solid rgba(255,255,255,.3)',
//               background:'rgba(255,255,255,.1)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',
//               display:'flex',alignItems:'center',gap:5,transition:'all .2s',
//             }}
//               onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.2)'}}
//               onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,.1)'}}
//             >
//               <User size={12}/> Sign In
//             </button>
//             <button onClick={()=>openAuth('register')} style={{
//               padding:'7px 14px',borderRadius:9,border:'none',
//               background:'linear-gradient(135deg,rgba(255,255,255,.9),rgba(224,231,255,.9))',
//               color:'#0820c2',fontSize:12,fontWeight:800,cursor:'pointer',
//               display:'flex',alignItems:'center',gap:5,transition:'all .2s',
//               boxShadow:'0 2px 8px rgba(0,0,0,.2)',
//             }}
//               onMouseEnter={e=>e.currentTarget.style.filter='brightness(1.05)'}
//               onMouseLeave={e=>e.currentTarget.style.filter='brightness(1)'}
//             >
//               <UserPlus size={12}/> Register
//             </button>
//           </div>

//           {/* Mobile menu toggle */}
//           <button onClick={()=>setMobileMenuOpen(o=>!o)} style={{
//             display:'flex',alignItems:'center',justifyContent:'center',
//             width:36,height:36,borderRadius:9,
//             background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',
//             color:'#fff',cursor:'pointer',flexShrink:0,
//           }}>
//             {mobileMenuOpen?<X size={18}/>:<Menu size={18}/>}
//           </button>
//         </div>

//         {/* Bottom gradient line */}
//         <div style={{height:2,background:'linear-gradient(90deg,transparent,rgba(96,165,250,.7),transparent)'}}/>

//         {/* Mobile dropdown */}
//         {mobileMenuOpen && (
//           <div className="anim-slideDown" style={{
//             background: dark?'#080f2a':'#0820c2',
//             borderTop:'1px solid rgba(255,255,255,.1)',
//             padding:'8px 12px 12px',
//           }}>
//             <div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:9,padding:'7px 12px',marginBottom:8}}>
//               <Search size={12} color="rgba(255,255,255,.5)" style={{flexShrink:0}}/>
//               <input type="text" placeholder="Search products…" value={searchQuery}
//                 onChange={e=>{setSearchQuery(e.target.value);if(e.target.value.length>1)switchSection('products')}}
//                 style={{background:'transparent',border:'none',color:'#fff',fontSize:12,outline:'none',flex:1}}
//               />
//             </div>
//             {NAV_ITEMS.map(nav=>(
//               <button key={nav.key} onClick={()=>switchSection(nav.key)} style={{
//                 display:'flex',alignItems:'center',gap:10,width:'100%',
//                 padding:'11px 12px',borderRadius:9,border:'none',cursor:'pointer',
//                 background: activeSection===nav.key?'rgba(255,255,255,.12)':'transparent',
//                 color: activeSection===nav.key?'#fff':'rgba(255,255,255,.7)',
//                 fontSize:13,fontWeight:activeSection===nav.key?700:500,textAlign:'left',
//                 transition:'background .15s',
//               }}>
//                 <span style={{color:activeSection===nav.key?'#60a5fa':'rgba(255,255,255,.5)'}}>{nav.icon}</span>
//                 {nav.label}
//                 {activeSection===nav.key && <span style={{marginLeft:'auto',width:6,height:6,borderRadius:'50%',background:'#60a5fa'}}/>}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ── MAIN CONTENT ── */}
//       <main style={{flex:1}}>

//         {/* ══ HOME ══ */}
//         {activeSection === 'home' && (
//           <div className="anim-fadeIn">
//             {/* Hero */}
//             <div style={{position:'relative',overflow:'hidden',minHeight:520}}>
//               <div style={{
//                 position:'absolute',inset:0,
//                 backgroundImage:`url(${Angkor})`,backgroundSize:'cover',backgroundPosition:'center',
//               }}/>
//               <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(3,8,40,.88) 0%,rgba(8,32,194,.65) 50%,rgba(3,105,161,.6) 100%)'}}/>

//               {/* Animated particles */}
//               {[...Array(12)].map((_,i)=>(
//                 <div key={i} className="particle" style={{
//                   width:Math.random()*3+2, height:Math.random()*3+2,
//                   background:i%2===0?'rgba(96,165,250,.7)':'rgba(255,255,255,.4)',
//                   left:`${Math.random()*100}%`, bottom:`${Math.random()*50}%`,
//                   '--dur':`${3+Math.random()*4}s`, '--delay':`${Math.random()*5}s`,
//                 }}/>
//               ))}

//               <div style={{position:'relative',zIndex:2,maxWidth:1280,margin:'0 auto',padding:'60px 24px 50px',display:'flex',flexDirection:'row',alignItems:'center',gap:40,flexWrap:'wrap'}}>
//                 <div style={{flex:1,minWidth:300}}>
//                   {/* Badges */}
//                   <div style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:20}}>
//                     {[
//                       {icon:<Shield size={11}/>,label:'Secure checkout',color:'#93c5fd'},
//                       {icon:<Star size={11}/>,label:'4.8★ rated',color:'#fbbf24'},
//                       {icon:<Truck size={11}/>,label:'Free shipping $30+',color:'#6ee7b7'},
//                     ].map((b,i)=>(
//                       <span key={i} style={{
//                         display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:600,
//                         color:b.color, padding:'5px 11px',borderRadius:99,
//                         background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',
//                         backdropFilter:'blur(8px)',
//                       }}>
//                         {b.icon} {b.label}
//                       </span>
//                     ))}
//                   </div>

//                   {/* Headline */}
//                   <h1 style={{fontSize:'clamp(28px,5vw,52px)',fontWeight:900,lineHeight:1.1,color:'#fff',marginBottom:10}}>
//                     WELCOME TO<br/>
//                     <span className="anim-neon" style={{color:'#60a5fa'}}>PSP MARKET</span>
//                   </h1>
//                   <p style={{fontSize:16,color:'rgba(255,255,255,.7)',fontWeight:400,marginBottom:28,maxWidth:420}}>
//                     Your smart market in Cambodia — quality products, trusted sellers.
//                   </p>

//                   {/* Stats */}
//                   <div style={{display:'flex',gap:12,marginBottom:28,flexWrap:'wrap'}}>
//                     {[['50K+','Happy customers'],['10K+','Products'],['4.8★','Avg. rating']].map(([v,l],i)=>(
//                       <div key={i} style={{
//                         background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',
//                         borderRadius:12,padding:'10px 16px',textAlign:'center',backdropFilter:'blur(8px)',
//                         minWidth:80,
//                       }}>
//                         <div style={{fontSize:18,fontWeight:900,color:'#60a5fa'}}>{v}</div>
//                         <div style={{fontSize:10,color:'rgba(255,255,255,.6)',marginTop:2}}>{l}</div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* CTA buttons */}
//                   <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
//                     <button onClick={()=>openAuth('signin')} style={{
//                       display:'flex',alignItems:'center',gap:7,
//                       background:'linear-gradient(135deg,rgba(255,255,255,.95),rgba(224,231,255,.95))',
//                       color:'#0820c2',fontWeight:800,fontSize:13,padding:'11px 22px',
//                       borderRadius:11,border:'none',cursor:'pointer',
//                       boxShadow:'0 6px 20px rgba(0,0,0,.25)',transition:'all .2s',
//                     }}
//                       onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(0,0,0,.3)'}}
//                       onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 20px rgba(0,0,0,.25)'}}
//                     >
//                       <User size={14}/> Sign In <ArrowRight size={13}/>
//                     </button>
//                     <button onClick={()=>openAuth('register')} style={{
//                       display:'flex',alignItems:'center',gap:7,
//                       background:'linear-gradient(135deg,#0820c2,#1d4ed8)',
//                       color:'#fff',fontWeight:800,fontSize:13,padding:'11px 22px',
//                       borderRadius:11,border:'1.5px solid rgba(255,255,255,.2)',cursor:'pointer',
//                       boxShadow:'0 6px 20px rgba(8,32,194,.4)',transition:'all .2s',
//                     }}
//                       onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.filter='brightness(1.1)'}}
//                       onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.filter='brightness(1)'}}
//                     >
//                       <UserPlus size={14}/> Register <ArrowRight size={13}/>
//                     </button>
//                   </div>
//                   <p style={{fontSize:10,color:'rgba(255,255,255,.45)',marginTop:8}}>Register for free — get 15% off your first order</p>
//                 </div>

//                 {/* Hero logo */}
//                 <div className="anim-float" style={{flexShrink:0}}>
//                   <div className="anim-glow" style={{
//                     width:200,height:200,borderRadius:'50%',overflow:'hidden',
//                     border:'3px solid rgba(96,165,250,.4)',
//                     boxShadow:'0 0 0 12px rgba(96,165,250,.07)',
//                   }}>
//                     <img src={heroLogo||LOGO} alt="PSP MART" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* ── Feature highlights ── */}
//             <div style={{background:'var(--bg-card)',borderBottom:'1px solid var(--border)',padding:'20px 24px'}}>
//               <div style={{maxWidth:1280,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:16}}>
//                 {[
//                   {icon:<Truck size={18} color="#1d4ed8"/>,title:'Free Shipping',desc:'On orders over $30'},
//                   {icon:<Shield size={18} color="#059669"/>,title:'Secure Payment',desc:'256-bit SSL encryption'},
//                   {icon:<RefreshCw size={18} color="#7c3aed"/>,title:'Easy Returns',desc:'30-day return policy'},
//                   {icon:<Headphones size={18} color="#f97316"/>,title:'24/7 Support',desc:'Always here for you'},
//                 ].map((f,i)=>(
//                   <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderRadius:12,background:'var(--bg-base)',border:'1px solid var(--border)'}}>
//                     <div style={{width:40,height:40,borderRadius:10,background:'var(--bg-card)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
//                       {f.icon}
//                     </div>
//                     <div>
//                       <p style={{fontSize:12,fontWeight:700,color:'var(--text-main)'}}>{f.title}</p>
//                       <p style={{fontSize:10,color:'var(--text-muted)'}}>{f.desc}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <UserCommentSection/>
//             <Foot/>
//           </div>
//         )}

//         {/* ══ PRODUCTS ══ */}
//         {activeSection === 'products' && (
//           <div className="anim-fadeIn" style={{maxWidth:1280,margin:'0 auto',padding:'32px 24px'}}>
//             <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:24}}>
//               <div>
//                 <h2 style={{fontSize:22,fontWeight:800,color:'var(--text-main)',display:'flex',alignItems:'center',gap:8}}>
//                   <Package size={20} color="#1d4ed8"/> Products
//                 </h2>
//                 <p style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>Browse our catalogue — click any item to sign in & buy</p>
//               </div>
//             </div>

//             {!searchResults && uniqueCategories.length>0 && (
//               <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:24}}>
//                 {uniqueCategories.map(cat=>{
//                   const s=CATEGORY_STYLES[cat]||DEFAULT_STYLE;
//                   const active=activeCategory===cat;
//                   return (
//                     <button key={cat} onClick={()=>setActiveCategory(cat)} style={{
//                       display:'flex',alignItems:'center',gap:6,padding:'7px 14px',
//                       borderRadius:99,border:`1.5px solid ${active?'#3b82f6':'var(--border)'}`,
//                       background:active?'linear-gradient(135deg,#0820c2,#1d4ed8)':'var(--bg-card)',
//                       color:active?'#fff':'var(--text-muted)',fontSize:12,fontWeight:700,cursor:'pointer',
//                       boxShadow:active?'0 4px 14px rgba(29,78,216,.3)':'none',
//                       transition:'all .2s',
//                     }}>
//                       <span>{s.emoji}</span> {cat}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}

//             {searchResults && (
//               <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:16}}>
//                 <span style={{fontSize:13,color:'var(--text-main)'}}>Results for <strong>"{searchQuery}"</strong> — {searchResults.length} items</span>
//                 <button onClick={()=>setSearchQuery('')} style={{fontSize:11,color:'#3b82f6',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
//                   <X size={11}/> Clear
//                 </button>
//               </div>
//             )}

//             {displayProducts.length > 0 ? (
//               <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:16}}>
//                 {displayProducts.map((product,i)=>(
//                   <div key={product.id} className="anim-fadeUp" style={{animationDelay:`${i*0.04}s`}}>
//                     <PreLoginProductCard product={product} onProductClick={setSelectedProduct}/>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-muted)'}}>
//                 <Package size={36} style={{margin:'0 auto 12px',opacity:.3}}/>
//                 <p style={{fontSize:13,fontWeight:500}}>{searchResults?`No products match "${searchQuery}"`:'No products in this category yet.'}</p>
//               </div>
//             )}

//             {/* CTA banner */}
//             <div style={{marginTop:32,background:'linear-gradient(135deg,#0820c2,#1d4ed8,#0369a1)',borderRadius:20,padding:'24px 28px',display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:16,boxShadow:'0 8px 28px rgba(8,32,194,.3)'}}>
//               <div>
//                 <p style={{fontWeight:800,fontSize:15,color:'#fff'}}>Want to see more products?</p>
//                 <p style={{color:'rgba(255,255,255,.7)',fontSize:12,marginTop:3}}>Sign in or create a free account to access our full catalogue.</p>
//               </div>
//               <button onClick={()=>openAuth('signin')} style={{
//                 padding:'10px 22px',borderRadius:11,border:'none',cursor:'pointer',
//                 background:'rgba(255,255,255,.9)',color:'#0820c2',fontWeight:800,fontSize:12,
//                 display:'flex',alignItems:'center',gap:6,flexShrink:0,
//               }}>
//                 Sign in now <ArrowRight size={13}/>
//               </button>
//             </div>
//             <Foot/>
//           </div>
//         )}

//         {/* ══ DEALS ══ */}
//         {activeSection === 'deals' && (
//           <div className="anim-fadeIn" style={{maxWidth:1280,margin:'0 auto',padding:'32px 24px'}}>
//             <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,marginBottom:24,flexWrap:'wrap'}}>
//               <div>
//                 <h2 style={{fontSize:22,fontWeight:800,color:'var(--text-main)',display:'flex',alignItems:'center',gap:8}}>
//                   <Tag size={20} color="#f97316"/> Today's Deals
//                 </h2>
//                 <p style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>Featured products — sign in to buy</p>
//               </div>
//               <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#ef4444',fontWeight:700,background:'#fef2f2',border:'1px solid #fecaca',padding:'6px 12px',borderRadius:99}}>
//                 <Clock size={12}/> Limited stock
//               </div>
//             </div>
//             {allProducts.length > 0 ? (
//               <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:18}}>
//                 {allProducts.slice(0,6).map((product,i)=>{
//                   const grads=['linear-gradient(135deg,#f97316,#dc2626)','linear-gradient(135deg,#ec4899,#8b5cf6)','linear-gradient(135deg,#3b82f6,#06b6d4)','linear-gradient(135deg,#10b981,#0369a1)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#8b5cf6,#0820c2)'];
//                   const s=CATEGORY_STYLES[product.category]||DEFAULT_STYLE;
//                   return (
//                     <div key={product.id} className="card lift anim-fadeUp" style={{overflow:'hidden',cursor:'pointer',animationDelay:`${i*0.07}s`}} onClick={()=>setSelectedProduct(product)}>
//                       <div style={{background:grads[i%6],padding:'22px 20px 18px',color:'#fff',position:'relative'}}>
//                         <div style={{width:52,height:52,borderRadius:12,background:'rgba(255,255,255,.2)',overflow:'hidden',marginBottom:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
//                           {product.image?<img src={product.image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}}/>:<span style={{fontSize:28}}>{s.emoji}</span>}
//                         </div>
//                         <p style={{fontWeight:800,fontSize:15,lineHeight:1.3,marginBottom:5}}>{product.name}</p>
//                         <p className="lc2" style={{fontSize:11,color:'rgba(255,255,255,.75)',marginBottom:12}}>{product.description||product.category}</p>
//                         <div style={{display:'flex',alignItems:'center',gap:8}}>
//                           <span style={{fontSize:22,fontWeight:900}}>${Number(product.price||0).toFixed(2)}</span>
//                           <span style={{marginLeft:'auto',background:'rgba(255,255,255,.2)',border:'1px solid rgba(255,255,255,.3)',fontSize:10,fontWeight:700,padding:'3px 9px',borderRadius:99}}>{product.category}</span>
//                         </div>
//                         <div style={{position:'absolute',bottom:10,right:10,fontSize:10,color:'rgba(255,255,255,.7)',background:'rgba(0,0,0,.2)',padding:'2px 8px',borderRadius:99}}>
//                           Sign in to buy →
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div style={{textAlign:'center',padding:'60px 0',color:'var(--text-muted)'}}>
//                 <Package size={32} style={{margin:'0 auto 12px',opacity:.3}}/><p style={{fontSize:13}}>No deals yet.</p>
//               </div>
//             )}
//             <Foot/>
//           </div>
//         )}

//         {/* ══ OFFERS ══ */}
//         {activeSection === 'offers' && (
//           <div className="anim-fadeIn" style={{maxWidth:1280,margin:'0 auto',padding:'32px 24px'}}>
//             <div style={{textAlign:'center',marginBottom:36}}>
//               <h2 style={{fontSize:22,fontWeight:800,color:'var(--text-main)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
//                 <Gift size={20} color="#ec4899"/> Special Offers
//               </h2>
//               <p style={{fontSize:12,color:'var(--text-muted)',marginTop:6}}>Exclusive deals for PSP MARKET shoppers — sign in to redeem</p>
//             </div>
//             <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:18,marginBottom:40}}>
//               {OFFERS_DATA.map((offer,i)=>(
//                 <div key={i} className="card anim-fadeUp" style={{overflow:'hidden',cursor:'pointer',transition:'transform .25s,box-shadow .25s',animationDelay:`${i*.08}s`}}
//                   onClick={()=>openAuth('signin')}
//                   onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-6px)';e.currentTarget.style.boxShadow='0 18px 45px rgba(0,0,0,.18)'}}
//                   onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=''}}
//                 >
//                   <div style={{background:offer.gradient,padding:'22px 20px',color:'#fff'}}>
//                     <div style={{fontSize:32,marginBottom:6}}>{offer.icon}</div>
//                     <div style={{fontSize:28,fontWeight:900,letterSpacing:'-.02em'}}>{offer.discount}</div>
//                     <div style={{fontSize:11,fontWeight:700,opacity:.8,marginTop:2}}>{offer.label}</div>
//                     <p style={{fontSize:11,opacity:.65,marginTop:8,lineHeight:1.5}}>{offer.desc}</p>
//                   </div>
//                   <div style={{padding:'12px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg-card)'}}>
//                     <div>
//                       <p style={{fontSize:9,color:'var(--text-muted)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em'}}>Promo code</p>
//                       <p style={{fontFamily:'monospace',fontWeight:900,color:'#1d4ed8',fontSize:14,letterSpacing:'.08em',marginTop:2}}>{offer.code}</p>
//                     </div>
//                     <div style={{textAlign:'right'}}>
//                       <p style={{fontSize:10,color:'#ef4444',fontWeight:700}}>{offer.expires}</p>
//                       <button onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(offer.code).catch(()=>{})}} style={{
//                         marginTop:4,fontSize:10,background:'#eff6ff',border:'1px solid #bfdbfe',
//                         color:'#1d4ed8',fontWeight:700,padding:'4px 10px',borderRadius:7,cursor:'pointer',
//                       }}>
//                         Copy
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <Foot/>
//           </div>
//         )}

//         {/* ══ CONTACT ══ */}
//         {activeSection === 'contact' && (
//           <div className="anim-fadeIn" style={{maxWidth:1280,margin:'0 auto',padding:'32px 24px'}}>
//             <div style={{textAlign:'center',marginBottom:32}}>
//               <h2 style={{fontSize:22,fontWeight:800,color:'var(--text-main)',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>
//                 <Phone size={20} color="#1d4ed8"/> Contact Us
//               </h2>
//               <p style={{fontSize:12,color:'var(--text-muted)',marginTop:6}}>We're here to help — reach out anytime</p>
//             </div>

//             {/* Contact cards */}
//             <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:14,marginBottom:32}}>
//               {[
//                 {icon:'📞',title:'Phone',value:'+855 93 683 574',desc:'Mon–Sat, 8am–6pm',href:'tel:+85593683574',color:'#059669'},
//                 {icon:'📧',title:'Email',value:'sopheakp175@gmail.com',desc:'Reply within 24 hours',href:'mailto:sopheakp175@gmail.com',color:'#dc2626'},
//                 {icon:'📍',title:'Address',value:'Phnom Penh, Cambodia',desc:'Street 271, Toul Kork',href:'https://maps.app.goo.gl/5h1a7zihk76gWojYA',color:'#1d4ed8'},
//                 {icon:'✈️',title:'Telegram',value:'@pheaklove12',desc:'Chat instantly',href:'https://t.me/pheaklove12',color:'#0284c7'},
//                 {icon:'👤',title:'Facebook',value:'Phy Sopheak',desc:'Message us',href:'https://web.facebook.com/',color:'#1877F2'},
//               ].map((c,i)=>(
//                 <a key={i} href={c.href} target={c.href.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer"
//                   className="card lift anim-fadeUp"
//                   style={{display:'block',padding:'20px 16px',textAlign:'center',textDecoration:'none',animationDelay:`${i*.07}s`}}
//                 >
//                   <div style={{fontSize:28,marginBottom:8}}>{c.icon}</div>
//                   <p style={{fontWeight:700,fontSize:13,color:'var(--text-main)',marginBottom:3}}>{c.title}</p>
//                   <p style={{fontSize:11,color:c.color,fontWeight:600,wordBreak:'break-all',marginBottom:2}}>{c.value}</p>
//                   <p style={{fontSize:10,color:'var(--text-muted)'}}>{c.desc}</p>
//                 </a>
//               ))}
//             </div>

//             {/* Contact form */}
//             <div style={{maxWidth:480,margin:'0 auto',background:'linear-gradient(135deg,#0820c2 0%,#1d4ed8 70%,#0369a1 100%)',borderRadius:20,padding:28,boxShadow:'0 12px 40px rgba(8,32,194,.35)'}}>
//               <h3 style={{fontWeight:800,color:'#fff',fontSize:15,marginBottom:18,textAlign:'center'}}>Send us a message</h3>
//               <form onSubmit={async(event)=>{
//                 event.preventDefault();
//                 const btn=event.target.querySelector('button[type="submit"]');
//                 const orig=btn.innerHTML; btn.innerText='Sending…'; btn.disabled=true;
//                 const fd=new FormData(event.target);
//                 fd.append('access_key','b6e4d480-6acd-4232-b023-3df1c7b31e3f');
//                 try {
//                   const r=await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});
//                   const d=await r.json();
//                   if(d.success){alert('Message sent! We will get back to you soon.');event.target.reset();}
//                   else alert('Oops! Something went wrong.');
//                 } catch{alert('Network error.');}
//                 finally{btn.innerHTML=orig;btn.disabled=false;}
//               }} style={{display:'flex',flexDirection:'column',gap:11}}>
//                 {['text:Your name:name','email:your@email.com:email'].map(f=>{
//                   const [type,placeholder,name]=f.split(':');
//                   return (
//                     <input key={name} type={type} name={name} required placeholder={placeholder} style={{
//                       padding:'10px 14px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',
//                       background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,outline:'none',
//                     }}/>
//                   );
//                 })}
//                 <textarea rows={3} name="message" required placeholder="How can we help you?" style={{
//                   padding:'10px 14px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',
//                   background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,outline:'none',resize:'none',
//                 }}/>
//                 <button type="submit" style={{
//                   padding:'11px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.25)',
//                   background:'rgba(255,255,255,.12)',color:'#fff',fontSize:13,fontWeight:700,
//                   cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7,
//                   transition:'background .2s',
//                 }}
//                   onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,.22)'}
//                   onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,.12)'}
//                 >
//                   <Mail size={14}/> Send Message
//                 </button>
//               </form>
//             </div>
//             <Foot/>
//           </div>
//         )}

//       </main>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // INNER APP (post-login)
// // ─────────────────────────────────────────────────────────────────────────────
// function AppInner() {
//   const { products } = useContext(ShopContext);
//   const { dark } = useDark();

//   const [isLoggedIn,        setIsLoggedIn]        = useState(false);
//   const [userRole,          setUserRole]           = useState(null);
//   const [email,             setEmail]              = useState('');
//   const [userId,            setUserId]             = useState(null);
//   const [userAvatar,        setUserAvatar]         = useState(null);
//   const [isLoading,         setIsLoading]          = useState(false);
//   const [pendingRole,       setPendingRole]        = useState(null);
//   const [pendingEmail,      setPendingEmail]       = useState('');
//   const [pendingName,       setPendingName]        = useState('');
//   const [pendingId,         setPendingId]          = useState(null);
//   const [pendingAvatar,     setPendingAvatar]      = useState(null);
//   const [pendingView,       setPendingView]        = useState('shop-home');
//   const [view,              setView]               = useState('shop-home');
//   const [selectedProductId, setSelectedProductId] = useState(null);
//   const [loginKey,          setLoginKey]           = useState(0);
//   const isAdminView = view.startsWith('admin-');

//   useEffect(() => {
//     if (!isLoading) return;
//     const timer = setTimeout(() => {
//       setIsLoading(false); setIsLoggedIn(true);
//       setUserRole(pendingRole); setEmail(pendingEmail);
//       setUserId(pendingId); setUserAvatar(pendingAvatar);
//       setView(pendingView);
//     }, 2200);
//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   const handleLogin = (role, userEmail, userName, id, avatar) => {
//     setPendingRole(role); setPendingEmail(userEmail); setPendingName(userName);
//     setPendingId(id); setPendingAvatar(avatar||null);
//     setPendingView(role==='admin'?'admin-home':'shop-home');
//     setLoginKey(k=>k+1); setIsLoading(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false); setUserRole(null); setEmail('');
//     setUserId(null); setUserAvatar(null); setView('shop-home');
//   };

//   if (isLoading)   return <LoadingScreen role={pendingRole}/>;
//   if (!isLoggedIn) return <LoginPage onLogin={handleLogin} products={products}/>;

//   return (
//     <div style={{minHeight:'100vh',background:'var(--bg-base)',color:'var(--text-main)',display:'flex',flexDirection:'column'}}>
//       {!isAdminView && (
//         <div style={{position:'relative'}}>
//           <Navbar
//             setView={setView}
//             userRole={userRole}
//             handleLogout={handleLogout}
//             userEmail={email}
//             userId={userId}
//             userAvatarFromDB={userAvatar}
//             loginKey={loginKey}
//           />
//           <div style={{position:'absolute',top:16,right:176,display:'flex',alignItems:'center',gap:6,border:'1px solid var(--border)',padding:'4px 10px',borderRadius:8,fontSize:11,color:'var(--text-muted)'}}>
//             <span style={{width:7,height:7,borderRadius:'50%',background:'#22c55e',boxShadow:'0 0 6px #22c55e',animation:'pulseCenter 1.5s ease-in-out infinite',display:'inline-block'}}/>
//           </div>
//         </div>
//       )}
//       <div style={{display:'flex',flex:1}}>
//         {isAdminView && (
//           <div style={{display:'flex',flexDirection:'column',background:'var(--bg-card)',minHeight:'100vh',color:'var(--text-main)'}}>
//             <div style={{
//               padding:'10px 16px',borderBottom:'1px solid var(--border)',
//               position:'fixed',top:0,left:0,right:0,zIndex:50,
//               display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,
//               background: dark?'rgba(8,15,42,.96)':'rgba(8,32,194,.97)',
//               backdropFilter:'blur(12px)',
//               boxShadow:'0 2px 12px rgba(0,0,0,.3)',
//             }}>
//               <div style={{display:'flex',alignItems:'center',gap:8}}>
//                 <Shield size={15} color="#22c55e"/>
//                 <span style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.8)',maxWidth:140,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{email}</span>
//               </div>
//               <div style={{display:'flex',gap:8,alignItems:'center'}}>
//                 <DarkToggle/>
//                 <button onClick={handleLogout} style={{
//                   padding:'5px 10px',background:'#7f1d1d',border:'1px solid #dc2626',borderRadius:8,
//                   color:'#fca5a5',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,
//                 }} title="Logout">
//                   <LogOut size={13}/> Logout
//                 </button>
//               </div>
//             </div>
//             <Sidebar setView={setView} currentView={view}/>
//           </div>
//         )}
//         <main style={{flex:1,padding:24,maxWidth:1280,margin:'0 auto',width:'100%'}}>
//           {view==='shop-home'      && <Home setView={setView} setSelectedProductId={setSelectedProductId}/>}
//           {view==='shop-detail'    && <ProductDetail productId={selectedProductId} setView={setView}/>}
//           {view==='shop-cart'      && <Cart userEmail={email} userRole={userRole}/>}
//           {view==='admin-home'     && <DashboardHome/>}
//           {view==='admin-products' && <ManageProducts/>}
//           {view==='admin-orders'   && <Orders/>}
//           {view==='admin-graphic'  && <Graphic/>}
//           {view==='admin-users'    && <Users/>}
//           {view==='admin-checkout' && <Checkin/>}
//           {view==='admin-evaluate' && <Evaloute/>}
//           {view==='admin-telegram' && <TelegramDashboard userRole={userRole} userEmail={email}/>}
//         </main>
//       </div>
//       <Foot/>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────────
// // ROOT APP with DarkMode provider
// // ─────────────────────────────────────────────────────────────────────────────
// function DarkModeProvider({ children }) {
//   const [dark, setDark] = useState(() => {
//     try { return localStorage.getItem('psp_dark')==='1'; } catch { return false; }
//   });

//   useEffect(() => {
//     document.body.classList.toggle('dark-mode', dark);
//     try { localStorage.setItem('psp_dark', dark?'1':'0'); } catch {}
//   }, [dark]);

//   const toggleDark = () => setDark(d => !d);
//   return (
//     <DarkModeContext.Provider value={{ dark, toggleDark }}>
//       {children}
//     </DarkModeContext.Provider>
//   );
// }

// export default function App() {
//   return (
//     <DarkModeProvider>
//       <StyleTag/>
//       <ShopProvider>
//         <AppInner/>
//       </ShopProvider>
//     </DarkModeProvider>
//   );
// }




























import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
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
  Moon, Sun, Sparkles,
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
// DARK MODE CONTEXT
// ─────────────────────────────────────────────────────────────────────────────
const DarkModeContext = createContext({ dark: false, toggleDark: () => {} });
function useDark() { return useContext(DarkModeContext); }

// ─────────────────────────────────────────────────────────────────────────────
// API BASE URL
// ─────────────────────────────────────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─────────────────────────────────────────────────────────────────────────────
// Disposable email blocklist
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
  return !BLOCKED_DOMAINS.has(domain);
}
function simpleHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 0x01000193) >>> 0; }
  return h.toString(16);
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(() => typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, w };
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES — full responsive media queries
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  /* ── Reset & box model ── */
  *, *::before, *::after {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
    transition: background-color .25s ease, border-color .25s ease, color .15s ease;
  }
  html { scroll-behavior: smooth; }
  body { margin:0; padding:0; font-family:'Segoe UI',system-ui,-apple-system,sans-serif; }
  img  { max-width:100%; display:block; }
  button { font-family: inherit; }
  input, textarea { font-family: inherit; }

  /* ── CSS Variables ── */
  :root {
    --blue-deep:  #0820c2;
    --blue-mid:   #1d4ed8;
    --blue-vivid: #3b82f6;
    --blue-light: #bfdbfe;
    --red-admin:  #991b1b;
    --red-vivid:  #ef4444;
    --bg-base:    #f0f4ff;
    --bg-card:    #ffffff;
    --bg-glass:   rgba(255,255,255,0.75);
    --text-main:  #0f172a;
    --text-muted: #64748b;
    --border:     #e2e8f0;
    --nav-bg:     linear-gradient(135deg,#0820c2 0%,#1d4ed8 60%,#0369a1 100%);
    --radius-sm:  8px;
    --radius-md:  12px;
    --radius-lg:  18px;
    --radius-xl:  24px;
    --shadow-sm:  0 2px 8px rgba(0,0,0,.06);
    --shadow-md:  0 6px 24px rgba(29,78,216,.14);
    --shadow-lg:  0 16px 48px rgba(29,78,216,.22);
    --sp-xs: 8px;
    --sp-sm: 12px;
    --sp-md: 16px;
    --sp-lg: 24px;
    --sp-xl: 32px;
    --sp-2xl: 48px;
  }
  .dark-mode {
    --bg-base:    #080f2a;
    --bg-card:    #101831;
    --bg-glass:   rgba(16,24,49,0.88);
    --text-main:  #e2e8f0;
    --text-muted: #94a3b8;
    --border:     #1e2d52;
    --nav-bg:     linear-gradient(135deg,#050d1f 0%,#0d1f4a 60%,#0c2353 100%);
    --shadow-sm:  0 2px 8px rgba(0,0,0,.25);
    --shadow-md:  0 6px 24px rgba(0,0,0,.35);
    --shadow-lg:  0 16px 48px rgba(0,0,0,.5);
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width:5px; height:5px; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:#3b82f660; border-radius:99px; }
  ::-webkit-scrollbar-thumb:hover { background:#1d4ed8; }

  /* ── Keyframes ── */
  @keyframes fadeUp      { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
  @keyframes slideDown   { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes modalPop    { from{opacity:0;transform:scale(.93) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes spinRing    { to{transform:rotate(360deg)} }
  @keyframes counterSpin { to{transform:rotate(-360deg)} }
  @keyframes pulseCenter { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.12);opacity:.8} }
  @keyframes shimmer     { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes glow        { 0%,100%{box-shadow:0 0 18px #3b82f640} 50%{box-shadow:0 0 36px #3b82f6a0} }
  @keyframes particleDrift { 0%{transform:translateY(0) translateX(0);opacity:0} 20%{opacity:.6} 100%{transform:translateY(-90px) translateX(30px);opacity:0} }
  @keyframes scanLine    { 0%{top:-2%} 100%{top:102%} }
  @keyframes neonPulse   { 0%,100%{text-shadow:0 0 8px #3b82f680} 50%{text-shadow:0 0 22px #3b82f6,0 0 40px #1d4ed880} }
  @keyframes pulseGreen  { 0%,100%{box-shadow:0 0 4px #22c55e60} 50%{box-shadow:0 0 10px #22c55e} }

  /* ── Utility classes ── */
  .anim-fadeUp    { animation: fadeUp    .45s cubic-bezier(.22,1,.36,1) both; }
  .anim-fadeIn    { animation: fadeIn    .35s ease both; }
  .anim-slideDown { animation: slideDown .3s ease both; }
  .anim-modalPop  { animation: modalPop  .32s cubic-bezier(.34,1.56,.64,1) both; }
  .anim-float     { animation: float     3s ease-in-out infinite; }
  .anim-glow      { animation: glow      2.5s ease-in-out infinite; }
  .anim-neon      { animation: neonPulse 2s ease-in-out infinite; }
  .anim-spin      { animation: spinRing  .8s linear infinite; }

  .particle {
    position:absolute; border-radius:50%; pointer-events:none;
    animation: particleDrift var(--dur,4s) var(--delay,0s) ease-out infinite;
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }
  .card-hover {
    transition: transform .22s cubic-bezier(.22,1,.36,1), box-shadow .22s ease;
  }
  .card-hover:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }

  .glass {
    background: var(--bg-glass);
    backdrop-filter: blur(16px) saturate(1.6);
    -webkit-backdrop-filter: blur(16px) saturate(1.6);
    border: 1px solid rgba(255,255,255,.12);
  }
  .dark-mode .glass { border-color: rgba(255,255,255,.07); }

  .shimmer {
    background: linear-gradient(90deg,var(--bg-card) 25%,var(--border) 50%,var(--bg-card) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  /* ── Base input ── */
  .inp {
    width:100%; padding:10px 12px 10px 36px;
    border:1.5px solid var(--border); border-radius:var(--radius-md);
    font-size:13px; background:var(--bg-base); color:var(--text-main);
    outline:none; transition:border-color .2s,box-shadow .2s;
    -webkit-appearance:none;
  }
  .inp:focus { border-color:#3b82f6; box-shadow:0 0 0 3px #3b82f622; }

  .lc1{display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}
  .lc2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .lc3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}

  /* ── Dark mode Tailwind overrides ── */
  .dark-mode .bg-white    { background-color:#101831!important }
  .dark-mode .bg-slate-50 { background-color:#080f2a!important }
  .dark-mode .bg-blue-100 { background-color:#0d1a3a!important }
  .dark-mode .bg-blue-200 { background-color:#111e40!important }
  .dark-mode .text-slate-800 { color:#e2e8f0!important }
  .dark-mode .text-slate-700 { color:#cbd5e1!important }
  .dark-mode .text-slate-600 { color:#94a3b8!important }
  .dark-mode .text-slate-500 { color:#64748b!important }
  .dark-mode .border-slate-200 { border-color:#1e2d52!important }
  .dark-mode .border-slate-100 { border-color:#162040!important }
  .dark-mode .bg-slate-100 { background-color:#111e40!important }
  .dark-mode .bg-slate-200 { background-color:#162447!important }

  /* ═══════════════════════════════════════════════════
     RESPONSIVE LAYOUT SYSTEM
  ═══════════════════════════════════════════════════ */

  /* -- Nav desktop items: hide on small screens -- */
  .nav-desktop { display:flex; }
  .nav-search  { display:flex; }
  .nav-auth-btns { display:flex; }
  .nav-logo-text { display:inline; }
  .nav-hamburger { display:none; }

  /* -- Hero layout -- */
  .hero-inner { flex-direction:row; }
  .hero-logo-wrap { display:block; }
  .hero-stats { flex-direction:row; }
  .hero-cta { flex-direction:row; }

  /* -- Feature bar -- */
  .feature-bar { grid-template-columns: repeat(4,1fr); }

  /* -- Products grid -- */
  .products-grid { grid-template-columns: repeat(auto-fill,minmax(160px,1fr)); }

  /* -- Deals grid -- */
  .deals-grid { grid-template-columns: repeat(auto-fill,minmax(280px,1fr)); }

  /* -- Offers grid -- */
  .offers-grid { grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); }

  /* -- Contact cards -- */
  .contact-grid { grid-template-columns: repeat(5,1fr); }

  /* -- Reviews grid -- */
  .reviews-grid { grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); }

  /* -- Review form grid -- */
  .review-form-grid { grid-template-columns:1fr 1fr; }

  /* -- Auth modal width -- */
  .auth-modal { width:100%; max-width:420px; }

  /* -- Social login buttons -- */
  .social-btns { grid-template-columns:1fr 1fr; }

  /* -- Category pills: wrap on small -- */
  .cat-pills { flex-wrap:wrap; }

  /* -- CTA banner -- */
  .cta-banner-inner { flex-direction:row; }

  /* ═══════════════ TABLET (640px – 1023px) ═══════════════ */
  @media (max-width:1023px) {
    .nav-desktop    { display:none!important; }
    .nav-search     { display:none!important; }
    .nav-auth-btns  { display:none!important; }
    .nav-logo-text  { display:none!important; }
    .nav-hamburger  { display:flex!important; }
    .contact-grid   { grid-template-columns:repeat(3,1fr)!important; }
    .feature-bar    { grid-template-columns:repeat(2,1fr)!important; }
    .hero-inner     { flex-direction:column!important; gap:28px!important; }
    .hero-logo-wrap { order:-1; display:flex!important; justify-content:center; }
  }

  /* ═══════════════ MOBILE (< 640px) ═══════════════ */
  @media (max-width:639px) {
    :root {
      --sp-lg: 16px;
      --sp-xl: 20px;
      --sp-2xl: 28px;
    }

    /* Nav */
    .nav-desktop   { display:none!important; }
    .nav-search    { display:none!important; }
    .nav-auth-btns { display:none!important; }
    .nav-logo-text { display:none!important; }
    .nav-hamburger { display:flex!important; }

    /* Hero */
    .hero-inner     { flex-direction:column!important; padding:32px 16px 28px!important; gap:24px!important; }
    .hero-logo-wrap { display:flex!important; justify-content:center; order:-1; }
    .hero-logo-wrap > div { width:130px!important; height:130px!important; }
    .hero-stats     { gap:8px!important; }
    .hero-cta       { flex-direction:column!important; gap:10px!important; }
    .hero-cta button { width:100%!important; justify-content:center!important; }
    .hero-badges    { gap:6px!important; }

    /* Feature bar */
    .feature-bar { grid-template-columns:1fr 1fr!important; gap:8px!important; }

    /* Grids */
    .products-grid { grid-template-columns:repeat(2,1fr)!important; gap:10px!important; }
    .deals-grid    { grid-template-columns:1fr!important; }
    .offers-grid   { grid-template-columns:1fr!important; gap:12px!important; }
    .contact-grid  { grid-template-columns:repeat(2,1fr)!important; gap:10px!important; }
    .reviews-grid  { grid-template-columns:1fr!important; }

    /* Review form */
    .review-form-grid { grid-template-columns:1fr!important; }

    /* Auth modal */
    .auth-modal { max-width:100%!important; border-radius:16px 16px 0 0!important; margin-top:auto!important; }
    .auth-modal-overlay { align-items:flex-end!important; padding:0!important; }

    /* Social btns */
    .social-btns { grid-template-columns:1fr!important; }

    /* CTA banner */
    .cta-banner-inner { flex-direction:column!important; gap:14px!important; text-align:center!important; }
    .cta-banner-inner button { width:100%!important; justify-content:center!important; }

    /* Page padding */
    .page-pad { padding:20px 14px!important; }

    /* Promo banner text size */
    .promo-banner { font-size:11px!important; padding:7px 36px 7px 12px!important; }
    .promo-banner strong { font-size:11px; }

    /* Section headers */
    .section-h2 { font-size:18px!important; }

    /* Product card image */
    .prod-card-img { height:120px!important; }

    /* Admin top bar */
    .admin-topbar-email { display:none!important; }

    /* Contact form */
    .contact-form-wrap { padding:20px 16px!important; }
  }

  /* ═══════════════ VERY SMALL (< 380px) ═══════════════ */
  @media (max-width:379px) {
    .products-grid { grid-template-columns:1fr 1fr!important; gap:8px!important; }
    .hero-stats { flex-wrap:wrap!important; }
    .promo-banner { font-size:10px!important; }
  }

  /* ═══════════════ LARGE DESKTOP (>= 1280px) ═══════════════ */
  @media (min-width:1280px) {
    .products-grid { grid-template-columns:repeat(auto-fill,minmax(170px,1fr))!important; }
    .hero-inner { gap:60px!important; }
  }

  /* ── Touch-friendly tap targets ── */
  @media (hover:none) {
    .card-hover:hover { transform:none; box-shadow:var(--shadow-sm); }
    button, a { min-height:44px; }
    .inp { min-height:44px; padding-top:12px; padding-bottom:12px; font-size:16px; }
  }

  /* ── Reduced motion ── */
  @media (prefers-reduced-motion:reduce) {
    *, *::before, *::after { animation-duration:.01ms!important; transition-duration:.1s!important; }
  }
`;

function StyleTag() {
  return <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// DARK TOGGLE BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function DarkToggle({ style: extraStyle }) {
  const { dark, toggleDark } = useDark();
  return (
    <button onClick={toggleDark} title={dark ? 'Light mode' : 'Dark mode'}
      style={{
        display:'flex',alignItems:'center',justifyContent:'center',
        width:40,height:40,borderRadius:10,flexShrink:0,cursor:'pointer',
        background: dark ? '#1e2d52' : 'rgba(255,255,255,.15)',
        border:`1.5px solid ${dark?'#2d4170':'rgba(255,255,255,.25)'}`,
        transition:'all .25s', ...extraStyle,
      }}>
      {dark ? <Sun size={16} color="#fbbf24"/> : <Moon size={16} color="#e2e8f0"/>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────────────────────────────────────
function LoadingScreen({ role }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase]       = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        const n = p + (p < 70 ? 2.2 : p < 90 ? 1.1 : 0.6);
        if (n >= 100) { clearInterval(iv); return 100; }
        return n;
      });
    }, 36);
    return () => clearInterval(iv);
  }, []);
  useEffect(() => { if (progress > 30) setPhase(1); if (progress > 80) setPhase(2); }, [progress]);

  const isAdmin = role === 'admin';
  const ac  = isAdmin ? '#ef4444' : '#3b82f6';
  const ac2 = isAdmin ? '#f97316' : '#60a5fa';
  const phases = ['Connecting…','Loading resources…','Almost ready…'];

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:9999,overflow:'hidden',
      background:'linear-gradient(to bottom,#030818 0%,#050d2e 40%,#0a1a52 100%)',
      display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      fontFamily:"'Segoe UI',sans-serif", padding:'20px',
    }}>
      {[...Array(16)].map((_,i)=>(
        <div key={i} className="particle" style={{
          width:Math.random()*4+2,height:Math.random()*4+2,
          background:i%3===0?ac:i%3===1?'#60a5fa':'rgba(255,255,255,.4)',
          left:`${Math.random()*100}%`,bottom:`${Math.random()*30}%`,
          '--dur':`${3+Math.random()*4}s`,'--delay':`${Math.random()*4}s`,
        }}/>
      ))}
      <div style={{position:'absolute',left:0,right:0,height:2,
        background:`linear-gradient(90deg,transparent,${ac}60,transparent)`,
        animation:'scanLine 3s linear infinite',pointerEvents:'none',
      }}/>

      {/* Rings — scaled for mobile */}
      <div style={{position:'relative',width:'min(200px,50vw)',height:'min(200px,50vw)',marginBottom:36}}>
        {[1,0.84,0.69,0.55,0.43].map((scale,i)=>(
          <div key={i} style={{
            position:'absolute',
            width:`${scale*100}%`,height:`${scale*100}%`,
            top:`${(1-scale)*50}%`,left:`${(1-scale)*50}%`,
            borderRadius:'50%', border:`${i%2===0?2.5:2}px solid`,
            borderColor:i%2===0?`${ac}80 ${ac} ${ac}30 ${ac}`:`${ac}20 ${ac}70 ${ac}20 ${ac}70`,
            animation:`${i%2===0?'spinRing':'counterSpin'} ${[3,2.2,1.8,1.4,1][i]}s linear infinite`,
          }}/>
        ))}
        <div style={{
          position:'absolute',top:'40%',left:'40%',transform:'translate(-50%,-50%)',
          width:50,height:50,borderRadius:14,
          background:`${ac}18`,border:`1.5px solid ${ac}50`,
          display:'flex',alignItems:'center',justifyContent:'center',
          animation:'pulseCenter 2s ease-in-out infinite',
        }}>
          {isAdmin ? <Shield size={22} color={ac}/> : <User size={22} color={ac}/>}
        </div>
      </div>

      <div style={{textAlign:'center',animation:'fadeUp .6s ease both',width:'100%',maxWidth:280}}>
        <p style={{fontSize:11,fontWeight:800,letterSpacing:'.22em',color:`${ac}cc`,textTransform:'uppercase',marginBottom:4}}>
          {isAdmin ? 'Admin Portal' : 'PSP MARKET'}
        </p>
        <p style={{fontSize:14,color:'rgba(255,255,255,.5)',marginBottom:24,minHeight:20}}>{phases[phase]}</p>
        <div style={{height:4,borderRadius:99,background:'rgba(255,255,255,.07)',overflow:'hidden',position:'relative'}}>
          <div style={{
            height:'100%',borderRadius:99,
            background:`linear-gradient(90deg,${isAdmin?'#991b1b':'#1e40af'},${ac},${ac2})`,
            width:`${progress}%`,transition:'width .08s linear',
            boxShadow:`0 0 8px ${ac}80`,
          }}/>
        </div>
        <p style={{fontSize:11,color:'rgba(255,255,255,.35)',marginTop:6}}>{Math.round(progress)}%</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// CATEGORY STYLES
// ─────────────────────────────────────────────
const CATEGORY_STYLES = {
  Car:        { emoji:'',bg:'from-red-100 to-red-50',    text:'text-red-700',   border:'border-red-200' },
  Computer:   { emoji:'',bg:'from-blue-100 to-blue-50',  text:'text-blue-700',  border:'border-blue-200' },
  Fruit:      { emoji:'',bg:'from-green-100 to-green-50',text:'text-green-700', border:'border-green-200' },
  Vegetable:  { emoji:'',bg:'from-emerald-100 to-emerald-50',text:'text-emerald-700',border:'border-emerald-200' },
  Clothes:    { emoji:'',bg:'from-pink-100 to-pink-50',  text:'text-pink-700',  border:'border-pink-200' },
  Phone:      { emoji:'',bg:'from-violet-100 to-violet-50',text:'text-violet-700',border:'border-violet-200' },
  Accessories:{ emoji:'',bg:'from-amber-100 to-amber-50',text:'text-amber-700', border:'border-amber-200' },
  'Hotel Book':{ emoji:'',bg:'from-cyan-100 to-cyan-50', text:'text-cyan-700',  border:'border-cyan-200' },
  Meet:       { emoji:'',bg:'from-orange-100 to-orange-50',text:'text-orange-700',border:'border-orange-200' },
};
const DEFAULT_STYLE = { emoji:'📦',bg:'from-slate-100 to-slate-50',text:'text-slate-700',border:'border-slate-200' };

// ─────────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// INPUT FIELD
// ─────────────────────────────────────────────
function InputField({ icon, type='text', placeholder, value, onChange, onBlur, right, style: extraStyle={}, ...rest }) {
  return (
    <div style={{position:'relative'}}>
      <span style={{position:'absolute',inset:'0 auto 0 0',display:'flex',alignItems:'center',paddingLeft:11,color:'var(--text-muted)',pointerEvents:'none'}}>
        {icon}
      </span>
      <input type={type} placeholder={placeholder} value={value}
        onChange={onChange} onBlur={onBlur}
        className="inp" style={extraStyle} {...rest}
      />
      {right && (
        <span style={{position:'absolute',inset:'0 0 0 auto',display:'flex',alignItems:'center',paddingRight:10}}>
          {right}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGN-IN PROMPT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function SignInPrompt({ product, onClose, onLogin }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [err, setErr]           = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async (e) => {
    e.preventDefault(); setErr('');
    if (!email || !password) { setErr('Please fill in all fields.'); return; }
    if (!isEmailLegit(email)) { setErr('❌ Email looks invalid or fake.'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/users/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim().toLowerCase(),passwordHash:simpleHash(password)})});
      const data = await res.json();
      if (res.status===404) { setErr('🚫 No account found. Register first.'); return; }
      if (res.status===401) { setErr('🔑 Incorrect password.'); return; }
      if (!res.ok)          { setErr(data.error||'Sign in failed.'); return; }
      onLogin('user',data.user.email,data.user.name,data.user.id,data.user.avatar);
    } catch { setErr('⚠️ Network error.'); }
    finally { setLoading(false); }
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{position:'fixed',inset:0,zIndex:9000,display:'flex',alignItems:'center',justifyContent:'center',padding:'16px',background:'rgba(3,8,24,.78)',backdropFilter:'blur(8px)'}}>
      <div className="anim-modalPop card" style={{width:'100%',maxWidth:'min(380px,calc(100vw - 32px))',overflow:'hidden'}}>
        <div style={{background:'linear-gradient(135deg,#0820c2,#1d4ed8,#0369a1)',padding:'18px 18px 14px',color:'#fff',position:'relative'}}>
          <button onClick={onClose} style={{position:'absolute',top:10,right:10,background:'rgba(255,255,255,.15)',border:'none',borderRadius:8,width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#fff'}}>
            <X size={14}/>
          </button>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <div style={{width:48,height:48,borderRadius:10,background:'rgba(255,255,255,.15)',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              {product.image
                ? <img src={product.image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}}/>
                : <span style={{fontSize:24}}>{(CATEGORY_STYLES[product.category]||DEFAULT_STYLE).emoji}</span>}
            </div>
            <div style={{minWidth:0}}>
              <p style={{fontSize:10,color:'#93c5fd',marginBottom:2}}>You selected</p>
              <p style={{fontWeight:700,fontSize:13,lineHeight:1.3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{product.name}</p>
              <p style={{color:'#93c5fd',fontSize:11,marginTop:2}}>${Number(product.price||0).toFixed(2)} · {product.category}</p>
            </div>
          </div>
          <div style={{marginTop:10,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:9,padding:'6px 12px',textAlign:'center'}}>
            <p style={{fontSize:11,color:'#bfdbfe'}}>🔒 Sign in to add to cart & checkout securely</p>
          </div>
        </div>
        <div style={{padding:'16px 18px 18px',background:'var(--bg-card)'}}>
          <h3 style={{fontWeight:700,color:'var(--text-main)',fontSize:14,marginBottom:2}}>Sign in to continue</h3>
          <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:12}}>Use the email & password you registered with.</p>
          {err && <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',fontSize:11,padding:'7px 11px',borderRadius:9,marginBottom:10}}>{err}</div>}
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:9}}>
            <InputField icon={<Mail size={13}/>} type="email" placeholder="your@email.com" value={email} onChange={e=>{setEmail(e.target.value);setErr('')}}/>
            <InputField icon={<Lock size={13}/>} type={showPw?'text':'password'} placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setErr('')}}
              right={<button type="button" onClick={()=>setShowPw(!showPw)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex'}}>{showPw?<EyeOff size={13}/>:<Eye size={13}/>}</button>}
            />
            <button type="submit" disabled={loading} style={{padding:'11px',borderRadius:11,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',color:'#fff',fontWeight:700,fontSize:13,display:'flex',alignItems:'center',justifyContent:'center',gap:6,opacity:loading?.65:1,boxShadow:'0 4px 14px #3b82f640'}}>
              {loading ? <RefreshCw size={13} className="anim-spin"/> : <><User size={13}/> Sign in & view product <ArrowRight size={13}/></>}
            </button>
          </form>
          <div style={{display:'flex',alignItems:'center',gap:8,margin:'10px 0'}}>
            <div style={{flex:1,height:1,background:'var(--border)'}}/><span style={{fontSize:10,color:'var(--text-muted)'}}>or</span><div style={{flex:1,height:1,background:'var(--border)'}}/>
          </div>
          <button onClick={()=>onLogin('guest','guest','Guest',null,null)} style={{width:'100%',padding:'10px',borderRadius:11,border:'1.5px solid var(--border)',background:'transparent',color:'var(--text-main)',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
            <Eye size={13}/> Continue as guest
          </button>
          <p style={{textAlign:'center',fontSize:10,color:'var(--text-muted)',marginTop:7}}>No account? Close this and register first.</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onLogin, defaultTab='signin' }) {
  const MY_ADMIN_EMAIL    = "sopheakp175@gmail.com";
  const MY_ADMIN_PASSWORD = "220927";
  const { isMobile } = useBreakpoint();

  const [activeTab,   setActiveTab]   = useState(defaultTab);
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [name,        setName]        = useState('');
  const [rememberMe,  setRememberMe]  = useState(false);
  const [error,       setError]       = useState('');
  const [showPw,      setShowPw]      = useState(false);
  const [showCf,      setShowCf]      = useState(false);
  const [emailHint,   setEmailHint]   = useState('');
  const [loading,     setLoading]     = useState(false);

  const switchTab = (tab) => { setActiveTab(tab);setError('');setEmailHint('');setEmail('');setPassword('');setConfirmPass('');setName(''); };

  const onEmailBlur = async () => {
    if (!email) { setEmailHint(''); return; }
    if (!isEmailLegit(email)) { setEmailHint('⚠️ Email looks invalid or fake.'); return; }
    if (activeTab==='admin') { setEmailHint(''); return; }
    try {
      const res  = await fetch(`${API}/api/users/check-email`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim().toLowerCase()})});
      const data = await res.json();
      if (activeTab==='register'&&data.exists) setEmailHint('📧 Already registered — sign in instead.');
      else if (activeTab==='signin'&&!data.exists) setEmailHint('🚫 No account found — register first.');
      else setEmailHint('');
    } catch { setEmailHint(''); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (activeTab==='admin') {
      if (!email||!password) { setError('Please fill in all fields.'); return; }
      if (email===MY_ADMIN_EMAIL&&password===MY_ADMIN_PASSWORD) onLogin('admin',email,'Phy Sopheak','ADMIN-001',null);
      else setError('❌ Access denied. Invalid admin credentials.');
      return;
    }
    if (activeTab==='register') {
      if (!name.trim())         { setError('Please enter your full name.'); return; }
      if (!email)               { setError('Please enter your email.'); return; }
      if (!isEmailLegit(email)) { setError('❌ Invalid or fake email.'); return; }
      if (password.length<6)    { setError('Password must be at least 6 characters.'); return; }
      if (password!==confirmPass){ setError('Passwords do not match.'); return; }
      setLoading(true);
      try {
        const res  = await fetch(`${API}/api/users/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:`USR-${Date.now()}`,name:name.trim(),email:email.trim().toLowerCase(),passwordHash:simpleHash(password)})});
        const data = await res.json();
        if (res.status===409) { setError('📧 Email already registered. Sign in instead.'); return; }
        if (!res.ok)          { setError(data.error||'Registration failed.'); return; }
        onLogin('user',data.user.email,data.user.name,data.user.id,data.user.avatar);
      } catch { setError('⚠️ Network error.'); } finally { setLoading(false); }
      return;
    }
    if (!email||!password) { setError('Please fill in all fields.'); return; }
    if (!isEmailLegit(email)) { setError('❌ Invalid email.'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/users/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email.trim().toLowerCase(),passwordHash:simpleHash(password)})});
      const data = await res.json();
      if (res.status===404) { setError('🚫 No account found. Register first.'); return; }
      if (res.status===401) { setError('🔑 Incorrect password.'); return; }
      if (!res.ok)          { setError(data.error||'Sign in failed.'); return; }
      onLogin('user',data.user.email,data.user.name,data.user.id,data.user.avatar);
    } catch { setError('⚠️ Network error.'); } finally { setLoading(false); }
  };

  const pwStr = password.length===0?0:password.length<6?1:password.length<9?2:password.length<12?3:4;
  const pwLabels = ['','Too short','Fair','Good','Strong'];
  const pwColors = ['','#ef4444','#f97316','#22c55e','#10b981'];
  const tabs = [{key:'signin',label:'Sign In',icon:<User size={12}/>},{key:'register',label:'Register',icon:<UserPlus size={12}/>},{key:'admin',label:'Admin',icon:<Shield size={12}/>}];

  const overlayStyle = {
    position:'fixed',inset:0,zIndex:9000,
    display:'flex',alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent:'center', padding: isMobile ? '0' : '16px',
    backgroundImage:`linear-gradient(rgba(3,8,24,.8),rgba(3,8,24,.87)),url('https://img.sanishtech.com/u/1633594ef766e0b33213011add414d67.png')`,
    backgroundPosition:'center',backgroundSize:'cover',
    backdropFilter:'blur(4px)',
  };

  const modalStyle = {
    width:'100%', maxWidth: isMobile ? '100%' : '420px',
    borderRadius: isMobile ? '20px 20px 0 0' : '20px',
    overflow:'hidden',
    boxShadow:'0 32px 80px rgba(3,8,40,.6),0 0 0 1px rgba(59,130,246,.2)',
    maxHeight: isMobile ? '92vh' : '90vh',
    overflowY:'auto',
  };

  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={overlayStyle}>
      <div className="anim-modalPop card" style={modalStyle}>
        {/* Header */}
        <div style={{padding:'20px 20px 0',background:'var(--bg-card)',position:'relative',textAlign:'center'}}>
          <button onClick={onClose} style={{position:'absolute',top:12,right:12,background:'var(--bg-base)',border:'1px solid var(--border)',borderRadius:8,width:30,height:30,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'var(--text-muted)'}}>
            <X size={14}/>
          </button>
          {/* Mobile pull indicator */}
          {isMobile && <div style={{width:36,height:4,borderRadius:99,background:'var(--border)',margin:'0 auto 14px'}}/>}
          <div className="anim-glow" style={{width:48,height:48,borderRadius:13,overflow:'hidden',margin:'0 auto 10px',border:'2px solid #3b82f640'}}>
            <img src={LOGO} alt="PSP MART" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
          </div>
          <h2 style={{fontSize:16,fontWeight:800,color:'var(--text-main)',marginBottom:2}}>
            {activeTab==='signin'&&'Sign in to PSP MARKET'}
            {activeTab==='register'&&'Create your account'}
            {activeTab==='admin'&&'Admin Access Only'}
          </h2>
          <p style={{fontSize:11,color:'var(--text-muted)',marginBottom:14}}>
            {activeTab==='signin'&&'Access your orders, wishlist & deals'}
            {activeTab==='register'&&'Join 50,000+ happy PSP MARKET shoppers'}
            {activeTab==='admin'&&'Restricted to authorised personnel only'}
          </p>
          {/* Tabs */}
          <div style={{display:'flex',gap:4,background:'var(--bg-base)',border:'1px solid var(--border)',borderRadius:12,padding:4}}>
            {tabs.map(t=>(
              <button key={t.key} type="button" onClick={()=>switchTab(t.key)} style={{
                flex:1,padding:'8px 4px',borderRadius:9,border:'none',cursor:'pointer',
                display:'flex',alignItems:'center',justifyContent:'center',gap:4,
                fontSize: isMobile ? 10 : 11, fontWeight:700,
                background:activeTab===t.key?(t.key==='admin'?'#991b1b':'#1d4ed8'):'transparent',
                color:activeTab===t.key?'#fff':'var(--text-muted)',
                transition:'all .2s',
                boxShadow:activeTab===t.key?'0 2px 8px rgba(0,0,0,.25)':'none',
              }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{padding:'16px 20px 20px',background:'var(--bg-card)'}}>
          {activeTab!=='admin' && (
            <>
              <div className="social-btns" style={{display:'grid',gap:8,marginBottom:12}}>
                {[['Google',<GoogleIcon/>],['Facebook',<FacebookIcon/>]].map(([lbl,ico])=>(
                  <button key={lbl} type="button" style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:'10px',borderRadius:11,border:'1.5px solid var(--border)',background:'var(--bg-base)',color:'var(--text-main)',fontSize:12,fontWeight:600,cursor:'pointer',minHeight:44}}>
                    {ico} {lbl}
                  </button>
                ))}
              </div>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                <div style={{flex:1,height:1,background:'var(--border)'}}/><span style={{fontSize:10,color:'var(--text-muted)',whiteSpace:'nowrap'}}>or continue with email</span><div style={{flex:1,height:1,background:'var(--border)'}}/>
              </div>
            </>
          )}
          {error && (
            <div style={{background:'#fef2f2',border:'1px solid #fecaca',color:'#dc2626',fontSize:11,padding:'9px 12px',borderRadius:10,marginBottom:12,display:'flex',gap:6,alignItems:'flex-start'}}>
              ⚠️ <span>{error}</span>
            </div>
          )}
          {activeTab==='register' && (
            <div style={{background:'#fffbeb',border:'1px solid #fde68a',borderRadius:10,padding:'9px 12px',marginBottom:12,display:'flex',gap:7,alignItems:'flex-start'}}>
              <Zap size={13} color="#f59e0b" style={{marginTop:1,flexShrink:0}}/>
              <p style={{fontSize:11,color:'#92400e',margin:0}}>Register now and use <strong>WELCOME15</strong> at checkout for 15% off!</p>
            </div>
          )}

          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {activeTab==='register' && (
              <div>
                <label style={{display:'block',fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Full name</label>
                <InputField icon={<User size={13}/>} placeholder="Your full name" value={name} onChange={e=>setName(e.target.value)}/>
              </div>
            )}
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Email address</label>
              <InputField icon={<Mail size={13}/>} type="email" placeholder={activeTab==='admin'?'admin@example.com':'your@email.com'} value={email} onChange={e=>{setEmail(e.target.value);setEmailHint('');setError('')}} onBlur={onEmailBlur}/>
              {emailHint && <p style={{fontSize:11,color:'#d97706',marginTop:4}}>{emailHint}</p>}
            </div>
            <div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                <label style={{fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em'}}>Password</label>
                {activeTab==='signin' && <button type="button" style={{fontSize:10,color:'#3b82f6',background:'none',border:'none',cursor:'pointer',fontWeight:600}}>Forgot password?</button>}
              </div>
              <InputField icon={<Lock size={13}/>} type={showPw?'text':'password'} placeholder="••••••••" value={password} onChange={e=>{setPassword(e.target.value);setError('')}}
                right={<button type="button" onClick={()=>setShowPw(!showPw)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:4}}>{showPw?<EyeOff size={13}/>:<Eye size={13}/>}</button>}
              />
              {activeTab==='register' && password.length>0 && (
                <div style={{marginTop:6}}>
                  <div style={{display:'flex',gap:3}}>
                    {[1,2,3,4].map(i=>(
                      <div key={i} style={{height:3,flex:1,borderRadius:99,background:pwStr>=i?pwColors[pwStr]:'var(--border)',transition:'background .3s'}}/>
                    ))}
                  </div>
                  <p style={{fontSize:10,color:pwColors[pwStr]||'var(--text-muted)',marginTop:3,fontWeight:600}}>{pwLabels[pwStr]}</p>
                </div>
              )}
            </div>
            {activeTab==='register' && (
              <div>
                <label style={{display:'block',fontSize:10,fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Confirm password</label>
                <InputField icon={<Lock size={13}/>} type={showCf?'text':'password'} placeholder="••••••••" value={confirmPass} onChange={e=>{setConfirmPass(e.target.value);setError('')}}
                  right={<div style={{display:'flex',alignItems:'center',gap:4}}>
                    {confirmPass&&<span style={{fontSize:12}}>{confirmPass===password?'✅':'❌'}</span>}
                    <button type="button" onClick={()=>setShowCf(!showCf)} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:4}}>{showCf?<EyeOff size={13}/>:<Eye size={13}/>}</button>
                  </div>}
                  style={{paddingRight:54}}
                />
              </div>
            )}
            {activeTab==='signin' && (
              <label style={{display:'flex',alignItems:'center',gap:7,cursor:'pointer',fontSize:12,color:'var(--text-muted)'}}>
                <input type="checkbox" checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} style={{accentColor:'#3b82f6',width:14,height:14}}/>
                Remember me on this device
              </label>
            )}
            <button type="button" onClick={handleSubmit} disabled={loading} style={{
              padding:'12px',borderRadius:12,border:'none',cursor:'pointer',
              background:activeTab==='admin'?'linear-gradient(135deg,#7f1d1d,#dc2626)':'linear-gradient(135deg,#0820c2,#1d4ed8,#3b82f6)',
              color:'#fff',fontWeight:700,fontSize:13,
              display:'flex',alignItems:'center',justifyContent:'center',gap:7,
              opacity:loading?.65:1,boxShadow:activeTab==='admin'?'0 4px 14px #dc262640':'0 4px 18px #1d4ed840',
              marginTop:4,minHeight:44,
            }}>
              {loading ? <RefreshCw size={14} className="anim-spin"/>
                : <>{activeTab==='signin'&&<><User size={13}/>Sign in to PSP MARKET</>}{activeTab==='register'&&<><UserPlus size={13}/>Create my account</>}{activeTab==='admin'&&<><Shield size={13}/>Verify admin identity</>} <ArrowRight size={13}/></>}
            </button>
          </div>

          {activeTab!=='admin' && (
            <>
              <div style={{display:'flex',alignItems:'center',gap:8,margin:'12px 0 10px'}}>
                <div style={{flex:1,height:1,background:'var(--border)'}}/><span style={{fontSize:10,color:'var(--text-muted)'}}>or</span><div style={{flex:1,height:1,background:'var(--border)'}}/>
              </div>
              <button type="button" onClick={()=>onLogin('guest','guest','Guest',null,null)} style={{width:'100%',padding:'11px',borderRadius:12,border:'1.5px solid var(--border)',background:'transparent',color:'var(--text-main)',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,minHeight:44}}>
                <Eye size={13}/> Browse as guest
              </button>
              <p style={{textAlign:'center',fontSize:10,color:'var(--text-muted)',marginTop:8}}>Guest accounts can't save carts or track orders.</p>
            </>
          )}
          {activeTab==='admin' && (
            <p style={{textAlign:'center',fontSize:10,color:'var(--text-muted)',marginTop:14,paddingTop:10,borderTop:'1px solid var(--border)'}}>Private admin channel. All access attempts are logged.</p>
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
  const [liked,   setLiked]   = useState(false);
  const [hovered, setHovered] = useState(false);
  const style = CATEGORY_STYLES[product.category] || DEFAULT_STYLE;
  return (
    <div className="card card-hover"
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onClick={()=>onProductClick(product)}
      style={{cursor:'pointer',overflow:'hidden',transition:'all .25s cubic-bezier(.22,1,.36,1)'}}>
      <div className="prod-card-img" style={{position:'relative',background:'linear-gradient(135deg,#f0f4ff,#e8eeff)',height:140,overflow:'hidden'}}>
        <img src={product.image} alt={product.name}
          style={{width:'100%',height:'100%',objectFit:'cover',transform:hovered?'scale(1.08)':'scale(1)',transition:'transform .4s ease'}}
          onError={e=>{e.target.style.display='none'}}
        />
        <span style={{position:'absolute',top:7,left:7,background:'rgba(255,255,255,.9)',backdropFilter:'blur(6px)',fontSize:9,fontWeight:700,padding:'2px 7px',borderRadius:99,color:'#475569',textTransform:'uppercase',letterSpacing:'.04em'}}>
          {product.category}
        </span>
        <button onClick={e=>{e.stopPropagation();setLiked(!liked)}} style={{position:'absolute',bottom:7,right:7,width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,.9)',border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',transition:'transform .2s',transform:liked?'scale(1.2)':'scale(1)'}}>
          <Heart size={12} style={{fill:liked?'#ef4444':'none',color:liked?'#ef4444':'#94a3b8'}}/>
        </button>
      </div>
      <div style={{padding:'10px 11px 12px'}}>
        <p className="lc2" style={{fontSize:12,fontWeight:700,color:'var(--text-main)',marginBottom:3,lineHeight:1.4}}>{product.name}</p>
        {product.description && <p className="lc1" style={{fontSize:10,color:'var(--text-muted)',marginBottom:5}}>{product.description}</p>}
        <p style={{fontSize:14,fontWeight:800,color:'#1d4ed8',marginBottom:7}}>${Number(product.price||0).toFixed(2)}</p>
        <button onClick={e=>{e.stopPropagation();onProductClick(product)}} style={{width:'100%',padding:'7px',borderRadius:9,border:'none',cursor:'pointer',background:'linear-gradient(135deg,#1d4ed8,#3b82f6)',color:'#fff',fontSize:11,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:5,boxShadow:'0 3px 10px #3b82f640',minHeight:32}}>
          <ShoppingCart size={11}/> Add to cart
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USER COMMENT SECTION
// ─────────────────────────────────────────────────────────────────────────────
function UserCommentSection() {
  const [comments,   setComments]   = useState([]);
  const [username,   setUsername]   = useState('');
  const [comment,    setComment]    = useState('');
  const [rating,     setRating]     = useState(5);
  const [hovered,    setHovered]    = useState(0);
  const [err,        setErr]        = useState('');
  const [success,    setSuccess]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading,    setLoading]    = useState(true);

  const AVATAR_COLORS = ['#3b82f6','#10b981','#8b5cf6','#ec4899','#f59e0b','#06b6d4','#ef4444'];
  const getAvatarColor = (n) => AVATAR_COLORS[n.charCodeAt(0)%AVATAR_COLORS.length];
  const RATING_LABELS  = ['','Poor','Fair','Good','Great','Excellent'];

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/comments`);
      if (res.ok) {
        const data = await res.json(); setComments(data);
        try { localStorage.setItem('psp_comments',JSON.stringify(data)); } catch {}
      } else throw new Error();
    } catch {
      try { const s=localStorage.getItem('psp_comments'); setComments(s?JSON.parse(s):[]); } catch { setComments([]); }
    } finally { setLoading(false); }
  };
  useEffect(()=>{ loadComments(); },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) { setErr('Please enter your name.'); return; }
    if (!comment.trim())  { setErr('Please write a comment.'); return; }
    if (comment.trim().length<5) { setErr('Comment is too short (min 5 chars).'); return; }
    const dateLabel = new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
    const payload = { id:Date.now().toString(36)+Math.random().toString(36).slice(2,6), username:username.trim(), email:`${username.trim().toLowerCase().replace(/\s+/g,'.')}@pspmarket.guest`, comment:comment.trim(), rating, date:dateLabel };
    setSubmitting(true); setErr('');
    try {
      const res = await fetch(`${API}/api/comments`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if (res.ok) await loadComments();
      else { const u=[{...payload},...comments]; setComments(u); try{localStorage.setItem('psp_comments',JSON.stringify(u))}catch{} }
    } catch { const u=[{...payload},...comments]; setComments(u); try{localStorage.setItem('psp_comments',JSON.stringify(u))}catch{} }
    finally { setSubmitting(false); }
    setUsername(''); setComment(''); setRating(5); setSuccess(true);
    setTimeout(()=>setSuccess(false),3500);
  };

  return (
    <div style={{maxWidth:1280,margin:'0 auto',padding:'32px var(--sp-lg)'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10,flexWrap:'wrap'}}>
        <h3 style={{fontSize:20,fontWeight:800,color:'var(--text-main)',margin:0}}>Customer Reviews</h3>
        <span style={{fontSize:11,background:'var(--bg-base)',color:'var(--text-muted)',border:'1px solid var(--border)',padding:'2px 10px',borderRadius:99,fontWeight:600}}>
          {loading?'…':comments.length} reviews
        </span>
        <button onClick={loadComments} disabled={loading} style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:5,fontSize:12,color:'#3b82f6',background:'none',border:'none',cursor:'pointer',fontWeight:700,opacity:loading?.5:1,minHeight:36}}>
          <RefreshCw size={12} className={loading?'anim-spin':''}/> Refresh
        </button>
      </div>

      {/* Review form */}
      <div style={{background:'linear-gradient(135deg,#0820c2,#1d4ed8 70%,#0369a1)',borderRadius:20,padding:'20px var(--sp-lg)',marginBottom:28,boxShadow:'0 8px 32px rgba(8,32,194,.35)'}}>
        <h4 style={{fontWeight:700,color:'#fff',fontSize:14,marginBottom:14,display:'flex',alignItems:'center',gap:7}}><UserPlus size={14}/> Leave your review</h4>
        {success && <div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(16,185,129,.15)',border:'1px solid rgba(16,185,129,.4)',color:'#6ee7b7',fontSize:12,fontWeight:600,padding:'8px 12px',borderRadius:9,marginBottom:10}}><CheckCircle size={13}/> Thanks! Your review is now live.</div>}
        {err && <div style={{background:'rgba(239,68,68,.12)',border:'1px solid rgba(239,68,68,.35)',color:'#fca5a5',fontSize:11,padding:'8px 12px',borderRadius:9,marginBottom:10}}>{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="review-form-grid" style={{display:'grid',gap:12,marginBottom:12}}>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:700,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Your name *</label>
              <div style={{position:'relative'}}>
                <span style={{position:'absolute',inset:'0 auto 0 0',display:'flex',alignItems:'center',paddingLeft:10,color:'rgba(255,255,255,.5)',pointerEvents:'none'}}><User size={13}/></span>
                <input type="text" placeholder="e.g. Sokha…" value={username} onChange={e=>{setUsername(e.target.value);setErr('')}} maxLength={40}
                  style={{width:'100%',paddingLeft:32,paddingRight:12,paddingTop:10,paddingBottom:10,borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,outline:'none',minHeight:42}}
                />
              </div>
            </div>
            <div>
              <label style={{display:'block',fontSize:10,fontWeight:700,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Rating *</label>
              <div style={{display:'flex',alignItems:'center',gap:3,minHeight:42}}>
                {[1,2,3,4,5].map(star=>(
                  <button key={star} type="button" onMouseEnter={()=>setHovered(star)} onMouseLeave={()=>setHovered(0)} onClick={()=>setRating(star)}
                    style={{background:'none',border:'none',cursor:'pointer',fontSize:26,lineHeight:1,padding:'2px',transform:(hovered||rating)>=star?'scale(1.15)':'scale(1)',transition:'transform .15s'}}>
                    <span style={{color:(hovered||rating)>=star?'#fbbf24':'rgba(255,255,255,.3)'}}>★</span>
                  </button>
                ))}
                <span style={{fontSize:11,color:'rgba(255,255,255,.7)',marginLeft:4}}>{RATING_LABELS[hovered||rating]}</span>
              </div>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:'block',fontSize:10,fontWeight:700,color:'rgba(255,255,255,.7)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:4}}>Your comment *</label>
            <textarea rows={3} placeholder="Tell others about your experience…" value={comment} onChange={e=>{setComment(e.target.value);setErr('')}} maxLength={300}
              style={{width:'100%',padding:'10px 12px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,outline:'none',resize:'none'}}
            />
            <p style={{fontSize:10,color:'rgba(255,255,255,.4)',textAlign:'right',marginTop:2}}>{comment.length}/300</p>
          </div>
          <button type="submit" disabled={submitting} style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,.15)',border:'1.5px solid rgba(255,255,255,.3)',color:'#fff',fontSize:13,fontWeight:700,padding:'10px 20px',borderRadius:10,cursor:'pointer',minHeight:42}}>
            {submitting ? <RefreshCw size={13} className="anim-spin"/> : 'Post Review ✨'}
          </button>
        </form>
      </div>

      {/* Comment cards */}
      {loading ? (
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'40px 0',gap:10,color:'var(--text-muted)'}}>
          <RefreshCw size={18} className="anim-spin"/> <span style={{fontSize:13}}>Loading reviews…</span>
        </div>
      ) : (
        <div className="reviews-grid" style={{display:'grid',gap:14}}>
          {comments.map((c,i)=>(
            <div key={c.id} className="card anim-fadeUp" style={{padding:16,animationDelay:`${i*.05}s`}}>
              <span style={{float:'right',fontSize:9,background:'#eff6ff',color:'#1d4ed8',border:'1px solid #bfdbfe',padding:'2px 8px',borderRadius:99,fontWeight:700}}>Customer</span>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:getAvatarColor(c.username||'A'),display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:800,color:'#fff',flexShrink:0}}>
                  {(c.username||'A')[0].toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{fontSize:13,fontWeight:700,color:'var(--text-main)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{c.username}</p>
                  <p style={{fontSize:10,color:'var(--text-muted)'}}>{c.date}</p>
                </div>
              </div>
              <div style={{display:'flex',gap:1,marginBottom:7}}>
                {[1,2,3,4,5].map(s=><span key={s} style={{color:s<=(c.rating||0)?'#f59e0b':'var(--border)',fontSize:13}}>★</span>)}
              </div>
              <p className="lc3" style={{fontSize:12,color:'var(--text-muted)',lineHeight:1.6}}>"{c.comment}"</p>
            </div>
          ))}
          {comments.length===0 && <p style={{textAlign:'center',fontSize:12,color:'var(--text-muted)',gridColumn:'1/-1',padding:'20px 0'}}>Be the first to leave a review above!</p>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
function LoginPage({ onLogin, products }) {
  const { dark, toggleDark } = useDark();
  const { isMobile } = useBreakpoint();

  const [promoBanner,     setPromoBanner]    = useState(true);
  const [mobileMenuOpen,  setMobileMenuOpen] = useState(false);
  const [activeSection,   setActiveSection]  = useState('home');
  const [activeCategory,  setActiveCategory] = useState('');
  const [searchQuery,     setSearchQuery]    = useState('');
  const [selectedProduct, setSelectedProduct]= useState(null);
  const [showAuthModal,   setShowAuthModal]  = useState(false);
  const [authModalTab,    setAuthModalTab]   = useState('signin');
  const [scrolled,        setScrolled]       = useState(false);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener('scroll',fn,{passive:true});
    return ()=>window.removeEventListener('scroll',fn);
  },[]);

  const openAuth = (tab='signin') => { setAuthModalTab(tab); setShowAuthModal(true); setMobileMenuOpen(false); };
  const switchSection = (s) => { setActiveSection(s); setMobileMenuOpen(false); window.scrollTo({top:0,behavior:'smooth'}); };

  const allProducts      = products||[];
  const uniqueCategories = [...new Set(allProducts.map(p=>p.category).filter(Boolean))];
  useEffect(()=>{ if(uniqueCategories.length>0&&!activeCategory) setActiveCategory(uniqueCategories[0]); },[uniqueCategories.length]);

  const searchResults   = searchQuery.trim().length>1 ? allProducts.filter(p=>p.name.toLowerCase().includes(searchQuery.toLowerCase())) : null;
  const displayProducts = searchResults||(activeCategory?allProducts.filter(p=>p.category===activeCategory):allProducts);

  const NAV_ITEMS = [
    {key:'home',    label:'Home',     icon:<HomeIcon size={13}/>},
    {key:'products',label:'Products', icon:<Package size={13}/>},
    {key:'deals',   label:'Deals',    icon:<Tag size={13}/>},
    {key:'offers',  label:'Offers',   icon:<Gift size={13}/>},
    {key:'contact', label:'Contact',  icon:<Phone size={13}/>},
  ];
  const OFFERS_DATA = [
    {code:'WELCOME15',discount:'15% OFF',    label:'New Members',  desc:'First order discount for all new sign-ups',gradient:'linear-gradient(135deg,#0820c2,#3b82f6)',icon:'🎉',expires:'No expiry'},
    {code:'SAVE30',   discount:'$30 OFF',    label:'Orders $150+', desc:'Spend $150 or more and save $30 instantly', gradient:'linear-gradient(135deg,#7c3aed,#a855f7)',icon:'💜',expires:'Ends Jun 30'},
    {code:'FREESHIP', discount:'Free Shipping',label:'All Orders', desc:'Free delivery on any order this weekend',   gradient:'linear-gradient(135deg,#059669,#10b981)',icon:'🚚',expires:'Weekend only'},
    {code:'FLASH50',  discount:'50% OFF',    label:'Flash Sale',   desc:'Selected electronics & accessories only',   gradient:'linear-gradient(135deg,#dc2626,#f97316)',icon:'⚡',expires:'Today only'},
  ];

  return (
    <div style={{minHeight:'100vh',display:'flex',flexDirection:'column',background:'var(--bg-base)'}}>
      {showAuthModal && (
        <AuthModal defaultTab={authModalTab} onClose={()=>setShowAuthModal(false)}
          onLogin={(role,email,name,id,avatar)=>{setShowAuthModal(false);onLogin(role,email,name,id,avatar);}}
        />
      )}
      {selectedProduct && <SignInPrompt product={selectedProduct} onClose={()=>setSelectedProduct(null)} onLogin={onLogin}/>}

      {/* ── Promo banner ── */}
      {promoBanner && (
        <div className="promo-banner" style={{
          background:'linear-gradient(90deg,#0820c2,#1d4ed8,#0369a1)',
          color:'#fff',padding:'7px 40px 7px 16px',
          display:'flex',alignItems:'center',justifyContent:'center',
          flexWrap:'wrap',gap:6,fontSize:12,fontWeight:500,position:'relative',
          textAlign:'center',lineHeight:1.5,
        }}>
          <Sparkles size={11} color="#fbbf24" style={{flexShrink:0}}/>
          <span>New member deal — <strong>15% off</strong> your first order with code{' '}
            <span style={{background:'rgba(255,255,255,.2)',padding:'1px 7px',borderRadius:5,fontFamily:'monospace',fontWeight:800,letterSpacing:'.06em'}}>WELCOME15</span>
          </span>
          <span style={{background:'#16a34a',color:'#fff',fontSize:9,fontWeight:800,padding:'2px 7px',borderRadius:99,flexShrink:0}}>Limited</span>
          <button onClick={()=>setPromoBanner(false)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'rgba(255,255,255,.6)',cursor:'pointer',display:'flex',padding:4,minHeight:32}}>
            <X size={13}/>
          </button>
        </div>
      )}

      {/* ── Sticky Navbar ── */}
      <div style={{
        background:scrolled?(dark?'rgba(8,15,42,.96)':'rgba(8,32,194,.97)'):'var(--nav-bg)',
        backdropFilter:scrolled?'blur(16px)':'none',
        borderBottom:'1px solid rgba(255,255,255,.1)',
        boxShadow:scrolled?'0 4px 24px rgba(3,8,40,.4)':'none',
        position:'sticky',top:0,zIndex:40,
        transition:'all .3s ease',
      }}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 16px',height:56,display:'flex',alignItems:'center',gap:10}}>
          {/* Logo */}
          <div onClick={()=>switchSection('home')} style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',flexShrink:0,minHeight:44}}>
            <img src={LOGO} alt="PSP MART" style={{width:34,height:34,borderRadius:9,objectFit:'cover',boxShadow:'0 2px 8px rgba(0,0,0,.3)',flexShrink:0}}/>
            <span className="nav-logo-text" style={{fontSize:14,fontWeight:800,color:'#fff',letterSpacing:'.02em',whiteSpace:'nowrap'}}>PSP MARKET</span>
          </div>

          {/* Desktop nav */}
          <nav className="nav-desktop" style={{alignItems:'center',gap:1,flex:1,marginLeft:4}}>
            {NAV_ITEMS.map(nav=>(
              <button key={nav.key} onClick={()=>switchSection(nav.key)} style={{
                display:'flex',alignItems:'center',gap:5,padding:'7px 12px',borderRadius:9,border:'none',
                cursor:'pointer',fontSize:12,fontWeight:activeSection===nav.key?700:500,
                background:activeSection===nav.key?'rgba(255,255,255,.15)':'transparent',
                color:activeSection===nav.key?'#fff':'rgba(255,255,255,.72)',
                position:'relative',transition:'all .2s',minHeight:36,
              }}
                onMouseEnter={e=>{if(activeSection!==nav.key){e.currentTarget.style.background='rgba(255,255,255,.08)';e.currentTarget.style.color='#fff'}}}
                onMouseLeave={e=>{if(activeSection!==nav.key){e.currentTarget.style.background='transparent';e.currentTarget.style.color='rgba(255,255,255,.72)'}}}
              >
                {nav.icon} {nav.label}
                {activeSection===nav.key && <span style={{position:'absolute',bottom:2,left:'50%',transform:'translateX(-50%)',width:'40%',height:2,background:'#60a5fa',borderRadius:99}}/>}
              </button>
            ))}
          </nav>

          {/* Desktop search */}
          <div className="nav-search" style={{alignItems:'center',gap:7,background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:10,padding:'7px 12px',flex:1,maxWidth:220}}>
            <Search size={12} color="rgba(255,255,255,.6)" style={{flexShrink:0}}/>
            <input type="text" placeholder="Search…" value={searchQuery}
              onChange={e=>{setSearchQuery(e.target.value);if(e.target.value.length>1)switchSection('products')}}
              style={{background:'transparent',border:'none',color:'#fff',fontSize:12,outline:'none',flex:1,minWidth:0}}
            />
            {searchQuery && <button onClick={()=>setSearchQuery('')} style={{background:'none',border:'none',color:'rgba(255,255,255,.5)',cursor:'pointer',display:'flex'}}><X size={11}/></button>}
          </div>

          {/* Dark toggle + auth buttons (desktop) */}
          <DarkToggle/>
          <div className="nav-auth-btns" style={{gap:7,flexShrink:0}}>
            <button onClick={()=>openAuth('signin')} style={{padding:'7px 13px',borderRadius:9,border:'1.5px solid rgba(255,255,255,.3)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:12,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:5,minHeight:36}}>
              <User size={12}/> Sign In
            </button>
            <button onClick={()=>openAuth('register')} style={{padding:'7px 13px',borderRadius:9,border:'none',background:'linear-gradient(135deg,rgba(255,255,255,.9),rgba(224,231,255,.9))',color:'#0820c2',fontSize:12,fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',gap:5,boxShadow:'0 2px 8px rgba(0,0,0,.2)',minHeight:36}}>
              <UserPlus size={12}/> Register
            </button>
          </div>

          {/* Hamburger (mobile/tablet) */}
          <button className="nav-hamburger" onClick={()=>setMobileMenuOpen(o=>!o)} style={{display:'none',alignItems:'center',justifyContent:'center',width:40,height:40,borderRadius:9,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.15)',color:'#fff',cursor:'pointer',flexShrink:0}}>
            {mobileMenuOpen?<X size={18}/>:<Menu size={18}/>}
          </button>
        </div>

        {/* Accent line */}
        <div style={{height:2,background:'linear-gradient(90deg,transparent,rgba(96,165,250,.7),transparent)'}}/>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="anim-slideDown" style={{background:dark?'#050d1f':'#0820c2',borderTop:'1px solid rgba(255,255,255,.1)',padding:'8px 12px 16px'}}>
            {/* Search */}
            <div style={{display:'flex',alignItems:'center',gap:7,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:9,padding:'9px 12px',marginBottom:10}}>
              <Search size={13} color="rgba(255,255,255,.5)" style={{flexShrink:0}}/>
              <input type="text" placeholder="Search products…" value={searchQuery}
                onChange={e=>{setSearchQuery(e.target.value);if(e.target.value.length>1)switchSection('products')}}
                style={{background:'transparent',border:'none',color:'#fff',fontSize:14,outline:'none',flex:1}}
              />
            </div>
            {/* Nav links */}
            {NAV_ITEMS.map(nav=>(
              <button key={nav.key} onClick={()=>switchSection(nav.key)} style={{
                display:'flex',alignItems:'center',gap:10,width:'100%',padding:'12px 12px',borderRadius:9,border:'none',cursor:'pointer',
                background:activeSection===nav.key?'rgba(255,255,255,.12)':'transparent',
                color:activeSection===nav.key?'#fff':'rgba(255,255,255,.72)',
                fontSize:14,fontWeight:activeSection===nav.key?700:500,textAlign:'left',minHeight:46,
              }}>
                <span style={{color:activeSection===nav.key?'#60a5fa':'rgba(255,255,255,.5)'}}>{nav.icon}</span>
                {nav.label}
                {activeSection===nav.key && <span style={{marginLeft:'auto',width:6,height:6,borderRadius:'50%',background:'#60a5fa'}}/>}
              </button>
            ))}
            {/* Mobile auth buttons */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginTop:10,paddingTop:10,borderTop:'1px solid rgba(255,255,255,.1)'}}>
              <button onClick={()=>openAuth('signin')} style={{padding:'11px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.3)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,minHeight:44}}>
                <User size={14}/> Sign In
              </button>
              <button onClick={()=>openAuth('register')} style={{padding:'11px',borderRadius:10,border:'none',background:'linear-gradient(135deg,rgba(255,255,255,.92),rgba(224,231,255,.92))',color:'#0820c2',fontSize:13,fontWeight:800,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:5,minHeight:44}}>
                <UserPlus size={14}/> Register
              </button>
            </div>
            {/* Dark toggle in mobile menu */}
            <button onClick={toggleDark} style={{width:'100%',padding:'11px',marginTop:7,borderRadius:10,border:'1px solid rgba(255,255,255,.15)',background:'rgba(255,255,255,.05)',color:'rgba(255,255,255,.8)',fontSize:13,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7,minHeight:44}}>
              {dark?<><Sun size={14} color="#fbbf24"/> Switch to Light Mode</>:<><Moon size={14}/> Switch to Dark Mode</>}
            </button>
          </div>
        )}
      </div>

      {/* ════════════════ MAIN ════════════════ */}
      <main style={{flex:1}}>

        {/* ══ HOME ══ */}
        {activeSection==='home' && (
          <div className="anim-fadeIn">
            {/* Hero */}
            <div style={{position:'relative',overflow:'hidden',minHeight:'min(520px,80vw)'}}>
              <div style={{position:'absolute',inset:0,backgroundImage:`url(${Angkor})`,backgroundSize:'cover',backgroundPosition:'center'}}/>
              <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(3,8,40,.88) 0%,rgba(8,32,194,.65) 50%,rgba(3,105,161,.6) 100%)'}}/>
              {[...Array(10)].map((_,i)=>(
                <div key={i} className="particle" style={{width:Math.random()*3+2,height:Math.random()*3+2,background:i%2===0?'rgba(96,165,250,.7)':'rgba(255,255,255,.4)',left:`${Math.random()*100}%`,bottom:`${Math.random()*50}%`,'--dur':`${3+Math.random()*4}s`,'--delay':`${Math.random()*5}s`}}/>
              ))}

              <div className="hero-inner" style={{position:'relative',zIndex:2,maxWidth:1280,margin:'0 auto',padding:'var(--sp-2xl) var(--sp-lg)',display:'flex',alignItems:'center',gap:40,flexWrap:'wrap'}}>
                <div style={{flex:1,minWidth:'min(100%,280px)'}}>
                  {/* Badges */}
                  <div className="hero-badges" style={{display:'flex',flexWrap:'wrap',gap:7,marginBottom:18}}>
                    {[{icon:<Shield size={11}/>,label:'Secure checkout',c:'#93c5fd'},{icon:<Star size={11}/>,label:'4.8★ rated',c:'#fbbf24'},{icon:<Truck size={11}/>,label:'Free shipping $30+',c:'#6ee7b7'}].map((b,i)=>(
                      <span key={i} style={{display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:600,color:b.c,padding:'4px 10px',borderRadius:99,background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',backdropFilter:'blur(8px)'}}>{b.icon}{b.label}</span>
                    ))}
                  </div>

                  <h1 style={{fontSize:'clamp(24px,5vw,50px)',fontWeight:900,lineHeight:1.1,color:'#fff',marginBottom:10}}>
                    WELCOME TO<br/>
                    <span className="anim-neon" style={{color:'#60a5fa'}}>PSP MARKET</span>
                  </h1>
                  <p style={{fontSize:'clamp(13px,2.5vw,16px)',color:'rgba(255,255,255,.72)',fontWeight:400,marginBottom:24,maxWidth:420}}>
                    Your smart market in Cambodia — quality products, trusted sellers.
                  </p>

                  <div className="hero-stats" style={{display:'flex',gap:10,marginBottom:24,flexWrap:'wrap'}}>
                    {[['50K+','Customers'],['10K+','Products'],['4.8★','Rating']].map(([v,l],i)=>(
                      <div key={i} style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:12,padding:'9px 14px',textAlign:'center',backdropFilter:'blur(8px)',flex:'1 1 70px',minWidth:70}}>
                        <div style={{fontSize:'clamp(14px,3vw,18px)',fontWeight:900,color:'#60a5fa'}}>{v}</div>
                        <div style={{fontSize:10,color:'rgba(255,255,255,.6)',marginTop:2}}>{l}</div>
                      </div>
                    ))}
                  </div>

                  <div className="hero-cta" style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                    <button onClick={()=>openAuth('signin')} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,background:'linear-gradient(135deg,rgba(255,255,255,.95),rgba(224,231,255,.95))',color:'#0820c2',fontWeight:800,fontSize:13,padding:'11px 22px',borderRadius:11,border:'none',cursor:'pointer',boxShadow:'0 6px 20px rgba(0,0,0,.25)',transition:'all .2s',flex:'1 1 auto',minHeight:44}}>
                      <User size={14}/> Sign In <ArrowRight size={13}/>
                    </button>
                    <button onClick={()=>openAuth('register')} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,background:'linear-gradient(135deg,#0820c2,#1d4ed8)',color:'#fff',fontWeight:800,fontSize:13,padding:'11px 22px',borderRadius:11,border:'1.5px solid rgba(255,255,255,.2)',cursor:'pointer',boxShadow:'0 6px 20px rgba(8,32,194,.4)',transition:'all .2s',flex:'1 1 auto',minHeight:44}}>
                      <UserPlus size={14}/> Register <ArrowRight size={13}/>
                    </button>
                  </div>
                  <p style={{fontSize:10,color:'rgba(255,255,255,.4)',marginTop:8}}>Register free — get 15% off your first order</p>
                </div>

                {/* Hero logo */}
                <div className="hero-logo-wrap anim-float" style={{display:'none',flexShrink:0,justifyContent:'center'}}>
                  <div className="anim-glow" style={{width:'min(180px,40vw)',height:'min(180px,40vw)',borderRadius:'50%',overflow:'hidden',border:'3px solid rgba(96,165,250,.4)',boxShadow:'0 0 0 12px rgba(96,165,250,.07)'}}>
                    <img src={LOGO} alt="PSP MART" style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature highlights */}
            <div style={{background:'var(--bg-card)',borderBottom:'1px solid var(--border)',padding:'16px var(--sp-lg)'}}>
              <div className="feature-bar" style={{maxWidth:1280,margin:'0 auto',display:'grid',gap:12}}>
                {[{icon:<Truck size={16} color="#1d4ed8"/>,t:'Free Shipping',d:'On orders over $30'},{icon:<Shield size={16} color="#059669"/>,t:'Secure Payment',d:'256-bit SSL encryption'},{icon:<RefreshCw size={16} color="#7c3aed"/>,t:'Easy Returns',d:'30-day return policy'},{icon:<Headphones size={16} color="#f97316"/>,t:'24/7 Support',d:'Always here for you'}].map((f,i)=>(
                  <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'12px 14px',borderRadius:12,background:'var(--bg-base)',border:'1px solid var(--border)'}}>
                    <div style={{width:38,height:38,borderRadius:9,background:'var(--bg-card)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{f.icon}</div>
                    <div><p style={{fontSize:12,fontWeight:700,color:'var(--text-main)',margin:0}}>{f.t}</p><p style={{fontSize:10,color:'var(--text-muted)',margin:0}}>{f.d}</p></div>
                  </div>
                ))}
              </div>
            </div>

            <UserCommentSection/>
            <Foot/>
          </div>
        )}

        {/* ══ PRODUCTS ══ */}
        {activeSection==='products' && (
          <div className="anim-fadeIn page-pad" style={{maxWidth:1280,margin:'0 auto',padding:'28px var(--sp-lg)'}}>
            <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:20}}>
              <div>
                <h2 className="section-h2" style={{fontSize:22,fontWeight:800,color:'var(--text-main)',display:'flex',alignItems:'center',gap:7,margin:0}}>
                  <Package size={20} color="#1d4ed8"/> Products
                </h2>
                <p style={{fontSize:12,color:'var(--text-muted)',marginTop:3}}>Click any item to sign in & buy</p>
              </div>
            </div>

            {!searchResults && uniqueCategories.length>0 && (
              <div className="cat-pills" style={{display:'flex',gap:7,marginBottom:20,overflowX:'auto',paddingBottom:4,WebkitOverflowScrolling:'touch'}}>
                {uniqueCategories.map(cat=>{
                  const s=CATEGORY_STYLES[cat]||DEFAULT_STYLE; const active=activeCategory===cat;
                  return (
                    <button key={cat} onClick={()=>setActiveCategory(cat)} style={{display:'flex',alignItems:'center',gap:5,padding:'7px 14px',borderRadius:99,border:`1.5px solid ${active?'#3b82f6':'var(--border)'}`,background:active?'linear-gradient(135deg,#0820c2,#1d4ed8)':'var(--bg-card)',color:active?'#fff':'var(--text-muted)',fontSize:12,fontWeight:700,cursor:'pointer',boxShadow:active?'0 4px 14px rgba(29,78,216,.3)':'none',transition:'all .2s',whiteSpace:'nowrap',flexShrink:0,minHeight:36}}>
                      {s.emoji} {cat}
                    </button>
                  );
                })}
              </div>
            )}

            {searchResults && (
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14,flexWrap:'wrap'}}>
                <span style={{fontSize:13,color:'var(--text-main)'}}>Results for <strong>"{searchQuery}"</strong> — {searchResults.length} items</span>
                <button onClick={()=>setSearchQuery('')} style={{fontSize:11,color:'#3b82f6',background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:4,minHeight:32}}><X size={11}/> Clear</button>
              </div>
            )}

            {displayProducts.length>0 ? (
              <div className="products-grid" style={{display:'grid',gap:14}}>
                {displayProducts.map((p,i)=>(
                  <div key={p.id} className="anim-fadeUp" style={{animationDelay:`${i*.04}s`}}>
                    <PreLoginProductCard product={p} onProductClick={setSelectedProduct}/>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'50px 0',color:'var(--text-muted)'}}>
                <Package size={36} style={{margin:'0 auto 12px',opacity:.3}}/><p style={{fontSize:13}}>{searchResults?`No products match "${searchQuery}"`:'No products in this category yet.'}</p>
              </div>
            )}

            {/* CTA */}
            <div className="cta-banner-inner" style={{marginTop:28,background:'linear-gradient(135deg,#0820c2,#1d4ed8,#0369a1)',borderRadius:18,padding:'22px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:14,boxShadow:'0 8px 28px rgba(8,32,194,.3)'}}>
              <div>
                <p style={{fontWeight:800,fontSize:15,color:'#fff',margin:0}}>Want to see more products?</p>
                <p style={{color:'rgba(255,255,255,.7)',fontSize:12,marginTop:3,marginBottom:0}}>Sign in or create a free account.</p>
              </div>
              <button onClick={()=>openAuth('signin')} style={{padding:'10px 20px',borderRadius:11,border:'none',cursor:'pointer',background:'rgba(255,255,255,.9)',color:'#0820c2',fontWeight:800,fontSize:12,display:'flex',alignItems:'center',gap:6,flexShrink:0,minHeight:42,whiteSpace:'nowrap'}}>
                Sign in now <ArrowRight size={13}/>
              </button>
            </div>
            <Foot/>
          </div>
        )}

        {/* ══ DEALS ══ */}
        {activeSection==='deals' && (
          <div className="anim-fadeIn page-pad" style={{maxWidth:1280,margin:'0 auto',padding:'28px var(--sp-lg)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:20,flexWrap:'wrap'}}>
              <div>
                <h2 className="section-h2" style={{fontSize:22,fontWeight:800,color:'var(--text-main)',display:'flex',alignItems:'center',gap:7,margin:0}}>
                  <Tag size={20} color="#f97316"/> Today's Deals
                </h2>
                <p style={{fontSize:12,color:'var(--text-muted)',marginTop:3}}>Featured products — sign in to buy</p>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:'#ef4444',fontWeight:700,background:'#fef2f2',border:'1px solid #fecaca',padding:'6px 12px',borderRadius:99,whiteSpace:'nowrap'}}>
                <Clock size={12}/> Limited stock
              </div>
            </div>

            {allProducts.length>0 ? (
              <div className="deals-grid" style={{display:'grid',gap:16}}>
                {allProducts.slice(0,6).map((product,i)=>{
                  const grads=['linear-gradient(135deg,#f97316,#dc2626)','linear-gradient(135deg,#ec4899,#8b5cf6)','linear-gradient(135deg,#3b82f6,#06b6d4)','linear-gradient(135deg,#10b981,#0369a1)','linear-gradient(135deg,#f59e0b,#ef4444)','linear-gradient(135deg,#8b5cf6,#0820c2)'];
                  const s=CATEGORY_STYLES[product.category]||DEFAULT_STYLE;
                  return (
                    <div key={product.id} className="card card-hover anim-fadeUp" style={{overflow:'hidden',cursor:'pointer',animationDelay:`${i*.07}s`}} onClick={()=>setSelectedProduct(product)}>
                      <div style={{background:grads[i%6],padding:'20px 18px 16px',color:'#fff',position:'relative'}}>
                        <div style={{width:48,height:48,borderRadius:11,background:'rgba(255,255,255,.2)',overflow:'hidden',marginBottom:10,display:'flex',alignItems:'center',justifyContent:'center'}}>
                          {product.image?<img src={product.image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={e=>{e.target.style.display='none'}}/>:<span style={{fontSize:26}}>{s.emoji}</span>}
                        </div>
                        <p style={{fontWeight:800,fontSize:'clamp(13px,3vw,15px)',lineHeight:1.3,marginBottom:4}}>{product.name}</p>
                        <p className="lc2" style={{fontSize:11,color:'rgba(255,255,255,.75)',marginBottom:10}}>{product.description||product.category}</p>
                        <div style={{display:'flex',alignItems:'center',gap:8}}>
                          <span style={{fontSize:'clamp(18px,4vw,22px)',fontWeight:900}}>${Number(product.price||0).toFixed(2)}</span>
                          <span style={{marginLeft:'auto',background:'rgba(255,255,255,.2)',border:'1px solid rgba(255,255,255,.3)',fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:99,whiteSpace:'nowrap'}}>{product.category}</span>
                        </div>
                        <div style={{position:'absolute',bottom:8,right:10,fontSize:10,color:'rgba(255,255,255,.7)',background:'rgba(0,0,0,.2)',padding:'2px 8px',borderRadius:99}}>Sign in to buy →</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{textAlign:'center',padding:'50px 0',color:'var(--text-muted)'}}>
                <Package size={32} style={{margin:'0 auto 12px',opacity:.3}}/><p style={{fontSize:13}}>No deals yet.</p>
              </div>
            )}
            <Foot/>
          </div>
        )}

        {/* ══ OFFERS ══ */}
        {activeSection==='offers' && (
          <div className="anim-fadeIn page-pad" style={{maxWidth:1280,margin:'0 auto',padding:'28px var(--sp-lg)'}}>
            <div style={{textAlign:'center',marginBottom:28}}>
              <h2 className="section-h2" style={{fontSize:22,fontWeight:800,color:'var(--text-main)',display:'flex',alignItems:'center',justifyContent:'center',gap:7,margin:0}}>
                <Gift size={20} color="#ec4899"/> Special Offers
              </h2>
              <p style={{fontSize:12,color:'var(--text-muted)',marginTop:6}}>Exclusive deals for PSP MARKET shoppers — sign in to redeem</p>
            </div>
            <div className="offers-grid" style={{display:'grid',gap:16,marginBottom:32}}>
              {OFFERS_DATA.map((offer,i)=>(
                <div key={i} className="card anim-fadeUp" style={{overflow:'hidden',cursor:'pointer',transition:'transform .25s,box-shadow .25s',animationDelay:`${i*.08}s`}}
                  onClick={()=>openAuth('signin')}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='0 18px 45px rgba(0,0,0,.18)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=''}}
                >
                  <div style={{background:offer.gradient,padding:'20px 18px',color:'#fff'}}>
                    <div style={{fontSize:28,marginBottom:5}}>{offer.icon}</div>
                    <div style={{fontSize:'clamp(22px,5vw,28px)',fontWeight:900,letterSpacing:'-.02em'}}>{offer.discount}</div>
                    <div style={{fontSize:11,fontWeight:700,opacity:.8,marginTop:2}}>{offer.label}</div>
                    <p style={{fontSize:11,opacity:.65,marginTop:7,lineHeight:1.5,margin:'7px 0 0'}}>{offer.desc}</p>
                  </div>
                  <div style={{padding:'12px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'var(--bg-card)',gap:8}}>
                    <div style={{minWidth:0}}>
                      <p style={{fontSize:9,color:'var(--text-muted)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.1em',margin:0}}>Promo code</p>
                      <p style={{fontFamily:'monospace',fontWeight:900,color:'#1d4ed8',fontSize:14,letterSpacing:'.08em',marginTop:2,marginBottom:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{offer.code}</p>
                    </div>
                    <div style={{textAlign:'right',flexShrink:0}}>
                      <p style={{fontSize:10,color:'#ef4444',fontWeight:700,margin:0}}>{offer.expires}</p>
                      <button onClick={e=>{e.stopPropagation();navigator.clipboard?.writeText(offer.code).catch(()=>{})}} style={{marginTop:4,fontSize:10,background:'#eff6ff',border:'1px solid #bfdbfe',color:'#1d4ed8',fontWeight:700,padding:'4px 10px',borderRadius:7,cursor:'pointer',minHeight:28}}>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Foot/>
          </div>
        )}

        {/* ══ CONTACT ══ */}
        {activeSection==='contact' && (
          <div className="anim-fadeIn page-pad" style={{maxWidth:1280,margin:'0 auto',padding:'28px var(--sp-lg)'}}>
            <div style={{textAlign:'center',marginBottom:24}}>
              <h2 className="section-h2" style={{fontSize:22,fontWeight:800,color:'var(--text-main)',display:'flex',alignItems:'center',justifyContent:'center',gap:7,margin:0}}>
                <Phone size={20} color="#1d4ed8"/> Contact Us
              </h2>
              <p style={{fontSize:12,color:'var(--text-muted)',marginTop:6}}>We're here to help — reach out anytime</p>
            </div>

            <div className="contact-grid" style={{display:'grid',gap:12,marginBottom:28}}>
              {[
                {icon:'📞',title:'Phone',value:'+855 93 683 574',desc:'Mon–Sat, 8am–6pm',href:'tel:+85593683574',color:'#059669'},
                {icon:'📧',title:'Email',value:'sopheakp175@gmail.com',desc:'Reply within 24h',href:'mailto:sopheakp175@gmail.com',color:'#dc2626'},
                {icon:'📍',title:'Address',value:'Phnom Penh, Cambodia',desc:'Street 271, Toul Kork',href:'https://maps.app.goo.gl/5h1a7zihk76gWojYA',color:'#1d4ed8'},
                {icon:'✈️',title:'Telegram',value:'@pheaklove12',desc:'Chat instantly',href:'https://t.me/pheaklove12',color:'#0284c7'},
                {icon:'👤',title:'Facebook',value:'Phy Sopheak',desc:'Message us',href:'https://web.facebook.com/',color:'#1877F2'},
              ].map((c,i)=>(
                <a key={i} href={c.href} target={c.href.startsWith('http')?'_blank':'_self'} rel="noopener noreferrer"
                  className="card card-hover anim-fadeUp"
                  style={{display:'block',padding:'16px 12px',textAlign:'center',textDecoration:'none',animationDelay:`${i*.07}s`}}>
                  <div style={{fontSize:26,marginBottom:7}}>{c.icon}</div>
                  <p style={{fontWeight:700,fontSize:13,color:'var(--text-main)',marginBottom:2}}>{c.title}</p>
                  <p style={{fontSize:11,color:c.color,fontWeight:600,wordBreak:'break-all',marginBottom:2}}>{c.value}</p>
                  <p style={{fontSize:10,color:'var(--text-muted)'}}>{c.desc}</p>
                </a>
              ))}
            </div>

            {/* Contact form */}
            <div className="contact-form-wrap" style={{maxWidth:480,margin:'0 auto',background:'linear-gradient(135deg,#0820c2,#1d4ed8 70%,#0369a1)',borderRadius:20,padding:'24px 24px',boxShadow:'0 12px 40px rgba(8,32,194,.35)'}}>
              <h3 style={{fontWeight:800,color:'#fff',fontSize:15,marginBottom:18,textAlign:'center',margin:'0 0 16px'}}>Send us a message</h3>
              <form onSubmit={async(ev)=>{
                ev.preventDefault();
                const btn=ev.target.querySelector('button[type="submit"]');
                const orig=btn.innerHTML; btn.innerText='Sending…'; btn.disabled=true;
                const fd=new FormData(ev.target);
                fd.append('access_key','b6e4d480-6acd-4232-b023-3df1c7b31e3f');
                try {
                  const r=await fetch('https://api.web3forms.com/submit',{method:'POST',body:fd});
                  const d=await r.json();
                  if(d.success){alert('Message sent!');ev.target.reset();}else alert('Oops! Try again.');
                } catch{alert('Network error.');}
                finally{btn.innerHTML=orig;btn.disabled=false;}
              }} style={{display:'flex',flexDirection:'column',gap:10}}>
                {[['text','Your name','name'],['email','your@email.com','email']].map(([type,ph,nm])=>(
                  <input key={nm} type={type} name={nm} required placeholder={ph} style={{padding:'11px 13px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,outline:'none',minHeight:44}}/>
                ))}
                <textarea rows={3} name="message" required placeholder="How can we help you?" style={{padding:'11px 13px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'#fff',fontSize:13,outline:'none',resize:'vertical',minHeight:90}}/>
                <button type="submit" style={{padding:'12px',borderRadius:10,border:'1.5px solid rgba(255,255,255,.25)',background:'rgba(255,255,255,.12)',color:'#fff',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:7,minHeight:44}}>
                  <Mail size={14}/> Send Message
                </button>
              </form>
            </div>
            <Foot/>
          </div>
        )}

      </main>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INNER APP (post-login)
// ─────────────────────────────────────────────────────────────────────────────
function AppInner() {
  const { products } = useContext(ShopContext);
  const { dark } = useDark();

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
    const t = setTimeout(() => {
      setIsLoading(false); setIsLoggedIn(true);
      setUserRole(pendingRole); setEmail(pendingEmail);
      setUserId(pendingId); setUserAvatar(pendingAvatar);
      setView(pendingView);
    }, 2200);
    return () => clearTimeout(t);
  }, [isLoading]);

  const handleLogin = (role, userEmail, userName, id, avatar) => {
    setPendingRole(role); setPendingEmail(userEmail); setPendingName(userName);
    setPendingId(id); setPendingAvatar(avatar||null);
    setPendingView(role==='admin'?'admin-home':'shop-home');
    setLoginKey(k=>k+1); setIsLoading(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false); setUserRole(null); setEmail('');
    setUserId(null); setUserAvatar(null); setView('shop-home');
  };

  if (isLoading)   return <LoadingScreen role={pendingRole}/>;
  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} products={products}/>;

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-base)',color:'var(--text-main)',display:'flex',flexDirection:'column'}}>
      {!isAdminView && (
        <div style={{position:'relative'}}>
          <Navbar setView={setView} userRole={userRole} handleLogout={handleLogout} userEmail={email} userId={userId} userAvatarFromDB={userAvatar} loginKey={loginKey}/>
          <div style={{position:'absolute',top:14,right:160,display:'flex',alignItems:'center',gap:5,border:'1px solid var(--border)',padding:'3px 9px',borderRadius:7,fontSize:10,color:'var(--text-muted)'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',animation:'pulseGreen 1.5s ease-in-out infinite',display:'inline-block'}}/>
          </div>
        </div>
      )}
      <div style={{display:'flex',flex:1}}>
        {isAdminView && (
          <div style={{display:'flex',flexDirection:'column',background:'var(--bg-card)',minHeight:'100vh'}}>
            <div style={{
              padding:'0 16px',height:52,
              position:'fixed',top:0,left:0,right:0,zIndex:50,
              display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,
              background:dark?'rgba(8,15,42,.96)':'rgba(8,32,194,.97)',
              backdropFilter:'blur(12px)',boxShadow:'0 2px 12px rgba(0,0,0,.3)',
            }}>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <Shield size={15} color="#22c55e"/>
                <span className="admin-topbar-email" style={{fontSize:11,fontWeight:700,color:'rgba(255,255,255,.8)',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{email}</span>
              </div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <DarkToggle/>
                <button onClick={handleLogout} style={{padding:'6px 11px',background:'#7f1d1d',border:'1px solid #dc2626',borderRadius:8,color:'#fca5a5',cursor:'pointer',display:'flex',alignItems:'center',gap:5,fontSize:11,fontWeight:700,minHeight:34}}>
                  <LogOut size={13}/> Logout
                </button>
              </div>
            </div>
            <Sidebar setView={setView} currentView={view}/>
          </div>
        )}
        <main style={{flex:1,padding:'20px 16px',maxWidth:1280,margin:'0 auto',width:'100%'}}>
          {view==='shop-home'      && <Home setView={setView} setSelectedProductId={setSelectedProductId}/>}
          {view==='shop-detail'    && <ProductDetail productId={selectedProductId} setView={setView}/>}
          {view==='shop-cart'      && <Cart userEmail={email} userRole={userRole}/>}
          {view==='admin-home'     && <DashboardHome/>}
          {view==='admin-products' && <ManageProducts/>}
          {view==='admin-orders'   && <Orders/>}
          {view==='admin-graphic'  && <Graphic/>}
          {view==='admin-users'    && <Users/>}
          {view==='admin-checkout' && <Checkin/>}
          {view==='admin-evaluate' && <Evaloute/>}
          {view==='admin-telegram' && <TelegramDashboard userRole={userRole} userEmail={email}/>}
        </main>
      </div>
      <Foot/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DARK MODE PROVIDER
// ─────────────────────────────────────────────────────────────────────────────
function DarkModeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('psp_dark')==='1'; } catch { return false; }
  });
  useEffect(() => {
    document.body.classList.toggle('dark-mode', dark);
    try { localStorage.setItem('psp_dark',dark?'1':'0'); } catch {}
  }, [dark]);
  return (
    <DarkModeContext.Provider value={{ dark, toggleDark:()=>setDark(d=>!d) }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <DarkModeProvider>
      <StyleTag/>
      <ShopProvider>
        <AppInner/>
      </ShopProvider>
    </DarkModeProvider>
  );
}