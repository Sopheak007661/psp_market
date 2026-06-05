import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
  Truck, Download, Share2, CheckCircle2, History, Receipt, 
  Clock, DollarSign, ShieldCheck, User, Search, AlertCircle,
  RefreshCw, Wifi, WifiOff, Timer, Copy, ExternalLink,
  ImagePlus, FileText, X, Upload, Send, Sparkles, Star, ChevronLeft, ChevronRight
} from 'lucide-react';

// ─── CONFIG ─────────────────────────────────────────────────────────────────
const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg";
const TELEGRAM_CHAT_ID   = "6710148858";
const QR_EXPIRY_SECONDS  = 300; // 5 minutes

// ─── PAYMENT STATUS ENUM ────────────────────────────────────────────────────
const PAY_STATUS = {
  IDLE:       'idle',
  PENDING:    'pending',
  UPLOADING:  'uploading',
  SUBMITTING: 'submitting',
  VERIFYING:  'verifying',
  CONFIRMED:  'confirmed',
  EXPIRED:    'expired',
  FAILED:     'failed',
};

// ─── TELEGRAM HELPERS ───────────────────────────────────────────────────────
const telegramAPI = async (method, body) => {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.error('Telegram API error:', err);
    return null;
  }
};

const telegramSendFile = async (method, formData) => {
  try {
    const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
      method: 'POST',
      body: formData,
    });
    return await res.json();
  } catch (err) {
    console.error('Telegram file upload error:', err);
    return null;
  }
};

const sendOrderAlert = async (invoiceData) => {
  const itemLines = invoiceData.items
    .map(i => `  • ${i.name} ×${i.quantity} = <b>$${(i.price * i.quantity).toFixed(2)}</b>`)
    .join('\n');

  const mapLine = invoiceData.mapLocation
    ? `<a href="${invoiceData.mapLocation}">📍 Open Route in Maps</a>`
    : '📍 No map link provided';

  const msg = `
🛒 <b>NEW ORDER — PSP MART</b>
━━━━━━━━━━━━━━━━━━━━━
🆔 <b>Invoice:</b> <code>#${invoiceData.id}</code>
📅 <b>Time:</b> ${invoiceData.date}

👤 <b>CUSTOMER</b>
• Name: <b>${invoiceData.customerName}</b>
• Phone: <code>${invoiceData.phone}</code>
• Email: ${invoiceData.accountEmail}
• Address: ${invoiceData.address}

🚚 <b>Carrier:</b> ${invoiceData.carrier} (+$${invoiceData.shippingFee.toFixed(2)})
${mapLine}

🛍️ <b>ITEMS</b>
${itemLines}

💵 Subtotal: $${invoiceData.subtotal.toFixed(2)}
📦 Shipping: $${invoiceData.shippingFee.toFixed(2)}
💰 <b>TOTAL: $${invoiceData.total.toFixed(2)}</b>

📎 <b>Payment proof attached below ↓</b>
━━━━━━━━━━━━━━━━━━━━━
✅ Reply <code>/confirm_${invoiceData.id}</code> after payment verified
❌ Reply <code>/cancel_${invoiceData.id}</code> to reject order
`.trim();

  return await telegramAPI('sendMessage', {
    chat_id: TELEGRAM_CHAT_ID,
    text: msg,
    parse_mode: 'HTML',
  });
};

const sendPaymentProof = async (file, invoiceId, customerName, total) => {
  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID);

  const isPdf = file.type === 'application/pdf';

  if (isPdf) {
    formData.append('document', file, file.name);
    formData.append('caption', `📄 Payment Proof (PDF)\nInvoice #${invoiceId} · ${customerName} · $${total}`);
    return await telegramSendFile('sendDocument', formData);
  } else {
    formData.append('photo', file, file.name);
    formData.append('caption', `🖼️ Payment Screenshot\nInvoice #${invoiceId} · ${customerName} · $${total}`);
    return await telegramSendFile('sendPhoto', formData);
  }
};

const sendPaymentConfirmedAlert = async (invoiceData) => {
  const msg = `
✅ <b>PAYMENT CONFIRMED — PSP MART</b>
━━━━━━━━━━━━━━━━━━━━━
🆔 Invoice: <code>#${invoiceData.id}</code>
👤 ${invoiceData.customerName} (${invoiceData.phone})
💰 <b>$${invoiceData.total.toFixed(2)} RECEIVED</b>
🚚 ${invoiceData.carrier}
━━━━━━━━━━━━━━━━━━━━━
🚀 Proceed to dispatch & fulfill order.
`.trim();

  return await telegramAPI('sendMessage', {
    chat_id: TELEGRAM_CHAT_ID,
    text: msg,
    parse_mode: 'HTML',
  });
};

const pollForConfirmation = async (invoiceId, lastUpdateId) => {
  try {
    const data = await telegramAPI('getUpdates', {
      offset: lastUpdateId ? lastUpdateId + 1 : undefined,
      timeout: 5,
      allowed_updates: ['message'],
    });

    if (!data?.ok || !data.result?.length) return { status: 'waiting', lastUpdateId };

    const newLastId = data.result[data.result.length - 1].update_id;

    for (const update of data.result) {
      const text = update.message?.text?.trim() || '';
      if (text === `/confirm_${invoiceId}`) return { status: 'confirmed', lastUpdateId: newLastId };
      if (text === `/cancel_${invoiceId}`)  return { status: 'cancelled', lastUpdateId: newLastId };
    }

    return { status: 'waiting', lastUpdateId: newLastId };
  } catch {
    return { status: 'waiting', lastUpdateId };
  }
};

