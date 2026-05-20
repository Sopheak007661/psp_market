import React, { useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { DollarSign, Package, ShoppingCart } from 'lucide-react';

export default function DashboardHome() {
  const { products, orders } = useContext(ShopContext);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Controler Data</h1>
        <p className="text-gray-400 text-xs mt-0.5">Statistical arrays pulled from reactive states.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gross Ledger</p><h3 className="text-lg font-black text-gray-900">${revenue.toFixed(2)}</h3></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg"><Package className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Catalog SKUs</p><h3 className="text-lg font-black text-gray-900">{products.length} Units</h3></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg"><ShoppingCart className="h-5 w-5" /></div>
          <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logs Logged</p><h3 className="text-lg font-black text-gray-900">{orders.length} Records</h3></div>
        </div>
      </div>
      
      <div className="p-6 bg-white border border-gray-200 rounded-2xl text-center">
        <p className="text-xs text-gray-400 font-medium">System Core status operational. Switch views using the sidebar navigation options.</p>
      </div>
    </div>
  );
}