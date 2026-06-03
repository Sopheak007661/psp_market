
import React, { useState, useContext, useRef } from 'react';
import { ShopContext } from '../../context/ShopContext';
import {
  Trash2, Plus, Upload, QrCode, X, PlusCircle,
  Package, DollarSign, AlertTriangle, Layers, ImagePlus,
  ChevronDown, ChevronUp, Copy, GitBranch, Hash, Image
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function cartesian(arrays) {
  if (!arrays.length) return [];
  return arrays.reduce((acc, arr) =>
    acc.flatMap(combo => arr.map(item => [...combo, item])), [[]]
  );
}
function buildComboKey(variants, combo) {
  return variants.map((v, i) => `${v.label}:${combo[i]}`).join('|');
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

const CATEGORIES = ['Car','Computer','Fruit','Vegetable','Clothes','Phone','Accessories','Hotel Book','Meet'];
const PLACEHOLDER_IMG = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500';

// ─────────────────────────────────────────────────────────────────────────────
// Sub: Multi-image uploader  (shows thumbnails, can remove)
// ─────────────────────────────────────────────────────────────────────────────
function MultiImageUploader({ images, onChange, label = 'Product Images' }) {
  const readFile = (file) => new Promise(res => {
    const r = new FileReader();
    r.onloadend = () => res(r.result);
    r.readAsDataURL(file);
  });

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);
    const results = await Promise.all(files.map(readFile));
    onChange([...images, ...results]);
    e.target.value = '';
  };

  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest mb-2"
        style={{ color:'rgba(16, 16, 201, 0.35)' }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <div key={i} className="relative group w-16 h-16 rounded-xl overflow-hidden flex-shrink-0"
            style={{ border:'1px solid rgba(255,255,255,0.1)' }}>
            <img src={src} alt="" className="w-full h-full object-cover" />
            <button type="button"
              onClick={() => onChange(images.filter((_,j) => j !== i))}
              className="absolute inset-0 bg-blue-900 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              <X className="h-4 w-4 text-red-400" />
            </button>
            {i === 0 && (
              <span className="absolute bottom-0 left-0 right-0 text-center text-[8px] font-black py-0.5"
                style={{ background:'rgba(99,216,180,0.8)', color:'#1b1b96' }}>MAIN</span>
            )}
          </div>
        ))}
        <label className="w-16 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer flex-shrink-0 transition hover:bg-white/5"
          style={{ border:'2px dashed rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.02)' }}>
          <ImagePlus className="h-5 w-5 opacity-25 mb-0.5" />
          <span className="text-[8px] opacity-25 font-bold">ADD</span>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
        </label>
      </div>
      {images.length > 0 && (
        <p className="text-[10px] mt-1.5 font-semibold" style={{ color:'#63d8b4' }}>
          ✓ {images.length} image{images.length > 1 ? 's' : ''} · first is cover
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub: Variant pricing grid (per combo: price + stock)
// ─────────────────────────────────────────────────────────────────────────────
function VariantPricingGrid({ variants, variantPricing, onChange, basePrice }) {
  if (!variants.length) return null;
  const combos = cartesian(variants.map(v => v.options));
  if (!combos.length || combos[0].length === 0) return null;

  return (
    <div className="mt-3 space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:'rgba(200,200,220,0.4)' }}>
        Pricing &amp; Stock per Combination
      </p>
      <div className="rounded-xl overflow-hidden" style={{ border:'1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest py-2 px-3"
          style={{ background:'rgba(12, 38, 158, 0.04)', color:'rgba(200,200,220,0.4)' }}>
          <span className="flex-1">Combination</span>
          <span className="w-24">Price ($)</span>
          <span className="w-20">Stock</span>
        </div>
        <div className="max-h-52 overflow-y-auto">
          {combos.map((combo, i) => {
            const key   = buildComboKey(variants, combo);
            const entry = variantPricing[key] || { price: basePrice || '', stock: '' };
            return (
              <div key={key} className="flex items-center gap-2 px-3 py-2"
                style={{ background: i%2===0 ? 'rgba(255,255,255,0.02)' : 'transparent', borderTop:'1px solid rgba(255,255,255,0.04)' }}>
                <div className="flex-1 flex flex-wrap gap-1">
                  {combo.map((opt,j) => (
                    <span key={j} className="text-[10px] font-semibold px-2 py-0.5 rounded-md whitespace-nowrap"
                      style={{ background:'rgba(99,216,180,0.08)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.15)' }}>
                      {opt}
                    </span>
                  ))}
                </div>
                <input type="number" step="0.01" placeholder={basePrice||'0.00'} value={entry.price}
                  onChange={e => onChange(key,'price',e.target.value)}
                  className="w-24 px-2 py-1.5 rounded-lg text-xs font-bold focus:outline-none"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#e8e8f0' }} />
                <input type="number" placeholder="∞" value={entry.stock}
                  onChange={e => onChange(key,'stock',e.target.value)}
                  className="w-20 px-2 py-1.5 rounded-lg text-xs font-bold focus:outline-none"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', color:'#e8e8f0' }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub: Single model form  (used for parent AND each child)
// ─────────────────────────────────────────────────────────────────────────────
function ModelForm({ model, onChange, onRemove, isParent, index }) {
  const [nlabel, setNlabel] = useState('');
  const [nopts,  setNopts]  = useState('');

  const addVariant = () => {
    const label   = nlabel.trim();
    const options = nopts.split(',').map(o => o.trim()).filter(Boolean);
    if (!label || !options.length) return alert('Enter option name and comma-separated values.');
    onChange({ ...model, variants: [...(model.variants||[]), { label, options }], variantPricing: {} });
    setNlabel(''); setNopts('');
  };

  const removeVariant = (i) => {
    onChange({ ...model, variants: model.variants.filter((_,j) => j!==i), variantPricing: {} });
  };

  const handlePricingChange = (key, field, value) => {
    onChange({ ...model, variantPricing: { ...(model.variantPricing||{}), [key]: { ...(model.variantPricing?.[key]||{}), [field]:value } } });
  };

  const borderColor = isParent ? 'rgba(89, 90, 139, 0.97)' : 'rgb(3, 69, 190)';
  const accentColor = isParent ? '#10972d' : '#0bc704';
  const bgColor     = isParent ? 'rgba(6, 26, 139, 0.84)' : 'rgba(6, 22, 163, 0.9)';

  return (
    <div className="rounded-2xl p-5 space-y-5"
      style={{ background: bgColor, border:`1.5px solid ${borderColor}` }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isParent
            ? <Package className="h-4 w-4" style={{ color: accentColor }} />
            : <GitBranch className="h-4 w-4" style={{ color: accentColor }} />}
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: accentColor }}>
            {isParent ? 'Parent Model' : `Child Model ${index}`}
          </span>
        </div>
        {!isParent && (
          <button type="button" onClick={onRemove}
            className="p-1.5 rounded-lg transition opacity-40 hover:opacity-100"
            style={{ color:'#f87171' }}>
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Name + Price + Stock row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color:'rgba(232,232,240,0.3)' }}>Model Name *</label>
          <input type="text" placeholder={isParent ? 'e.g. iPhone 17' : 'e.g. iPhone 17 Pro Max'}
            value={model.name}
            onChange={e => onChange({ ...model, name: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-medium focus:outline-none"
            style={{ background:'rgba(255, 255, 255, 0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#e8e8f0' }} />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color:'rgba(232,232,240,0.3)' }}>Base Price ($) *</label>
          <input type="number" step="0.01" placeholder="0.00"
            value={model.price}
            onChange={e => onChange({ ...model, price: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color: accentColor }} />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
            style={{ color:'rgba(232,232,240,0.3)' }}>Base Stock</label>
          <input type="number" placeholder="∞ unlimited"
            value={model.stock}
            onChange={e => onChange({ ...model, stock: e.target.value })}
            className="w-full px-3 py-2.5 rounded-xl text-sm font-bold focus:outline-none"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#e8e8f0' }} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5"
          style={{ color:'rgba(232,232,240,0.3)' }}>Description</label>
        <textarea rows={2} placeholder="Specs, features, highlights..."
          value={model.description}
          onChange={e => onChange({ ...model, description: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#e8e8f0' }} />
      </div>

      {/* Multi-image upload */}
      <MultiImageUploader
        images={model.images || []}
        onChange={imgs => onChange({ ...model, images: imgs })}
        label="Model Images (first = cover photo)"
      />

      {/* Variants section */}
      <div className="rounded-xl p-4 space-y-3"
        style={{ background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 opacity-40" />
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Options / Variants</span>
        </div>

        {/* existing variants */}
        {(model.variants||[]).length > 0 && (
          <div className="flex flex-wrap gap-2">
            {model.variants.map((v, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                style={{ background:`${accentColor}12`, border:`1px solid ${accentColor}30` }}>
                <span className="text-[11px] font-bold" style={{ color: accentColor }}>{v.label}:</span>
                <span className="text-[10px]" style={{ color:'rgba(4, 21, 172, 0.6)' }}>{v.options.join(', ')}</span>
                <button type="button" onClick={() => removeVariant(i)} className="opacity-30 hover:opacity-100 transition">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* add new variant */}
        <div className="grid grid-cols-2 gap-2">
          <input type="text" placeholder='Option name (e.g. "Storage")'
            value={nlabel} onChange={e => setNlabel(e.target.value)}
            className="px-3 py-2 rounded-lg text-xs font-medium focus:outline-none"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#e8e8f0' }} />
          <input type="text" placeholder='Values — "128GB, 256GB, 512GB"'
            value={nopts} onChange={e => setNopts(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter') { e.preventDefault(); addVariant(); } }}
            className="px-3 py-2 rounded-lg text-xs font-medium focus:outline-none"
            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'#e8e8f0' }} />
        </div>
        <button type="button" onClick={addVariant}
          className="flex items-center gap-1.5 text-[11px] font-bold transition"
          style={{ color: accentColor }}>
          <PlusCircle className="h-3.5 w-3.5" /> Add Option Group
        </button>

        {/* pricing grid */}
        {(model.variants||[]).length > 0 && (
          <VariantPricingGrid
            variants={model.variants}
            variantPricing={model.variantPricing || {}}
            onChange={handlePricingChange}
            basePrice={model.price}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// blank model factory
// ─────────────────────────────────────────────────────────────────────────────
function blankModel(overrides={}) {
  return { _id: uid(), name:'', price:'', stock:'', description:'', images:[], variants:[], variantPricing:{}, ...overrides };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
export default function ManageProducts() {
  const { products, addProduct, deleteProduct, khqrImage, setKhqrImage } = useContext(ShopContext);

  const [activeTab, setActiveTab] = useState('products');

  // top-level fields
  const [category,  setCategory]  = useState('Car');
  // parent model
  const [parent,    setParent]    = useState(blankModel());
  // child models array
  const [children,  setChildren]  = useState([]);

  const [expandedProduct, setExpandedProduct] = useState(null);

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const r = new FileReader();
    r.onloadend = () => { setKhqrImage(r.result); alert('✓ KHQR updated!'); };
    r.readAsDataURL(file);
  };

  const addChild = () => setChildren(prev => [...prev, blankModel()]);

  const updateChild = (i, data) =>
    setChildren(prev => prev.map((c, j) => j===i ? data : c));

  const removeChild = (i) =>
    setChildren(prev => prev.filter((_,j) => j!==i));

  const cleanModel = (m, fallbackPrice) => {
    const cleanedPricing = {};
    Object.entries(m.variantPricing||{}).forEach(([k,v]) => {
      cleanedPricing[k] = {
        price: v.price !== '' && v.price !== undefined ? Number(v.price) : Number(fallbackPrice||0),
        stock: v.stock !== '' && v.stock !== undefined ? Number(v.stock) : null,
      };
    });
    return {
      name:           m.name.trim() || 'Unnamed Model',
      price:          Number(m.price) || 0,
      stock:          m.stock !== '' ? Number(m.stock) : null,
      description:    m.description.trim() || 'Premium product.',
      images:         m.images.length ? m.images : [PLACEHOLDER_IMG],
      image:          m.images[0] || PLACEHOLDER_IMG,   // backward compat
      variants:       m.variants || [],
      variantPricing: Object.keys(cleanedPricing).length ? cleanedPricing : null,
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!parent.name.trim() || !parent.price) return alert('Parent model name and price are required.');

    const parentData  = cleanModel(parent, parent.price);
    const childrenData = children.map(c => cleanModel(c, parent.price));

    addProduct({
      id:       uid(),
      category,
      ...parentData,
      // if there are children, embed them; ProductDetail will show model switcher
      childModels: childrenData.length ? childrenData : null,
    });

    // reset
    setParent(blankModel());
    setChildren([]);
    setCategory('Car');
    setActiveTab('products');
  };

  // ── stats
  const totalProducts = products.length;
  const withChildren  = products.filter(p => p.childModels?.length).length;
  const withVariants  = products.filter(p => p.variants?.length).length;
  const lowStock      = products.filter(p => p.stock !== null && p.stock !== undefined && Number(p.stock) <= 5).length;

  // ── styles helpers
  const inputStyle = { background:'rgb(64, 74, 105)', border:'1px solid rgba(42, 52, 110, 0.84)', color:'#e8e8f0' };
  const cardStyle  = { background:'rgb(14, 48, 161)', border:'1px solid rgba(53, 59, 66, 0.07)' };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        .mp-root { font-family:'DM Sans',sans-serif;background:slate; color:#e8e8f0; min-height:100vh; }
        .mp-head { font-family:'Syne',sans-serif; }
        .row-hover:hover { background:rgb(50, 91, 153) !important; }
        input,textarea,select { font-family:'DM Sans',sans-serif; }
        input[type=number]::-webkit-inner-spin-button { opacity:.35; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:rgb(11, 50, 179); border-radius:99px; }
      `}</style>

      <div className="mp-root p-6 lg:p-8 ">

        {/* Header */}
        <div className="mb-8 ">
          <h1 className="text-3xl text-start uppercase  font-extrabold tracking-normal text-3xl text-blue-800">Manage Porducts</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon:Package,       label:'Products',       value:totalProducts, color:'#63d8b4' },
            { icon:GitBranch,     label:'With Sub-Models', value:withChildren,  color:'#a78bfa' },
            { icon:Layers,        label:'With Variants',   value:withVariants,  color:'#60a5fa' },
            { icon:AlertTriangle, label:'Low Stock',       value:lowStock,      color:'#fb923c' },
          ].map(({ icon:Icon, label, value, color }) => (
            <div key={label} className="rounded-2xl p-5 flex items-center gap-4" style={cardStyle}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background:`${color}18`, border:`1px solid ${color}30` }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
              <div>
                <p className=" font-bold text-xl">{value}</p>
                <p className="text-[11px] font-medium" style={{ color:'rgba(232,232,240,0.4)' }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit"
          style={{ background:'rgb(7, 76, 167)', border:'1px solid rgba(13, 64, 175, 0.57)' }}>
          {[['products','Catalog'], ['add','Add Product'], ['qr','Payment QR']].map(([t,label]) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="px-5 py-2 rounded-lg text-xs font-bold transition-all"
              style={activeTab===t
                ? { background:'rgba(2, 96, 173, 0.4)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.3)' }
                : { color:'rgba(232,232,240,0.4)' }}>
              {label}
            </button>
          ))}
        </div>

        {/* ══ TAB: CATALOG ══════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="rounded-2xl overflow-hidden" style={cardStyle}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr style={{ borderBottom:'1px solid rgba(153, 146, 146, 0.91)' }}>
                    {['Product','Category','Price','Stock','Models','Variants',''].map(h => (
                      <th key={h} className="px-5 py-3.5 text-[10px] font-bold uppercase tracking-widest"
                        style={{ color:'rgba(232,232,240,0.3)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p, i) => {
                    const isExpanded = expandedProduct === p.id;
                    const stockColor = p.stock == null ? 'rgba(232, 232, 240, 0.47)'
                      : p.stock <= 0  ? '#f87171'
                      : p.stock <= 5  ? '#fbbf24' : '#34d399';
                    return (
                      <React.Fragment key={p.id}>
                        <tr className="row-hover transition cursor-pointer"
                          onClick={() => setExpandedProduct(isExpanded ? null : p.id)}
                          style={{ borderBottom:'1px solid rgba(255, 255, 255, 0.85)' }}>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <img src={p.image} alt=""
                                  className="w-10 h-10 object-cover rounded-xl"
                                  style={{ border:'1px solid rgba(255, 255, 255, 0.87)' }} />
                                {p.images?.length > 1 && (
                                  <span className="absolute -bottom-1 -right-1 text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center"
                                    style={{ background:'rgba(99,216,180,0.9)', color:'#0606a8' }}>
                                    {p.images.length}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-bold line-clamp-1">{p.name}</p>
                                <p className="text-[10px] line-clamp-1 max-w-[160px]"
                                  style={{ color:'rgba(232,232,240,0.3)' }}>{p.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)' }}>
                              {p.category}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="mp-head font-bold text-sm" style={{ color:'#63d8b4' }}>
                              ${Number(p.price||0).toFixed(2)}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-xs font-bold" style={{ color: stockColor }}>
                              {p.stock == null ? '—' : p.stock <= 0 ? 'Out' : p.stock}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            {p.childModels?.length
                              ? <span className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                                  style={{ background:'rgba(20, 41, 160, 0.1)', color:'#a78bfa', border:'1px solid rgba(167,139,250,0.2)' }}>
                                  +{p.childModels.length} model{p.childModels.length>1?'s':''}
                                </span>
                              : <span style={{ color:'rgba(232,232,240,0.2)' }}>—</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            {p.variants?.length
                              ? <div className="flex flex-wrap gap-1">
                                  {p.variants.map((v,j) => (
                                    <span key={j} className="text-[9px] font-bold px-2 py-0.5 rounded-md"
                                      style={{ background:'rgba(96,165,250,0.1)', color:'#60a5fa', border:'1px solid rgba(96,165,250,0.2)' }}>
                                      {v.label}
                                    </span>
                                  ))}
                                </div>
                              : <span style={{ color:'rgba(232,232,240,0.2)' }}>—</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-end gap-2">
                              {isExpanded ? <ChevronUp className="h-4 w-4 opacity-30" /> : <ChevronDown className="h-4 w-4 opacity-30" />}
                              <button onClick={e => { e.stopPropagation(); deleteProduct(p.id); }}
                                className="p-1.5 rounded-lg transition hover:bg-red-400/10"
                                style={{ color:'rgba(232,232,240,0.3)' }}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <tr style={{ borderBottom:'1px solid rgb(5, 56, 151)' }}>
                            <td colSpan={7} className="px-5 py-5"
                              style={{ background:'rgb(19, 59, 146)' }}>

                              {/* image strip */}
                              {p.images?.length > 1 && (
                                <div className="mb-4">
                                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                                    style={{ color:'rgba(99,216,180,0.5)' }}>Image Gallery</p>
                                  <div className="flex gap-2 flex-wrap">
                                    {p.images.map((img, j) => (
                                      <img key={j} src={img} alt=""
                                        className="w-14 h-14 object-cover rounded-xl"
                                        style={{ border: j===0 ? '2px solid #63d8b4' : '1px solid rgba(255,255,255,0.08)' }} />
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* variant pricing */}
                              {p.variantPricing && (
                                <div className="mb-4">
                                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                                    style={{ color:'rgba(96,165,250,0.5)' }}>Variant Pricing</p>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                    {Object.entries(p.variantPricing).map(([key,val]) => {
                                      const parts = key.split('|').map(s => s.split(':')[1]);
                                      const sc = val.stock == null ? 'rgba(232,232,240,0.3)' : val.stock<=0 ? '#f87171' : val.stock<=5 ? '#fbbf24' : '#34d399';
                                      return (
                                        <div key={key} className="rounded-xl px-3 py-2.5"
                                          style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)' }}>
                                          <div className="flex flex-wrap gap-1 mb-2">
                                            {parts.map((pt,j) => (
                                              <span key={j} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                                style={{ background:'rgba(99,216,180,0.1)', color:'#63d8b4' }}>{pt}</span>
                                            ))}
                                          </div>
                                          <p className="mp-head font-bold text-sm">${Number(val.price).toFixed(2)}</p>
                                          <p className="text-[10px] font-semibold mt-0.5" style={{ color:sc }}>
                                            {val.stock==null?'Unlimited':val.stock<=0?'Out of stock':`${val.stock} in stock`}
                                          </p>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* child models */}
                              {p.childModels?.length > 0 && (
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2"
                                    style={{ color:'rgba(167,139,250,0.5)' }}>Child Models</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {p.childModels.map((cm, j) => (
                                      <div key={j} className="rounded-xl p-3"
                                        style={{ background:'rgba(167,139,250,0.05)', border:'1px solid rgba(167,139,250,0.15)' }}>
                                        <div className="flex items-center gap-2 mb-2">
                                          {cm.images?.[0] && (
                                            <img src={cm.images[0]} alt=""
                                              className="w-10 h-10 object-cover rounded-lg flex-shrink-0"
                                              style={{ border:'1px solid rgba(255,255,255,0.08)' }} />
                                          )}
                                          <div>
                                            <p className="text-xs font-bold">{cm.name}</p>
                                            <p className="mp-head font-bold text-sm" style={{ color:'#a78bfa' }}>
                                              ${Number(cm.price||0).toFixed(2)}
                                            </p>
                                          </div>
                                        </div>
                                        {cm.images?.length > 1 && (
                                          <div className="flex gap-1 mb-2 flex-wrap">
                                            {cm.images.slice(1).map((img,k) => (
                                              <img key={k} src={img} alt=""
                                                className="w-8 h-8 object-cover rounded-lg"
                                                style={{ border:'1px solid rgba(255,255,255,0.06)' }} />
                                            ))}
                                          </div>
                                        )}
                                        {cm.variants?.length > 0 && (
                                          <div className="flex flex-wrap gap-1 mt-1">
                                            {cm.variants.map((v,k) => (
                                              <span key={k} className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                                style={{ background:'rgba(167,139,250,0.1)', color:'#a78bfa' }}>
                                                {v.label}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-25">
                  <Package className="h-12 w-12 mb-3" />
                  <p className="text-sm font-semibold">No products yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ TAB: ADD PRODUCT ══════════════════════════════════════════════════ */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">

            {/* Category selector */}
            <div className="rounded-2xl p-5 flex items-center gap-5" style={cardStyle}>
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-2"
                  style={{ color:'rgba(231, 238, 238, 0.98)' }}>Product Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm font-bold focus:outline-none"
                  style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c} style={{ background:'#0c26b6' }}>{c}</option>)}
                </select>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color:'rgba(124, 128, 139, 0.94)' }}>Structure</p>
                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color:'rgba(232,232,240,0.45)' }}>
                  <span className="px-2 py-1 rounded-md" style={{ background:'rgb(7, 92, 172)', color:'#0a9774' }}>Parent</span>
                  <span>+</span>
                  <span className="px-2 py-1 rounded-md" style={{ background:'rgb(14, 66, 179)', color:'#c4c2cf' }}>
                    {children.length} child{children.length!==1?'s':''}
                  </span>
                </div>
              </div>
            </div>

            {/* ── PARENT MODEL ── */}
            <div>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="h-px flex-1" style={{ background:'rgba(0, 74, 212, 0.65)' }} />
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color:'rgba(2, 22, 201, 0.5)' }}>
                  Parent / Base Product
                </span>
                <div className="h-px flex-1" style={{ background:'rgba(7, 25, 122, 0.59)' }} />
              </div>
              <ModelForm model={parent} onChange={setParent} isParent={true} />
            </div>

            {/* ── CHILD MODELS ── */}
            {children.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-px flex-1" style={{ background:'rgb(5, 40, 138)' }} />
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color:'rgba(6, 24, 131, 0.99)' }}>
                    Child Models ({children.length})
                  </span>
                  <div className="h-px flex-1" style={{ background:'rgb(10, 43, 151)' }} />
                </div>
                <div className="space-y-4">
                  {children.map((child, i) => (
                    <ModelForm key={child._id} model={child}
                      onChange={data => updateChild(i, data)}
                      onRemove={() => removeChild(i)}
                      isParent={false} index={i+1} />
                  ))}
                </div>
              </div>
            )}

            {/* Add child button */}
            <button type="button" onClick={addChild}
              className="w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition"
              style={{ background:'rgb(29, 65, 228)', border:'1.5px dashed rgba(167,139,250,0.3)', color:'#a78bfa' }}>
              <GitBranch className="h-4 w-4" />
              Add Child Model (e.g. Pro Max, 512GB edition…)
            </button>

            {/* Submit */}
            <button type="submit"
              className="w-full py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2.5 transition"
              style={{ background:'linear-gradient(135deg,#1a4a3a,#0f3028)', color:'#63d8b4', border:'1px solid rgba(99,216,180,0.3)' }}>
              <Plus className="h-4 w-4" />
              Add to Catalog
            </button>
          </form>
        )}

        {/* ══ TAB: PAYMENT QR ═══════════════════════════════════════════════════ */}
        {activeTab === 'qr' && (
          <div className="max-w-sm space-y-6 bg-slate-900 rounded-2xl">
            <div className="rounded-2xl  p-6 space-y-5" style={cardStyle}>
              <div className="flex items-center gap-2">
                <QrCode className="h-4 w-4" style={{ color:'#63d8b4' }} />
                <h3 className="mp-head font-bold text-sm">KHQR Payment Gateway</h3>
              </div>
              <p className="text-[11px]" style={{ color:'rgba(232,232,240,0.4)' }}>
                Displayed to customers at checkout.
              </p>
              <div className="flex items-center gap-5">
                <img src={khqrImage} alt="KHQR"
                  className="w-24 h-24 object-contain rounded-2xl"
                  style={{ border:'1px solid rgba(10, 86, 187, 0.97)', background:'white', padding:'6px' }} />
                <label className="flex-1 flex flex-col items-center justify-center h-24 rounded-2xl cursor-pointer transition"
                  style={{ border:'2px dashed rgb(7, 65, 192)', background:'rgba(17, 54, 177, 0.23)' }}>
                  <Upload className="h-5 w-5 mb-1.5 opacity-30" />
                  <span className="text-[11px] font-semibold opacity-30">Upload new KHQR</span>
                  <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
















