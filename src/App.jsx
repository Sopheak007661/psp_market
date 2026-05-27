// import React, { useState } from 'react';
// import { ShopProvider } from './context/ShopContext';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import Foot from './components/Foot';
// import LOGO from './assets/BrandLogo.png'
// import Angkor from './assets/Angkor.png'

// // Authentication Icons
// import { Eye, EyeOff, Lock, Mail, Shield, User, LogOut } from 'lucide-react';

// // Pages
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

// export default function App() {
//   // ==========================================
//   // SET YOUR PERSONAL ADMIN LOGINS HERE
//   // ==========================================
//   const MY_ADMIN_EMAIL = "sopheakp175@gmail.com"; 
//   const MY_ADMIN_PASSWORD = "220927"; 

//   // Authentication State
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userRole, setUserRole] = useState(null); // 'admin' or 'user'
//   const [authPortal, setAuthPortal] = useState('user'); // Toggle panel: 'user' or 'admin'
//   const [isRegister, setIsRegister] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   // Core View Routing State
//   const [view, setView] = useState('shop-home'); 
//   const [selectedProductId, setSelectedProductId] = useState(null);

//   const isAdminView = view.startsWith('admin-');

//   // Handle Login Logic
//   const handleAuthSubmit = (e) => {
//     e.preventDefault();
//     setError('');

//     // 1. Basic Field Presence Check
//     if (!email || !password) {
//       setError('Please fill in all fields.');
//       return;
//     }

//     if (authPortal === 'admin') {
//       // STRICT ADMIN CONDITION
//       if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
//         setIsLoggedIn(true);
//         setUserRole('admin');
//         setView('admin-home'); // Auto redirect admin to their dashboard panel
//       } else {
//         setError('Access Denied: Only the primary administrator can log in here.');
//       }
//     } else {
//       // REGULAR CUSTOMER USER CONDITION WITH STRICT VALIDATION
      
//       // Email Regex Validation Rule
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         setError('Please enter a valid email address (e.g., user@example.com).');
//         return;
//       }

//       // Password Length Validation Rule 
//       if (password.length < 6) {
//         setError('Password must be at least 6 characters long.');
//         return;
//       }

//       // If validation passes, log them in
//       setIsLoggedIn(true);
//       setUserRole('user');
//       setView('shop-home'); // Auto redirect client to the storefront
//     }
//   };

//   // Handle Logout Logic
//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserRole(null);
//     setEmail('');
//     setPassword('');
//     setView('shop-home');
//   };

//   // =========================================================
//   // VIEW 1: IF NOT LOGGED IN -> RENDER THE AUTH SCREEN CARD
//   // =========================================================
//   if (!isLoggedIn) {
//     return (
//       <div className=" relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-slate-900">
        
//         {/* Injecting CSS Animation for the panning background directly */}
//         <style>{`
//           @keyframes slideBg {
//             0% { background-position: 0px 0px; }
//             100% { background-position: -1400px 0px; }
//           }
//           .moving-bg {
//             animation: slideBg 45s linear infinite;
//             background-size: cover;
//             background-repeat: repeat-x;
//           }
//         `}</style>

//         {/* Animated Background Overlay layer */}
//         <div 
//           className="absolute inset-0 moving-bg opacity-1 pointer-events-none"
//           style={{ 
//             // You can replace this URL placeholder with any high-resolution wallpaper link or shopping texture pattern!
//             backgroundImage: `url(${Angkor})`, 
//           }}
//         />
        
//         {/* Subtle Ambient Vignette Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/50 via-transparent to-green-800/50 pointer-events-none" />

//         {/* Form Container Card - relative z-10 puts it over the background layer */}
//         <div className="relative z-10 bg-black/70 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 font-sans backdrop-blur-sm">
          
//           {/* Logo / Brand Header */}
//           <div className="text-center mb-8">
//             <img 
//               src={LOGO}
//               alt="PSP MART Logo" 
//               className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-md object-cover"
//             />
//             <h2 className="text-4xl font-bold text-blue-800 tracking-tight">Welcome</h2>
//           </div>

//           {/* Segmented Control Panel Options */}
//           <div className="bg-white/50 p-1 rounded-xl flex mb-6">
//             <button
//               type="button"
//               onClick={() => { setAuthPortal('user'); setError(''); }}
//               className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
//                 authPortal === 'user' ? 'bg-blue-600 text-gray-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
//               }`}
//             >
//               <User size={16} />
//               User
//             </button>
//             <button
//               type="button"
//               onClick={() => { setAuthPortal('admin'); setError(''); setIsRegister(false); }}
//               className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
//                 authPortal === 'admin' ? 'bg-red-600 text-gray-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
//               }`}
//             >
//               <Shield size={16} />
//               Admin
//             </button>
//           </div>

//           {/* Error Message Display Area */}
//           {error && (
//             <div className="bg-red-50 text-red-600 border border-red-100 text-sm p-3 rounded-xl mb-4 text-center font-medium">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleAuthSubmit} className="space-y-4">
//             {/* Input Field: Email */}
//             <div className='text-start'>
//               <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
//                   <Mail size={18} />
//                 </span>
//                 <input
//                   type="email"
//                   placeholder={authPortal === 'admin' ? 'your-admin-email@example.com' : 'any-user@example.com'}
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
//                 />
//               </div>
//             </div>
            
//             {/* Input Field: Password */}
//             <div className='text-start '>
//               <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
//                   <Lock size={18} />
//                 </span>
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Action Button */}
//             <button
//               type="submit"
//               className={`w-full py-3 rounded-xl text-white font-medium text-sm transition shadow-sm mt-2 ${
//                 authPortal === 'admin' 
//                   ? 'bg-red-600 hover:bg-red-700 shadow-red-600/10' 
//                   : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10'
//               }`}
//             >
//               {authPortal === 'admin' ? 'Verify Secure Admin Identity' : (isRegister ? 'Register Account' : 'Sign In')}
//             </button>
//           </form>

