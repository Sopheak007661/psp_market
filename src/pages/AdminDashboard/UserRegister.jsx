
// import React, { useContext, useState, useEffect, useCallback } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import {
//   Users, Shield, UserX,
//   Search, Mail, Calendar, CheckCircle,
//   AlertCircle, ShieldCheck, RefreshCw
// } from 'lucide-react';

// // ─── Same key used in App.jsx saveRegisteredUser() ───────────────────────────
// const USER_LEDGER_KEY = 'psp_registered_users';

// export default function UserRegister() {
//   const { removeUser } = useContext(ShopContext) || {};

//   const readLedger = useCallback(() => {
//     try { return JSON.parse(localStorage.getItem(USER_LEDGER_KEY) || '[]'); } catch { return []; }
//   }, []);

//   const [users,      setUsers]      = useState(readLedger);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterRole, setFilterRole] = useState('All');

//   // ── Listen for new registrations from App.jsx (same tab + other tabs) ──────
//   const refresh = useCallback(() => setUsers(readLedger()), [readLedger]);

//   useEffect(() => {
//     window.addEventListener('psp_user_sync', refresh); // same-tab custom event
//     window.addEventListener('storage',       refresh); // cross-tab storage event
//     return () => {
//       window.removeEventListener('psp_user_sync', refresh);
//       window.removeEventListener('storage',       refresh);
//     };
//   }, [refresh]);

//   // ── Also poll every 3 seconds as a safety net ────────────────────────────
//   useEffect(() => {
//     const timer = setInterval(refresh, 3000);
//     return () => clearInterval(timer);
//   }, [refresh]);

//   // ── Delete user ───────────────────────────────────────────────────────────
//   const handleDeleteUser = (userId) => {
//     if (!window.confirm(`Remove user ${userId} from the register?`)) return;
//     if (removeUser) removeUser(userId);
//     const updated = users.filter(u => u.id !== userId);
//     setUsers(updated);
//     localStorage.setItem(USER_LEDGER_KEY, JSON.stringify(updated));
//   };

//   // ── Metrics ───────────────────────────────────────────────────────────────
//   const totalUsers  = users.length;
//   const activeCount = users.filter(u => u.status === 'Active').length;
//   const todayCount  = users.filter(u => u.date === new Date().toISOString().slice(0, 10)).length;

//   // ── Filter ────────────────────────────────────────────────────────────────
//   const filteredUsers = users.filter(user => {
//     const q = searchTerm.toLowerCase();
//     const matchSearch =
//       user.name.toLowerCase().includes(q) ||
//       user.email.toLowerCase().includes(q) ||
//       user.id.toLowerCase().includes(q);
//     const matchRole = filterRole === 'All' || user.role === filterRole;
//     return matchSearch && matchRole;
//   });

//   return (
//     <div className="space-y-6 font-sans pb-10  p-5 shadow-md shadow-blue-800 bg-slate-300 rounded-xl">

//       {/* ── METRICS ── */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[14px] uppercase font-black text-blue-800  tracking-normal ">Total Registered</span>
//             <h3 className="text-2xl font-black text-slate-900 mt-3">{totalUsers}</h3>
//           </div>
//           <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
//             <Users size={20} />
//           </div>
//         </div>

//         <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[14px] uppercase font-black text-blue-800  tracking-normal ">Active Users</span>
//             <h3 className="text-2xl font-black text-emerald-600 mt-3">
//               {activeCount} <span className="text-xs font-semibold text-slate-400">online</span>
//             </h3>
//           </div>
//           <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
//             <CheckCircle size={20} />
//           </div>
//         </div>

//         <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
//           <div>
//             <span className="text-[14px] uppercase font-black text-blue-800  tracking-normal ">Joined Today</span>
//             <h3 className="text-2xl font-black text-blue-600 mt-3">{todayCount}</h3>
//           </div>
//           <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
//             <ShieldCheck size={20} />
//           </div>
//         </div>
//       </div>

//       {/* ── CONTROLS ── */}
//       <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//           <input
//             type="text"
//             placeholder="Search by name, email or ID…"
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-200/80 rounded-xl focus:outline-none focus:border-blue-600 bg-slate-50/50 text-xs font-semibold text-slate-700"
//           />
//         </div>
//         <div className="flex items-center gap-3 self-end md:self-auto">
//           <select
//             value={filterRole}
//             onChange={e => setFilterRole(e.target.value)}
//             className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 bg-white text-xs font-bold text-slate-600 h-[36px]"
//           >
//             <option value="All">All Roles</option>
//             <option value="Admin">Admin</option>
//             <option value="Manager">Manager</option>
//             <option value="Moderator">Moderator</option>
//             <option value="Customer">Customer</option>
//           </select>
//           <button
//             onClick={refresh}
//             title="Refresh"
//             className="h-[36px] px-3 border border-gray-200 rounded-xl bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 transition flex items-center gap-1.5 text-xs font-bold"
//           >
//             <RefreshCw size={13} /> Refresh
//           </button>
//         </div>
//       </div>

