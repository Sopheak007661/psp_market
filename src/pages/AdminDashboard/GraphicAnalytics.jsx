import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  BarChart3, AlertTriangle, CheckCircle, Package, 
  RefreshCw, Layers
} from 'lucide-react';

export default function GraphicAnalytics() {
  // Pull core structural catalog entries directly from ShopContext
  const { products = [] } = useContext(ShopContext);
  
  // Local state for tracking transactional metrics streams
  const [orders, setOrders] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Synchronize dynamic transactional logs from browser ledger streams
  const syncLedgerData = () => {
    setIsRefreshing(true);
    const savedHistory = localStorage.getItem('psp_market_order_history');
    if (savedHistory) {
      try {
        setOrders(JSON.parse(savedHistory));
      } catch (err) {
        console.error("Error reading financial transaction stream:", err);
      }
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    syncLedgerData();
  }, []);

  // Safe arithmetic utility converter to protect against data mutation calculation crashes
  const safeNum = (val) => {
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  };

  // =========================================================
  // ANALYTICS CALCULATION ENGINE 1: INVENTORY STOCK DISTRIBUTION
  // =========================================================
  const stockMetrics = products.reduce((acc, product) => {
    // Check for stock parameter fields or use standard default fallback
    const stockQty = safeNum(product.stock !== undefined ? product.stock : (product.quantity || 15));
    
    if (stockQty === 0) {
      acc.outOfStock += 1;
    } else if (stockQty <= 5) {
      acc.lowStock += 1;
    } else {
      acc.healthyStock += 1;
    }
    return acc;
  }, { outOfStock: 0, lowStock: 0, healthyStock: 0 });

  const stockPieData = [
    { name: 'Healthy Allocation', value: stockMetrics.healthyStock, color: '#10b981' },
    { name: 'Low Stock Risk', value: stockMetrics.lowStock, color: '#f59e0b' },
    { name: 'Depleted Inventory', value: stockMetrics.outOfStock, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // =========================================================
  // ANALYTICS CALCULATION ENGINE 2: REVENUE PERFORMANCE MATRICES
  // =========================================================
  const productPerformanceData = products.map(product => {
    let totalUnitsSold = 0;
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          // Cross-verify matching data attributes utilizing the unified item identifier format
          if (item.id === product.id) {
            totalUnitsSold += safeNum(item.quantity);
          }
        });
      }
    });

    const currentPrice = safeNum(product.price);
    const estimatedRevenue = totalUnitsSold * currentPrice;

    return {
      name: product.name || 'Unnamed Asset',
      'Units Sold': totalUnitsSold,
      'Revenue Generated ($)': estimatedRevenue,
      image: product.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500"
    };
  }).sort((a, b) => b['Revenue Generated ($)'] - a['Revenue Generated ($)']).slice(0, 6);

  return (
    <div className="space-y-8 font-sans pb-12 bg-slate-50/40 p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-xs">
      
      {/* SYSTEM HEADER BAR CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-blue-600" size={24} /> 
            GRAPHIC & ANALYTICS PIPELINE
          </h1>
          <p className="text-gray-400 text-xs mt-1 font-medium">
            Systematic overview of active inventory allocation parameters and core product transaction pipelines.
          </p>
        </div>
        <button 
          onClick={syncLedgerData}
          disabled={isRefreshing}
          className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 active:scale-95 transition-all text-xs font-bold px-4 py-2 rounded-xl border border-gray-200 shadow-xs cursor-pointer disabled:opacity-50"
        >
          <RefreshCw size={14} className={`${isRefreshing ? 'animate-spin text-blue-600' : 'text-slate-400'}`} />
          {isRefreshing ? 'Recalculating Matrix...' : 'Refresh Local Streams'}
        </button>
      </div>

      {/* SYSTEM ALERTS CONDITION FRAMEWORK */}
      {stockMetrics.outOfStock > 0 || stockMetrics.lowStock > 0 ? (
        <div className="p-4 bg-amber-50/70 border border-amber-200/60 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Automated Inventory Restock Notification</h5>
            <p className="text-amber-700 text-[11px] mt-0.5 font-medium">
              System detected <span className="font-bold underline">{stockMetrics.outOfStock} items fully depleted</span> and <span className="font-bold underline">{stockMetrics.lowStock} items approaching critical safety limits</span>. Stock adjustments are highly recommended.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-emerald-50/60 border border-emerald-200/50 rounded-2xl flex items-center gap-3">
          <CheckCircle className="text-emerald-600 shrink-0" size={18} />
          <p className="text-emerald-800 text-[11px] font-bold uppercase tracking-wider">All systemic inventory catalogs are verified healthy and stabilized.</p>
        </div>
      )}

      {/* VISUAL CHART MATRIX PANEL LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BAR CHART DISPLAY DIAGRAM PANEL */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between lg:col-span-2">
          <div className="mb-4">
            <span className="text-[9px] uppercase font-black tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Model A</span>
            <h4 className="text-sm font-bold text-slate-800 mt-1">Asset Productivity Performance Ledger</h4>
            <p className="text-gray-400 text-[11px]">Cross-analyzes top inventory volume throughput against generated monetary values.</p>
          </div>

          <div className="h-72 w-full text-[10px]">
            {productPerformanceData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 italic bg-slate-50/50 rounded-xl">No structural product catalog tracks found.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tickLine={false} stroke="#94a3b8" tickFormatter={(v) => v.length > 12 ? `${v.substring(0, 10)}...` : v} />
                  <YAxis yAxisId="left" tickLine={false} stroke="#94a3b8" />
                  <YAxis yAxisId="right" orientation="right" tickLine={false} stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar yAxisId="left" dataKey="Revenue Generated ($)" fill="#2563eb" name="Revenue Pool ($)" radius={[4, 4, 0, 0]} barSize={16} />
                  <Bar yAxisId="right" dataKey="Units Sold" fill="#10b981" name="Volume Liquidated" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* PIE CHART PROPORTIONAL METRIC DIAGRAM PANEL */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
          <div className="mb-4">
            <span className="text-[9px] uppercase font-black tracking-widest text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Model B</span>
            <h4 className="text-sm font-bold text-slate-800 mt-1">Warehouse Volume Distribution Matrix</h4>
            <p className="text-gray-400 text-[11px]">Identifies active proportions of inventory groups safely stored.</p>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            {stockPieData.length === 0 ? (
              <div className="text-gray-400 italic text-xs">No warehouse entries cataloged.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stockPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} SKUs`, 'Proportional Status']} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute text-center flex flex-col justify-center items-center">
              <Package size={18} className="text-slate-400 mb-0.5" />
              <span className="text-lg font-black text-slate-800">{products.length}</span>
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total SKUs</span>
            </div>
          </div>

          {/* DYNAMIC PIE CHART METRIC LABELS LEGEND */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]" /> Healthy Allocation</div>
              <span className="font-bold text-slate-900">{stockMetrics.healthyStock} Items</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Low Stock Risk</div>
              <span className="font-bold text-slate-900">{stockMetrics.lowStock} Items</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Depleted Stock</div>
              <span className="font-bold text-slate-900">{stockMetrics.outOfStock} Items</span>
            </div>
          </div>
        </div>

      </div>

      {/* CORE SYNCED STOCK INVENTORY DATA MANIFEST TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-slate-50/60 to-white border-b border-gray-100 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-black tracking-tight text-slate-800 uppercase">Operational Inventory Stock Status</h4>
            <p className="text-gray-400 text-[11px] mt-0.5">Real-time monitoring panel displaying localized stock counts and corresponding safety values.</p>
          </div>
          <span className="text-[10px] font-bold text-slate-500 bg-white border border-gray-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Layers size={12} className="text-blue-500" /> Monitored Assets: {products.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 text-gray-400 font-extrabold uppercase tracking-wider text-[10px] border-b border-gray-100">
                <th className="py-3 px-5">Product Asset Profile</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5 text-center">Remaining Stock Levels</th>
                <th className="py-3 px-5 text-right">Inventory Health Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-600 font-medium">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-10 text-center text-gray-400 italic">No products found inside active catalog context parameters.</td>
                </tr>
              ) : (
                products.map((item, idx) => {
                  const stockLevel = safeNum(item.stock !== undefined ? item.stock : (item.quantity || 15));
                  
                  // 🌟 TARGETING AND BINDING DIRECTLY TO YOUR MANAGEPRODUCTS.JSX IMAGE SCHEAM PATTERN
                  const productImgSrc = item.image || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500";

                  // Evaluate operational alert visual conditional labels
                  let statusTag = (
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-100">Stable Allocation</span>
                  );
                  if (stockLevel === 0) {
                    statusTag = (
                      <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-rose-100 animate-pulse">Depleted / Alert</span>
                    );
                  } else if (stockLevel <= 5) {
                    statusTag = (
                      <span className="bg-amber-50 text-amber-600 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-amber-100">Low / Reorder Risk</span>
                    );
                  }

                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50/40 transition duration-150">
                      {/* ASSET DATA RECORD THUMBNAIL (Directly pulled from Base64 uploaded in ManageProducts) */}
                      <td className="py-3 px-5 font-bold text-slate-900 flex items-center gap-3">
                        <div className="w-9 h-9 shrink-0 bg-slate-100 rounded-xl border border-slate-200/60 overflow-hidden flex items-center justify-center shadow-xs">
                          <img 
                            src={productImgSrc} 
                            alt={item.name || 'Catalog Product'} 
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500";
                            }}
                          />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="truncate max-w-[160px] sm:max-w-[260px] text-slate-900 text-xs font-black">{item.name || 'Unnamed Entry'}</span>
                          <span className="text-[9px] text-slate-400 font-mono tracking-tight uppercase truncate max-w-[120px]">
                            ID: {item.id ? String(item.id).substring(0, 8) : `PRD-${idx}`}
                          </span>
                        </div>
                      </td>

                      {/* CATEGORY LOG FRAMEWORK COLUMN */}
                      <td className="py-3 px-5">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight uppercase border border-slate-200/30">
                          {item.category || 'Car'}
                        </span>
                      </td>

                      {/* REMAINING PIECES VALUE TRACKER */}
                      <td className="py-3 px-5 text-center font-bold">
                        <span className={`font-mono text-xs px-2 py-0.5 rounded-lg ${stockLevel <= 5 ? 'text-rose-600 bg-rose-50/50 font-black' : 'text-slate-800 bg-slate-100/80'}`}>
                          {stockLevel} Pcs
                        </span>
                      </td>

                      {/* HEALTH ATTRIBUTE TAG DISPLAY */}
                      <td className="py-3 px-5 text-right">{statusTag}</td>
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