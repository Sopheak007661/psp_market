import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import {
  TrendingUp, AlertTriangle, CheckCircle, Package,
  RefreshCw, DollarSign, Archive, Boxes, Users,
  ShoppingCart, Activity, ChevronRight, ArrowUpRight
} from 'lucide-react';

// ─── helpers ──────────────────────────────────────────────────────────────────
const safeNum = (v) => { const n = Number(v); return isNaN(n) ? 0 : n; };
const fmt = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
const fmtShort = (n) => n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : fmt(n);

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ icon: Icon, label, value, sub, iconBg, iconColor, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_16px_rgba(30,58,138,0.07)] hover:shadow-[0_4px_24px_rgba(30,58,138,0.13)] transition-all duration-300 hover:-translate-y-0.5 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-800">{label}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
      </div>
      <p className="text-3xl font-black text-blue-900 leading-none tracking-tight">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 font-semibold mt-1.5">{sub}</p>}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionLabel({ tag, title, sub }) {
  return (
    <div className="mb-4">
      <span className="inline-block text-[9px] font-black uppercase tracking-[0.2em] text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg mb-1.5">{tag}</span>
      <h3 className="text-sm font-black text-blue-900 tracking-tight">{title}</h3>
      {sub && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-blue-900 text-white rounded-xl px-4 py-3 shadow-2xl text-xs min-w-[150px]">
      <p className="font-black text-blue-200 mb-2 truncate">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4 items-center">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.fill || p.stroke }} />
            <span className="text-blue-300 text-[10px]">{p.name}</span>
          </div>
          <span className="font-bold">{typeof p.value === 'number' && p.name.includes('$') ? fmt(p.value) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function GraphicAnalytics() {
  const { products = [] } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const syncData = () => {
    setIsRefreshing(true);
    const saved = localStorage.getItem('psp_market_order_history');
    if (saved) { try { setOrders(JSON.parse(saved)); } catch (e) {} }
    setTimeout(() => setIsRefreshing(false), 600);
  };
  useEffect(() => { syncData(); }, []);

  // ── Derived metrics ──────────────────────────────────────────────────────
  const stockMetrics = products.reduce(
    (acc, p) => {
      const qty = safeNum(p.stock !== undefined ? p.stock : (p.quantity || 15));
      if (qty === 0) acc.outOfStock++;
      else if (qty <= 5) acc.lowStock++;
      else acc.healthyStock++;
      return acc;
    },
    { outOfStock: 0, lowStock: 0, healthyStock: 0 }
  );

  const totalStockValue = products.reduce((sum, p) => {
    const qty = safeNum(p.stock !== undefined ? p.stock : (p.quantity || 15));
    return sum + qty * safeNum(p.price);
  }, 0);

  const totalUnits = products.reduce((sum, p) =>
    sum + safeNum(p.stock !== undefined ? p.stock : (p.quantity || 15)), 0);

  const totalRevenue = orders.reduce((sum, o) => {
    if (!o.items) return sum;
    return sum + o.items.reduce((s, item) => {
      const prod = products.find(x => x.id === item.id);
      return s + safeNum(item.quantity) * safeNum(prod?.price || item.price);
    }, 0);
  }, 0);

  const uniqueClients = new Set(orders.map(o => o.userId || o.email || o.customer)).size;

  // ── Chart data ────────────────────────────────────────────────────────────
  const barData = products
    .map(p => {
      let sold = 0;
      orders.forEach(o => o.items?.forEach(item => {
        if (item.id === p.id) sold += safeNum(item.quantity);
      }));
      const qty = safeNum(p.stock !== undefined ? p.stock : (p.quantity || 15));
      return {
        name: (p.name || 'Unnamed').slice(0, 12),
        'Revenue ($)': sold * safeNum(p.price),
        'Stock Value ($)': qty * safeNum(p.price),
        'Units Sold': sold,
      };
    })
    .sort((a, b) => b['Stock Value ($)'] - a['Stock Value ($)'])
    .slice(0, 6);

  const pieData = [
    { name: 'Healthy', value: stockMetrics.healthyStock, color: '#1e40af' },
    { name: 'Low Stock', value: stockMetrics.lowStock, color: '#93c5fd' },
    { name: 'Depleted', value: stockMetrics.outOfStock, color: '#fca5a5' },
  ].filter(d => d.value > 0);

  const hasAlert = stockMetrics.outOfStock > 0 || stockMetrics.lowStock > 0;

  return (
    <div className="min-h-screen" style={{ background: '#eef2fb', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        .card-shadow { box-shadow: 0 2px 16px rgba(30,58,138,0.07); }
        .card-shadow-hover:hover { box-shadow: 0 6px 32px rgba(30,58,138,0.14); }
        .fade-in { animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Top bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-800/30">
              <Activity size={15} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-blue-900 tracking-tight leading-none">PSP Market Overview</h1>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Inventory & analytics dashboard</p>
            </div>
          </div>

          <button
            onClick={syncData}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-800 text-xs font-bold px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm transition-all duration-200 active:scale-95 disabled:opacity-50 self-start sm:self-auto"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-blue-600' : 'text-blue-400'} />
            {isRefreshing ? 'Refreshing…' : 'Refresh Data'}
          </button>
        </div>

        {/* ── Alert ── */}
        {hasAlert ? (
          <div className="flex items-start gap-3 bg-white border border-blue-100 rounded-2xl p-4 shadow-sm fade-in">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle size={13} className="text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-black text-blue-900 uppercase tracking-wider">Inventory Alert</p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                <span className="text-blue-800 font-bold">{stockMetrics.outOfStock} items fully depleted</span> ·{' '}
                <span className="text-blue-800 font-bold">{stockMetrics.lowStock} items critically low</span> — restock soon.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-white border border-blue-100 rounded-2xl px-4 py-3 shadow-sm fade-in">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
              <CheckCircle size={13} className="text-blue-700" />
            </div>
            <p className="text-blue-900 text-[11px] font-bold uppercase tracking-wider">All inventory levels are healthy</p>
          </div>
        )}

        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={DollarSign} label="Revenue" value={fmtShort(totalRevenue)} sub={`${orders.length} Records`} iconBg="bg-blue-50" iconColor="text-blue-700" delay={0} />
          <KpiCard icon={Package} label="Products" value={products.length} sub={`${totalUnits} Units`} iconBg="bg-blue-50" iconColor="text-blue-600" delay={60} />
          <KpiCard icon={ShoppingCart} label="Processed" value={orders.length} sub="Records" iconBg="bg-orange-50" iconColor="text-orange-400" delay={120} />
          <KpiCard icon={Users} label="Clients" value={uniqueClients} sub="Accounts" iconBg="bg-violet-50" iconColor="text-violet-400" delay={180} />
        </div>

        {/* ── Stock Value highlight ── */}
        <div className="bg-blue-800 rounded-2xl p-5 sm:p-6 text-white shadow-[0_8px_32px_rgba(30,58,138,0.3)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
          {/* decorative circles */}
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -right-2 top-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-1">Total Portfolio Value</p>
            <p className="text-4xl font-black tracking-tight leading-none">{fmt(totalStockValue)}</p>
            <p className="text-blue-300 text-[11px] font-semibold mt-1.5">{products.length} SKUs · {totalUnits.toLocaleString()} units in stock</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 hover:bg-white/15 transition-colors rounded-xl px-4 py-2.5 self-start sm:self-auto cursor-default">
            <ArrowUpRight size={14} className="text-blue-200" />
            <span className="text-xs font-bold text-white">All Products</span>
            <ChevronRight size={12} className="text-blue-300" />
          </div>
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Bar chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 card-shadow card-shadow-hover transition-all duration-300 p-5 sm:p-6">
            <SectionLabel tag="Model 1" title="Asset Performance Overview" sub="Top products by stock value vs. revenue generated" />
            <div className="h-64">
              {barData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-300 text-xs italic">No structural timeline streams data found.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="35%">
                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f8fafc', rx: 6 }} />
                    <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, fontWeight: 700, paddingTop: 12, color: '#64748b' }} />
                    <Bar dataKey="Stock Value ($)" fill="#1e40af" radius={[6, 6, 0, 0]} maxBarSize={24} />
                    <Bar dataKey="Revenue ($)" fill="#93c5fd" radius={[6, 6, 0, 0]} maxBarSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Donut chart */}
          <div className="bg-white rounded-2xl border border-slate-100 card-shadow card-shadow-hover transition-all duration-300 p-5 sm:p-6 flex flex-col">
            <SectionLabel tag="Model 2" title="Stock Health Distribution" sub="Inventory condition proportions" />

            <div className="relative flex-1 flex items-center justify-center min-h-[160px]">
              {pieData.length === 0 ? (
                <p className="text-slate-300 text-xs italic">No verified system identity metrics loaded.</p>
              ) : (
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={4} dataKey="value" startAngle={90} endAngle={450}>
                      {pieData.map((e, i) => <Cell key={i} fill={e.color} strokeWidth={0} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} SKUs`, '']} contentStyle={{ background: '#1e3a8a', border: 'none', borderRadius: 12, color: '#fff', fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-blue-900 leading-none">{products.length}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-0.5">Total SKUs</span>
              </div>
            </div>

            <div className="mt-auto space-y-2 pt-4 border-t border-slate-100">
              {[
                { label: 'Healthy Stock', count: stockMetrics.healthyStock, color: '#1e40af' },
                { label: 'Low Stock', count: stockMetrics.lowStock, color: '#93c5fd' },
                { label: 'Depleted', count: stockMetrics.outOfStock, color: '#fca5a5' },
              ].map(({ label, count, color }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                    <span className="text-[11px] font-semibold text-slate-500">{label}</span>
                  </div>
                  <span className="text-[11px] font-black text-blue-900">{count} items</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Inventory table ── */}
        <div className="bg-white rounded-2xl border border-slate-100 card-shadow overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-700 mb-0.5">Inventory Manifest</p>
              <h3 className="text-sm font-black text-blue-900 tracking-tight">Operational Stock Status</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black text-blue-800 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl">
                Portfolio: {fmt(totalStockValue)}
              </span>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl">{products.length} SKUs</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400 border-b border-slate-100">
                  <th className="py-3 px-5 sm:px-6 text-left">Product</th>
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-right">Unit Price</th>
                  <th className="py-3 px-4 text-right text-blue-700">Stock Value</th>
                  <th className="py-3 px-5 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-14 text-center text-slate-300 italic">No products in catalog.</td>
                  </tr>
                ) : (
                  products.map((item, idx) => {
                    const qty = safeNum(item.stock !== undefined ? item.stock : (item.quantity || 15));
                    const price = safeNum(item.price);
                    const stockVal = qty * price;
                    const img = item.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500';

                    let badge;
                    if (qty === 0) badge = <span className="bg-red-50 text-red-400 text-[10px] font-black px-2.5 py-1 rounded-lg border border-red-100">Depleted</span>;
                    else if (qty <= 5) badge = <span className="bg-amber-50 text-amber-500 text-[10px] font-black px-2.5 py-1 rounded-lg border border-amber-100">Low Stock</span>;
                    else badge = <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2.5 py-1 rounded-lg border border-blue-100">Healthy</span>;

                    return (
                      <tr key={item.id || idx} className="hover:bg-slate-50/70 transition-colors duration-150 group">
                        <td className="py-3 px-5 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 shrink-0 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden">
                              <img src={img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500'; }} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-blue-900 truncate max-w-[140px] sm:max-w-[220px] text-xs">{item.name || 'Unnamed'}</p>
                              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-tight">#{item.id ? String(item.id).slice(0, 8) : `P${String(idx).padStart(3,'0')}`}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg capitalize">{item.category || 'General'}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-lg ${qty === 0 ? 'bg-red-50 text-red-400' : qty <= 5 ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-700'}`}>
                            {qty}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-500 text-xs">
                          {price > 0 ? fmt(price) : <span className="text-slate-300">—</span>}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`font-mono font-black text-xs ${stockVal > 0 ? 'text-blue-800' : 'text-slate-300'}`}>
                            {stockVal > 0 ? fmt(stockVal) : '—'}
                          </span>
                        </td>
                        <td className="py-3 px-5 sm:px-6 text-right">{badge}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
              {products.length > 0 && (
                <tfoot>
                  <tr className="bg-blue-50 border-t-2 border-blue-100">
                    <td colSpan="4" className="py-3 px-5 sm:px-6 text-xs font-black text-blue-800 uppercase tracking-wider">Total Portfolio</td>
                    <td className="py-3 px-4 text-right font-mono font-black text-blue-800 text-sm">{fmt(totalStockValue)}</td>
                    <td className="py-3 px-5 sm:px-6" />
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}