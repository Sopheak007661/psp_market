// import React, { useState, useContext, useRef } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, Truck, Download, Share2, CheckCircle2 } from 'lucide-react';

// export default function Cart() {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
//   // Invoice state to persist summary after cart wipes out
//   const [invoiceDetails, setInvoiceDetails] = useState(null);

//   // Delivery Form State
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [mapLocation, setMapLocation] = useState('');
//   const [deliveryMethod, setDeliveryMethod] = useState('Home Delivery');
//   const [formError, setFormError] = useState('');

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   // Delivery service partners configuration
//   const deliveryServices = [
//     { id: 'home', name: 'Standard Home Delivery', icon: Home },
//     { id: 'vireak', name: 'Vireak Buntham', icon: Truck },
//     { id: 'foodpanda', name: 'FoodPanda Express', icon: ShoppingBag },
//     { id: 'wownow', name: 'WOW NOW Logistics', icon: Truck },
//     { id: 'egets', name: 'E-GetS Delivery', icon: Truck },
//   ];

//   // Trigger Telegram Notification Webhook
//   const sendTelegramAlert = async (invoiceId, currentCart) => {
//     const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
//     const TELEGRAM_CHAT_ID = "6710148858";     

//     let itemDetails = currentCart.map(item => `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
//     const message = `
// 🔔 *NEW ORDER RECEIVED - PSP MART* 🔔
// ----------------------------------
// 🆔 *Invoice ID:* #${invoiceId}
// 💰 *Grand Total:* $${subtotal.toFixed(2)}
// 🚚 *Service Provider:* ${deliveryMethod}

// 📦 *Product Summary:*
// ${itemDetails}

// 📍 *Delivery Information:*
// • *Phone:* ${phoneNumber}
// • *Address:* ${address}
// • *Map Link:* ${mapLocation ? mapLocation : 'None provided'}
// ----------------------------------
// 🚀 *Action Required:* Please prepare packages for delivery!
// `;

//     try {
//       await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: TELEGRAM_CHAT_ID,
//           text: message,
//           parse_mode: 'Markdown'
//         })
//       });
//     } catch (err) {
//       console.error("Failed to transmit order alert to Telegram channel:", err);
//     }
//   };

//   // Validate form details before pulling up QR modal
//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!phoneNumber.trim() || !address.trim()) {
//       setFormError('Please input your delivery address and contact phone number first.');
//       return;
//     }
//     setShowQrModal(true);
//   };

//   const handleFinalizePayment = async () => {
//     setShowQrModal(false);
    
//     const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
//     const invoiceData = {
//       id: uniqueInvoiceId,
//       items: [...cart],
//       total: subtotal,
//       phone: phoneNumber,
//       address: address,
//       carrier: deliveryMethod,
//       date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
//     };

//     // Stash invoice info locally to present layout view
//     setInvoiceDetails(invoiceData);
//     setShowInvoiceModal(true);
    
//     // Trigger the automated bot alert
//     await sendTelegramAlert(uniqueInvoiceId, cart);
    
//     // Clear out client shopping provider states
//     checkout();
//   };

//   // Trigger system browser print UI wrapper targeted specifically for receipts
//   const handleSaveInvoice = () => {
//     window.print();
//   };

//   // HTML Web Share API Integration
//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}\nCarrier: ${invoiceDetails.carrier}\nDelivery to: ${invoiceDetails.phone}`;
    
//     if (navigator.share) {
//       try {
//         await navigator.share({
//           title: 'PSP Mart Receipt',
//           text: shareText,
//           url: window.location.href
//         });
//       } catch (err) {
//         console.log('Error sharing summary stream:', err);
//       }
//     } else {
//       // Fallback copy paste action
//       navigator.clipboard.writeText(shareText);
//       alert('Invoice details copied directly to clipboard clipboard!');
//     }
//   };

//   if (cart.length === 0 && !showInvoiceModal) {
//     return (
//       <div className="text-center py-24 bg-white border border-gray-100 rounded-2xl shadow-sm max-w-md mx-auto">
//         <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-3" />
//         <h2 className="text-sm font-bold text-gray-900 mb-1">Your bag is empty</h2>
//         <p className="text-gray-400 text-xs px-6">Add active catalog options from the home panel to populate this review stream.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:hidden">
      
//       {/* LEFT COLUMN: Shopping Cart Items */}
//       <div className="lg:col-span-2 bg-gray-50 border border-gray-200 p-5 rounded-2xl shadow-sm">
//         <h2 className="text-xl font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">Review Items</h2>
//         <div className="divide-y divide-gray-100 bg-white p-2 rounded-xl border border-gray-100">
//           {cart.map(item => (
//             <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 text-xs">
//               <div className="flex items-center space-x-3">
//                 <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-xl bg-gray-50 border border-gray-100" />
//                 <div>
//                   <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
//                   <p className="text-gray-400 text-[11px] font-semibold">${Number(item.price||0).toFixed(2)}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-4">
//                 <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-1 bg-gray-50/50">
//                   <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5 hover:bg-white rounded text-gray-500 shadow-sm"><Minus className="h-3 w-3" /></button>
//                   <span className="font-bold text-gray-900 px-1 w-4 text-center">{item.quantity}</span>
//                   <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5 hover:bg-white rounded text-gray-500 shadow-sm"><Plus className="h-3 w-3" /></button>
//                 </div>
//                 <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* RIGHT COLUMN: Delivery Options & Computation Summary */}
//       <div className="space-y-5">
        
//         {/* SHIPPING FORM DATA CARD */}
//         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-xs">
//           <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">Delivery Routing</h2>
          
//           {formError && (
//             <div className="bg-red-50 text-red-600 p-2.5 rounded-xl mb-3 font-semibold text-center border border-red-100">
//               {formError}
//             </div>
//           )}

//           <div className="space-y-3.5">
//             <div>
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1">Contact Phone *</label>
//               <div className="relative">
//                 <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
//                 <input 
//                   type="text" 
//                   placeholder="e.g., 012 345 678"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1">Drop-off Home Address *</label>
//               <div className="relative">
//                 <Home size={14} className="absolute left-3 top-3 text-gray-400" />
//                 <input 
//                   type="text" 
//                   placeholder="Street No, House No, Sangkat, Khan"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1">Google Maps Link (Optional)</label>
//               <div className="relative">
//                 <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
//                 <input 
//                   type="url" 
//                   placeholder="https://maps.google.com/..."
//                   value={mapLocation}
//                   onChange={(e) => setMapLocation(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
//                 />
//               </div>
//             </div>

//             {/* NEW: LOGISTICS PARTNER SELECTION PANEL */}
//             <div>
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-2">Select Delivery Method Provider</label>
//               <div className="grid grid-cols-1 gap-2">
//                 {deliveryServices.map((service) => {
//                   const IconComponent = service.icon;
//                   const isSelected = deliveryMethod === service.name;
//                   return (
//                     <label 
//                       key={service.id} 
//                       className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition ${
//                         isSelected 
//                           ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-900' 
//                           : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
//                       }`}
//                     >
//                       <div className="flex items-center space-x-2.5">
//                         <IconComponent size={14} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
//                         <span>{service.name}</span>
//                       </div>
//                       <input 
//                         type="radio" 
//                         name="deliveryMethod" 
//                         value={service.name} 
//                         checked={isSelected}
//                         onChange={() => setDeliveryMethod(service.name)}
//                         className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300"
//                       />
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* PRICING COMPUTATION AND BUTTON */}
//         <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-xs">
//           <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">Pricing Computation</h2>
//           <div className="space-y-2.5 pb-4 border-b border-gray-100 font-medium text-gray-500">
//             <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//             <div className="flex justify-between"><span>Logistics Fees</span><span className="text-green-600 font-semibold">Free/Included</span></div>
//           </div>
//           <div className="flex justify-between items-center pt-4 mb-5">
//             <span className="font-black text-gray-900 uppercase">Grand Valuation</span>
//             <span className="text-base font-black text-gray-900">${subtotal.toFixed(2)}</span>
//           </div>
          
//           <button 
//             onClick={handleProceedToPayment} 
//             className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition shadow-md uppercase tracking-wider"
//           >
//             Pay via KHQR
//           </button>
//         </div>
//       </div>

//       {/* DYNAMIC QR DISPLAY MODAL */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
//             <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR</h3>
//             <p className="text-gray-400 text-[11px] mb-4">Transfer the correct total using any Cambodian banking app.</p>
            
//             <div className="bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 mb-4 inline-block">
//               <span className="text-[10px] text-gray-400 block font-bold uppercase">Amount Due</span>
//               <span className="text-xl font-black text-blue-600">${subtotal.toFixed(2)}</span>
//             </div>

//             <div className="bg-white border border-gray-200 p-3 rounded-xl inline-block shadow-sm mb-4">
//               <img src={khqrImage} alt="Bakong KHQR" className="w-48 h-48 object-contain mx-auto rounded" />
//             </div>

//             <p className="text-[10px] text-gray-400 italic mb-5 px-4">
//               *Please complete the scanner transaction first, then press Confirm to process store logs.
//             </p>

//             <div className="flex gap-3 text-xs font-bold">
//               <button onClick={() => setShowQrModal(false)} className="w-1/2 border border-gray-200 text-gray-500 py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
//               <button onClick={handleFinalizePayment} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl shadow-md transition">I Have Paid</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* NEW: DYNAMIC INVOICE DISPLAY MODAL */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:bg-white print:absolute print:inset-0">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl print:shadow-none print:p-0">
            
//             {/* Printable Frame Layout begins here */}
//             <div id="invoice-print-area" className="text-xs text-gray-800">
//               <div className="text-center pb-4 border-b border-dashed border-gray-200">
//                 <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2 print:hidden" />
//                 <h2 className="text-lg font-black tracking-wide text-gray-900">PSP MART RECEIPT</h2>
//                 <p className="text-gray-400 text-[10px] mt-0.5">Thank you for shopping with us!</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
//                 <div><span className="text-gray-400 block">Invoice Reference</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Contact Phone</span><span className="font-medium">{invoiceDetails.phone}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Service Carrier</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Delivery destination</span><span className="font-medium line-clamp-1">{invoiceDetails.address}</span></div>
//               </div>

//               {/* Items Breakdown inside invoice block */}
//               <div className="py-4 space-y-2.5 border-b border-dashed border-gray-200">
//                 <span className="block font-bold uppercase tracking-wider text-gray-400 text-[10px]">Itemized Manifest</span>
//                 {invoiceDetails.items.map((item, idx) => (
//                   <div key={idx} className="flex justify-between items-center text-[11px]">
//                     <span className="font-medium text-gray-900">{item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span></span>
//                     <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="pt-4 flex justify-between items-center text-gray-900">
//                 <span className="text-sm font-black uppercase">Paid Total</span>
//                 <span className="text-lg font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Interactive Control Buttons */}
//             <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs print:hidden">
//               <button 
//                 onClick={handleSaveInvoice} 
//                 className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
//               >
//                 <Download size={14} /> Save / Print PDF
//               </button>
//               <button 
//                 onClick={handleShareInvoice} 
//                 className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md"
//               >
//                 <Share2 size={14} /> Share Receipt
//               </button>
//               <button 
//                 onClick={() => setShowInvoiceModal(false)} 
//                 className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2 rounded-xl hover:bg-gray-50 transition"
//               >
//                 Close Window
//               </button>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
























// import React, { useState, useContext, useEffect } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
//   Truck, Download, Share2, CheckCircle2, History, Receipt, 
//   Clock, DollarSign, ShieldCheck 
// } from 'lucide-react';

// export default function Cart() {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
  
//   // Persisted summary states
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory, setOrderHistory] = useState([]);

//   // Delivery Form State
//   const [customerName, setCustomerName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [mapLocation, setMapLocation] = useState('');
//   const [deliveryMethod, setDeliveryMethod] = useState('Standard Home Delivery');
//   const [shippingFee, setShippingFee] = useState(1.00);
//   const [formError, setFormError] = useState('');

//   // Load order history from localStorage on mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       setOrderHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // Configuration for Premium Delivery Partners with dynamic rates
//   const deliveryServices = [
//     { id: 'home', name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days', icon: Home },
//     { id: 'vireak', name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day', icon: Truck },
//     { id: 'foodpanda', name: 'FoodPanda Instant', rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
//     { id: 'wownow', name: 'WOW NOW Logistics', rate: 1.50, eta: 'Same Day', icon: Truck },
//     { id: 'egets', name: 'E-GetS Delivery', rate: 2.00, eta: '40 Mins', icon: Truck },
//   ];

//   const handleDeliveryChange = (serviceName, rate) => {
//     setDeliveryMethod(serviceName);
//     setShippingFee(rate);
//   };

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const grandTotal = subtotal + shippingFee;

//   // Professional HTML-formatted Telegram Webhook
//   const sendTelegramAlert = async (invoiceId, currentCart, orderData) => {
//     const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
//     const TELEGRAM_CHAT_ID = "6710148858";     

//     let itemDetails = currentCart.map(item => `📦 <b>${item.name}</b> (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
//     const htmlMessage = `
// 🛍️ <b>💥 NEW PREMIUM ORDER - PSP MART 💥</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 <b>Invoice Reference:</b> <code>#${invoiceId}</code>
// 📅 <b>Date:</b> ${orderData.date}
// 💵 <b>Grand Total:</b> <u>$${grandTotal.toFixed(2)}</u>
// <i>(Subtotal: $${subtotal.toFixed(2)} + Shipping: $${shippingFee.toFixed(2)})</i>

