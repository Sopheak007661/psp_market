import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  DollarSign, Package, ShoppingCart, Users, TrendingUp, 
  Mail, Calendar, Activity, ShieldCheck, Layers 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';

export default function DashboardHome() {
  // ทាញទិន្នន័យផលិតផលពី Context
  const { products = [] } = useContext(ShopContext);
  
  // 🌟 បង្កើត State មូលដ្ឋានសម្រាប់រក្សាទុកការបញ្ជាទិញផ្ទាល់ពី Local Storage Ledger
  const [orders, setOrders] = useState([]);

  // ទាញយកទិន្នន័យលក់ភ្លាមៗនៅពេល Component ដំណើរការ
  useEffect(() => {
    const savedHistory = localStorage.getItem('psp_market_order_history');
    if (savedHistory) {
      try {
        setOrders(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Failed to parse master sales history ledger:", err);
      }
    }
  }, []);

  // 安全ការពារកុំឱ្យគាំង (Safe Number conversion to prevent .toFixed() errors)
  const safeNum = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  // 1. គណនាសរុប Metric Cards ពី Real Storage Data
  const totalRevenue = orders.reduce((sum, order) => sum + safeNum(order.total), 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;

  // ស្វែងរកចំនួនគណនីអតិថិជនប្លែកៗគ្នា (Unique Buyers)
  const uniqueUsers = new Set(orders.map(order => order.accountEmail || 'Guest')).size;

  // 2. រៀបចំទិន្នន័យសម្រាប់ ម៉ូដែលទី ១៖ ក្រាហ្វិកចំណូលប្រចាំថ្ងៃ (Revenue Timeline)
  const revenueTimeline = orders.reduce((acc, order) => {
    // ចម្រាញ់យកតែថ្ងៃខែឆ្នាំ (លុបម៉ោងចេញដើម្បីកុំឱ្យបែកក្រាហ្វ)
    const dateStr = order.date ? order.date.split(' at')[0] : 'Unknown';
    const existing = acc.find(item => item.date === dateStr);
    if (existing) {
      existing.Sales += safeNum(order.total);
      existing.Orders += 1;
    } else {
      acc.push({ date: dateStr, Sales: safeNum(order.total), Orders: 1 });
    }
    return acc;
  }, []).reverse(); // បង្ហាញពីចាស់ទៅថ្មីតាមលំដាប់លំដោយលីនេអ៊ែរ

  // 3. រៀបចំទិន្នន័យសម្រាប់ ម៉ូដែលទី ២៖ ក្រាហ្វិកលក់តាមគណនីអតិថិជន (Sales by User Email)
  const userSalesData = orders.reduce((acc, order) => {
    const email = order.accountEmail || 'Anonymous/Guest';
    const existing = acc.find(item => item.email === email);
    
    // គណនាចំនួនមុខទំនិញសរុបក្នុង Order នោះ
    const itemsCount = order.items ? order.items.reduce((sum, item) => sum + safeNum(item.quantity), 0) : 0;

    if (existing) {
      existing.TotalSpent += safeNum(order.total);
      existing.ProductsBought += itemsCount;
    } else {
      acc.push({ 
        email: email, 
        TotalSpent: safeNum(order.total), 
        ProductsBought: itemsCount 
      });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8 font-sans pb-12 bg-slate-50/40 p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="text-blue-600 animate-pulse" size={24} /> 
            PSP MARKET METRICS ENGINE
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">
            Real-time graphical diagnostics analyzer connected directly to active secure client-side transactions database.
          </p>
        </div>
        <div className="flex items-self-start md:items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-bold text-slate-600 shadow-xs">
          <Calendar size={14} className="text-blue-500" />
          Live Ledger Aggregation Enabled
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: SYSTEM CORE METRICS (CARD OVERVIEW) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Gross Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-emerald-500 hover:shadow-md transition duration-300">
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Gross Revenue Valuation</p>
            <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-0.5">
              <TrendingUp size={10} /> Live Streams Connected
            </span>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        {/* Card 2: Catalog SKUs */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition duration-300">
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Active Catalog SKUs</p>
            <h3 className="text-2xl font-black text-slate-900">{totalProducts} <span className="text-xs text-gray-400 font-bold">Units</span></h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Layers size={10} /> Context Store Matrix
            </span>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
            <Package className="h-5 w-5" />
          </div>
        </div>

        {/* Card 3: Total Logs Logged */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-amber-500 hover:shadow-md transition duration-300">
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Volumes Processed</p>
            <h3 className="text-2xl font-black text-slate-900">{totalOrders} <span className="text-xs text-gray-400 font-bold">Records</span></h3>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Cart Checkouts Synced</span>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>

        {/* Card 4: Unique Buyers */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-purple-500 hover:shadow-md transition duration-300">
          <div className="space-y-2">
            <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Unique Client Targets</p>
            <h3 className="text-2xl font-black text-slate-900">{uniqueUsers} <span className="text-xs text-gray-400 font-bold">Accounts</span></h3>
            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Portal Authentications</span>
          </div>
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition duration-300">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 2: GRAPHICAL MODELS (VISUALIZATION CHARTS) */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MODEL A: REVENUE GROWTH & TIMELINE (AREA CHART) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-[9px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Model A</span>
            <h4 className="text-sm font-bold text-slate-800 mt-1">Linear Financial Accumulation Stream</h4>
            <p className="text-gray-400 text-[11px]">Tracks operational revenue growth vectors relative to continuous date frames.</p>
          </div>
          <div className="h-64 w-full text-[10px]">
            {revenueTimeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">No structural timeline streams data found.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" />
                  <YAxis tickLine={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }} formatter={(value) => [`$${value.toFixed(2)}`, 'Net Injection']} />
                  <Area type="monotone" dataKey="Sales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* MODEL B: USER SEGMENTATION & SALES (BAR CHART) */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-[9px] uppercase font-black tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Model B</span>
            <h4 className="text-sm font-bold text-slate-800 mt-1">Client Authorization Matrix Analytics</h4>
            <p className="text-gray-400 text-[11px]">Isolates specific account configurations with matching buying capacities.</p>
          </div>
          <div className="h-64 w-full text-[10px]">
            {userSalesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">No verified system identity metrics loaded.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="email" tickLine={false} stroke="#94a3b8" tickFormatter={(tick) => tick.split('@')[0]} />
                  <YAxis tickLine={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value, name) => [name === 'TotalSpent' ? `$${value.toFixed(2)}` : `${value} units`, name === 'TotalSpent' ? 'Total Invested' : 'Volume Loaded']} />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '10px' }} />
                  <Bar dataKey="TotalSpent" name="Total Spent ($)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={18} />
                  <Bar dataKey="ProductsBought" name="Items Bought (Qty)" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* SECTION 3: DETAILED USER LEDGER STREAM (TABLE DATA) */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-linear-to-r from-slate-50/50 to-white flex justify-between items-center">
          <div>
            <h4 className="text-sm font-black tracking-tight text-slate-800 uppercase text-xs">Relational Client Core Stream Ledger</h4>
            <p className="text-gray-400 text-[11px] mt-0.5">Isolated mappings matching profile accounts directly to systemic payload conversions.</p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-white border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <ShieldCheck size={12} className="text-blue-600" /> Storage Records: {userSalesData.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-gray-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-gray-100">
                <th className="py-3.5 px-6">Authenticated Identity Email</th>
                <th className="py-3.5 px-6">Latest Consignee Name</th>
                <th className="py-3.5 px-6 text-center">Volume Metric</th>
                <th className="py-3.5 px-6 text-right">Net Injection Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
              {userSalesData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-400 italic bg-slate-50/10">No transactional streams available inside localized historical tracks.</td>
                </tr>
              ) : (
                userSalesData.map((user, idx) => {
                  // Find the most recent recipient customer matching this transaction email account configuration
                  const matchingOrder = orders.find(o => (o.accountEmail || 'Anonymous/Guest') === user.email);
                  const clientName = matchingOrder ? matchingOrder.customerName : 'Walk-in Client';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/50 transition duration-150">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                        <Mail size={13} className="text-gray-400 font-normal" />
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-semibold">{clientName}</td>
                      <td className="py-4 px-6 text-center font-bold">
                        <span className="bg-slate-100 font-mono text-slate-700 px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/40">
                          {user.ProductsBought} Units
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-blue-600 text-sm whitespace-nowrap">
                        ${user.TotalSpent.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}