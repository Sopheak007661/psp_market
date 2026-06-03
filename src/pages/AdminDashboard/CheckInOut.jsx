// import React, { useContext, useState, useEffect, useRef } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import {
//   Clock, LogIn, LogOut, Search, UserCheck,
//   UserX, ShieldAlert, Calendar, RefreshCw,
//   Trash2, X, Plus, BarChart2
// } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer
// } from 'recharts';

// const DEFAULT_LOGS = [
//   { id: 'LOG-8812', name: 'Phy Sopheak',  role: 'Admin',            checkIn: '08:00 AM', checkOut: '--:--',   status: 'Active'    },
//   { id: 'LOG-8813', name: 'Sok Theara',   role: 'Manager',          checkIn: '08:30 AM', checkOut: '05:00 PM', status: 'Completed' },
//   { id: 'LOG-8814', name: 'Chan Nika',    role: 'Customer Support', checkIn: '09:00 AM', checkOut: '--:--',   status: 'Active'    },
//   { id: 'LOG-8815', name: 'Keo Rotha',    role: 'Moderator',        checkIn: '01:00 PM', checkOut: '05:30 PM', status: 'Completed' },
// ];

// export default function CheckInOut() {
//   const { usersData } = useContext(ShopContext) || {};

//   const [logs, setLogs]           = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSyncing, setIsSyncing]  = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   /* ── load from localStorage ── */
//   useEffect(() => {
//     const saved = localStorage.getItem('psp_shift_attendance_logs');
//     if (saved) {
//       try { setLogs(JSON.parse(saved)); } catch { setLogs(DEFAULT_LOGS); }
//     } else {
//       setLogs(DEFAULT_LOGS);
//       localStorage.setItem('psp_shift_attendance_logs', JSON.stringify(DEFAULT_LOGS));
//     }
//   }, []);

//   const persist = (updated) => {
//     setLogs(updated);
//     localStorage.setItem('psp_shift_attendance_logs', JSON.stringify(updated));
//   };

//   /* ── helpers ── */
//   const timeNow = () =>
//     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   const triggerSync = () => {
//     setIsSyncing(true);
//     setTimeout(() => setIsSyncing(false), 600);
//   };

//   /* ── actions ── */
//   const handleCheckIn = (staffName, staffRole) => {
//     const newLog = {
//       id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
//       name: staffName,
//       role: staffRole || 'Staff Member',
//       checkIn: timeNow(),
//       checkOut: '--:--',
//       status: 'Active',
//     };
//     persist([newLog, ...logs]);
//   };

//   const handleCheckOut = (logId) => {
//     persist(
//       logs.map((log) =>
//         log.id === logId ? { ...log, checkOut: timeNow(), status: 'Completed' } : log
//       )
//     );
//   };

//   const handleRemoveOne = (logId) => {
//     persist(logs.filter((log) => log.id !== logId));
//   };

//   const handleClearAll = () => {
//     persist([]);
//     setShowConfirm(false);
//   };

//   /* ── derived stats ── */
//   const activeCheckIns   = logs.filter((l) => l.status === 'Active').length;
//   const completedShifts  = logs.filter((l) => l.status === 'Completed').length;

//   const filteredLogs = logs.filter(
//     (log) =>
//       log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   /* ── chart data: group by role ── */
//   const chartData = (() => {
//     const map = {};
//     logs.forEach((l) => {
//       if (!map[l.role]) map[l.role] = { role: l.role, 'Check-In': 0, 'Check-Out': 0 };
//       map[l.role]['Check-In']++;
//       if (l.status === 'Completed') map[l.role]['Check-Out']++;
//     });
//     return Object.values(map);
//   })();

//   /* ── today's date string ── */
//   const today = new Date().toLocaleDateString('en-US', {
//     month: 'long', day: 'numeric', year: 'numeric',
//   });

//   return (
//     <div className="space-y-6 font-sans pb-10">

//       {/* ── HEADER ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
//             <Clock className="text-blue-800" size={24} />
//             SHIFT MANAGEMENT GATEWAY
//           </h1>
//           <p className="text-gray-400 text-xs mt-1 font-medium">
//             Track operational staff duty timelines, attendance registers, and login connectivity metrics.
//           </p>
//         </div>
//         <button
//           onClick={() => handleCheckIn('Phy Sopheak', 'Admin')}
//           className="bg-blue-800 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
//         >
//           <LogIn size={14} />
//           <span>Simulate Admin Check-In</span>
//         </button>
//       </div>

//       {/* ── METRIC CARDS ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Active Shifts on Duty</span>
//             <p className="text-2xl font-black text-emerald-900 mt-0.5">{activeCheckIns} Staff</p>
//           </div>
//           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
//             <UserCheck size={20} />
//           </div>
//         </div>

//         <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Completed Logs Today</span>
//             <p className="text-2xl font-black text-slate-800 mt-0.5">{completedShifts} Records</p>
//           </div>
//           <div className="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center">
//             <UserX size={20} />
//           </div>
//         </div>

//         <div className="p-4 bg-blue-50/30 border border-blue-100/80 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">System Clock Stream</span>
//             <p className="text-sm font-black text-blue-900 mt-1 uppercase flex items-center gap-1.5">
//               <Calendar size={13} className="text-blue-400" />
//               {today}
//             </p>
//           </div>
//           <button onClick={triggerSync} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
//             <RefreshCw size={15} className={`text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
//           </button>
//         </div>
//       </div>

//       {/* ── ATTENDANCE CHART ── */}
//       <div className="bg-white border border-gray-100 rounded-2xl shadow-xs overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center gap-2">
//           <BarChart2 size={16} className="text-blue-700" />
//           <div>
//             <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance Overview by Role</h2>
//             <p className="text-[11px] text-gray-400 mt-0.5">Check-In vs Check-Out count grouped per staff role.</p>
//           </div>
//         </div>

//         {chartData.length === 0 ? (
//           <div className="py-12 text-center text-slate-400 text-xs italic">No data to display.</div>
//         ) : (
//           <div className="px-4 pt-4 pb-2">
//             <ResponsiveContainer width="100%" height={220}>
//               <BarChart data={chartData} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                 <XAxis
//                   dataKey="role"
//                   tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <YAxis
//                   allowDecimals={false}
//                   tick={{ fontSize: 10, fill: '#94a3b8' }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <Tooltip
//                   contentStyle={{
//                     fontSize: 11,
//                     borderRadius: 10,
//                     border: '1px solid #e2e8f0',
//                     boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
//                   }}
//                 />
//                 <Legend
//                   wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
//                   iconType="circle"
//                   iconSize={8}
//                 />
//                 <Bar dataKey="Check-In"  fill="#10b981" radius={[4,4,0,0]} maxBarSize={40} />
//                 <Bar dataKey="Check-Out" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={40} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>

//       {/* ── SEARCH + CLEAR ALL ── */}
//       <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center gap-3">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//           <input
//             type="text"
//             placeholder="Filter by employee name or log ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-200/80 rounded-xl focus:outline-none focus:border-blue-800 bg-slate-50/50 text-xs font-semibold text-slate-700"
//           />
//         </div>

//         {/* Clear All button + confirm */}
//         {!showConfirm ? (
//           <button
//             onClick={() => setShowConfirm(true)}
//             disabled={logs.length === 0}
//             className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-tight px-3 py-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer"
//           >
//             <Trash2 size={13} />
//             Clear All Logs
//           </button>
//         ) : (
//           <div className="flex items-center gap-2">
//             <span className="text-[11px] text-slate-500 font-semibold">Are you sure?</span>
//             <button
//               onClick={handleClearAll}
//               className="text-[11px] font-black uppercase px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition active:scale-95 cursor-pointer"
//             >
//               Yes, clear
//             </button>
//             <button
//               onClick={() => setShowConfirm(false)}
//               className="text-[11px] font-black uppercase px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95 cursor-pointer"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </div>

//       {/* ── MAIN TABLE ── */}
//       <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
//           <div>
//             <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Terminal Operational Logs</h2>
//             <p className="text-[11px] text-gray-400 mt-0.5">Monitors direct gateway clock access timestamps and administrative status reports.</p>
//           </div>
//           <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
//             Total: {filteredLogs.length}
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse text-xs">
//             <thead>
//               <tr className="border-b border-gray-100 bg-slate-50/60 text-gray-400 font-black uppercase text-[10px] tracking-wider">
//                 <th className="py-3 px-5">Transaction ID</th>
//                 <th className="py-3 px-5">Employee / Role</th>
//                 <th className="py-3 px-5">Check-In</th>
//                 <th className="py-3 px-5">Check-Out</th>
//                 <th className="py-3 px-5">Status</th>
//                 <th className="py-3 px-5 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="text-slate-600 font-medium divide-y divide-gray-100">
//               {filteredLogs.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="py-12 text-center text-slate-400 italic text-xs">
//                     No attendance logs found matching current filters.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredLogs.map((log) => (
//                   <tr key={log.id} className="hover:bg-slate-50/40 transition duration-150">

//                     {/* ID */}
//                     <td className="py-3.5 px-5 font-mono text-slate-400 font-bold text-[11px]">
//                       #{log.id}
//                     </td>

//                     {/* NAME + ROLE */}
//                     <td className="py-3.5 px-5">
//                       <div className="flex flex-col">
//                         <span className="font-black text-slate-900 text-xs">{log.name}</span>
//                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{log.role}</span>
//                       </div>
//                     </td>

//                     {/* CHECK IN */}
//                     <td className="py-3.5 px-5 font-semibold font-mono">
//                       <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
//                         <LogIn size={10} className="text-emerald-600" /> {log.checkIn}
//                       </span>
//                     </td>

//                     {/* CHECK OUT */}
//                     <td className="py-3.5 px-5 font-semibold font-mono">
//                       <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] ${log.checkOut === '--:--' ? 'text-slate-300' : 'bg-slate-100'}`}>
//                         <LogOut size={10} className={log.checkOut === '--:--' ? 'text-slate-300' : 'text-rose-500'} />
//                         {log.checkOut}
//                       </span>
//                     </td>

//                     {/* STATUS */}
//                     <td className="py-3.5 px-5">
//                       {log.status === 'Active' ? (
//                         <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-600 font-bold rounded-md border border-emerald-100">
//                           <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
//                           Active Duty
//                         </span>
//                       ) : (
//                         <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 font-bold rounded-md border border-slate-200/50">
//                           Shift Closed
//                         </span>
//                       )}
//                     </td>

//                     {/* ACTIONS */}
//                     <td className="py-3.5 px-5">
//                       <div className="flex items-center justify-end gap-2">
//                         {log.status === 'Active' && (
//                           <button
//                             onClick={() => handleCheckOut(log.id)}
//                             className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 font-black text-[10px] px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer uppercase tracking-tight"
//                           >
//                             Clock Out
//                           </button>
//                         )}
//                         {log.status === 'Completed' && (
//                           <span className="text-[10px] text-slate-300 italic font-medium">Archived</span>
//                         )}
//                         {/* Per-row delete */}
//                         <button
//                           onClick={() => handleRemoveOne(log.id)}
//                           title="Remove this log"
//                           className="p-1 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-colors active:scale-95 cursor-pointer"
//                         >
//                           <X size={13} />
//                         </button>
//                       </div>
//                     </td>

//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   );
// }




















// import React, { useContext, useState, useEffect, useRef } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { QRCodeSVG } from 'qrcode.react';
// import {
//   Clock, LogIn, LogOut, Search, UserCheck,
//   UserX, Calendar, RefreshCw, Trash2, X,
//   BarChart2, QrCode, Download, Copy, Check, User,
// } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';

// export const STORAGE_KEY = 'psp_shift_attendance_logs';
// const SITE_URL = 'https://pspmartonline.netlify.app';

// const DEFAULT_LOGS = [
//   { id: 'LOG-8812', name: 'Phy Sopheak',  role: 'Admin',            checkIn: '08:00 AM', checkOut: '--:--',   status: 'Active',    date: '' },
//   { id: 'LOG-8813', name: 'Sok Theara',   role: 'Manager',          checkIn: '08:30 AM', checkOut: '05:00 PM', status: 'Completed', date: '' },
//   { id: 'LOG-8814', name: 'Chan Nika',    role: 'Customer Support', checkIn: '09:00 AM', checkOut: '--:--',   status: 'Active',    date: '' },
//   { id: 'LOG-8815', name: 'Keo Rotha',    role: 'Moderator',        checkIn: '01:00 PM', checkOut: '05:30 PM', status: 'Completed', date: '' },
// ];

// const ROLES = ['Staff', 'Admin', 'Manager', 'Moderator', 'Customer Support', 'Cashier', 'Warehouse'];

// /* ─────────────────────────────────────────────────
//    CheckIn Modal — shown when user scans QR code.
//    URL = https://pspmartonline.netlify.app?checkin=1
//    On that page we detect ?checkin=1, show this modal,
//    user fills name+role → submit → log written to
//    localStorage → redirect stays on SITE_URL.
//    When user leaves SITE_URL, visibilitychange /
//    beforeunload fires checkout via sendBeacon.
// ───────────────────────────────────────────────── */
// export function CheckInModal({ onClose, onCheckedIn }) {
//   const [name, setName]       = useState('');
//   const [role, setRole]       = useState('Staff');
//   const [nameErr, setNameErr] = useState('');

