import React, { useState } from 'react';
import { ShopProvider } from './context/ShopContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Foot from './components/Foot';

// Authentication Icons
import { Eye, EyeOff, Lock, Mail, Shield, User, LogOut } from 'lucide-react';

// Pages
import Home from './pages/ClientShop/Home';
import ProductDetail from './pages/ClientShop/ProductDetail';
import Cart from './pages/ClientShop/Cart';
import DashboardHome from './pages/AdminDashboard/DashboardHome';
import ManageProducts from './pages/AdminDashboard/ManageProducts';
import Orders from './pages/AdminDashboard/Orders';

export default function App() {
  // ==========================================
  // SET YOUR PERSONAL ADMIN LOGINS HERE
  // ==========================================
  const MY_ADMIN_EMAIL = "sopheakp175@gmail.com"; 
  const MY_ADMIN_PASSWORD = "220927"; 

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'user'
  const [authPortal, setAuthPortal] = useState('user'); // Toggle panel: 'user' or 'admin'
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Core View Routing State
  const [view, setView] = useState('shop-home'); 
  const [selectedProductId, setSelectedProductId] = useState(null);

  const isAdminView = view.startsWith('admin-');

  // Handle Login Logic
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (authPortal === 'admin') {
      // STRICT ADMIN CONDITION
      if (email === MY_ADMIN_EMAIL && password === MY_ADMIN_PASSWORD) {
        setIsLoggedIn(true);
        setUserRole('admin');
        setView('admin-home'); // Auto redirect admin to their dashboard panel
      } else {
        setError('Access Denied: Only the primary administrator can log in here.');
      }
    } else {
      // REGULAR CUSTOMER USER CONDITION (No rules, auto log-in)
      setIsLoggedIn(true);
      setUserRole('user');
      setView('shop-home'); // Auto redirect client to the storefront
    }
  };

  // Handle Logout Logic
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setEmail('');
    setPassword('');
    setView('shop-home');
  };

  // =========================================================
  // VIEW 1: IF NOT LOGGED IN -> RENDER THE AUTH SCREEN CARD
  // =========================================================
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 font-sans">
          
          {/* Logo / Brand Header */}
          <div className="text-center mb-8">
            <img 
              src="https://img.sanishtech.com/u/d95b31313e8c668b3349dd86557f3288.jpg" 
              alt="PSP MART Logo" 
              className="w-16 h-16 rounded-2xl mx-auto mb-3 shadow-md object-cover"
            />
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Welcome to PSP MART</h2>
            <p className="text-sm text-slate-500 mt-1">Select your access portal below</p>
          </div>

          {/* Segmented Control Panel Options */}
          <div className="bg-slate-100 p-1 rounded-xl flex mb-6">
            <button
              type="button"
              onClick={() => { setAuthPortal('user'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                authPortal === 'user' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <User size={16} />
              User Portal
            </button>
            <button
              type="button"
              onClick={() => { setAuthPortal('admin'); setError(''); setIsRegister(false); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 ${
                authPortal === 'admin' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield size={16} />
              Admin Portal
            </button>
          </div>

          {/* Error Message Display Area */}
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-100 text-sm p-3 rounded-xl mb-4 text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {/* Input Field: Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder={authPortal === 'admin' ? 'your-admin-email@example.com' : 'any-user@example.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                />
              </div>
            </div>
            
            {/* Input Field: Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-white font-medium text-sm transition shadow-sm mt-2 ${
                authPortal === 'admin' 
                  ? 'bg-red-600 hover:bg-red-700 shadow-red-600/10' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/10'
              }`}
            >
              {authPortal === 'admin' ? 'Verify Secure Admin Identity' : (isRegister ? 'Register Account' : 'Sign In')}
            </button>
          </form>

          {/* Dynamic Interface Bottom Meta Switchers */}
          {authPortal === 'user' && (
            <div className="text-center mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                {isRegister ? "Already have an account? Sign In" : "New to PSP MART? Register an account instantly"}
              </button>
            </div>
          )}

          {authPortal === 'admin' && (
            <div className="text-center mt-6 pt-4 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Private Admin Channel. Identity verification checks are strictly enforced.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================
  // VIEW 2: IF LOGGED IN -> ACCESS MAIN VIEWPORT & RESULTS LOG
  // ============================================================
  return (
    <ShopProvider>
      <div className="min-h-screen bg-white text-gray-800 tracking-tight flex flex-col">
        

        {/* Render Customer Header Only on customer viewports */}
        {!isAdminView && (
          <div className="relative">
            {/* Make sure ALL 3 props are right here! */}
            <Navbar setView={setView} userRole={userRole} handleLogout={handleLogout} />
            
            {/* Embedded Mini Session Toolbar for Logged In Customer profiles */}
            <div className="absolute top-4 right-44 hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 py-1 px-3 rounded-lg text-xs">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-slate-600 font-medium truncate max-w-[120px]">{email}</span>
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 font-semibold ml-1">
                Logout
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-1">
          {/* Render Control Board Navigation Panel with dynamic logout inside Admin Viewports */}
          {isAdminView && (
            <div className="flex flex-col bg-gray-900 text-white min-h-screen">
              {/* Profile Bar directly inside Admin Side panel section area */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between gap-2 bg-gray-950">
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

          {/* Main Context Stage: This acts as your direct div point where all page results log */}
          <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
            {view === 'shop-home' && <Home setView={setView} setSelectedProductId={setSelectedProductId} />}
            {view === 'shop-home' && <div><Foot /></div>}
            {view === 'shop-detail' && <ProductDetail productId={selectedProductId} setView={setView} />}
            {view === 'shop-cart' && <Cart />}
            {view === 'admin-home' && <DashboardHome />}
            {view === 'admin-products' && <ManageProducts />}
            {view === 'admin-orders' && <Orders />}
          </main>
        </div>
      </div>
    </ShopProvider>
  );
}