//           {/* Dynamic Interface Bottom Meta Switchers */}
//           {authPortal === 'user' && (
//             <div className="text-center mt-6 pt-4 border-t border-slate-100">
//               <button
//                 onClick={() => { setIsRegister(!isRegister); setError(''); }}
//                 className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
//               >
//                 {isRegister ? "Already have an account? Sign In" : "New to PSP MART? Register an account instantly"}
//               </button>
//             </div>
//           )}

//           {authPortal === 'admin' && (
//             <div className="text-center mt-6 pt-4 border-t border-slate-100">
//               <p className="text-[11px] text-slate-400 font-medium tracking-wide">
//                 Private Admin Channel. Identity verification checks are strictly enforced.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // ============================================================
//   // VIEW 2: IF LOGGED IN -> ACCESS MAIN VIEWPORT & RESULTS LOG
//   // ============================================================
//   return (
//     <ShopProvider>
//       <div className="min-h-screen  pt-10 text-gray-800 tracking-tight flex flex-col">
        

//         {/* Render Customer Header Only on customer viewports */}
//         {!isAdminView && (
//           <div className="relative">
//             {/* Make sure ALL 3 props are right here! */}
//             <Navbar setView={setView} userRole={userRole} handleLogout={handleLogout} />
            
//             {/* Embedded Mini Session Toolbar for Logged In Customer profiles */}
//             <div className="absolute top-4 right-44 items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-3 rounded-lg text-xs">
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//               {/* <span className="text-slate-600 font-medium truncate max-w-[120px]">{email}</span> */}
//               {/* <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-semibold ml-1">
//                 Logout
//               </button> */}
//             </div>
//           </div>
//         )}

//         <div className="flex flex-1">
//           {/* Render Control Board Navigation Panel with dynamic logout inside Admin Viewports */}
//           {isAdminView && (
//             <div className=" flex flex-col md:flex md:flex-col bg-white text-white min-h-screen">
//               {/* Profile Bar directly inside Admin Side panel section area */}
//               <div className="p-4 border-b border-gray-800 flex absolute top-0 left-0 right-0 items-center justify-between gap-2 bg-green-800">
//                 <div className="flex items-center gap-2">
//                   <Shield size={16} className="text-red-400" />
//                   <span className="text-xs font-bold text-gray-300 truncate max-w-[100px]">{email}</span>
//                 </div>
//                 <button 
//                   onClick={handleLogout} 
//                   className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/50 rounded-lg text-red-400 transition" 
//                   title="Logout Session"
//                 >
//                   <LogOut size={14} />
//                 </button>
//               </div>
//               <Sidebar setView={setView} currentView={view} />
//             </div>
//           )}

//           {/* Main Context Stage: This acts as your direct div point where all page results log */}
//           <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
//             {view === 'shop-home' && <Home setView={setView} setSelectedProductId={setSelectedProductId} />}  
//             {view === 'shop-home' && <div><Foot /></div>}
//             {view === 'shop-detail' && <ProductDetail productId={selectedProductId} setView={setView} />}
//             {view === 'shop-cart' && <Cart userEmail={email} userRole={userRole} />}
//             {view === 'admin-home' && <DashboardHome />}
//             {view === 'admin-products' && <ManageProducts />}
//             {view === 'admin-orders' && <Orders />}
//             {view === 'admin-graphic' && <Graphic />}
//             {view === 'admin-users' && <Users />}
//             {view === 'admin-checkout' && <Checkin />}
//             {view === 'admin-evaluate' && <Evaloute />}
//             {view === 'admin-telegram' && <TelegramDashboard userRole={userRole} userEmail={email}/>}
//           </main>
//         </div>
//       </div>
//     </ShopProvider>
//   );
// }



















// import React, { useState, useEffect } from 'react';
// import { ShopProvider } from './context/ShopContext';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import Foot from './components/Foot';
// import LOGO from './assets/BrandLogo.png'
// import Angkor from './assets/Angkor.png'

// // Authentication Icons
// import { Eye, EyeOff, Lock, Mail, Shield, User, LogOut } from 'lucide-react';

// // Pages
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

// // ─────────────────────────────────────────────
// // LOADING SCREEN COMPONENT (5 spinning rings)
// // ─────────────────────────────────────────────
// function LoadingScreen({ role }) {
//   const [progress, setProgress] = useState(0);
//   const [fadeOut, setFadeOut] = useState(false);

//   useEffect(() => {
//     // Simulate progress 0 → 100 over ~1.8s
//     const interval = setInterval(() => {
//       setProgress(prev => {
//         if (prev >= 100) { clearInterval(interval); return 100; }
//         return prev + 2;
//       });
//     }, 36);
//     return () => clearInterval(interval);
//   }, []);

//   const isAdmin = role === 'admin';
//   const accentColor = isAdmin ? '#991b1b' : '#1e40af'; // red-800 for admin, blue-800 for user

//   return (
//     <div
//       style={{
//         position: 'fixed', inset: 0, zIndex: 9999,
//         background: '#0a0f1e',
//         display: 'flex', flexDirection: 'column',
//         alignItems: 'center', justifyContent: 'center',
//         opacity: fadeOut ? 0 : 1,
//         transition: 'opacity 0.6s ease',
//         fontFamily: "'Segoe UI', sans-serif",
//       }}
//     >
//       <style>{`
//         @keyframes spin-ring {
//           0%   { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//         @keyframes counter-spin {
//           0%   { transform: rotate(0deg); }
//           100% { transform: rotate(-360deg); }
//         }
//         @keyframes pulse-center {
//           0%, 100% { transform: scale(1); opacity: 1; }
//           50%       { transform: scale(1.12); opacity: 0.8; }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .ring { position: absolute; border-radius: 50%; border-style: solid; }
//       `}</style>

//       {/* ── 5 RINGS ── */}
//       <div style={{ position: 'relative', width: 220, height: 220, marginBottom: 48 }}>

//         {/* Ring 1 – outermost, slow */}
//         <div className="ring" style={{
//           width: 220, height: 220, top: 0, left: 0,
//           borderWidth: 3,
//           borderColor: `${accentColor}30 ${accentColor} ${accentColor}30 ${accentColor}`,
//           animation: 'spin-ring 3s linear infinite',
//         }} />