//       {/* ── TABLE ── */}
//       <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
//         <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
//           <div>
//             <h2 className="text-[14px] uppercase font-black text-blue-800  tracking-normal ">
//               USER registered
//             </h2>
//           </div>
//           <span className="text-[10px] font-black tracking-wide bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase">
//             {filteredUsers.length} Records
//           </span>
//         </div>

//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse text-xs">
//             <thead>
//               <tr className="border-b border-gray-300 bg-slate-50/60 text-gray-700 font-black  text-[10px] tracking-normal">
//                 <th className="py-3 px-5">User</th>
//                 <th className="py-3 px-5">Role</th>
//                 <th className="py-3 px-5">Registered Date</th>
//                 <th className="py-3 px-5">Status</th>
//                 <th className="py-3 px-5 text-right">Action</th>
//               </tr>
//             </thead>
//             <tbody className="text-slate-600 font-medium divide-y divide-gray-100">
//               {filteredUsers.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="py-14 text-center">
//                     <div className="flex flex-col items-center gap-2 text-slate-400">
//                       <Users size={32} className="opacity-60" />
//                       <p className="text-sm font-semibold text-red-500">No registered users yet</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 filteredUsers.map(user => {
//                   let roleBadge = 'bg-slate-100 text-slate-600';
//                   if (user.role === 'Admin')     roleBadge = 'bg-rose-50 text-rose-600 border border-rose-100 font-black';
//                   else if (user.role === 'Manager')   roleBadge = 'bg-blue-50 text-blue-600 border border-blue-100';
//                   else if (user.role === 'Moderator') roleBadge = 'bg-purple-50 text-purple-600 border border-purple-100';
//                   else if (user.role === 'Customer')  roleBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-100';

//                   const isProtected = user.role === 'Admin';

//                   return (
//                     <tr key={user.id} className="hover:bg-slate-50/40 transition duration-150">

//                       {/* USER PROFILE */}
//                       <td className="py-3.5 px-5 flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-black flex items-center justify-center uppercase text-sm shadow-sm flex-shrink-0">
//                           {user.name ? user.name.charAt(0).toUpperCase() : '?'}
//                         </div>
//                         <div className="flex flex-col min-w-0">
//                           <span className="font-black text-slate-900 text-xs truncate max-w-[180px]">
//                             {user.name}
//                           </span>
//                           <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
//                             <Mail size={9} className="text-slate-900 flex-shrink-0" />
//                             {user.email}
//                           </span>
//                           <span className="text-[9px] text-blue-500 font-mono font-bold tracking-normal">{user.id}</span>
//                         </div>
//                       </td>

//                       {/* ROLE */}
//                       <td className="py-3.5 px-5">
//                         <span className={`px-2 py-0.5 text-[9px] rounded-md font-bold tracking-tight uppercase inline-flex items-center gap-1 ${roleBadge}`}>
//                           <Shield size={9} className="shrink-0" />
//                           {user.role}
//                         </span>
//                       </td>

//                       {/* DATE */}
//                       <td className="py-3.5 px-5 font-mono text-slate-400 text-[11px]">
//                         <span className="flex items-center gap-1">
//                           <Calendar size={10} className="text-slate-300" />
//                           {user.date || '—'}
//                         </span>
//                       </td>

//                       {/* STATUS */}
//                       <td className="py-3.5 px-5">
//                         {user.status === 'Active' ? (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-600 font-bold rounded-md border border-emerald-100">
//                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
//                             Active
//                           </span>
//                         ) : (
//                           <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-amber-50 text-amber-600 font-bold rounded-md border border-amber-100">
//                             <AlertCircle size={10} /> Suspended
//                           </span>
//                         )}
//                       </td>

//                       {/* DELETE */}
//                       <td className="py-3.5 px-5 text-right">
//                         <button
//                           onClick={() => handleDeleteUser(user.id)}
//                           disabled={isProtected}
//                           title={isProtected ? 'Admin accounts are protected' : 'Remove user'}
//                           className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
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



import React, { useState, useEffect, useCallback } from 'react';
import {
  Users, Shield, UserX, Search, Mail, Calendar,
  CheckCircle, AlertCircle, ShieldCheck, RefreshCw,
  UserCheck, Ban,
} from 'lucide-react';

