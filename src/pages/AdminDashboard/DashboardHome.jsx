// import React, { useState, useEffect, useContext } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   DollarSign, Package, ShoppingCart, Users, TrendingUp, 
//   Mail, Calendar, Activity, ShieldCheck, Layers 
// } from 'lucide-react';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, BarChart, Bar, Legend 
// } from 'recharts';

// export default function DashboardHome() {
//   // ทាញទិន្នន័យផលិតផលពី Context
//   const { products = [] } = useContext(ShopContext);
  
//   // 🌟 បង្កើត State មូលដ្ឋានសម្រាប់រក្សាទុកការបញ្ជាទិញផ្ទាល់ពី Local Storage Ledger
//   const [orders, setOrders] = useState([]);

//   // ទាញយកទិន្នន័យលក់ភ្លាមៗនៅពេល Component ដំណើរការ
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       try {
//         setOrders(JSON.parse(savedHistory));
//       } catch (err) {
//         console.error("Failed to parse master sales history ledger:", err);
//       }
//     }
//   }, []);

//   // 安全ការពារកុំឱ្យគាំង (Safe Number conversion to prevent .toFixed() errors)
//   const safeNum = (val) => {
//     const n = Number(val);
//     return isNaN(n) ? 0 : n;
//   };

//   // 1. គណនាសរុប Metric Cards ពី Real Storage Data
//   const totalRevenue = orders.reduce((sum, order) => sum + safeNum(order.total), 0);
//   const totalProducts = products.length;
//   const totalOrders = orders.length;

//   // ស្វែងរកចំនួនគណនីអតិថិជនប្លែកៗគ្នា (Unique Buyers)
//   const uniqueUsers = new Set(orders.map(order => order.accountEmail || 'Guest')).size;

//   // 2. រៀបចំទិន្នន័យសម្រាប់ ម៉ូដែលទី ១៖ ក្រាហ្វិកចំណូលប្រចាំថ្ងៃ (Revenue Timeline)
//   const revenueTimeline = orders.reduce((acc, order) => {
//     // ចម្រាញ់យកតែថ្ងៃខែឆ្នាំ (លុបម៉ោងចេញដើម្បីកុំឱ្យបែកក្រាហ្វ)
//     const dateStr = order.date ? order.date.split(' at')[0] : 'Unknown';
//     const existing = acc.find(item => item.date === dateStr);
//     if (existing) {
//       existing.Sales += safeNum(order.total);
//       existing.Orders += 1;
//     } else {
//       acc.push({ date: dateStr, Sales: safeNum(order.total), Orders: 1 });
//     }
//     return acc;
//   }, []).reverse(); // បង្ហាញពីចាស់ទៅថ្មីតាមលំដាប់លំដោយលីនេអ៊ែរ

//   // 3. រៀបចំទិន្នន័យសម្រាប់ ម៉ូដែលទី ២៖ ក្រាហ្វិកលក់តាមគណនីអតិថិជន (Sales by User Email)
//   const userSalesData = orders.reduce((acc, order) => {
//     const email = order.accountEmail || 'Anonymous/Guest';
//     const existing = acc.find(item => item.email === email);
    
//     // គណនាចំនួនមុខទំនិញសរុបក្នុង Order នោះ
//     const itemsCount = order.items ? order.items.reduce((sum, item) => sum + safeNum(item.quantity), 0) : 0;

//     if (existing) {
//       existing.TotalSpent += safeNum(order.total);
//       existing.ProductsBought += itemsCount;
//     } else {
//       acc.push({ 
//         email: email, 
//         TotalSpent: safeNum(order.total), 
//         ProductsBought: itemsCount 
//       });
//     }
//     return acc;
//   }, []);

//   return (
//     <div className="space-y-8 font-sans pb-12 bg-slate-50/40 p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
      
//       {/* HEADER SECTION */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-5">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
//             <Activity className="text-blue-600 animate-pulse" size={24} /> 
//             PSP MARKET METRICS ENGINE
//           </h1>
//           <p className="text-gray-400 text-xs mt-1 font-medium">
//             Real-time graphical diagnostics analyzer connected directly to active secure client-side transactions database.
//           </p>
//         </div>
//         <div className="flex items-self-start md:items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-bold text-slate-600 shadow-xs">
//           <Calendar size={14} className="text-blue-500" />
//           Live Ledger Aggregation Enabled
//         </div>
//       </div>

//       {/* ========================================================= */}
//       {/* SECTION 1: SYSTEM CORE METRICS (CARD OVERVIEW) */}
//       {/* ========================================================= */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
//         {/* Card 1: Total Gross Revenue */}
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-emerald-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Gross Revenue Valuation</p>
//             <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
//             <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-flex items-center gap-0.5">
//               <TrendingUp size={10} /> Live Streams Connected
//             </span>
//           </div>
//           <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
//             <DollarSign className="h-5 w-5" />
//           </div>
//         </div>

//         {/* Card 2: Catalog SKUs */}
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Active Catalog SKUs</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalProducts} <span className="text-xs text-gray-400 font-bold">Units</span></h3>
//             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
//               <Layers size={10} /> Context Store Matrix
//             </span>
//           </div>
//           <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
//             <Package className="h-5 w-5" />
//           </div>
//         </div>