//         {/* Ring 2 – counter-rotate, dashed feel */}
//         <div className="ring" style={{
//           width: 185, height: 185, top: 17.5, left: 17.5,
//           borderWidth: 2.5,
//           borderColor: `${accentColor}15 ${accentColor}90 ${accentColor}15 ${accentColor}90`,
//           animation: 'counter-spin 2.2s linear infinite',
//         }} />

//         {/* Ring 3 – medium speed */}
//         <div className="ring" style={{
//           width: 152, height: 152, top: 34, left: 34,
//           borderWidth: 3,
//           borderColor: `${accentColor} ${accentColor}25 ${accentColor} ${accentColor}25`,
//           animation: 'spin-ring 1.8s linear infinite',
//         }} />

//         {/* Ring 4 – faster counter */}
//         <div className="ring" style={{
//           width: 118, height: 118, top: 51, left: 51,
//           borderWidth: 2,
//           borderColor: `${accentColor}60 ${accentColor}ff ${accentColor}60 ${accentColor}ff`,
//           animation: 'counter-spin 1.3s linear infinite',
//         }} />

//         {/* Ring 5 – innermost, fastest */}
//         <div className="ring" style={{
//           width: 86, height: 86, top: 67, left: 67,
//           borderWidth: 2.5,
//           borderColor: `${accentColor} transparent ${accentColor} transparent`,
//           animation: 'spin-ring 0.9s linear infinite',
//         }} />

//         {/* Center Logo / Icon */}
//         <div style={{
//           position: 'absolute', top: '38%', left: '39%',
//           transform: 'translate(-50%,-50%)',
//           width: 52, height: 52,
//           borderRadius: 14,
//           background: `${accentColor}22`,
//           border: `1.5px solid ${accentColor}60`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           animation: 'pulse-center 2s ease-in-out infinite',
//         }}>
//           {isAdmin
//             ? <Shield size={24} color={accentColor} />
//             : <User   size={24} color={accentColor} />
//           }
//         </div>
//       </div>

//       {/* ── Text ── */}
//       <div style={{ textAlign: 'center', animation: 'fadeUp 0.6s ease both' }}>
//         <p style={{
//           fontSize: 13, fontWeight: 700, letterSpacing: '0.22em',
//           color: `${accentColor}cc`, textTransform: 'uppercase', marginBottom: 6,
//         }}>
//           {isAdmin ? 'Admin Portal' : 'PSP MART'}
//         </p>
//         <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', marginBottom: 28, fontWeight: 400 }}>
//           {isAdmin ? 'Verifying secure session…' : 'Preparing your experience…'}
//         </p>

//         {/* Progress bar */}
//         <div style={{
//           width: 220, height: 3, borderRadius: 99,
//           background: 'rgba(255,255,255,0.07)',
//           overflow: 'hidden', margin: '0 auto',
//         }}>
//           <div style={{
//             height: '100%', borderRadius: 99,
//             background: `linear-gradient(90deg, ${accentColor}, ${isAdmin ? '#f87171' : '#60a5fa'})`,
//             width: `${progress}%`,
//             transition: 'width 0.1s linear',
//           }} />
//         </div>
//         <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>
//           {progress}%
//         </p>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // MAIN APP
// // ─────────────────────────────────────────────
// export default function App() {
//   const MY_ADMIN_EMAIL    = "sopheakp175@gmail.com";
//   const MY_ADMIN_PASSWORD = "220927";

//   const [isLoggedIn, setIsLoggedIn]             = useState(false);
//   const [userRole,   setUserRole]               = useState(null);
//   const [authPortal, setAuthPortal]             = useState('user');
//   const [isRegister, setIsRegister]             = useState(false);
//   const [email,      setEmail]                  = useState('');
//   const [password,   setPassword]               = useState('');
//   const [error,      setError]                  = useState('');
//   const [showPassword, setShowPassword]         = useState(false);

//   // ── NEW: loading state ──
//   const [isLoading,  setIsLoading]              = useState(false);
//   const [pendingRole, setPendingRole]           = useState(null);
//   const [pendingView, setPendingView]           = useState('shop-home');

//   const [view, setView]                         = useState('shop-home');
//   const [selectedProductId, setSelectedProductId] = useState(null);

//   const isAdminView = view.startsWith('admin-');

//   // When loading finishes (after 2s), go to the real app
//   useEffect(() => {
//     if (!isLoading) return;
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//       setIsLoggedIn(true);
//       setUserRole(pendingRole);
//       setView(pendingView);
//     }, 2200); // matches ring animation feel
//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   const handleAuthSubmit = (e) => {
//     e.preventDefault();
//     setError('');

//     if (!email || !password) { setError('Please fill in all fields.'); return; }

//     if (authPortal === 'admin') {
//       if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
//         setPendingRole('admin');
//         setPendingView('admin-home');
//         setIsLoading(true);
//       } else {
//         setError('Access Denied: Only the primary administrator can log in here.');
//       }
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email))   { setError('Please enter a valid email address.'); return; }
//       if (password.length < 6)       { setError('Password must be at least 6 characters long.'); return; }
//       setPendingRole('user');
//       setPendingView('shop-home');
//       setIsLoading(true);
//     }
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserRole(null);
//     setEmail('');
//     setPassword('');
//     setView('shop-home');
//   };

//   // ── LOADING SCREEN ──
//   if (isLoading) {
//     return <LoadingScreen role={pendingRole} />;
//   }

//   // ── AUTH SCREEN ──
//   if (!isLoggedIn) {
//     return (
//       <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-slate-900">
//         <style>{`
//           @keyframes slideBg {
//             0%   { background-position: 0px 0px; }
//             100% { background-position: -1400px 0px; }
//           }
//           .moving-bg {
//             animation: slideBg 45s linear infinite;
//             background-size: cover;
//             background-repeat: repeat-x;
//           }
//         `}</style>

//         <div
//           className="absolute inset-0 moving-bg opacity-1 pointer-events-none"
//           style={{ backgroundImage: `url(${Angkor})` }}
//         />
//         <div className="absolute inset-0 bg-gradient-to-tr from-blue-800/50 via-transparent to-green-800/50 pointer-events-none" />

