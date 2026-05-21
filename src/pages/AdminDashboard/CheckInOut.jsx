import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  Clock, LogIn, LogOut, Search, UserCheck, 
  UserX, ShieldAlert, Calendar, RefreshCw 
} from 'lucide-react';

export default function CheckInOut() {
  // Extract user array from context to track which staff members are logging shifts
  const { usersData } = useContext(ShopContext) || {};
  
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  // Load active logging streams
  useEffect(() => {
    // Standard professional seed data setup
    const defaultLogs = [
      { id: 'LOG-8812', name: 'Phy Sopheak', role: 'Admin', checkIn: '08:00 AM', checkOut: '--:--', status: 'Active' },
      { id: 'LOG-8813', name: 'Sok Theara', role: 'Manager', checkIn: '08:30 AM', checkOut: '05:00 PM', status: 'Completed' },
      { id: 'LOG-8814', name: 'Chan Nika', role: 'Customer Support', checkIn: '09:00 AM', checkOut: '--:--', status: 'Active' },
      { id: 'LOG-8815', name: 'Keo Rotha', role: 'Moderator', checkIn: '01:00 PM', checkOut: '05:30 PM', status: 'Completed' }
    ];

    const savedLogs = localStorage.getItem('psp_shift_attendance_logs');
    if (savedLogs) {
      try { setLogs(JSON.parse(savedLogs)); } catch { setLogs(defaultLogs); }
    } else {
      setLogs(defaultLogs);
      localStorage.setItem('psp_shift_attendance_logs', JSON.stringify(defaultLogs));
    }
  }, []);

  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 600);
  };

  // Action: Instantly trigger a Check-In for an active account profile
  const handleCheckIn = (staffName, staffRole) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      name: staffName,
      role: staffRole || 'Staff Member',
      checkIn: timeString,
      checkOut: '--:--',
      status: 'Active'
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem('psp_shift_attendance_logs', JSON.stringify(updated));
  };

  // Action: Instantly trigger a Check-Out out of a running shift log frame
  const handleCheckOut = (logId) => {
    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updated = logs.map(log => {
      if (log.id === logId) {
        return { ...log, checkOut: timeString, status: 'Completed' };
      }
      return log;
    });
    setLogs(updated);
    localStorage.setItem('psp_shift_attendance_logs', JSON.stringify(updated));
  };

  // Compute live operational analytical values
  const activeCheckIns = logs.filter(l => l.status === 'Active').length;
  const completedShifts = logs.filter(l => l.status === 'Completed').length;

  // Filter matrix search mapping logs
  const filteredLogs = logs.filter(log => 
    log.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans pb-10">
      
      {/* HEADER OPERATIONS PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="text-blue-800" size={24} /> 
            SHIFT MANAGEMENT GATEWAY
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">
            Track operational staff duty timelines, attendance registers, and login connectivity metrics.
          </p>
        </div>
        
        {/* Quick action simulation to log the root Admin user in directly */}
        <button 
          onClick={() => handleCheckIn('Phy Sopheak', 'Admin')}
          className="bg-blue-800 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
        >
          <LogIn size={14} />
          <span>Simulate Admin Check-In</span>
        </button>
      </div>

      {/* METRICS CONTROL BANNER BOXES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Active Shifts on Duty</span>
            <p className="text-2xl font-black text-emerald-900 mt-0.5">{activeCheckIns} Staff</p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><UserCheck size={20} /></div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Completed Logs Today</span>
            <p className="text-2xl font-black text-slate-800 mt-0.5">{completedShifts} Records</p>
          </div>
          <div className="w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center"><UserX size={20} /></div>
        </div>

        <div className="p-4 bg-blue-50/30 border border-blue-100/80 rounded-2xl shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">System Clock Stream</span>
            <p className="text-sm font-black text-blue-900 mt-1 uppercase flex items-center gap-1.5">
              <Calendar size={13} className="text-blue-400" />
              May 22, 2026
            </p>
          </div>
          <button onClick={triggerSync} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
            <RefreshCw size={15} className={`text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* SEARCH AND CONTROL PIPELINE */}
      <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-xs">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Filter operations register via employee name or transaction log id..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200/80 rounded-xl focus:outline-none focus:border-blue-800 bg-slate-50/50 text-xs font-semibold text-slate-700"
          />
        </div>
      </div>

      {/* MAIN REGISTRATION LOG MANIFEST TABLE */}
      <div className="bg-white rounded-2xl shadow-xs border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-50/50 to-white flex items-center justify-between">
          <div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-tight">Active Terminal Operational Logs</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Monitors direct gateway clock access timestamps and administrative status reports.</p>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
            Total Captured Rows: {filteredLogs.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60 text-gray-400 font-black uppercase text-[10px] tracking-wider">
                <th className="py-3 px-5">System Transaction Unit</th>
                <th className="py-3 px-5">Employee / Core Role</th>
                <th className="py-3 px-5">Check-In Timestamp</th>
                <th className="py-3 px-5">Check-Out Timestamp</th>
                <th className="py-3 px-5">Shift Condition</th>
                <th className="py-3 px-5 text-right">Gate Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 font-medium divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 italic">
                    No active shift attendance logging indexes found matching current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/40 transition duration-150">
                    
                    {/* LOG REFERENCE ID */}
                    <td className="py-3.5 px-5 font-mono text-slate-400 font-bold text-[11px]">
                      #{log.id}
                    </td>

                    {/* STAFF PROFILE DATA */}
                    <td className="py-3.5 px-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 text-xs">{log.name}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">{log.role}</span>
                      </div>
                    </td>

                    {/* TIME VALUES */}
                    <td className="py-3.5 px-5 text-slate-700 font-semibold font-mono">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                        <LogIn size={10} className="text-emerald-600" /> {log.checkIn}
                      </span>
                    </td>
                    
                    <td className="py-3.5 px-5 text-slate-700 font-semibold font-mono">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] ${log.checkOut === '--:--' ? 'text-slate-300' : 'bg-slate-100'}`}>
                        <LogOut size={10} className={log.checkOut === '--:--' ? 'text-slate-300' : 'text-rose-500'} /> {log.checkOut}
                      </span>
                    </td>

                    {/* STATUS TAGS */}
                    <td className="py-3.5 px-5">
                      {log.status === 'Active' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-emerald-50 text-emerald-600 font-bold rounded-md border border-emerald-100">
                          <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" /> Active Duty
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] bg-slate-100 text-slate-500 font-bold rounded-md border border-slate-200/50">
                          Shift Closed
                        </span>
                      )}
                    </td>

                    {/* INTERACTIVE ACTION BUTTON */}
                    <td className="py-3.5 px-5 text-right">
                      {log.status === 'Active' ? (
                        <button 
                          onClick={() => handleCheckOut(log.id)}
                          className="bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-100 hover:border-rose-600 font-black text-[10px] px-2.5 py-1 rounded-lg transition-all active:scale-95 cursor-pointer uppercase tracking-tight"
                        >
                          Clock Out
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-300 italic font-medium pr-2">Archived</span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}