// 🚚 <b>Logistics Carrier:</b> ${deliveryMethod}

// 👤 <b>CUSTOMER PROFILE:</b>
// • <b>Name:</b> ${customerName}
// • <b>Phone:</b> <code>${phoneNumber}</code>
// • <b>Drop-off Address:</b> ${address}

// 🛒 <b>ITEMIZED MANIFEST:</b>
// ${itemDetails}

// 📍 <b>GEOLOCATION ROUTE:</b>
// ${mapLocation ? `<a href="${mapLocation}">👉 Click here to Open Map Route</a>` : '⚠️ No Google Maps Link Provided'}
// ━━━━━━━━━━━━━━━━━━━━━
// 🚀 <b>System Alert:</b> Please verify KHQR ledger entry and dispatch to carrier package pool immediately!
// `;

//     try {
//       await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: TELEGRAM_CHAT_ID,
//           text: htmlMessage,
//           parse_mode: 'HTML',
//           disable_web_page_preview: false
//         })
//       });
//     } catch (err) {
//       console.error("Failed to transmit order alert to Telegram channel:", err);
//     }
//   };

//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
//       setFormError('Required Fields Missing: Please input your Name, Phone Number, and Delivery Address.');
//       return;
//     }
//     setShowQrModal(true);
//   };

//   const handleFinalizePayment = async () => {
//     setShowQrModal(false);
//     const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
    
//     const invoiceData = {
//       id: uniqueInvoiceId,
//       customerName: customerName,
//       items: [...cart],
//       subtotal: subtotal,
//       shippingFee: shippingFee,
//       total: grandTotal,
//       phone: phoneNumber,
//       address: address,
//       carrier: deliveryMethod,
//       date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
//     };

//     // Commit to runtime view states
//     setInvoiceDetails(invoiceData);
//     setShowInvoiceModal(true);
    
//     // Append order to localized tracking logs (Bought History)
//     const updatedHistory = [invoiceData, ...orderHistory];
//     setOrderHistory(updatedHistory);
//     localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));

//     // Dispatch system alerts
//     await sendTelegramAlert(uniqueInvoiceId, cart, invoiceData);
    
//     // Reset inputs and shopping cart state
//     setCustomerName('');
//     setPhoneNumber('');
//     setAddress('');
//     setMapLocation('');
//     checkout();
//   };

//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}\nCarrier: ${invoiceDetails.carrier}\nCustomer: ${invoiceDetails.customerName}\nPhone: ${invoiceDetails.phone}`;
    
//     if (navigator.share) {
//       try {
//         await navigator.share({ title: 'PSP Mart Receipt', text: shareText, url: window.location.href });
//       } catch (err) { console.log(err); }
//     } else {
//       navigator.clipboard.writeText(shareText);
//       alert('Invoice metadata copied to clipboard!');
//     }
//   };

//   if (cart.length === 0 && !showInvoiceModal) {
//     return (
//       <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6">
//         <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//         <h2 className="text-base font-bold text-gray-900 mb-1">Your shopping cart is empty</h2>
//         <p className="text-gray-400 text-xs mb-6">Explore our live digital catalogs and add active products to initiate premium secure checkout workflows.</p>
//         <button 
//           onClick={() => setShowHistoryModal(true)}
//           className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
//         >
//           <History size={14} className="text-blue-600" /> View Purchase History ({orderHistory.length})
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:hidden font-sans px-4">
      
//       {/* COLUMN 1 & 2: Shopping Manifest & Address Information */}
//       <div className="lg:col-span-2 space-y-6">
        
//         {/* SHOPPING MANIFEST STREAM */}
//         <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//           <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//             <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//               <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//             </h2>
//             <button 
//               onClick={() => setShowHistoryModal(true)}
//               className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition"
//             >
//               <History size={13} /> View History ({orderHistory.length})
//             </button>
//           </div>

//           <div className="divide-y divide-gray-100">
//             {cart.map(item => (
//               <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                 <div className="flex items-center space-x-3.5">
//                   <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                   <div>
//                     <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                     <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                     <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                     <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                     <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                   </div>
//                   <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* LOGISTICS ROUTING ENTRY FORM */}
//         <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//           <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//             <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//           </h2>
          
//           {formError && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100">{formError}</div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
//               <input 
//                 type="text" 
//                 placeholder="e.g., Phy Sopheak"
//                 value={customerName}
//                 onChange={(e) => setCustomerName(e.target.value)}
//                 className="w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//               />
//             </div>

//             <div>
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Contact Phone Number *</label>
//               <div className="relative">
//                 <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                 <input 
//                   type="text" 
//                   placeholder="e.g., 012 345 678"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Drop-off Street Address *</label>
//               <div className="relative">
//                 <Home size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                 <input 
//                   type="text" 
//                   placeholder="Street No, House No, Sangkat, Khan, Province/City"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Google Maps Pin Location Link (Highly Recommended)</label>
//               <div className="relative">
//                 <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                 <input 
//                   type="url" 
//                   placeholder="https://maps.google.com/?q=..."
//                   value={mapLocation}
//                   onChange={(e) => setMapLocation(e.target.value)}
//                   className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* COLUMN 3: Logistics Selection & Pricing Computations */}
//       <div className="space-y-6">
        
//         {/* CARRIER OPTION SELECTOR */}
//         <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//           <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//             <Truck size={16} className="text-blue-700" /> Logistics Carrier
//           </h2>
//           <div className="space-y-2">
//             {deliveryServices.map((service) => {
//               const IconComponent = service.icon;
//               const isSelected = deliveryMethod === service.name;
//               return (
//                 <label 
//                   key={service.id} 
//                   onClick={() => handleDeliveryChange(service.name, service.rate)}
//                   className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
//                     isSelected 
//                       ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' 
//                       : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <IconComponent size={16} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
//                     <div>
//                       <span className="block font-bold">{service.name}</span>
//                       <span className="text-[10px] text-gray-400 font-normal">ETA: {service.eta}</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <span className="block font-black text-blue-600">${service.rate.toFixed(2)}</span>
//                     <input 
//                       type="radio" 
//                       name="deliveryMethod" 
//                       checked={isSelected}
//                       readOnly
//                       className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 mt-0.5"
//                     />
//                   </div>
//                 </label>
//               );
//             })}
//           </div>
//         </div>

//         {/* PRICING COMPUTATION AND BUTTON */}
//         <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//           <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//             <DollarSign size={16} className="text-blue-700" /> Premium Billing Order
//           </h2>
//           <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//             <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//             <div className="flex justify-between"><span>Logistics Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//             <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//               <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//               <span className="text-green-600 font-bold">Secured</span>
//             </div>
//           </div>
//           <div className="flex justify-between items-center pt-4 mb-5">
//             <span className="font-black text-gray-900 uppercase text-xs">Total Valuation</span>
//             <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//           </div>
          
//           <button 
//             onClick={handleProceedToPayment} 
//             className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs"
//           >
//             Authorize Payment via KHQR
//           </button>
//         </div>
//       </div>

//       {/* DYNAMIC QR DISPLAY MODAL */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border border-gray-100">
//             <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR Gateway</h3>
//             <p className="text-gray-400 text-[11px] mb-4">Complete settlement securely via mobile banking applications.</p>
            
//             <div className="bg-blue-50 border border-blue-100 rounded-xl py-2 px-5 mb-4 inline-block">
//               <span className="text-[10px] text-blue-600 block font-bold uppercase tracking-wider">Amount Due Total</span>
//               <span className="text-2xl font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//             </div>

//             <div className="bg-white border border-gray-200 p-3 rounded-2xl inline-block shadow-inner mb-4">
//               <img src={khqrImage} alt="Bakong KHQR" className="w-48 h-48 object-contain mx-auto rounded" />
//             </div>

//             <p className="text-[10px] text-gray-400 italic mb-5 px-3">
//               *Confirm payment logs only after transaction submission succeeds inside your personal banking portal.
//             </p>

//             <div className="flex gap-3 text-xs font-bold">
//               <button onClick={() => setShowQrModal(false)} className="w-1/2 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition">Cancel</button>
//               <button onClick={handleFinalizePayment} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md transition">I Have Transferred</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DYNAMIC INVOICE DISPLAY MODAL */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:bg-white print:absolute print:inset-0">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl print:shadow-none print:p-0 border border-gray-100">
            
//             <div id="invoice-print-area" className="text-xs text-gray-800 p-2">
//               <div className="text-center pb-4 border-b border-dashed border-gray-300">
//                 <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2 print:hidden" />
//                 <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
//                 <p className="text-gray-400 text-[10px] mt-0.5">High Quality Product Logistics Ecosystem</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2.5 py-4 border-b border-gray-100 text-[11px]">
//                 <div><span className="text-gray-400 block">Invoice ID</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Customer Name</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Contact Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
//                 <div><span className="text-gray-400 block">Logistics Partner</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Shipping Fee</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Delivery Destination Node</span><span className="font-medium text-gray-900 line-clamp-2">{invoiceDetails.address}</span></div>
//               </div>

//               <div className="py-4 space-y-2 border-b border-dashed border-gray-300">
//                 <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-1.5">Itemized Invoice Manifest</span>
//                 {invoiceDetails.items.map((item, idx) => (
//                   <div key={idx} className="flex justify-between items-center text-[11px]">
//                     <span className="font-medium text-gray-900">{item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span></span>
//                     <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                   </div>
//                 ))}
//               </div>

//               <div className="pt-4 flex justify-between items-center text-gray-900">
//                 <span className="text-xs font-black uppercase tracking-wider">Settled Amount Total</span>
//                 <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs print:hidden">
//               <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition shadow-sm">
//                 <Download size={14} /> Print Receipt
//               </button>
//               <button onClick={handleShareInvoice} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition shadow-md">
//                 <Share2 size={14} /> Share Invoice
//               </button>
//               <button onClick={() => setShowInvoiceModal(false)} className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50 transition">
//                 Close Active Manifest
//               </button>
//             </div>

//           </div>
//         </div>
//       )}

//       {/* NEW: HISTORICAL LOGS ARCHIVE MODAL (BOUGHT HISTORY) */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" /> Account Purchase History
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{orderHistory.length} Record(s)</span>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
//               {orderHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No historical purchase tracks found local to this storage instance.</div>
//               ) : (
//                 orderHistory.map((historyItem) => (
//                   <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl relative group hover:border-gray-300 transition">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <span className="font-black text-gray-900 block">Reference ID: #${historyItem.id}</span>
//                         <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {historyItem.date}</span>
//                       </div>
//                       <span className="font-black text-blue-700 text-sm">${historyItem.total.toFixed(2)}</span>
//                     </div>

//                     <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
//                       <div className="truncate"><span className="font-semibold text-gray-700">Carrier:</span> {historyItem.carrier}</div>
//                       <div className="truncate"><span className="font-semibold text-gray-700">Ship To:</span> {historyItem.customerName} ({historyItem.phone})</div>
//                     </div>

//                     <button 
//                       onClick={() => { setInvoiceDetails(historyItem); setShowInvoiceModal(true); }}
//                       className="mt-2.5 w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-1.5 rounded-lg text-[11px] shadow-sm transition"
//                     >
//                       Regenerate Invoice Screen
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <button onClick={() => setShowHistoryModal(false)} className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
//               Return to Checkout Layout
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }






























// import React, { useState, useContext, useEffect } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
//   Truck, Download, Share2, CheckCircle2, History, Receipt, 
//   Clock, DollarSign, ShieldCheck, User 
// } from 'lucide-react';

// export default function Cart() {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
  
//   // Active viewing state for historical invoice popups
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory, setOrderHistory] = useState([]);

//   // Delivery Form States
//   const [customerName, setCustomerName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [mapLocation, setMapLocation] = useState('');
//   const [deliveryMethod, setDeliveryMethod] = useState('Standard Home Delivery');
//   const [shippingFee, setShippingFee] = useState(1.00);
//   const [formError, setFormError] = useState('');

//   // Sync with LocalStorage database instance on mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       setOrderHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   const deliveryServices = [
//     { id: 'home', name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days', icon: Home },
//     { id: 'vireak', name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day', icon: Truck },
//     { id: 'foodpanda', name: 'FoodPanda Instant', rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
//     { id: 'wownow', name: 'WOW NOW Logistics', rate: 1.50, eta: 'Same Day', icon: Truck },
//     { id: 'egets', name: 'E-GetS Delivery', rate: 2.00, eta: '40 Mins', icon: Truck },
//   ];

//   const handleDeliveryChange = (serviceName, rate) => {
//     setDeliveryMethod(serviceName);
//     setShippingFee(rate);
//   };

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const grandTotal = subtotal + shippingFee;

//   // Optimized HTML Payload transmission structure for Telegram Bot Core
//   const sendTelegramAlert = async (invoiceData) => {
//     const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
//     const TELEGRAM_CHAT_ID = "6710148858";     

//     let itemDetails = invoiceData.items.map(item => `📦 <b>${item.name}</b> (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
//     const htmlMessage = `
// 🛍️ <b>💥 ORDER UPDATE - PSP MART 💥</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 <b>Invoice Reference:</b> <code>#${invoiceData.id}</code>
// 📅 <b>Timestamp:</b> ${invoiceData.date}
// 💵 <b>Grand Valuation Total:</b> <u>$${invoiceData.total.toFixed(2)}</u>
// <i>(Subtotal: $${invoiceData.subtotal.toFixed(2)} + Shipping: $${invoiceData.shippingFee.toFixed(2)})</i>