//         <div className="relative z-10 bg-black/70 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 font-sans backdrop-blur-sm">
//           <div className="text-center mb-8">
//             <img src={LOGO} alt="PSP MART Logo" className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-md object-cover" />
//             <h2 className="text-4xl font-bold text-blue-800 tracking-tight">Welcome</h2>
//           </div>

//           <div className="bg-white/50 p-1 rounded-xl flex mb-6">
//             <button type="button" onClick={() => { setAuthPortal('user'); setError(''); }}
//               className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${authPortal === 'user' ? 'bg-blue-600 text-gray-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
//               <User size={16} /> User
//             </button>
//             <button type="button" onClick={() => { setAuthPortal('admin'); setError(''); setIsRegister(false); }}
//               className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${authPortal === 'admin' ? 'bg-red-600 text-gray-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
//               <Shield size={16} /> Admin
//             </button>
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-600 border border-red-100 text-sm p-3 rounded-xl mb-4 text-center font-medium">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleAuthSubmit} className="space-y-4">
//             <div className='text-start'>
//               <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={18} /></span>
//                 <input type="email"
//                   placeholder={authPortal === 'admin' ? 'your-admin-email@example.com' : 'any-user@example.com'}
//                   value={email} onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm" />
//               </div>
//             </div>

//             <div className='text-start'>
//               <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
//               <div className="relative">
//                 <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={18} /></span>
//                 <input type={showPassword ? "text" : "password"} placeholder="••••••••"
//                   value={password} onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm" />
//                 <button type="button" onClick={() => setShowPassword(!showPassword)}
//                   className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>

//             <button type="submit"
//               className={`w-full py-3 rounded-xl text-white font-medium text-sm transition shadow-sm mt-2 ${authPortal === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
//               {authPortal === 'admin' ? 'Verify Secure Admin Identity' : (isRegister ? 'Register Account' : 'Sign In')}
//             </button>
//           </form>

//           {authPortal === 'user' && (
//             <div className="text-center mt-6 pt-4 border-t border-slate-100">
//               <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
//                 className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
//                 {isRegister ? "Already have an account? Sign In" : "New to PSP MART? Register an account instantly"}
//               </button>
//             </div>
//           )}

//           {authPortal === 'admin' && (
//             <div className="text-center mt-6 pt-4 border-t border-slate-100">
//               <p className="text-[11px] text-slate-400 font-medium tracking-wide">
//                 Private Admin Channel. Identity verification checks are strictly enforced.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // ── MAIN APP ──
//   return (
//     <ShopProvider>
//       <div className="min-h-screen pt-10 text-gray-800 tracking-tight flex flex-col">
//         {!isAdminView && (
//           <div className="relative">
//             <Navbar setView={setView} userRole={userRole} handleLogout={handleLogout} />
//             <div className="absolute top-4 right-44 items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-3 rounded-lg text-xs">
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-1">
//           {isAdminView && (
//             <div className="flex flex-col md:flex md:flex-col bg-white text-white min-h-screen">
//               <div className="p-4 border-b border-gray-800 flex absolute top-0 left-0 right-0 items-center justify-between gap-2 bg-green-800">
//                 <div className="flex items-center gap-2">
//                   <Shield size={16} className="text-red-400" />
//                   <span className="text-xs font-bold text-gray-300 truncate max-w-[100px]">{email}</span>
//                 </div>
//                 <button onClick={handleLogout}
//                   className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/50 rounded-lg text-red-400 transition"
//                   title="Logout Session">
//                   <LogOut size={14} />
//                 </button>
//               </div>
//               <Sidebar setView={setView} currentView={view} />
//             </div>
//           )}

//           <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
//             {view === 'shop-home'      && <Home setView={setView} setSelectedProductId={setSelectedProductId} />}
//             {view === 'shop-home'      && <div><Foot /></div>}
//             {view === 'shop-detail'    && <ProductDetail productId={selectedProductId} setView={setView} />}
//             {view === 'shop-cart'      && <Cart userEmail={email} userRole={userRole} />}
//             {view === 'admin-home'     && <DashboardHome />}
//             {view === 'admin-products' && <ManageProducts />}
//             {view === 'admin-orders'   && <Orders />}
//             {view === 'admin-graphic'  && <Graphic />}
//             {view === 'admin-users'    && <Users />}
//             {view === 'admin-checkout' && <Checkin />}
//             {view === 'admin-evaluate' && <Evaloute />}
//             {view === 'admin-telegram' && <TelegramDashboard userRole={userRole} userEmail={email} />}
//           </main>
//         </div>
//       </div>
//     </ShopProvider>
//   );
// }






















// import React, { useState, useEffect } from 'react';
// import { ShopProvider } from './context/ShopContext';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import Foot from './components/Foot';
// import LOGO from './assets/BrandLogo.png';
// import Angkor from './assets/Angkor.png';

// // Authentication Icons
// import { Eye, EyeOff, Lock, Mail, Shield, User, LogOut, ShoppingBag, Tag, Truck, Headphones } from 'lucide-react';

// // Pages
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

// // ─────────────────────────────────────────────
// // LOADING SCREEN COMPONENT (5 spinning rings)
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
//       background: '#0a0f1e',
//       display: 'flex', flexDirection: 'column',
//       alignItems: 'center', justifyContent: 'center',
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
//           position: 'absolute', top: '38%', left: '39%',
//           transform: 'translate(-50%,-50%)',
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
//         <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{progress}%</p>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // LOGIN PAGE — looks like the home page
// // ─────────────────────────────────────────────
// function LoginPage({ onLogin }) {
//   const MY_ADMIN_EMAIL    = "sopheakp175@gmail.com";
//   const MY_ADMIN_PASSWORD = "220927";

//   const [authPortal,   setAuthPortal]   = useState('user');
//   const [isRegister,   setIsRegister]   = useState(false);
//   const [email,        setEmail]        = useState('');
//   const [password,     setPassword]     = useState('');
//   const [error,        setError]        = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setError('');
//     if (!email || !password) { setError('Please fill in all fields.'); return; }