// ── Point this at your backend (same as App.jsx) ─────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function UserRegister() {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // ── Fetch all users from MySQL via the API ────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API_BASE}/api/users`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount + auto-refresh every 30 seconds
  useEffect(() => {
    fetchUsers();
    const timer = setInterval(fetchUsers, 30_000);
    return () => clearInterval(timer);
  }, [fetchUsers]);

  // ── Delete user ───────────────────────────────────────────────────────────
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Remove "${userName}" (${userId}) permanently?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        alert('Error: ' + (d.message || 'Could not delete user.'));
        return;
      }
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch {
      alert('Network error. Please try again.');
    }
  };

  // ── Toggle Active / Suspended ─────────────────────────────────────────────
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    if (!window.confirm(`Set this user to "${newStatus}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert('Error: ' + (d.message || 'Could not update status.'));
        return;
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    } catch {
      alert('Network error. Please try again.');
    }
  };

  // ── Metrics ───────────────────────────────────────────────────────────────
  const totalUsers  = users.length;
  const activeCount = users.filter(u => u.status === 'Active').length;
  const todayStr    = new Date().toISOString().slice(0, 10);
  const todayCount  = users.filter(u => (u.date || u.created_date || '').slice(0, 10) === todayStr).length;

  // ── Filter ────────────────────────────────────────────────────────────────
  const filteredUsers = users.filter(user => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (user.name  || '').toLowerCase().includes(q) ||
      (user.email || '').toLowerCase().includes(q) ||
      (user.id    || '').toLowerCase().includes(q);
    const matchRole = filterRole === 'All' || user.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6 font-sans pb-10 p-5 shadow-md shadow-blue-800 bg-slate-300 rounded-xl">

      {/* ── METRICS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[14px] uppercase font-black text-blue-800 tracking-normal">Total Registered</span>
            <h3 className="text-2xl font-black text-slate-900 mt-3">{totalUsers}</h3>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[14px] uppercase font-black text-blue-800 tracking-normal">Active Users</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-3">
              {activeCount} <span className="text-xs font-semibold text-slate-400">active</span>
            </h3>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[14px] uppercase font-black text-blue-800 tracking-normal">Joined Today</span>
            <h3 className="text-2xl font-black text-blue-600 mt-3">{todayCount}</h3>
          </div>
          <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* ── ERROR BANNER ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
          <button onClick={fetchUsers} className="ml-auto text-xs font-bold underline hover:no-underline">Retry</button>
        </div>
      )}

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
            onClick={fetchUsers}
            disabled={loading}
            className="h-[36px] px-3 border border-gray-200 rounded-xl bg-white text-slate-500 hover:text-blue-600 hover:border-blue-300 transition flex items-center gap-1.5 text-xs font-bold disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            {loading ? 'Loading…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
          <h2 className="text-[14px] uppercase font-black text-blue-800 tracking-normal">
            USER REGISTER — MySQL Database
          </h2>
          <span className="text-[10px] font-black tracking-wide bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md uppercase">
            {filteredUsers.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          {loading && users.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
              <RefreshCw size={28} className="animate-spin opacity-40" />
              <p className="text-sm">Loading users from database…</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-300 bg-slate-50/60 text-gray-700 font-black text-[10px] tracking-normal">
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-5">Role</th>
                  <th className="py-3 px-5">Registered Date</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-600 font-medium divide-y divide-gray-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-14 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Users size={32} className="opacity-60" />
                        <p className="text-sm font-semibold text-red-500">
                          {searchTerm ? `No users match "${searchTerm}"` : 'No registered users yet'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(user => {
                    let roleBadge = 'bg-slate-100 text-slate-600';
                    if (user.role === 'Admin')      roleBadge = 'bg-rose-50 text-rose-600 border border-rose-100 font-black';
                    else if (user.role === 'Manager')   roleBadge = 'bg-blue-50 text-blue-600 border border-blue-100';
                    else if (user.role === 'Moderator') roleBadge = 'bg-purple-50 text-purple-600 border border-purple-100';
                    else if (user.role === 'Customer')  roleBadge = 'bg-emerald-50 text-emerald-700 border border-emerald-100';

                    const isProtected = user.role === 'Admin';
                    const displayDate = (user.date || user.created_date || '—');

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/40 transition duration-150">

                        {/* USER PROFILE */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white font-black flex items-center justify-center uppercase text-sm shadow-sm flex-shrink-0">
                              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-black text-slate-900 text-xs truncate max-w-[180px]">{user.name}</span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                                <Mail size={9} className="text-slate-900 flex-shrink-0" />
                                {user.email}
                              </span>
                              <span className="text-[9px] text-blue-500 font-mono font-bold">{user.id}</span>
                            </div>
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
                            {displayDate}
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

                        {/* ACTIONS */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* Suspend / Activate toggle */}
                            <button
                              onClick={() => handleToggleStatus(user.id, user.status)}
                              disabled={isProtected}
                              title={isProtected ? 'Admin accounts are protected' : (user.status === 'Active' ? 'Suspend user' : 'Activate user')}
                              className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-1.5 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                            >
                              {user.status === 'Active' ? <Ban size={15} /> : <UserCheck size={15} />}
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              disabled={isProtected}
                              title={isProtected ? 'Admin accounts are protected' : 'Remove user'}
                              className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-xl transition-all active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 cursor-pointer"
                            >
                              <UserX size={15} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer note */}
        <div className="px-5 py-3 border-t border-gray-100 bg-slate-50/40 text-[10px] text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
          Data stored in MySQL (Aiven) — visible from any device
        </div>
      </div>
    </div>
  );
}