// ─── SIMILAR PRODUCTS CAROUSEL ───────────────────────────────────────────────
function SimilarProducts({ products, onAddToCart, cartIds }) {
  const [page, setPage] = useState(0);
  const [addedId, setAddedId] = useState(null);
  const perPage = 4;
  const totalPages = Math.ceil(products.length / perPage);
  const visible = products.slice(page * perPage, page * perPage + perPage);

  const handleAdd = (product) => {
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="mt-10 print:hidden">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 bg-blue-700 rounded-full" />
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={15} className="text-blue-600" /> You Might Also Like
          </h2>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-medium">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm">
              <ChevronLeft size={14} className="text-gray-600" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm">
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map(product => {
          const inCart  = cartIds.has(product.id);
          const justAdded = addedId === product.id;
          const rating = product.rating ?? (3.5 + Math.random() * 1.5).toFixed(1);
          const reviews = product.reviews ?? Math.floor(10 + Math.random() * 290);

          return (
            <div key={product.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
              <div className="relative overflow-hidden bg-gray-50 h-36">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.category && (
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-bold text-blue-700 px-2 py-0.5 rounded-full border border-blue-100 shadow-sm uppercase tracking-wide">
                    {product.category}
                  </span>
                )}
                {inCart && !justAdded && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    In Cart
                  </span>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{product.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={10} className="text-amber-400 fill-amber-400" />
                  <span className="text-[10px] font-bold text-gray-700">{Number(rating).toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400">({reviews})</span>
                </div>
                <div className="flex items-center justify-between mt-auto gap-2">
                  <span className="text-sm font-black text-blue-700">${Number(product.price || 0).toFixed(2)}</span>
                  <button
                    onClick={() => handleAdd(product)}
                    className={`flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-xl transition shadow-sm
                      ${justAdded
                        ? 'bg-green-500 text-white'
                        : inCart
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                        : 'bg-blue-700 hover:bg-blue-800 text-white'}`}>
                    {justAdded
                      ? <><CheckCircle2 size={10} /> Added!</>
                      : inCart
                      ? <><Plus size={10} /> Add More</>
                      : <><Plus size={10} /> Add</>}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5 mt-5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)}
              className={`rounded-full transition-all duration-200 ${i === page ? 'w-5 h-1.5 bg-blue-600' : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-300'}`} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function Cart({ userEmail, userRole }) {
  const { cart, updateQuantity, removeFromCart, checkout, khqrImage, addToCart, products } = useContext(ShopContext);

  const [showQrModal,      setShowQrModal]      = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [orderHistory,   setOrderHistory]   = useState([]);

  const [searchQuery, setSearchQuery] = useState('');

  const [customerName,    setCustomerName]    = useState('');
  const [phoneNumber,     setPhoneNumber]     = useState('');
  const [address,         setAddress]         = useState('');
  const [mapLocation,     setMapLocation]     = useState('');
  const [deliveryMethod,  setDeliveryMethod]  = useState('Standard Home Delivery');
  const [shippingFee,     setShippingFee]     = useState(1.00);
  const [formError,       setFormError]       = useState('');

  const [payStatus,          setPayStatus]          = useState(PAY_STATUS.IDLE);
  const [qrSecondsLeft,      setQrSecondsLeft]      = useState(QR_EXPIRY_SECONDS);
  const [pendingInvoice,     setPendingInvoice]      = useState(null);
  const [lastTelegramUpdate, setLastTelegramUpdate]  = useState(null);
  const [copyFeedback,       setCopyFeedback]        = useState('');

  const [proofFile,     setProofFile]     = useState(null);
  const [proofPreview,  setProofPreview]  = useState(null);
  const [proofError,    setProofError]    = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef(null);

  const timerRef   = useRef(null);
  const pollRef    = useRef(null);
  const secondsRef = useRef(QR_EXPIRY_SECONDS);

  const loadHistory = useCallback(() => {
    const saved = localStorage.getItem('psp_market_order_history');
    setOrderHistory(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    loadHistory();
    const iv = setInterval(loadHistory, 1500);
    return () => clearInterval(iv);
  }, [loadHistory]);

  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
    if (proofPreview) URL.revokeObjectURL(proofPreview);
  }, []);

  const allowedHistory = orderHistory.filter(o =>
    userRole === 'admin' ? true : o.accountEmail === userEmail
  );
  const filteredHistory = allowedHistory.filter(o => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      o.id.toString().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.phone.includes(q)
    );
  });

  const deliveryServices = [
    { id: 'home',      name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days',   icon: Home },
    { id: 'vireak',    name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day',    icon: Truck },
    { id: 'foodpanda', name: 'FoodPanda Instant',      rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
    { id: 'wownow',    name: 'WOW NOW Logistics',      rate: 1.50, eta: 'Same Day',   icon: Truck },
    { id: 'egets',     name: 'E-GetS Delivery',        rate: 2.00, eta: '40 Mins',    icon: Truck },
  ];

  const subtotal   = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const grandTotal = subtotal + shippingFee;

  // const saveOrder = useCallback((invoice, history) => {
  //   const existIdx = history.findIndex(
  //     o => o.customerName.toLowerCase().trim() === invoice.customerName.toLowerCase().trim() &&
  //          o.phone.trim() === invoice.phone.trim() &&
  //          o.accountEmail === invoice.accountEmail
  //   );

  //   let updated;
  //   if (existIdx !== -1) {
  //     const merged = [...history[existIdx].items];
  //     invoice.items.forEach(ni => {
  //       const mi = merged.findIndex(i => i.id === ni.id);
  //       mi !== -1 ? (merged[mi].quantity += ni.quantity) : merged.push({ ...ni });
  //     });
  //     const newSub = merged.reduce((s, i) => s + i.price * i.quantity, 0);
  //     const final  = { ...history[existIdx], items: merged, subtotal: newSub, total: newSub + history[existIdx].shippingFee, date: invoice.date };
  //     updated = [...history];
  //     updated.splice(existIdx, 1);
  //     updated.unshift(final);
  //     localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
  //     setOrderHistory(updated);
  //     return final;
  //   } else {
  //     updated = [invoice, ...history];
  //     localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
  //     setOrderHistory(updated);
  //     return invoice;
  //   }
  // }, []);

  // const startTimer = useCallback(() => {
  //   secondsRef.current = QR_EXPIRY_SECONDS;
  //   setQrSecondsLeft(QR_EXPIRY_SECONDS);
  //   clearInterval(timerRef.current);
  //   timerRef.current = setInterval(() => {
  //     secondsRef.current -= 1;
  //     setQrSecondsLeft(secondsRef.current);
  //     if (secondsRef.current <= 0) {
  //       clearInterval(timerRef.current);
  //       clearInterval(pollRef.current);
  //       setPayStatus(PAY_STATUS.EXPIRED);
  //     }
  //   }, 1000);
  // }, []);

  // const startPolling = useCallback((invoiceId) => {
  //   clearInterval(pollRef.current);
  //   let lastId = lastTelegramUpdate;
  //   pollRef.current = setInterval(async () => {
  //     const result = await pollForConfirmation(invoiceId, lastId);
  //     lastId = result.lastUpdateId;
  //     setLastTelegramUpdate(result.lastUpdateId);

  //     if (result.status === 'confirmed') {
  //       clearInterval(pollRef.current);
  //       clearInterval(timerRef.current);
  //       setPayStatus(PAY_STATUS.CONFIRMED);
  //     } else if (result.status === 'cancelled') {
  //       clearInterval(pollRef.current);
  //       clearInterval(timerRef.current);
  //       setPayStatus(PAY_STATUS.FAILED);
  //     }
  //   }, 4000);
  // }, [lastTelegramUpdate]);

  // const handleProceedToPayment = () => {
  //   setFormError('');
  //   if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
  //     setFormError('Required Fields Missing: Please enter your Name, Phone Number, and Address.');
  //     return;
  //   }

  //   const date = new Date().toLocaleDateString('en-US', {
  //     year: 'numeric', month: 'long', day: 'numeric',
  //     hour: '2-digit', minute: '2-digit',
  //   });
  //   const uniqueId = Math.floor(100000 + Math.random() * 900000);

  //   const invoice = {
  //     id:           uniqueId,
  //     accountEmail: userEmail,
  //     customerName, items: [...cart],
  //     subtotal,     shippingFee,  total: grandTotal,
  //     phone:        phoneNumber,  address, mapLocation,
  //     carrier:      deliveryMethod, date,
  //     status:       'pending',
  //   };

  //   setPendingInvoice(invoice);
  //   setProofFile(null);
  //   setProofPreview(null);
  //   setProofError('');
  //   setPayStatus(PAY_STATUS.PENDING);
  //   setShowQrModal(true);
  //   startTimer();
  // };

  // const handleUserConfirm = () => {
  //   if (payStatus !== PAY_STATUS.PENDING) return;
  //   setPayStatus(PAY_STATUS.UPLOADING);
  //   setProofError('');
  // };

  // const handleFileSelect = (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;
  //   processFile(file);
  // };

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   const file = e.dataTransfer.files?.[0];
  //   if (!file) return;
  //   processFile(file);
  // };

  // const processFile = (file) => {
  //   setProofError('');
  //   const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
  //   if (!allowed.includes(file.type)) {
  //     setProofError('Only images (JPG, PNG, WebP) or PDF files are accepted.');
  //     return;
  //   }
  //   if (file.size > 10 * 1024 * 1024) {
  //     setProofError('File too large. Maximum size is 10 MB.');
  //     return;
  //   }

  //   setProofFile(file);

  //   if (file.type !== 'application/pdf') {
  //     const url = URL.createObjectURL(file);
  //     setProofPreview(url);
  //   } else {
  //     setProofPreview(null);
  //   }
  // };

  // const handleRemoveProof = () => {
  //   if (proofPreview) URL.revokeObjectURL(proofPreview);
  //   setProofFile(null);
  //   setProofPreview(null);
  //   setProofError('');
  //   if (fileInputRef.current) fileInputRef.current.value = '';
  // };

  // const handleSubmitProof = async () => {
  //   if (!proofFile) {
  //     setProofError('Please attach your payment screenshot or PDF before submitting.');
  //     return;
  //   }

  //   setPayStatus(PAY_STATUS.SUBMITTING);
  //   setUploadProgress('Sending order details…');

  //   try {
  //     await sendOrderAlert(pendingInvoice);

  //     setUploadProgress('Uploading payment proof…');

  //     const proofResult = await sendPaymentProof(
  //       proofFile,
  //       pendingInvoice.id,
  //       pendingInvoice.customerName,
  //       pendingInvoice.total.toFixed(2)
  //     );

  //     if (!proofResult?.ok) {
  //       throw new Error('File upload failed');
  //     }

  //     setUploadProgress('Waiting for admin confirmation…');

  //     setPayStatus(PAY_STATUS.VERIFYING);
  //     startPolling(pendingInvoice.id);

  //   } catch (err) {
  //     console.error(err);
  //     setProofError('Upload failed. Please check your connection and try again.');
  //     setPayStatus(PAY_STATUS.UPLOADING);
  //   }
  // };

  // useEffect(() => {
  //   if (payStatus !== PAY_STATUS.CONFIRMED || !pendingInvoice) return;

  //   const finalize = async () => {
  //     const finalInvoice = saveOrder(pendingInvoice, orderHistory);
  //     setInvoiceDetails(finalInvoice);

  //     await sendPaymentConfirmedAlert(finalInvoice);

  //     checkout();
  //     setCustomerName(''); setPhoneNumber(''); setAddress(''); setMapLocation('');
  //     setPendingInvoice(null);
  //     setProofFile(null);
  //     setProofPreview(null);
  //     setShowQrModal(false);
  //     setShowInvoiceModal(true);
  //   };

  //   finalize();
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [payStatus]);


  // Add this constant at the top (same as other files)
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Replace your current saveOrder function with this:
const saveOrderToDB = async (invoice) => {
  try {
    const res = await fetch(`${API}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: invoice.accountEmail,           // or use real userId if available
        userEmail: invoice.accountEmail,
        userName: invoice.customerName,
        items: invoice.items,
        total: invoice.total,
        shippingFee: invoice.shippingFee,
        carrier: invoice.carrier,
        address: invoice.address,
        phone: invoice.phone,
      }),
    });

    if (!res.ok) throw new Error('Failed to save order');
    
    console.log('✅ Order saved to database');
    return true;
  } catch (err) {
    console.error('Failed to save to DB:', err);
    return false;
  }
};

// Update the finalize function inside useEffect
useEffect(() => {
  if (payStatus !== PAY_STATUS.CONFIRMED || !pendingInvoice) return;

  const finalize = async () => {
    const finalInvoice = saveOrder(pendingInvoice, orderHistory); // keep local for now

    // NEW: Save to Database
    await saveOrderToDB(finalInvoice);

    await sendPaymentConfirmedAlert(finalInvoice);

    checkout();
    setCustomerName(''); 
    setPhoneNumber(''); 
    setAddress(''); 
    setMapLocation('');
    setPendingInvoice(null);
    setProofFile(null);
    setProofPreview(null);
    setShowQrModal(false);
    setShowInvoiceModal(true);
  };

  finalize();
}, [payStatus]);




  const handleRetry = () => {
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
    setProofFile(null);
    setProofPreview(null);
    setProofError('');
    setPayStatus(PAY_STATUS.PENDING);
    startTimer();
  };

  const handleCancelPayment = () => {
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setPayStatus(PAY_STATUS.IDLE);
    setShowQrModal(false);
    setPendingInvoice(null);
    setProofFile(null);
    setProofPreview(null);
  };

  const copyInvoiceId = (id) => {
    navigator.clipboard.writeText(`#${id}`);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(''), 1500);
  };

  const handleDeleteHistoryItem = (orderId) => {
    if (userRole !== 'admin') { alert('Access Denied.'); return; }
    if (!window.confirm(`Permanently delete Order #${orderId}?`)) return;
    const updated = orderHistory.filter(o => o.id !== orderId);
    localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
    setOrderHistory(updated);
  };

  const handleShareInvoice = async () => {
    if (!invoiceDetails) return;
    const text = `PSP Mart Invoice #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}\nCustomer: ${invoiceDetails.customerName}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'PSP Mart Receipt', text, url: window.location.href }); } catch {}
    } else {
      navigator.clipboard.writeText(text);
      alert('Invoice copied to clipboard!');
    }
  };

  const timerMM     = String(Math.floor(qrSecondsLeft / 60)).padStart(2, '0');
  const timerSS     = String(qrSecondsLeft % 60).padStart(2, '0');
  const timerPct    = (qrSecondsLeft / QR_EXPIRY_SECONDS) * 100;
  const timerUrgent = qrSecondsLeft <= 60;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl mx-auto font-sans px-4">

      {/* ═══ SCREEN VIEW ═══════════════════════════════════════════════════ */}
      <div className="print:hidden">
        {cart.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 text-xs">
            <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-base font-bold text-gray-900 mb-1">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Browse products and add them to start checkout.</p>
            <button onClick={() => setShowHistoryModal(true)}
              className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm">
              <History size={14} className="text-blue-600" />
              {userRole === 'admin' ? `Total Sales (${allowedHistory.length})` : `Purchase History (${allowedHistory.length})`}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                  <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                    <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
                  </h2>
                  <button onClick={() => setShowHistoryModal(true)}
                    className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition">
                    <History size={13} /> {userRole === 'admin' ? 'Total Sales' : 'My History'} ({allowedHistory.length})
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
                      <div className="flex items-center space-x-3.5">
                        <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
                        <div>
                          <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
                          <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
                          <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
                <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
                </h2>
                {formError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100 flex items-center gap-2">
                    <AlertCircle size={14} /> {formError}
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Recipient Full Name *', icon: User,  val: customerName, set: setCustomerName, ph: 'e.g., Phy Sopheak',             col: '' },
                    { label: 'Contact Phone *',       icon: Phone, val: phoneNumber,  set: setPhoneNumber,  ph: 'e.g., 012 345 678',             col: '' },
                    { label: 'Drop-off Address *',    icon: Home,  val: address,      set: setAddress,      ph: 'Street, House, Sangkat, Khan…', col: 'md:col-span-2' },
                    { label: 'Google Maps Link (Optional)', icon: MapPin, val: mapLocation, set: setMapLocation, ph: 'https://maps.google.com/…', col: 'md:col-span-2', type: 'url' },
                  ].map(({ label, icon: Icon, val, set, ph, col, type }) => (
                    <div key={label} className={col}>
                      <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">{label}</label>
                      <div className="relative">
                        <Icon size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                        <input type={type || 'text'} placeholder={ph} value={val} onChange={e => set(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
                <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                  <Truck size={16} className="text-blue-700" /> Logistics Carrier
                </h2>
                <div className="space-y-2">
                  {deliveryServices.map(({ id, name, rate, eta, icon: Icon }) => {
                    const sel = deliveryMethod === name;
                    return (
                      <label key={id} onClick={() => { setDeliveryMethod(name); setShippingFee(rate); }}
                        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${sel ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                        <div className="flex items-center space-x-3">
                          <Icon size={16} className={sel ? 'text-blue-600' : 'text-gray-400'} />
                          <div>
                            <span className="block font-bold">{name}</span>
                            <span className="text-[10px] text-gray-400">ETA: {eta}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block font-black text-blue-600">${rate.toFixed(2)}</span>
                          <input type="radio" readOnly checked={sel} className="h-3 w-3 text-blue-600 mt-0.5" />
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
                <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                  <DollarSign size={16} className="text-blue-700" /> Order Summary
                </h2>
                <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
                  <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
                    <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
                    <span className="text-green-600 font-bold">Active</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 mb-5">
                  <span className="font-black text-gray-900 uppercase text-xs">Grand Total</span>
                  <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
                </div>
                <button onClick={handleProceedToPayment}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2">
                  <ShieldCheck size={14} /> Authorize Payment via KHQR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ SIMILAR PRODUCTS ══════════════════════════════════════════════ */}
      {(() => {
        const cartIds = new Set(cart.map(i => i.id));
        const cartCategories = new Set(cart.map(i => i.category).filter(Boolean));
        const allProducts = Array.isArray(products) ? products : [];

        const similar = [
          ...allProducts.filter(p => !cartIds.has(p.id) && cartCategories.has(p.category)),
          ...allProducts.filter(p => !cartIds.has(p.id) && !cartCategories.has(p.category)),
        ].slice(0, 12);

        if (similar.length === 0) return null;

        return (
          <SimilarProducts
            products={similar}
            onAddToCart={addToCart}
            cartIds={cartIds}
          />
        );
      })()}

      {/* ═══ QR PAYMENT MODAL ══════════════════════════════════════════════ */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">

            <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 pt-6 pb-5 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck size={16} className="opacity-80" />
                <span className="text-xs font-bold tracking-widest uppercase opacity-80">Bakong KHQR · NBC Licensed</span>
              </div>
              <div className="text-3xl font-black">${grandTotal.toFixed(2)}</div>
              <div className="text-blue-200 text-xs mt-1">Invoice #{pendingInvoice?.id}</div>

              <div className="flex items-center justify-center gap-2 mt-3">
                {['Scan & Pay', 'Upload Proof', 'Confirmed'].map((step, i) => {
                  const stepStatuses = [
                    [PAY_STATUS.PENDING],
                    [PAY_STATUS.UPLOADING, PAY_STATUS.SUBMITTING],
                    [PAY_STATUS.VERIFYING, PAY_STATUS.CONFIRMED],
                  ];
                  const isActive = stepStatuses[i].includes(payStatus);
                  const isPast = (
                    (i === 0 && [PAY_STATUS.UPLOADING, PAY_STATUS.SUBMITTING, PAY_STATUS.VERIFYING, PAY_STATUS.CONFIRMED].includes(payStatus)) ||
                    (i === 1 && [PAY_STATUS.VERIFYING, PAY_STATUS.CONFIRMED].includes(payStatus))
                  );
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center">
                        <div className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center border-2 transition
                          ${isPast ? 'bg-white border-white text-blue-700' :
                            isActive ? 'bg-blue-500 border-white text-white' :
                            'bg-transparent border-blue-400 text-blue-300'}`}>
                          {isPast ? '✓' : i + 1}
                        </div>
                        <span className={`text-[8px] mt-0.5 font-bold ${isActive || isPast ? 'text-white' : 'text-blue-400'}`}>{step}</span>
                      </div>
                      {i < 2 && <div className={`w-6 h-px mb-3 ${isPast ? 'bg-white' : 'bg-blue-400/40'}`} />}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="px-6 pb-6 pt-4">

              {payStatus === PAY_STATUS.PENDING && (
                <>
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                        <Timer size={10} /> QR Expires In
                      </span>
                      <span className={`font-black text-sm font-mono ${timerUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
                        {timerMM}:{timerSS}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${timerUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${timerPct}%` }} />
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-center mb-3 shadow-inner">
                    <img src={khqrImage} alt="KHQR" className="w-52 h-52 object-contain" />
                  </div>

                  <p className="text-center text-[11px] text-gray-400 mb-4">
                    Open <b>Bakong App</b> → Scan QR → Transfer <b>${grandTotal.toFixed(2)}</b> → tap confirm below
                  </p>

                  <div className="flex gap-3 text-xs font-bold">
                    <button onClick={handleCancelPayment}
                      className="w-2/5 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition">
                      Cancel
                    </button>
                    <button onClick={handleUserConfirm}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2">
                      <CheckCircle2 size={14} /> I Have Transferred
                    </button>
                  </div>
                </>
              )}

              {payStatus === PAY_STATUS.UPLOADING && (
                <div>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <ShieldCheck size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                      To protect both parties, please attach a screenshot or PDF of your Bakong transfer confirmation. This is sent directly to the shop owner for verification.
                    </p>
                  </div>

                  {!proofFile ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={e => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/30 rounded-2xl p-6 text-center cursor-pointer transition group mb-3">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition">
                          <Upload size={20} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-700">Drop your file here or <span className="text-blue-600">browse</span></p>
                          <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP or PDF · Max 10 MB</p>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1"><ImagePlus size={10} /> Screenshot</span>
                          <span>or</span>
                          <span className="flex items-center gap-1"><FileText size={10} /> PDF Receipt</span>
                        </div>
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*,application/pdf"
                        onChange={handleFileSelect} className="hidden" />
                    </div>
                  ) : (
                    <div className="border border-green-200 bg-green-50 rounded-2xl p-3 mb-3 relative">
                      <button onClick={handleRemoveProof}
                        className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-0.5 hover:bg-red-50 hover:border-red-300 transition">
                        <X size={12} className="text-gray-500" />
                      </button>

                      {proofPreview ? (
                        <img src={proofPreview} alt="Payment proof" className="w-full max-h-40 object-contain rounded-xl mb-2" />
                      ) : (
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                            <FileText size={18} className="text-red-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800 truncate max-w-[180px]">{proofFile.name}</p>
                            <p className="text-[10px] text-gray-400">PDF Document</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-bold">
                        <CheckCircle2 size={11} className="text-green-600" />
                        {proofFile.name} · {(proofFile.size / 1024).toFixed(0)} KB
                      </div>
                    </div>
                  )}

                  {proofError && (
                    <div className="flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl p-2.5 mb-3">
                      <AlertCircle size={12} className="shrink-0" /> {proofError}
                    </div>
                  )}

                  <div className="flex gap-3 text-xs font-bold">
                    <button onClick={() => setPayStatus(PAY_STATUS.PENDING)}
                      className="w-2/5 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition">
                      ← Back
                    </button>
                    <button onClick={handleSubmitProof} disabled={!proofFile}
                      className={`flex-1 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${proofFile ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                      <Send size={13} /> Submit Proof
                    </button>
                  </div>
                </div>
              )}

              {payStatus === PAY_STATUS.SUBMITTING && (
                <div className="text-center py-6">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                    <Upload size={20} className="absolute text-blue-600" />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-1">Sending to Shop Owner…</h3>
                  <p className="text-gray-400 text-xs">{uploadProgress}</p>
                </div>
              )}

              {payStatus === PAY_STATUS.VERIFYING && (
                <div className="text-center py-4">
                  <div className="relative inline-flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                    <Wifi size={22} className="absolute text-blue-600" />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-1">Proof Submitted!</h3>
                  <p className="text-gray-400 text-xs mb-2">Shop owner is reviewing your payment proof.</p>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 size={12} className="text-green-600" />
                      <span className="text-[11px] font-bold text-green-800">Receipt delivered to admin</span>
                    </div>
                    <p className="text-[10px] text-green-700 font-mono">
                      Auto-checking for approval every 4s…
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-1 mb-4">
                    <Timer size={11} className={timerUrgent ? 'text-red-500' : 'text-gray-400'} />
                    <span className={`font-mono font-black text-sm ${timerUrgent ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
                      {timerMM}:{timerSS} remaining
                    </span>
                  </div>

                  <button onClick={handleCancelPayment}
                    className="w-full border border-gray-200 text-gray-400 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-xs">
                    Cancel Order
                  </button>
                </div>
              )}

              {payStatus === PAY_STATUS.EXPIRED && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
                    <Clock size={28} className="text-amber-500" />
                  </div>
                  <h3 className="font-black text-gray-900 text-sm mb-1">QR Code Expired</h3>
                  <p className="text-gray-400 text-xs mb-4">The payment window has closed. Generate a new QR to try again.</p>
                  <div className="flex gap-3 text-xs font-bold">
                    <button onClick={handleCancelPayment}
                      className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl">Cancel</button>
                    <button onClick={handleRetry}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl flex items-center justify-center gap-1.5">
                      <RefreshCw size={12} /> New QR Code
                    </button>
                  </div>
                </div>
              )}

              {payStatus === PAY_STATUS.FAILED && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
                    <WifiOff size={28} className="text-red-500" />
                  </div>
                  <h3 className="font-black text-red-700 text-sm mb-1">Order Rejected</h3>
                  <p className="text-gray-400 text-xs mb-4">The shop owner could not verify this payment. Please contact support or try again.</p>
                  <button onClick={handleCancelPayment}
                    className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-xs">
                    Close
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ═══ INVOICE MODAL ═════════════════════════════════════════════════ */}
      {showInvoiceModal && invoiceDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] print:hidden">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="text-xs text-gray-800">
              <div className="text-center pb-4 border-b border-dashed border-gray-300">
                <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
                <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
                <p className="text-gray-400 text-[10px]">Payment Verified · High Quality Product Logistics</p>
              </div>

              <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
                <div>
                  <span className="text-gray-400 block">Invoice ID</span>
                  <button onClick={() => copyInvoiceId(invoiceDetails.id)}
                    className="font-bold text-gray-900 flex items-center gap-1 hover:text-blue-600">
                    #{invoiceDetails.id}
                    {copyFeedback === invoiceDetails.id ? <CheckCircle2 size={10} className="text-green-500" /> : <Copy size={10} />}
                  </button>
                </div>
                <div className="text-right"><span className="text-gray-400 block">Date</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
                <div><span className="text-gray-400 block">Customer</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
                <div className="text-right"><span className="text-gray-400 block">Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
                <div><span className="text-gray-400 block">Carrier</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
                <div className="text-right"><span className="text-gray-400 block">Shipping</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
                <div className="col-span-2"><span className="text-gray-400 block">Account</span><span className="font-medium text-blue-600">{invoiceDetails.accountEmail}</span></div>
                <div className="col-span-2"><span className="text-gray-400 block">Address</span><span className="font-medium text-gray-900">{invoiceDetails.address}</span></div>
                {invoiceDetails.mapLocation && (
                  <div className="col-span-2">
                    <a href={invoiceDetails.mapLocation} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1 text-blue-500 hover:underline font-medium">
                      <ExternalLink size={10} /> View Map Route
                    </a>
                  </div>
                )}
              </div>

              <div className="py-3 border-b border-dashed border-gray-300">
                <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Manifest</span>
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                  {invoiceDetails.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
                      <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">×{item.quantity}</span></span>
                      <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <span className="text-xs font-black uppercase tracking-wider text-gray-900">Total Paid</span>
                <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 font-bold text-xs">
              <button onClick={() => window.print()}
                className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
                <Download size={14} /> Print Receipt
              </button>
              <button onClick={handleShareInvoice}
                className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
                <Share2 size={14} /> Share Invoice
              </button>
              <button onClick={() => setShowInvoiceModal(false)}
                className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ HISTORY MODAL ═════════════════════════════════════════════════ */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <Receipt size={18} className="text-blue-700" />
                {userRole === 'admin' ? 'Sales Manifest (Admin)' : 'My Purchase History'}
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{filteredHistory.length} records</span>
            </div>

            <div className="relative my-2">
              <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
              <input type="text" placeholder="Search by Invoice ID, Name, or Phone…"
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 font-bold text-gray-400 hover:text-gray-600 text-[10px] bg-gray-200/60 px-1.5 py-0.5 rounded">
                  Clear
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs mt-2">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400 italic">No records found.</div>
              ) : filteredHistory.map(order => (
                <div key={order.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-300 transition shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-black text-gray-900 block">Invoice #{order.id}</span>
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {order.date}</span>
                    </div>
                    <span className="font-black text-blue-700 text-sm">${order.total.toFixed(2)}</span>
                  </div>
                  <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
                    {userRole === 'admin' && (
                      <div className="text-red-600 font-bold"><span className="text-gray-700 font-semibold">Email:</span> {order.accountEmail}</div>
                    )}
                    <div><span className="font-semibold text-gray-700">Customer:</span> {order.customerName} ({order.phone})</div>
                    <div className="text-[11px] text-slate-500 italic mt-1">{order.items.reduce((s, i) => s + i.quantity, 0)} item(s) · {order.carrier}</div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => { setInvoiceDetails(order); setShowInvoiceModal(true); }}
                      className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5">
                      <Receipt size={13} /> View Invoice
                    </button>
                    {userRole === 'admin' && (
                      <button onClick={() => handleDeleteHistoryItem(order.id)}
                        className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold p-2 rounded-xl transition">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowHistoryModal(false)}
              className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
              Return to Checkout
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
          PRINT LAYOUT — Pure Tailwind Professional Business Invoice (A4)
          hidden on screen, visible only when printing
      ════════════════════════════════════════════════════════════════════ */}
      {invoiceDetails && (
        <div className="hidden print:block">
          <style>{`
            @page { size: A4; margin: 0; }
            @media print {
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              body { margin: 0 !important; padding: 0 !important; }
              .print\\:block { display: block !important; }
            }
          `}</style>

          {/* A4 page wrapper */}
          <div className="w-[210mm] min-h-[297mm] mx-auto bg-white relative flex flex-col text-gray-900">

            {/* ── Top blue bar ── */}
            <div className="h-3 bg-blue-900 w-full" />

            {/* ── Main body ── */}
            <div className="flex-1 px-12 pt-8 pb-32">

              {/* ── HEADER ── */}
              <div className="flex justify-between items-start mb-6">

                {/* Left: company */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-900 rounded flex items-center justify-center shrink-0">
                      <span className="text-white font-black text-xl">P</span>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-blue-900 leading-none tracking-tight">PSP MART</div>
                      <div className="text-[8pt] text-gray-500 uppercase tracking-widest mt-0.5">Quality Product Logistics</div>
                    </div>
                  </div>
                  <div className="text-[8pt] text-gray-500 leading-relaxed mt-1 pl-0.5">
                    <div>Phnom Penh, Kingdom of Cambodia</div>
                    <div>KHQR Verified · NBC Licensed Payment</div>
                    <div>support@pspmart.com</div>
                  </div>
                </div>

                {/* Right: invoice meta */}
                <div className="text-right">
                  <div className="text-5xl font-black text-blue-900 tracking-tight leading-none">INVOICE</div>
                  <div className="inline-block mt-2 bg-blue-50 border border-blue-200 rounded px-3 py-1">
                    <span className="font-mono font-bold text-blue-700 text-sm">#{invoiceDetails.id}</span>
                  </div>
                  <div className="text-[8pt] text-gray-500 mt-2 leading-relaxed">
                    <div><span className="font-semibold text-gray-700">Date:</span> {invoiceDetails.date}</div>
                    <div><span className="font-semibold text-gray-700">Status:</span> <span className="text-green-600 font-bold">PAID ✓</span></div>
                  </div>
                </div>
              </div>

              {/* ── Horizontal rule ── */}
              <div className="border-t border-gray-200 mb-6" />

              {/* ── BILL TO / SHIP TO / PAYMENT ── */}
              <div className="grid grid-cols-3 gap-4 mb-7">

                {/* Bill To */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <div className="text-[7pt] font-black text-gray-400 uppercase tracking-widest mb-2">Bill To</div>
                  <div className="font-black text-gray-900 text-[11pt] mb-1">{invoiceDetails.customerName}</div>
                  <div className="text-[8pt] text-gray-600 leading-relaxed">
                    <div>{invoiceDetails.phone}</div>
                    <div>{invoiceDetails.accountEmail}</div>
                  </div>
                </div>

                {/* Ship To */}
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <div className="text-[7pt] font-black text-gray-400 uppercase tracking-widest mb-2">Ship To</div>
                  <div className="font-bold text-gray-900 text-[9pt] mb-1">{invoiceDetails.carrier}</div>
                  <div className="text-[8pt] text-gray-600 leading-relaxed">
                    <div>{invoiceDetails.address}</div>
                    {invoiceDetails.mapLocation && (
                      <div className="text-blue-600 text-[7.5pt] mt-1 break-all">{invoiceDetails.mapLocation}</div>
                    )}
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <div className="text-[7pt] font-black text-blue-400 uppercase tracking-widest mb-2">Payment Method</div>
                  <div className="font-black text-blue-900 text-[10pt] mb-1">Bakong KHQR</div>
                  <div className="text-[8pt] text-blue-700 leading-relaxed">
                    <div>NBC Licensed</div>
                    <div className="text-green-600 font-bold mt-1">Verified &amp; Confirmed ✓</div>
                  </div>
                </div>
              </div>

              {/* ── ITEMS TABLE ── */}
              <div className="mb-6">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_auto_auto_auto] bg-blue-900 text-white text-[8pt] font-black uppercase tracking-wider rounded-t px-3 py-2.5"
                  style={{ gridTemplateColumns: '1fr 60px 90px 90px' }}>
                  <div>Description</div>
                  <div className="text-center">Qty</div>
                  <div className="text-right">Unit Price</div>
                  <div className="text-right">Amount</div>
                </div>

                {/* Item rows */}
                {invoiceDetails.items.map((item, i) => (
                  <div key={i}
                    className={`grid px-3 py-2.5 text-[9pt] border-l border-r border-b border-gray-200 items-center ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                    style={{ gridTemplateColumns: '1fr 60px 90px 90px' }}>
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-center text-gray-600 font-semibold">{item.quantity}</div>
                    <div className="text-right text-gray-600">${Number(item.price).toFixed(2)}</div>
                    <div className="text-right font-bold text-blue-900">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}

                {/* Blue bottom accent */}
                <div className="h-1 bg-blue-900 rounded-b" />
              </div>

              {/* ── TOTALS ── */}
              <div className="flex justify-end mb-8">
                <div className="w-64">
                  <div className="flex justify-between text-[8.5pt] text-gray-500 py-1.5 border-b border-gray-100">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-800">${invoiceDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[8.5pt] text-gray-500 py-1.5 border-b border-gray-100">
                    <span>Shipping ({invoiceDetails.carrier})</span>
                    <span className="font-semibold text-gray-800">${invoiceDetails.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[8.5pt] text-green-600 py-1.5 border-b border-gray-100">
                    <span>Discount</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-900 text-white px-4 py-3 rounded mt-2">
                    <span className="text-[8pt] font-black uppercase tracking-wider text-blue-200">Total Paid</span>
                    <span className="text-[15pt] font-black">${invoiceDetails.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* ── NOTES & TERMS ── */}
              <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-8">
                <div className="text-[7pt] font-black text-gray-400 uppercase tracking-widest mb-2">Notes &amp; Terms</div>
                <div className="text-[8pt] text-gray-500 leading-relaxed space-y-0.5">
                  <div>• Payment has been received and confirmed via Bakong KHQR (NBC Licensed).</div>
                  <div>• Please retain this invoice as proof of purchase for warranty or return purposes.</div>
                  <div>• For inquiries, contact support@pspmart.com or visit our store in Phnom Penh.</div>
                  <div>• Goods are non-refundable once dispatched unless defective upon arrival.</div>
                </div>
              </div>

              {/* ── SIGNATURES ── */}
              <div className="flex gap-10">
                {['Authorized Signature', 'Customer Signature'].map(label => (
                  <div key={label} className="flex-1">
                    <div className="border-b border-gray-400 h-10 mb-1.5" />
                    <div className="text-[7pt] text-gray-400 text-center tracking-wide">{label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* ── FOOTER — pinned to page bottom ── */}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="h-0.5 bg-blue-400" />
              <div className="bg-blue-900 px-12 py-3 flex justify-between items-center">
                <span className="text-[7.5pt] text-blue-300">Thank you for shopping with PSP Mart!</span>
                <span className="text-[7.5pt] text-blue-500 font-mono">INV-{invoiceDetails.id} · {new Date().getFullYear()}</span>
                <span className="text-[7.5pt] text-blue-300">pspmart.com · Phnom Penh, Cambodia</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}