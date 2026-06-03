import React, { useState, useEffect } from 'react';
import { 
  Receipt, Clock, User, DollarSign, Package, 
  Search, ShieldCheck, CheckCircle2, ArrowUpRight 
} from 'lucide-react';

export default function Orders() {
  const [allOrders, setAllOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Automatically fetch from the same localStorage ledger used in Cart.jsx
  useEffect(() => {
    const savedHistory = localStorage.getItem('psp_market_order_history');
    if (savedHistory) {
      try {
        setAllOrders(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Failed to parse order history ledger:", err);
      }
    }
  }, []);

  // Filter orders by ID, Customer Name, or Account Email
  const filteredOrders = allOrders.filter(order => 
    order.id?.toString().includes(searchTerm) ||
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.accountEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate high-level metrics for the admin header
  const totalRevenue = allOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const totalItemsSold = allOrders.reduce((sum, order) => 
    sum + (order.items?.reduce((iSum, item) => iSum + (item.quantity || 0), 0) || 0), 0
  );

  return (
    <div className="max-w-7xl mx-auto font-sans p-6 space-y-6 bg-slate-300 shadow-xl shadow-blue-800 rounded-xl ">
      
      {/* 📊 KPI Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-blue-800 text-xl font-extrabold uppercase tracking-normal block mb-5 ">Revenue</span>
            <h3 className="text-2xl font-black text-gray-900">${totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-blue-800">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-blue-800 text-xl font-extrabold uppercase tracking-normal block mb-5 ">PRODUCTS BOUGHT</span>
            <h3 className="text-2xl font-black text-gray-900">{totalItemsSold} Units</h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <Package size={22} />
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-blue-800 text-xl font-extrabold uppercase tracking-normal block mb-5 ">PROCESSED</span>
            <h3 className="text-2xl font-black text-gray-900">{allOrders.length} Records</h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Receipt size={22} />
          </div>
        </div>
      </div>

      {/* 🔍 Search & Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search size={15} className="absolute left-3.5 top-3.5 text-blue-800" />
          <input 
            type="text" 
            placeholder="Search by Order ID, Client Name, or Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs focus:border-blue-500 focus:bg-white outline-none transition"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
          <ShieldCheck size={14} className="text-blue-800" />
          <span>System status </span>
        </div>
      </div>

      {/* 📋 Central Transactions Ledger Table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-linear-to-r from-slate-50/50 to-white">
          <h3 className="font-black text-blue-800 text-xs uppercase tracking-normal flex items-center gap-2">
            <Receipt size={16} className="text-blue-700" /> Historical Transaction
          </h3>
          <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">Live Storage Feed</span>
        </div>

        <div className="overflow-x-auto text-xs">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400 italic bg-slate-50/30">
              No historical pipeline tracks found matching current filter scope.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-gray-400 font-bold border-b border-gray-100 uppercase tracking-wider text-[10px]">
                  <th className="px-6 py-3.5">Order Token</th>
                  <th className="px-6 py-3.5">Buyer Profile</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Logistics & Route</th>
                  <th className="px-6 py-3.5">Invoiced Value</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/40 transition group">
                    {/* Token ID */}
                    <td className="px-6 py-4 font-mono text-indigo-600 font-bold">
                      #{order.id || 'N/A'}
                    </td>
                    
                    {/* Buyer Profile details */}
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-bold text-sm flex items-center gap-1">
                        <User size={12} className="text-gray-400" /> {order.customerName || 'Anonymous Client'}
                      </div>
                      <div className="text-gray-400 text-[11px] font-normal mt-0.5">{order.accountEmail || 'No Email Tracked'}</div>
                      <div className="text-slate-400 font-mono text-[10px] mt-0.5">{order.phone}</div>
                    </td>
                    
                    {/* Timestamp */}
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-400" />
                        <span>{order.date || 'Pending Processing'}</span>
                      </div>
                    </td>

                    {/* Logistics Partner & Address */}
                    <td className="px-6 py-4 max-w-xs">
                      <span className="inline-block px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold text-[10px] mb-1">
                        {order.carrier}
                      </span>
                      <p className="text-gray-400 line-clamp-1 font-normal text-[11px]">{order.address}</p>
                    </td>
                    
                    {/* Total Value safely checking numbers */}
                    <td className="px-6 py-4 font-black text-gray-900 text-sm whitespace-nowrap">
                      ${Number(order.total || 0).toFixed(2)}
                    </td>
                    
                    {/* Hardcoded system completion badge */}
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <CheckCircle2 size={11} /> Completed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}