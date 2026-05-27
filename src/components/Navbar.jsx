// import React, { useContext } from 'react';
// import { ShopContext } from '../context/ShopContext';
// import BrandLogo from '../assets/BrandLogo.png';
// import { ShoppingCart, LayoutDashboard, Store, Search, X, LogOut } from 'lucide-react';

// // Added handleLogout prop alongside setView and userRole
// export default function Navbar({ setView, userRole, handleLogout }) {
//   const { cart, searchTerm, setSearchTerm } = useContext(ShopContext);
//   const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

//   return (
//     <section className='pb-20'>
//       <nav  className="fixed top-0  left-0 right-0 z-50 bg-blue-800 border-b border-gray-100 shadow-sm">
//             <div className='px-8 h-16 flex justify-between items-center gap-4'>
              
//               {/* Brand Logo */}
//               <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => setView('shop-home')}>
//                 {/* <Store className="h-6 w-6 text-green-100" /> */}
//                 <img src={BrandLogo} herf="logo" className='w-[100px] h-[100px] rounded-[20px] p-5'></img>
//                 <span className="text-xl font-black tracking-tight text-green-600">PSP</span>
//               </div>

//               {/* 🔍 Search Input Bar */}
//               <div className="hidden max-w-md mx-4 md:flex md:flex-1">
//                 <div className="relative w-full">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Search className="h-4 w-4 text-blue-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search products..."
//                     value={searchTerm}
//                     onChange={(e) => {
//                       setSearchTerm(e.target.value);
//                       setView('shop-home'); // Redirect back to store grid instantly upon typing
//                     }}
//                     className="w-full pl-10 pr-10 py-1.5 bg-blue-800 border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-green-500 block outline-none transition-all duration-200 focus:bg-white"
//                   />
//                   {searchTerm && (
//                     <button 
//                       onClick={() => setSearchTerm('')}
//                       className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Navigation Actions */}
//               <div className="flex items-center space-x-6 flex-shrink-0">
//                 <button onClick={() => setView('shop-home')} className="hidden md:flex text-green-600 hover:text-blue-600 font-medium transition">MARKET</button>
                
//                 <button onClick={() => setView('shop-cart')} className="relative p-2 text-green-600 hover:text-blue-600 transition">
//                   <ShoppingCart className="h-5 w-5" />
//                   {totalItems > 0 && (
//                     <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
//                       {totalItems}
//                     </span>
//                   )}
//                 </button>

//                 {/* CONDITION: Hidden for standard customers, visible only when logged in as admin */}
//                 {userRole === 'admin' && (
//                   <button onClick={() => setView('admin-home')} className="flex items-center space-x-1.5 bg-green-800 text-white px-4 py-2 text-xs font-semibold hover:bg-blue-500 transition hidden md:flex" >
//                     <LayoutDashboard className="h-4 w-4" />
//                     <span>Admin</span>
//                   </button>
//                 )}

//                 {/* OPTION: Logout button specifically targeting standard users */}
//                   {userRole === 'user' && (
//                     <button 
//                       onClick={() => {
//                         if (handleLogout) handleLogout();
//                       }} 
//                       className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-700 transition rounded-lg"
//                       title="Logout Account"
//                     >
//                       <LogOut className="h-3.5 w-3.5" />
//                       <span>Logout</span>
//                     </button>
//                   )}

//               </div>

//             </div>

//       </nav>
//     </section>
//   );
// }











