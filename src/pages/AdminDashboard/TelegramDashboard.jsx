import React, { useState, useEffect } from 'react';
import { 
  Send, Users, MessageSquare, Zap, RefreshCw, 
  AlertTriangle, CheckCircle2, DollarSign, 
  Receipt, Clock, ExternalLink, Trash2, ShieldCheck, Filter, Eye
} from 'lucide-react';

export default function TelegramDashboard({ userRole, userEmail }) {
  const [orderHistory, setOrderHistory] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed'
  const [selectedInvoice, setSelectedInvoice] = useState(null); // Simple item itemized modal

  // Exact credentials mapped securely from your system core setup
  const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
  const TELEGRAM_CHAT_ID = "6710148858"; 

  // Core parsing controller parsing localStorage values safely
  const loadRealMarketData = () => {
    const savedHistory = localStorage.getItem('psp_market_order_history');
    if (savedHistory) {
      setOrderHistory(JSON.parse(savedHistory));
    } else {
      setOrderHistory([]);
    }
  };

  useEffect(() => {
    // 1. Initial Load of Ledger Data
    loadRealMarketData();

    // 2. Window Level Event Listener: Catches storage updates fired from other components
    const handleStorageChange = (e) => {
      if (e.key === 'psp_market_order_history') {
        loadRealMarketData();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // 3. Local Polling Fallback Loop: Catches variations made within the same active document pipeline instantly
    const internalFallbackInterval = setInterval(() => {
      loadRealMarketData();
    }, 1500); // Scans the client-side buffer every 1.5 seconds automatically

    // Cleanup runtime hooks on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(internalFallbackInterval);
    };
  }, []);

  // Manual Trigger Force Action
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadRealMarketData();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  // 🌟 Administrative Data Purge Routine 
  const handleDeleteRecord = (orderId) => {
    // Strict Verification check
    if (userRole !== 'admin') {
      alert("Access Denied: You do not possess administrative permissions to modify tracking logs.");
      return;
    }

    const confirmPurge = window.confirm(`Are you absolutely sure you want to permanently delete Order Record #${orderId}? This cannot be undone.`);
    
    if (confirmPurge) {
      const updatedMasterLedger = orderHistory.filter(order => order.id !== orderId);
      
      // Sync to browser localStorage database
      localStorage.setItem('psp_market_order_history', JSON.stringify(updatedMasterLedger));
      
      // Update running component state
      setOrderHistory(updatedMasterLedger);
      
      if (selectedInvoice && selectedInvoice.id === orderId) {
        setSelectedInvoice(null);
      }
    }
  };

  // Filter tracking parameters following the user configuration roles
  const filteredHistory = orderHistory.filter(order => {
    if (userRole === 'admin') return true; // Admin views global business streams
    return order.accountEmail === userEmail; // Regular clients display customized context profiles
  });

  // Structural computation transformations for metrics indicators
  const totalSalesRevenue = filteredHistory.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const totalItemsSold = filteredHistory.reduce((sum, order) => {
    const itemsCount = order.items ? order.items.reduce((s, item) => s + (Number(item.quantity) || 0), 0) : 0;
    return sum + itemsCount;
  }, 0);
  
  const uniqueCustomersCount = new Set(filteredHistory.map(order => order.accountEmail || order.phone)).size;

  // Telegram Direct API Broadcast Dispatch Tool
  const handleSubmitGlobalBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsSending(true);
    const htmlPayload = `
📢 <b>BROADCAST SYSTEM ANNOUNCEMENT</b>
━━━━━━━━━━━━━━━━━━━━━
💬 <b>Message Content:</b>
${broadcastMessage}
━━━━━━━━━━━━━━━━━━━━━
👥 <i>Dispatched to all active transaction channel targets.</i>
`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          chat_id: TELEGRAM_CHAT_ID, 
          text: htmlPayload, 
          parse_mode: 'HTML' 
        })
      });

      if (response.ok) {
        alert("Broadcast notification successfully pushed through the live API wire gateway!");
        setBroadcastMessage('');
      } else {
        alert("Failed to deliver payload over Telegram API streams.");
      }
    } catch (err) {
      console.error("Pipeline failure communicating with Telegram Server APIs:", err);
      alert("System connection error while executing message transmission.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 font-sans space-y-6 text-start">
      
      {/* HEADER SECTION PANEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2.5">
            <Send className="h-6 w-6 text-blue-600 animate-bounce" />
            PSP Mart Webhook Pipeline Tracker
          </h1>
          <p className="text-xs text-gray-500 mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="bg-slate-100 font-bold px-2 py-0.5 rounded text-gray-700 uppercase text-[10px]">Role: {userRole}</span>
            <span>Analyzing transaction streams targeting Token:</span> <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-700 font-mono">...fago8jg</code> 
            <span>• Chat ID:</span> <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-700 font-mono">{TELEGRAM_CHAT_ID}</code>
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <button 
            onClick={handleManualRefresh}
            className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition shadow-sm active:scale-95"
            title="Force Pipeline Realignment"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-blue-600" : ""} />
          </button>
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 py-1.5 px-3 rounded-xl text-xs font-bold text-green-700">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            Auto-Sync Live
          </div>
        </div>
      </div>

      {/* METRIC GRID COMPUTING REAL-TIME SYSTEM LEDGER SUMMARY DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Card 1 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-400 uppercase tracking-wider">Gross Pipeline Revenue</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">${totalSalesRevenue.toFixed(2)}</h3>
            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">Real-time Calculation</span>
          </div>
          <div className="bg-green-50 p-3 rounded-xl text-green-600"><DollarSign className="h-6 w-6" /></div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-400 uppercase tracking-wider">Total Orders Logs</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{filteredHistory.length}</h3>
            <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">Dispatched Alerts</span>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600"><Receipt className="h-6 w-6" /></div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-400 uppercase tracking-wider">Cargo Units Shipped</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalItemsSold} Items</h3>
            <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-1.5 py-0.5 rounded">Itemized Manifests</span>
          </div>
          <div className="bg-purple-50 p-3 rounded-xl text-purple-600"><Zap className="h-6 w-6" /></div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-400 uppercase tracking-wider">Unique Customer Channels</p>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{uniqueCustomersCount}</h3>
            <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded">Database Nodes</span>
          </div>
          <div className="bg-orange-50 p-3 rounded-xl text-orange-600"><Users className="h-6 w-6" /></div>
        </div>
      </div>

      {/* DETAILED LEDGER GRID LOGS STREAM LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LIVE WORKSPACE HISTORY FEED */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm lg:col-span-2 flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-black text-gray-900 uppercase tracking-wider text-xs">Outbound Telegram System Ledger Logs</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Real-time update streams listening to localized checkout adjustments.</p>
            </div>
            
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200 self-start sm:self-auto text-[11px]">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${activeFilter === 'all' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-slate-50'}`}
              >
                All Streams
              </button>
              <button 
                onClick={() => setActiveFilter('completed')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${activeFilter === 'completed' ? 'bg-slate-900 text-white' : 'text-gray-500 hover:bg-slate-50'}`}
              >
                High Value (+$10)
              </button>
            </div>
          </div>

          <div className="p-5 divide-y divide-gray-100 overflow-y-auto max-h-[460px] flex-1 text-xs">
            {filteredHistory.length === 0 ? (
              <div className="text-center py-16 text-gray-400 italic">No operations recorded. Finalize a transaction checkout pipeline inside Cart layout to stream logs.</div>
            ) : (
              filteredHistory
                .filter(inv => activeFilter === 'all' || inv.total >= 10)
                .map((invoice) => (
                  <div key={invoice.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4 group">
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 text-green-700 p-1.5 rounded-lg mt-0.5 flex-shrink-0">
                        <CheckCircle2 size={15} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm flex flex-wrap items-center gap-1.5">
                          Alert Message String 
                          <code className="bg-blue-50 text-blue-700 px-1 rounded font-mono text-xs font-bold">#{invoice.id}</code> 
                          <span className="text-[10px] text-gray-400 font-normal">Dispatched</span>
                        </h4>
                        <p className="text-gray-500 font-medium mt-1">
                          Buyer Identity: <span className="text-gray-800 font-bold">{invoice.customerName}</span> ({invoice.phone}) using carrier <span className="text-blue-600 font-semibold">{invoice.carrier}</span>
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] text-gray-400">
                          <span className="flex items-center gap-0.5"><Clock size={11} /> {invoice.date}</span>
                          <span>•</span>
                          <span className="font-mono text-gray-500 font-semibold bg-gray-50 px-1 rounded">{invoice.accountEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span className="block text-sm font-black text-blue-700">${Number(invoice.total || 0).toFixed(2)}</span>
                        
                        <div className="flex items-center justify-end gap-1.5 mt-1">
                          <button 
                            onClick={() => setSelectedInvoice(invoice)}
                            className="text-blue-500 hover:text-blue-700 font-bold inline-flex items-center gap-0.5 text-[10px]"
                          >
                            <Eye size={10} /> Manifest
                          </button>
                          
                          {invoice.mapLocation && (
                            <>
                              <span className="text-gray-900">|</span>
                              <a 
                                href={invoice.mapLocation} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="inline-flex items-center gap-0.5 text-[10px] text-gray-700 hover:underline font-bold"
                              >
                                Maps <ExternalLink size={10} />
                              </a>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 🌟 COUPLING ADMIN PURGE ROUTINE INTO THE RECORD ELEMENT */}
                      {userRole === 'admin' && (
                        <button
                          onClick={() => handleDeleteRecord(invoice.id)}
                          className="p-2 text-blue-800 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-xl transition duration-150 opacity-70 group-hover:opacity-100"
                          title="Purge string node from ledger arrays permanently"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* OVERRIDE BROADCAST API TRIGGER INTERFACE */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 flex flex-col justify-between text-xs space-y-6">
          <div>
            <h2 className="font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Send size={15} className="text-blue-600" />
              API Broadcast Override
            </h2>
            <p className="text-gray-400 mt-1 leading-relaxed">
              Manually dispatch asynchronous update announcement strings down the active endpoint gateway stream independent of transactional checkout structures.
            </p>

            <form onSubmit={handleSubmitGlobalBroadcast} className="mt-4 space-y-4">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1.5 tracking-wide">HTML Broadcast Text Payload</label>
                <textarea 
                  rows="5"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Type updates or notification notes here..."
                  className="w-full border border-gray-200 bg-slate-50 rounded-xl p-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition resize-none font-medium"
                />
              </div>

              <button 
                type="submit"
                disabled={isSending || !broadcastMessage.trim()}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-black py-3 px-4 rounded-xl transition shadow-md uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send size={13} />
                {isSending ? 'Sending data...' : 'Fire Broadcast Alert'}
              </button>
            </form>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 leading-relaxed text-[11px]">
            <div className="flex items-center gap-1 font-bold mb-0.5 text-amber-900">
              <ShieldCheck size={13} /> Secure Verification Framework
            </div>
            This dashboard handles synchronization parameters with browser local state arrays. Updates compiled locally reflect across linked component views automatically.
          </div>
        </div>

      </div>

      {/* QUICK VIEW ITEM MANIFEST DRAWER/MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-gray-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
              <div>
                <h3 className="font-black text-gray-900 text-sm">Order Manifest Elements</h3>
                <p className="text-[10px] text-gray-400 font-mono">Invoice Reference ID #{selectedInvoice.id}</p>
              </div>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-lg text-xs font-bold transition"
              >
                Esc Close
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {selectedInvoice.items && selectedInvoice.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-gray-800 block">{item.name}</span>
                    <span className="text-[10px] text-gray-400">Unit Price: ${Number(item.price).toFixed(2)}</span>
                  </div>
                  <span className="font-black text-blue-700 bg-blue-50 px-2 py-1 rounded-lg text-[11px]">x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 text-white p-3 rounded-xl flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wide text-[10px]">Aggregated Invoice Total</span>
              <span className="text-sm font-black text-green-400">${Number(selectedInvoice.total).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}