// 🚚 <b>Logistics Carrier:</b> ${invoiceData.carrier}

// 👤 <b>CUSTOMER PROFILE:</b>
// • <b>Name:</b> ${invoiceData.customerName}
// • <b>Phone:</b> <code>${invoiceData.phone}</code>
// • <b>Drop-off Address:</b> ${invoiceData.address}

// 🛒 <b>ITEMIZED MANIFEST:</b>
// ${itemDetails}

// 📍 <b>GEOLOCATION ROUTE:</b>
// ${invoiceData.mapLocation ? `<a href="${invoiceData.mapLocation}">👉 Click here to Open Map Route</a>` : '⚠️ No Google Maps Link Provided'}
// ━━━━━━━━━━━━━━━━━━━━━
// 🚀 <b>System Notification Status:</b> Ledger stream updated successfully. Verify transactions.
// `;

//     try {
//       await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: TELEGRAM_CHAT_ID,
//           text: htmlMessage,
//           parse_mode: 'HTML',
//           disable_web_page_preview: false
//         })
//       });
//     } catch (err) {
//       console.error("Telegram system pipeline failure:", err);
//     }
//   };

//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
//       setFormError('Required Fields Missing: Please input your Name, Phone Number, and Delivery Address.');
//       return;
//     }
//     setShowQrModal(true);
//   };

//   const handleFinalizePayment = async () => {
//     setShowQrModal(false);
    
//     const formattedDate = new Date().toLocaleDateString('en-US', { 
//       year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
//     });

//     // 🌟 មុខងាររកមើល និងច្របាច់បញ្ចូលគ្នា (MERGE LOGIC)
//     // ស្វែងរកមើលថាតើមានវិក្កយបត្រចាស់ណាដែលមានឈ្មោះ និងលេខទូរស័ព្ទដូចគ្នាដែរឬទេ?
//     const existingOrderIdx = orderHistory.findIndex(
//       order => order.customerName.toLowerCase().trim() === customerName.toLowerCase().trim() && 
//                order.phone.trim() === phoneNumber.trim()
//     );

//     let finalInvoiceData;

//     if (existingOrderIdx !== -1) {
//       // ប្រសិនបើរកឃើញទិន្នន័យចាស់ ត្រូវធ្វើការ Merge បញ្ចូលគ្នា
//       const oldOrder = orderHistory[existingOrderIdx];
//       const mergedItems = [...oldOrder.items];

//       cart.forEach(newItem => {
//         const matchItemIdx = mergedItems.findIndex(item => item.id === newItem.id);
//         if (matchItemIdx !== -1) {
//           mergedItems[matchItemIdx].quantity += newItem.quantity;
//         } else {
//           mergedItems.push({ ...newItem });
//         }
//       });

//       const newSubtotal = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
//       finalInvoiceData = {
//         ...oldOrder, // រក្សាទុក ID និងព័ត៌មានដឹកជញ្ជូនចាស់ដដែល
//         items: mergedItems,
//         subtotal: newSubtotal,
//         total: newSubtotal + oldOrder.shippingFee,
//         date: formattedDate // ធ្វើបច្ចុប្បន្នភាពម៉ោងទិញចុងក្រោយ
//       };

//       // ធ្វើបច្ចុប្បន្នភាពនៅក្នុង Array ប្រវត្តិទិញ
//       const updatedHistory = [...orderHistory];
//       updatedHistory.splice(existingOrderIdx, 1); // លុបចាស់ចេញ
//       updatedHistory.unshift(finalInvoiceData); // ដាក់ទិន្នន័យដែលបាន Merge រួចទៅខាងលើគេបង្អស់
      
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     } else {
//       // ប្រសិនបើជាអតិថិជនថ្មី បង្កើតវិក្កយបត្រថ្មីស្រឡាង (New Distinct Invoice)
//       const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
//       finalInvoiceData = {
//         id: uniqueInvoiceId,
//         customerName: customerName,
//         items: [...cart],
//         subtotal: subtotal,
//         shippingFee: shippingFee,
//         total: grandTotal,
//         phone: phoneNumber,
//         address: address,
//         mapLocation: mapLocation,
//         carrier: deliveryMethod,
//         date: formattedDate
//       };

//       const updatedHistory = [finalInvoiceData, ...orderHistory];
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     }

//     // បង្ហាញផ្ទាំងវិក្កយបត្រលម្អិតភ្លាមៗ
//     setInvoiceDetails(finalInvoiceData);
//     setShowInvoiceModal(true);
    
//     // បាញ់សារដំណឹងទៅកាន់ Telegram Bot
//     await sendTelegramAlert(finalInvoiceData);
    
//     // សម្អាតទិន្នន័យពី Form និងកន្ត្រកអីវ៉ាន់
//     setCustomerName('');
//     setPhoneNumber('');
//     setAddress('');
//     setMapLocation('');
//     checkout();
//   };

//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}\nCarrier: ${invoiceDetails.carrier}\nCustomer: ${invoiceDetails.customerName}`;
    
//     if (navigator.share) {
//       try {
//         await navigator.share({ title: 'PSP Mart Receipt', text: shareText, url: window.location.href });
//       } catch (err) { console.log(err); }
//     } else {
//       navigator.clipboard.writeText(shareText);
//       alert('Invoice metadata copied to clipboard!');
//     }
//   };

//   if (cart.length === 0 && !showInvoiceModal) {
//     return (
//       <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6">
//         <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//         <h2 className="text-base font-bold text-gray-900 mb-1">Your shopping cart is empty</h2>
//         <p className="text-gray-400 text-xs mb-6">Explore our live digital catalogs and add active products to initiate premium secure checkout workflows.</p>
//         <button 
//           onClick={() => setShowHistoryModal(true)}
//           className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
//         >
//           <History size={14} className="text-blue-600" /> View Purchase History ({orderHistory.length})
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:hidden font-sans px-4">
      
//       {/* COLUMN 1 & 2: Shopping Manifest */}
//       <div className="lg:col-span-2 space-y-6">
//         <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//           <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//             <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//               <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//             </h2>
//             <button 
//               onClick={() => setShowHistoryModal(true)}
//               className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition"
//             >
//               <History size={13} /> View History ({orderHistory.length})
//             </button>
//           </div>

//           <div className="divide-y divide-gray-100">
//             {cart.map(item => (
//               <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                 <div className="flex items-center space-x-3.5">
//                   <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                   <div>
//                     <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                     <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                     <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                     <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                     <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                   </div>
//                   <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* LOGISTICS FORM */}
//         <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//           <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//             <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//           </h2>
          
//           {formError && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100">{formError}</div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
//               <div className="relative">
//                 <User size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                 <input 
//                   type="text" 
//                   placeholder="e.g., Phy Sopheak"
//                   value={customerName}
//                   onChange={(e) => setCustomerName(e.target.value)}
//                   className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Contact Phone Number *</label>
//               <div className="relative">
//                 <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                 <input 
//                   type="text" 
//                   placeholder="e.g., 012 345 678"
//                   value={phoneNumber}
//                   onChange={(e) => setPhoneNumber(e.target.value)}
//                   className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Drop-off Street Address *</label>
//               <div className="relative">
//                 <Home size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                 <input 
//                   type="text" 
//                   placeholder="Street No, House No, Sangkat, Khan, Province/City"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//                 />
//               </div>
//             </div>

//             <div className="md:col-span-2">
//               <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Google Maps Pin Location Link (Optional)</label>
//               <div className="relative">
//                 <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                 <input 
//                   type="url" 
//                   placeholder="https://maps.google.com/..."
//                   value={mapLocation}
//                   onChange={(e) => setMapLocation(e.target.value)}
//                   className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* COLUMN 3: Pricing Summary */}
//       <div className="space-y-6">
//         <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//           <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//             <Truck size={16} className="text-blue-700" /> Logistics Carrier
//           </h2>
//           <div className="space-y-2">
//             {deliveryServices.map((service) => {
//               const IconComponent = service.icon;
//               const isSelected = deliveryMethod === service.name;
//               return (
//                 <label 
//                   key={service.id} 
//                   onClick={() => handleDeliveryChange(service.name, service.rate)}
//                   className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${
//                     isSelected ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
//                   }`}
//                 >
//                   <div className="flex items-center space-x-3">
//                     <IconComponent size={16} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
//                     <div>
//                       <span className="block font-bold">{service.name}</span>
//                       <span className="text-[10px] text-gray-400 font-normal">ETA: {service.eta}</span>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <span className="block font-black text-blue-600">${service.rate.toFixed(2)}</span>
//                     <input type="radio" name="deliveryMethod" checked={isSelected} readOnly className="h-3 w-3 text-blue-600 border-gray-300 mt-0.5" />
//                   </div>
//                 </label>
//               );
//             })}
//           </div>
//         </div>

//         <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//           <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//             <DollarSign size={16} className="text-blue-700" /> Premium Billing Order
//           </h2>
//           <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//             <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//             <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//             <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//               <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//               <span className="text-green-600 font-bold">Secured</span>
//             </div>
//           </div>
//           <div className="flex justify-between items-center pt-4 mb-5">
//             <span className="font-black text-gray-900 uppercase text-xs">Total Valuation</span>
//             <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//           </div>
//           <button onClick={handleProceedToPayment} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs">
//             Authorize Payment via KHQR
//           </button>
//         </div>
//       </div>

//       {/* KHQR MODAL */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
//             <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR Gateway</h3>
//             <div className="bg-blue-50 border border-blue-100 rounded-xl py-2 px-5 my-3 inline-block">
//               <span className="text-2xl font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//             </div>
//             <div className="bg-white border border-gray-200 p-3 rounded-2xl inline-block mb-4">
//               <img src={khqrImage} alt="KHQR" className="w-48 h-48 object-contain mx-auto" />
//             </div>
//             <div className="flex gap-3 text-xs font-bold">
//               <button onClick={() => setShowQrModal(false)} className="w-1/2 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50">Cancel</button>
//               <button onClick={handleFinalizePayment} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md">I Have Transferred</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🌟 DYNAMIC INVOICE MODAL (ប្រើទាំងពេលទិញភ្លាមៗ និងពេលបើកមើលពី History) */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:bg-white print:absolute print:inset-0">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
//             <div id="invoice-print-area" className="text-xs text-gray-800">
//               <div className="text-center pb-4 border-b border-dashed border-gray-300">
//                 <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2 print:hidden" />
//                 <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
//                 <p className="text-gray-400 text-[10px]">High Quality Product Logistics Ecosystem</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
//                 <div><span className="text-gray-400 block">Invoice ID</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Customer Name</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Contact Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
//                 <div><span className="text-gray-400 block">Logistics Partner</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Shipping Fee</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Delivery Destination</span><span className="font-medium text-gray-900 line-clamp-2">{invoiceDetails.address}</span></div>
//               </div>

//               {/* 🌟 SCROLLABLE MANIFEST FOR BIG SIZE BILLS: ទប់ស្កាត់ការបាក់ប្លង់នៅពេលអីវ៉ាន់ច្រើន */}
//               <div className="py-3 border-b border-dashed border-gray-300">
//                 <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Invoice Manifest</span>
//                 <div className="max-h-[180px] overflow-y-auto space-y-2.5 pr-1 scrollbar-thin">
//                   {invoiceDetails.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
//                       <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">x{item.quantity}</span></span>
//                       <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-center text-gray-900">
//                 <span className="text-xs font-black uppercase tracking-wider">Settled Amount Total</span>
//                 <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs print:hidden">
//               <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
//                 <Download size={14} /> Print Receipt
//               </button>
//               <button onClick={handleShareInvoice} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
//                 <Share2 size={14} /> Share Invoice
//               </button>
//               <button onClick={() => setShowInvoiceModal(false)} className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50">
//                 Close Active Manifest
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🌟 ACCOUNT PURCHASE HISTORY MODAL */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" /> Account Purchase History
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{orderHistory.length} Record(s)</span>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
//               {orderHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No historical purchase tracks found local to this storage instance.</div>
//               ) : (
//                 orderHistory.map((historyItem) => (
//                   <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-400 transition shadow-sm">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <span className="font-black text-gray-900 block">Reference ID: #${historyItem.id}</span>
//                         <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {historyItem.date}</span>
//                       </div>
//                       <span className="font-black text-blue-700 text-sm">${historyItem.total.toFixed(2)}</span>
//                     </div>

//                     <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
//                       <div><span className="font-semibold text-gray-700">Customer:</span> {historyItem.customerName} ({historyItem.phone})</div>
//                       <div className="text-[11px] text-slate-500 italic mt-1 font-semibold">Contains {historyItem.items.reduce((sum, i) => sum + i.quantity, 0)} total item(s)</div>
//                     </div>

//                     {/* 🌟 ពេលចុចប៊ូតុងនេះ វានឹងហៅទិន្នន័យចាស់មកបង្ហាញក្នុងលំដាប់ Invoice យ៉ាងលម្អិត */}
//                     <button 
//                       onClick={() => { setInvoiceDetails(historyItem); setShowInvoiceModal(true); }}
//                       className="mt-2.5 w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5"
//                     >
//                       <Receipt size={13} /> View Detailed Invoice
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <button onClick={() => setShowHistoryModal(false)} className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
//               Return to Checkout Layout
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }











































// import React, { useState, useContext, useEffect } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
//   Truck, Download, Share2, CheckCircle2, History, Receipt, 
//   Clock, DollarSign, ShieldCheck, User 
// } from 'lucide-react';