import React, { useContext, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import BrandLogo from '../assets/BrandLogo.png';
// Added Settings, Moon, Sun, and LogIn to your lucide-react imports
import { ShoppingCart, LayoutDashboard, Store, Search, X, LogOut, Settings,Menu, Moon, Sun, LogIn } from 'lucide-react';

export default function Navbar({ setView, userRole, handleLogout }) {
  const { cart, searchTerm, setSearchTerm } = useContext(ShopContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 1. Local states to manage settings dropdown and theme tracking
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 2. Direct DOM handler to force the index.html <body> background color change
  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);

    if (nextMode) {
      document.body.style.backgroundColor = '#0f172a'; // Tailwind's dark slate-900
      document.body.style.color = '#f8fafc';           // Slate-50 light text
    } else {
      document.body.style.backgroundColor = '#ffffff'; // Revert back to white background
      document.body.style.color = '#1f2937';           // Gray-800 dark text
    }
  };

  return (
    <section className='pb-20'>
      {/* Dynamic navbar colors depending on mode selection */}
      <nav className={`fixed top-0 left-0 right-0 z-50 border-b shadow-sm transition-colors duration-300
        ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-800 border-gray-100'}`}
      >
        <div className='px-8 h-16 flex justify-between items-center gap-4'>
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => setView('shop-home')}>
            <img src={BrandLogo} alt="logo" className='w-[100px] h-[100px] rounded-[100px] p-5' />
            {/* <span className="text-xl font-black tracking-tight text-green-600">PSP</span> */}
          </div>

          {/* 🔍 Search Input Bar */}
          <div className="hidden max-w-md mx-4 md:flex md:flex-1">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-blue-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setView('shop-home'); 
                }}
                className={`w-full pl-10 pr-10 py-1.5 border text-sm outline-none transition-all duration-200 block rounded
                  ${isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:bg-slate-600' 
                    : 'bg-blue-800 border-gray-200 text-gray-900 focus:bg-white'}`}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-6 flex-shrink-0">
            {/* <button onClick={() => setView('shop-home')} className="hidden md:flex text-green-600 hover:text-blue-600 font-medium transition">MARKET</button> */}
            
            <button onClick={() => setView('shop-cart')} className="relative p-2 text-green-600 hover:text-blue-600 transition">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* CONDITION: Visible only when logged in as admin */}
            {userRole === 'admin' && (
              <button onClick={() => setView('admin-home')} className="flex items-center space-x-1.5 bg-green-800 text-white   rounded-full text-xl font-semibold hover:bg-blue-500 transition hidden md:flex" >
                <LayoutDashboard className="h-4 w-4" />
                {/* <span>Admin</span> */}
              </button>
            )}

            {/* OPTION: Logout button targeting standard users */}
            {userRole === 'user' && (
              <button 
                onClick={() => { if (handleLogout) handleLogout(); }} 
                className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-700 transition rounded-lg hidden md:flex"
                title="Logout Account"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Logout</span>
              </button>
            )}

            {/* --- NEW: Settings Dropdown Button & Menu Container --- */}
            {/* --- Settings Dropdown --- */}
            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 text-green-600 hover:text-blue-600 transition focus:outline-none"
                title="Settings Menu"
              >
                {/* <Settings className={`h-5 w-5 transition-transform duration-200 ${isSettingsOpen ? 'rotate-45' : ''}`} /> */}
                <Menu className={`h-5 w-5 transition-transform duration-200 ${isSettingsOpen ? 'rotate-90' : ''}`} />
              </button>

              {isSettingsOpen && (
                <div className={`absolute right-0 mt-2 w-60 border rounded-lg shadow-xl py-2 z-50 transition-colors duration-200
                  ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>

                  {/* ── Menu ── */}
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu</div>

                  <button onClick={() => { setView('shop-home'); setIsSettingsOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    🏠 <span>Home</span>
                  </button>
                  <button onClick={() => { setView('shop-home'); setIsSettingsOpen(false); }}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    🛍️ <span>Shop</span>
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    ❓ <span>Help center</span>
                  </button>

                  <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

                  {/* ── Sell on PSP ── */}
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Sell on PSP</div>

                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    🏢 <span>For brands</span>
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    🎨 <span>For creators</span>
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    🛠️ <span>Build your store</span>
                  </button>

                  <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

                  {/* ── Social ── */}
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Follow us</div>

                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    📘 <span>
                          <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
                        </span>
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    📸 <span>
                           <a href="https://www.instagram.com/sopheak123.pheak/" target="_blank" rel="noopener noreferrer">Instagram</a>
                    </span>
                  </button>
                  <button className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-left transition ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-blue-400'}`}>
                    🐦 <span>
                          <a href="https://x.com/PSopheak23887" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
                    </span>
                  </button>

                  <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

                  {/* ── Preferences ── */}
                  <div className="px-4 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferences</div>

                  <button onClick={handleToggleDarkMode}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm transition text-left ${isDarkMode ? 'hover:bg-slate-700 text-gray-200' : 'hover:bg-blue-400 text-gray-700'}`}>
                    <div className="flex items-center gap-2">
                      {isDarkMode ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-500" />}
                      <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
                    </div>
                  </button>

                  <div className={`border-t my-1 ${isDarkMode ? 'border-slate-700' : 'border-gray-100'}`} />

                  {/* ── Auth ── */}
                  {!userRole || userRole === 'guest' ? (
                    <button onClick={() => { setView('login-page'); setIsSettingsOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50/10 font-semibold transition text-left">
                      <LogIn className="h-4 w-4" />
                      <span>Login to account</span>
                    </button>
                  ) : (
                    <button onClick={() => { if (handleLogout) handleLogout(); setIsSettingsOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50/10 font-semibold transition text-left">
                      <LogOut className="h-4 w-4" />
                      <span>Sign out ({userRole})</span>
                    </button>
                  )}
                </div>
              )}
            </div>
            {/* --- END OF SETTINGS --- */}

          </div>
        </div>
      </nav>
    </section>
  );
}