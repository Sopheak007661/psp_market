import React from 'react';
import { 
  BarChart3, 
  PlusCircle, 
  ClipboardList, 
  ArrowLeft, 
  ShieldAlert, 
  LineChart, 
  Users, 
  ShoppingCart, 
  FileCheck 
} from 'lucide-react';

export default function Sidebar({ setView, currentView }) {
  const navItems = [
    { id: 'admin-home', name: 'Dashboard Overview', icon: BarChart3 },
    { id: 'admin-products', name: 'Manage Products', icon: PlusCircle },
    { id: 'admin-orders', name: 'Orders Log', icon: ClipboardList },
    // New Options Added Here
    { id: 'admin-graphic', name: 'Graphic Analytics', icon: LineChart },
    { id: 'admin-users', name: 'User Register', icon: Users },
    { id: 'admin-checkout', name: 'Check-In / Check-Out', icon: ShoppingCart },
    { id: 'admin-evaluate', name: 'Evaluate Performance', icon: FileCheck },
    { id: 'admin-telegram', name: 'Telegram Dashboard', icon: ShieldAlert },
  ];

  return (
    <aside className="w-[100px]   md:w-64 flex bg-blue-800 text-gray-300 min-h-screen p-6 pt-20 flex flex-col  gap-0 border-r border-gray-800 ">
      <div>
      
      </div>
      <div>
        <div className="flex items-center space-x-2 text-green-600 mb-8 px-2">
          <ShieldAlert className="h-5 w-5 text-green-800" />
          <span className="hidden md:flex text-sm font-bold tracking-wider uppercase">PSP FUNCTION</span>
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                onClick={() => setView(item.id)} 
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                  currentView === item.id 
                    ? 'bg-green-600 text-white ' 
                    : 'hover:bg-gray-800 text-gray-100 hover:text-gray-200'
                }`}
              >
                <Icon className="h-4 w-4 flex flex-col bg-green-900 flex" />
                <span className='hidden md:flex'>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <button 
        onClick={() => setView('shop-home')} 
        className="w-full flex items-center space-x-2 justify-center border border-gray-800 hover:border-gray-700 text-gray-300 px-8 py-2.5 rounded-xl text-xs font-semibold transition bg-red-800 hover:bg-black/80 active:bg-red-800 "
      >
        <ArrowLeft className="h-4 w-4 " />
        <span>Exit Console</span>
      </button>
    </aside>
  );
}