// export default function Cart() {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
  
//   // Active viewing state for historical invoice popups
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory, setOrderHistory] = useState([]);

//   // Delivery Form States
//   const [customerName, setCustomerName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [mapLocation, setMapLocation] = useState('');
//   const [deliveryMethod, setDeliveryMethod] = useState('Standard Home Delivery');
//   const [shippingFee, setShippingFee] = useState(1.00);
//   const [formError, setFormError] = useState('');

//   // Sync with LocalStorage database instance on mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       setOrderHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   const deliveryServices = [
//     { id: 'home', name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days', icon: Home },
//     { id: 'vireak', name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day', icon: Truck },
//     { id: 'foodpanda', name: 'FoodPanda Instant', rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
//     { id: 'wownow', name: 'WOW NOW Logistics', rate: 1.50, eta: 'Same Day', icon: Truck },
//     { id: 'egets', name: 'E-GetS Delivery', rate: 2.00, eta: '40 Mins', icon: Truck },
//   ];

//   const handleDeliveryChange = (serviceName, rate) => {
//     setDeliveryMethod(serviceName);
//     setShippingFee(rate);
//   };

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const grandTotal = subtotal + shippingFee;

//   // Optimized HTML Payload transmission structure for Telegram Bot Core
//   const sendTelegramAlert = async (invoiceData) => {
//     const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
//     const TELEGRAM_CHAT_ID = "6710148858";     

//     let itemDetails = invoiceData.items.map(item => `📦 <b>${item.name}</b> (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
//     const htmlMessage = `
// 🛍️ <b>💥 ORDER UPDATE - PSP MART 💥</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 <b>Invoice Reference:</b> <code>#${invoiceData.id}</code>
// 📅 <b>Timestamp:</b> ${invoiceData.date}
// 💵 <b>Grand Valuation Total:</b> <u>$${invoiceData.total.toFixed(2)}</u>
// <i>(Subtotal: $${invoiceData.subtotal.toFixed(2)} + Shipping: $${invoiceData.shippingFee.toFixed(2)})</i>

// 🚚 <b>Logistics Carrier:</b> ${invoiceData.carrier}

// 👤 <b>CUSTOMER PROFILE:</b>
// • <b>Name:</b> ${invoiceData.customerName}
// • <b>Phone:</b> <code>${invoiceData.phone}</code>
// • <b>Drop-off Address:</b> ${invoiceData.address}

// 🛒 <b>ITEMIZED MANIFEST:</b>
// ${itemDetails}

// 📍 <b>GEOLOCATION ROUTE:</b>
// ${invoiceData.mapLocation ? `<a href="${invoiceData.mapLocation}">👉 Click here to Open Map Route</a>` : '⚠️ No Google Maps Link Provided'}
// ━━━━━━━━━━━━━━━━━━━━━
// 🚀 <b>System Notification Status:</b> Ledger stream updated successfully. Verify transactions.
// `;

//     try {
//       await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: TELEGRAM_CHAT_ID,
//           text: htmlMessage,
//           parse_mode: 'HTML',
//           disable_web_page_preview: false
//         })
//       });
//     } catch (err) {
//       console.error("Telegram system pipeline failure:", err);
//     }
//   };

//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
//       setFormError('Required Fields Missing: Please input your Name, Phone Number, and Delivery Address.');
//       return;
//     }
//     setShowQrModal(true);
//   };

//   const handleFinalizePayment = async () => {
//     setShowQrModal(false);
    
//     const formattedDate = new Date().toLocaleDateString('en-US', { 
//       year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
//     });

//     // 🌟 MERGE LOGIC (ច្របាច់បញ្ចូលវិក្កយបត្រ)
//     const existingOrderIdx = orderHistory.findIndex(
//       order => order.customerName.toLowerCase().trim() === customerName.toLowerCase().trim() && 
//                order.phone.trim() === phoneNumber.trim()
//     );

//     let finalInvoiceData;

//     if (existingOrderIdx !== -1) {
//       const oldOrder = orderHistory[existingOrderIdx];
//       const mergedItems = [...oldOrder.items];

//       cart.forEach(newItem => {
//         const matchItemIdx = mergedItems.findIndex(item => item.id === newItem.id);
//         if (matchItemIdx !== -1) {
//           mergedItems[matchItemIdx].quantity += newItem.quantity;
//         } else {
//           mergedItems.push({ ...newItem });
//         }
//       });

//       const newSubtotal = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
//       finalInvoiceData = {
//         ...oldOrder,
//         items: mergedItems,
//         subtotal: newSubtotal,
//         total: newSubtotal + oldOrder.shippingFee,
//         date: formattedDate
//       };

//       const updatedHistory = [...orderHistory];
//       updatedHistory.splice(existingOrderIdx, 1);
//       updatedHistory.unshift(finalInvoiceData);
      
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     } else {
//       const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
//       finalInvoiceData = {
//         id: uniqueInvoiceId,
//         customerName: customerName,
//         items: [...cart],
//         subtotal: subtotal,
//         shippingFee: shippingFee,
//         total: grandTotal,
//         phone: phoneNumber,
//         address: address,
//         mapLocation: mapLocation,
//         carrier: deliveryMethod,
//         date: formattedDate
//       };

//       const updatedHistory = [finalInvoiceData, ...orderHistory];
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     }

//     setInvoiceDetails(finalInvoiceData);
//     setShowInvoiceModal(true);
    
//     await sendTelegramAlert(finalInvoiceData);
    
//     setCustomerName('');
//     setPhoneNumber('');
//     setAddress('');
//     setMapLocation('');
//     checkout();
//   };

//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}`;
//     if (navigator.share) {
//       try { await navigator.share({ title: 'PSP Mart Receipt', text: shareText, url: window.location.href }); } catch (err) {}
//     } else {
//       navigator.clipboard.writeText(shareText);
//       alert('Invoice copied to clipboard!');
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto font-sans px-4 print:hidden">
      
//       {/* 🌟 ប្លង់មេ៖ បង្ហាញទៅតាមស្ថានភាព Cart (មានអីវ៉ាន់ ឬ ទទេ) */}
//       {cart.length === 0 ? (
//         /* កន្លែងបង្ហាញពេល Cart ទទេ */
//         <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6">
//           <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-base font-bold text-gray-900 mb-1">Your shopping cart is empty</h2>
//           <p className="text-gray-400 text-xs mb-6">Explore our live digital catalogs and add active products to initiate premium secure checkout workflows.</p>
//           <button 
//             onClick={() => setShowHistoryModal(true)}
//             className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
//           >
//             <History size={14} className="text-blue-600" /> View Purchase History ({orderHistory.length})
//           </button>
//         </div>
//       ) : (
//         /* កន្លែងបង្ហាញពេល Cart មានអីវ៉ាន់សម្រាប់ធ្វើ Checkout */
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           {/* COLUMN 1 & 2: Shopping Manifest */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//               <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//                 <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//                   <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//                 </h2>
//                 <button 
//                   onClick={() => setShowHistoryModal(true)}
//                   className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition"
//                 >
//                   <History size={13} /> View History ({orderHistory.length})
//                 </button>
//               </div>

//               <div className="divide-y divide-gray-100">
//                 {cart.map(item => (
//                   <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                     <div className="flex items-center space-x-3.5">
//                       <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                       <div>
//                         <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                         <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                         <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                         <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                         <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                       </div>
//                       <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* LOGISTICS FORM */}
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//                 <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//               </h2>
//               {formError && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100">{formError}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
//                   <div className="relative">
//                     <User size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="e.g., Phy Sopheak" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Contact Phone Number *</label>
//                   <div className="relative">
//                     <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="e.g., 012 345 678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Drop-off Street Address *</label>
//                   <div className="relative">
//                     <Home size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="Street No, House No, Sangkat, Khan..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Google Maps Link (Optional)</label>
//                   <div className="relative">
//                     <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="url" placeholder="http://maps.google.com/..." value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* COLUMN 3: Pricing Summary */}
//           <div className="space-y-6">
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                 <Truck size={16} className="text-blue-700" /> Logistics Carrier
//               </h2>
//               <div className="space-y-2">
//                 {deliveryServices.map((service) => {
//                   const IconComponent = service.icon;
//                   const isSelected = deliveryMethod === service.name;
//                   return (
//                     <label key={service.id} onClick={() => handleDeliveryChange(service.name, service.rate)} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${isSelected ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
//                       <div className="flex items-center space-x-3">
//                         <IconComponent size={16} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
//                         <div>
//                           <span className="block font-bold">{service.name}</span>
//                           <span className="text-[10px] text-gray-400">ETA: {service.eta}</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <span className="block font-black text-blue-600">${service.rate.toFixed(2)}</span>
//                         <input type="radio" checked={isSelected} readOnly className="h-3 w-3 text-blue-600 mt-0.5" />
//                       </div>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                 <DollarSign size={16} className="text-blue-700" /> Premium Billing Order
//               </h2>
//               <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//                 <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//                 <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//                 <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//                   <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//                   <span className="text-green-600 font-bold">Secured</span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center pt-4 mb-5">
//                 <span className="font-black text-gray-900 uppercase text-xs">Total Valuation</span>
//                 <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//               </div>
//               <button onClick={handleProceedToPayment} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs">
//                 Authorize Payment via KHQR
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODALS CONTAINERS (ដាក់ក្រៅលក្ខខណ្ឌ Cart ដើម្បីឱ្យដំណើរការជានិច្ច) ================= */}

//       {/* KHQR MODAL */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
//             <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR Gateway</h3>
//             <div className="bg-blue-50 border border-blue-100 rounded-xl py-2 px-5 my-3 inline-block">
//               <span className="text-2xl font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//             </div>
//             <div className="bg-white border border-gray-200 p-3 rounded-2xl inline-block mb-4">
//               <img src={khqrImage} alt="KHQR" className="w-48 h-48 object-contain mx-auto" />
//             </div>
//             <div className="flex gap-3 text-xs font-bold">
//               <button onClick={() => setShowQrModal(false)} className="w-1/2 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50">Cancel</button>
//               <button onClick={handleFinalizePayment} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md">I Have Transferred</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DYNAMIC INVOICE MODAL */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
//             <div className="text-xs text-gray-800">
//               <div className="text-center pb-4 border-b border-dashed border-gray-300">
//                 <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
//                 <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
//                 <p className="text-gray-400 text-[10px]">High Quality Product Logistics Ecosystem</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
//                 <div><span className="text-gray-400 block">Invoice ID</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Customer Name</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Contact Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
//                 <div><span className="text-gray-400 block">Logistics Partner</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Shipping Fee</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Delivery Destination</span><span className="font-medium text-gray-900 line-clamp-2">{invoiceDetails.address}</span></div>
//               </div>

//               {/* SCROLLABLE MANIFEST FOR BIG SIZE BILLS */}
//               <div className="py-3 border-b border-dashed border-gray-300">
//                 <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Invoice Manifest</span>
//                 <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
//                   {invoiceDetails.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
//                       <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">x{item.quantity}</span></span>
//                       <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-center text-gray-900">
//                 <span className="text-xs font-black uppercase tracking-wider">Settled Amount Total</span>
//                 <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs">
//               <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
//                 <Download size={14} /> Print Receipt
//               </button>
//               <button onClick={handleShareInvoice} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
//                 <Share2 size={14} /> Share Invoice
//               </button>
//               <button onClick={() => setShowInvoiceModal(false)} className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50">
//                 Close Active Manifest
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ACCOUNT PURCHASE HISTORY MODAL */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" /> Account Purchase History
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{orderHistory.length} Record(s)</span>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
//               {orderHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No historical purchase tracks found local to this storage instance.</div>
//               ) : (
//                 orderHistory.map((historyItem) => (
//                   <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-400 transition shadow-sm">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <span className="font-black text-gray-900 block">Reference ID: #${historyItem.id}</span>
//                         <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {historyItem.date}</span>
//                       </div>
//                       <span className="font-black text-blue-700 text-sm">${historyItem.total.toFixed(2)}</span>
//                     </div>

//                     <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
//                       <div><span className="font-semibold text-gray-700">Customer:</span> {historyItem.customerName} ({historyItem.phone})</div>
//                       <div className="text-[11px] text-slate-500 italic mt-1 font-semibold">Contains {historyItem.items.reduce((sum, i) => sum + i.quantity, 0)} total item(s)</div>
//                     </div>

//                     <button 
//                       onClick={() => { setInvoiceDetails(historyItem); setShowInvoiceModal(true); }}
//                       className="mt-2.5 w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5"
//                     >
//                       <Receipt size={13} /> View Detailed Invoice
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <button onClick={() => setShowHistoryModal(false)} className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
//               Return to Checkout Layout
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }






















// import React, { useState, useContext, useEffect } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
//   Truck, Download, Share2, CheckCircle2, History, Receipt, 
//   Clock, DollarSign, ShieldCheck, User 
// } from 'lucide-react';

// export default function Cart() {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
  
//   // Active viewing state for historical invoice popups
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory, setOrderHistory] = useState([]);

//   // Delivery Form States
//   const [customerName, setCustomerName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [mapLocation, setMapLocation] = useState('');
//   const [deliveryMethod, setDeliveryMethod] = useState('Standard Home Delivery');
//   const [shippingFee, setShippingFee] = useState(1.00);
//   const [formError, setFormError] = useState('');

