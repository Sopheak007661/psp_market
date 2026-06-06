
// import React, { useState, useEffect, useContext } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   DollarSign, Package, ShoppingCart, Users, TrendingUp, 
//   Mail, Calendar, Activity, ShieldCheck, Layers,
//   Star, Trash2, MessageSquare, AlertTriangle, CheckCircle, X
// } from 'lucide-react';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, BarChart, Bar, Legend 
// } from 'recharts';

// // ─────────────────────────────────────────────
// // CONFIRM DIALOG COMPONENT
// // ─────────────────────────────────────────────
// function ConfirmDialog({ message, onConfirm, onCancel }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeUp">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
//             <AlertTriangle size={20} className="text-red-500" />
//           </div>
//           <div>
//             <p className="font-bold text-slate-800 text-sm">Confirm Deletion</p>
//             <p className="text-xs text-slate-500 mt-0.5">{message}</p>
//           </div>
//         </div>
//         <div className="flex gap-2 mt-5">
//           <button onClick={onCancel} className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5">
//             <X size={13} /> Cancel
//           </button>
//           <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5">
//             <Trash2 size={13} /> Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // COMMENTS MANAGEMENT SECTION
// // ─────────────────────────────────────────────
// function CommentsManagement() {
//   const [comments, setComments] = useState([]);
//   const [confirmId, setConfirmId] = useState(null); // single delete
//   const [confirmAll, setConfirmAll] = useState(false); // delete all
//   const [toast, setToast] = useState('');

//   // Load comments from localStorage (same key as UserCommentSection in App.jsx)
//   useEffect(() => {
//     loadComments();
//   }, []);

//   const loadComments = () => {
//     try {
//       const saved = localStorage.getItem('psp_comments');
//       setComments(saved ? JSON.parse(saved) : []);
//     } catch {
//       setComments([]);
//     }
//   };

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(''), 3000);
//   };

//   const handleDeleteOne = (id) => {
//     const updated = comments.filter(c => c.id !== id);
//     setComments(updated);
//     try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//     setConfirmId(null);
//     showToast('Comment removed successfully.');
//   };

//   const handleDeleteAll = () => {
//     setComments([]);
//     try { localStorage.removeItem('psp_comments'); } catch {}
//     setConfirmAll(false);
//     showToast('All user comments have been cleared.');
//   };

//   const AVATAR_COLORS = [
//     'bg-blue-500','bg-emerald-500','bg-violet-500',
//     'bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500',
//   ];
//   const getAvatarColor = (name) =>
//     name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : 'bg-slate-400';

//   const avgRating = comments.length
//     ? (comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.length).toFixed(1)
//     : '–';

//   return (
//     <div className="bg-white  rounded-2xl border border-gray-300/90 shadow-md shadow-gray-500 overflow-hidden">

//       {/* Confirm dialogs */}
//       {confirmId !== null && (
//         <ConfirmDialog
//           message="This will permanently remove this customer review."
//           onConfirm={() => handleDeleteOne(confirmId)}
//           onCancel={() => setConfirmId(null)}
//         />
//       )}
//       {confirmAll && (
//         <ConfirmDialog
//           message={`This will permanently delete all ${comments.length} customer reviews.`}
//           onConfirm={handleDeleteAll}
//           onCancel={() => setConfirmAll(false)}
//         />
//       )}

//       {/* Toast */}
//       {toast && (
//         <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-fadeUp">
//           <CheckCircle size={15} /> {toast}
//         </div>
//       )}

//       {/* Header */}
//       <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <div className="flex items-center gap-2 mb-0.5">
//             <h4 className="text-xl font-black tracking-normal text-blue-800 uppercase ">
//               comment
//             </h4>
//             <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
//               Admin Only
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 flex-shrink-0">
//           {/* Stats pill */}
//           <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600">
//             <span className="flex items-center gap-1 text-xs">
//               <MessageSquare size={11} className="text-blue-500" />
//               {comments.length} reviews
//             </span>
//             <span className="w-px h-3 bg-slate-300 " />
//             <span className="flex items-center gap-1 text-xs">
//               <Star size={11} className="text-yellow-500" />
//               {avgRating} avg
//             </span>
//           </div>

//           {/* Delete all */}
//           {comments.length > 0 && (
//             <button
//               onClick={() => setConfirmAll(true)}
//               className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition"
//             >
//               <Trash2 size={12} /> Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       {comments.length === 0 ? (
//         <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
//           <MessageSquare size={36} className="opacity-25" />
//           <p className="text-sm font-medium text-slate-500">No customer reviews yet.</p>
//           <p className="text-xs">Reviews submitted on the storefront will appear here.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto ">
//           <table className="w-full text-left text-xs border-collapse ">
//             <thead>
//               <tr className="bg-slate-100 text-blue-800 font-extrabold uppercase tracking-wider text-[12px] border-b border-gray-100">
//                 <th className="py-3 px-5">Customer</th>
//                 <th className="py-3 px-5">Rating</th>
//                 <th className="py-3 px-5">Comment</th>
//                 <th className="py-3 px-5">Date</th>
//                 <th className="py-3 px-5 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {comments.map((c) => (
//                 <tr key={c.id} className="hover:bg-slate-400 hover:text-black transition duration-150 group">
//                   {/* Avatar + Name */}
//                   <td className="py-3.5 px-5 ">
//                     <div className="flex items-center gap-2">
//                       <div className={`w-7 h-7 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-[10px] font-black text-white flex-shrink-0`}>
//                         {c.username ? c.username[0].toUpperCase() : '?'}
//                       </div>
//                       <span className="font-bold  whitespace-nowrap">{c.username || 'Anonymous'}</span>
//                     </div>
//                   </td>

//                   {/* Rating stars */}
//                   <td className="py-3.5 px-5">
//                     <div className="flex items-center gap-1">
//                       <span className="text-yellow-400 text-xs tracking-tighter">{'★'.repeat(c.rating || 0)}{'☆'.repeat(5 - (c.rating || 0))}</span>
//                       <span className="text-[10px]  font-bold ml-0.5">{c.rating}/5</span>
//                     </div>
//                   </td>

//                   {/* Comment text */}
//                   <td className="py-3.5 px-5 max-w-xs">
//                     <p className=" leading-relaxed line-clamp-2">"{c.comment}"</p>
//                   </td>

//                   {/* Date */}
//                   <td className="py-3.5 px-5 whitespace-nowrap ">
//                     {c.date || '—'}
//                   </td>

//                   {/* Delete button */}
//                   <td className="py-3.5 px-5 text-center">
//                     <button
//                       onClick={() => setConfirmId(c.id)}
//                       className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
//                       title="Delete this review"
//                     >
//                       <Trash2 size={11} /> Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Footer note */}
//       {comments.length > 0 && (
//         <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
//           ⚠️ Removing a review here also removes it from the live storefront immediately (shared localStorage).
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // MAIN DASHBOARD HOME
// // ─────────────────────────────────────────────
// export default function DashboardHome() {
//   const { products = [] } = useContext(ShopContext);
//   const [orders, setOrders] = useState([]);

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

//   const safeNum = (val) => {
//     const n = Number(val);
//     return isNaN(n) ? 0 : n;
//   };

//   const totalRevenue = orders.reduce((sum, order) => sum + safeNum(order.total), 0);
//   const totalProducts = products.length;
//   const totalOrders = orders.length;
//   const uniqueUsers = new Set(orders.map(order => order.accountEmail || 'Guest')).size;

//   const revenueTimeline = orders.reduce((acc, order) => {
//     const dateStr = order.date ? order.date.split(' at')[0] : 'Unknown';
//     const existing = acc.find(item => item.date === dateStr);
//     if (existing) {
//       existing.Sales += safeNum(order.total);
//       existing.Orders += 1;
//     } else {
//       acc.push({ date: dateStr, Sales: safeNum(order.total), Orders: 1 });
//     }
//     return acc;
//   }, []).reverse();

//   const userSalesData = orders.reduce((acc, order) => {
//     const email = order.accountEmail || 'Anonymous/Guest';
//     const existing = acc.find(item => item.email === email);
//     const itemsCount = order.items ? order.items.reduce((sum, item) => sum + safeNum(item.quantity), 0) : 0;
//     if (existing) {
//       existing.TotalSpent += safeNum(order.total);
//       existing.ProductsBought += itemsCount;
//     } else {
//       acc.push({ email, TotalSpent: safeNum(order.total), ProductsBought: itemsCount });
//     }
//     return acc;
//   }, []);

//   return (
//     <div className="shadow-xl shadow-blue-800 space-y-3 font-sans pb-12 bg-slate-300 p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
      
//       <style>{`
//         @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         .animate-fadeUp { animation: fadeUp 0.25s ease both; }
//         .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
//       `}</style>

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-5">
//         <div>
//           <h1 className="text-xl sm:text-3xl font-black text-blue-800 tracking-tight flex items-center gap-2">
//             <Activity className="text-blue-600 animate-pulse" size={24} /> 
//             PSP MARKET OVERVIEW
//           </h1>
//         </div>
//         <div className="flex items-self-start md:items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-bold text-slate-600 shadow-xs">
//           <Calendar size={14} className="text-blue-500" />
//           List opening
//         </div>
//       </div>