//   const timeNow = () =>
//     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   const handleSubmit = () => {
//     if (!name.trim()) { setNameErr('Please enter your name.'); return; }
//     const id     = `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
//     const newLog = {
//       id,
//       name: name.trim(),
//       role: role.trim() || 'Staff',
//       checkIn:  timeNow(),
//       checkOut: '--:--',
//       status:   'Active',
//       date:     new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
//     };
//     // Write to localStorage so admin dashboard picks it up
//     try {
//       const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
//       localStorage.setItem(STORAGE_KEY, JSON.stringify([newLog, ...existing]));
//     } catch {}

//     onCheckedIn(id);
//     onClose();
//   };

//   return (
//     /* Backdrop */
//     <div style={{
//       position: 'fixed', inset: 0, zIndex: 9999,
//       background: 'rgba(10,20,40,0.75)',
//       backdropFilter: 'blur(6px)',
//       display: 'flex', alignItems: 'center', justifyContent: 'center',
//       padding: '1rem',
//     }}>
//       {/* Card */}
//       <div style={{
//         width: '100%', maxWidth: 380,
//         background: '#0f2744',
//         border: '1px solid rgba(255,255,255,0.10)',
//         borderRadius: 24,
//         padding: '2rem',
//         fontFamily: '"DM Sans","Segoe UI",sans-serif',
//         boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
//       }}>
//         {/* Header */}
//         <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
//           <div style={{
//             width: 52, height: 52, borderRadius: '50%',
//             background: 'rgba(59,130,246,0.15)',
//             border: '1.5px solid rgba(59,130,246,0.3)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             margin: '0 auto 0.75rem',
//           }}>
//             <LogIn size={22} color="#60a5fa" />
//           </div>
//           <h2 style={{ fontSize: 18, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Staff Check-In</h2>
//           <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
//             {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
//           </p>
//         </div>

//         {/* Name input */}
//         <div style={{ marginBottom: 12 }}>
//           <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
//             Your Name *
//           </label>
//           <div style={{ position: 'relative' }}>
//             <User size={13} color="#475569" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
//             <input
//               type="text"
//               placeholder="Enter your full name"
//               value={name}
//               onChange={(e) => { setName(e.target.value); setNameErr(''); }}
//               onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
//               autoFocus
//               style={{
//                 width: '100%', boxSizing: 'border-box',
//                 background: 'rgba(255,255,255,0.06)',
//                 border: `1.5px solid ${nameErr ? '#f87171' : 'rgba(255,255,255,0.12)'}`,
//                 borderRadius: 12, padding: '10px 12px 10px 32px',
//                 fontSize: 13, color: '#f1f5f9', outline: 'none',
//               }}
//             />
//           </div>
//           {nameErr && <p style={{ fontSize: 10, color: '#f87171', marginTop: 3 }}>{nameErr}</p>}
//         </div>

//         {/* Role select */}
//         <div style={{ marginBottom: 20 }}>
//           <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
//             Role
//           </label>
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             style={{
//               width: '100%',
//               background: 'rgba(255,255,255,0.06)',
//               border: '1.5px solid rgba(255,255,255,0.12)',
//               borderRadius: 12, padding: '10px 12px',
//               fontSize: 13, color: '#f1f5f9', outline: 'none',
//             }}
//           >
//             {ROLES.map((r) => (
//               <option key={r} value={r} style={{ background: '#0f2744' }}>{r}</option>
//             ))}
//           </select>
//         </div>

//         {/* Submit */}
//         <button
//           onClick={handleSubmit}
//           style={{
//             width: '100%', padding: '12px',
//             background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
//             border: 'none', borderRadius: 14,
//             fontSize: 14, fontWeight: 800, color: '#fff',
//             cursor: 'pointer',
//             boxShadow: '0 4px 20px rgba(37,99,235,0.35)',
//           }}
//         >
//           Check In & Enter Site
//         </button>
//         <p style={{ fontSize: 10, color: '#334155', textAlign: 'center', marginTop: 10 }}>
//           Leaving the site will automatically record your check-out.
//         </p>
//       </div>
//     </div>
//   );
// }

// /* ─────────────────────────────────────────────────
//    Main Admin Dashboard Component
// ───────────────────────────────────────────────── */
// export default function CheckInOut() {
//   const { usersData } = useContext(ShopContext) || {};

//   const [logs, setLogs]               = useState([]);
//   const [searchTerm, setSearchTerm]   = useState('');
//   const [isSyncing, setIsSyncing]     = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [copied, setCopied]           = useState(false);
//   const [activeTab, setActiveTab]     = useState('table');
//   const [showModal, setShowModal]     = useState(false); // preview modal for admin

//   // The QR code points to your site with ?checkin=1 so the site knows to show the modal
//   const qrUrl = `${SITE_URL}?checkin=1`;

//   const loadLogs = () => {
//     try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
//   };

//   useEffect(() => {
//     const init = loadLogs();
//     if (!init.length) {
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LOGS));
//       setLogs(DEFAULT_LOGS);
//     } else {
//       setLogs(init);
//     }
//     // Poll every 3 s to pick up real-time QR scan check-ins
//     const iv = setInterval(() => setLogs(loadLogs()), 3000);
//     return () => clearInterval(iv);
//   }, []);

//   const persist = (updated) => {
//     setLogs(updated);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//   };

//   const timeNow = () =>
//     new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   const today = new Date().toLocaleDateString('en-US', {
//     month: 'long', day: 'numeric', year: 'numeric',
//   });

//   const triggerSync = () => {
//     setLogs(loadLogs());
//     setIsSyncing(true);
//     setTimeout(() => setIsSyncing(false), 600);
//   };

//   const copyLink = () => {
//     navigator.clipboard.writeText(qrUrl).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   const handleCheckIn = (staffName, staffRole) => {
//     const newLog = {
//       id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
//       name: staffName, role: staffRole || 'Staff Member',
//       checkIn: timeNow(), checkOut: '--:--',
//       status: 'Active',
//       date: today,
//     };
//     persist([newLog, ...logs]);
//   };

//   const handleCheckOut    = (id) => persist(logs.map((l) => l.id === id ? { ...l, checkOut: timeNow(), status: 'Completed' } : l));
//   const handleRemoveOne   = (id) => persist(logs.filter((l) => l.id !== id));
//   const handleClearAll    = ()   => { persist([]); setShowConfirm(false); };

//   const activeCount    = logs.filter((l) => l.status === 'Active').length;
//   const completedCount = logs.filter((l) => l.status === 'Completed').length;

//   const filteredLogs = logs.filter(
//     (l) => l.name.toLowerCase().includes(searchTerm.toLowerCase()) || l.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const chartData = (() => {
//     const map = {};
//     logs.forEach((l) => {
//       if (!map[l.role]) map[l.role] = { role: l.role, 'Check-In': 0, 'Check-Out': 0 };
//       map[l.role]['Check-In']++;
//       if (l.status === 'Completed') map[l.role]['Check-Out']++;
//     });
//     return Object.values(map);
//   })();

//   const exportCSV = () => {
//     const header = ['ID','Name','Role','Date','Check-In','Check-Out','Status'];
//     const rows   = logs.map((l) => [l.id, l.name, l.role, l.date || today, l.checkIn, l.checkOut, l.status]);
//     const csv    = [header, ...rows].map((r) => r.join(',')).join('\n');
//     const a      = Object.assign(document.createElement('a'), {
//       href:     URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
//       download: `attendance_${new Date().toISOString().slice(0,10)}.csv`,
//     });
//     a.click();
//   };

//   return (
//     <div className="space-y-6 font-sans pb-10">

//       {/* Admin preview modal */}
//       {showModal && (
//         <CheckInModal
//           onClose={() => setShowModal(false)}
//           onCheckedIn={(id) => {
//             // Reload logs after modal submits
//             setTimeout(() => setLogs(loadLogs()), 200);
//           }}
//         />
//       )}

//       {/* HEADER */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
//             <Clock className="text-blue-800" size={24} />
//             SHIFT MANAGEMENT GATEWAY
//           </h1>
//           <p className="text-gray-400 text-xs mt-1 font-medium">
//             Track operational staff duty timelines, attendance registers, and login connectivity metrics.
//           </p>
//         </div>
//         <button
//           onClick={() => handleCheckIn('Phy Sopheak', 'Admin')}
//           className="bg-blue-800 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
//         >
//           <LogIn size={14} />
//           <span>Simulate Admin Check-In</span>
//         </button>
//       </div>

//       {/* METRIC CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center justify-between">
//           <div>
//             <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Active Shifts</span>
//             <p className="text-2xl font-black text-emerald-900 mt-0.5">{activeCount} Staff</p>
//           </div>
//           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><UserCheck size={20} /></div>
//         </div>
//         <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between">
//           <div>
//             <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Completed Today</span>
//             <p className="text-2xl font-black text-slate-800 mt-0.5">{completedCount} Records</p>
//           </div>
//           <div className="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center"><UserX size={20} /></div>
//         </div>
//         <div className="p-4 bg-blue-50/30 border border-blue-100/80 rounded-2xl flex items-center justify-between">
//           <div>
//             <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">System Clock</span>
//             <p className="text-sm font-black text-blue-900 mt-1 flex items-center gap-1.5">
//               <Calendar size={13} className="text-blue-400" />{today}
//             </p>
//           </div>
//           <button onClick={triggerSync} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
//             <RefreshCw size={15} className={`text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
//           </button>
//         </div>
//       </div>

//       {/* QR CODE PANEL */}
//       <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center gap-2">
//           <QrCode size={16} className="text-blue-700" />
//           <div>
//             <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Staff Check-In QR Code</h2>
//             <p className="text-[11px] text-gray-400 mt-0.5">
//               Staff scan → popup asks for name &amp; role → enters site → leaving auto-triggers check-out.
//             </p>
//           </div>
//         </div>

//         <div className="p-6 flex flex-col sm:flex-row items-center gap-8">
//           {/* QR */}
//           <div className="flex-shrink-0 p-4 border-2 border-dashed border-blue-100 rounded-2xl bg-blue-50/20">
//             <QRCodeSVG value={qrUrl} size={160} bgColor="#ffffff" fgColor="#1e3a5f" level="H" includeMargin={false} />
//           </div>

//           {/* Info */}
//           <div className="flex-1 space-y-4">
//             <div>
//               <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">QR Destination URL</p>
//               <div className="flex items-center gap-2">
//                 <code className="text-xs font-mono bg-slate-100 text-blue-800 px-3 py-1.5 rounded-lg flex-1 truncate">{qrUrl}</code>
//                 <button onClick={copyLink} className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-600">
//                   {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
//                   {copied ? 'Copied' : 'Copy'}
//                 </button>
//               </div>
//             </div>

//             {/* Flow steps */}
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//               {[
//                 { step: '1', color: 'blue',    bg: 'bg-blue-50',    border: 'border-blue-100',    text: 'text-blue-600',    title: 'Scan QR',       desc: 'Staff scans code with phone' },
//                 { step: '2', color: 'emerald', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', title: 'Enter Details', desc: 'Popup asks name & role → Check In' },
//                 { step: '3', color: 'rose',    bg: 'bg-rose-50',    border: 'border-rose-100',    text: 'text-rose-500',    title: 'Auto Check-Out', desc: 'Leaving the site records checkout' },
//               ].map(({ step, bg, border, text, title, desc }) => (
//                 <div key={step} className={`p-3 ${bg} border ${border} rounded-xl`}>
//                   <div className="flex items-center gap-1.5 mb-1">
//                     <span className={`text-[9px] font-black ${text} bg-white rounded-full w-4 h-4 flex items-center justify-center border ${border}`}>{step}</span>
//                     <p className={`text-[10px] font-black uppercase ${text} tracking-wider`}>{title}</p>
//                   </div>
//                   <p className="text-[10px] text-slate-500">{desc}</p>
//                 </div>
//               ))}
//             </div>

//             {/* Preview button for admin */}
//             <button
//               onClick={() => setShowModal(true)}
//               className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-tight px-3 py-2 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition active:scale-95 cursor-pointer"
//             >
//               <QrCode size={12} /> Preview Check-In Modal
//             </button>

//             <p className="text-[10px] text-slate-400">
//               Admin dashboard auto-refreshes every 3 s to reflect live scans.
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ── HOW IT WORKS ON YOUR SITE ── */}
//       <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
//         <p className="text-[10px] font-black uppercase text-amber-600 tracking-wider mb-2">⚙ Setup Required in Your Site (App.jsx)</p>
//         <p className="text-xs text-slate-600 mb-2">
//           Add this snippet near the top of your <code className="bg-white px-1 rounded text-amber-700">App.jsx</code> so that when
//           staff land on <code className="bg-white px-1 rounded text-amber-700">?checkin=1</code>, the check-in modal pops up and
//           auto-checkout fires on page leave:
//         </p>
//         <pre className="text-[10px] bg-slate-900 text-emerald-300 p-3 rounded-xl overflow-x-auto leading-relaxed">{`// In App.jsx — paste inside your App() function:
// useEffect(() => {
//   const params = new URLSearchParams(window.location.search);
//   if (params.get('checkin') === '1') {
//     // Show the modal — store flag in sessionStorage so it only shows once
//     sessionStorage.setItem('show_checkin_modal', '1');
//     // Clean URL (remove ?checkin=1)
//     window.history.replaceState({}, '', window.location.pathname);
//   }
// }, []);

