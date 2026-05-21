import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingCart, LayoutDashboard, Store, Search, X, LogOut } from 'lucide-react';

// Added handleLogout prop alongside setView and userRole
export default function Navbar({ setView, userRole, handleLogout }) {
  const { cart, searchTerm, setSearchTerm } = useContext(ShopContext);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className='pb-20'>
      <nav className="fixed top-0  left-0 right-0 z-50 bg-blue-800 border-b border-gray-100 shadow-sm">
            <div className='px-8 h-16 flex justify-between items-center gap-4'>
              
              {/* Brand Logo */}
              <div className="flex items-center space-x-2 cursor-pointer flex-shrink-0" onClick={() => setView('shop-home')}>
                <Store className="h-6 w-6 text-green-100" />
                <span className="text-xl font-black tracking-tight text-green-600">PSP MARKET</span>
              </div>

              {/* 🔍 Search Input Bar */}
              <div className="hidden max-w-md mx-4 md:flex md:flex-1">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-blue-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search marketplace listings..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setView('shop-home'); // Redirect back to store grid instantly upon typing
                    }}
                    className="w-full pl-10 pr-10 py-1.5 bg-blue-800 border border-gray-200 text-gray-900 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-green-500 block outline-none transition-all duration-200 focus:bg-white"
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
                <button onClick={() => setView('shop-home')} className="hidden md:flex text-green-600 hover:text-blue-600 font-medium transition">Market</button>
                
                <button onClick={() => setView('shop-cart')} className="relative p-2 text-green-600 hover:text-blue-600 transition">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* CONDITION: Hidden for standard customers, visible only when logged in as admin */}
                {userRole === 'admin' && (
                  <button onClick={() => setView('admin-home')} className="flex items-center space-x-1.5 bg-green-800 text-white px-4 py-2 text-xs font-semibold hover:bg-blue-500 transition hidden md:flex" >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Admin</span>
                  </button>
                )}

                {/* OPTION: Logout button specifically targeting standard users */}
                  {userRole === 'user' && (
                    <button 
                      onClick={() => {
                        if (handleLogout) handleLogout();
                      }} 
                      className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-700 transition rounded-lg"
                      title="Logout Account"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Logout</span>
                    </button>
                  )}

              </div>

            </div>

      </nav>
    </section>
  );
}