//       {/* METRIC CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-emerald-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Revenue </p>
//             <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
//           </div>
//           <div className="p-3.5 bg-emerald-50 text-blue-800 rounded-xl group-hover:bg-blue-800/50 group-hover:text-white transition duration-300">
//             <DollarSign className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold  uppercase tracking-normal">Products</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalProducts} <span className="text-xs text-gray-400 font-bold">Units</span></h3>
//           </div>
//           <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
//             <Package className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-amber-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Processed</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalOrders} <span className="text-xs text-gray-400 font-bold">Records</span></h3>
//           </div>
//           <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
//             <ShoppingCart className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-purple-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold  uppercase tracking-normal">Client</p>
//             <h3 className="text-2xl font-black text-slate-900">{uniqueUsers} <span className="text-xs text-gray-400 font-bold">Accounts</span></h3>
//           </div>
//           <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition duration-300">
//             <Users className="h-5 w-5" />
//           </div>
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-5 rounded-2xl border border-gray-300/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md tracking-normal">Model 1</span>
//             <h4 className="text-sm font-bold text-slate-600 mt-5">Linear Financial Accumulation Stream</h4>
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

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md tracking-normal">Model 2</span>
//             <h4 className="text-sm font-bold text-slate-700 mt-5">Client Authorization Matrix Analytics</h4>
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

//       {/* USER LEDGER TABLE */}
//       <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
//         <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex justify-between items-center">
//           <div>
//             <h4 className="text-xl uppercase font-black tracking-widest text-blue-800  tracking-normal ">CLIENT OPERATION</h4>
//           </div>
//           <span className="text-[10px] font-bold text-slate-700 bg-white border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
//             <ShieldCheck size={12} className="text-blue-600" /> Storage Records: {userSalesData.length}
//           </span>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead className=''>
//               <tr className=" bg-slate-100 text-blue-800 font-extrabold uppercase tracking-normal text-[12px] border-b border-gray-200">
//                 <th className="py-3.5 px-6">Email</th>
//                 <th className="py-3.5 px-6">Name</th>
//                 <th className="py-3.5 px-6 text-center">Quantity</th>
//                 <th className="py-3.5 px-6 text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {userSalesData.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="py-12 text-center text-gray-400 italic bg-slate-50/10">No transactional streams available inside localized historical tracks.</td>
//                 </tr>
//               ) : (
//                 userSalesData.map((user, idx) => {
//                   const matchingOrder = orders.find(o => (o.accountEmail || 'Anonymous/Guest') === user.email);
//                   const clientName = matchingOrder ? matchingOrder.customerName : 'Walk-in Client';
//                   return (
//                     <tr key={idx} className="hover:bg-slate-400 transition duration-150">
//                       <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
//                         <Mail size={13} className="text-gray-400 font-normal" />
//                         {user.email}
//                       </td>
//                       <td className="py-4 px-6 text-black font-semibold">{clientName}</td>
//                       <td className="py-4 px-6 text-center font-bold">
//                         <span className="bg-slate-100 font-mono text-black px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/40">
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

//       {/* ══════════════════════════════════════════ */}
//       {/* CUSTOMER REVIEWS MANAGEMENT — NEW SECTION */}
//       {/* ══════════════════════════════════════════ */}
//       <CommentsManagement />

//     </div>
//   );
// }































// import React, { useState, useEffect, useContext } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   DollarSign, Package, ShoppingCart, Users, TrendingUp, 
//   Mail, Calendar, Activity, ShieldCheck, Layers,
//   Star, Trash2, MessageSquare, AlertTriangle, CheckCircle, X
// } from 'lucide-react';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, BarChart, Bar, Legend 
// } from 'recharts';

// // ─────────────────────────────────────────────
// // CONFIRM DIALOG COMPONENT
// // ─────────────────────────────────────────────
// function ConfirmDialog({ message, onConfirm, onCancel }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeUp">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
//             <AlertTriangle size={20} className="text-red-500" />
//           </div>
//           <div>
//             <p className="font-bold text-slate-800 text-sm">Confirm Deletion</p>
//             <p className="text-xs text-slate-500 mt-0.5">{message}</p>
//           </div>
//         </div>
//         <div className="flex gap-2 mt-5">
//           <button onClick={onCancel} className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5">
//             <X size={13} /> Cancel
//           </button>
//           <button onClick={onConfirm} className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5">
//             <Trash2 size={13} /> Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // COMMENTS MANAGEMENT SECTION
// // ─────────────────────────────────────────────
// function CommentsManagement() {
//   const [comments, setComments] = useState([]);
//   const [confirmId, setConfirmId] = useState(null); // single delete
//   const [confirmAll, setConfirmAll] = useState(false); // delete all
//   const [toast, setToast] = useState('');

//   // Load comments from localStorage (same key as UserCommentSection in App.jsx)
//   useEffect(() => {
//     loadComments();
//   }, []);

//   const loadComments = async () => {
//     try {
//       const res = await fetch("/api/comments");
//       if (res.ok) {
//         const data = await res.json();
//         setComments(data);
//       } else {
//         console.error("Failed to fetch comments from API:", res.status, res.statusText);
//         // Fallback to localStorage if API fails
//         const saved = localStorage.getItem('psp_comments');
//         setComments(saved ? JSON.parse(saved) : []);
//       }
//     } catch (err) {
//       console.error("Network error fetching comments:", err);
//       // Fallback to localStorage on network error
//       const saved = localStorage.getItem('psp_comments');
//       setComments(saved ? JSON.parse(saved) : []);
//     }
//   };

//   const showToast = (msg) => {
//     setToast(msg);
//     setTimeout(() => setToast(''), 3000);
//   };

//   const handleDeleteOne = async (id) => {
//     // Optimistic UI update
//     const updated = comments.filter(c => c.id !== id);
//     setComments(updated);
//     try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//     setConfirmId(null);
//     showToast('Comment removed successfully.');

//     try {
//       const res = await fetch(`/api/comments/${id}`, {
//         method: 'DELETE',
//       });
//       if (!res.ok) {
//         console.error("Failed to delete comment from API:", res.status, res.statusText);
//         showToast('Failed to delete comment from database.');
//         loadComments(); // Reload to sync state
//       }
//     } catch (err) {
//       console.error("Network error deleting comment:", err);
//       showToast('Network error deleting comment.');
//       loadComments(); // Reload to sync state
//     }
//   };

//   const handleDeleteAll = async () => {
//     // Optimistic UI update
//     setComments([]);
//     try { localStorage.removeItem('psp_comments'); } catch {}
//     setConfirmAll(false);
//     showToast('All user comments have been cleared.');

//     try {
//       const res = await fetch("/api/comments", {
//         method: 'DELETE',
//       });
//       if (!res.ok) {
//         console.error("Failed to delete all comments from API:", res.status, res.statusText);
//         showToast('Failed to clear all comments from database.');
//         loadComments(); // Reload to sync state
//       }
//     } catch (err) {
//       console.error("Network error deleting all comments:", err);
//       showToast('Network error clearing all comments.');
//       loadComments(); // Reload to sync state
//     }
//   };

//   const AVATAR_COLORS = [
//     'bg-blue-500','bg-emerald-500','bg-violet-500',
//     'bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500',
//   ];
//   const getAvatarColor = (name) =>
//     name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : 'bg-slate-400';

//   const avgRating = comments.length
//     ? (comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.length).toFixed(1)
//     : '–';

//   return (
//     <div className="bg-white  rounded-2xl border border-gray-300/90 shadow-md shadow-gray-500 overflow-hidden">

//       {/* Confirm dialogs */}
//       {confirmId !== null && (
//         <ConfirmDialog
//           message="This will permanently remove this customer review."
//           onConfirm={() => handleDeleteOne(confirmId)}
//           onCancel={() => setConfirmId(null)}
//         />
//       )}
//       {confirmAll && (
//         <ConfirmDialog
//           message={`This will permanently delete all ${comments.length} customer reviews.`}
//           onConfirm={handleDeleteAll}
//           onCancel={() => setConfirmAll(false)}
//         />
//       )}

//       {/* Toast */}
//       {toast && (
//         <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-fadeUp">
//           <CheckCircle size={15} /> {toast}
//         </div>
//       )}

//       {/* Header */}
//       <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <div className="flex items-center gap-2 mb-0.5">
//             <h4 className="text-xl font-black tracking-normal text-blue-800 uppercase ">
//               comment
//             </h4>
//             <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
//               Admin Only
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center gap-3 flex-shrink-0">
//           {/* Stats pill */}
//           <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600">
//             <span className="flex items-center gap-1 text-xs">
//               <MessageSquare size={11} className="text-blue-500" />
//               {comments.length} reviews
//             </span>
//             <span className="w-px h-3 bg-slate-300 " />
//             <span className="flex items-center gap-1 text-xs">
//               <Star size={11} className="text-yellow-500" />
//               {avgRating} avg
//             </span>
//           </div>

//           {/* Delete all */}
//           {comments.length > 0 && (
//             <button
//               onClick={() => setConfirmAll(true)}
//               className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition"
//             >
//               <Trash2 size={12} /> Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       {comments.length === 0 ? (
//         <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
//           <MessageSquare size={36} className="opacity-25" />
//           <p className="text-sm font-medium text-slate-500">No customer reviews yet.</p>
//           <p className="text-xs">Reviews submitted on the storefront will appear here.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto ">
//           <table className="w-full text-left text-xs border-collapse ">
//             <thead>
//               <tr className="bg-slate-100 text-blue-800 font-extrabold uppercase tracking-wider text-[12px] border-b border-gray-100">
//                 <th className="py-3 px-5">Customer</th>
//                 <th className="py-3 px-5">Rating</th>
//                 <th className="py-3 px-5">Comment</th>
//                 <th className="py-3 px-5">Date</th>
//                 <th className="py-3 px-5 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {comments.map((c) => (
//                 <tr key={c.id} className="hover:bg-slate-400 hover:text-black transition duration-150 group">
//                   {/* Avatar + Name */}
//                   <td className="py-3.5 px-5 ">
//                     <div className="flex items-center gap-2">
//                       <div className={`w-7 h-7 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-[10px] font-black text-white flex-shrink-0`}>
//                         {c.username ? c.username[0].toUpperCase() : '?'}
//                       </div>
//                       <span className="font-bold  whitespace-nowrap">{c.username || 'Anonymous'}</span>
//                     </div>
//                   </td>