//   // Sync with LocalStorage database instance on mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       setOrderHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   const deliveryServices = [
//     { id: 'home', name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days', icon: Home },
//     { id: 'vireak', name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day', icon: Truck },
//     { id: 'foodpanda', name: 'FoodPanda Instant', rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
//     { id: 'wownow', name: 'WOW NOW Logistics', rate: 1.50, eta: 'Same Day', icon: Truck },
//     { id: 'egets', name: 'E-GetS Delivery', rate: 2.00, eta: '40 Mins', icon: Truck },
//   ];

//   const handleDeliveryChange = (serviceName, rate) => {
//     setDeliveryMethod(serviceName);
//     setShippingFee(rate);
//   };

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const grandTotal = subtotal + shippingFee;

//   // Optimized HTML Payload transmission structure for Telegram Bot Core
//   const sendTelegramAlert = async (invoiceData) => {
//     const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
//     const TELEGRAM_CHAT_ID = "6710148858";     

//     let itemDetails = invoiceData.items.map(item => `📦 <b>${item.name}</b> (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
//     const htmlMessage = `
// 🛍️ <b>💥 ORDER UPDATE - PSP MART 💥</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 <b>Invoice Reference:</b> <code>#${invoiceData.id}</code>
// 📅 <b>Timestamp:</b> ${invoiceData.date}
// 💵 <b>Grand Valuation Total:</b> <u>$${invoiceData.total.toFixed(2)}</u>
// <i>(Subtotal: $${invoiceData.subtotal.toFixed(2)} + Shipping: $${invoiceData.shippingFee.toFixed(2)})</i>

// 🚚 <b>Logistics Carrier:</b> ${invoiceData.carrier}

// 👤 <b>CUSTOMER PROFILE:</b>
// • <b>Name:</b> ${invoiceData.customerName}
// • <b>Phone:</b> <code>${invoiceData.phone}</code>
// • <b>Drop-off Address:</b> ${invoiceData.address}

// 🛒 <b>ITEMIZED MANIFEST:</b>
// ${itemDetails}

// 📍 <b>GEOLOCATION ROUTE:</b>
// ${invoiceData.mapLocation ? `<a href="${invoiceData.mapLocation}">👉 Click here to Open Map Route</a>` : '⚠️ No Google Maps Link Provided'}
// ━━━━━━━━━━━━━━━━━━━━━
// 🚀 <b>System Notification Status:</b> Ledger stream updated successfully. Verify transactions.
// `;

//     try {
//       await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: TELEGRAM_CHAT_ID,
//           text: htmlMessage,
//           parse_mode: 'HTML',
//           disable_web_page_preview: false
//         })
//       });
//     } catch (err) {
//       console.error("Telegram system pipeline failure:", err);
//     }
//   };

//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
//       setFormError('Required Fields Missing: Please input your Name, Phone Number, and Delivery Address.');
//       return;
//     }
//     setShowQrModal(true);
//   };

//   const handleFinalizePayment = async () => {
//     setShowQrModal(false);
    
//     const formattedDate = new Date().toLocaleDateString('en-US', { 
//       year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
//     });

//     // 🌟 MERGE LOGIC (ច្របាច់បញ្ចូលវិក្កយបត្រ)
//     const existingOrderIdx = orderHistory.findIndex(
//       order => order.customerName.toLowerCase().trim() === customerName.toLowerCase().trim() && 
//                order.phone.trim() === phoneNumber.trim()
//     );

//     let finalInvoiceData;

//     if (existingOrderIdx !== -1) {
//       const oldOrder = orderHistory[existingOrderIdx];
//       const mergedItems = [...oldOrder.items];

//       cart.forEach(newItem => {
//         const matchItemIdx = mergedItems.findIndex(item => item.id === newItem.id);
//         if (matchItemIdx !== -1) {
//           mergedItems[matchItemIdx].quantity += newItem.quantity;
//         } else {
//           mergedItems.push({ ...newItem });
//         }
//       });

//       const newSubtotal = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
//       finalInvoiceData = {
//         ...oldOrder,
//         items: mergedItems,
//         subtotal: newSubtotal,
//         total: newSubtotal + oldOrder.shippingFee,
//         date: formattedDate
//       };

//       const updatedHistory = [...orderHistory];
//       updatedHistory.splice(existingOrderIdx, 1);
//       updatedHistory.unshift(finalInvoiceData);
      
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     } else {
//       const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
//       finalInvoiceData = {
//         id: uniqueInvoiceId,
//         customerName: customerName,
//         items: [...cart],
//         subtotal: subtotal,
//         shippingFee: shippingFee,
//         total: grandTotal,
//         phone: phoneNumber,
//         address: address,
//         mapLocation: mapLocation,
//         carrier: deliveryMethod,
//         date: formattedDate
//       };

//       const updatedHistory = [finalInvoiceData, ...orderHistory];
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     }

//     setInvoiceDetails(finalInvoiceData);
//     setShowInvoiceModal(true);
    
//     await sendTelegramAlert(finalInvoiceData);
    
//     setCustomerName('');
//     setPhoneNumber('');
//     setAddress('');
//     setMapLocation('');
//     checkout();
//   };

//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}`;
//     if (navigator.share) {
//       try { await navigator.share({ title: 'PSP Mart Receipt', text: shareText, url: window.location.href }); } catch (err) {}
//     } else {
//       navigator.clipboard.writeText(shareText);
//       alert('Invoice copied to clipboard!');
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto font-sans px-4 print:hidden">
      
//       {/* 🌟 ប្លង់មេ៖ បង្ហាញទៅតាមស្ថានភាព Cart (មានអីវ៉ាន់ ឬ ទទេ) */}
//       {cart.length === 0 ? (
//         /* កន្លែងបង្ហាញពេល Cart ទទេ */
//         <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6">
//           <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-base font-bold text-gray-900 mb-1">Your shopping cart is empty</h2>
//           <p className="text-gray-400 text-xs mb-6">Explore our live digital catalogs and add active products to initiate premium secure checkout workflows.</p>
//           <button 
//             onClick={() => setShowHistoryModal(true)}
//             className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
//           >
//             <History size={14} className="text-blue-600" /> View Purchase History ({orderHistory.length})
//           </button>
//         </div>
//       ) : (
//         /* កន្លែងបង្ហាញពេល Cart មានអីវ៉ាន់សម្រាប់ធ្វើ Checkout */
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           {/* COLUMN 1 & 2: Shopping Manifest */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//               <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//                 <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//                   <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//                 </h2>
//                 <button 
//                   onClick={() => setShowHistoryModal(true)}
//                   className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition"
//                 >
//                   <History size={13} /> View History ({orderHistory.length})
//                 </button>
//               </div>

//               <div className="divide-y divide-gray-100">
//                 {cart.map(item => (
//                   <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                     <div className="flex items-center space-x-3.5">
//                       <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                       <div>
//                         <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                         <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                         <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                         <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                         <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                       </div>
//                       <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* LOGISTICS FORM */}
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//                 <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//               </h2>
//               {formError && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100">{formError}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
//                   <div className="relative">
//                     <User size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="e.g., Phy Sopheak" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Contact Phone Number *</label>
//                   <div className="relative">
//                     <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="e.g., 012 345 678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Drop-off Street Address *</label>
//                   <div className="relative">
//                     <Home size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="Street No, House No, Sangkat, Khan..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Google Maps Link (Optional)</label>
//                   <div className="relative">
//                     <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="url" placeholder="http://maps.google.com/..." value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* COLUMN 3: Pricing Summary */}
//           <div className="space-y-6">
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                 <Truck size={16} className="text-blue-700" /> Logistics Carrier
//               </h2>
//               <div className="space-y-2">
//                 {deliveryServices.map((service) => {
//                   const IconComponent = service.icon;
//                   const isSelected = deliveryMethod === service.name;
//                   return (
//                     <label key={service.id} onClick={() => handleDeliveryChange(service.name, service.rate)} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${isSelected ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
//                       <div className="flex items-center space-x-3">
//                         <IconComponent size={16} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
//                         <div>
//                           <span className="block font-bold">{service.name}</span>
//                           <span className="text-[10px] text-gray-400">ETA: {service.eta}</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <span className="block font-black text-blue-600">${service.rate.toFixed(2)}</span>
//                         <input type="radio" checked={isSelected} readOnly className="h-3 w-3 text-blue-600 mt-0.5" />
//                       </div>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                 <DollarSign size={16} className="text-blue-700" /> Premium Billing Order
//               </h2>
//               <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//                 <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//                 <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//                 <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//                   <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//                   <span className="text-green-600 font-bold">Secured</span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center pt-4 mb-5">
//                 <span className="font-black text-gray-900 uppercase text-xs">Total Valuation</span>
//                 <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//               </div>
//               <button onClick={handleProceedToPayment} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs">
//                 Authorize Payment via KHQR
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODALS CONTAINERS (ដាក់ក្រៅលក្ខខណ្ឌ Cart ដើម្បីឱ្យដំណើរការជានិច្ច) ================= */}

//       {/* KHQR MODAL */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
//             <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR Gateway</h3>
//             <div className="bg-blue-50 border border-blue-100 rounded-xl py-2 px-5 my-3 inline-block">
//               <span className="text-2xl font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//             </div>
//             <div className="bg-white border border-gray-200 p-3 rounded-2xl inline-block mb-4">
//               <img src={khqrImage} alt="KHQR" className="w-48 h-48 object-contain mx-auto" />
//             </div>
//             <div className="flex gap-3 text-xs font-bold">
//               <button onClick={() => setShowQrModal(false)} className="w-1/2 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50">Cancel</button>
//               <button onClick={handleFinalizePayment} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md">I Have Transferred</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DYNAMIC INVOICE MODAL */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
//             <div className="text-xs text-gray-800">
//               <div className="text-center pb-4 border-b border-dashed border-gray-300">
//                 <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
//                 <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
//                 <p className="text-gray-400 text-[10px]">High Quality Product Logistics Ecosystem</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
//                 <div><span className="text-gray-400 block">Invoice ID</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Customer Name</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Contact Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
//                 <div><span className="text-gray-400 block">Logistics Partner</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Shipping Fee</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Delivery Destination</span><span className="font-medium text-gray-900 line-clamp-2">{invoiceDetails.address}</span></div>
//               </div>

//               {/* SCROLLABLE MANIFEST FOR BIG SIZE BILLS */}
//               <div className="py-3 border-b border-dashed border-gray-300">
//                 <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Invoice Manifest</span>
//                 <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
//                   {invoiceDetails.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
//                       <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">x{item.quantity}</span></span>
//                       <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-center text-gray-900">
//                 <span className="text-xs font-black uppercase tracking-wider">Settled Amount Total</span>
//                 <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs">
//               <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
//                 <Download size={14} /> Print Receipt
//               </button>
//               <button onClick={handleShareInvoice} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
//                 <Share2 size={14} /> Share Invoice
//               </button>
//               <button onClick={() => setShowInvoiceModal(false)} className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50">
//                 Close Active Manifest
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ACCOUNT PURCHASE HISTORY MODAL */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" /> Account Purchase History
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{orderHistory.length} Record(s)</span>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
//               {orderHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No historical purchase tracks found local to this storage instance.</div>
//               ) : (
//                 orderHistory.map((historyItem) => (
//                   <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-400 transition shadow-sm">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <span className="font-black text-gray-900 block">Reference ID: #${historyItem.id}</span>
//                         <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {historyItem.date}</span>
//                       </div>
//                       <span className="font-black text-blue-700 text-sm">${historyItem.total.toFixed(2)}</span>
//                     </div>

//                     <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
//                       <div><span className="font-semibold text-gray-700">Customer:</span> {historyItem.customerName} ({historyItem.phone})</div>
//                       <div className="text-[11px] text-slate-500 italic mt-1 font-semibold">Contains {historyItem.items.reduce((sum, i) => sum + i.quantity, 0)} total item(s)</div>
//                     </div>

//                     <button 
//                       onClick={() => { setInvoiceDetails(historyItem); setShowInvoiceModal(true); }}
//                       className="mt-2.5 w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5"
//                     >
//                       <Receipt size={13} /> View Detailed Invoice
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <button onClick={() => setShowHistoryModal(false)} className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
//               Return to Checkout Layout
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }

















// import React, { useState, useContext, useEffect } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
//   Truck, Download, Share2, CheckCircle2, History, Receipt, 
//   Clock, DollarSign, ShieldCheck, User 
// } from 'lucide-react';

// export default function Cart() {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
  
//   // Active viewing state for historical invoice popups
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory, setOrderHistory] = useState([]);

//   // Delivery Form States
//   const [customerName, setCustomerName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [mapLocation, setMapLocation] = useState('');
//   const [deliveryMethod, setDeliveryMethod] = useState('Standard Home Delivery');
//   const [shippingFee, setShippingFee] = useState(1.00);
//   const [formError, setFormError] = useState('');

//   // Sync with LocalStorage database instance on mount
//   useEffect(() => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       setOrderHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   const deliveryServices = [
//     { id: 'home', name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days', icon: Home },
//     { id: 'vireak', name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day', icon: Truck },
//     { id: 'foodpanda', name: 'FoodPanda Instant', rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
//     { id: 'wownow', name: 'WOW NOW Logistics', rate: 1.50, eta: 'Same Day', icon: Truck },
//     { id: 'egets', name: 'E-GetS Delivery', rate: 2.00, eta: '40 Mins', icon: Truck },
//   ];

//   const handleDeliveryChange = (serviceName, rate) => {
//     setDeliveryMethod(serviceName);
//     setShippingFee(rate);
//   };

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const grandTotal = subtotal + shippingFee;

