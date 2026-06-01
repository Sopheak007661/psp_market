// import React, { useContext, useState, useEffect } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Users, UserPlus, Shield, UserX, 
//   Search, Mail, Calendar, CheckCircle, 
//   AlertCircle, ShieldCheck
// } from 'lucide-react';

// export default function UserRegister() {
//   // 1. Extract global context arrays (Fallback to a mock ledger if backend data streams aren't bound yet)
//   const { usersData, removeUser } = useContext(ShopContext) || {};
  
//   // Local active list handling synced with local systems
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('All');

//   // Load and populate the systemic authentication matrix
//   useEffect(() => {
//     if (usersData && usersData.length > 0) {
//       setUsers(usersData);
//     } else {
//       // 🌟 Professional fallback dataset matching your developer identity parameters
//       const defaultUsers = [
//         { id: 'USR-9021', name: 'Phy Sopheak', email: 'sopheak.admin@psp.domain', role: 'Admin', status: 'Active', date: '2026-01-15' },
//         { id: 'USR-1044', name: 'Sok Theara', email: 'theara.s@market.com', role: 'Manager', status: 'Active', date: '2026-02-28' },
//         { id: 'USR-4822', name: 'Chan Nika', email: 'nika.chan@client.kh', role: 'Customer', status: 'Active', date: '2026-04-10' },
//         { id: 'USR-7719', name: 'Keo Rotha', email: 'rotha.keo@ops.net', role: 'Moderator', status: 'Suspended', date: '2026-05-02' }
//       ];
      
//       const savedUsers = localStorage.getItem('psp_market_user_ledger');
//       if (savedUsers) {
//         try { setUsers(JSON.parse(savedUsers)); } catch { setUsers(defaultUsers); }
//       } else {
//         setUsers(defaultUsers);
//         localStorage.setItem('psp_market_user_ledger', JSON.stringify(defaultUsers));
//       }
//     }
//   }, [usersData]);

//   // Operational function to terminate an account profile record
//   const handleDeleteUser = (userId) => {
//     if (window.confirm(`Are you completely sure you want to terminate user session sequence: ${userId}?`)) {
//       if (removeUser) {
//         removeUser(userId);
//       } else {
//         const updated = users.filter(u => u.id !== userId);
//         setUsers(updated);
//         localStorage.setItem('psp_market_user_ledger', JSON.stringify(updated));
//       }
//     }
//   };

//   // Metrics computation engines
//   const totalUsers = users.length;
//   const adminCount = users.filter(u => u.role === 'Admin' || u.role === 'Manager').length;
//   const activeCount = users.filter(u => u.status === 'Active').length;

//   // Search filter evaluation processor
//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                           user.id.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesRole = filterRole === 'All' || user.role === filterRole;
//     return matchesSearch && matchesRole;
//   });

//   return (
//     <div className="space-y-6 font-sans pb-10">
      
//       {/* 1. TOP METRICS BANNER MATRIX */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Registered Accounts</span>
//             <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalUsers}</h3>
//           </div>
//           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Users size={20} /></div>
//         </div>
//         <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Core Operations Staff</span>
//             <h3 className="text-2xl font-black text-slate-900 mt-0.5">{adminCount}</h3>
//           </div>
//           <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center"><ShieldCheck size={20} /></div>
//         </div>
//         <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Stabilized Online Status</span>
//             <h3 className="text-2xl font-black text-emerald-600 mt-0.5">{activeCount} <span className="text-xs font-semibold text-slate-400">Live</span></h3>
//           </div>
//           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><CheckCircle size={20} /></div>
//         </div>
//       </div>

//       {/* 2. CONTROLS & FILTER SYSTEM */}
//       <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
//         {/* Dynamic Search Box */}
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//           <input 
//             type="text" 
//             placeholder="Search credentials via name, email, or profile identifier..." 
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-200/80 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50/50 text-xs font-semibold text-slate-700"
//           />
//         </div>

//         {/* Filter Selection Pipeline */}
//         <div className="flex items-center gap-3 self-end md:self-auto">
//           <select 
//             value={filterRole} 
//             onChange={(e) => setFilterRole(e.target.value)}
//             className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white text-xs font-bold text-slate-600 h-[36px]"
//           >
//             <option value="All">All Structural Roles</option>
//             <option value="Admin">Admin Clearance</option>
//             <option value="Manager">Manager Clearance</option>
//             <option value="Moderator">Moderator Operations</option>
//             <option value="Customer">Customer Accounts</option>
//           </select>
//         </div>
//       </div>