// // Then render <CheckInModal /> conditionally based on sessionStorage flag.
// // See the README snippet below for the full wiring.`}</pre>
//       </div>

//       {/* TABS */}
//       <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
//         {[['table','📋 Attendance Table'],['chart','📊 Chart View']].map(([tab, label]) => (
//           <button key={tab} onClick={() => setActiveTab(tab)}
//             className={`text-[11px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
//             {label}
//           </button>
//         ))}
//       </div>

//       {/* CHART */}
//       {activeTab === 'chart' && (
//         <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
//           <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center gap-2">
//             <BarChart2 size={16} className="text-blue-700" />
//             <div>
//               <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance by Role</h2>
//               <p className="text-[11px] text-gray-400 mt-0.5">Check-In vs Check-Out grouped per role.</p>
//             </div>
//           </div>
//           {chartData.length === 0 ? (
//             <p className="py-12 text-center text-xs italic text-slate-400">No data yet.</p>
//           ) : (
//             <div className="px-4 pt-4 pb-2">
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={chartData} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//                   <XAxis dataKey="role" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
//                   <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
//                   <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #e2e8f0' }} />
//                   <Legend wrapperStyle={{ fontSize: 10, paddingTop: 8 }} iconType="circle" iconSize={8} />
//                   <Bar dataKey="Check-In"  fill="#10b981" radius={[4,4,0,0]} maxBarSize={40} />
//                   <Bar dataKey="Check-Out" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={40} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </div>
//       )}

//       {/* TABLE */}
//       {activeTab === 'table' && (
//         <>
//           <div className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3">
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//               <input
//                 type="text"
//                 placeholder="Filter by name or log ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-200/80 rounded-xl focus:outline-none focus:border-blue-800 bg-slate-50/50 text-xs font-semibold text-slate-700"
//               />
//             </div>
//             <button onClick={exportCSV} className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-tight px-3 py-2 rounded-xl border border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100 transition active:scale-95 cursor-pointer">
//               <Download size={13} /> Export CSV
//             </button>
//             {!showConfirm ? (
//               <button onClick={() => setShowConfirm(true)} disabled={logs.length === 0}
//                 className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-tight px-3 py-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95 cursor-pointer">
//                 <Trash2 size={13} /> Clear All
//               </button>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <span className="text-[11px] text-slate-500 font-semibold">Are you sure?</span>
//                 <button onClick={handleClearAll} className="text-[11px] font-black uppercase px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition active:scale-95 cursor-pointer">Yes, clear</button>
//                 <button onClick={() => setShowConfirm(false)} className="text-[11px] font-black uppercase px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition active:scale-95 cursor-pointer">Cancel</button>
//               </div>
//             )}
//           </div>

//           {/* Excel-style table */}
//           <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//             <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance Register</h2>
//                 <p className="text-[11px] text-gray-400 mt-0.5">Live data — auto-updates from QR scans every 3 seconds.</p>
//               </div>
//               <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{filteredLogs.length} rows</span>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-xs" style={{ minWidth: 740 }}>
//                 <thead>
//                   <tr className="bg-slate-200/50">
//                     <th className="w-8 py-1 px-2 border-r border-slate-200 text-[9px] text-slate-300 font-bold text-center">#</th>
//                     {['A','B','C','D','E','F','G'].map((l) => (
//                       <th key={l} className="py-1 px-3 border-r border-slate-200 text-[9px] text-slate-300 font-bold text-center">{l}</th>
//                     ))}
//                   </tr>
//                   <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-600 font-black uppercase text-[10px] tracking-wider">
//                     <th className="py-2.5 px-2 border-r border-slate-100 bg-slate-100/60 text-slate-300 w-8 text-center"></th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Log ID</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Employee</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Role</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Date</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Check-In</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Check-Out</th>
//                     <th className="py-2.5 px-4 text-left">Status / Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredLogs.length === 0 ? (
//                     <tr><td colSpan="8" className="py-12 text-center text-slate-400 italic">No records found.</td></tr>
//                   ) : filteredLogs.map((log, idx) => (
//                     <tr key={log.id} className={`hover:bg-blue-50/30 transition duration-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
//                       <td className="py-2.5 px-2 text-center text-[10px] text-slate-300 border-r border-slate-100 bg-slate-50/60 font-bold select-none">{idx + 1}</td>
//                       <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400 font-bold border-r border-slate-100/80">{log.id}</td>
//                       <td className="py-2.5 px-4 font-black text-slate-900 text-[11px] border-r border-slate-100/80">{log.name}</td>
//                       <td className="py-2.5 px-4 border-r border-slate-100/80">
//                         <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{log.role}</span>
//                       </td>
//                       <td className="py-2.5 px-4 text-[10px] text-slate-500 font-mono border-r border-slate-100/80">{log.date || today}</td>
//                       <td className="py-2.5 px-4 border-r border-slate-100/80">
//                         <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded font-mono">
//                           <LogIn size={9} /> {log.checkIn}
//                         </span>
//                       </td>
//                       <td className="py-2.5 px-4 border-r border-slate-100/80">
//                         <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded font-mono ${log.checkOut === '--:--' ? 'text-slate-300' : 'bg-rose-50 text-rose-600'}`}>
//                           <LogOut size={9} /> {log.checkOut}
//                         </span>
//                       </td>
//                       <td className="py-2.5 px-4">
//                         <div className="flex items-center gap-2">
//                           {log.status === 'Active' ? (
//                             <>
//                               <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-100">
//                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" /> Active
//                               </span>
//                               <button onClick={() => handleCheckOut(log.id)}
//                                 className="text-[9px] font-black uppercase bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 px-2 py-0.5 rounded transition active:scale-95 cursor-pointer">
//                                 Clock Out
//                               </button>
//                             </>
//                           ) : (
//                             <span className="text-[9px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded">Closed</span>
//                           )}
//                           <button onClick={() => handleRemoveOne(log.id)} title="Delete row"
//                             className="p-0.5 text-slate-200 hover:text-rose-400 hover:bg-rose-50 rounded transition cursor-pointer">
//                             <X size={11} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 {filteredLogs.length > 0 && (
//                   <tfoot>
//                     <tr className="bg-slate-100/80 border-t-2 border-slate-200 text-[10px] font-black text-slate-500 uppercase">
//                       <td className="py-2 px-2 border-r border-slate-200 text-center text-slate-300">Σ</td>
//                       <td className="py-2 px-4 border-r border-slate-200" colSpan="3">Total: {filteredLogs.length} records</td>
//                       <td className="py-2 px-4 border-r border-slate-200" />
//                       <td className="py-2 px-4 border-r border-slate-200 text-emerald-600">{filteredLogs.filter(l => l.checkIn !== '--:--').length} checked in</td>
//                       <td className="py-2 px-4 border-r border-slate-200 text-rose-500">{filteredLogs.filter(l => l.checkOut !== '--:--').length} checked out</td>
//                       <td className="py-2 px-4">{activeCount} active · {completedCount} done</td>
//                     </tr>
//                   </tfoot>
//                 )}
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }






// import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { QRCodeSVG } from 'qrcode.react';
// import {
//   Clock, LogIn, LogOut, Search, UserCheck, UserX, Calendar,
//   RefreshCw, Trash2, X, BarChart2, QrCode, Download, Copy,
//   Check, User, Plus, Camera, ChevronDown, AlertCircle,
//   Briefcase, Star, Hash, Edit2, Save, Users,
// } from 'lucide-react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid,
//   Tooltip, Legend, ResponsiveContainer,
// } from 'recharts';

// /* ── Storage keys ────────────────────────────────────────── */
// export const STORAGE_KEY      = 'psp_shift_attendance_logs';
// const        STAFF_KEY        = 'psp_registered_staff';
// const        SITE_URL         = 'https://pspmartonline.netlify.app';

// /* ── Dropdowns ───────────────────────────────────────────── */
// const JOBS   = ['Admin','Manager','Cashier','Warehouse','Customer Support','Moderator','Security','Driver','Technician','Intern'];
// const SKILLS = ['Sales','Inventory','Customer Service','Logistics','IT Support','Data Entry','Marketing','Accounting','Operations','Leadership'];
// const DEPARTMENTS = ['Front Office','Back Office','Warehouse','IT','Finance','HR','Marketing','Operations'];

// /* ── ID generator ────────────────────────────────────────── */
// const genStaffId = () => `STF-${String(Date.now()).slice(-5)}`;
// const genLogId   = () => `LOG-${Math.floor(1000 + Math.random() * 9000)}`;
// const timeNow    = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// const dateToday  = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// /* ── Helpers ─────────────────────────────────────────────── */
// function loadStaff() {
//   try { return JSON.parse(localStorage.getItem(STAFF_KEY) || '[]'); } catch { return []; }
// }
// function saveStaff(arr) {
//   localStorage.setItem(STAFF_KEY, JSON.stringify(arr));
// }
// function loadLogs() {
//   try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
// }
// function saveLogs(arr) {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
// }

// /* ══════════════════════════════════════════════════════════
//    EXPORTED CheckInModal (for App.jsx SiteCheckInGate)
// ══════════════════════════════════════════════════════════ */
// export function CheckInModal({ onClose, onCheckedIn }) {
//   const [name, setName] = useState('');
//   const [role, setRole] = useState('Staff');
//   const [err,  setErr]  = useState('');

//   const handleSubmit = () => {
//     if (!name.trim()) { setErr('Please enter your name.'); return; }
//     const id     = genLogId();
//     const newLog = {
//       id, name: name.trim(), role,
//       checkIn: timeNow(), checkOut: '--:--',
//       status: 'Active',
//       date: dateToday(),
//     };
//     try {
//       const existing = loadLogs();
//       saveLogs([newLog, ...existing]);
//     } catch {}
//     onCheckedIn(id);
//     onClose();
//   };

//   return (
//     <div style={{
//       position:'fixed',inset:0,zIndex:9999,
//       background:'rgba(10,20,40,0.80)',backdropFilter:'blur(6px)',
//       display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',
//     }}>
//       <div style={{
//         width:'100%',maxWidth:380,background:'#0f2744',
//         border:'1px solid rgba(255,255,255,0.10)',borderRadius:24,
//         padding:'2rem',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',
//       }}>
//         <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
//           <div style={{width:52,height:52,borderRadius:'50%',background:'rgba(59,130,246,0.15)',border:'1.5px solid rgba(59,130,246,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem'}}>
//             <LogIn size={22} color="#60a5fa"/>
//           </div>
//           <h2 style={{fontSize:18,fontWeight:800,color:'#f1f5f9',margin:0}}>Staff Check-In</h2>
//           <p style={{fontSize:11,color:'#64748b',marginTop:4}}>{dateToday()}</p>
//         </div>
//         <div style={{marginBottom:12}}>
//           <label style={{display:'block',fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Your Name *</label>
//           <input type="text" placeholder="Enter your full name" value={name}
//             onChange={e=>{setName(e.target.value);setErr('');}}
//             onKeyDown={e=>e.key==='Enter'&&handleSubmit()} autoFocus
//             style={{width:'100%',boxSizing:'border-box',background:'rgba(255,255,255,0.06)',border:`1.5px solid ${err?'#f87171':'rgba(255,255,255,0.12)'}`,borderRadius:12,padding:'10px 12px',fontSize:13,color:'#f1f5f9',outline:'none'}}/>
//           {err&&<p style={{fontSize:10,color:'#f87171',marginTop:3}}>{err}</p>}
//         </div>
//         <div style={{marginBottom:20}}>
//           <label style={{display:'block',fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Role</label>
//           <select value={role} onChange={e=>setRole(e.target.value)}
//             style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1.5px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'10px 12px',fontSize:13,color:'#f1f5f9',outline:'none'}}>
//             {JOBS.map(r=><option key={r} value={r} style={{background:'#0f2744'}}>{r}</option>)}
//           </select>
//         </div>
//         <button onClick={handleSubmit} style={{width:'100%',padding:'12px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',border:'none',borderRadius:14,fontSize:14,fontWeight:800,color:'#fff',cursor:'pointer'}}>
//           Check In & Enter Site
//         </button>
//         <p style={{fontSize:10,color:'#334155',textAlign:'center',marginTop:10}}>Leaving the site will automatically record your check-out.</p>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    STAFF REGISTRATION FORM
// ══════════════════════════════════════════════════════════ */
// function StaffForm({ onSave, onCancel, editing }) {
//   const [form, setForm] = useState(editing || { name:'', job:'Admin', skill:'Sales', department:'Front Office', note:'' });
//   const [err,  setErr]  = useState('');

//   const set = (k,v) => setForm(f=>({...f,[k]:v}));

//   const handleSave = () => {
//     if (!form.name.trim()) { setErr('Name is required.'); return; }
//     onSave(form);
//   };

//   return (
//     <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
//       <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
//         <User size={15} className="text-blue-600"/>
//         {editing ? 'Edit Staff Member' : 'Register New Staff'}
//       </h3>