//     if (authPortal === 'admin') {
//       if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
//         onLogin('admin', email);
//       } else {
//         setError('Access Denied: Only the primary administrator can log in here.');
//       }
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email))   { setError('Please enter a valid email address.'); return; }
//       if (password.length < 6)       { setError('Password must be at least 6 characters long.'); return; }
//       onLogin('user', email);
//     }
//   };

//   const features = [
//     { icon: <ShoppingBag size={20} />, title: 'Wide Selection', desc: 'Thousands of products at your fingertips' },
//     { icon: <Tag size={20} />,         title: 'Best Prices',    desc: 'Unbeatable deals every day' },
//     { icon: <Truck size={20} />,       title: 'Fast Delivery',  desc: 'Quick shipping to your door' },
//     { icon: <Headphones size={20} />,  title: '24/7 Support',   desc: 'Always here to help you' },
//   ];

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       {/* ── Navbar placeholder (same structure as your real Navbar) ── */}
//       {/* We render a lightweight top bar that looks like a navbar */}
//       <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <img src={LOGO} alt="PSP MART" className="w-9 h-9 rounded-xl object-cover shadow" />
//             <span className="text-lg font-bold text-blue-800 tracking-tight">PSP MART</span>
//           </div>
//           <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
//             <span className="text-blue-700 border-b-2 border-blue-600 pb-0.5 cursor-default">Home</span>
//             <span className="hover:text-blue-700 cursor-default transition">Products</span>
//             <span className="hover:text-blue-700 cursor-default transition">Deals</span>
//             <span className="hover:text-blue-700 cursor-default transition">Contact</span>
//           </nav>
//           <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
//             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
//             Online Store
//           </div>
//         </div>
//       </div>

//       {/* ── Hero / Main Content ── */}
//       <main className="flex-1">
//         {/* Hero banner */}
//         <div
//           className="relative overflow-hidden"
//           style={{
//             background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)',
//             minHeight: 320,
//           }}
//         >
//           <div
//             className="absolute inset-0 opacity-10"
//             style={{ backgroundImage: `url(${Angkor})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
//           />
//           <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-10">
//             {/* Left: welcome copy */}
//             <div className="flex-1 text-white">
//               <p className="text-blue-200 text-sm font-semibold tracking-widest uppercase mb-3">Welcome to</p>
//               <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
//                 PSP MART<br />
//                 <span className="text-blue-200">Your Smart Shop</span>
//               </h1>
//               <p className="text-blue-100 text-base leading-relaxed max-w-full text-left">
//                 Discover thousands of products with the best prices. Sign in to start shopping or manage your store.
//               </p>
//               <div className="flex flex-wrap gap-3 mt-6">
//                 {features.map((f, i) => (
//                   <div key={i} className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white backdrop-blur-sm">
//                     <span className="text-blue-200">{f.icon}</span>
//                     <span className="font-medium">{f.title}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right: Login Form */}
//             <div className="w-full md:w-[600px] flex-shrink-0">
//               <div className="bg-white rounded-2xl shadow-2xl border border-white/30 p-7">
//                 <div className="text-center mb-6">
//                   <img src={LOGO} alt="PSP MART Logo" className="w-12 h-12 rounded-xl mx-auto mb-2 shadow object-cover" />
//                   <h2 className="text-xl font-bold text-slate-800">Sign In to PSP MART</h2>
//                   <p className="text-xs text-slate-500 mt-1">Choose your portal below</p>
//                 </div>

//                 {/* Portal toggle */}
//                 <div className="bg-slate-100 p-1 rounded-xl flex mb-5">
//                   <button type="button" onClick={() => { setAuthPortal('user'); setError(''); }}
//                     className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5 ${authPortal === 'user' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
//                     <User size={14} /> User
//                   </button>
//                   <button type="button" onClick={() => { setAuthPortal('admin'); setError(''); setIsRegister(false); }}
//                     className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1.5 ${authPortal === 'admin' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
//                     <Shield size={14} /> Admin
//                   </button>
//                 </div>

//                 {error && (
//                   <div className="bg-red-50 text-red-600 border border-red-100 text-xs p-3 rounded-xl mb-4 text-center font-medium">
//                     {error}
//                   </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                   <div>
//                     <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
//                     <div className="relative">
//                       <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={16} /></span>
//                       <input type="email"
//                         placeholder={authPortal === 'admin' ? 'admin@example.com' : 'user@example.com'}
//                         value={email} onChange={(e) => setEmail(e.target.value)}
//                         className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm bg-slate-50" />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
//                     <div className="relative">
//                       <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={16} /></span>
//                       <input type={showPassword ? "text" : "password"} placeholder="••••••••"
//                         value={password} onChange={(e) => setPassword(e.target.value)}
//                         className="w-full pl-9 pr-10 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm bg-slate-50" />
//                       <button type="button" onClick={() => setShowPassword(!showPassword)}
//                         className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600">
//                         {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                     </div>
//                   </div>

//                   <button type="submit"
//                     className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition shadow-sm ${authPortal === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
//                     {authPortal === 'admin' ? 'Verify Admin Identity' : (isRegister ? 'Register Account' : 'Sign In')}
//                   </button>
//                 </form>

//                 {authPortal === 'user' && (
//                   <div className="text-center mt-4 pt-3 border-t border-slate-100">
//                     <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
//                       className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition">
//                       {isRegister ? "Already have an account? Sign In" : "New to PSP MART? Register instantly"}
//                     </button>
//                   </div>
//                 )}

//                 {authPortal === 'admin' && (
//                   <p className="text-center text-[11px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
//                     Private Admin Channel. Strictly enforced.
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Feature strip below hero */}
//         <div className="bg-white border-b border-slate-100 py-10">
//           <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
//             {features.map((f, i) => (
//               <div key={i} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition">
//                 <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">{f.icon}</div>
//                 <p className="font-semibold text-slate-800 text-sm">{f.title}</p>
//                 <p className="text-xs text-slate-500">{f.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>