//         {/* Card 3: Total Logs Logged */}
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-amber-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Total Volumes Processed</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalOrders} <span className="text-xs text-gray-400 font-bold">Records</span></h3>
//             <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Cart Checkouts Synced</span>
//           </div>
//           <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
//             <ShoppingCart className="h-5 w-5" />
//           </div>
//         </div>

//         {/* Card 4: Unique Buyers */}
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-purple-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Unique Client Targets</p>
//             <h3 className="text-2xl font-black text-slate-900">{uniqueUsers} <span className="text-xs text-gray-400 font-bold">Accounts</span></h3>
//             <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Portal Authentications</span>
//           </div>
//           <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition duration-300">
//             <Users className="h-5 w-5" />
//           </div>
//         </div>
//       </div>

//       {/* ========================================================= */}
//       {/* SECTION 2: GRAPHICAL MODELS (VISUALIZATION CHARTS) */}
//       {/* ========================================================= */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
//         {/* MODEL A: REVENUE GROWTH & TIMELINE (AREA CHART) */}
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-[9px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Model A</span>
//             <h4 className="text-sm font-bold text-slate-800 mt-1">Linear Financial Accumulation Stream</h4>
//             <p className="text-gray-400 text-[11px]">Tracks operational revenue growth vectors relative to continuous date frames.</p>
//           </div>
//           <div className="h-64 w-full text-[10px]">
//             {revenueTimeline.length === 0 ? (
//               <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">No structural timeline streams data found.</div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={revenueTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
//                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" />
//                   <YAxis tickLine={false} stroke="#94a3b8" />
//                   <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }} formatter={(value) => [`$${value.toFixed(2)}`, 'Net Injection']} />
//                   <Area type="monotone" dataKey="Sales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>

//         {/* MODEL B: USER SEGMENTATION & SALES (BAR CHART) */}
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-[9px] uppercase font-black tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Model B</span>
//             <h4 className="text-sm font-bold text-slate-800 mt-1">Client Authorization Matrix Analytics</h4>
//             <p className="text-gray-400 text-[11px]">Isolates specific account configurations with matching buying capacities.</p>
//           </div>
//           <div className="h-64 w-full text-[10px]">
//             {userSalesData.length === 0 ? (
//               <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">No verified system identity metrics loaded.</div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={userSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="email" tickLine={false} stroke="#94a3b8" tickFormatter={(tick) => tick.split('@')[0]} />
//                   <YAxis tickLine={false} stroke="#94a3b8" />
//                   <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} formatter={(value, name) => [name === 'TotalSpent' ? `$${value.toFixed(2)}` : `${value} units`, name === 'TotalSpent' ? 'Total Invested' : 'Volume Loaded']} />
//                   <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '10px' }} />
//                   <Bar dataKey="TotalSpent" name="Total Spent ($)" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={18} />
//                   <Bar dataKey="ProductsBought" name="Items Bought (Qty)" fill="#a855f7" radius={[4, 4, 0, 0]} barSize={18} />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>

//       </div>

//       {/* ========================================================= */}
//       {/* SECTION 3: DETAILED USER LEDGER STREAM (TABLE DATA) */}
//       {/* ========================================================= */}
//       <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
//         <div className="p-5 border-b border-gray-100 bg-linear-to-r from-slate-50/50 to-white flex justify-between items-center">
//           <div>
//             <h4 className="text-sm font-black tracking-tight text-slate-800 uppercase text-xs">Relational Client Core Stream Ledger</h4>
//             <p className="text-gray-400 text-[11px] mt-0.5">Isolated mappings matching profile accounts directly to systemic payload conversions.</p>
//           </div>
//           <span className="text-[10px] font-bold text-slate-500 bg-white border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
//             <ShieldCheck size={12} className="text-blue-600" /> Storage Records: {userSalesData.length}
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead>
//               <tr className="bg-slate-50 text-gray-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-gray-100">
//                 <th className="py-3.5 px-6">Authenticated Identity Email</th>
//                 <th className="py-3.5 px-6">Latest Consignee Name</th>
//                 <th className="py-3.5 px-6 text-center">Volume Metric</th>
//                 <th className="py-3.5 px-6 text-right">Net Injection Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {userSalesData.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="py-12 text-center text-gray-400 italic bg-slate-50/10">No transactional streams available inside localized historical tracks.</td>
//                 </tr>
//               ) : (
//                 userSalesData.map((user, idx) => {
//                   // Find the most recent recipient customer matching this transaction email account configuration
//                   const matchingOrder = orders.find(o => (o.accountEmail || 'Anonymous/Guest') === user.email);
//                   const clientName = matchingOrder ? matchingOrder.customerName : 'Walk-in Client';

//                   return (
//                     <tr key={idx} className="hover:bg-slate-50/50 transition duration-150">
//                       <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
//                         <Mail size={13} className="text-gray-400 font-normal" />
//                         {user.email}
//                       </td>
//                       <td className="py-4 px-6 text-gray-500 font-semibold">{clientName}</td>
//                       <td className="py-4 px-6 text-center font-bold">
//                         <span className="bg-slate-100 font-mono text-slate-700 px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/40">
//                           {user.ProductsBought} Units
//                         </span>
//                       </td>
//                       <td className="py-4 px-6 text-right font-black text-blue-600 text-sm whitespace-nowrap">
//                         ${user.TotalSpent.toFixed(2)}
//                       </td>
//                     </tr>
//                   );
//                 })
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }






