//                   {/* Rating stars */}
//                   <td className="py-3.5 px-5">
//                     <div className="flex items-center gap-1">
//                       <span className="text-yellow-400 text-xs tracking-tighter">{'★'.repeat(c.rating || 0)}{'☆'.repeat(5 - (c.rating || 0))}</span>
//                       <span className="text-[10px]  font-bold ml-0.5">{c.rating}/5</span>
//                     </div>
//                   </td>

//                   {/* Comment text */}
//                   <td className="py-3.5 px-5 max-w-xs">
//                     <p className=" leading-relaxed line-clamp-2">"{c.comment}"</p>
//                   </td>

//                   {/* Date */}
//                   <td className="py-3.5 px-5 whitespace-nowrap ">
//                     {c.date || '—'}
//                   </td>

//                   {/* Delete button */}
//                   <td className="py-3.5 px-5 text-center">
//                     <button
//                       onClick={() => setConfirmId(c.id)}
//                       className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
//                       title="Delete this review"
//                     >
//                       <Trash2 size={11} /> Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Footer note */}
//       {comments.length > 0 && (
//         <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
//           ⚠️ Removing a review here also removes it from the live storefront immediately (synced with database).
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // MAIN DASHBOARD HOME
// // ─────────────────────────────────────────────
// export default function DashboardHome() {
//   const { products = [] } = useContext(ShopContext);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await fetch("/api/orders"); // Admin dashboard, fetch all orders
//         if (res.ok) {
//           const data = await res.json();
//           setOrders(data);
//         } else {
//           console.error("Failed to fetch orders from API:", res.status, res.statusText);
//           // Fallback to localStorage if API fails
//           const savedHistory = localStorage.getItem('psp_market_order_history');
//           if (savedHistory) {
//             setOrders(JSON.parse(savedHistory));
//           }
//         }
//       } catch (err) {
//         console.error("Network error fetching orders:", err);
//         // Fallback to localStorage on network error
//         const savedHistory = localStorage.getItem('psp_market_order_history');
//         if (savedHistory) {
//           setOrders(JSON.parse(savedHistory));
//         }
//       }
//     };
//     fetchOrders();
//   }, []);

//   const safeNum = (val) => {
//     const n = Number(val);
//     return isNaN(n) ? 0 : n;
//   };

//   const totalRevenue = orders.reduce((sum, order) => sum + safeNum(order.total), 0);
//   const totalProducts = products.length;
//   const totalOrders = orders.length;
//   const uniqueUsers = new Set(orders.map(order => order.accountEmail || 'Guest')).size;

//   const revenueTimeline = orders.reduce((acc, order) => {
//     const dateStr = order.date ? order.date.split(' at')[0] : 'Unknown';
//     const existing = acc.find(item => item.date === dateStr);
//     if (existing) {
//       existing.Sales += safeNum(order.total);
//       existing.Orders += 1;
//     } else {
//       acc.push({ date: dateStr, Sales: safeNum(order.total), Orders: 1 });
//     }
//     return acc;
//   }, []).reverse();

//   const userSalesData = orders.reduce((acc, order) => {
//     const email = order.accountEmail || 'Anonymous/Guest';
//     const existing = acc.find(item => item.email === email);
//     const itemsCount = order.items ? order.items.reduce((sum, item) => sum + safeNum(item.quantity), 0) : 0;
//     if (existing) {
//       existing.TotalSpent += safeNum(order.total);
//       existing.ProductsBought += itemsCount;
//     } else {
//       acc.push({ email, TotalSpent: safeNum(order.total), ProductsBought: itemsCount });
//     }
//     return acc;
//   }, []);

//   return (
//     <div className="shadow-xl shadow-blue-800 space-y-3 font-sans pb-12 bg-slate-300 p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
      
//       <style>{`
//         @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         .animate-fadeUp { animation: fadeUp 0.25s ease both; }
//         .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
//       `}</style>

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-5">
//         <div>
//           <h1 className="text-xl sm:text-3xl font-black text-blue-800 tracking-tight flex items-center gap-2">
//             <Activity className="text-blue-600 animate-pulse" size={24} /> 
//             PSP MARKET OVERVIEW
//           </h1>
//         </div>
//         <div className="flex items-self-start md:items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-bold text-slate-600 shadow-xs">
//           <Calendar size={14} className="text-blue-500" />
//           List opening
//         </div>
//       </div>

//       {/* METRIC CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-emerald-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Revenue </p>
//             <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
//           </div>
//           <div className="p-3.5 bg-emerald-50 text-blue-800 rounded-xl group-hover:bg-blue-800/50 group-hover:text-white transition duration-300">
//             <DollarSign className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold  uppercase tracking-normal">Products</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalProducts} <span className="text-xs text-gray-400 font-bold">Units</span></h3>
//           </div>
//           <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
//             <Package className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-amber-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Processed</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalOrders} <span className="text-xs text-gray-400 font-bold">Records</span></h3>
//           </div>
//           <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
//             <ShoppingCart className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-purple-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold  uppercase tracking-normal">Client</p>
//             <h3 className="text-2xl font-black text-slate-900">{uniqueUsers} <span className="text-xs text-gray-400 font-bold">Accounts</span></h3>
//           </div>
//           <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition duration-300">
//             <Users className="h-5 w-5" />
//           </div>
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-5 rounded-2xl border border-gray-300/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md tracking-normal">Model 1</span>
//             <h4 className="text-sm font-bold text-slate-600 mt-5">Linear Financial Accumulation Stream</h4>
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

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md tracking-normal">Model 2</span>
//             <h4 className="text-sm font-bold text-slate-700 mt-5">Client Authorization Matrix Analytics</h4>
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

//       {/* USER LEDGER TABLE */}
//       <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
//         <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex justify-between items-center">
//           <div>
//             <h4 className="text-xl uppercase font-black tracking-widest text-blue-800  tracking-normal ">CLIENT OPERATION</h4>
//           </div>
//           <span className="text-[10px] font-bold text-slate-700 bg-white border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
//             <ShieldCheck size={12} className="text-blue-600" /> Storage Records: {userSalesData.length}
//           </span>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead className=''>
//               <tr className=" bg-slate-100 text-blue-800 font-extrabold uppercase tracking-normal text-[12px] border-b border-gray-200">
//                 <th className="py-3.5 px-6">Email</th>
//                 <th className="py-3.5 px-6">Name</th>
//                 <th className="py-3.5 px-6 text-center">Quantity</th>
//                 <th className="py-3.5 px-6 text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {userSalesData.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="py-12 text-center text-gray-400 italic bg-slate-50/10">No transactional streams available inside localized historical tracks.</td>
//                 </tr>
//               ) : (
//                 userSalesData.map((user, idx) => {
//                   const matchingOrder = orders.find(o => (o.accountEmail || 'Anonymous/Guest') === user.email);
//                   const clientName = matchingOrder ? matchingOrder.customerName : 'Walk-in Client';
//                   return (
//                     <tr key={idx} className="hover:bg-slate-400 transition duration-150">
//                       <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
//                         <Mail size={13} className="text-gray-400 font-normal" />
//                         {user.email}
//                       </td>
//                       <td className="py-4 px-6 text-black font-semibold">{clientName}</td>
//                       <td className="py-4 px-6 text-center font-bold">
//                         <span className="bg-slate-100 font-mono text-black px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/40">
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

//       {/* ══════════════════════════════════════════ */}
//       {/* CUSTOMER REVIEWS MANAGEMENT — NEW SECTION */}
//       {/* ══════════════════════════════════════════ */}
//       <CommentsManagement />

//     </div>
//   );
// }






























// import React, { useState, useEffect, useContext } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   DollarSign, Package, ShoppingCart, Users, TrendingUp, 
//   Mail, Calendar, Activity, ShieldCheck, Layers,
//   Star, Trash2, MessageSquare, AlertTriangle, CheckCircle, X,
//   RefreshCw
// } from 'lucide-react';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, BarChart, Bar, Legend 
// } from 'recharts';

// // ─────────────────────────────────────────────
// // CONFIRM DIALOG COMPONENT
// // ─────────────────────────────────────────────
// function ConfirmDialog({ message, onConfirm, onCancel }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeUp">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
//             <AlertTriangle size={20} className="text-red-500" />
//           </div>
//           <div>
//             <p className="font-bold text-slate-800 text-sm">Confirm Deletion</p>
//             <p className="text-xs text-slate-500 mt-0.5">{message}</p>
//           </div>
//         </div>
//         <div className="flex gap-2 mt-5">
//           <button
//             onClick={onCancel}
//             className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
//           >
//             <X size={13} /> Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5"
//           >
//             <Trash2 size={13} /> Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // COMMENTS MANAGEMENT — fully MySQL-backed
// // ─────────────────────────────────────────────
// function CommentsManagement() {
//   const [comments,   setComments]   = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [confirmId,  setConfirmId]  = useState(null);   // id to delete (single)
//   const [confirmAll, setConfirmAll] = useState(false);  // flag for delete-all
//   const [toast,      setToast]      = useState('');
//   const [toastType,  setToastType]  = useState('success'); // 'success' | 'error'

//   // ── helpers ───────────────────────────────────────────────────────────────
//   const AVATAR_COLORS  = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500'];
//   const getAvatarColor = (name) =>
//     name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : 'bg-slate-400';