//       {err && (
//         <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl mb-3">
//           <AlertCircle size={12}/> {err}
//         </div>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
//         {/* Name */}
//         <div>
//           <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Full Name *</label>
//           <div className="relative">
//             <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
//             <input type="text" placeholder="e.g. Sopheak Chan"
//               value={form.name} onChange={e=>{set('name',e.target.value);setErr('');}}
//               className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition"/>
//           </div>
//         </div>

//         {/* Job */}
//         <div>
//           <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Job Title</label>
//           <div className="relative">
//             <Briefcase size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
//             <select value={form.job} onChange={e=>set('job',e.target.value)}
//               className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition appearance-none">
//               {JOBS.map(j=><option key={j}>{j}</option>)}
//             </select>
//             <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
//           </div>
//         </div>

//         {/* Skill */}
//         <div>
//           <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Primary Skill</label>
//           <div className="relative">
//             <Star size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
//             <select value={form.skill} onChange={e=>set('skill',e.target.value)}
//               className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition appearance-none">
//               {SKILLS.map(s=><option key={s}>{s}</option>)}
//             </select>
//             <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
//           </div>
//         </div>

//         {/* Department */}
//         <div>
//           <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Department</label>
//           <div className="relative">
//             <Hash size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
//             <select value={form.department} onChange={e=>set('department',e.target.value)}
//               className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition appearance-none">
//               {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
//             </select>
//             <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
//           </div>
//         </div>
//       </div>

//       {/* Note */}
//       <div className="mb-4">
//         <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Note / Remark</label>
//         <textarea rows={2} placeholder="Optional notes about this staff member…"
//           value={form.note} onChange={e=>set('note',e.target.value)}
//           className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-500 transition resize-none"/>
//       </div>

//       <div className="flex gap-2">
//         <button onClick={handleSave}
//           className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-black uppercase px-4 py-2 rounded-xl transition active:scale-95">
//           <Save size={12}/> {editing ? 'Update' : 'Register & Generate QR'}
//         </button>
//         <button onClick={onCancel}
//           className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-black uppercase px-4 py-2 rounded-xl transition active:scale-95">
//           <X size={12}/> Cancel
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    STAFF CARD (shows QR + info)
// ══════════════════════════════════════════════════════════ */
// function StaffCard({ member, onDelete, onEdit, onManualCheckIn }) {
//   const [copied, setCopied] = useState(false);
//   const qrValue = `STAFF:${member.id}`;

//   const copy = () => {
//     navigator.clipboard.writeText(member.id).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1800);});
//   };

//   const JOB_COLORS = {
//     Admin:'bg-purple-50 text-purple-700 border-purple-100',
//     Manager:'bg-blue-50 text-blue-700 border-blue-100',
//     Cashier:'bg-emerald-50 text-emerald-700 border-emerald-100',
//     Warehouse:'bg-amber-50 text-amber-700 border-amber-100',
//     'Customer Support':'bg-pink-50 text-pink-700 border-pink-100',
//     Moderator:'bg-teal-50 text-teal-700 border-teal-100',
//     Security:'bg-red-50 text-red-700 border-red-100',
//     default:'bg-slate-50 text-slate-600 border-slate-200',
//   };
//   const jobColor = JOB_COLORS[member.job] || JOB_COLORS.default;

//   return (
//     <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
//       {/* Top strip */}
//       <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"/>

//       <div className="p-4">
//         {/* Header row */}
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex-1 min-w-0">
//             <p className="font-black text-slate-900 text-sm truncate">{member.name}</p>
//             <span className={`inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded-md border mt-0.5 ${jobColor}`}>
//               {member.job}
//             </span>
//           </div>
//           <div className="flex gap-1 ml-2">
//             <button onClick={()=>onEdit(member)} title="Edit" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition">
//               <Edit2 size={12}/>
//             </button>
//             <button onClick={()=>onDelete(member.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition">
//               <Trash2 size={12}/>
//             </button>
//           </div>
//         </div>

//         {/* QR code */}
//         <div className="flex justify-center mb-3">
//           <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
//             <QRCodeSVG value={qrValue} size={96} bgColor="#f8fafc" fgColor="#1e293b" level="M" includeMargin={false}/>
//           </div>
//         </div>

//         {/* ID */}
//         <div className="flex items-center gap-1.5 mb-3">
//           <code className="flex-1 text-[10px] font-mono bg-slate-100 text-blue-700 px-2 py-1 rounded-lg truncate">{member.id}</code>
//           <button onClick={copy} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-500">
//             {copied ? <Check size={11} className="text-emerald-500"/> : <Copy size={11}/>}
//           </button>
//         </div>

//         {/* Meta */}
//         <div className="space-y-1 mb-3">
//           <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
//             <Star size={9} className="text-amber-400 flex-shrink-0"/>
//             <span className="truncate">{member.skill}</span>
//           </div>
//           <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
//             <Hash size={9} className="text-slate-400 flex-shrink-0"/>
//             <span className="truncate">{member.department}</span>
//           </div>
//           {member.note && (
//             <div className="text-[10px] text-slate-400 italic truncate">{member.note}</div>
//           )}
//         </div>

//         {/* Manual check-in button */}
//         <button onClick={()=>onManualCheckIn(member)}
//           className="w-full flex items-center justify-center gap-1.5 text-[10px] font-black uppercase py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-100 hover:border-blue-600 transition active:scale-95">
//           <LogIn size={11}/> Manual Check-In
//         </button>
//       </div>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    QR SCANNER  — ref-based RAF loop, no stale closures
// ══════════════════════════════════════════════════════════ */
// function QRScanner({ onScan }) {
//   const videoRef    = useRef(null);
//   const canvasRef   = useRef(null);
//   const streamRef   = useRef(null);
//   const rafRef      = useRef(null);
//   const runningRef  = useRef(false);   // controls the RAF loop
//   const lastDataRef = useRef('');      // debounce: skip identical consecutive scans
//   const onScanRef   = useRef(onScan);  // always fresh callback, never stale
//   useEffect(() => { onScanRef.current = onScan; }, [onScan]);

//   const [active,  setActive]  = useState(false);
//   const [status,  setStatus]  = useState('');
//   const [libReady,setLibReady]= useState(!!window.jsQR);

//   /* Load jsQR once */
//   useEffect(() => {
//     if (window.jsQR) { setLibReady(true); return; }
//     const s = document.createElement('script');
//     s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
//     s.onload  = () => { setLibReady(true); };
//     s.onerror = () => setStatus('Failed to load QR library. Check internet connection.');
//     document.head.appendChild(s);
//   }, []);

//   /* RAF scan loop — pure refs, zero stale-closure risk */
//   const loop = useRef(null);
//   loop.current = () => {
//     if (!runningRef.current) return;
//     const video  = videoRef.current;
//     const canvas = canvasRef.current;
//     const fn     = window.jsQR;

//     if (!fn || !video || !canvas || video.readyState < 2 || video.videoWidth === 0) {
//       rafRef.current = requestAnimationFrame(loop.current);
//       return;
//     }

//     canvas.width  = video.videoWidth;
//     canvas.height = video.videoHeight;
//     const ctx = canvas.getContext('2d', { willReadFrequently: true });
//     ctx.drawImage(video, 0, 0);

//     let result = null;
//     try {
//       const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       result = fn(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'dontInvert' });
//     } catch {}

//     if (result && result.data) {
//       if (result.data !== lastDataRef.current) {
//         lastDataRef.current = result.data;
//         setStatus(`✓ Scanned: ${result.data}`);
//         onScanRef.current(result.data);
//         // Allow re-scan of same code after 3 s
//         setTimeout(() => { lastDataRef.current = ''; }, 3000);
//       }
//     }
//     rafRef.current = requestAnimationFrame(loop.current);
//   };

//   const stopCamera = () => {
//     runningRef.current = false;
//     if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
//     streamRef.current = null;
//     if (videoRef.current) videoRef.current.srcObject = null;
//     setActive(false);
//     setStatus('');
//     lastDataRef.current = '';
//   };

//   const startCamera = async () => {
//     if (!libReady) { setStatus('QR library still loading, please wait…'); return; }
//     setStatus('Requesting camera…');
//     try {
//       const constraints = {
//         video: {
//           facingMode: { ideal: 'environment' },
//           width:  { ideal: 1280 },
//           height: { ideal: 720 },
//         },
//       };
//       const stream = await navigator.mediaDevices.getUserMedia(constraints);
//       streamRef.current = stream;
//       const video = videoRef.current;
//       video.srcObject = stream;
//       video.setAttribute('playsinline', '');  // iOS Safari
//       await video.play();
//       runningRef.current = true;
//       setActive(true);
//       setStatus('Point camera at a staff QR code…');
//       rafRef.current = requestAnimationFrame(loop.current);
//     } catch (err) {
//       const msg = err.name === 'NotAllowedError'
//         ? 'Camera permission denied — allow camera access in browser settings.'
//         : err.name === 'NotFoundError'
//         ? 'No camera found on this device.'
//         : `Camera error: ${err.message}`;
//       setStatus(msg);
//     }
//   };

//   /* Stop on unmount */
//   useEffect(() => () => stopCamera(), []); // eslint-disable-line

//   return (
//     <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
//       <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
//         <Camera size={16} className="text-blue-700"/>
//         <div>
//           <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">QR Scanner</h2>
//           <p className="text-[11px] text-gray-400 mt-0.5">First scan = Check-In · Second scan = Check-Out</p>
//         </div>
//         <div className="ml-auto flex items-center gap-2">
//           {!libReady && <span className="text-[10px] text-amber-500 font-semibold">Loading lib…</span>}
//           {!active ? (
//             <button onClick={startCamera} disabled={!libReady}
//               className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition active:scale-95">
//               <Camera size={12}/> Start Scanner
//             </button>
//           ) : (
//             <button onClick={stopCamera}
//               className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-600 transition active:scale-95">
//               <X size={12}/> Stop
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="p-4">
//         {/* Video always in DOM so ref is always valid */}
//         <div className={`relative rounded-xl overflow-hidden bg-black ${active ? '' : 'hidden'}`}
//           style={{aspectRatio:'4/3', maxHeight:320}}>
//           <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay/>
//           {/* Scan frame overlay */}
//           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//             <div style={{
//               width:180, height:180,
//               border:'2px solid rgba(96,165,250,0.85)',
//               borderRadius:14,
//               boxShadow:'0 0 0 9999px rgba(0,0,0,0.45)',
//             }}/>
//           </div>
//           {/* Corner brackets */}
//           {[['top-[calc(50%-90px)]','left-[calc(50%-90px)]','border-t-2 border-l-2'],
//             ['top-[calc(50%-90px)]','right-[calc(50%-90px)]','border-t-2 border-r-2'],
//             ['bottom-[calc(50%-90px)]','left-[calc(50%-90px)]','border-b-2 border-l-2'],
//             ['bottom-[calc(50%-90px)]','right-[calc(50%-90px)]','border-b-2 border-r-2'],
//           ].map(([t,s,cls],i)=>(
//             <div key={i} className={`absolute pointer-events-none w-6 h-6 border-blue-400 rounded-sm ${t} ${s} ${cls}`}/>
//           ))}
//           {/* Scanning line */}
//           <div className="absolute left-[calc(50%-88px)] w-44 h-0.5 bg-blue-400 opacity-70 pointer-events-none"
//             style={{top:'50%', animation:'scanLine 2s ease-in-out infinite'}}/>
//         </div>

//         {!active && (
//           <div className="flex flex-col items-center justify-center py-10 text-slate-400 rounded-xl border-2 border-dashed border-slate-200">
//             <Camera size={30} className="mb-2 opacity-30"/>
//             <p className="text-xs font-semibold text-slate-500">Camera inactive</p>
//             <p className="text-[10px] mt-1">{libReady ? 'Press Start Scanner above' : 'Loading QR library…'}</p>
//           </div>
//         )}

//         <canvas ref={canvasRef} className="hidden"/>

//         {status && (
//           <div className={`mt-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-2 ${
//             status.startsWith('✓')
//               ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
//               : status.toLowerCase().includes('error') || status.toLowerCase().includes('denied') || status.toLowerCase().includes('failed')
//               ? 'bg-red-50 text-red-600 border border-red-200'
//               : 'bg-blue-50 text-blue-700 border border-blue-100'
//           }`}>
//             {status.startsWith('✓') ? <Check size={12}/> : <Camera size={12}/>}
//             {status}
//           </div>
//         )}
//       </div>

//       <style>{`
//         @keyframes scanLine {
//           0%   { transform: translateY(-80px); opacity: 0.8; }
//           50%  { transform: translateY(80px);  opacity: 1;   }
//           100% { transform: translateY(-80px); opacity: 0.8; }
//         }
//       `}</style>
//     </div>
//   );
// }

// /* ══════════════════════════════════════════════════════════
//    MAIN COMPONENT
// ══════════════════════════════════════════════════════════ */
// export default function CheckInOut() {
//   useContext(ShopContext); // keep context wired

//   /* ── State ── */
//   const [staff,        setStaff]        = useState([]);
//   const [logs,         setLogs]         = useState([]);
//   const [activeTab,    setActiveTab]    = useState('staff');    // staff | scan | table | chart
//   const [showForm,     setShowForm]     = useState(false);
//   const [editMember,   setEditMember]   = useState(null);
//   const [searchStaff,  setSearchStaff]  = useState('');
//   const [searchLog,    setSearchLog]    = useState('');
//   const [isSyncing,    setIsSyncing]    = useState(false);
//   const [showConfirm,  setShowConfirm]  = useState(null);       // null | 'clearLogs' | staffId
//   const [toast,        setToast]        = useState('');