//       {/* ── Footer ── */}
//       <Foot />
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // MAIN APP
// // ─────────────────────────────────────────────
// export default function App() {
//   const [isLoggedIn, setIsLoggedIn]   = useState(false);
//   const [userRole,   setUserRole]     = useState(null);
//   const [email,      setEmail]        = useState('');

//   const [isLoading,   setIsLoading]   = useState(false);
//   const [pendingRole, setPendingRole] = useState(null);
//   const [pendingEmail,setPendingEmail]= useState('');
//   const [pendingView, setPendingView] = useState('shop-home');

//   const [view,              setView]              = useState('shop-home');
//   const [selectedProductId, setSelectedProductId] = useState(null);

//   const isAdminView = view.startsWith('admin-');

//   // When loading finishes, enter the real app
//   useEffect(() => {
//     if (!isLoading) return;
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//       setIsLoggedIn(true);
//       setUserRole(pendingRole);
//       setEmail(pendingEmail);
//       setView(pendingView);
//     }, 2200);
//     return () => clearTimeout(timer);
//   }, [isLoading]);

//   const handleLogin = (role, userEmail) => {
//     setPendingRole(role);
//     setPendingEmail(userEmail);
//     setPendingView(role === 'admin' ? 'admin-home' : 'shop-home');
//     setIsLoading(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserRole(null);
//     setEmail('');
//     setView('shop-home');
//   };

//   // ── LOADING SCREEN ──
//   if (isLoading) return <LoadingScreen role={pendingRole} />;

//   // ── LOGIN PAGE (looks like home) ──
//   if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

//   // ── MAIN APP (unchanged) ──
//   return (
//     <ShopProvider>
//       <div className="min-h-screen pt-10 text-gray-800 tracking-tight flex flex-col">
//         {!isAdminView && (
//           <div className="relative">
//             <Navbar setView={setView} userRole={userRole} handleLogout={handleLogout} />
//             <div className="absolute top-4 right-44 items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-3 rounded-lg text-xs">
//               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//             </div>
//           </div>
//         )}

//         <div className="flex flex-1">
//           {isAdminView && (
//             <div className="flex flex-col md:flex md:flex-col bg-white text-white min-h-screen">
//               <div className="p-4 border-b border-gray-800 flex absolute top-0 left-0 right-0 items-center justify-between gap-2 bg-green-800">
//                 <div className="flex items-center gap-2">
//                   <Shield size={16} className="text-red-400" />
//                   <span className="text-xs font-bold text-gray-300 truncate max-w-[100px]">{email}</span>
//                 </div>
//                 <button onClick={handleLogout}
//                   className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/50 rounded-lg text-red-400 transition"
//                   title="Logout Session">
//                   <LogOut size={14} />
//                 </button>
//               </div>
//               <Sidebar setView={setView} currentView={view} />
//             </div>
//           )}

//           <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
//             {view === 'shop-home'      && <Home setView={setView} setSelectedProductId={setSelectedProductId} />}
//             {view === 'shop-home'      && <div><Foot /></div>}
//             {view === 'shop-detail'    && <ProductDetail productId={selectedProductId} setView={setView} />}
//             {view === 'shop-cart'      && <Cart userEmail={email} userRole={userRole} />}
//             {view === 'admin-home'     && <DashboardHome />}
//             {view === 'admin-products' && <ManageProducts />}
//             {view === 'admin-orders'   && <Orders />}
//             {view === 'admin-graphic'  && <Graphic />}
//             {view === 'admin-users'    && <Users />}
//             {view === 'admin-checkout' && <Checkin />}
//             {view === 'admin-evaluate' && <Evaloute />}
//             {view === 'admin-telegram' && <TelegramDashboard userRole={userRole} userEmail={email} />}
//           </main>
//         </div>
//       </div>
//     </ShopProvider>
//   );
// }




























import React, { useState, useEffect } from 'react';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Foot from './components/Foot';
import LOGO from './assets/BrandLogo.png';
import Angkor from './assets/Angkor.png';