//   const showToast = (msg, type = 'success') => {
//     setToast(msg);
//     setToastType(type);
//     setTimeout(() => setToast(''), 3200);
//   };

//   // ── fetch from DB ─────────────────────────────────────────────────────────
//   const loadComments = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/comments');
//       if (res.ok) {
//         const data = await res.json();
//         setComments(data);
//         // keep localStorage in sync so storefront sees the same data offline
//         try { localStorage.setItem('psp_comments', JSON.stringify(data)); } catch {}
//       } else {
//         throw new Error(`HTTP ${res.status}`);
//       }
//     } catch (err) {
//       console.error('[CommentsManagement] loadComments error:', err);
//       // fall back to localStorage
//       try {
//         const saved = localStorage.getItem('psp_comments');
//         setComments(saved ? JSON.parse(saved) : []);
//       } catch {
//         setComments([]);
//       }
//       showToast('Could not reach database — showing cached data.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadComments(); }, []);

//   // ── delete single ─────────────────────────────────────────────────────────
//   const handleDeleteOne = async (id) => {
//     // optimistic update
//     const reverted = [...comments];
//     const updated  = comments.filter(c => c.id !== id);
//     setComments(updated);
//     try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//     setConfirmId(null);

//     try {
//       const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
//       if (res.ok) {
//         showToast('Review removed successfully.');
//       } else {
//         throw new Error(`HTTP ${res.status}`);
//       }
//     } catch (err) {
//       console.error('[CommentsManagement] deleteOne error:', err);
//       // rollback
//       setComments(reverted);
//       try { localStorage.setItem('psp_comments', JSON.stringify(reverted)); } catch {}
//       showToast('Failed to delete — database error. Please try again.', 'error');
//     }
//   };

//   // ── delete all ────────────────────────────────────────────────────────────
//   const handleDeleteAll = async () => {
//     const reverted = [...comments];
//     setComments([]);
//     try { localStorage.removeItem('psp_comments'); } catch {}
//     setConfirmAll(false);

//     try {
//       const res = await fetch('/api/comments', { method: 'DELETE' });
//       if (res.ok) {
//         showToast('All customer reviews have been cleared.');
//       } else {
//         throw new Error(`HTTP ${res.status}`);
//       }
//     } catch (err) {
//       console.error('[CommentsManagement] deleteAll error:', err);
//       // rollback
//       setComments(reverted);
//       try { localStorage.setItem('psp_comments', JSON.stringify(reverted)); } catch {}
//       showToast('Failed to clear — database error. Please try again.', 'error');
//     }
//   };

//   const avgRating = comments.length
//     ? (comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.length).toFixed(1)
//     : '–';

//   return (
//     <div className="bg-white rounded-2xl border border-gray-300/90 shadow-md shadow-gray-500 overflow-hidden">

//       {/* ── Confirm: delete single ── */}
//       {confirmId !== null && (
//         <ConfirmDialog
//           message="This will permanently remove this customer review from the database."
//           onConfirm={() => handleDeleteOne(confirmId)}
//           onCancel={() => setConfirmId(null)}
//         />
//       )}

//       {/* ── Confirm: delete all ── */}
//       {confirmAll && (
//         <ConfirmDialog
//           message={`This will permanently delete all ${comments.length} customer reviews from the database.`}
//           onConfirm={handleDeleteAll}
//           onCancel={() => setConfirmAll(false)}
//         />
//       )}

//       {/* ── Toast notification ── */}
//       {toast && (
//         <div
//           className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-fadeUp ${
//             toastType === 'error' ? 'bg-red-600' : 'bg-emerald-600'
//           }`}
//         >
//           {toastType === 'error'
//             ? <AlertTriangle size={15} />
//             : <CheckCircle size={15} />
//           }
//           {toast}
//         </div>
//       )}

//       {/* ── Header ── */}
//       <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <div className="flex items-center gap-2 mb-0.5">
//             <h4 className="text-xl font-black tracking-normal text-blue-800 uppercase">
//               Customer Comments
//             </h4>
//             <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
//               Admin Only
//             </span>
//           </div>
//           <p className="text-xs text-slate-500 mt-0.5">
//             Reviews submitted on the storefront — synced with MySQL database
//           </p>
//         </div>

//         <div className="flex items-center gap-3 flex-shrink-0">
//           {/* Stats pill */}
//           <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600">
//             <span className="flex items-center gap-1 text-xs">
//               <MessageSquare size={11} className="text-blue-500" />
//               {loading ? '…' : comments.length} reviews
//             </span>
//             <span className="w-px h-3 bg-slate-300" />
//             <span className="flex items-center gap-1 text-xs">
//               <Star size={11} className="text-yellow-500" />
//               {loading ? '…' : avgRating} avg
//             </span>
//           </div>

//           {/* Refresh button */}
//           <button
//             onClick={loadComments}
//             disabled={loading}
//             className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-xs font-bold px-3 py-2 rounded-xl transition disabled:opacity-50"
//             title="Refresh from database"
//           >
//             <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
//             Refresh
//           </button>

//           {/* Delete all */}
//           {!loading && comments.length > 0 && (
//             <button
//               onClick={() => setConfirmAll(true)}
//               className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition"
//             >
//               <Trash2 size={12} /> Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Table ── */}
//       {loading ? (
//         <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
//           <RefreshCw size={28} className="animate-spin opacity-40" />
//           <p className="text-sm font-medium text-slate-500">Loading reviews from database…</p>
//         </div>
//       ) : comments.length === 0 ? (
//         <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
//           <MessageSquare size={36} className="opacity-25" />
//           <p className="text-sm font-medium text-slate-500">No customer reviews yet.</p>
//           <p className="text-xs">Reviews submitted on the storefront will appear here.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-blue-800 font-extrabold uppercase tracking-wider text-[12px] border-b border-gray-100">
//                 <th className="py-3 px-5">#</th>
//                 <th className="py-3 px-5">Customer</th>
//                 <th className="py-3 px-5">Rating</th>
//                 <th className="py-3 px-5">Comment</th>
//                 <th className="py-3 px-5">Date</th>
//                 <th className="py-3 px-5 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {comments.map((c, idx) => (
//                 <tr key={c.id} className="hover:bg-slate-100 transition duration-150 group">

//                   {/* Row number */}
//                   <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
//                     {idx + 1}
//                   </td>

//                   {/* Avatar + Name */}
//                   <td className="py-3.5 px-5">
//                     <div className="flex items-center gap-2">
//                       <div className={`w-7 h-7 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-[10px] font-black text-white flex-shrink-0`}>
//                         {c.username ? c.username[0].toUpperCase() : '?'}
//                       </div>
//                       <span className="font-bold whitespace-nowrap">{c.username || 'Anonymous'}</span>
//                     </div>
//                   </td>

//                   {/* Rating */}
//                   <td className="py-3.5 px-5">
//                     <div className="flex items-center gap-1">
//                       <span className="text-yellow-400 text-xs tracking-tighter">
//                         {'★'.repeat(c.rating || 0)}{'☆'.repeat(5 - (c.rating || 0))}
//                       </span>
//                       <span className="text-[10px] font-bold ml-0.5">{c.rating}/5</span>
//                     </div>
//                   </td>

//                   {/* Comment */}
//                   <td className="py-3.5 px-5 max-w-xs">
//                     <p className="leading-relaxed line-clamp-2 text-slate-700">"{c.comment}"</p>
//                   </td>

//                   {/* Date */}
//                   <td className="py-3.5 px-5 whitespace-nowrap text-slate-500">
//                     {c.date || '—'}
//                   </td>

//                   {/* Delete */}
//                   <td className="py-3.5 px-5 text-center">
//                     <button
//                       onClick={() => setConfirmId(c.id)}
//                       className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
//                       title="Delete this review"
//                     >
//                       <Trash2 size={11} /> Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Footer note */}
//       {!loading && comments.length > 0 && (
//         <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
//           ⚠️ Deleting a review here removes it from the MySQL database and the live storefront immediately.
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // MAIN DASHBOARD HOME
// // ─────────────────────────────────────────────
// export default function DashboardHome() {
//   const { products = [] } = useContext(ShopContext);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await fetch('/api/orders');
//         if (res.ok) {
//           const data = await res.json();
//           setOrders(data);
//         } else {
//           console.error('Failed to fetch orders from API:', res.status, res.statusText);
//           const savedHistory = localStorage.getItem('psp_market_order_history');
//           if (savedHistory) setOrders(JSON.parse(savedHistory));
//         }
//       } catch (err) {
//         console.error('Network error fetching orders:', err);
//         const savedHistory = localStorage.getItem('psp_market_order_history');
//         if (savedHistory) setOrders(JSON.parse(savedHistory));
//       }
//     };
//     fetchOrders();
//   }, []);

//   const safeNum = (val) => {
//     const n = Number(val);
//     return isNaN(n) ? 0 : n;
//   };

//   const totalRevenue  = orders.reduce((sum, order) => sum + safeNum(order.total), 0);
//   const totalProducts = products.length;
//   const totalOrders   = orders.length;
//   const uniqueUsers   = new Set(orders.map(order => order.accountEmail || 'Guest')).size;

//   const revenueTimeline = orders.reduce((acc, order) => {
//     const dateStr  = order.date ? order.date.split(' at')[0] : 'Unknown';
//     const existing = acc.find(item => item.date === dateStr);
//     if (existing) {
//       existing.Sales  += safeNum(order.total);
//       existing.Orders += 1;
//     } else {
//       acc.push({ date: dateStr, Sales: safeNum(order.total), Orders: 1 });
//     }
//     return acc;
//   }, []).reverse();