//   /* ── Bootstrap ── */
//   useEffect(() => {
//     setStaff(loadStaff());
//     setLogs(loadLogs());
//     const iv = setInterval(() => setLogs(loadLogs()), 3000);
//     return () => clearInterval(iv);
//   }, []);

//   /* ── Toast helper ── */
//   const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 2800); };

//   /* ── Staff CRUD ── */
//   const handleSaveStaff = (form) => {
//     let updated;
//     if (editMember) {
//       updated = staff.map(s => s.id === editMember.id ? { ...s, ...form } : s);
//       showToast(`Updated ${form.name}`);
//     } else {
//       const newMember = { id: genStaffId(), ...form, registeredAt: dateToday() };
//       updated = [newMember, ...staff];
//       showToast(`Registered ${form.name} — QR generated!`);
//     }
//     setStaff(updated);
//     saveStaff(updated);
//     setShowForm(false);
//     setEditMember(null);
//   };

//   const handleDeleteStaff = (id) => {
//     const updated = staff.filter(s => s.id !== id);
//     setStaff(updated);
//     saveStaff(updated);
//     setShowConfirm(null);
//     showToast('Staff member removed.');
//   };

//   const handleEditStaff = (member) => {
//     setEditMember(member);
//     setShowForm(true);
//     setActiveTab('staff');
//   };

//   /* ── Check-In / Check-Out toggle logic ── */
//   const processCheckIn = (member) => {
//     const existing = loadLogs();
//     // Find active entry for this staff today
//     const activeEntry = existing.find(l => l.staffId === member.id && l.status === 'Active');

//     let updated;
//     if (activeEntry) {
//       // Second scan = Check-Out
//       updated = existing.map(l =>
//         l.id === activeEntry.id
//           ? { ...l, checkOut: timeNow(), status: 'Completed' }
//           : l
//       );
//       showToast(`✓ ${member.name} checked OUT at ${timeNow()}`);
//     } else {
//       // First scan = Check-In
//       const newLog = {
//         id:       genLogId(),
//         staffId:  member.id,
//         name:     member.name,
//         job:      member.job,
//         skill:    member.skill,
//         department: member.department,
//         checkIn:  timeNow(),
//         checkOut: '--:--',
//         status:   'Active',
//         date:     dateToday(),
//       };
//       updated = [newLog, ...existing];
//       showToast(`✓ ${member.name} checked IN at ${timeNow()}`);
//     }
//     saveLogs(updated);
//     setLogs(updated);
//   };

//   /* ── QR scan handler ── */
//   const handleQRScan = (data) => {
//     // data format: "STAFF:STF-XXXXX"
//     if (!data.startsWith('STAFF:')) return;
//     const id     = data.replace('STAFF:', '');
//     const member = loadStaff().find(s => s.id === id);
//     if (!member) { return; }
//     processCheckIn(member);
//   };

//   /* ── Log actions ── */
//   const handleManualCheckOut = (logId) => {
//     const updated = logs.map(l => l.id === logId ? { ...l, checkOut: timeNow(), status: 'Completed' } : l);
//     setLogs(updated);
//     saveLogs(updated);
//   };
//   const handleDeleteLog  = (id) => { const u = logs.filter(l=>l.id!==id); setLogs(u); saveLogs(u); setShowConfirm(null); };
//   const handleClearLogs  = ()   => { setLogs([]); saveLogs([]); setShowConfirm(null); showToast('All logs cleared.'); };

//   const triggerSync = () => {
//     setLogs(loadLogs());
//     setStaff(loadStaff());
//     setIsSyncing(true);
//     setTimeout(()=>setIsSyncing(false), 600);
//   };

//   /* ── CSV export ── */
//   const exportCSV = () => {
//     const header = ['Log ID','Staff ID','Name','Job','Skill','Department','Date','Check-In','Check-Out','Status'];
//     const rows   = logs.map(l=>[l.id,l.staffId||'',l.name,l.job||'',l.skill||'',l.department||'',l.date,l.checkIn,l.checkOut,l.status]);
//     const csv    = [header,...rows].map(r=>r.join(',')).join('\n');
//     const a      = Object.assign(document.createElement('a'),{
//       href:     URL.createObjectURL(new Blob([csv],{type:'text/csv'})),
//       download: `attendance_${new Date().toISOString().slice(0,10)}.csv`,
//     });
//     a.click();
//   };

//   /* ── Derived ── */
//   const activeCount    = logs.filter(l=>l.status==='Active').length;
//   const completedCount = logs.filter(l=>l.status==='Completed').length;
//   const today          = dateToday();

//   const filteredStaff  = staff.filter(s=>s.name.toLowerCase().includes(searchStaff.toLowerCase())||s.id.toLowerCase().includes(searchStaff.toLowerCase()));
//   const filteredLogs   = logs.filter(l=>l.name.toLowerCase().includes(searchLog.toLowerCase())||l.id.toLowerCase().includes(searchLog.toLowerCase())||((l.job||'').toLowerCase().includes(searchLog.toLowerCase())));

//   const chartData = (() => {
//     const map = {};
//     logs.forEach(l => {
//       const key = l.job || l.role || 'Unknown';
//       if (!map[key]) map[key] = { role:key, 'Check-In':0, 'Check-Out':0 };
//       map[key]['Check-In']++;
//       if (l.status==='Completed') map[key]['Check-Out']++;
//     });
//     return Object.values(map);
//   })();

//   /* ── TABS config ── */
//   const TABS = [
//     { key:'staff', label:'👥 Staff', icon:<Users size={12}/> },
//     { key:'scan',  label:'📷 Scan QR', icon:<Camera size={12}/> },
//     { key:'table', label:'📋 Attendance', icon:<BarChart2 size={12}/> },
//     { key:'chart', label:'📊 Chart', icon:<BarChart2 size={12}/> },
//   ];

//   return (
//     <div className="space-y-5 font-sans pb-10 relative">

//       {/* ── TOAST ── */}
//       {toast && (
//         <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fadeUp">
//           <Check size={13} className="text-emerald-400"/> {toast}
//         </div>
//       )}

//       {/* ── CONFIRM DIALOG ── */}
//       {showConfirm && (
//         <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
//             <AlertCircle size={28} className="text-rose-500 mx-auto mb-2"/>
//             <p className="font-black text-slate-800 text-sm mb-1">Are you sure?</p>
//             <p className="text-xs text-slate-500 mb-4">This action cannot be undone.</p>
//             <div className="flex gap-2 justify-center">
//               <button onClick={()=>{
//                 if (showConfirm==='clearLogs') handleClearLogs();
//                 else if (showConfirm.startsWith('log:')) handleDeleteLog(showConfirm.replace('log:',''));
//                 else handleDeleteStaff(showConfirm);
//               }} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase px-5 py-2 rounded-xl transition active:scale-95">
//                 Delete
//               </button>
//               <button onClick={()=>setShowConfirm(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase px-5 py-2 rounded-xl transition active:scale-95">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ── HEADER ── */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
//         <div>
//           <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
//             <Clock className="text-blue-800" size={24}/>
//             SHIFT MANAGEMENT GATEWAY
//           </h1>
//           <p className="text-gray-400 text-xs mt-1 font-medium">
//             Register staff → generate QR → scan to check-in/out → view live attendance log.
//           </p>
//         </div>
//         <button onClick={triggerSync} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl transition">
//           <RefreshCw size={13} className={isSyncing?'animate-spin':''}/> Sync
//         </button>
//       </div>

//       {/* ── METRIC CARDS ── */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
//           <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Staff Registered</span>
//           <p className="text-2xl font-black text-blue-900 mt-0.5">{staff.length}</p>
//         </div>
//         <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
//           <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Active Now</span>
//           <p className="text-2xl font-black text-emerald-900 mt-0.5">{activeCount}</p>
//         </div>
//         <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
//           <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Completed</span>
//           <p className="text-2xl font-black text-slate-800 mt-0.5">{completedCount}</p>
//         </div>
//         <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl">
//           <span className="text-[10px] font-black uppercase text-violet-500 tracking-wider flex items-center gap-1"><Calendar size={9}/> Today</span>
//           <p className="text-[11px] font-black text-violet-900 mt-1 leading-tight">{today}</p>
//         </div>
//       </div>

//       {/* ── TAB BAR ── */}
//       <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
//         {TABS.map(t=>(
//           <button key={t.key} onClick={()=>setActiveTab(t.key)}
//             className={`flex items-center gap-1 text-[11px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${activeTab===t.key?'bg-white text-slate-900 shadow-sm':'text-slate-400 hover:text-slate-600'}`}>
//             {t.icon} {t.label.split(' ').slice(1).join(' ')}
//           </button>
//         ))}
//       </div>

//       {/* ══════════════ TAB: STAFF ══════════════ */}
//       {activeTab==='staff' && (
//         <div className="space-y-4">
//           {/* Form toggle */}
//           {!showForm ? (
//             <button onClick={()=>{setShowForm(true);setEditMember(null);}}
//               className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition active:scale-95 shadow-sm">
//               <Plus size={13}/> Register New Staff
//             </button>
//           ) : (
//             <StaffForm
//               onSave={handleSaveStaff}
//               onCancel={()=>{setShowForm(false);setEditMember(null);}}
//               editing={editMember}
//             />
//           )}

//           {/* Search */}
//           {staff.length > 0 && (
//             <div className="relative max-w-xs">
//               <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
//               <input type="text" placeholder="Search staff…" value={searchStaff}
//                 onChange={e=>setSearchStaff(e.target.value)}
//                 className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500 transition"/>
//             </div>
//           )}

//           {/* Staff grid */}
//           {filteredStaff.length === 0 ? (
//             <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
//               <Users size={32} className="mx-auto mb-2 opacity-30"/>
//               <p className="text-sm font-semibold">{staff.length===0?'No staff registered yet':'No staff match your search'}</p>
//               <p className="text-xs mt-1">{staff.length===0?'Click "Register New Staff" to get started.':''}</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//               {filteredStaff.map(member=>(
//                 <StaffCard
//                   key={member.id}
//                   member={member}
//                   onDelete={id=>setShowConfirm(id)}
//                   onEdit={handleEditStaff}
//                   onManualCheckIn={processCheckIn}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* ══════════════ TAB: QR SCANNER ══════════════ */}
//       {activeTab==='scan' && (
//         <div className="max-w-lg">
//           <QRScanner staff={staff} onScan={handleQRScan}/>
//           {/* Recent scans */}
//           {logs.length > 0 && (
//             <div className="mt-4 bg-white border border-slate-100 rounded-2xl overflow-hidden">
//               <div className="px-4 py-3 border-b border-slate-100">
//                 <p className="text-[11px] font-black uppercase text-slate-600 tracking-tight">Recent Activity</p>
//               </div>
//               <div className="divide-y divide-slate-50">
//                 {logs.slice(0,5).map(l=>(
//                   <div key={l.id} className="flex items-center gap-3 px-4 py-3">
//                     <div className={`w-2 h-2 rounded-full flex-shrink-0 ${l.status==='Active'?'bg-emerald-500 animate-pulse':'bg-slate-300'}`}/>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-black text-slate-800 truncate">{l.name}</p>
//                       <p className="text-[10px] text-slate-400">{l.job} · {l.date}</p>
//                     </div>
//                     <div className="text-right flex-shrink-0">
//                       <p className="text-[10px] text-emerald-600 font-bold">IN {l.checkIn}</p>
//                       {l.checkOut!=='--:--'&&<p className="text-[10px] text-rose-500 font-bold">OUT {l.checkOut}</p>}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       )}

//       {/* ══════════════ TAB: ATTENDANCE TABLE ══════════════ */}
//       {activeTab==='table' && (
//         <div className="space-y-3">
//           {/* Controls */}
//           <div className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3">
//             <div className="relative flex-1 max-w-sm">
//               <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
//               <input type="text" placeholder="Search by name, job, or log ID…"
//                 value={searchLog} onChange={e=>setSearchLog(e.target.value)}
//                 className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-500 transition"/>
//             </div>
//             <button onClick={exportCSV}
//               className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-2 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition active:scale-95">
//               <Download size={12}/> Export CSV
//             </button>
//             <button onClick={()=>setShowConfirm('clearLogs')} disabled={logs.length===0}
//               className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95">
//               <Trash2 size={12}/> Clear All
//             </button>
//           </div>