//   // Optimized HTML Payload transmission structure for Telegram Bot Core
//   const sendTelegramAlert = async (invoiceData) => {
//     const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
//     const TELEGRAM_CHAT_ID = "6710148858";     

//     let itemDetails = invoiceData.items.map(item => `📦 <b>${item.name}</b> (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
//     const htmlMessage = `
// 🛍️ <b>💥 ORDER UPDATE - PSP MART 💥</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 <b>Invoice Reference:</b> <code>#${invoiceData.id}</code>
// 📅 <b>Timestamp:</b> ${invoiceData.date}
// 💵 <b>Grand Valuation Total:</b> <u>$${invoiceData.total.toFixed(2)}</u>
// <i>(Subtotal: $${invoiceData.subtotal.toFixed(2)} + Shipping: $${invoiceData.shippingFee.toFixed(2)})</i>

// 🚚 <b>Logistics Carrier:</b> ${invoiceData.carrier}

// 👤 <b>CUSTOMER PROFILE:</b>
// • <b>Name:</b> ${invoiceData.customerName}
// • <b>Phone:</b> <code>${invoiceData.phone}</code>
// • <b>Drop-off Address:</b> ${invoiceData.address}

// 🛒 <b>ITEMIZED MANIFEST:</b>
// ${itemDetails}

// 📍 <b>GEOLOCATION ROUTE:</b>
// ${invoiceData.mapLocation ? `<a href="${invoiceData.mapLocation}">👉 Click here to Open Map Route</a>` : '⚠️ No Google Maps Link Provided'}
// ━━━━━━━━━━━━━━━━━━━━━
// 🚀 <b>System Notification Status:</b> Ledger stream updated successfully. Verify transactions.
// `;

//     try {
//       await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           chat_id: TELEGRAM_CHAT_ID,
//           text: htmlMessage,
//           parse_mode: 'HTML',
//           disable_web_page_preview: false
//         })
//       });
//     } catch (err) {
//       console.error("Telegram system pipeline failure:", err);
//     }
//   };

//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
//       setFormError('Required Fields Missing: Please input your Name, Phone Number, and Delivery Address.');
//       return;
//     }
//     setShowQrModal(true);
//   };

//   const handleFinalizePayment = async () => {
//     setShowQrModal(false);
    
//     const formattedDate = new Date().toLocaleDateString('en-US', { 
//       year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
//     });

//     // 🌟 MERGE LOGIC (ច្របាច់បញ្ចូលវិក្កយបត្រ)
//     const existingOrderIdx = orderHistory.findIndex(
//       order => order.customerName.toLowerCase().trim() === customerName.toLowerCase().trim() && 
//                order.phone.trim() === phoneNumber.trim()
//     );

//     let finalInvoiceData;

//     if (existingOrderIdx !== -1) {
//       const oldOrder = orderHistory[existingOrderIdx];
//       const mergedItems = [...oldOrder.items];

//       cart.forEach(newItem => {
//         const matchItemIdx = mergedItems.findIndex(item => item.id === newItem.id);
//         if (matchItemIdx !== -1) {
//           mergedItems[matchItemIdx].quantity += newItem.quantity;
//         } else {
//           mergedItems.push({ ...newItem });
//         }
//       });

//       const newSubtotal = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
//       finalInvoiceData = {
//         ...oldOrder,
//         items: mergedItems,
//         subtotal: newSubtotal,
//         total: newSubtotal + oldOrder.shippingFee,
//         date: formattedDate
//       };

//       const updatedHistory = [...orderHistory];
//       updatedHistory.splice(existingOrderIdx, 1);
//       updatedHistory.unshift(finalInvoiceData);
      
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     } else {
//       const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
//       finalInvoiceData = {
//         id: uniqueInvoiceId,
//         customerName: customerName,
//         items: [...cart],
//         subtotal: subtotal,
//         shippingFee: shippingFee,
//         total: grandTotal,
//         phone: phoneNumber,
//         address: address,
//         mapLocation: mapLocation,
//         carrier: deliveryMethod,
//         date: formattedDate
//       };

//       const updatedHistory = [finalInvoiceData, ...orderHistory];
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     }

//     setInvoiceDetails(finalInvoiceData);
//     setShowInvoiceModal(true);
    
//     await sendTelegramAlert(finalInvoiceData);
    
//     setCustomerName('');
//     setPhoneNumber('');
//     setAddress('');
//     setMapLocation('');
//     checkout();
//   };

//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}`;
//     if (navigator.share) {
//       try { await navigator.share({ title: 'PSP Mart Receipt', text: shareText, url: window.location.href }); } catch (err) {}
//     } else {
//       navigator.clipboard.writeText(shareText);
//       alert('Invoice copied to clipboard!');
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto font-sans px-4 print:hidden">
      
//       {/* ប្លង់មេ៖ បង្ហាញទៅតាមស្ថានភាព Cart (មានអីវ៉ាន់ ឬ ទទេ) */}
//       {cart.length === 0 ? (
//         <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6">
//           <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-base font-bold text-gray-900 mb-1">Your shopping cart is empty</h2>
//           <p className="text-gray-400 text-xs mb-6">Explore our live digital catalogs and add active products to initiate premium secure checkout workflows.</p>
//           <button 
//             onClick={() => setShowHistoryModal(true)}
//             className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
//           >
//             <History size={14} className="text-blue-600" /> View Purchase History ({orderHistory.length})
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           {/* COLUMN 1 & 2: Shopping Manifest */}
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//               <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//                 <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//                   <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//                 </h2>
//                 <button 
//                   onClick={() => setShowHistoryModal(true)}
//                   className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition"
//                 >
//                   <History size={13} /> View History ({orderHistory.length})
//                 </button>
//               </div>

//               <div className="divide-y divide-gray-100">
//                 {cart.map(item => (
//                   <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                     <div className="flex items-center space-x-3.5">
//                       <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                       <div>
//                         <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                         <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                         <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                         <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                         <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                       </div>
//                       <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* LOGISTICS FORM */}
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//                 <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//               </h2>
//               {formError && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100">{formError}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
//                   <div className="relative">
//                     <User size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="e.g., Phy Sopheak" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Contact Phone Number *</label>
//                   <div className="relative">
//                     <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="e.g., 012 345 678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Drop-off Street Address *</label>
//                   <div className="relative">
//                     <Home size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="Street No, House No, Sangkat, Khan..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Google Maps Link (Optional)</label>
//                   <div className="relative">
//                     <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="url" placeholder="http://maps.google.com/..." value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* COLUMN 3: Pricing Summary */}
//           <div className="space-y-6">
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                 <Truck size={16} className="text-blue-700" /> Logistics Carrier
//               </h2>
//               <div className="space-y-2">
//                 {deliveryServices.map((service) => {
//                   const IconComponent = service.icon;
//                   const isSelected = deliveryMethod === service.name;
//                   return (
//                     <label key={service.id} onClick={() => handleDeliveryChange(service.name, service.rate)} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${isSelected ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
//                       <div className="flex items-center space-x-3">
//                         <IconComponent size={16} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
//                         <div>
//                           <span className="block font-bold">{service.name}</span>
//                           <span className="text-[10px] text-gray-400">ETA: {service.eta}</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <span className="block font-black text-blue-600">${service.rate.toFixed(2)}</span>
//                         <input type="radio" checked={isSelected} readOnly className="h-3 w-3 text-blue-600 mt-0.5" />
//                       </div>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                 <DollarSign size={16} className="text-blue-700" /> Premium Billing Order
//               </h2>
//               <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//                 <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//                 <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//                 <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//                   <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//                   <span className="text-green-600 font-bold">Secured</span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center pt-4 mb-5">
//                 <span className="font-black text-gray-900 uppercase text-xs">Total Valuation</span>
//                 <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//               </div>
//               <button onClick={handleProceedToPayment} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs">
//                 Authorize Payment via KHQR
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ================= MODALS CONTAINERS ================= */}

//       {/* KHQR MODAL */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
//             <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR Gateway</h3>
//             <div className="bg-blue-50 border border-blue-100 rounded-xl py-2 px-5 my-3 inline-block">
//               <span className="text-2xl font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//             </div>
//             <div className="bg-white border border-gray-200 p-3 rounded-2xl inline-block mb-4">
//               <img src={khqrImage} alt="KHQR" className="w-48 h-48 object-contain mx-auto" />
//             </div>
//             <div className="flex gap-3 text-xs font-bold">
//               <button onClick={() => setShowQrModal(false)} className="w-1/2 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50">Cancel</button>
//               <button onClick={handleFinalizePayment} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md">I Have Transferred</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* 🌟 DYNAMIC INVOICE MODAL (ដំឡើងទៅ Z-[60] ដើម្បីឱ្យហោះមកលើបង្អស់) */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in zoom-in-95 duration-150">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
//             <div className="text-xs text-gray-800">
//               <div className="text-center pb-4 border-b border-dashed border-gray-300">
//                 <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
//                 <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
//                 <p className="text-gray-400 text-[10px]">High Quality Product Logistics Ecosystem</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
//                 <div><span className="text-gray-400 block">Invoice ID</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Customer Name</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Contact Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
//                 <div><span className="text-gray-400 block">Logistics Partner</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Shipping Fee</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Delivery Destination</span><span className="font-medium text-gray-900 line-clamp-2">{invoiceDetails.address}</span></div>
//               </div>

//               {/* SCROLLABLE MANIFEST FOR BIG SIZE BILLS */}
//               <div className="py-3 border-b border-dashed border-gray-300">
//                 <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Invoice Manifest</span>
//                 <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
//                   {invoiceDetails.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
//                       <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">x{item.quantity}</span></span>
//                       <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-center text-gray-900">
//                 <span className="text-xs font-black uppercase tracking-wider">Settled Amount Total</span>
//                 <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs">
//               <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
//                 <Download size={14} /> Print Receipt
//               </button>
//               <button onClick={handleShareInvoice} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
//                 <Share2 size={14} /> Share Invoice
//               </button>
              
//               {/* 🌟 ពេលចុចបិទផ្ទាំង Invoice វានឹងរលាយបាត់ទៅវិញ ដោយបន្សល់ទុកផ្ទាំង History ដដែល */}
//               <button 
//                 onClick={() => setShowInvoiceModal(false)} 
//                 className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50"
//               >
//                 Close Invoice Detail
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ACCOUNT PURCHASE HISTORY MODAL (កម្រិតជាន់ Z-50 ដដែល) */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" /> Account Purchase History
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{orderHistory.length} Record(s)</span>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
//               {orderHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No historical purchase tracks found local to this storage instance.</div>
//               ) : (
//                 orderHistory.map((historyItem) => (
//                   <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-400 transition shadow-sm">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <span className="font-black text-gray-900 block">Reference ID: #${historyItem.id}</span>
//                         <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {historyItem.date}</span>
//                       </div>
//                       <span className="font-black text-blue-700 text-sm">${historyItem.total.toFixed(2)}</span>
//                     </div>

//                     <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
//                       <div><span className="font-semibold text-gray-700">Customer:</span> {historyItem.customerName} ({historyItem.phone})</div>
//                       <div className="text-[11px] text-slate-500 italic mt-1 font-semibold">Contains {historyItem.items.reduce((sum, i) => sum + i.quantity, 0)} total item(s)</div>
//                     </div>

//                     {/* 🌟 រក្សាទុកផ្ទាំង History ឱ្យបើកដដែល (setShowHistoryModal(true)) ប៉ុន្តែបើក Invoice រុញទៅមុខគេ */}
//                     <button 
//                       onClick={() => { 
//                         setInvoiceDetails(historyItem); 
//                         setShowInvoiceModal(true); 
//                       }}
//                       className="mt-2.5 w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5"
//                     >
//                       <Receipt size={13} /> View Detailed Invoice
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <button onClick={() => setShowHistoryModal(false)} className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
//               Return to Checkout Layout
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
























// import React, { useState, useContext, useEffect } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
//   Truck, Download, Share2, CheckCircle2, History, Receipt, 
//   Clock, DollarSign, ShieldCheck, User 
// } from 'lucide-react';

// // 🌟 ទទួលយក userEmail និង userRole ជា Props ពី App.jsx
// export default function Cart({ userEmail, userRole }) {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
  
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory, setOrderHistory] = useState([]);

//   // Delivery Form States
//   const [customerName, setCustomerName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [mapLocation, setMapLocation] = useState('');
//   const [deliveryMethod, setDeliveryMethod] = useState('Standard Home Delivery');
//   const [shippingFee, setShippingFee] = useState(1.00);
//   const [formError, setFormError] = useState('');

//   useEffect(() => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       setOrderHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // 🌟 គណនានិងចម្រាញ់ទិន្នន័យ (Filter Order History)
//   // បើជា Admin គឺបង្ហាញទាំងអស់ បើជា User ធម្មតាបង្ហាញតែ Order ណាដែលត្រូវនឹង Email របស់ខ្លួន
//   const filteredHistory = orderHistory.filter(order => {
//     if (userRole === 'admin') return true; // Admin ឃើញទាំងអស់
//     return order.accountEmail === userEmail; // User ឃើញតែរបស់ខ្លួន
//   });

//   const deliveryServices = [
//     { id: 'home', name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days', icon: Home },
//     { id: 'vireak', name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day', icon: Truck },
//     { id: 'foodpanda', name: 'FoodPanda Instant', rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
//     { id: 'wownow', name: 'WOW NOW Logistics', rate: 1.50, eta: 'Same Day', icon: Truck },
//     { id: 'egets', name: 'E-GetS Delivery', rate: 2.00, eta: '40 Mins', icon: Truck },
//   ];