//   const userSalesData = orders.reduce((acc, order) => {
//     const email      = order.accountEmail || 'Anonymous/Guest';
//     const existing   = acc.find(item => item.email === email);
//     const itemsCount = order.items
//       ? order.items.reduce((sum, item) => sum + safeNum(item.quantity), 0)
//       : 0;
//     if (existing) {
//       existing.TotalSpent     += safeNum(order.total);
//       existing.ProductsBought += itemsCount;
//     } else {
//       acc.push({ email, TotalSpent: safeNum(order.total), ProductsBought: itemsCount });
//     }
//     return acc;
//   }, []);

//   return (
//     <div className="shadow-xl shadow-blue-800 space-y-3 font-sans pb-12 bg-slate-300 p-4 sm:p-6 rounded-3xl border border-slate-100">

//       <style>{`
//         @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         .animate-fadeUp { animation: fadeUp 0.25s ease both; }
//         .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
//       `}</style>

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-5">
//         <div>
//           <h1 className="text-xl sm:text-3xl font-black text-blue-800 tracking-tight flex items-center gap-2">
//             <Activity className="text-blue-600 animate-pulse" size={24} />
//             PSP MARKET OVERVIEW
//           </h1>
//         </div>
//         <div className="flex items-self-start md:items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-bold text-slate-600 shadow-xs">
//           <Calendar size={14} className="text-blue-500" />
//           List opening
//         </div>
//       </div>