//           {/* Excel-style table */}
//           <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
//             <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
//               <div>
//                 <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance Register</h2>
//                 <p className="text-[11px] text-gray-400 mt-0.5">Auto-refreshes every 3 s · Scan = toggle check-in/out</p>
//               </div>
//               <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{filteredLogs.length} rows</span>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full border-collapse text-xs" style={{minWidth:820}}>
//                 <thead>
//                   {/* Spreadsheet column letters */}
//                   <tr className="bg-slate-100/70">
//                     <th className="w-8 py-1 px-2 border-r border-slate-200 text-[9px] text-slate-300 font-bold text-center">#</th>
//                     {['A','B','C','D','E','F','G','H','I'].map(l=>(
//                       <th key={l} className="py-1 px-3 border-r border-slate-200 text-[9px] text-slate-300 font-bold text-center">{l}</th>
//                     ))}
//                   </tr>
//                   <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-600 font-black uppercase text-[10px] tracking-wider">
//                     <th className="py-2.5 px-2 border-r border-slate-100 w-8 text-center text-slate-300"/>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Log ID</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Name</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Job</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Skill</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Department</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Date</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Check-In</th>
//                     <th className="py-2.5 px-4 text-left border-r border-slate-100">Check-Out</th>
//                     <th className="py-2.5 px-4 text-left">Status / Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {filteredLogs.length===0 ? (
//                     <tr><td colSpan="10" className="py-14 text-center text-slate-400 italic text-xs">No attendance records found.</td></tr>
//                   ) : filteredLogs.map((log,idx)=>(
//                     <tr key={log.id} className={`hover:bg-blue-50/30 transition duration-100 ${idx%2===0?'bg-white':'bg-slate-50/40'}`}>
//                       <td className="py-2.5 px-2 text-center text-[10px] text-slate-300 border-r border-slate-100 bg-slate-50/60 font-bold select-none">{idx+1}</td>
//                       <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400 font-bold border-r border-slate-100">{log.id}</td>
//                       <td className="py-2.5 px-4 font-black text-slate-900 text-[11px] border-r border-slate-100">{log.name}</td>
//                       <td className="py-2.5 px-4 border-r border-slate-100">
//                         <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{log.job||'—'}</span>
//                       </td>
//                       <td className="py-2.5 px-4 text-[10px] text-slate-500 border-r border-slate-100">{log.skill||'—'}</td>
//                       <td className="py-2.5 px-4 text-[10px] text-slate-500 border-r border-slate-100">{log.department||'—'}</td>
//                       <td className="py-2.5 px-4 text-[10px] font-mono text-slate-500 border-r border-slate-100">{log.date}</td>
//                       <td className="py-2.5 px-4 border-r border-slate-100">
//                         <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded font-mono">
//                           <LogIn size={8}/> {log.checkIn}
//                         </span>
//                       </td>
//                       <td className="py-2.5 px-4 border-r border-slate-100">
//                         <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded font-mono ${log.checkOut==='--:--'?'text-slate-300':'bg-rose-50 text-rose-600'}`}>
//                           <LogOut size={8}/> {log.checkOut}
//                         </span>
//                       </td>
//                       <td className="py-2.5 px-4">
//                         <div className="flex items-center gap-1.5">
//                           {log.status==='Active' ? (
//                             <>
//                               <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-100">
//                                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"/> Active
//                               </span>
//                               <button onClick={()=>handleManualCheckOut(log.id)}
//                                 className="text-[9px] font-black uppercase bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 px-2 py-0.5 rounded transition active:scale-95">
//                                 Clock Out
//                               </button>
//                             </>
//                           ) : (
//                             <span className="text-[9px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded">Closed</span>
//                           )}
//                           <button onClick={()=>setShowConfirm(`log:${log.id}`)}
//                             className="p-0.5 text-slate-200 hover:text-rose-400 hover:bg-rose-50 rounded transition">
//                             <X size={11}/>
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 {filteredLogs.length>0 && (
//                   <tfoot>
//                     <tr className="bg-slate-100/80 border-t-2 border-slate-200 text-[10px] font-black text-slate-500 uppercase">
//                       <td className="py-2 px-2 border-r border-slate-200 text-center text-slate-300">Σ</td>
//                       <td className="py-2 px-4 border-r border-slate-200" colSpan="2">Total: {filteredLogs.length} records</td>
//                       <td className="py-2 px-4 border-r border-slate-200" colSpan="4"/>
//                       <td className="py-2 px-4 border-r border-slate-200 text-emerald-600">{filteredLogs.filter(l=>l.checkIn!=='--:--').length} in</td>
//                       <td className="py-2 px-4 border-r border-slate-200 text-rose-500">{filteredLogs.filter(l=>l.checkOut!=='--:--').length} out</td>
//                       <td className="py-2 px-4">{activeCount} active · {completedCount} done</td>
//                     </tr>
//                   </tfoot>
//                 )}
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ══════════════ TAB: CHART ══════════════ */}
//       {activeTab==='chart' && (
//         <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
//           <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
//             <BarChart2 size={16} className="text-blue-700"/>
//             <div>
//               <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance by Job</h2>
//               <p className="text-[11px] text-gray-400 mt-0.5">Check-In vs Check-Out grouped per role.</p>
//             </div>
//           </div>
//           {chartData.length===0 ? (
//             <p className="py-14 text-center text-xs italic text-slate-400">No attendance data yet — check in some staff first.</p>
//           ) : (
//             <div className="px-4 pt-4 pb-4">
//               <ResponsiveContainer width="100%" height={260}>
//                 <BarChart data={chartData} margin={{top:4,right:16,left:-10,bottom:4}}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
//                   <XAxis dataKey="role" tick={{fontSize:10,fontWeight:700,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
//                   <YAxis allowDecimals={false} tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
//                   <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:'1px solid #e2e8f0'}}/>
//                   <Legend wrapperStyle={{fontSize:10,paddingTop:8}} iconType="circle" iconSize={8}/>
//                   <Bar dataKey="Check-In"  fill="#10b981" radius={[4,4,0,0]} maxBarSize={40}/>
//                   <Bar dataKey="Check-Out" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={40}/>
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           )}
//         </div>
//       )}

//       <style>{`
//         @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
//         .animate-fadeUp { animation: fadeUp 0.25s ease both; }
//       `}</style>
//     </div>
//   );
// }
