//   const handleDeliveryChange = (serviceName, rate) => {
//     setDeliveryMethod(serviceName);
//     setShippingFee(rate);
//   };

//   const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   const grandTotal = subtotal + shippingFee;

//   const sendTelegramAlert = async (invoiceData) => {
//     const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
//     const TELEGRAM_CHAT_ID = "6710148858";     

//     let itemDetails = invoiceData.items.map(item => `📦 <b>${item.name}</b> (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
//     const htmlMessage = `
// 🛍️ <b>💥 ORDER UPDATE - PSP MART 💥</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 <b>Invoice Reference:</b> <code>#${invoiceData.id}</code>
// 📅 <b>Timestamp:</b> ${invoiceData.date}
// 💵 <b>Grand Valuation Total:</b> <u>$${invoiceData.total.toFixed(2)}</u>
// <i>(Subtotal: $${invoiceData.subtotal.toFixed(2)} + Shipping: $${invoiceData.shippingFee.toFixed(2)})</i>

// 🚚 <b>Logistics Carrier:</b> ${invoiceData.carrier}

// 👤 <b>CUSTOMER PROFILE:</b>
// • <b>Account Email:</b> ${invoiceData.accountEmail}
// • <b>Name:</b> ${invoiceData.customerName}
// • <b>Phone:</b> <code>${invoiceData.phone}</code>
// • <b>Drop-off Address:</b> ${invoiceData.address}

// 🛒 <b>ITEMIZED MANIFEST:</b>
// ${itemDetails}

// 📍 <b>GEOLOCATION ROUTE:</b>
// ${invoiceData.mapLocation ? `<a href="${invoiceData.mapLocation}">👉 Click here to Open Map Route</a>` : '⚠️ No Google Maps Link Provided'}
// ━━━━━━━━━━━━━━━━━━━━━
// 🚀 <b>System Notification Status:</b> Ledger stream updated successfully. Verify transactions.
// `;

//     try {
//       await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: htmlMessage, parse_mode: 'HTML' })
//       });
//     } catch (err) {
//       console.error("Telegram system pipeline failure:", err);
//     }
//   };

//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
//       setFormError('Required Fields Missing: Please input your Name, Phone Number, and Delivery Address.');
//       return;
//     }
//     setShowQrModal(true);
//   };

//   const handleFinalizePayment = async () => {
//     setShowQrModal(false);
    
//     const formattedDate = new Date().toLocaleDateString('en-US', { 
//       year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
//     });

//     // ច្របាច់បញ្ចូលវិក្កយបត្រដោយផ្អែកលើ ឈ្មោះ លេខទូរស័ព្ទ និង Email ដែលបាន Login
//     const existingOrderIdx = orderHistory.findIndex(
//       order => order.customerName.toLowerCase().trim() === customerName.toLowerCase().trim() && 
//                order.phone.trim() === phoneNumber.trim() &&
//                order.accountEmail === userEmail
//     );

//     let finalInvoiceData;

//     if (existingOrderIdx !== -1) {
//       const oldOrder = orderHistory[existingOrderIdx];
//       const mergedItems = [...oldOrder.items];

//       cart.forEach(newItem => {
//         const matchItemIdx = mergedItems.findIndex(item => item.id === newItem.id);
//         if (matchItemIdx !== -1) {
//           mergedItems[matchItemIdx].quantity += newItem.quantity;
//         } else {
//           mergedItems.push({ ...newItem });
//         }
//       });

//       const newSubtotal = mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
//       finalInvoiceData = {
//         ...oldOrder,
//         items: mergedItems,
//         subtotal: newSubtotal,
//         total: newSubtotal + oldOrder.shippingFee,
//         date: formattedDate
//       };