//       {/* METRIC CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-emerald-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Revenue</p>
//             <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
//           </div>
//           <div className="p-3.5 bg-emerald-50 text-blue-800 rounded-xl group-hover:bg-blue-800/50 group-hover:text-white transition duration-300">
//             <DollarSign className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Products</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalProducts} <span className="text-xs text-gray-400 font-bold">Units</span></h3>
//           </div>
//           <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
//             <Package className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-amber-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Processed</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalOrders} <span className="text-xs text-gray-400 font-bold">Records</span></h3>
//           </div>
//           <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
//             <ShoppingCart className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-purple-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Client</p>
//             <h3 className="text-2xl font-black text-slate-900">{uniqueUsers} <span className="text-xs text-gray-400 font-bold">Accounts</span></h3>
//           </div>
//           <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition duration-300">
//             <Users className="h-5 w-5" />
//           </div>
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-5 rounded-2xl border border-gray-300/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md">Model 1</span>
//             <h4 className="text-sm font-bold text-slate-600 mt-5">Linear Financial Accumulation Stream</h4>
//           </div>
//           <div className="h-64 w-full text-[10px]">
//             {revenueTimeline.length === 0 ? (
//               <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">
//                 No structural timeline streams data found.
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={revenueTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
//                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" />
//                   <YAxis tickLine={false} stroke="#94a3b8" />
//                   <Tooltip
//                     contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}
//                     formatter={(value) => [`$${value.toFixed(2)}`, 'Net Injection']}
//                   />
//                   <Area type="monotone" dataKey="Sales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md">Model 2</span>
//             <h4 className="text-sm font-bold text-slate-700 mt-5">Client Authorization Matrix Analytics</h4>
//           </div>
//           <div className="h-64 w-full text-[10px]">
//             {userSalesData.length === 0 ? (
//               <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">
//                 No verified system identity metrics loaded.
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={userSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="email" tickLine={false} stroke="#94a3b8" tickFormatter={(tick) => tick.split('@')[0]} />
//                   <YAxis tickLine={false} stroke="#94a3b8" />
//                   <Tooltip
//                     contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
//                     formatter={(value, name) => [
//                       name === 'TotalSpent' ? `$${value.toFixed(2)}` : `${value} units`,
//                       name === 'TotalSpent' ? 'Total Invested' : 'Volume Loaded',
//                     ]}
//                   />
//                   <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '10px' }} />
//                   <Bar dataKey="TotalSpent"     name="Total Spent ($)"    fill="#4f46e5" radius={[4,4,0,0]} barSize={18} />
//                   <Bar dataKey="ProductsBought" name="Items Bought (Qty)" fill="#a855f7" radius={[4,4,0,0]} barSize={18} />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* USER LEDGER TABLE */}
//       <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
//         <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex justify-between items-center">
//           <div>
//             <h4 className="text-xl uppercase font-black tracking-widest text-blue-800">CLIENT OPERATION</h4>
//           </div>
//           <span className="text-[10px] font-bold text-slate-700 bg-white border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
//             <ShieldCheck size={12} className="text-blue-600" /> Storage Records: {userSalesData.length}
//           </span>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-blue-800 font-extrabold uppercase tracking-normal text-[12px] border-b border-gray-200">
//                 <th className="py-3.5 px-6">Email</th>
//                 <th className="py-3.5 px-6">Name</th>
//                 <th className="py-3.5 px-6 text-center">Quantity</th>
//                 <th className="py-3.5 px-6 text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {userSalesData.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="py-12 text-center text-gray-400 italic bg-slate-50/10">
//                     No transactional streams available inside localized historical tracks.
//                   </td>
//                 </tr>
//               ) : (
//                 userSalesData.map((user, idx) => {
//                   const matchingOrder = orders.find(o => (o.accountEmail || 'Anonymous/Guest') === user.email);
//                   const clientName    = matchingOrder ? matchingOrder.customerName : 'Walk-in Client';
//                   return (
//                     <tr key={idx} className="hover:bg-slate-400 transition duration-150">
//                       <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
//                         <Mail size={13} className="text-gray-400 font-normal" />
//                         {user.email}
//                       </td>
//                       <td className="py-4 px-6 text-black font-semibold">{clientName}</td>
//                       <td className="py-4 px-6 text-center font-bold">
//                         <span className="bg-slate-100 font-mono text-black px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/40">
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

//       {/* ── CUSTOMER REVIEWS MANAGEMENT ── */}
//       <CommentsManagement />

//     </div>
//   );
// }























// import React, { useState, useEffect, useContext } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   DollarSign, Package, ShoppingCart, Users, TrendingUp, 
//   Mail, Calendar, Activity, ShieldCheck, Layers,
//   Star, Trash2, MessageSquare, AlertTriangle, CheckCircle, X,
//   RefreshCw
// } from 'lucide-react';
// import { 
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
//   ResponsiveContainer, BarChart, Bar, Legend 
// } from 'recharts';

// // ─────────────────────────────────────────────
// // CONFIRM DIALOG COMPONENT
// // ─────────────────────────────────────────────
// function ConfirmDialog({ message, onConfirm, onCancel }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}>
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fadeUp">
//         <div className="flex items-center gap-3 mb-3">
//           <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
//             <AlertTriangle size={20} className="text-red-500" />
//           </div>
//           <div>
//             <p className="font-bold text-slate-800 text-sm">Confirm Deletion</p>
//             <p className="text-xs text-slate-500 mt-0.5">{message}</p>
//           </div>
//         </div>
//         <div className="flex gap-2 mt-5">
//           <button
//             onClick={onCancel}
//             className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
//           >
//             <X size={13} /> Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5"
//           >
//             <Trash2 size={13} /> Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // COMMENTS MANAGEMENT — fully MySQL-backed
// // ─────────────────────────────────────────────
// function CommentsManagement() {
//   const [comments,   setComments]   = useState([]);
//   const [loading,    setLoading]    = useState(true);
//   const [confirmId,  setConfirmId]  = useState(null);   // id to delete (single)
//   const [confirmAll, setConfirmAll] = useState(false);  // flag for delete-all
//   const [toast,      setToast]      = useState('');
//   const [toastType,  setToastType]  = useState('success'); // 'success' | 'error'

//   // ── helpers ───────────────────────────────────────────────────────────────
//   const AVATAR_COLORS  = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500'];
//   const getAvatarColor = (name) =>
//     name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : 'bg-slate-400';

//   const showToast = (msg, type = 'success') => {
//     setToast(msg);
//     setToastType(type);
//     setTimeout(() => setToast(''), 3200);
//   };

//   // ── fetch from DB ─────────────────────────────────────────────────────────
//   const loadComments = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/comments');
//       if (res.ok) {
//         const data = await res.json();
//         setComments(data);
//         // keep localStorage in sync so storefront sees the same data offline
//         try { localStorage.setItem('psp_comments', JSON.stringify(data)); } catch {}
//       } else {
//         throw new Error(`HTTP ${res.status}`);
//       }
//     } catch (err) {
//       console.error('[CommentsManagement] loadComments error:', err);
//       // fall back to localStorage
//       try {
//         const saved = localStorage.getItem('psp_comments');
//         setComments(saved ? JSON.parse(saved) : []);
//       } catch {
//         setComments([]);
//       }
//       showToast('Could not reach database — showing cached data.', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { loadComments(); }, []);

//   // ── delete single ─────────────────────────────────────────────────────────
//   const handleDeleteOne = async (id) => {
//     // optimistic update
//     const reverted = [...comments];
//     const updated  = comments.filter(c => c.id !== id);
//     setComments(updated);
//     try { localStorage.setItem('psp_comments', JSON.stringify(updated)); } catch {}
//     setConfirmId(null);

//     try {
//       const res = await fetch(`/api/comments/${id}`, { method: 'DELETE' });
//       if (res.ok) {
//         showToast('Review removed successfully.');
//       } else {
//         throw new Error(`HTTP ${res.status}`);
//       }
//     } catch (err) {
//       console.error('[CommentsManagement] deleteOne error:', err);
//       // rollback
//       setComments(reverted);
//       try { localStorage.setItem('psp_comments', JSON.stringify(reverted)); } catch {}
//       showToast('Failed to delete — database error. Please try again.', 'error');
//     }
//   };

//   // ── delete all ────────────────────────────────────────────────────────────
//   const handleDeleteAll = async () => {
//     const reverted = [...comments];
//     setComments([]);
//     try { localStorage.removeItem('psp_comments'); } catch {}
//     setConfirmAll(false);

//     try {
//       const res = await fetch('/api/comments', { method: 'DELETE' });
//       if (res.ok) {
//         showToast('All customer reviews have been cleared.');
//       } else {
//         throw new Error(`HTTP ${res.status}`);
//       }
//     } catch (err) {
//       console.error('[CommentsManagement] deleteAll error:', err);
//       // rollback
//       setComments(reverted);
//       try { localStorage.setItem('psp_comments', JSON.stringify(reverted)); } catch {}
//       showToast('Failed to clear — database error. Please try again.', 'error');
//     }
//   };

//   const avgRating = comments.length
//     ? (comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.length).toFixed(1)
//     : '–';

//   return (
//     <div className="bg-white rounded-2xl border border-gray-300/90 shadow-md shadow-gray-500 overflow-hidden">

//       {/* ── Confirm: delete single ── */}
//       {confirmId !== null && (
//         <ConfirmDialog
//           message="This will permanently remove this customer review from the database."
//           onConfirm={() => handleDeleteOne(confirmId)}
//           onCancel={() => setConfirmId(null)}
//         />
//       )}

//       {/* ── Confirm: delete all ── */}
//       {confirmAll && (
//         <ConfirmDialog
//           message={`This will permanently delete all ${comments.length} customer reviews from the database.`}
//           onConfirm={handleDeleteAll}
//           onCancel={() => setConfirmAll(false)}
//         />
//       )}

//       {/* ── Toast notification ── */}
//       {toast && (
//         <div
//           className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-fadeUp ${
//             toastType === 'error' ? 'bg-red-600' : 'bg-emerald-600'
//           }`}
//         >
//           {toastType === 'error'
//             ? <AlertTriangle size={15} />
//             : <CheckCircle size={15} />
//           }
//           {toast}
//         </div>
//       )}

//       {/* ── Header ── */}
//       <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//         <div>
//           <div className="flex items-center gap-2 mb-0.5">
//             <h4 className="text-xl font-black tracking-normal text-blue-800 uppercase">
//               Customer Comments
//             </h4>
//             <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
//               Admin Only
//             </span>
//           </div>
//           <p className="text-xs text-slate-500 mt-0.5">
//             Reviews submitted on the storefront — synced with MySQL database
//           </p>
//         </div>

//         <div className="flex items-center gap-3 flex-shrink-0">
//           {/* Stats pill */}
//           <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600">
//             <span className="flex items-center gap-1 text-xs">
//               <MessageSquare size={11} className="text-blue-500" />
//               {loading ? '…' : comments.length} reviews
//             </span>
//             <span className="w-px h-3 bg-slate-300" />
//             <span className="flex items-center gap-1 text-xs">
//               <Star size={11} className="text-yellow-500" />
//               {loading ? '…' : avgRating} avg
//             </span>
//           </div>

//           {/* Refresh button */}
//           <button
//             onClick={loadComments}
//             disabled={loading}
//             className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-xs font-bold px-3 py-2 rounded-xl transition disabled:opacity-50"
//             title="Refresh from database"
//           >
//             <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
//             Refresh
//           </button>

//           {/* Delete all */}
//           {!loading && comments.length > 0 && (
//             <button
//               onClick={() => setConfirmAll(true)}
//               className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition"
//             >
//               <Trash2 size={12} /> Clear All
//             </button>
//           )}
//         </div>
//       </div>

//       {/* ── Table ── */}
//       {loading ? (
//         <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
//           <RefreshCw size={28} className="animate-spin opacity-40" />
//           <p className="text-sm font-medium text-slate-500">Loading reviews from database…</p>
//         </div>
//       ) : comments.length === 0 ? (
//         <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
//           <MessageSquare size={36} className="opacity-25" />
//           <p className="text-sm font-medium text-slate-500">No customer reviews yet.</p>
//           <p className="text-xs">Reviews submitted on the storefront will appear here.</p>
//         </div>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-blue-800 font-extrabold uppercase tracking-wider text-[12px] border-b border-gray-100">
//                 <th className="py-3 px-5">#</th>
//                 <th className="py-3 px-5">Customer</th>
//                 <th className="py-3 px-5">Rating</th>
//                 <th className="py-3 px-5">Comment</th>
//                 <th className="py-3 px-5">Date</th>
//                 <th className="py-3 px-5 text-center">Action</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {comments.map((c, idx) => (
//                 <tr key={c.id} className="hover:bg-slate-100 transition duration-150 group">

//                   {/* Row number */}
//                   <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
//                     {idx + 1}
//                   </td>

//                   {/* Avatar + Name */}
//                   <td className="py-3.5 px-5">
//                     <div className="flex items-center gap-2">
//                       <div className={`w-7 h-7 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-[10px] font-black text-white flex-shrink-0`}>
//                         {c.username ? c.username[0].toUpperCase() : '?'}
//                       </div>
//                       <span className="font-bold whitespace-nowrap">{c.username || 'Anonymous'}</span>
//                     </div>
//                   </td>

//                   {/* Rating */}
//                   <td className="py-3.5 px-5">
//                     <div className="flex items-center gap-1">
//                       <span className="text-yellow-400 text-xs tracking-tighter">
//                         {'★'.repeat(c.rating || 0)}{'☆'.repeat(5 - (c.rating || 0))}
//                       </span>
//                       <span className="text-[10px] font-bold ml-0.5">{c.rating}/5</span>
//                     </div>
//                   </td>

//                   {/* Comment */}
//                   <td className="py-3.5 px-5 max-w-xs">
//                     <p className="leading-relaxed line-clamp-2 text-slate-700">"{c.comment}"</p>
//                   </td>

//                   {/* Date */}
//                   <td className="py-3.5 px-5 whitespace-nowrap text-slate-500">
//                     {c.date || '—'}
//                   </td>

//                   {/* Delete */}
//                   <td className="py-3.5 px-5 text-center">
//                     <button
//                       onClick={() => setConfirmId(c.id)}
//                       className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
//                       title="Delete this review"
//                     >
//                       <Trash2 size={11} /> Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Footer note */}
//       {!loading && comments.length > 0 && (
//         <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
//           ⚠️ Deleting a review here removes it from the MySQL database and the live storefront immediately.
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// // MAIN DASHBOARD HOME
// // ─────────────────────────────────────────────
// export default function DashboardHome() {
//   const { products = [] } = useContext(ShopContext);
//   const [orders, setOrders] = useState([]);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await fetch('/api/orders');
//         if (res.ok) {
//           const data = await res.json();
//           setOrders(data);
//         } else {
//           console.error('Failed to fetch orders from API:', res.status, res.statusText);
//           const savedHistory = localStorage.getItem('psp_market_order_history');
//           if (savedHistory) setOrders(JSON.parse(savedHistory));
//         }
//       } catch (err) {
//         console.error('Network error fetching orders:', err);
//         const savedHistory = localStorage.getItem('psp_market_order_history');
//         if (savedHistory) setOrders(JSON.parse(savedHistory));
//       }
//     };
//     fetchOrders();
//   }, []);

//   const safeNum = (val) => {
//     const n = Number(val);
//     return isNaN(n) ? 0 : n;
//   };

//   const totalRevenue  = orders.reduce((sum, order) => sum + safeNum(order.total), 0);
//   const totalProducts = products.length;
//   const totalOrders   = orders.length;
//   const uniqueUsers   = new Set(orders.map(order => order.accountEmail || 'Guest')).size;

//   const revenueTimeline = orders.reduce((acc, order) => {
//     const dateStr  = order.date ? order.date.split(' at')[0] : 'Unknown';
//     const existing = acc.find(item => item.date === dateStr);
//     if (existing) {
//       existing.Sales  += safeNum(order.total);
//       existing.Orders += 1;
//     } else {
//       acc.push({ date: dateStr, Sales: safeNum(order.total), Orders: 1 });
//     }
//     return acc;
//   }, []).reverse();

//   const userSalesData = orders.reduce((acc, order) => {
//     const email      = order.accountEmail || 'Anonymous/Guest';
//     const existing   = acc.find(item => item.email === email);
//     const itemsCount = order.items
//       ? order.items.reduce((sum, item) => sum + safeNum(item.quantity), 0)
//       : 0;
//     if (existing) {
//       existing.TotalSpent     += safeNum(order.total);
//       existing.ProductsBought += itemsCount;
//     } else {
//       acc.push({ email, TotalSpent: safeNum(order.total), ProductsBought: itemsCount });
//     }
//     return acc;
//   }, []);

//   return (
//     <div className="shadow-xl shadow-blue-800 space-y-3 font-sans pb-12 bg-slate-300 p-4 sm:p-6 rounded-3xl border border-slate-100">

//       <style>{`
//         @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
//         .animate-fadeUp { animation: fadeUp 0.25s ease both; }
//         .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
//       `}</style>

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-5">
//         <div>
//           <h1 className="text-xl sm:text-3xl font-black text-blue-800 tracking-tight flex items-center gap-2">
//             <Activity className="text-blue-600 animate-pulse" size={24} />
//             PSP MARKET OVERVIEW
//           </h1>
//         </div>
//         <div className="flex items-self-start md:items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-bold text-slate-600 shadow-xs">
//           <Calendar size={14} className="text-blue-500" />
//           List opening
//         </div>
//       </div>

//       {/* METRIC CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-emerald-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Revenue</p>
//             <h3 className="text-2xl font-black text-slate-900">${totalRevenue.toFixed(2)}</h3>
//           </div>
//           <div className="p-3.5 bg-emerald-50 text-blue-800 rounded-xl group-hover:bg-blue-800/50 group-hover:text-white transition duration-300">
//             <DollarSign className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Products</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalProducts} <span className="text-xs text-gray-400 font-bold">Units</span></h3>
//           </div>
//           <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
//             <Package className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-amber-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Processed</p>
//             <h3 className="text-2xl font-black text-slate-900">{totalOrders} <span className="text-xs text-gray-400 font-bold">Records</span></h3>
//           </div>
//           <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
//             <ShoppingCart className="h-5 w-5" />
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-purple-500 hover:shadow-md transition duration-300">
//           <div className="space-y-2">
//             <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Client</p>
//             <h3 className="text-2xl font-black text-slate-900">{uniqueUsers} <span className="text-xs text-gray-400 font-bold">Accounts</span></h3>
//           </div>
//           <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition duration-300">
//             <Users className="h-5 w-5" />
//           </div>
//         </div>
//       </div>

//       {/* CHARTS */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <div className="bg-white p-5 rounded-2xl border border-gray-300/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md">Model 1</span>
//             <h4 className="text-sm font-bold text-slate-600 mt-5">Linear Financial Accumulation Stream</h4>
//           </div>
//           <div className="h-64 w-full text-[10px]">
//             {revenueTimeline.length === 0 ? (
//               <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">
//                 No structural timeline streams data found.
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={revenueTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
//                       <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" />
//                   <YAxis tickLine={false} stroke="#94a3b8" />
//                   <Tooltip
//                     contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}
//                     formatter={(value) => [`$${value.toFixed(2)}`, 'Net Injection']}
//                   />
//                   <Area type="monotone" dataKey="Sales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
//                 </AreaChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
//           <div className="mb-4">
//             <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md">Model 2</span>
//             <h4 className="text-sm font-bold text-slate-700 mt-5">Client Authorization Matrix Analytics</h4>
//           </div>
//           <div className="h-64 w-full text-[10px]">
//             {userSalesData.length === 0 ? (
//               <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">
//                 No verified system identity metrics loaded.
//               </div>
//             ) : (
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={userSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
//                   <XAxis dataKey="email" tickLine={false} stroke="#94a3b8" tickFormatter={(tick) => tick.split('@')[0]} />
//                   <YAxis tickLine={false} stroke="#94a3b8" />
//                   <Tooltip
//                     contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
//                     formatter={(value, name) => [
//                       name === 'TotalSpent' ? `$${value.toFixed(2)}` : `${value} units`,
//                       name === 'TotalSpent' ? 'Total Invested' : 'Volume Loaded',
//                     ]}
//                   />
//                   <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '10px' }} />
//                   <Bar dataKey="TotalSpent"     name="Total Spent ($)"    fill="#4f46e5" radius={[4,4,0,0]} barSize={18} />
//                   <Bar dataKey="ProductsBought" name="Items Bought (Qty)" fill="#a855f7" radius={[4,4,0,0]} barSize={18} />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* USER LEDGER TABLE */}
//       <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
//         <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex justify-between items-center">
//           <div>
//             <h4 className="text-xl uppercase font-black tracking-widest text-blue-800">CLIENT OPERATION</h4>
//           </div>
//           <span className="text-[10px] font-bold text-slate-700 bg-white border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
//             <ShieldCheck size={12} className="text-blue-600" /> Storage Records: {userSalesData.length}
//           </span>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left text-xs border-collapse">
//             <thead>
//               <tr className="bg-slate-100 text-blue-800 font-extrabold uppercase tracking-normal text-[12px] border-b border-gray-200">
//                 <th className="py-3.5 px-6">Email</th>
//                 <th className="py-3.5 px-6">Name</th>
//                 <th className="py-3.5 px-6 text-center">Quantity</th>
//                 <th className="py-3.5 px-6 text-right">Total</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
//               {userSalesData.length === 0 ? (
//                 <tr>
//                   <td colSpan="4" className="py-12 text-center text-gray-400 italic bg-slate-50/10">
//                     No transactional streams available inside localized historical tracks.
//                   </td>
//                 </tr>
//               ) : (
//                 userSalesData.map((user, idx) => {
//                   const matchingOrder = orders.find(o => (o.accountEmail || 'Anonymous/Guest') === user.email);
//                   const clientName    = matchingOrder ? matchingOrder.customerName : 'Walk-in Client';
//                   return (
//                     <tr key={idx} className="hover:bg-slate-400 transition duration-150">
//                       <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
//                         <Mail size={13} className="text-gray-400 font-normal" />
//                         {user.email}
//                       </td>
//                       <td className="py-4 px-6 text-black font-semibold">{clientName}</td>
//                       <td className="py-4 px-6 text-center font-bold">
//                         <span className="bg-slate-100 font-mono text-black px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/40">
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

//       {/* ── CUSTOMER REVIEWS MANAGEMENT ── */}
//       <CommentsManagement />

//     </div>
//   );
// }





import React, { useState, useEffect, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  DollarSign, Package, ShoppingCart, Users, 
  Mail, Calendar, Activity, ShieldCheck,
  Star, Trash2, MessageSquare, AlertTriangle, CheckCircle, X,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Legend 
} from 'recharts';

// ─── API BASE — same pattern as App.jsx ───────────────────────────────────────
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ─────────────────────────────────────────────
// CONFIRM DIALOG COMPONENT
// ─────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}>
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
          <button
            onClick={onCancel}
            className="flex-1 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
          >
            <X size={13} /> Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// COMMENTS MANAGEMENT — fully MySQL-backed via absolute API URL
// ─────────────────────────────────────────────
function CommentsManagement() {
  const [comments,   setComments]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [confirmId,  setConfirmId]  = useState(null);
  const [confirmAll, setConfirmAll] = useState(false);
  const [toast,      setToast]      = useState('');
  const [toastType,  setToastType]  = useState('success');

  const AVATAR_COLORS  = ['bg-blue-500','bg-emerald-500','bg-violet-500','bg-pink-500','bg-amber-500','bg-cyan-500','bg-red-500'];
  const getAvatarColor = (name) =>
    name ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length] : 'bg-slate-400';

  const showToast = (msg, type = 'success') => {
    setToast(msg);
    setToastType(type);
    setTimeout(() => setToast(''), 3200);
  };

  // ── Fetch comments from real database ─────────────────────────────────────
  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/comments`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error('[CommentsManagement] loadComments error:', err);
      showToast('Could not reach database — showing cached data.', 'error');
      // Fallback to localStorage only if DB is unreachable
      try {
        const saved = localStorage.getItem('psp_comments');
        setComments(saved ? JSON.parse(saved) : []);
      } catch {
        setComments([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadComments(); }, []);

  // ── Delete single comment ─────────────────────────────────────────────────
  const handleDeleteOne = async (id) => {
    const reverted = [...comments];
    setComments(prev => prev.filter(c => c.id !== id));
    setConfirmId(null);

    try {
      const res = await fetch(`${API}/api/comments/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('Review removed successfully.');
    } catch (err) {
      console.error('[CommentsManagement] deleteOne error:', err);
      setComments(reverted);
      showToast('Failed to delete — database error. Please try again.', 'error');
    }
  };

  // ── Delete all comments ───────────────────────────────────────────────────
  const handleDeleteAll = async () => {
    const reverted = [...comments];
    setComments([]);
    setConfirmAll(false);

    try {
      const res = await fetch(`${API}/api/comments`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast('All customer reviews have been cleared.');
      // Also clear localStorage cache
      try { localStorage.removeItem('psp_comments'); } catch {}
    } catch (err) {
      console.error('[CommentsManagement] deleteAll error:', err);
      setComments(reverted);
      showToast('Failed to clear — database error. Please try again.', 'error');
    }
  };

  const avgRating = comments.length
    ? (comments.reduce((s, c) => s + (c.rating || 0), 0) / comments.length).toFixed(1)
    : '–';

  return (
    <div className="bg-white rounded-2xl border border-gray-300/90 shadow-md shadow-gray-500 overflow-hidden">

      {confirmId !== null && (
        <ConfirmDialog
          message="This will permanently remove this customer review from the database."
          onConfirm={() => handleDeleteOne(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {confirmAll && (
        <ConfirmDialog
          message={`This will permanently delete all ${comments.length} customer reviews from the database.`}
          onConfirm={handleDeleteAll}
          onCancel={() => setConfirmAll(false)}
        />
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 text-white text-sm font-semibold px-4 py-3 rounded-xl shadow-lg animate-fadeUp ${toastType === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
          {toastType === 'error' ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-slate-50/60 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-xl font-black tracking-normal text-blue-800 uppercase">Customer Comments</h4>
            <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">Admin Only</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Reviews submitted on the storefront — synced live with MySQL database</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[11px] font-bold text-slate-600">
            <span className="flex items-center gap-1 text-xs">
              <MessageSquare size={11} className="text-blue-500" />
              {loading ? '…' : comments.length} reviews
            </span>
            <span className="w-px h-3 bg-slate-300" />
            <span className="flex items-center gap-1 text-xs">
              <Star size={11} className="text-yellow-500" />
              {loading ? '…' : avgRating} avg
            </span>
          </div>

          <button
            onClick={loadComments}
            disabled={loading}
            className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 text-xs font-bold px-3 py-2 rounded-xl transition disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          {!loading && comments.length > 0 && (
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
      {loading ? (
        <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
          <RefreshCw size={28} className="animate-spin opacity-40" />
          <p className="text-sm font-medium text-slate-500">Loading reviews from database…</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
          <MessageSquare size={36} className="opacity-25" />
          <p className="text-sm font-medium text-slate-500">No customer reviews yet.</p>
          <p className="text-xs">Reviews submitted on the storefront will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-blue-800 font-extrabold uppercase tracking-wider text-[12px] border-b border-gray-100">
                <th className="py-3 px-5">#</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Rating</th>
                <th className="py-3 px-5">Comment</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
              {comments.map((c, idx) => (
                <tr key={c.id} className="hover:bg-slate-100 transition duration-150 group">
                  <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">{idx + 1}</td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${getAvatarColor(c.username)} flex items-center justify-center text-[10px] font-black text-white flex-shrink-0`}>
                        {c.username ? c.username[0].toUpperCase() : '?'}
                      </div>
                      <span className="font-bold whitespace-nowrap">{c.username || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-xs tracking-tighter">
                        {'★'.repeat(c.rating || 0)}{'☆'.repeat(5 - (c.rating || 0))}
                      </span>
                      <span className="text-[10px] font-bold ml-0.5">{c.rating}/5</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 max-w-xs">
                    <p className="leading-relaxed line-clamp-2 text-slate-700">"{c.comment}"</p>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap text-slate-500">{c.date || '—'}</td>
                  <td className="py-3.5 px-5 text-center">
                    <button
                      onClick={() => setConfirmId(c.id)}
                      className="inline-flex items-center gap-1 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition opacity-0 group-hover:opacity-100"
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

      {!loading && comments.length > 0 && (
        <div className="px-5 py-3 bg-slate-50 border-t border-gray-100 text-[10px] text-slate-400 font-medium">
          ⚠️ Deleting a review here removes it from the MySQL database and the live storefront immediately.
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
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch ALL orders from real database ──────────────────────────────────
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/orders`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setOrders(data);
        // Keep localStorage in sync as a cache only
        try { localStorage.setItem('psp_market_order_history', JSON.stringify(data)); } catch {}
      } catch (err) {
        console.error('Failed to fetch orders from DB:', err);
        // Fallback to localStorage cache
        try {
          const saved = localStorage.getItem('psp_market_order_history');
          if (saved) setOrders(JSON.parse(saved));
        } catch {}
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    // Refresh every 30s so admin sees new orders without manual reload
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const safeNum = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  const totalRevenue  = orders.reduce((sum, order) => sum + safeNum(order.total), 0);
  const totalProducts = products.length;
  const totalOrders   = orders.length;
  const uniqueUsers   = new Set(orders.map(order => order.accountEmail || 'Guest')).size;

  const revenueTimeline = orders.reduce((acc, order) => {
    const dateStr  = order.date ? order.date.split(' at')[0] : 'Unknown';
    const existing = acc.find(item => item.date === dateStr);
    if (existing) {
      existing.Sales  += safeNum(order.total);
      existing.Orders += 1;
    } else {
      acc.push({ date: dateStr, Sales: safeNum(order.total), Orders: 1 });
    }
    return acc;
  }, []).reverse();

  const userSalesData = orders.reduce((acc, order) => {
    const email      = order.accountEmail || 'Anonymous/Guest';
    const existing   = acc.find(item => item.email === email);
    const itemsCount = order.items
      ? order.items.reduce((sum, item) => sum + safeNum(item.quantity), 0)
      : 0;
    if (existing) {
      existing.TotalSpent     += safeNum(order.total);
      existing.ProductsBought += itemsCount;
    } else {
      acc.push({ email, TotalSpent: safeNum(order.total), ProductsBought: itemsCount });
    }
    return acc;
  }, []);

  return (
    <div className="shadow-xl shadow-blue-800 space-y-3 font-sans pb-12 bg-slate-300 p-4 sm:p-6 rounded-3xl border border-slate-100">

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .animate-fadeUp { animation: fadeUp 0.25s ease both; }
        .line-clamp-2 { display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      `}</style>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-3xl font-black text-blue-800 tracking-tight flex items-center gap-2">
            <Activity className="text-blue-600 animate-pulse" size={24} />
            PSP MARKET OVERVIEW
          </h1>
          {loading && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <RefreshCw size={11} className="animate-spin" /> Loading live data from database…
            </p>
          )}
        </div>
        <div className="flex items-self-start md:items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-bold text-slate-600 shadow-xs">
          <Calendar size={14} className="text-blue-500" />
          Live data · refreshes every 30s
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-emerald-500 hover:shadow-md transition duration-300">
          <div className="space-y-2">
            <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Revenue</p>
            <h3 className="text-2xl font-black text-slate-900">
              {loading ? <span className="text-slate-400 text-base">Loading…</span> : `$${totalRevenue.toFixed(2)}`}
            </h3>
          </div>
          <div className="p-3.5 bg-emerald-50 text-blue-800 rounded-xl group-hover:bg-blue-800/50 group-hover:text-white transition duration-300">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-blue-500 hover:shadow-md transition duration-300">
          <div className="space-y-2">
            <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Products</p>
            <h3 className="text-2xl font-black text-slate-900">{totalProducts} <span className="text-xs text-gray-400 font-bold">Units</span></h3>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition duration-300">
            <Package className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-amber-500 hover:shadow-md transition duration-300">
          <div className="space-y-2">
            <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Orders</p>
            <h3 className="text-2xl font-black text-slate-900">
              {loading ? <span className="text-slate-400 text-base">Loading…</span> : <>{totalOrders} <span className="text-xs text-gray-400 font-bold">Records</span></>}
            </h3>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition duration-300">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between group hover:border-purple-500 hover:shadow-md transition duration-300">
          <div className="space-y-2">
            <p className="text-xl text-blue-800 pb-5 font-extrabold uppercase tracking-normal">Clients</p>
            <h3 className="text-2xl font-black text-slate-900">
              {loading ? <span className="text-slate-400 text-base">Loading…</span> : <>{uniqueUsers} <span className="text-xs text-gray-400 font-bold">Accounts</span></>}
            </h3>
          </div>
          <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition duration-300">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-300/90 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md">Model 1</span>
            <h4 className="text-sm font-bold text-slate-600 mt-5">Linear Financial Accumulation Stream</h4>
          </div>
          <div className="h-64 w-full text-[10px]">
            {loading ? (
              <div className="h-full flex items-center justify-center gap-2 text-slate-400">
                <RefreshCw size={16} className="animate-spin" /><span className="text-sm">Loading chart data…</span>
              </div>
            ) : revenueTimeline.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">
                No orders recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tickLine={false} stroke="#94a3b8" />
                  <YAxis tickLine={false} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', fontFamily: 'sans-serif' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="Sales" stroke="#2563eb" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-md uppercase font-black tracking-widest text-blue-800 bg-blue-800/20 px-3 py-0.5 rounded-md">Model 2</span>
            <h4 className="text-sm font-bold text-slate-700 mt-5">Client Authorization Matrix Analytics</h4>
          </div>
          <div className="h-64 w-full text-[10px]">
            {loading ? (
              <div className="h-full flex items-center justify-center gap-2 text-slate-400">
                <RefreshCw size={16} className="animate-spin" /><span className="text-sm">Loading chart data…</span>
              </div>
            ) : userSalesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">
                No verified system identity metrics loaded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="email" tickLine={false} stroke="#94a3b8" tickFormatter={(tick) => tick.split('@')[0]} />
                  <YAxis tickLine={false} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    formatter={(value, name) => [
                      name === 'TotalSpent' ? `$${value.toFixed(2)}` : `${value} units`,
                      name === 'TotalSpent' ? 'Total Spent' : 'Items Bought',
                    ]}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ paddingBottom: '10px' }} />
                  <Bar dataKey="TotalSpent"     name="Total Spent ($)"    fill="#4f46e5" radius={[4,4,0,0]} barSize={18} />
                  <Bar dataKey="ProductsBought" name="Items Bought (Qty)" fill="#a855f7" radius={[4,4,0,0]} barSize={18} />
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
            <h4 className="text-xl uppercase font-black tracking-widest text-blue-800">CLIENT OPERATION</h4>
            <p className="text-xs text-slate-500 mt-0.5">All data sourced live from MySQL database</p>
          </div>
          <span className="text-[10px] font-bold text-slate-700 bg-white border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <ShieldCheck size={12} className="text-blue-600" /> Records: {loading ? '…' : userSalesData.length}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-blue-800 font-extrabold uppercase tracking-normal text-[12px] border-b border-gray-200">
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Name</th>
                <th className="py-3.5 px-6 text-center">Quantity</th>
                <th className="py-3.5 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-400">
                      <RefreshCw size={16} className="animate-spin" />
                      <span className="text-sm">Loading from database…</span>
                    </div>
                  </td>
                </tr>
              ) : userSalesData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-gray-400 italic bg-slate-50/10">
                    No orders in database yet.
                  </td>
                </tr>
              ) : (
                userSalesData.map((user, idx) => {
                  const matchingOrder = orders.find(o => (o.accountEmail || 'Anonymous/Guest') === user.email);
                  const clientName    = matchingOrder ? matchingOrder.customerName : 'Walk-in Client';
                  return (
                    <tr key={idx} className="hover:bg-slate-400 transition duration-150">
                      <td className="py-4 px-6 font-bold text-slate-900 flex items-center gap-2">
                        <Mail size={13} className="text-gray-400 font-normal" />
                        {user.email}
                      </td>
                      <td className="py-4 px-6 text-black font-semibold">{clientName}</td>
                      <td className="py-4 px-6 text-center font-bold">
                        <span className="bg-slate-100 font-mono text-black px-2.5 py-0.5 rounded-lg text-[11px] border border-slate-200/40">
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

      {/* CUSTOMER REVIEWS MANAGEMENT */}
      <CommentsManagement />
    </div>
  );
}