import React, { useContext, useState, useEffect, useRef } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { QRCodeSVG } from 'qrcode.react';
import {
  Clock, LogIn, LogOut, Search, UserCheck, UserX, Calendar,
  RefreshCw, Trash2, X, BarChart2, QrCode, Download, Copy,
  Check, User, Plus, Camera, ChevronDown, AlertCircle,
  Briefcase, Star, Hash, Edit2, Save, Users,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

/* ── Storage keys ────────────────────────────────────────── */
export const STORAGE_KEY      = 'psp_shift_attendance_logs';
const        STAFF_KEY        = 'psp_registered_staff';
const        SITE_URL         = 'https://pspmartonline.netlify.app';

/* ── Dropdowns ───────────────────────────────────────────── */
const JOBS   = ['Admin','Manager','Cashier','Warehouse','Customer Support','Moderator','Security','Driver','Technician','Intern'];
const SKILLS = ['Sales','Inventory','Customer Service','Logistics','IT Support','Data Entry','Marketing','Accounting','Operations','Leadership'];
const DEPARTMENTS = ['Front Office','Back Office','Warehouse','IT','Finance','HR','Marketing','Operations'];

/* ── ID generator ────────────────────────────────────────── */
const genStaffId = () => `STF-${String(Date.now()).slice(-5)}`;
const genLogId   = () => `LOG-${Math.floor(1000 + Math.random() * 9000)}`;

/* Stamp helpers — called at the moment of writing a log, always fresh */
const timeNow   = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const dateToday = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/* Live clock hook — ticks every second */
function useLiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return {
    date:  now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    time:  now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    short: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
}

/* ── Helpers ─────────────────────────────────────────────── */
function loadStaff() {
  try { return JSON.parse(localStorage.getItem(STAFF_KEY) || '[]'); } catch { return []; }
}
function saveStaff(arr) {
  localStorage.setItem(STAFF_KEY, JSON.stringify(arr));
}
function loadLogs() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveLogs(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/* ══════════════════════════════════════════════════════════
   EXPORTED CheckInModal (for App.jsx SiteCheckInGate)
══════════════════════════════════════════════════════════ */
export function CheckInModal({ onClose, onCheckedIn }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Staff');
  const [err,  setErr]  = useState('');

  const handleSubmit = () => {
    if (!name.trim()) { setErr('Please enter your name.'); return; }
    const id     = genLogId();
    const newLog = {
      id, name: name.trim(), role,
      checkIn: timeNow(), checkOut: '--:--',
      status: 'Active',
      date: dateToday(),
    };
    try {
      const existing = loadLogs();
      saveLogs([newLog, ...existing]);
    } catch {}
    onCheckedIn(id);
    onClose();
  };

  return (
    <div style={{
      position:'fixed',inset:0,zIndex:9999,
      background:'rgba(10,20,40,0.80)',backdropFilter:'blur(6px)',
      display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem',
    }}>
      <div style={{
        width:'100%',maxWidth:380,background:'#0f2744',
        border:'1px solid rgba(255,255,255,0.10)',borderRadius:24,
        padding:'2rem',boxShadow:'0 24px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
          <div style={{width:52,height:52,borderRadius:'50%',background:'rgba(59,130,246,0.15)',border:'1.5px solid rgba(59,130,246,0.3)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 0.75rem'}}>
            <LogIn size={22} color="#60a5fa"/>
          </div>
          <h2 style={{fontSize:18,fontWeight:800,color:'#f1f5f9',margin:0}}>Staff Check-In</h2>
          <p style={{fontSize:11,color:'#64748b',marginTop:4}}>{dateToday()}</p>
        </div>
        <div style={{marginBottom:12}}>
          <label style={{display:'block',fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Your Name *</label>
          <input type="text" placeholder="Enter your full name" value={name}
            onChange={e=>{setName(e.target.value);setErr('');}}
            onKeyDown={e=>e.key==='Enter'&&handleSubmit()} autoFocus
            style={{width:'100%',boxSizing:'border-box',background:'rgba(255,255,255,0.06)',border:`1.5px solid ${err?'#f87171':'rgba(255,255,255,0.12)'}`,borderRadius:12,padding:'10px 12px',fontSize:13,color:'#f1f5f9',outline:'none'}}/>
          {err&&<p style={{fontSize:10,color:'#f87171',marginTop:3}}>{err}</p>}
        </div>
        <div style={{marginBottom:20}}>
          <label style={{display:'block',fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Role</label>
          <select value={role} onChange={e=>setRole(e.target.value)}
            style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1.5px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'10px 12px',fontSize:13,color:'#f1f5f9',outline:'none'}}>
            {JOBS.map(r=><option key={r} value={r} style={{background:'#0f2744'}}>{r}</option>)}
          </select>
        </div>
        <button onClick={handleSubmit} style={{width:'100%',padding:'12px',background:'linear-gradient(135deg,#2563eb,#1d4ed8)',border:'none',borderRadius:14,fontSize:14,fontWeight:800,color:'#fff',cursor:'pointer'}}>
          Check In & Enter Site
        </button>
        <p style={{fontSize:10,color:'#334155',textAlign:'center',marginTop:10}}>Leaving the site will automatically record your check-out.</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STAFF REGISTRATION FORM
══════════════════════════════════════════════════════════ */
function StaffForm({ onSave, onCancel, editing }) {
  const [form, setForm] = useState(editing || { name:'', job:'Admin', skill:'Sales', department:'Front Office', note:'' });
  const [err,  setErr]  = useState('');

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSave = () => {
    if (!form.name.trim()) { setErr('Name is required.'); return; }
    onSave(form);
  };

  return (
    <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
        <User size={15} className="text-blue-600"/>
        {editing ? 'Edit Staff Member' : 'Register New Staff'}
      </h3>

      {err && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-xs px-3 py-2 rounded-xl mb-3">
          <AlertCircle size={12}/> {err}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        {/* Name */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Full Name *</label>
          <div className="relative">
            <User size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <input type="text" placeholder="e.g. Sopheak Chan"
              value={form.name} onChange={e=>{set('name',e.target.value);setErr('');}}
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition"/>
          </div>
        </div>

        {/* Job */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Job Title</label>
          <div className="relative">
            <Briefcase size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <select value={form.job} onChange={e=>set('job',e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition appearance-none">
              {JOBS.map(j=><option key={j}>{j}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
          </div>
        </div>

        {/* Skill */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Primary Skill</label>
          <div className="relative">
            <Star size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <select value={form.skill} onChange={e=>set('skill',e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition appearance-none">
              {SKILLS.map(s=><option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Department</label>
          <div className="relative">
            <Hash size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
            <select value={form.department} onChange={e=>set('department',e.target.value)}
              className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 bg-slate-50 focus:outline-none focus:border-blue-500 transition appearance-none">
              {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
            </select>
            <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="mb-4">
        <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">Note / Remark</label>
        <textarea rows={2} placeholder="Optional notes about this staff member…"
          value={form.note} onChange={e=>set('note',e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-500 transition resize-none"/>
      </div>

      <div className="flex gap-2">
        <button onClick={handleSave}
          className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-black uppercase px-4 py-2 rounded-xl transition active:scale-95">
          <Save size={12}/> {editing ? 'Update' : 'Register & Generate QR'}
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-black uppercase px-4 py-2 rounded-xl transition active:scale-95">
          <X size={12}/> Cancel
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STAFF CARD (shows QR + info)
══════════════════════════════════════════════════════════ */
function StaffCard({ member, onDelete, onEdit, onManualCheckIn }) {
  const [copied, setCopied] = useState(false);
  const qrValue = `STAFF:${member.id}`;

  const copy = () => {
    navigator.clipboard.writeText(member.id).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),1800);});
  };

  const JOB_COLORS = {
    Admin:'bg-purple-50 text-purple-700 border-purple-100',
    Manager:'bg-blue-50 text-blue-700 border-blue-100',
    Cashier:'bg-emerald-50 text-emerald-700 border-emerald-100',
    Warehouse:'bg-amber-50 text-amber-700 border-amber-100',
    'Customer Support':'bg-pink-50 text-pink-700 border-pink-100',
    Moderator:'bg-teal-50 text-teal-700 border-teal-100',
    Security:'bg-red-50 text-red-700 border-red-100',
    default:'bg-slate-50 text-slate-600 border-slate-200',
  };
  const jobColor = JOB_COLORS[member.job] || JOB_COLORS.default;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      {/* Top strip */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"/>

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 text-sm truncate">{member.name}</p>
            <span className={`inline-flex items-center text-[9px] font-black uppercase px-2 py-0.5 rounded-md border mt-0.5 ${jobColor}`}>
              {member.job}
            </span>
          </div>
          <div className="flex gap-1 ml-2">
            <button onClick={()=>onEdit(member)} title="Edit" className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition">
              <Edit2 size={12}/>
            </button>
            <button onClick={()=>onDelete(member.id)} title="Delete" className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition">
              <Trash2 size={12}/>
            </button>
          </div>
        </div>

        {/* QR code */}
        <div className="flex justify-center mb-3">
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
            <QRCodeSVG value={qrValue} size={96} bgColor="#f8fafc" fgColor="#1e293b" level="M" includeMargin={false}/>
          </div>
        </div>

        {/* ID */}
        <div className="flex items-center gap-1.5 mb-3">
          <code className="flex-1 text-[10px] font-mono bg-slate-100 text-blue-700 px-2 py-1 rounded-lg truncate">{member.id}</code>
          <button onClick={copy} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 transition text-slate-500">
            {copied ? <Check size={11} className="text-emerald-500"/> : <Copy size={11}/>}
          </button>
        </div>

        {/* Meta */}
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Star size={9} className="text-amber-400 flex-shrink-0"/>
            <span className="truncate">{member.skill}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Hash size={9} className="text-slate-400 flex-shrink-0"/>
            <span className="truncate">{member.department}</span>
          </div>
          {member.note && (
            <div className="text-[10px] text-slate-400 italic truncate">{member.note}</div>
          )}
        </div>

        {/* Manual check-in button */}
        <button onClick={()=>onManualCheckIn(member)}
          className="w-full flex items-center justify-center gap-1.5 text-[10px] font-black uppercase py-2 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-100 hover:border-blue-600 transition active:scale-95">
          <LogIn size={11}/> Manual Check-In
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   QR SCANNER  — ref-based RAF loop, no stale closures
══════════════════════════════════════════════════════════ */
function QRScanner({ onScan }) {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const streamRef   = useRef(null);
  const rafRef      = useRef(null);
  const runningRef  = useRef(false);   // controls the RAF loop
  const lastDataRef = useRef('');      // debounce: skip identical consecutive scans
  const onScanRef   = useRef(onScan);  // always fresh callback, never stale
  useEffect(() => { onScanRef.current = onScan; }, [onScan]);

  const [active,  setActive]  = useState(false);
  const [status,  setStatus]  = useState('');
  const [libReady,setLibReady]= useState(!!window.jsQR);

  /* Load jsQR once */
  useEffect(() => {
    if (window.jsQR) { setLibReady(true); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js';
    s.onload  = () => { setLibReady(true); };
    s.onerror = () => setStatus('Failed to load QR library. Check internet connection.');
    document.head.appendChild(s);
  }, []);

  /* RAF scan loop — pure refs, zero stale-closure risk */
  const loop = useRef(null);
  loop.current = () => {
    if (!runningRef.current) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    const fn     = window.jsQR;

    if (!fn || !video || !canvas || video.readyState < 2 || video.videoWidth === 0) {
      rafRef.current = requestAnimationFrame(loop.current);
      return;
    }

    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0);

    let result = null;
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      result = fn(imgData.data, imgData.width, imgData.height, { inversionAttempts: 'dontInvert' });
    } catch {}

    if (result && result.data) {
      if (result.data !== lastDataRef.current) {
        lastDataRef.current = result.data;
        setStatus(`✓ Scanned: ${result.data}`);
        onScanRef.current(result.data);
        // Allow re-scan of same code after 3 s
        setTimeout(() => { lastDataRef.current = ''; }, 3000);
      }
    }
    rafRef.current = requestAnimationFrame(loop.current);
  };

  const stopCamera = () => {
    runningRef.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
    setStatus('');
    lastDataRef.current = '';
  };

  const startCamera = async () => {
    if (!libReady) { setStatus('QR library still loading, please wait…'); return; }
    setStatus('Requesting camera…');
    try {
      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width:  { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      video.setAttribute('playsinline', '');  // iOS Safari
      await video.play();
      runningRef.current = true;
      setActive(true);
      setStatus('Point camera at a staff QR code…');
      rafRef.current = requestAnimationFrame(loop.current);
    } catch (err) {
      const msg = err.name === 'NotAllowedError'
        ? 'Camera permission denied — allow camera access in browser settings.'
        : err.name === 'NotFoundError'
        ? 'No camera found on this device.'
        : `Camera error: ${err.message}`;
      setStatus(msg);
    }
  };

  /* Stop on unmount */
  useEffect(() => () => stopCamera(), []); // eslint-disable-line

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <Camera size={16} className="text-blue-700"/>
        <div>
          <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">QR Scanner</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">First scan = Check-In · Second scan = Check-Out</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {!libReady && <span className="text-[10px] text-amber-500 font-semibold">Loading lib…</span>}
          {!active ? (
            <button onClick={startCamera} disabled={!libReady}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white transition active:scale-95">
              <Camera size={12}/> Start Scanner
            </button>
          ) : (
            <button onClick={stopCamera}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-600 transition active:scale-95">
              <X size={12}/> Stop
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Video always in DOM so ref is always valid */}
        <div className={`relative rounded-xl overflow-hidden bg-black ${active ? '' : 'hidden'}`}
          style={{aspectRatio:'4/3', maxHeight:320}}>
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted autoPlay/>
          {/* Scan frame overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{
              width:180, height:180,
              border:'2px solid rgba(96,165,250,0.85)',
              borderRadius:14,
              boxShadow:'0 0 0 9999px rgba(0,0,0,0.45)',
            }}/>
          </div>
          {/* Corner brackets */}
          {[['top-[calc(50%-90px)]','left-[calc(50%-90px)]','border-t-2 border-l-2'],
            ['top-[calc(50%-90px)]','right-[calc(50%-90px)]','border-t-2 border-r-2'],
            ['bottom-[calc(50%-90px)]','left-[calc(50%-90px)]','border-b-2 border-l-2'],
            ['bottom-[calc(50%-90px)]','right-[calc(50%-90px)]','border-b-2 border-r-2'],
          ].map(([t,s,cls],i)=>(
            <div key={i} className={`absolute pointer-events-none w-6 h-6 border-blue-400 rounded-sm ${t} ${s} ${cls}`}/>
          ))}
          {/* Scanning line */}
          <div className="absolute left-[calc(50%-88px)] w-44 h-0.5 bg-blue-400 opacity-70 pointer-events-none"
            style={{top:'50%', animation:'scanLine 2s ease-in-out infinite'}}/>
        </div>

        {!active && (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400 rounded-xl border-2 border-dashed border-slate-200">
            <Camera size={30} className="mb-2 opacity-30"/>
            <p className="text-xs font-semibold text-slate-500">Camera inactive</p>
            <p className="text-[10px] mt-1">{libReady ? 'Press Start Scanner above' : 'Loading QR library…'}</p>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden"/>

        {status && (
          <div className={`mt-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold flex items-center gap-2 ${
            status.startsWith('✓')
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : status.toLowerCase().includes('error') || status.toLowerCase().includes('denied') || status.toLowerCase().includes('failed')
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-blue-50 text-blue-700 border border-blue-100'
          }`}>
            {status.startsWith('✓') ? <Check size={12}/> : <Camera size={12}/>}
            {status}
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanLine {
          0%   { transform: translateY(-80px); opacity: 0.8; }
          50%  { transform: translateY(80px);  opacity: 1;   }
          100% { transform: translateY(-80px); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function CheckInOut() {
  useContext(ShopContext); // keep context wired

  /* ── State ── */
  const [staff,        setStaff]        = useState([]);
  const [logs,         setLogs]         = useState([]);
  const [activeTab,    setActiveTab]    = useState('staff');    // staff | scan | table | chart
  const [showForm,     setShowForm]     = useState(false);
  const [editMember,   setEditMember]   = useState(null);
  const [searchStaff,  setSearchStaff]  = useState('');
  const [searchLog,    setSearchLog]    = useState('');
  const [isSyncing,    setIsSyncing]    = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(null);       // null | 'clearLogs' | staffId
  const [toast,        setToast]        = useState('');

  /* ── Bootstrap ── */
  useEffect(() => {
    setStaff(loadStaff());
    setLogs(loadLogs());
    const iv = setInterval(() => setLogs(loadLogs()), 3000);
    return () => clearInterval(iv);
  }, []);

  /* ── Toast helper ── */
  const showToast = (msg) => { setToast(msg); setTimeout(()=>setToast(''), 2800); };

  /* ── Staff CRUD ── */
  const handleSaveStaff = (form) => {
    let updated;
    if (editMember) {
      updated = staff.map(s => s.id === editMember.id ? { ...s, ...form } : s);
      showToast(`Updated ${form.name}`);
    } else {
      const newMember = { id: genStaffId(), ...form, registeredAt: dateToday() };
      updated = [newMember, ...staff];
      showToast(`Registered ${form.name} — QR generated!`);
    }
    setStaff(updated);
    saveStaff(updated);
    setShowForm(false);
    setEditMember(null);
  };

  const handleDeleteStaff = (id) => {
    const updated = staff.filter(s => s.id !== id);
    setStaff(updated);
    saveStaff(updated);
    setShowConfirm(null);
    showToast('Staff member removed.');
  };

  const handleEditStaff = (member) => {
    setEditMember(member);
    setShowForm(true);
    setActiveTab('staff');
  };

  /* ── Check-In / Check-Out toggle logic ── */
  const processCheckIn = (member) => {
    const existing = loadLogs();
    // Find active entry for this staff today
    const activeEntry = existing.find(l => l.staffId === member.id && l.status === 'Active');

    let updated;
    if (activeEntry) {
      // Second scan = Check-Out
      updated = existing.map(l =>
        l.id === activeEntry.id
          ? { ...l, checkOut: timeNow(), status: 'Completed' }
          : l
      );
      showToast(`✓ ${member.name} checked OUT at ${timeNow()}`);
    } else {
      // First scan = Check-In
      const newLog = {
        id:       genLogId(),
        staffId:  member.id,
        name:     member.name,
        job:      member.job,
        skill:    member.skill,
        department: member.department,
        checkIn:  timeNow(),
        checkOut: '--:--',
        status:   'Active',
        date:     dateToday(),
      };
      updated = [newLog, ...existing];
      showToast(`✓ ${member.name} checked IN at ${timeNow()}`);
    }
    saveLogs(updated);
    setLogs(updated);
  };

  /* ── QR scan handler ── */
  const handleQRScan = (data) => {
    // data format: "STAFF:STF-XXXXX"
    if (!data.startsWith('STAFF:')) return;
    const id     = data.replace('STAFF:', '');
    const member = loadStaff().find(s => s.id === id);
    if (!member) { return; }
    processCheckIn(member);
  };

  /* ── Log actions ── */
  const handleManualCheckOut = (logId) => {
    const updated = logs.map(l => l.id === logId ? { ...l, checkOut: timeNow(), status: 'Completed' } : l);
    setLogs(updated);
    saveLogs(updated);
  };
  const handleDeleteLog  = (id) => { const u = logs.filter(l=>l.id!==id); setLogs(u); saveLogs(u); setShowConfirm(null); };
  const handleClearLogs  = ()   => { setLogs([]); saveLogs([]); setShowConfirm(null); showToast('All logs cleared.'); };

  const triggerSync = () => {
    setLogs(loadLogs());
    setStaff(loadStaff());
    setIsSyncing(true);
    setTimeout(()=>setIsSyncing(false), 600);
  };

  /* ── CSV export ── */
  const exportCSV = () => {
    const header = ['Log ID','Staff ID','Name','Job','Skill','Department','Date','Check-In','Check-Out','Status'];
    const rows   = logs.map(l=>[l.id,l.staffId||'',l.name,l.job||'',l.skill||'',l.department||'',l.date,l.checkIn,l.checkOut,l.status]);
    const csv    = [header,...rows].map(r=>r.join(',')).join('\n');
    const a      = Object.assign(document.createElement('a'),{
      href:     URL.createObjectURL(new Blob([csv],{type:'text/csv'})),
      download: `attendance_${new Date().toISOString().slice(0,10)}.csv`,
    });
    a.click();
  };

  /* ── Derived ── */
  const activeCount    = logs.filter(l=>l.status==='Active').length;
  const completedCount = logs.filter(l=>l.status==='Completed').length;
  const clock          = useLiveClock();

  const filteredStaff  = staff.filter(s=>s.name.toLowerCase().includes(searchStaff.toLowerCase())||s.id.toLowerCase().includes(searchStaff.toLowerCase()));
  const filteredLogs   = logs.filter(l=>l.name.toLowerCase().includes(searchLog.toLowerCase())||l.id.toLowerCase().includes(searchLog.toLowerCase())||((l.job||'').toLowerCase().includes(searchLog.toLowerCase())));

  const chartData = (() => {
    const map = {};
    logs.forEach(l => {
      const key = l.job || l.role || 'Unknown';
      if (!map[key]) map[key] = { role:key, 'Check-In':0, 'Check-Out':0 };
      map[key]['Check-In']++;
      if (l.status==='Completed') map[key]['Check-Out']++;
    });
    return Object.values(map);
  })();

  /* ── TABS config ── */
  const TABS = [
    { key:'staff', label:'👥 Staff', icon:<Users size={12}/> },
    { key:'scan',  label:'📷 Scan QR', icon:<Camera size={12}/> },
    { key:'table', label:'📋 Attendance', icon:<BarChart2 size={12}/> },
    { key:'chart', label:'📊 Chart', icon:<BarChart2 size={12}/> },
  ];

  return (
    <div className="space-y-5 font-sans pb-10 relative">

      {/* ── TOAST ── */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fadeUp">
          <Check size={13} className="text-emerald-400"/> {toast}
        </div>
      )}

      {/* ── CONFIRM DIALOG ── */}
      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full shadow-2xl text-center">
            <AlertCircle size={28} className="text-rose-500 mx-auto mb-2"/>
            <p className="font-black text-slate-800 text-sm mb-1">Are you sure?</p>
            <p className="text-xs text-slate-500 mb-4">This action cannot be undone.</p>
            <div className="flex gap-2 justify-center">
              <button onClick={()=>{
                if (showConfirm==='clearLogs') handleClearLogs();
                else if (showConfirm.startsWith('log:')) handleDeleteLog(showConfirm.replace('log:',''));
                else handleDeleteStaff(showConfirm);
              }} className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase px-5 py-2 rounded-xl transition active:scale-95">
                Delete
              </button>
              <button onClick={()=>setShowConfirm(null)} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-black uppercase px-5 py-2 rounded-xl transition active:scale-95">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="text-blue-800" size={24}/>
            SHIFT MANAGEMENT GATEWAY
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">
            Register staff → generate QR → scan to check-in/out → view live attendance log.
          </p>
        </div>
        <button onClick={triggerSync} className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-3 py-2 rounded-xl transition">
          <RefreshCw size={13} className={isSyncing?'animate-spin':''}/> Sync
        </button>
      </div>

      {/* ── METRIC CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Staff Registered</span>
          <p className="text-2xl font-black text-blue-900 mt-0.5">{staff.length}</p>
        </div>
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Active Now</span>
          <p className="text-2xl font-black text-emerald-900 mt-0.5">{activeCount}</p>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Completed</span>
          <p className="text-2xl font-black text-slate-800 mt-0.5">{completedCount}</p>
        </div>
        <div className="p-4 bg-violet-50 border border-violet-100 rounded-2xl">
          <span className="text-[10px] font-black uppercase text-violet-500 tracking-wider flex items-center gap-1"><Calendar size={9}/> Live Clock</span>
          <p className="text-[11px] font-black text-violet-900 mt-0.5 leading-tight">{clock.short}</p>
          <p className="text-[13px] font-black text-violet-800 tabular-nums leading-tight tracking-tight">{clock.time}</p>
          <p className="text-[9px] text-violet-400 mt-0.5 font-medium leading-tight">{clock.date.split(',')[0]}</p>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(t=>(
          <button key={t.key} onClick={()=>setActiveTab(t.key)}
            className={`flex items-center gap-1 text-[11px] font-black uppercase px-4 py-1.5 rounded-lg transition-all ${activeTab===t.key?'bg-white text-slate-900 shadow-sm':'text-slate-400 hover:text-slate-600'}`}>
            {t.icon} {t.label.split(' ').slice(1).join(' ')}
          </button>
        ))}
      </div>

      {/* ══════════════ TAB: STAFF ══════════════ */}
      {activeTab==='staff' && (
        <div className="space-y-4">
          {/* Form toggle */}
          {!showForm ? (
            <button onClick={()=>{setShowForm(true);setEditMember(null);}}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-black uppercase px-4 py-2.5 rounded-xl transition active:scale-95 shadow-sm">
              <Plus size={13}/> Register New Staff
            </button>
          ) : (
            <StaffForm
              onSave={handleSaveStaff}
              onCancel={()=>{setShowForm(false);setEditMember(null);}}
              editing={editMember}
            />
          )}

          {/* Search */}
          {staff.length > 0 && (
            <div className="relative max-w-xs">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" placeholder="Search staff…" value={searchStaff}
                onChange={e=>setSearchStaff(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white focus:outline-none focus:border-blue-500 transition"/>
            </div>
          )}

          {/* Staff grid */}
          {filteredStaff.length === 0 ? (
            <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              <Users size={32} className="mx-auto mb-2 opacity-30"/>
              <p className="text-sm font-semibold">{staff.length===0?'No staff registered yet':'No staff match your search'}</p>
              <p className="text-xs mt-1">{staff.length===0?'Click "Register New Staff" to get started.':''}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredStaff.map(member=>(
                <StaffCard
                  key={member.id}
                  member={member}
                  onDelete={id=>setShowConfirm(id)}
                  onEdit={handleEditStaff}
                  onManualCheckIn={processCheckIn}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══════════════ TAB: QR SCANNER ══════════════ */}
      {activeTab==='scan' && (
        <div className="max-w-lg">
          <QRScanner onScan={handleQRScan}/>
          {/* Recent scans */}
          {logs.length > 0 && (
            <div className="mt-4 bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-[11px] font-black uppercase text-slate-600 tracking-tight">Recent Activity</p>
              </div>
              <div className="divide-y divide-slate-50">
                {logs.slice(0,5).map(l=>(
                  <div key={l.id} className="flex items-center gap-3 px-4 py-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${l.status==='Active'?'bg-emerald-500 animate-pulse':'bg-slate-300'}`}/>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{l.name}</p>
                      <p className="text-[10px] text-slate-400">{l.job} · {l.date}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-emerald-600 font-bold">IN {l.checkIn}</p>
                      {l.checkOut!=='--:--'&&<p className="text-[10px] text-rose-500 font-bold">OUT {l.checkOut}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════ TAB: ATTENDANCE TABLE ══════════════ */}
      {activeTab==='table' && (
        <div className="space-y-3">
          {/* Controls */}
          <div className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
              <input type="text" placeholder="Search by name, job, or log ID…"
                value={searchLog} onChange={e=>setSearchLog(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50 focus:outline-none focus:border-blue-500 transition"/>
            </div>
            <button onClick={exportCSV}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-2 rounded-xl border border-blue-100 bg-blue-50 text-blue-700 hover:bg-blue-100 transition active:scale-95">
              <Download size={12}/> Export CSV
            </button>
            <button onClick={()=>setShowConfirm('clearLogs')} disabled={logs.length===0}
              className="flex items-center gap-1.5 text-[11px] font-black uppercase px-3 py-2 rounded-xl border border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95">
              <Trash2 size={12}/> Clear All
            </button>
          </div>

          {/* Excel-style table */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance Register</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Auto-refreshes every 3 s · Scan = toggle check-in/out</p>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">{filteredLogs.length} rows</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs" style={{minWidth:820}}>
                <thead>
                  {/* Spreadsheet column letters */}
                  <tr className="bg-slate-100/70">
                    <th className="w-8 py-1 px-2 border-r border-slate-200 text-[9px] text-slate-300 font-bold text-center">#</th>
                    {['A','B','C','D','E','F','G','H','I'].map(l=>(
                      <th key={l} className="py-1 px-3 border-r border-slate-200 text-[9px] text-slate-300 font-bold text-center">{l}</th>
                    ))}
                  </tr>
                  <tr className="border-b-2 border-slate-200 bg-slate-50 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-2 border-r border-slate-100 w-8 text-center text-slate-300"/>
                    <th className="py-2.5 px-4 text-left border-r border-slate-100">Log ID</th>
                    <th className="py-2.5 px-4 text-left border-r border-slate-100">Name</th>
                    <th className="py-2.5 px-4 text-left border-r border-slate-100">Job</th>
                    <th className="py-2.5 px-4 text-left border-r border-slate-100">Skill</th>
                    <th className="py-2.5 px-4 text-left border-r border-slate-100">Department</th>
                    <th className="py-2.5 px-4 text-left border-r border-slate-100">Date</th>
                    <th className="py-2.5 px-4 text-left border-r border-slate-100">Check-In</th>
                    <th className="py-2.5 px-4 text-left border-r border-slate-100">Check-Out</th>
                    <th className="py-2.5 px-4 text-left">Status / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredLogs.length===0 ? (
                    <tr><td colSpan="10" className="py-14 text-center text-slate-400 italic text-xs">No attendance records found.</td></tr>
                  ) : filteredLogs.map((log,idx)=>(
                    <tr key={log.id} className={`hover:bg-blue-50/30 transition duration-100 ${idx%2===0?'bg-white':'bg-slate-50/40'}`}>
                      <td className="py-2.5 px-2 text-center text-[10px] text-slate-300 border-r border-slate-100 bg-slate-50/60 font-bold select-none">{idx+1}</td>
                      <td className="py-2.5 px-4 font-mono text-[10px] text-slate-400 font-bold border-r border-slate-100">{log.id}</td>
                      <td className="py-2.5 px-4 font-black text-slate-900 text-[11px] border-r border-slate-100">{log.name}</td>
                      <td className="py-2.5 px-4 border-r border-slate-100">
                        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">{log.job||'—'}</span>
                      </td>
                      <td className="py-2.5 px-4 text-[10px] text-slate-500 border-r border-slate-100">{log.skill||'—'}</td>
                      <td className="py-2.5 px-4 text-[10px] text-slate-500 border-r border-slate-100">{log.department||'—'}</td>
                      <td className="py-2.5 px-4 text-[10px] font-mono text-slate-500 border-r border-slate-100">{log.date}</td>
                      <td className="py-2.5 px-4 border-r border-slate-100">
                        <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded font-mono">
                          <LogIn size={8}/> {log.checkIn}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 border-r border-slate-100">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded font-mono ${log.checkOut==='--:--'?'text-slate-300':'bg-rose-50 text-rose-600'}`}>
                          <LogOut size={8}/> {log.checkOut}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5">
                          {log.status==='Active' ? (
                            <>
                              <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded border border-emerald-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"/> Active
                              </span>
                              <button onClick={()=>handleManualCheckOut(log.id)}
                                className="text-[9px] font-black uppercase bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 px-2 py-0.5 rounded transition active:scale-95">
                                Clock Out
                              </button>
                            </>
                          ) : (
                            <span className="text-[9px] bg-slate-100 text-slate-400 font-bold px-2 py-0.5 rounded">Closed</span>
                          )}
                          <button onClick={()=>setShowConfirm(`log:${log.id}`)}
                            className="p-0.5 text-slate-200 hover:text-rose-400 hover:bg-rose-50 rounded transition">
                            <X size={11}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {filteredLogs.length>0 && (
                  <tfoot>
                    <tr className="bg-slate-100/80 border-t-2 border-slate-200 text-[10px] font-black text-slate-500 uppercase">
                      <td className="py-2 px-2 border-r border-slate-200 text-center text-slate-300">Σ</td>
                      <td className="py-2 px-4 border-r border-slate-200" colSpan="2">Total: {filteredLogs.length} records</td>
                      <td className="py-2 px-4 border-r border-slate-200" colSpan="4"/>
                      <td className="py-2 px-4 border-r border-slate-200 text-emerald-600">{filteredLogs.filter(l=>l.checkIn!=='--:--').length} in</td>
                      <td className="py-2 px-4 border-r border-slate-200 text-rose-500">{filteredLogs.filter(l=>l.checkOut!=='--:--').length} out</td>
                      <td className="py-2 px-4">{activeCount} active · {completedCount} done</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ TAB: CHART ══════════════ */}
      {activeTab==='chart' && (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <BarChart2 size={16} className="text-blue-700"/>
            <div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Attendance by Job</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Check-In vs Check-Out grouped per role.</p>
            </div>
          </div>
          {chartData.length===0 ? (
            <p className="py-14 text-center text-xs italic text-slate-400">No attendance data yet — check in some staff first.</p>
          ) : (
            <div className="px-4 pt-4 pb-4">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData} margin={{top:4,right:16,left:-10,bottom:4}}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
                  <XAxis dataKey="role" tick={{fontSize:10,fontWeight:700,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                  <YAxis allowDecimals={false} tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={{fontSize:11,borderRadius:10,border:'1px solid #e2e8f0'}}/>
                  <Legend wrapperStyle={{fontSize:10,paddingTop:8}} iconType="circle" iconSize={8}/>
                  <Bar dataKey="Check-In"  fill="#10b981" radius={[4,4,0,0]} maxBarSize={40}/>
                  <Bar dataKey="Check-Out" fill="#3b82f6" radius={[4,4,0,0]} maxBarSize={40}/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .animate-fadeUp { animation: fadeUp 0.25s ease both; }
      `}</style>
    </div>
  );
}