import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  DollarSign, Package, ShoppingCart, Users, TrendingUp, 
  Mail, Calendar, Activity, ShieldCheck, Layers,
  Star, Trash2, MessageSquare, AlertTriangle, CheckCircle, X
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';

// ─────────────────────────────────────────────
// CONFIRM DIALOG COMPONENT
// ─────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeUp">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} className="text-red-500" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">Confirm Deletion</p>
            <p className="text-xs text-slate-500 mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onCancel} className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5">
            <X size={13} /> Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMMENTS MANAGEMENT SECTION
// ─────────────────────────────────────────────
function CommentsManagement() {
  const [comments, setComments] = useState([]);
  const [confirmId, setConfirmId] = useState(null); // single delete
  const [confirmAll, setConfirmAll] = useState(false); // delete all
  const [toast, setToast] = useState('');

  // Load comments from localStorage (same key as UserCommentSection in App.jsx)
  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = () => {
    try {
      const saved = localStorage.getItem('psp_comments');
      setComments(saved ? JSON.parse(saved) : []);
    } catch {
      setComments([]);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleDeleteOne = (id) => {
    const updated = comments.filter(c => c.id !== id);
    setComments(updated);
    try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
    setConfirmId(null);
    showToast('Comment removed successfully.');
  };

  const handleDeleteAll = () => {
    setComments([]);
    try { localStorage.removeItem('psp_comments'); } catch {}
    setConfirmAll(false);
    showToast('All user comments have been cleared.');
  };

  const AVATAR_COLORS = [
    'bg-blue-500','bg-emerald-500','bg-violet-500',
    'bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500',
  ];
  const getAvatarColor = (name) =>
    name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : 'bg-slate-400';

  const avgRating = comments.length
    ? (comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.length).toFixed(1)
    : '–';

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">

      {/* Confirm dialogs */}
      {confirmId !== null && (
        <ConfirmDialog
          message="This will permanently remove this customer review."
          onConfirm={() => handleDeleteOne(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
      {confirmAll && (
        <ConfirmDialog
          message={`This will permanently delete all ${comments.length} customer reviews.`}
          onConfirm={handleDeleteAll}
          onCancel={() => setConfirmAll(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-fadeUp">
          <CheckCircle size={15} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <MessageSquare size={15} className="text-blue-600" />
            <h4 className="text-xs font-black tracking-tight text-slate-800 uppercase">
              Customer Reviews Manager
            </h4>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              Admin Only
            </span>
          </div>
          <p className="text-gray-400 text-[11px]">
            View and moderate all user-submitted reviews from the storefront.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Stats pill */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1">
              <MessageSquare size={11} className="text-blue-500" />
              {comments.length} reviews
            </span>
            <span className="w-px h-3 bg-slate-300" />
            <span className="flex items-center gap-1">
              <Star size={11} className="text-yellow-500" />
              {avgRating} avg
            </span>
          </div>

          {/* Delete all */}
          {comments.length > 0 && (
            <button
              onClick={() => setConfirmAll(true)}
              className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              <Trash2 size={12} /> Clear All
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {comments.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
          <MessageSquare size={36} className="opacity-25" />
          <p className="text-sm font-medium text-slate-500">No customer reviews yet.</p>
          <p className="text-xs">Reviews submitted on the storefront will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-gray-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-gray-100">
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Rating</th>
                <th className="py-3 px-5">Comment</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
              {comments.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 transition duration-150 group">
                  {/* Avatar + Name */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-[10px] font-black text-white flex-shrink-0`}>
                        {c.username ? c.username[0].toUpperCase() : '?'}
                      </div>
                      <span className="font-bold text-slate-800 whitespace-nowrap">{c.username || 'Anonymous'}</span>
                    </div>
                  </td>

                  {/* Rating stars */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xs tracking-tighter">{'★'.repeat(c.rating || 0)}{'☆'.repeat(5 - (c.rating || 0))}</span>
                      <span className="text-[10px] text-slate-400 font-bold ml-0.5">{c.rating}/5</span>
                    </div>
                  </td>

                  {/* Comment text */}
                  <td className="py-3.5 px-5 max-w-xs">
                    <p className="text-slate-600 leading-relaxed line-clamp-2">"{c.comment}"</p>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-5 whitespace-nowrap text-slate-400">
                    {c.date || '—'}
                  </td>

                  {/* Delete button */}
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => setConfirmId(c.id)}
                      className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
                      title="Delete this review"
                    >
                      <Trash2 size={11} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer note */}
      {comments.length > 0 && (
        <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
          ⚠️ Removing a review here also removes it from the live storefront immediately (shared localStorage).
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD HOME
// ─────────────────────────────────────────────
export default function DashboardHome() {
  const { products = [] } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

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

  const safeNum = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const totalRevenue = orders.reduce((sum, order) => sum + safeNum(order.total), 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const uniqueUsers = new Set(orders.map(order => order.accountEmail || 'Guest')).size;

  const revenueTimeline = orders.reduce((acc, order) => {
    const dateStr = order.date ? order.date.split(' at')[0] : 'Unknown';
    const existing = acc.find(item => item.date === dateStr);
    if (existing) {
      existing.Sales += safeNum(order.total);
      existing.Orders += 1;
    } else {
      acc.push({ date: dateStr, Sales: safeNum(order.total), Orders: 1 });
    }
    return acc;
  }, []).reverse();

  const userSalesData = orders.reduce((acc, order) => {
    const email = order.accountEmail || 'Anonymous/Guest';
    const existing = acc.find(item => item.email === email);
    const itemsCount = order.items ? order.items.reduce((sum, item) => sum + safeNum(item.quantity), 0) : 0;
    if (existing) {
      existing.TotalSpent += safeNum(order.total);
      existing.ProductsBought += itemsCount;
    } else {
      acc.push({ email, TotalSpent: safeNum(order.total), ProductsBought: itemsCount });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8 font-sans pb-12 bg-slate-50/40 p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
      
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.25s ease both; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      {/* HEADER */}
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

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

      {/* USER LEDGER TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex justify-between items-center">
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

      {/* ══════════════════════════════════════════ */}
      {/* CUSTOMER REVIEWS MANAGEMENT — NEW SECTION */}
      {/* ══════════════════════════════════════════ */}
      <CommentsManagement />

    </div>
  );
}