import React, { useContext, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  TrendingUp, Activity, PackageCheck, AlertCircle, 
  Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowUpRight 
} from 'lucide-react';

export default function EvaluatePerformance() {
  // Extract real products context to evaluate live dashboard metrics
  const { products = [] } = useContext(ShopContext) || {};
  const [fixTriggers, setFixTriggers] = useState({ desc: false, img: false });

  // =========================================================
  // PERFORMANCE EVALUATION COMPUTATION ENGINE
  // =========================================================
  const totalItems = products.length;

  // 1. Audit descriptive data health
  const itemsWithCustomDesc = products.filter(p => 
    p.description && 
    !p.description.includes("standard frontend design description mock view") && 
    p.description.trim() !== ""
  ).length;

  // 2. Audit visual content asset readiness 
  const itemsWithCustomImg = products.filter(p => 
    p.image && 
    !p.image.includes("images.unsplash.com") && 
    p.image.trim() !== ""
  ).length;

  // 3. Track critical stock thresholds
  const outOfStockItems = products.filter(p => Number(p.stock || p.quantity || 0) === 0).length;
  const healthyStockItems = totalItems - outOfStockItems;

  // Calculate distinct structural efficiency vectors
  const descriptionScore = totalItems > 0 ? (itemsWithCustomDesc / totalItems) * 100 : 100;
  const imageScore = totalItems > 0 ? (itemsWithCustomImg / totalItems) * 100 : 100;
  const stockScore = totalItems > 0 ? (healthyStockItems / totalItems) * 100 : 100;

  // Balanced Core System Efficiency Formula
  const rawSystemScore = totalItems > 0 
    ? (descriptionScore * 0.35) + (imageScore * 0.45) + (stockScore * 0.20)
    : 100;
  const systemEfficiencyScore = Math.min(100, Math.max(0, rawSystemScore));

  // Determine health category text ratings
  let healthStatus = { label: 'Optimal Operational Range', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' };
  if (systemEfficiencyScore < 75) {
    healthStatus = { label: 'Attention Required / Critical Maintenance', color: 'text-rose-600 bg-rose-50 border-rose-100' };
  } else if (systemEfficiencyScore < 90) {
    healthStatus = { label: 'Stable Performance / Minor Content Gaps', color: 'text-amber-600 bg-amber-50 border-amber-100' };
  }

  return (
    <div className="space-y-6 font-sans pb-12">
      
      {/* HEADER SECTION */}
      <div className="border-b border-gray-200/60 pb-5">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="text-emerald-600" size={24} /> 
          CORE PERFORMANCE EVALUATION PANEL
        </h1>
        <p className="text-gray-400 text-xs mt-1 font-medium">
          Automated structural health indexing matrix calculating data configuration density and inventory allocation metrics.
        </p>
      </div>

      {/* SYSTEM HEARTBEAT OVERVIEW CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 text-white pointer-events-none">
          <TrendingUp size={280} />
        </div>
        
        <span className="text-[10px] font-black tracking-widest bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-md uppercase border border-emerald-500/30">
          Global System Index
        </span>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-5xl font-black tracking-tighter flex items-baseline gap-1">
              {systemEfficiencyScore.toFixed(1)}%
              <span className="text-xs text-slate-400 font-bold tracking-normal">Efficiency Score</span>
            </h2>
            <div className={`mt-3 px-3 py-1 text-[11px] font-bold rounded-lg border w-fit ${healthStatus.color}`}>
              {healthStatus.label}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2 text-xs min-w-[200px]">
            <div className="flex justify-between text-slate-300">
              <span>Audited Catalog Size:</span>
              <span className="font-bold text-white font-mono">{totalItems} SKUs</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Standard Goal Target:</span>
              <span className="font-bold text-emerald-400 font-mono">&gt; 90.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE PERFORMANCE EFFICIENCY VECTORS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* VECTOR 1: DESCRIPTIONS */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Content Integrity</span>
              <span className="text-xs font-mono font-bold text-blue-600">{descriptionScore.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${descriptionScore}%` }} />
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Measures items containing unique descriptive features instead of system template text.
            </p>
          </div>
          <p className="text-[11px] font-bold text-slate-700 mt-4 pt-2 border-t border-slate-50">
            {itemsWithCustomDesc} of {totalItems} items completed
          </p>
        </div>

        {/* VECTOR 2: MEDIA UPLOADS */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Media Asset Density</span>
              <span className="text-xs font-mono font-bold text-purple-600">{imageScore.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-purple-600 h-full transition-all duration-500" style={{ width: `${imageScore}%` }} />
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Tracks items operating with unique file uploads rather than stock placeholders.
            </p>
          </div>
          <p className="text-[11px] font-bold text-slate-700 mt-4 pt-2 border-t border-slate-50">
            {itemsWithCustomImg} of {totalItems} customized
          </p>
        </div>

        {/* VECTOR 3: STOCK HEALTH */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-black text-slate-800 uppercase tracking-tight">Inventory Stability</span>
              <span className="text-xs font-mono font-bold text-emerald-600">{stockScore.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
              <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${stockScore}%` }} />
            </div>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Monitors catalog health against depleted allocations or critical out-of-stock faults.
            </p>
          </div>
          <p className="text-[11px] font-bold text-slate-700 mt-4 pt-2 border-t border-slate-50">
            {outOfStockItems === 0 ? '✓ Zero out-of-stock faults' : `${outOfStockItems} items depleted`}
          </p>
        </div>

      </div>

      {/* DYNAMIC ADMINISTRATIVE CRITERIA ACTION MATRIX */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 bg-slate-50/50">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-blue-600" />
            Automated System Optimization Directive
          </h3>
          <p className="text-gray-400 text-[11px] mt-0.5">Real-time optimization checklist triggered by your active data profiles.</p>
        </div>

        <div className="divide-y divide-gray-100 text-xs font-medium text-slate-700">
          
          {/* CRITERIA 1: DESCRIPTION OPTIMIZATION */}
          <div className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/30 transition">
            <div className="flex gap-3">
              {descriptionScore === 100 ? (
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-slate-900">Optimize Item Descriptions</p>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  {descriptionScore === 100 
                    ? "Excellent job. All items carry production-ready structural features." 
                    : `Detected ${totalItems - itemsWithCustomDesc} items utilizing generic placeholder text strings inside ManageProducts.`}
                </p>
              </div>
            </div>
            {descriptionScore < 100 && (
              <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-bold shrink-0 uppercase tracking-tight">
                Pending Copywrite
              </span>
            )}
          </div>

          {/* CRITERIA 2: MEDIA OPTIMIZATION */}
          <div className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/30 transition">
            <div className="flex gap-3">
              {imageScore === 100 ? (
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-slate-900">Deploy Unique Visual Assets</p>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  {imageScore === 100 
                    ? "Media array is complete. Every catalog card has custom user uploads."
                    : `Detected ${totalItems - itemsWithCustomImg} items relying on default internet placeholder URLs.`}
                </p>
              </div>
            </div>
            {imageScore < 100 && (
              <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md font-bold shrink-0 uppercase tracking-tight">
                Upload Custom Img
              </span>
            )}
          </div>

          {/* CRITERIA 3: REVENUE SAFETY CHECKS */}
          <div className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/30 transition">
            <div className="flex gap-3">
              {outOfStockItems === 0 ? (
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-bold text-slate-900">Inventory Liquidity Assurance</p>
                <p className="text-gray-400 text-[11px] mt-0.5">
                  {outOfStockItems === 0 
                    ? "Safe distribution status maintained. All items have stable active values." 
                    : `Alert: ${outOfStockItems} item segments are completely dried up. Storefront checkout gates for these lines are restricted.`}
                </p>
              </div>
            </div>
            {outOfStockItems > 0 && (
              <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-md font-bold shrink-0 uppercase tracking-tight animate-pulse">
                Critical Restock
              </span>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}