//       const updatedHistory = [...orderHistory];
//       updatedHistory.splice(existingOrderIdx, 1);
//       updatedHistory.unshift(finalInvoiceData);
      
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     } else {
//       const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
//       finalInvoiceData = {
//         id: uniqueInvoiceId,
//         accountEmail: userEmail, // 🌟 រក្សាទុក Email ម្ចាស់ទិញចូលទៅក្នុងវិក្កយបត្រ
//         customerName: customerName,
//         items: [...cart],
//         subtotal: subtotal,
//         shippingFee: shippingFee,
//         total: grandTotal,
//         phone: phoneNumber,
//         address: address,
//         mapLocation: mapLocation,
//         carrier: deliveryMethod,
//         date: formattedDate
//       };

//       const updatedHistory = [finalInvoiceData, ...orderHistory];
//       setOrderHistory(updatedHistory);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
//     }

//     setInvoiceDetails(finalInvoiceData);
//     setShowInvoiceModal(true);
    
//     await sendTelegramAlert(finalInvoiceData);
    
//     setCustomerName('');
//     setPhoneNumber('');
//     setAddress('');
//     setMapLocation('');
//     checkout();
//   };

//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}`;
//     if (navigator.share) {
//       try { await navigator.share({ title: 'PSP Mart Receipt', text: shareText, url: window.location.href }); } catch (err) {}
//     } else {
//       navigator.clipboard.writeText(shareText);
//       alert('Invoice copied to clipboard!');
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto font-sans px-4 print:hidden">
      
//       {cart.length === 0 ? (
//         <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 text-xs">
//           <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//           <h2 className="text-base font-bold text-gray-900 mb-1">Your shopping cart is empty</h2>
//           <p className="text-gray-400 mb-6">Explore our live digital catalogs and add active products to initiate premium secure checkout workflows.</p>
//           <button 
//             onClick={() => setShowHistoryModal(true)}
//             className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
//           >
//             {/* 🌟 បង្ហាញចំនួនទិន្នន័យទៅតាម Role */}
//             <History size={14} className="text-blue-600" /> 
//             {userRole === 'admin' ? `View Total Sales History (${filteredHistory.length})` : `Your Purchase History (${filteredHistory.length})`}
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//           <div className="lg:col-span-2 space-y-6">
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//               <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//                 <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//                   <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//                 </h2>
//                 <button 
//                   onClick={() => setShowHistoryModal(true)}
//                   className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition"
//                 >
//                   <History size={13} /> {userRole === 'admin' ? 'Total Sales' : 'My History'} ({filteredHistory.length})
//                 </button>
//               </div>

//               <div className="divide-y divide-gray-100">
//                 {cart.map(item => (
//                   <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                     <div className="flex items-center space-x-3.5">
//                       <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                       <div>
//                         <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                         <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                       </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                       <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                         <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                         <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                         <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                       </div>
//                       <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* LOGISTICS FORM */}
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//                 <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//               </h2>
//               {formError && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100">{formError}</div>}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
//                   <div className="relative">
//                     <User size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="e.g., Phy Sopheak" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Contact Phone Number *</label>
//                   <div className="relative">
//                     <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="e.g., 012 345 678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Drop-off Street Address *</label>
//                   <div className="relative">
//                     <Home size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="text" placeholder="Street No, House No, Sangkat, Khan..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//                 <div className="md:col-span-2">
//                   <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Google Maps Link (Optional)</label>
//                   <div className="relative">
//                     <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                     <input type="url" placeholder="http://maps.google.com/..." value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* COLUMN 3 */}
//           <div className="space-y-6">
//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                 <Truck size={16} className="text-blue-700" /> Logistics Carrier
//               </h2>
//               <div className="space-y-2">
//                 {deliveryServices.map((service) => {
//                   const IconComponent = service.icon;
//                   const isSelected = deliveryMethod === service.name;
//                   return (
//                     <label key={service.id} onClick={() => handleDeliveryChange(service.name, service.rate)} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${isSelected ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
//                       <div className="flex items-center space-x-3">
//                         <IconComponent size={16} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
//                         <div>
//                           <span className="block font-bold">{service.name}</span>
//                           <span className="text-[10px] text-gray-400">ETA: {service.eta}</span>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <span className="block font-black text-blue-600">${service.rate.toFixed(2)}</span>
//                         <input type="radio" checked={isSelected} readOnly className="h-3 w-3 text-blue-600 mt-0.5" />
//                       </div>
//                     </label>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//               <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                 <DollarSign size={16} className="text-blue-700" /> Premium Billing Order
//               </h2>
//               <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//                 <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//                 <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//                 <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//                   <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//                   <span className="text-green-600 font-bold">Secured</span>
//                 </div>
//               </div>
//               <div className="flex justify-between items-center pt-4 mb-5">
//                 <span className="font-black text-gray-900 uppercase text-xs">Total Valuation</span>
//                 <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//               </div>
//               <button onClick={handleProceedToPayment} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs">
//                 Authorize Payment via KHQR
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* KHQR MODAL */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
//             <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR Gateway</h3>
//             <div className="bg-blue-50 border border-blue-100 rounded-xl py-2 px-5 my-3 inline-block">
//               <span className="text-2xl font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//             </div>
//             <div className="bg-white border border-gray-200 p-3 rounded-2xl inline-block mb-4">
//               <img src={khqrImage} alt="KHQR" className="w-48 h-48 object-contain mx-auto" />
//             </div>
//             <div className="flex gap-3 text-xs font-bold">
//               <button onClick={() => setShowQrModal(false)} className="w-1/2 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50">Cancel</button>
//               <button onClick={handleFinalizePayment} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md">I Have Transferred</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* DYNAMIC INVOICE MODAL */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in zoom-in-95 duration-150">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
//             <div className="text-xs text-gray-800">
//               <div className="text-center pb-4 border-b border-dashed border-gray-300">
//                 <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
//                 <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
//                 <p className="text-gray-400 text-[10px]">High Quality Product Logistics Ecosystem</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
//                 <div><span className="text-gray-400 block">Invoice ID</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Customer Name</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Contact Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
//                 <div><span className="text-gray-400 block">Logistics Partner</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Shipping Fee</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Buyer Account</span><span className="font-medium text-blue-600">{invoiceDetails.accountEmail}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Delivery Destination</span><span className="font-medium text-gray-900 line-clamp-2">{invoiceDetails.address}</span></div>
//               </div>

//               <div className="py-3 border-b border-dashed border-gray-300">
//                 <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Invoice Manifest</span>
//                 <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
//                   {invoiceDetails.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
//                       <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">x{item.quantity}</span></span>
//                       <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-center text-gray-900">
//                 <span className="text-xs font-black uppercase tracking-wider">Settled Amount Total</span>
//                 <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs">
//               <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
//                 <Download size={14} /> Print Receipt
//               </button>
//               <button onClick={handleShareInvoice} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
//                 <Share2 size={14} /> Share Invoice
//               </button>
//               <button onClick={() => setShowInvoiceModal(false)} className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50">
//                 Close Invoice Detail
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ACCOUNT PURCHASE HISTORY MODAL */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" /> 
//                 {userRole === 'admin' ? 'Total Sales Manifest (Admin)' : 'My Purchase History'}
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{filteredHistory.length} Record(s)</span>
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
//               {filteredHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No historical purchase tracks found local to this account context.</div>
//               ) : (
//                 // 🌟 ផ្លាស់ប្តូរមកប្រើ filteredHistory ជំនួសឱ្យ orderHistory ធម្មតា
//                 filteredHistory.map((historyItem) => (
//                   <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-400 transition shadow-sm">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <span className="font-black text-gray-900 block">Reference ID: #${historyItem.id}</span>
//                         <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {historyItem.date}</span>
//                       </div>
//                       <span className="font-black text-blue-700 text-sm">${historyItem.total.toFixed(2)}</span>
//                     </div>

//                     <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
//                       {userRole === 'admin' && (
//                         <div className="text-red-600 font-bold"><span className="text-gray-700 font-semibold">Account Email:</span> {historyItem.accountEmail}</div>
//                       )}
//                       <div><span className="font-semibold text-gray-700">Customer:</span> {historyItem.customerName} ({historyItem.phone})</div>
//                       <div className="text-[11px] text-slate-500 italic mt-1 font-semibold">Contains {historyItem.items.reduce((sum, i) => sum + i.quantity, 0)} total item(s)</div>
//                     </div>

//                     <button 
//                       onClick={() => { 
//                         setInvoiceDetails(historyItem); 
//                         setShowInvoiceModal(true); 
//                       }}
//                       className="mt-2.5 w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5"
//                     >
//                       <Receipt size={13} /> View Detailed Invoice
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>

//             <button onClick={() => setShowHistoryModal(false)} className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
//               Return to Checkout Layout
//             </button>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }































import React, { useState, useContext, useEffect, useRef } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { 
  Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
  Truck, Download, Share2, CheckCircle2, History, Receipt, 
  Clock, DollarSign, ShieldCheck, User 
} from 'lucide-react';

const BACKEND_URL = 'https://backend-psp-market.onrender.com';

export default function Cart({ userEmail, userRole }) {
  const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Standard Home Delivery');
  const [shippingFee, setShippingFee] = useState(1.00);
  const [formError, setFormError] = useState('');

  const [paymentSessionId, setPaymentSessionId] = useState(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('psp_market_order_history');
    if (savedHistory) setOrderHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const filteredHistory = orderHistory.filter(order => {
    if (userRole === 'admin') return true;
    return order.accountEmail === userEmail;
  });

  const deliveryServices = [
    { id: 'home',     name: 'Standard Home Delivery',  rate: 1.00, eta: '1-2 Days',   icon: Home },
    { id: 'vireak',   name: 'Vireak Buntham Express',  rate: 1.75, eta: 'Next Day',    icon: Truck },
    { id: 'foodpanda',name: 'FoodPanda Instant',        rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
    { id: 'wownow',   name: 'WOW NOW Logistics',        rate: 1.50, eta: 'Same Day',   icon: Truck },
    { id: 'egets',    name: 'E-GetS Delivery',          rate: 2.00, eta: '40 Mins',    icon: Truck },
  ];

  const handleDeliveryChange = (serviceName, rate) => {
    setDeliveryMethod(serviceName);
    setShippingFee(rate);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = subtotal + shippingFee;

  // ============================================================
  // 🌟 SEND TELEGRAM — Two messages:
  //    1. Full order details
  //    2. A real inline button to confirm payment with one tap
  // ============================================================
  const sendTelegramAlert = async (invoiceData) => {
    const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg";
    const TELEGRAM_CHAT_ID   = "6710148858";
    const CONFIRM_SECRET     = "pspmart2024"; // must match your .env CONFIRM_SECRET

    const itemDetails = invoiceData.items
      .map(item => `📦 <b>${item.name}</b> (x${item.quantity}) — $${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    // ── Message 1: full order info ──
    const orderMessage = `
🛍️ <b>💥 NEW ORDER — PSP MART 💥</b>
━━━━━━━━━━━━━━━━━━━━━
🆔 <b>Invoice:</b> <code>#${invoiceData.id}</code>
📅 <b>Time:</b> ${invoiceData.date}
💵 <b>Total:</b> <u>$${invoiceData.total.toFixed(2)}</u>
<i>(Subtotal: $${invoiceData.subtotal.toFixed(2)} + Shipping: $${invoiceData.shippingFee.toFixed(2)})</i>

🚚 <b>Carrier:</b> ${invoiceData.carrier}

👤 <b>CUSTOMER:</b>
• <b>Email:</b> ${invoiceData.accountEmail}
• <b>Name:</b> ${invoiceData.customerName}
• <b>Phone:</b> <code>${invoiceData.phone}</code>
• <b>Address:</b> ${invoiceData.address}

🛒 <b>ITEMS:</b>
${itemDetails}

📍 <b>MAP:</b>
${invoiceData.mapLocation ? `<a href="${invoiceData.mapLocation}">👉 Open Map Route</a>` : '⚠️ No map link provided'}
━━━━━━━━━━━━━━━━━━━━━`;

    // ── Message 2: tap-to-confirm button ──
    const confirmUrl = `${BACKEND_URL}/api/payments/confirm-link?sessionId=${invoiceData.sessionId}&secret=${CONFIRM_SECRET}`;

    try {
      // Send order details
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: orderMessage,
          parse_mode: 'HTML'
        })
      });

      // Send confirm button as a separate message
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `💳 <b>${invoiceData.customerName}</b> paid <b>$${invoiceData.total.toFixed(2)}</b>\nTap below once money is received in your QR bank account:`,
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: [[
              {
                text: '✅ CONFIRM PAYMENT RECEIVED',
                url: confirmUrl
              }
            ]]
          }
        })
      });
    } catch (err) {
      console.error("Telegram alert failed:", err);
    }
  };

  // ============================================================
  // 🌟 PROCEED TO PAYMENT — creates session + starts polling
  // ============================================================
  const handleProceedToPayment = async () => {
    setFormError('');
    if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
      setFormError('Required Fields Missing: Please input your Name, Phone Number, and Delivery Address.');
      return;
    }

    const sessionId = `pay_${Date.now()}_${Math.floor(Math.random() * 9000 + 1000)}`;
    setPaymentSessionId(sessionId);

    try {
      await fetch(`${BACKEND_URL}/api/payments/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, amount: grandTotal, customerName })
      });
    } catch (err) {
      console.error('Failed to create payment session:', err);
    }

    setShowQrModal(true);

    // Poll every 3 seconds — auto-fires when you tap confirm in Telegram
    pollingRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`${BACKEND_URL}/api/payments/status/${sessionId}`);
        const data = await res.json();
        if (data.status === 'paid') {
          clearInterval(pollingRef.current);
          setShowQrModal(false);
          await handleFinalizePayment(sessionId); // ✅ AUTO TRIGGER
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
  };

  const handleCancelQr = () => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    setPaymentSessionId(null);
    setShowQrModal(false);
  };

  // ============================================================
  // 🌟 FINALIZE PAYMENT — called automatically when paid
  // ============================================================
  const handleFinalizePayment = async (sessionId = paymentSessionId) => {
    setShowQrModal(false);

    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const existingOrderIdx = orderHistory.findIndex(
      order =>
        order.customerName.toLowerCase().trim() === customerName.toLowerCase().trim() &&
        order.phone.trim() === phoneNumber.trim() &&
        order.accountEmail === userEmail
    );

    let finalInvoiceData;

    if (existingOrderIdx !== -1) {
      const oldOrder    = orderHistory[existingOrderIdx];
      const mergedItems = [...oldOrder.items];

      cart.forEach(newItem => {
        const idx = mergedItems.findIndex(i => i.id === newItem.id);
        if (idx !== -1) mergedItems[idx].quantity += newItem.quantity;
        else mergedItems.push({ ...newItem });
      });

      const newSubtotal = mergedItems.reduce((s, i) => s + i.price * i.quantity, 0);

      finalInvoiceData = {
        ...oldOrder,
        sessionId,
        items: mergedItems,
        subtotal: newSubtotal,
        total: newSubtotal + oldOrder.shippingFee,
        date: formattedDate
      };

      const updatedHistory = [...orderHistory];
      updatedHistory.splice(existingOrderIdx, 1);
      updatedHistory.unshift(finalInvoiceData);
      setOrderHistory(updatedHistory);
      localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));

    } else {
      const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
      finalInvoiceData = {
        id: uniqueInvoiceId,
        sessionId,
        accountEmail: userEmail,
        customerName,
        items: [...cart],
        subtotal,
        shippingFee,
        total: grandTotal,
        phone: phoneNumber,
        address,
        mapLocation,
        carrier: deliveryMethod,
        date: formattedDate
      };

      const updatedHistory = [finalInvoiceData, ...orderHistory];
      setOrderHistory(updatedHistory);
      localStorage.setItem('psp_market_order_history', JSON.stringify(updatedHistory));
    }

    setInvoiceDetails(finalInvoiceData);
    setShowInvoiceModal(true);
    await sendTelegramAlert(finalInvoiceData);

    setCustomerName('');
    setPhoneNumber('');
    setAddress('');
    setMapLocation('');
    setPaymentSessionId(null);
    checkout();
  };

  const handleShareInvoice = async () => {
    if (!invoiceDetails) return;
    const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}`;
    if (navigator.share) {
      try { await navigator.share({ title: 'PSP Mart Receipt', text: shareText, url: window.location.href }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Invoice copied to clipboard!');
    }
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="max-w-6xl mx-auto font-sans px-4 print:hidden">

      {cart.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 text-xs">
          <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-base font-bold text-gray-900 mb-1">Your shopping cart is empty</h2>
          <p className="text-gray-400 mb-6">Explore our live digital catalogs and add active products to initiate premium secure checkout workflows.</p>
          <button
            onClick={() => setShowHistoryModal(true)}
            className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
          >
            <History size={14} className="text-blue-600" />
            {userRole === 'admin'
              ? `View Total Sales History (${filteredHistory.length})`
              : `Your Purchase History (${filteredHistory.length})`}
          </button>
        </div>

      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">

            {/* Cart Items */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
                </h2>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition"
                >
                  <History size={13} /> {userRole === 'admin' ? 'Total Sales' : 'My History'} ({filteredHistory.length})
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

            {/* Delivery Form */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
              <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
              </h2>
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100">{formError}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input type="text" placeholder="e.g., Phy Sopheak" value={customerName} onChange={e => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Contact Phone Number *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input type="text" placeholder="e.g., 012 345 678" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Drop-off Street Address *</label>
                  <div className="relative">
                    <Home size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input type="text" placeholder="Street No, House No, Sangkat, Khan..." value={address} onChange={e => setAddress(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Google Maps Link (Optional)</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
                    <input type="url" placeholder="http://maps.google.com/..." value={mapLocation} onChange={e => setMapLocation(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Carrier */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
              <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <Truck size={16} className="text-blue-700" /> Logistics Carrier
              </h2>
              <div className="space-y-2">
                {deliveryServices.map(service => {
                  const Icon = service.icon;
                  const selected = deliveryMethod === service.name;
                  return (
                    <label key={service.id} onClick={() => handleDeliveryChange(service.name, service.rate)}
                      className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${selected ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
                      <div className="flex items-center space-x-3">
                        <Icon size={16} className={selected ? 'text-blue-600' : 'text-gray-400'} />
                        <div>
                          <span className="block font-bold">{service.name}</span>
                          <span className="text-[10px] text-gray-400">ETA: {service.eta}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block font-black text-blue-600">${service.rate.toFixed(2)}</span>
                        <input type="radio" checked={selected} readOnly className="h-3 w-3 text-blue-600 mt-0.5" />
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Billing */}
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
              <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-blue-700" /> Premium Billing Order
              </h2>
              <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
                <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
                <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
                  <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
                  <span className="text-green-600 font-bold">Secured</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 mb-5">
                <span className="font-black text-gray-900 uppercase text-xs">Total Valuation</span>
                <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
              </div>
              <button onClick={handleProceedToPayment}
                className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs">
                Authorize Payment via KHQR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          🌟 KHQR MODAL — Pulse animation, auto-detects payment
          ============================================================ */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR Gateway</h3>
            <div className="bg-blue-50 border border-blue-100 rounded-xl py-2 px-5 my-3 inline-block">
              <span className="text-2xl font-black text-blue-700">${grandTotal.toFixed(2)}</span>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-2xl inline-block mb-3">
              <img src={khqrImage} alt="KHQR" className="w-48 h-48 object-contain mx-auto" />
            </div>

            {/* Pulse waiting banner */}
            <div className="flex items-center justify-center gap-2 text-xs text-blue-700 font-bold bg-blue-50 border border-blue-100 py-2.5 px-4 rounded-xl mb-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse inline-block"></span>
              Waiting for payment… will confirm automatically
            </div>

            <p className="text-[10px] text-gray-400 mb-4">
              Once you transfer the exact amount, your order will be confirmed instantly.
            </p>

            <button onClick={handleCancelQr}
              className="w-full border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 text-xs font-bold transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && invoiceDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="text-xs text-gray-800">
              <div className="text-center pb-4 border-b border-dashed border-gray-300">
                <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
                <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
                <p className="text-gray-400 text-[10px]">High Quality Product Logistics Ecosystem</p>
              </div>
              <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
                <div><span className="text-gray-400 block">Invoice ID</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
                <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
                <div><span className="text-gray-400 block">Customer Name</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
                <div className="text-right"><span className="text-gray-400 block">Contact Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
                <div><span className="text-gray-400 block">Logistics Partner</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
                <div className="text-right"><span className="text-gray-400 block">Shipping Fee</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
                <div className="col-span-2"><span className="text-gray-400 block">Buyer Account</span><span className="font-medium text-blue-600">{invoiceDetails.accountEmail}</span></div>
                <div className="col-span-2"><span className="text-gray-400 block">Delivery Destination</span><span className="font-medium text-gray-900 line-clamp-2">{invoiceDetails.address}</span></div>
              </div>
              <div className="py-3 border-b border-dashed border-gray-300">
                <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Invoice Manifest</span>
                <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                  {invoiceDetails.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
                      <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">x{item.quantity}</span></span>
                      <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center text-gray-900">
                <span className="text-xs font-black uppercase tracking-wider">Settled Amount Total</span>
                <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs">
              <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
                <Download size={14} /> Print Receipt
              </button>
              <button onClick={handleShareInvoice} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
                <Share2 size={14} /> Share Invoice
              </button>
              <button onClick={() => setShowInvoiceModal(false)} className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50">
                Close Invoice Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
                <Receipt size={18} className="text-blue-700" />
                {userRole === 'admin' ? 'Total Sales Manifest (Admin)' : 'My Purchase History'}
              </h3>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{filteredHistory.length} Record(s)</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400 italic">No historical purchase tracks found local to this account context.</div>
              ) : (
                filteredHistory.map(historyItem => (
                  <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-400 transition shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-black text-gray-900 block">Reference ID: #{historyItem.id}</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {historyItem.date}</span>
                      </div>
                      <span className="font-black text-blue-700 text-sm">${historyItem.total.toFixed(2)}</span>
                    </div>
                    <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
                      {userRole === 'admin' && (
                        <div className="text-red-600 font-bold"><span className="text-gray-700 font-semibold">Account Email:</span> {historyItem.accountEmail}</div>
                      )}
                      <div><span className="font-semibold text-gray-700">Customer:</span> {historyItem.customerName} ({historyItem.phone})</div>
                      <div className="text-[11px] text-slate-500 italic mt-1 font-semibold">
                        Contains {historyItem.items.reduce((sum, i) => sum + i.quantity, 0)} total item(s)
                      </div>
                    </div>
                    <button
                      onClick={() => { setInvoiceDetails(historyItem); setShowInvoiceModal(true); }}
                      className="mt-2.5 w-full bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5"
                    >
                      <Receipt size={13} /> View Detailed Invoice
                    </button>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setShowHistoryModal(false)}
              className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
              Return to Checkout Layout
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