import {
  Eye, EyeOff, Lock, Mail, Shield, User, LogOut,
  ShoppingBag, Tag, Truck, Headphones, UserPlus,
  Star, RefreshCw, CheckCircle, ArrowRight, X,
  Gift, Zap,
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

// ─────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────
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
      background: '#0a0f1e',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
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
          position: 'absolute', top: '38%', left: '39%',
          transform: 'translate(-50%,-50%)',
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
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 8 }}>{progress}%</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// GOOGLE ICON SVG
// ─────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// FACEBOOK ICON SVG
// ─────────────────────────────────────────────
function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const MY_ADMIN_EMAIL    = "sopheakp175@gmail.com";
  const MY_ADMIN_PASSWORD = "220927";

  // 'signin' | 'register' | 'admin'
  const [activeTab,    setActiveTab]    = useState('signin');
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [confirmPass,  setConfirmPass]  = useState('');
  const [name,         setName]         = useState('');
  const [rememberMe,   setRememberMe]   = useState(false);
  const [error,        setError]        = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [promoBanner,  setPromoBanner]  = useState(true);

  const switchTab = (tab) => { setActiveTab(tab); setError(''); setEmail(''); setPassword(''); setConfirmPass(''); setName(''); };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }

    if (activeTab === 'admin') {
      if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
        onLogin('admin', email);
      } else {
        setError('Access denied. Invalid admin credentials.');
      }
      return;
    }

    if (activeTab === 'register') {
      if (!name.trim()) { setError('Please enter your full name.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
      if (password !== confirmPass) { setError('Passwords do not match.'); return; }
      onLogin('user', email);
      return;
    }

    // signin
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    onLogin('user', email);
  };

  const reviews = [
    { initial: 'S', name: 'Sokha M.', color: 'bg-blue-500', text: '"Fast delivery and great quality. Best shop in Cambodia!"' },
    { initial: 'R', name: 'Ratanak P.', color: 'bg-emerald-500', text: '"Easy to use, prices are amazing. Will definitely order again!"' },
    { initial: 'D', name: 'Dara K.', color: 'bg-violet-500', text: '"Great customer support, resolved my issue in minutes."' },
  ];

  const features = [
    { icon: <Truck size={20} />, title: 'Free delivery', desc: 'Orders over $30', color: 'bg-blue-50 text-blue-600' },
    { icon: <RefreshCw size={20} />, title: 'Easy returns', desc: '30-day policy', color: 'bg-emerald-50 text-emerald-600' },
    { icon: <Star size={20} />, title: 'Rewards', desc: 'Earn points every buy', color: 'bg-amber-50 text-amber-600' },
    { icon: <CheckCircle size={20} />, title: 'Buyer protection', desc: '100% guarantee', color: 'bg-violet-50 text-violet-600' },
  ];

  const stats = [
    { value: '50K+', label: 'Happy customers' },
    { value: '10K+', label: 'Products' },
    { value: '4.8★', label: 'Avg. rating' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">

      {/* ── Promo Banner ── */}
      {promoBanner && (
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-2 px-4 flex items-center justify-center gap-3 text-xs font-medium relative">
          <Gift size={13} className="text-yellow-300 flex-shrink-0" />
          <span>
            🎉 New member deal — <strong>15% off</strong> your first order with code{' '}
            <span className="bg-white/20 px-2 py-0.5 rounded font-bold tracking-wide">WELCOME15</span>
          </span>
          <span className="ml-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full">Limited time</span>
          <button
            onClick={() => setPromoBanner(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition"
            aria-label="Dismiss promo"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Navbar ── */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="PSP MART" className="w-9 h-9 rounded-xl object-cover shadow" />
            <span className="text-lg font-bold text-blue-800 tracking-tight">PSP MART</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <span className="text-blue-700 border-b-2 border-blue-600 pb-0.5 cursor-default">Home</span>
            <span className="hover:text-blue-700 cursor-default transition">Products</span>
            <span className="hover:text-blue-700 cursor-default transition">Deals</span>
            <span className="hover:text-blue-700 cursor-default transition">Contact</span>
          </nav>
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
            Online Store
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 55%, #0369a1 100%)', minHeight: 380 }}
        >
          {/* Angkor watermark */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: `url(${Angkor})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-start gap-10">

            {/* ── Left: Copy + Social Proof ── */}
            <div className="flex-1 text-white">
              {/* Badges row */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="flex items-center gap-1 text-xs font-medium bg-white/10 border border-white/20 rounded-full px-3 py-1 text-blue-200">
                  <Shield size={11} /> Secure checkout
                </span>
                <span className="flex items-center gap-1 text-xs font-medium bg-white/10 border border-white/20 rounded-full px-3 py-1 text-blue-200">
                  <Star size={11} /> 4.8★ rated
                </span>
                <span className="flex items-center gap-1 text-xs font-medium bg-white/10 border border-white/20 rounded-full px-3 py-1 text-green-300">
                  <Truck size={11} /> Free shipping $30+
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-3 text-left">
                PSP MART<br />
                <span className="text-blue-200 font-normal text-2xl md:text-3xl">Your smart shop in Cambodia</span>
              </h1>
              <p className="text-blue-100 text-sm leading-relaxed max-w-md mb-6 text-left flex items-center gap-2">
                Thousands of products, unbeatable prices, delivered fast. Join 50,000+ happy customers today.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6 max-w-xs">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white/10 border border-white/15 rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[10px] text-blue-300 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Customer reviews */}
              <div className="flex flex-col gap-2 max-w-sm">
                {reviews.map((r, i) => (
                  <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-full ${r.color} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0`}>
                        {r.initial}
                      </div>
                      <span className="text-xs font-semibold text-slate-200">{r.name}</span>
                      <span className="text-yellow-400 text-[11px]">★★★★★</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Auth Card ── */}
            <div className="w-full lg:w-[520px] flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden">

                {/* Card header */}
                <div className="px-6 pt-6 pb-0 text-center">
                  <img src={LOGO} alt="PSP MART Logo" className="w-11 h-11 rounded-xl mx-auto mb-2 shadow object-cover" />
                  <h2 className="text-lg font-bold text-slate-800">
                    {activeTab === 'signin'   && 'Welcome back 👋'}
                    {activeTab === 'register' && 'Create your account'}
                    {activeTab === 'admin'    && 'Admin Access Only'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 mb-4">
                    {activeTab === 'signin'   && 'Sign in to see your orders, wishlist & deals'}
                    {activeTab === 'register' && 'Join 50,000+ happy PSP MART shoppers'}
                    {activeTab === 'admin'    && 'Restricted to authorised personnel only'}
                  </p>
                </div>

                {/* Three-tab toggle */}
                <div className="px-6 mb-4">
                  <div className="bg-slate-100 p-1 rounded-xl flex gap-0.5">
                    <button
                      type="button"
                      onClick={() => switchTab('signin')}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${activeTab === 'signin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <User size={12} /> Sign in
                    </button>
                    <button
                      type="button"
                      onClick={() => switchTab('register')}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${activeTab === 'register' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <UserPlus size={12} /> Register
                    </button>
                    <button
                      type="button"
                      onClick={() => switchTab('admin')}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${activeTab === 'admin' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Shield size={12} /> Admin
                    </button>
                  </div>
                </div>

                <div className="px-6 pb-6">

                  {/* Social login (not for admin) */}
                  {activeTab !== 'admin' && (
                    <>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          <GoogleIcon /> Google
                        </button>
                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                        >
                          <FacebookIcon /> Facebook
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-[10px] text-slate-400 font-medium">or continue with email</span>
                        <div className="flex-1 h-px bg-slate-200" />
                      </div>
                    </>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 text-red-600 border border-red-100 text-xs p-2.5 rounded-xl mb-3 text-center font-medium">
                      {error}
                    </div>
                  )}

                  {/* New member promo reminder (register tab) */}
                  {activeTab === 'register' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-3 flex items-start gap-2">
                      <Zap size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-700 leading-snug">
                        Register now and use <strong>WELCOME15</strong> at checkout for 15% off your first order!
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-3">

                    {/* Full name (register only) */}
                    {activeTab === 'register' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full name</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User size={14} /></span>
                          <input
                            type="text"
                            placeholder="Your full name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          />
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email address</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={14} /></span>
                        <input
                          type="email"
                          placeholder={activeTab === 'admin' ? 'admin@example.com' : 'your@email.com'}
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
                        {activeTab === 'signin' && (
                          <button type="button" className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold transition">
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={14} /></span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                          className="w-full pl-8 pr-9 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm password (register only) */}
                    {activeTab === 'register' && (
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm password</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={14} /></span>
                          <input
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="••••••••"
                            value={confirmPass}
                            onChange={e => setConfirmPass(e.target.value)}
                            className="w-full pl-8 pr-9 py-2.5 border border-slate-200 rounded-xl text-slate-800 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Remember me (signin only) */}
                    {activeTab === 'signin' && (
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="w-3.5 h-3.5 rounded accent-blue-600"
                        />
                        <span className="text-xs text-slate-500">Remember me on this device</span>
                      </label>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      className={`w-full py-2.5 rounded-xl text-white font-semibold text-sm transition shadow-sm flex items-center justify-center gap-2 ${activeTab === 'admin' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                      {activeTab === 'signin'   && <><User size={14} /> Sign in to PSP MART</>}
                      {activeTab === 'register' && <><UserPlus size={14} /> Create my account</>}
                      {activeTab === 'admin'    && <><Shield size={14} /> Verify admin identity</>}
                      <ArrowRight size={14} />
                    </button>
                  </form>

                  {/* Browse as guest */}
                  {activeTab !== 'admin' && (
                    <>
                      <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 h-px bg-slate-200" />
                        <span className="text-[10px] text-slate-400 font-medium">or</span>
                        <div className="flex-1 h-px bg-slate-200" />
                      </div>
                      <button
                        type="button"
                        onClick={() => onLogin('guest', 'guest')}
                        className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                      >
                        <Eye size={14} /> Browse as guest
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-2">
                        Guest accounts can't save carts or track orders.
                      </p>
                    </>
                  )}

                  {/* Trust badges */}
                  {activeTab !== 'admin' && (
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                          <Shield size={15} className="text-green-600" />
                        </div>
                        <span className="text-[9px] text-slate-500 leading-tight">Secure & safe</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <Lock size={15} className="text-blue-600" />
                        </div>
                        <span className="text-[9px] text-slate-500 leading-tight">Data protected</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 text-center">
                        <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                          <Headphones size={15} className="text-violet-600" />
                        </div>
                        <span className="text-[9px] text-slate-500 leading-tight">24/7 support</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'admin' && (
                    <p className="text-center text-[10px] text-slate-400 mt-4 pt-3 border-t border-slate-100">
                      Private admin channel. All access attempts are logged.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Feature strip ── */}
        <div className="bg-white border-b border-slate-100 py-8">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition cursor-default">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.color}`}>
                  {f.icon}
                </div>
                <p className="font-semibold text-slate-800 text-sm">{f.title}</p>
                <p className="text-xs text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Category preview strip ── */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Shop by category</h2>
              <p className="text-xs text-slate-500 mt-0.5">Sign in to browse our full catalogue</p>
            </div>
            <button
              onClick={() => onLogin('guest', 'guest')}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              Browse all <ArrowRight size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Electronics', emoji: '📱', bg: 'from-blue-100 to-blue-50', text: 'text-blue-700' },
              { label: 'Fashion',     emoji: '👗', bg: 'from-pink-100 to-pink-50',  text: 'text-pink-700' },
              { label: 'Home & Living', emoji: '🏠', bg: 'from-amber-100 to-amber-50', text: 'text-amber-700' },
              { label: 'Sports',      emoji: '⚽', bg: 'from-green-100 to-green-50', text: 'text-green-700' },
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => onLogin('guest', 'guest')}
                className={`bg-gradient-to-br ${cat.bg} rounded-2xl p-6 flex flex-col items-center gap-3 hover:scale-[1.02] transition-transform cursor-pointer border border-white shadow-sm`}
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className={`text-sm font-semibold ${cat.text}`}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>

      <Foot />
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [isLoggedIn,        setIsLoggedIn]        = useState(false);
  const [userRole,          setUserRole]           = useState(null);
  const [email,             setEmail]              = useState('');
  const [isLoading,         setIsLoading]          = useState(false);
  const [pendingRole,       setPendingRole]        = useState(null);
  const [pendingEmail,      setPendingEmail]       = useState('');
  const [pendingView,       setPendingView]        = useState('shop-home');
  const [view,              setView]               = useState('shop-home');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const isAdminView = view.startsWith('admin-');

  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
      setUserRole(pendingRole);
      setEmail(pendingEmail);
      setView(pendingView);
    }, 2200);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleLogin = (role, userEmail) => {
    setPendingRole(role);
    setPendingEmail(userEmail);
    setPendingView(role === 'admin' ? 'admin-home' : 'shop-home');
    setIsLoading(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setEmail('');
    setView('shop-home');
  };

  if (isLoading)   return <LoadingScreen role={pendingRole} />;
  if (!isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <ShopProvider>
      <div className="min-h-screen pt-10 text-gray-800 tracking-tight flex flex-col">
        {!isAdminView && (
          <div className="relative">
            <Navbar setView={setView} userRole={userRole} handleLogout={handleLogout} />
            <div className="absolute top-4 right-44 items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-3 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
          </div>
        )}

        <div className="flex flex-1">
          {isAdminView && (
            <div className="flex flex-col md:flex md:flex-col bg-white text-white min-h-screen">
              <div className="p-4 border-b border-gray-800 flex absolute top-0 left-0 right-0 items-center justify-between gap-2 bg-green-800">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-red-400" />
                  <span className="text-xs font-bold text-gray-300 truncate max-w-[100px]">{email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-red-950/40 hover:bg-red-900 border border-red-900/50 rounded-lg text-red-400 transition"
                  title="Logout Session"
                >
                  <LogOut size={14} />
                </button>
              </div>
              <Sidebar setView={setView} currentView={view} />
            </div>
          )}

          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            {view === 'shop-home'      && <Home setView={setView} setSelectedProductId={setSelectedProductId} />}
            {view === 'shop-home'      && <div><Foot /></div>}
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
      </div>
    </ShopProvider>
  );
}