//       {/* 3. PRIMARY USER MATRIX MANIFEST TABLE */}
//       <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 bg-linear-to-r from-slate-50/50 to-white flex items-center justify-between">
//           <div>
//             <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Systemic User Authorization Database</h2>
//             <p className="text-[11px] text-gray-400 mt-0.5">Displays security clearing parameters and core account metadata channels.</p>
//           </div>
//           <span className="text-[10px] font-black tracking-wide bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase">
//             Records Matching: {filteredUsers.length}
//           </span>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse text-xs">
//             <thead>
//               <tr className="border-b border-gray-100 bg-slate-50/60 text-gray-400 font-black uppercase text-[10px] tracking-wider">
//                 <th className="py-3 px-5">System Account Identity Profile</th>
//                 <th className="py-3 px-5">Security Clear Role</th>
//                 <th className="py-3 px-5">Enrollment Date Log</th>
//                 <th className="py-3 px-5">Account Status</th>
//                 <th className="py-3 px-5 text-right">Administrative Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-slate-600 font-medium divide-y divide-gray-100">
//               {filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="py-12 text-center text-slate-400 italic">
//                     No active account registration credentials matched current parsing vectors.
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map((user) => {
                  
//                   // Dynamic evaluation rules for security operational tag variations
//                   let roleBadge = "bg-slate-100 text-slate-600";
//                   if (user.role === 'Admin') roleBadge = "bg-rose-50 text-rose-600 border border-rose-100 font-black";
//                   else if (user.role === 'Manager') roleBadge = "bg-blue-50 text-blue-600 border border-blue-100";
//                   else if (user.role === 'Moderator') roleBadge = "bg-purple-50 text-purple-600 border border-purple-100";

//                   return (
//                     <tr key={user.id} className="hover:bg-slate-50/40 transition duration-150">
//                       {/* PROFILE DATA IDENTIFICATION TRACK */}
//                       <td className="py-3.5 px-5 flex items-center gap-3">
//                         <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-black flex items-center justify-center uppercase tracking-tighter shadow-inner">
//                           {user.name ? user.name.substring(0, 2) : 'US'}
//                         </div>
//                         <div className="flex flex-col min-w-0">
//                           <span className="font-black text-slate-900 text-xs truncate max-w-[160px] sm:max-w-[240px]">{user.name}</span>
//                           <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium truncate max-w-[180px]">
//                             <Mail size={10} className="text-slate-300" /> {user.email}
//                           </span>
//                         </div>
//                       </td>

//                       {/* CLEARANCE ROLE ASSIGNMENT */}
//                       <td className="py-3.5 px-5 vertical-middle">
//                         <span className={`px-2 py-0.5 text-[9px] rounded-md font-bold tracking-tight uppercase flex items-center w-fit gap-1 ${roleBadge}`}>
//                           <Shield size={10} className="shrink-0" />
//                           {user.role}
//                         </span>
//                       </td>

//                       {/* DATE FIELD ENROLLMENT */}
//                       <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">
//                         <span className="flex items-center gap-1 font-medium">
//                           <Calendar size={11} className="text-slate-300" />
//                           {user.date || '2026-05-22'}
//                         </span>
//                       </td>

//                       {/* OPERATIONAL REPUTATION STATUS */}
//                       <td className="py-3.5 px-5">
//                         {user.status === 'Active' ? (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-600 font-bold rounded-md border border-emerald-100">
//                             <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> Active / Online
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-amber-50 text-amber-600 font-bold rounded-md border border-amber-100">
//                             <AlertCircle size={10} /> Suspended
//                           </span>
//                         )}
//                       </td>

//                       {/* ADMINISTRATIVE DATA DELETION SWITCH */}
//                       <td className="py-3.5 px-5 text-right">
//                         <button 
//                           onClick={() => handleDeleteUser(user.id)}
//                           disabled={user.role === 'Admin' && user.name === 'Phy Sopheak'} // Protect root operator account profile
//                           className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
//                           title={user.role === 'Admin' ? 'Root operator profiles are secured' : 'Revoke profile authorization logs'}
//                         >
//                           <UserX size={15} />
//                         </button>
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











import React, { useContext, useState, useEffect, useCallback } from 'react';
import { ShopContext } from '../../context/ShopContext';
import {
  Users, Shield, UserX,
  Search, Mail, Calendar, CheckCircle,
  AlertCircle, ShieldCheck, RefreshCw
} from 'lucide-react';

// ─── Same key used in App.jsx saveRegisteredUser() ───────────────────────────
const USER_LEDGER_KEY = 'psp_registered_users';

export default function UserRegister() {
  const { removeUser } = useContext(ShopContext) || {};

  const readLedger = useCallback(() => {
    try { return JSON.parse(localStorage.getItem(USER_LEDGER_KEY) || '[]'); } catch { return []; }
  }, []);

  const [users,      setUsers]      = useState(readLedger);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // ── Listen for new registrations from App.jsx (same tab + other tabs) ──────
  const refresh = useCallback(() => setUsers(readLedger()), [readLedger]);

  useEffect(() => {
    window.addEventListener('psp_user_sync', refresh); // same-tab custom event
    window.addEventListener('storage',       refresh); // cross-tab storage event
    return () => {
      window.removeEventListener('psp_user_sync', refresh);
      window.removeEventListener('storage',       refresh);
    };
  }, [refresh]);

  // ── Also poll every 3 seconds as a safety net ────────────────────────────
  useEffect(() => {
    const timer = setInterval(refresh, 3000);
    return () => clearInterval(timer);
  }, [refresh]);

  // ── Delete user ───────────────────────────────────────────────────────────
  const handleDeleteUser = (userId) => {
    if (!window.confirm(`Remove user ${userId} from the register?`)) return;
    if (removeUser) removeUser(userId);
    const updated = users.filter(u => u.id !== userId);
    setUsers(updated);
    localStorage.setItem(USER_LEDGER_KEY, JSON.stringify(updated));
  };

  // ── Metrics ───────────────────────────────────────────────────────────────
  const totalUsers  = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const todayCount  = users.filter(u => u.date === new Date().toISOString().slice(0, 10)).length;

  // ── Filter ────────────────────────────────────────────────────────────────
  const filteredUsers = users.filter(user => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      user.name.toLowerCase().includes(q) ||
      user.email.toLowerCase().includes(q) ||
      user.id.toLowerCase().includes(q);
    const matchRole = filterRole === 'All' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 font-sans pb-10">

      {/* ── METRICS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Total Registered</span>
            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalUsers}</h3>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Active Users</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-0.5">
              {activeCount} <span className="text-xs font-semibold text-slate-400">online</span>
            </h3>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Joined Today</span>
            <h3 className="text-2xl font-black text-blue-600 mt-0.5">{todayCount}</h3>
          </div>
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* ── CONTROLS ── */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email or ID…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200/80 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50/50 text-xs font-semibold text-slate-700"
          />
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white text-xs font-bold text-slate-600 h-[36px]"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Moderator">Moderator</option>
            <option value="Customer">Customer</option>
          </select>
          <button
            onClick={refresh}
            title="Refresh"
            className="h-[36px] px-3 border border-gray-200 rounded-xl bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 transition flex items-center gap-1.5 text-xs font-bold"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">
              Registered Users from Login Page
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Every customer who registers via the Register form appears here instantly.
            </p>
          </div>
          <span className="text-[10px] font-black tracking-wide bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase">
            {filteredUsers.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60 text-gray-400 font-black uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Registered Date</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 font-medium divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-14 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Users size={32} className="opacity-30" />
                      <p className="text-sm font-semibold text-slate-500">No registered users yet</p>
                      <p className="text-xs">When a visitor completes the Register form on the login page, they will appear here automatically.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  let roleBadge = 'bg-slate-100 text-slate-600';
                  if (user.role === 'Admin')     roleBadge = 'bg-rose-50 text-rose-600 border border-rose-100 font-black';
                  else if (user.role === 'Manager')   roleBadge = 'bg-blue-50 text-blue-600 border border-blue-100';
                  else if (user.role === 'Moderator') roleBadge = 'bg-purple-50 text-purple-600 border border-purple-100';
                  else if (user.role === 'Customer')  roleBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-100';

                  const isProtected = user.role === 'Admin';

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/40 transition duration-150">

                      {/* USER PROFILE */}
                      <td className="py-3.5 px-5 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-black flex items-center justify-center uppercase text-sm shadow-sm flex-shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-slate-900 text-xs truncate max-w-[180px]">
                            {user.name}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                            <Mail size={9} className="text-slate-300 flex-shrink-0" />
                            {user.email}
                          </span>
                          <span className="text-[9px] text-slate-300 font-mono">{user.id}</span>
                        </div>
                      </td>

                      {/* ROLE */}
                      <td className="py-3.5 px-5">
                        <span className={`px-2 py-0.5 text-[9px] rounded-md font-bold tracking-tight uppercase inline-flex items-center gap-1 ${roleBadge}`}>
                          <Shield size={9} className="shrink-0" />
                          {user.role}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} className="text-slate-300" />
                          {user.date || '—'}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-5">
                        {user.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-600 font-bold rounded-md border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-amber-50 text-amber-600 font-bold rounded-md border border-amber-100">
                            <AlertCircle size={10} /> Suspended
                          </span>
                        )}
                      </td>

                      {/* DELETE */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isProtected}
                          title={isProtected ? 'Admin accounts are protected' : 'Remove user'}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                        >
                          <UserX size={15} />
                        </button>
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