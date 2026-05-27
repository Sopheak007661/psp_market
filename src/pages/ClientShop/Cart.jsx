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

//   // 1. Initial Load of Ledger Data
//   const loadHistoryData = () => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       setOrderHistory(JSON.parse(savedHistory));
//     } else {
//       setOrderHistory([]);
//     }
//   };

//   useEffect(() => {
//     loadHistoryData();

//     // Catch real-time changes if modified within other components simultaneously 
//     const internalFallbackInterval = setInterval(() => {
//       loadHistoryData();
//     }, 1500);

//     return () => clearInterval(internalFallbackInterval);
//   }, []);

//   // 🌟 គណនានិងចម្រាញ់ទិន្នន័យ (Filter Order History)
//   // បើជា Admin គឺបង្ហាញទាំងអស់ បើជា User ធម្មតាបង្ហាញតែ Order ណាដែលត្រូវនឹង Email របស់ខ្លួន
//   const filteredHistory = orderHistory.filter(order => {
//     if (userRole === 'admin') return true; // Admin ឃើញទាំងអស់
//     return order.accountEmail === userEmail; // User ឃើញតែរបស់ខ្លួន
//   });

//   // 🌟 Administrative Data Purge Routine 
//   const handleDeleteHistoryItem = (orderId) => {
//     // Check permissions
//     if (userRole !== 'admin') {
//       alert("Access Denied: You do not possess the required security privileges to purge tracking logs.");
//       return;
//     }

//     const confirmPurge = window.confirm(`Are you absolutely sure you want to permanently delete Order Record #${orderId}? This action completely modifies the system history arrays.`);
    
//     if (confirmPurge) {
//       // Filter out the selected order block from the master history database array
//       const updatedMasterLedger = orderHistory.filter(order => order.id !== orderId);
      
//       // Save changes back down to the application local data storage environment state
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedMasterLedger));
      
//       // Update state locally
//       setOrderHistory(updatedMasterLedger);
//     }
//   };

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
//         accountEmail: userEmail,
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
//         <div id="invoice" className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-in fade-in zoom-in-95 duration-150">
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
//               <button onClick={() =>window.print()} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
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
//                 filteredHistory.map((historyItem) => (
//                   <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-400 transition shadow-sm relative group">
                    
//                     <div className="flex justify-between items-start mb-2 pr-8">
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

//                     <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
//                       <button 
//                         onClick={() => { 
//                           setInvoiceDetails(historyItem); 
//                           setShowInvoiceModal(true); 
//                         }}
//                         className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5"
//                       >
//                         <Receipt size={13} /> View Detailed Invoice
//                       </button>

//                       {/* 🌟 ADMIN ONLY: DELETE BUTTON REMOVES HISTORY ITEM PERMANENTLY */}
//                       {userRole === 'admin' && (
//                         <button
//                           onClick={() => handleDeleteHistoryItem(historyItem.id)}
//                           className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold p-2 rounded-xl text-[11px] transition flex items-center justify-center gap-1 sm:flex-none"
//                           title="Purge Record From Global History"
//                         >
//                           <Trash2 size={14} />
//                           <span className="sm:hidden">Delete Record</span>
//                         </button>
//                       )}
//                     </div>

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
//   Clock, DollarSign, ShieldCheck, User, Search
// } from 'lucide-react';

// // 🌟 ទទួលយក userEmail និង userRole ជា Props ពី App.jsx
// export default function Cart({ userEmail, userRole }) {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
//   const [showQrModal, setShowQrModal] = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);
  
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory, setOrderHistory] = useState([]);
  
//   // 🌟 Search Engine State
//   const [searchQuery, setSearchQuery] = useState('');

//   // Delivery Form States
//   const [customerName, setCustomerName] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [mapLocation, setMapLocation] = useState('');
//   const [deliveryMethod, setDeliveryMethod] = useState('Standard Home Delivery');
//   const [shippingFee, setShippingFee] = useState(1.00);
//   const [formError, setFormError] = useState('');

//   // 1. Initial Load of Ledger Data
//   const loadHistoryData = () => {
//     const savedHistory = localStorage.getItem('psp_market_order_history');
//     if (savedHistory) {
//       setOrderHistory(JSON.parse(savedHistory));
//     } else {
//       setOrderHistory([]);
//     }
//   };

//   useEffect(() => {
//     loadHistoryData();

//     // Catch real-time changes if modified within other components simultaneously 
//     const internalFallbackInterval = setInterval(() => {
//       loadHistoryData();
//     }, 1500);

//     return () => clearInterval(internalFallbackInterval);
//   }, []);

//   // 🌟 គណនានិងចម្រាញ់ទិន្នន័យ (Filter Order History by Permissions)
//   const allowedHistory = orderHistory.filter(order => {
//     if (userRole === 'admin') return true; // Admin ឃើញទាំងអស់
//     return order.accountEmail === userEmail; // User ឃើញតែរបស់ខ្លួន
//   });

//   // 🌟 Real-time Search Engine logic (Filters by ID, Name, or Phone Number)
//   const filteredHistory = allowedHistory.filter(order => {
//     const query = searchQuery.toLowerCase().trim();
//     if (!query) return true;
//     return (
//       order.id.toString().includes(query) ||
//       order.customerName.toLowerCase().includes(query) ||
//       order.phone.includes(query)
//     );
//   });

//   // 🌟 Administrative Data Purge Routine 
//   const handleDeleteHistoryItem = (orderId) => {
//     if (userRole !== 'admin') {
//       alert("Access Denied: You do not possess the required security privileges to purge tracking logs.");
//       return;
//     }

//     const confirmPurge = window.confirm(`Are you absolutely sure you want to permanently delete Order Record #${orderId}? This action completely modifies the system history arrays.`);
    
//     if (confirmPurge) {
//       const updatedMasterLedger = orderHistory.filter(order => order.id !== orderId);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updatedMasterLedger));
//       setOrderHistory(updatedMasterLedger);
//     }
//   };

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
//         accountEmail: userEmail,
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
//     <div className="max-w-6xl mx-auto font-sans px-4">
      
//       {/* SCREEN UI VIEW (HIDDEN DURING PRINTING) */}
//       <div className="print:hidden">
//         {cart.length === 0 ? (
//           <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 text-xs">
//             <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//             <h2 className="text-base font-bold text-gray-900 mb-1">Your shopping cart is empty</h2>
//             <p className="text-gray-400 mb-6">Explore our live digital catalogs and add active products to initiate premium secure checkout workflows.</p>
//             <button 
//               onClick={() => setShowHistoryModal(true)}
//               className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm"
//             >
//               <History size={14} className="text-blue-600" /> 
//               {userRole === 'admin' ? `View Total Sales History (${allowedHistory.length})` : `Your Purchase History (${allowedHistory.length})`}
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
//             <div className="lg:col-span-2 space-y-6">
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//                 <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//                   <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//                     <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//                   </h2>
//                   <button 
//                     type="button"
//                     onClick={() => setShowHistoryModal(true)}
//                     className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition"
//                   >
//                     <History size={13} /> {userRole === 'admin' ? 'Total Sales' : 'My History'} ({allowedHistory.length})
//                   </button>
//                 </div>

//                 <div className="divide-y divide-gray-100">
//                   {cart.map(item => (
//                     <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                       <div className="flex items-center space-x-3.5">
//                         <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                         <div>
//                           <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                           <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                           <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                           <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                           <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                         </div>
//                         <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* LOGISTICS FORM */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//                   <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//                 </h2>
//                 {formError && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100">{formError}</div>}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Recipient Full Name *</label>
//                     <div className="relative">
//                       <User size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                       <input type="text" placeholder="e.g., Phy Sopheak" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Contact Phone Number *</label>
//                     <div className="relative">
//                       <Phone size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                       <input type="text" placeholder="e.g., 012 345 678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                     </div>
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Drop-off Street Address *</label>
//                     <div className="relative">
//                       <Home size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                       <input type="text" placeholder="Street No, House No, Sangkat, Khan..." value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                     </div>
//                   </div>
//                   <div className="md:col-span-2">
//                     <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">Google Maps Link (Optional)</label>
//                     <div className="relative">
//                       <MapPin size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                       <input type="url" placeholder="http://maps.google.com/..." value={mapLocation} onChange={(e) => setMapLocation(e.target.value)} className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* COLUMN 3 */}
//             <div className="space-y-6">
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                   <Truck size={16} className="text-blue-700" /> Logistics Carrier
//                 </h2>
//                 <div className="space-y-2">
//                   {deliveryServices.map((service) => {
//                     const IconComponent = service.icon;
//                     const isSelected = deliveryMethod === service.name;
//                     return (
//                       <label key={service.id} onClick={() => handleDeliveryChange(service.name, service.rate)} className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${isSelected ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
//                         <div className="flex items-center space-x-3">
//                           <IconComponent size={16} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
//                           <div>
//                             <span className="block font-bold">{service.name}</span>
//                             <span className="text-[10px] text-gray-400">ETA: {service.eta}</span>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <span className="block font-black text-blue-600">${service.rate.toFixed(2)}</span>
//                           <input type="radio" checked={isSelected} readOnly className="h-3 w-3 text-blue-600 mt-0.5" />
//                         </div>
//                       </label>
//                     );
//                   })}
//                 </div>
//               </div>

//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                   <DollarSign size={16} className="text-blue-700" /> Premium Billing Order
//                 </h2>
//                 <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//                   <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//                   <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//                   <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//                     <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//                     <span className="text-green-600 font-bold">Secured</span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center pt-4 mb-5">
//                   <span className="font-black text-gray-900 uppercase text-xs">Total Valuation</span>
//                   <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//                 </div>
//                 <button onClick={handleProceedToPayment} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs">
//                   Authorize Payment via KHQR
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* KHQR MODAL */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
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

//       {/* DYNAMIC SCREEN MODAL INVOICE (HIDDEN ON PRINT) */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] print:hidden animate-in fade-in zoom-in-95 duration-150">
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

//       {/* ACCOUNT PURCHASE HISTORY MODAL (WITH SEARCH ENGINE) */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" /> 
//                 {userRole === 'admin' ? 'Total Sales Manifest (Admin)' : 'My Purchase History'}
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{filteredHistory.length} Record(s)</span>
//             </div>

//             {/* 🔎 REAL INVOICE SEARCH FIELD */}
//             <div className="relative my-2">
//               <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
//               <input 
//                 type="text" 
//                 placeholder="Search by Invoice ID, Customer Name, or Phone..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition"
//               />
//               {searchQuery && (
//                 <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 font-bold text-gray-400 hover:text-gray-600 text-[10px] bg-gray-200/60 px-1.5 py-0.5 rounded">Clear</button>
//               )}
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs mt-2">
//               {filteredHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No matching historical purchase tracks found.</div>
//               ) : (
//                 filteredHistory.map((historyItem) => (
//                   <div key={historyItem.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-400 transition shadow-sm relative group">
//                     <div className="flex justify-between items-start mb-2 pr-8">
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

//                     <div className="mt-3 grid grid-cols-1 gap-2 sm:flex sm:items-center sm:gap-2">
//                       <button 
//                         onClick={() => { 
//                           setInvoiceDetails(historyItem); 
//                           setShowInvoiceModal(true); 
//                         }}
//                         className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5"
//                       >
//                         <Receipt size={13} /> View Detailed Invoice
//                       </button>

//                       {userRole === 'admin' && (
//                         <button
//                           onClick={() => handleDeleteHistoryItem(historyItem.id)}
//                           className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold p-2 rounded-xl text-[11px] transition flex items-center justify-center gap-1 sm:flex-none"
//                           title="Purge Record From Global History"
//                         >
//                           <Trash2 size={14} />
//                           <span className="sm:hidden">Delete Record</span>
//                         </button>
//                       )}
//                     </div>
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

//       {/* 🚀 2. DEDICATED REAL INVOICE PRINT LAYOUT (ONLY ACTIVE DURING print) */}
//       {invoiceDetails && (
//         <div className="hidden print:block text-black bg-white p-0 text-[12px] font-mono leading-tight max-w-[80mm] mx-auto">
//           <div className="text-center border-b border-black pb-3 mb-3">
//             <h1 className="text-lg font-black tracking-wide">PSP MART RECEIPT</h1>
//             <p className="text-[10px]">Phnom Penh, Cambodia</p>
//             <p className="text-[10px]">High Quality Product Logistics Ecosystem</p>
//           </div>

//           <div className="space-y-1 pb-2 border-b border-black">
//             <div><strong>INVOICE ID:</strong> #{invoiceDetails.id}</div>
//             <div><strong>DATE:</strong> {invoiceDetails.date}</div>
//             <div><strong>CUSTOMER:</strong> {invoiceDetails.customerName}</div>
//             <div><strong>PHONE:</strong> {invoiceDetails.phone}</div>
//             <div><strong>CARRIER:</strong> {invoiceDetails.carrier}</div>
//             <div><strong>EMAIL:</strong> {invoiceDetails.accountEmail}</div>
//             <div className="leading-snug"><strong>ADDRESS:</strong> {invoiceDetails.address}</div>
//           </div>

//           <div className="py-2 border-b border-black">
//             <div className="flex justify-between font-bold text-[11px] mb-1">
//               <span>Item Description</span>
//               <span>Total</span>
//             </div>
//             <div className="space-y-1">
//               {invoiceDetails.items.map((item, idx) => (
//                 <div key={idx} className="flex justify-between">
//                   <span>{item.name} (x{item.quantity})</span>
//                   <span>${(item.price * item.quantity).toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="pt-2 space-y-1 text-right">
//             <div className="flex justify-between"><span>Subtotal:</span><span>${invoiceDetails.subtotal.toFixed(2)}</span></div>
//             <div className="flex justify-between"><span>Shipping Fee:</span><span>${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//             <div className="flex justify-between text-sm font-black pt-1 border-t border-dotted border-black">
//               <span>GRAND TOTAL:</span>
//               <span>${invoiceDetails.total.toFixed(2)}</span>
//             </div>
//           </div>

//           <div className="text-center pt-6 mt-6 border-t border-black text-[10px]">
//             <p>Thank you for shopping with PSP Mart!</p>
//             <p>Please retain receipt for verification.</p>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
















// import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
//   Truck, Download, Share2, CheckCircle2, History, Receipt, 
//   Clock, DollarSign, ShieldCheck, User, Search, AlertCircle,
//   RefreshCw, Wifi, WifiOff, Timer, Copy, ExternalLink
// } from 'lucide-react';

// // ─── CONFIG ─────────────────────────────────────────────────────────────────
// const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg";
// const TELEGRAM_CHAT_ID   = "6710148858";
// const QR_EXPIRY_SECONDS  = 300; // 5 minutes

// // ─── PAYMENT STATUS ENUM ────────────────────────────────────────────────────
// const PAY_STATUS = {
//   IDLE:      'idle',
//   PENDING:   'pending',   // QR shown, waiting
//   VERIFYING: 'verifying', // User clicked "I Have Transferred"
//   CONFIRMED: 'confirmed', // Admin replied /confirm_XXXXXX
//   EXPIRED:   'expired',   // Timer ran out
//   FAILED:    'failed',    // Error
// };

// // ─── TELEGRAM HELPERS ───────────────────────────────────────────────────────
// const telegramAPI = async (method, body) => {
//   try {
//     const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     return await res.json();
//   } catch (err) {
//     console.error('Telegram API error:', err);
//     return null;
//   }
// };

// // Send the NEW ORDER alert to the shop owner
// const sendOrderAlert = async (invoiceData) => {
//   const itemLines = invoiceData.items
//     .map(i => `  • ${i.name} ×${i.quantity} = <b>$${(i.price * i.quantity).toFixed(2)}</b>`)
//     .join('\n');

//   const mapLine = invoiceData.mapLocation
//     ? `<a href="${invoiceData.mapLocation}">📍 Open Route in Maps</a>`
//     : '📍 No map link provided';

//   const msg = `
// 🛒 <b>NEW ORDER — PSP MART</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 <b>Invoice:</b> <code>#${invoiceData.id}</code>
// 📅 <b>Time:</b> ${invoiceData.date}

// 👤 <b>CUSTOMER</b>
// • Name: <b>${invoiceData.customerName}</b>
// • Phone: <code>${invoiceData.phone}</code>
// • Email: ${invoiceData.accountEmail}
// • Address: ${invoiceData.address}

// 🚚 <b>Carrier:</b> ${invoiceData.carrier} (+$${invoiceData.shippingFee.toFixed(2)})
// ${mapLine}

// 🛍️ <b>ITEMS</b>
// ${itemLines}

// 💵 Subtotal: $${invoiceData.subtotal.toFixed(2)}
// 📦 Shipping: $${invoiceData.shippingFee.toFixed(2)}
// 💰 <b>TOTAL: $${invoiceData.total.toFixed(2)}</b>

// ⏳ <b>PAYMENT STATUS: AWAITING CONFIRMATION</b>
// ━━━━━━━━━━━━━━━━━━━━━
// ✅ Reply <code>/confirm_${invoiceData.id}</code> after payment verified
// ❌ Reply <code>/cancel_${invoiceData.id}</code> to reject order
// `.trim();

//   return await telegramAPI('sendMessage', {
//     chat_id: TELEGRAM_CHAT_ID,
//     text: msg,
//     parse_mode: 'HTML',
//   });
// };

// // Send PAYMENT RECEIVED alert
// const sendPaymentConfirmedAlert = async (invoiceData) => {
//   const msg = `
// ✅ <b>PAYMENT CONFIRMED — PSP MART</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 Invoice: <code>#${invoiceData.id}</code>
// 👤 ${invoiceData.customerName} (${invoiceData.phone})
// 💰 <b>$${invoiceData.total.toFixed(2)} RECEIVED</b>
// 🚚 ${invoiceData.carrier}
// ━━━━━━━━━━━━━━━━━━━━━
// 🚀 Proceed to dispatch & fulfill order.
// `.trim();

//   return await telegramAPI('sendMessage', {
//     chat_id: TELEGRAM_CHAT_ID,
//     text: msg,
//     parse_mode: 'HTML',
//   });
// };

// // Poll Telegram for confirmation reply from owner
// // Owner must send /confirm_INVOICEID in the bot chat to approve
// const pollForConfirmation = async (invoiceId, lastUpdateId) => {
//   try {
//     const data = await telegramAPI('getUpdates', {
//       offset: lastUpdateId ? lastUpdateId + 1 : undefined,
//       timeout: 5,
//       allowed_updates: ['message'],
//     });

//     if (!data?.ok || !data.result?.length) return { status: 'waiting', lastUpdateId };

//     const newLastId = data.result[data.result.length - 1].update_id;

//     for (const update of data.result) {
//       const text = update.message?.text?.trim() || '';
//       if (text === `/confirm_${invoiceId}`) return { status: 'confirmed', lastUpdateId: newLastId };
//       if (text === `/cancel_${invoiceId}`)  return { status: 'cancelled', lastUpdateId: newLastId };
//     }

//     return { status: 'waiting', lastUpdateId: newLastId };
//   } catch {
//     return { status: 'waiting', lastUpdateId };
//   }
// };

// // ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
// export default function Cart({ userEmail, userRole }) {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);

//   // Modals
//   const [showQrModal,      setShowQrModal]      = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);

//   // Invoice & history
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory,   setOrderHistory]   = useState([]);

//   // Search
//   const [searchQuery, setSearchQuery] = useState('');

//   // Delivery form
//   const [customerName,    setCustomerName]    = useState('');
//   const [phoneNumber,     setPhoneNumber]     = useState('');
//   const [address,         setAddress]         = useState('');
//   const [mapLocation,     setMapLocation]     = useState('');
//   const [deliveryMethod,  setDeliveryMethod]  = useState('Standard Home Delivery');
//   const [shippingFee,     setShippingFee]     = useState(1.00);
//   const [formError,       setFormError]       = useState('');

//   // ── Payment flow state ──
//   const [payStatus,         setPayStatus]         = useState(PAY_STATUS.IDLE);
//   const [qrSecondsLeft,     setQrSecondsLeft]     = useState(QR_EXPIRY_SECONDS);
//   const [pendingInvoice,    setPendingInvoice]     = useState(null);
//   const [verifyAttempts,    setVerifyAttempts]     = useState(0);
//   const [lastTelegramUpdate, setLastTelegramUpdate] = useState(null);
//   const [copyFeedback,      setCopyFeedback]       = useState('');

//   const timerRef  = useRef(null);
//   const pollRef   = useRef(null);
//   const secondsRef = useRef(QR_EXPIRY_SECONDS);

//   // ── Load history ──
//   const loadHistory = useCallback(() => {
//     const saved = localStorage.getItem('psp_market_order_history');
//     setOrderHistory(saved ? JSON.parse(saved) : []);
//   }, []);

//   useEffect(() => {
//     loadHistory();
//     const iv = setInterval(loadHistory, 1500);
//     return () => clearInterval(iv);
//   }, [loadHistory]);

//   // ── Cleanup polling on unmount ──
//   useEffect(() => () => { clearInterval(timerRef.current); clearInterval(pollRef.current); }, []);

//   // ── Filtered history ──
//   const allowedHistory = orderHistory.filter(o =>
//     userRole === 'admin' ? true : o.accountEmail === userEmail
//   );
//   const filteredHistory = allowedHistory.filter(o => {
//     const q = searchQuery.toLowerCase().trim();
//     if (!q) return true;
//     return (
//       o.id.toString().includes(q) ||
//       o.customerName.toLowerCase().includes(q) ||
//       o.phone.includes(q)
//     );
//   });

//   // ── Delivery services ──
//   const deliveryServices = [
//     { id: 'home',     name: 'Standard Home Delivery',   rate: 1.00, eta: '1-2 Days',    icon: Home },
//     { id: 'vireak',   name: 'Vireak Buntham Express',   rate: 1.75, eta: 'Next Day',     icon: Truck },
//     { id: 'foodpanda',name: 'FoodPanda Instant',         rate: 2.50, eta: '30-45 Mins',  icon: ShoppingBag },
//     { id: 'wownow',   name: 'WOW NOW Logistics',         rate: 1.50, eta: 'Same Day',    icon: Truck },
//     { id: 'egets',    name: 'E-GetS Delivery',           rate: 2.00, eta: '40 Mins',     icon: Truck },
//   ];

//   const subtotal   = cart.reduce((s, i) => s + i.price * i.quantity, 0);
//   const grandTotal = subtotal + shippingFee;

//   // ── Save order to localStorage ──
//   const saveOrder = useCallback((invoice, history) => {
//     const existIdx = history.findIndex(
//       o => o.customerName.toLowerCase().trim() === invoice.customerName.toLowerCase().trim() &&
//            o.phone.trim() === invoice.phone.trim() &&
//            o.accountEmail === invoice.accountEmail
//     );

//     let updated;
//     if (existIdx !== -1) {
//       const merged  = [...history[existIdx].items];
//       invoice.items.forEach(ni => {
//         const mi = merged.findIndex(i => i.id === ni.id);
//         mi !== -1 ? (merged[mi].quantity += ni.quantity) : merged.push({ ...ni });
//       });
//       const newSub = merged.reduce((s, i) => s + i.price * i.quantity, 0);
//       const final  = { ...history[existIdx], items: merged, subtotal: newSub, total: newSub + history[existIdx].shippingFee, date: invoice.date };
//       updated = [...history];
//       updated.splice(existIdx, 1);
//       updated.unshift(final);
//       return final;
//     } else {
//       updated = [invoice, ...history];
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
//       setOrderHistory(updated);
//       return invoice;
//     }
//   }, []);

//   // ── Start QR expiry countdown ──
//   const startTimer = useCallback(() => {
//     secondsRef.current = QR_EXPIRY_SECONDS;
//     setQrSecondsLeft(QR_EXPIRY_SECONDS);
//     clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => {
//       secondsRef.current -= 1;
//       setQrSecondsLeft(secondsRef.current);
//       if (secondsRef.current <= 0) {
//         clearInterval(timerRef.current);
//         clearInterval(pollRef.current);
//         setPayStatus(PAY_STATUS.EXPIRED);
//       }
//     }, 1000);
//   }, []);

//   // ── Start polling Telegram for /confirm ──
//   const startPolling = useCallback((invoiceId) => {
//     clearInterval(pollRef.current);
//     let lastId = lastTelegramUpdate;
//     pollRef.current = setInterval(async () => {
//       const result = await pollForConfirmation(invoiceId, lastId);
//       lastId = result.lastUpdateId;
//       setLastTelegramUpdate(result.lastUpdateId);

//       if (result.status === 'confirmed') {
//         clearInterval(pollRef.current);
//         clearInterval(timerRef.current);
//         setPayStatus(PAY_STATUS.CONFIRMED);
//       } else if (result.status === 'cancelled') {
//         clearInterval(pollRef.current);
//         clearInterval(timerRef.current);
//         setPayStatus(PAY_STATUS.FAILED);
//       }
//     }, 4000); // Poll every 4 seconds
//   }, [lastTelegramUpdate]);

//   // ── STEP 1: Proceed to payment — validate form & show QR ──
//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
//       setFormError('Required Fields Missing: Please enter your Name, Phone Number, and Address.');
//       return;
//     }

//     const date = new Date().toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//       hour: '2-digit', minute: '2-digit',
//     });
//     const uniqueId = Math.floor(100000 + Math.random() * 900000);

//     const invoice = {
//       id:           uniqueId,
//       accountEmail: userEmail,
//       customerName, items: [...cart],
//       subtotal,     shippingFee,  total: grandTotal,
//       phone:        phoneNumber,  address, mapLocation,
//       carrier:      deliveryMethod, date,
//       status:       'pending',
//     };

//     setPendingInvoice(invoice);
//     setPayStatus(PAY_STATUS.PENDING);
//     setVerifyAttempts(0);
//     setShowQrModal(true);
//     startTimer();
//   };

//   // ── STEP 2: User clicked "I Have Transferred" ──
//   const handleUserConfirm = async () => {
//     if (payStatus !== PAY_STATUS.PENDING) return;
//     setPayStatus(PAY_STATUS.VERIFYING);
//     setVerifyAttempts(v => v + 1);

//     // Send NEW ORDER alert to Telegram the FIRST time only
//     if (verifyAttempts === 0) {
//       await sendOrderAlert(pendingInvoice);
//       // Start polling for owner's /confirm reply
//       startPolling(pendingInvoice.id);
//     }
//   };

//   // ── STEP 3: Owner confirmed via Telegram → finalize ──
//   useEffect(() => {
//     if (payStatus !== PAY_STATUS.CONFIRMED || !pendingInvoice) return;

//     const finalize = async () => {
//       const finalInvoice = saveOrder(pendingInvoice, orderHistory);
//       setInvoiceDetails(finalInvoice);

//       // Send "payment confirmed" notification
//       await sendPaymentConfirmedAlert(finalInvoice);

//       // Clear cart
//       checkout();
//       setCustomerName(''); setPhoneNumber(''); setAddress(''); setMapLocation('');
//       setPendingInvoice(null);
//       setShowQrModal(false);
//       setShowInvoiceModal(true);
//     };

//     finalize();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [payStatus]);

//   // ── Reset / retry payment ──
//   const handleRetry = () => {
//     clearInterval(timerRef.current);
//     clearInterval(pollRef.current);
//     setPayStatus(PAY_STATUS.PENDING);
//     setVerifyAttempts(0);
//     startTimer();
//   };

//   const handleCancelPayment = () => {
//     clearInterval(timerRef.current);
//     clearInterval(pollRef.current);
//     setPayStatus(PAY_STATUS.IDLE);
//     setShowQrModal(false);
//     setPendingInvoice(null);
//   };

//   // ── Copy invoice ID ──
//   const copyInvoiceId = (id) => {
//     navigator.clipboard.writeText(`#${id}`);
//     setCopyFeedback(id);
//     setTimeout(() => setCopyFeedback(''), 1500);
//   };

//   // ── Delete history (admin only) ──
//   const handleDeleteHistoryItem = (orderId) => {
//     if (userRole !== 'admin') { alert('Access Denied.'); return; }
//     if (!window.confirm(`Permanently delete Order #${orderId}?`)) return;
//     const updated = orderHistory.filter(o => o.id !== orderId);
//     localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
//     setOrderHistory(updated);
//   };

//   // ── Share invoice ──
//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const text = `PSP Mart Invoice #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}\nCustomer: ${invoiceDetails.customerName}`;
//     if (navigator.share) {
//       try { await navigator.share({ title: 'PSP Mart Receipt', text, url: window.location.href }); } catch {}
//     } else {
//       navigator.clipboard.writeText(text);
//       alert('Invoice copied to clipboard!');
//     }
//   };

//   // ── Timer display helpers ──
//   const timerMM  = String(Math.floor(qrSecondsLeft / 60)).padStart(2, '0');
//   const timerSS  = String(qrSecondsLeft % 60).padStart(2, '0');
//   const timerPct = (qrSecondsLeft / QR_EXPIRY_SECONDS) * 100;
//   const timerUrgent = qrSecondsLeft <= 60;

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="max-w-6xl mx-auto font-sans px-4">

//       {/* ═══ SCREEN VIEW ═══════════════════════════════════════════════════ */}
//       <div className="print:hidden">
//         {cart.length === 0 ? (
//           <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 text-xs">
//             <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//             <h2 className="text-base font-bold text-gray-900 mb-1">Your cart is empty</h2>
//             <p className="text-gray-400 mb-6">Browse products and add them to start checkout.</p>
//             <button onClick={() => setShowHistoryModal(true)}
//               className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm">
//               <History size={14} className="text-blue-600" />
//               {userRole === 'admin' ? `Total Sales (${allowedHistory.length})` : `Purchase History (${allowedHistory.length})`}
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

//             {/* ── Left 2 columns ── */}
//             <div className="lg:col-span-2 space-y-6">

//               {/* Cart items */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//                 <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//                   <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//                     <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//                   </h2>
//                   <button onClick={() => setShowHistoryModal(true)}
//                     className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition">
//                     <History size={13} /> {userRole === 'admin' ? 'Total Sales' : 'My History'} ({allowedHistory.length})
//                   </button>
//                 </div>
//                 <div className="divide-y divide-gray-100">
//                   {cart.map(item => (
//                     <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                       <div className="flex items-center space-x-3.5">
//                         <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                         <div>
//                           <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                           <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                           <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                           <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                           <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                         </div>
//                         <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Delivery form */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//                   <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//                 </h2>
//                 {formError && (
//                   <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100 flex items-center gap-2">
//                     <AlertCircle size={14} /> {formError}
//                   </div>
//                 )}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {[
//                     { label: 'Recipient Full Name *', icon: User,  val: customerName,  set: setCustomerName,  ph: 'e.g., Phy Sopheak',           col: '' },
//                     { label: 'Contact Phone *',       icon: Phone, val: phoneNumber,   set: setPhoneNumber,   ph: 'e.g., 012 345 678',           col: '' },
//                     { label: 'Drop-off Address *',    icon: Home,  val: address,       set: setAddress,       ph: 'Street, House, Sangkat, Khan…', col: 'md:col-span-2' },
//                     { label: 'Google Maps Link (Optional)', icon: MapPin, val: mapLocation, set: setMapLocation, ph: 'https://maps.google.com/…', col: 'md:col-span-2', type: 'url' },
//                   ].map(({ label, icon: Icon, val, set, ph, col, type }) => (
//                     <div key={label} className={col}>
//                       <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">{label}</label>
//                       <div className="relative">
//                         <Icon size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                         <input type={type || 'text'} placeholder={ph} value={val} onChange={e => set(e.target.value)}
//                           className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ── Right column ── */}
//             <div className="space-y-6">

//               {/* Carrier */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                   <Truck size={16} className="text-blue-700" /> Logistics Carrier
//                 </h2>
//                 <div className="space-y-2">
//                   {deliveryServices.map(({ id, name, rate, eta, icon: Icon }) => {
//                     const sel = deliveryMethod === name;
//                     return (
//                       <label key={id} onClick={() => { setDeliveryMethod(name); setShippingFee(rate); }}
//                         className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${sel ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
//                         <div className="flex items-center space-x-3">
//                           <Icon size={16} className={sel ? 'text-blue-600' : 'text-gray-400'} />
//                           <div>
//                             <span className="block font-bold">{name}</span>
//                             <span className="text-[10px] text-gray-400">ETA: {eta}</span>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <span className="block font-black text-blue-600">${rate.toFixed(2)}</span>
//                           <input type="radio" readOnly checked={sel} className="h-3 w-3 text-blue-600 mt-0.5" />
//                         </div>
//                       </label>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Order summary */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                   <DollarSign size={16} className="text-blue-700" /> Order Summary
//                 </h2>
//                 <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//                   <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//                   <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//                   <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//                     <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//                     <span className="text-green-600 font-bold">Active</span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center pt-4 mb-5">
//                   <span className="font-black text-gray-900 uppercase text-xs">Grand Total</span>
//                   <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//                 </div>
//                 <button onClick={handleProceedToPayment}
//                   className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2">
//                   <ShieldCheck size={14} /> Authorize Payment via KHQR
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ═══ QR PAYMENT MODAL ══════════════════════════════════════════════ */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
//           <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">

//             {/* Modal header */}
//             <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 pt-6 pb-5 text-white text-center">
//               <div className="flex items-center justify-center gap-2 mb-1">
//                 <ShieldCheck size={16} className="opacity-80" />
//                 <span className="text-xs font-bold tracking-widest uppercase opacity-80">Bakong KHQR · NBC Licensed</span>
//               </div>
//               <div className="text-3xl font-black">${grandTotal.toFixed(2)}</div>
//               <div className="text-blue-200 text-xs mt-1">Invoice #{pendingInvoice?.id}</div>
//             </div>

//             <div className="px-6 pb-6 pt-4">

//               {/* ── PENDING: show QR ── */}
//               {(payStatus === PAY_STATUS.PENDING) && (
//                 <>
//                   {/* Timer bar */}
//                   <div className="mb-3">
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
//                         <Timer size={10} /> QR Expires In
//                       </span>
//                       <span className={`font-black text-sm font-mono ${timerUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
//                         {timerMM}:{timerSS}
//                       </span>
//                     </div>
//                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className={`h-full rounded-full transition-all duration-1000 ${timerUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
//                         style={{ width: `${timerPct}%` }} />
//                     </div>
//                   </div>

//                   {/* QR image */}
//                   <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-center mb-3 shadow-inner">
//                     <img src={khqrImage} alt="KHQR" className="w-52 h-52 object-contain" />
//                   </div>

//                   <p className="text-center text-[11px] text-gray-400 mb-4">
//                     Open <b>Bakong App</b> → Scan QR → Transfer <b>${grandTotal.toFixed(2)}</b> → come back and tap confirm
//                   </p>

//                   <div className="flex gap-3 text-xs font-bold">
//                     <button onClick={handleCancelPayment}
//                       className="w-2/5 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition">
//                       Cancel
//                     </button>
//                     <button onClick={handleUserConfirm}
//                       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2">
//                       <CheckCircle2 size={14} /> I Have Transferred
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* ── VERIFYING: waiting for owner to /confirm ── */}
//               {payStatus === PAY_STATUS.VERIFYING && (
//                 <div className="text-center py-4">
//                   <div className="relative inline-flex items-center justify-center mb-4">
//                     <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
//                     <Wifi size={22} className="absolute text-blue-600" />
//                   </div>
//                   <h3 className="font-black text-gray-900 text-sm mb-1">Verifying Payment…</h3>
//                   <p className="text-gray-400 text-xs mb-1">Waiting for shop owner to confirm receipt</p>
//                   <p className="text-blue-600 text-[10px] font-mono bg-blue-50 px-3 py-1.5 rounded-lg inline-block mb-4">
//                     Auto-detecting via Telegram…
//                   </p>

//                   {/* Show QR still for reference */}
//                   <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-4">
//                     <img src={khqrImage} alt="KHQR" className="w-28 h-28 object-contain mx-auto opacity-60" />
//                   </div>

//                   {verifyAttempts >= 1 && (
//                     <p className="text-[10px] text-gray-400 mb-3">
//                       If you haven't transferred yet, please do so now and wait for confirmation.
//                     </p>
//                   )}

//                   <div className="flex gap-2 text-xs font-bold">
//                     <button onClick={handleCancelPayment}
//                       className="flex-1 border border-gray-200 text-gray-400 py-2.5 rounded-xl hover:bg-gray-50">
//                       Cancel Order
//                     </button>
//                     <button onClick={handleRetry}
//                       className="flex-1 border border-blue-200 text-blue-600 py-2.5 rounded-xl hover:bg-blue-50 flex items-center justify-center gap-1">
//                       <RefreshCw size={12} /> Re-scan QR
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* ── EXPIRED ── */}
//               {payStatus === PAY_STATUS.EXPIRED && (
//                 <div className="text-center py-4">
//                   <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
//                     <Clock size={28} className="text-amber-500" />
//                   </div>
//                   <h3 className="font-black text-gray-900 text-sm mb-1">QR Code Expired</h3>
//                   <p className="text-gray-400 text-xs mb-4">The payment window has closed. Generate a new QR to try again.</p>
//                   <div className="flex gap-3 text-xs font-bold">
//                     <button onClick={handleCancelPayment}
//                       className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl">Cancel</button>
//                     <button onClick={handleRetry}
//                       className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl flex items-center justify-center gap-1.5">
//                       <RefreshCw size={12} /> New QR Code
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* ── FAILED / CANCELLED BY OWNER ── */}
//               {payStatus === PAY_STATUS.FAILED && (
//                 <div className="text-center py-4">
//                   <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
//                     <WifiOff size={28} className="text-red-500" />
//                   </div>
//                   <h3 className="font-black text-red-700 text-sm mb-1">Order Rejected</h3>
//                   <p className="text-gray-400 text-xs mb-4">The shop owner was unable to confirm this payment. Please contact support or try again.</p>
//                   <button onClick={handleCancelPayment}
//                     className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-xs">
//                     Close
//                   </button>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══ INVOICE MODAL ═════════════════════════════════════════════════ */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] print:hidden">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
//             <div className="text-xs text-gray-800">
//               <div className="text-center pb-4 border-b border-dashed border-gray-300">
//                 <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
//                 <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
//                 <p className="text-gray-400 text-[10px]">Payment Verified · High Quality Product Logistics</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
//                 <div>
//                   <span className="text-gray-400 block">Invoice ID</span>
//                   <button onClick={() => copyInvoiceId(invoiceDetails.id)}
//                     className="font-bold text-gray-900 flex items-center gap-1 hover:text-blue-600">
//                     #{invoiceDetails.id}
//                     {copyFeedback === invoiceDetails.id ? <CheckCircle2 size={10} className="text-green-500" /> : <Copy size={10} />}
//                   </button>
//                 </div>
//                 <div className="text-right"><span className="text-gray-400 block">Date</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Customer</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
//                 <div><span className="text-gray-400 block">Carrier</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Shipping</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Account</span><span className="font-medium text-blue-600">{invoiceDetails.accountEmail}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Address</span><span className="font-medium text-gray-900">{invoiceDetails.address}</span></div>
//                 {invoiceDetails.mapLocation && (
//                   <div className="col-span-2">
//                     <a href={invoiceDetails.mapLocation} target="_blank" rel="noreferrer"
//                       className="flex items-center gap-1 text-blue-500 hover:underline font-medium">
//                       <ExternalLink size={10} /> View Map Route
//                     </a>
//                   </div>
//                 )}
//               </div>

//               <div className="py-3 border-b border-dashed border-gray-300">
//                 <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Manifest</span>
//                 <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
//                   {invoiceDetails.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
//                       <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">×{item.quantity}</span></span>
//                       <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-center">
//                 <span className="text-xs font-black uppercase tracking-wider text-gray-900">Total Paid</span>
//                 <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="mt-5 grid grid-cols-2 gap-3 font-bold text-xs">
//               <button onClick={() => window.print()}
//                 className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
//                 <Download size={14} /> Print Receipt
//               </button>
//               <button onClick={handleShareInvoice}
//                 className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
//                 <Share2 size={14} /> Share Invoice
//               </button>
//               <button onClick={() => setShowInvoiceModal(false)}
//                 className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══ HISTORY MODAL ═════════════════════════════════════════════════ */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" />
//                 {userRole === 'admin' ? 'Sales Manifest (Admin)' : 'My Purchase History'}
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{filteredHistory.length} records</span>
//             </div>

//             <div className="relative my-2">
//               <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
//               <input type="text" placeholder="Search by Invoice ID, Name, or Phone…"
//                 value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//               {searchQuery && (
//                 <button onClick={() => setSearchQuery('')}
//                   className="absolute right-3 top-2.5 font-bold text-gray-400 hover:text-gray-600 text-[10px] bg-gray-200/60 px-1.5 py-0.5 rounded">
//                   Clear
//                 </button>
//               )}
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs mt-2">
//               {filteredHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No records found.</div>
//               ) : filteredHistory.map(order => (
//                 <div key={order.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-300 transition shadow-sm">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <span className="font-black text-gray-900 block">Invoice #{order.id}</span>
//                       <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {order.date}</span>
//                     </div>
//                     <span className="font-black text-blue-700 text-sm">${order.total.toFixed(2)}</span>
//                   </div>
//                   <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
//                     {userRole === 'admin' && (
//                       <div className="text-red-600 font-bold"><span className="text-gray-700 font-semibold">Email:</span> {order.accountEmail}</div>
//                     )}
//                     <div><span className="font-semibold text-gray-700">Customer:</span> {order.customerName} ({order.phone})</div>
//                     <div className="text-[11px] text-slate-500 italic mt-1">{order.items.reduce((s, i) => s + i.quantity, 0)} item(s) · {order.carrier}</div>
//                   </div>
//                   <div className="mt-3 flex gap-2">
//                     <button onClick={() => { setInvoiceDetails(order); setShowInvoiceModal(true); }}
//                       className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5">
//                       <Receipt size={13} /> View Invoice
//                     </button>
//                     {userRole === 'admin' && (
//                       <button onClick={() => handleDeleteHistoryItem(order.id)}
//                         className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold p-2 rounded-xl transition">
//                         <Trash2 size={14} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button onClick={() => setShowHistoryModal(false)}
//               className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
//               Return to Checkout
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ═══ PRINT LAYOUT ══════════════════════════════════════════════════ */}
//       {invoiceDetails && (
//         <div className="hidden print:block text-black bg-white p-0 text-[12px] font-mono leading-tight max-w-[80mm] mx-auto">
//           <div className="text-center border-b border-black pb-3 mb-3">
//             <h1 className="text-lg font-black tracking-wide">PSP MART RECEIPT</h1>
//             <p className="text-[10px]">Phnom Penh, Cambodia · KHQR Verified</p>
//           </div>
//           <div className="space-y-1 pb-2 border-b border-black">
//             <div><strong>INVOICE:</strong> #{invoiceDetails.id}</div>
//             <div><strong>DATE:</strong> {invoiceDetails.date}</div>
//             <div><strong>CUSTOMER:</strong> {invoiceDetails.customerName}</div>
//             <div><strong>PHONE:</strong> {invoiceDetails.phone}</div>
//             <div><strong>CARRIER:</strong> {invoiceDetails.carrier}</div>
//             <div><strong>EMAIL:</strong> {invoiceDetails.accountEmail}</div>
//             <div><strong>ADDRESS:</strong> {invoiceDetails.address}</div>
//           </div>
//           <div className="py-2 border-b border-black">
//             <div className="flex justify-between font-bold text-[11px] mb-1"><span>Item</span><span>Total</span></div>
//             {invoiceDetails.items.map((item, i) => (
//               <div key={i} className="flex justify-between">
//                 <span>{item.name} (×{item.quantity})</span>
//                 <span>${(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             ))}
//           </div>
//           <div className="pt-2 space-y-1 text-right">
//             <div className="flex justify-between"><span>Subtotal:</span><span>${invoiceDetails.subtotal.toFixed(2)}</span></div>
//             <div className="flex justify-between"><span>Shipping:</span><span>${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//             <div className="flex justify-between text-sm font-black pt-1 border-t border-dotted border-black">
//               <span>GRAND TOTAL:</span><span>${invoiceDetails.total.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="text-center pt-6 mt-6 border-t border-black text-[10px]">
//             <p>Thank you for shopping with PSP Mart!</p>
//             <p>Please retain receipt for verification.</p>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }
























// import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
// import { ShopContext } from '../../context/ShopContext';
// import { 
//   Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, 
//   Truck, Download, Share2, CheckCircle2, History, Receipt, 
//   Clock, DollarSign, ShieldCheck, User, Search, AlertCircle,
//   RefreshCw, Wifi, WifiOff, Timer, Copy, ExternalLink,
//   ImagePlus, FileText, X, Upload, Send
// } from 'lucide-react';

// // ─── CONFIG ─────────────────────────────────────────────────────────────────
// const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg";
// const TELEGRAM_CHAT_ID   = "6710148858";
// const QR_EXPIRY_SECONDS  = 300; // 5 minutes

// // ─── PAYMENT STATUS ENUM ────────────────────────────────────────────────────
// const PAY_STATUS = {
//   IDLE:       'idle',
//   PENDING:    'pending',    // QR shown, waiting
//   UPLOADING:  'uploading',  // User clicked "I Have Transferred" — now must attach proof
//   SUBMITTING: 'submitting', // Sending proof to Telegram
//   VERIFYING:  'verifying',  // Proof sent, waiting for admin /confirm
//   CONFIRMED:  'confirmed',  // Admin replied /confirm_XXXXXX
//   EXPIRED:    'expired',    // Timer ran out
//   FAILED:     'failed',     // Error / admin cancelled
// };

// // ─── TELEGRAM HELPERS ───────────────────────────────────────────────────────
// const telegramAPI = async (method, body) => {
//   try {
//     const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     });
//     return await res.json();
//   } catch (err) {
//     console.error('Telegram API error:', err);
//     return null;
//   }
// };

// // Send multipart form (for photo/document upload)
// const telegramSendFile = async (method, formData) => {
//   try {
//     const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
//       method: 'POST',
//       body: formData,
//     });
//     return await res.json();
//   } catch (err) {
//     console.error('Telegram file upload error:', err);
//     return null;
//   }
// };

// // Send the NEW ORDER alert to the shop owner
// const sendOrderAlert = async (invoiceData) => {
//   const itemLines = invoiceData.items
//     .map(i => `  • ${i.name} ×${i.quantity} = <b>$${(i.price * i.quantity).toFixed(2)}</b>`)
//     .join('\n');

//   const mapLine = invoiceData.mapLocation
//     ? `<a href="${invoiceData.mapLocation}">📍 Open Route in Maps</a>`
//     : '📍 No map link provided';

//   const msg = `
// 🛒 <b>NEW ORDER — PSP MART</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 <b>Invoice:</b> <code>#${invoiceData.id}</code>
// 📅 <b>Time:</b> ${invoiceData.date}

// 👤 <b>CUSTOMER</b>
// • Name: <b>${invoiceData.customerName}</b>
// • Phone: <code>${invoiceData.phone}</code>
// • Email: ${invoiceData.accountEmail}
// • Address: ${invoiceData.address}

// 🚚 <b>Carrier:</b> ${invoiceData.carrier} (+$${invoiceData.shippingFee.toFixed(2)})
// ${mapLine}

// 🛍️ <b>ITEMS</b>
// ${itemLines}

// 💵 Subtotal: $${invoiceData.subtotal.toFixed(2)}
// 📦 Shipping: $${invoiceData.shippingFee.toFixed(2)}
// 💰 <b>TOTAL: $${invoiceData.total.toFixed(2)}</b>

// 📎 <b>Payment proof attached below ↓</b>
// ━━━━━━━━━━━━━━━━━━━━━
// ✅ Reply <code>/confirm_${invoiceData.id}</code> after payment verified
// ❌ Reply <code>/cancel_${invoiceData.id}</code> to reject order
// `.trim();

//   return await telegramAPI('sendMessage', {
//     chat_id: TELEGRAM_CHAT_ID,
//     text: msg,
//     parse_mode: 'HTML',
//   });
// };

// // Send the payment proof file (image → sendPhoto, PDF → sendDocument)
// const sendPaymentProof = async (file, invoiceId, customerName, total) => {
//   const formData = new FormData();
//   formData.append('chat_id', TELEGRAM_CHAT_ID);

//   const isPdf = file.type === 'application/pdf';

//   if (isPdf) {
//     formData.append('document', file, file.name);
//     formData.append('caption', `📄 Payment Proof (PDF)\nInvoice #${invoiceId} · ${customerName} · $${total}`);
//     return await telegramSendFile('sendDocument', formData);
//   } else {
//     formData.append('photo', file, file.name);
//     formData.append('caption', `🖼️ Payment Screenshot\nInvoice #${invoiceId} · ${customerName} · $${total}`);
//     return await telegramSendFile('sendPhoto', formData);
//   }
// };

// // Send PAYMENT CONFIRMED alert
// const sendPaymentConfirmedAlert = async (invoiceData) => {
//   const msg = `
// ✅ <b>PAYMENT CONFIRMED — PSP MART</b>
// ━━━━━━━━━━━━━━━━━━━━━
// 🆔 Invoice: <code>#${invoiceData.id}</code>
// 👤 ${invoiceData.customerName} (${invoiceData.phone})
// 💰 <b>$${invoiceData.total.toFixed(2)} RECEIVED</b>
// 🚚 ${invoiceData.carrier}
// ━━━━━━━━━━━━━━━━━━━━━
// 🚀 Proceed to dispatch & fulfill order.
// `.trim();

//   return await telegramAPI('sendMessage', {
//     chat_id: TELEGRAM_CHAT_ID,
//     text: msg,
//     parse_mode: 'HTML',
//   });
// };

// // Poll Telegram for confirmation reply from owner
// const pollForConfirmation = async (invoiceId, lastUpdateId) => {
//   try {
//     const data = await telegramAPI('getUpdates', {
//       offset: lastUpdateId ? lastUpdateId + 1 : undefined,
//       timeout: 5,
//       allowed_updates: ['message'],
//     });

//     if (!data?.ok || !data.result?.length) return { status: 'waiting', lastUpdateId };

//     const newLastId = data.result[data.result.length - 1].update_id;

//     for (const update of data.result) {
//       const text = update.message?.text?.trim() || '';
//       if (text === `/confirm_${invoiceId}`) return { status: 'confirmed', lastUpdateId: newLastId };
//       if (text === `/cancel_${invoiceId}`)  return { status: 'cancelled', lastUpdateId: newLastId };
//     }

//     return { status: 'waiting', lastUpdateId: newLastId };
//   } catch {
//     return { status: 'waiting', lastUpdateId };
//   }
// };

// // ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
// export default function Cart({ userEmail, userRole }) {
//   const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);

//   // Modals
//   const [showQrModal,      setShowQrModal]      = useState(false);
//   const [showInvoiceModal, setShowInvoiceModal] = useState(false);
//   const [showHistoryModal, setShowHistoryModal] = useState(false);

//   // Invoice & history
//   const [invoiceDetails, setInvoiceDetails] = useState(null);
//   const [orderHistory,   setOrderHistory]   = useState([]);

//   // Search
//   const [searchQuery, setSearchQuery] = useState('');

//   // Delivery form
//   const [customerName,    setCustomerName]    = useState('');
//   const [phoneNumber,     setPhoneNumber]     = useState('');
//   const [address,         setAddress]         = useState('');
//   const [mapLocation,     setMapLocation]     = useState('');
//   const [deliveryMethod,  setDeliveryMethod]  = useState('Standard Home Delivery');
//   const [shippingFee,     setShippingFee]     = useState(1.00);
//   const [formError,       setFormError]       = useState('');

//   // ── Payment flow state ──
//   const [payStatus,          setPayStatus]          = useState(PAY_STATUS.IDLE);
//   const [qrSecondsLeft,      setQrSecondsLeft]      = useState(QR_EXPIRY_SECONDS);
//   const [pendingInvoice,     setPendingInvoice]      = useState(null);
//   const [lastTelegramUpdate, setLastTelegramUpdate]  = useState(null);
//   const [copyFeedback,       setCopyFeedback]        = useState('');

//   // ── Proof of payment upload state ──
//   const [proofFile,     setProofFile]     = useState(null);   // File object
//   const [proofPreview,  setProofPreview]  = useState(null);   // Object URL for image preview
//   const [proofError,    setProofError]    = useState('');
//   const [uploadProgress, setUploadProgress] = useState('');
//   const fileInputRef = useRef(null);

//   const timerRef   = useRef(null);
//   const pollRef    = useRef(null);
//   const secondsRef = useRef(QR_EXPIRY_SECONDS);

//   // ── Load history ──
//   const loadHistory = useCallback(() => {
//     const saved = localStorage.getItem('psp_market_order_history');
//     setOrderHistory(saved ? JSON.parse(saved) : []);
//   }, []);

//   useEffect(() => {
//     loadHistory();
//     const iv = setInterval(loadHistory, 1500);
//     return () => clearInterval(iv);
//   }, [loadHistory]);

//   // ── Cleanup on unmount ──
//   useEffect(() => () => {
//     clearInterval(timerRef.current);
//     clearInterval(pollRef.current);
//     if (proofPreview) URL.revokeObjectURL(proofPreview);
//   }, []);

//   // ── Filtered history ──
//   const allowedHistory = orderHistory.filter(o =>
//     userRole === 'admin' ? true : o.accountEmail === userEmail
//   );
//   const filteredHistory = allowedHistory.filter(o => {
//     const q = searchQuery.toLowerCase().trim();
//     if (!q) return true;
//     return (
//       o.id.toString().includes(q) ||
//       o.customerName.toLowerCase().includes(q) ||
//       o.phone.includes(q)
//     );
//   });

//   // ── Delivery services ──
//   const deliveryServices = [
//     { id: 'home',      name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days',   icon: Home },
//     { id: 'vireak',    name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day',    icon: Truck },
//     { id: 'foodpanda', name: 'FoodPanda Instant',      rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
//     { id: 'wownow',    name: 'WOW NOW Logistics',      rate: 1.50, eta: 'Same Day',   icon: Truck },
//     { id: 'egets',     name: 'E-GetS Delivery',        rate: 2.00, eta: '40 Mins',    icon: Truck },
//   ];

//   const subtotal   = cart.reduce((s, i) => s + i.price * i.quantity, 0);
//   const grandTotal = subtotal + shippingFee;

//   // ── Save order to localStorage ──
//   const saveOrder = useCallback((invoice, history) => {
//     const existIdx = history.findIndex(
//       o => o.customerName.toLowerCase().trim() === invoice.customerName.toLowerCase().trim() &&
//            o.phone.trim() === invoice.phone.trim() &&
//            o.accountEmail === invoice.accountEmail
//     );

//     let updated;
//     if (existIdx !== -1) {
//       const merged = [...history[existIdx].items];
//       invoice.items.forEach(ni => {
//         const mi = merged.findIndex(i => i.id === ni.id);
//         mi !== -1 ? (merged[mi].quantity += ni.quantity) : merged.push({ ...ni });
//       });
//       const newSub = merged.reduce((s, i) => s + i.price * i.quantity, 0);
//       const final  = { ...history[existIdx], items: merged, subtotal: newSub, total: newSub + history[existIdx].shippingFee, date: invoice.date };
//       updated = [...history];
//       updated.splice(existIdx, 1);
//       updated.unshift(final);
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
//       setOrderHistory(updated);
//       return final;
//     } else {
//       updated = [invoice, ...history];
//       localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
//       setOrderHistory(updated);
//       return invoice;
//     }
//   }, []);

//   // ── Start QR expiry countdown ──
//   const startTimer = useCallback(() => {
//     secondsRef.current = QR_EXPIRY_SECONDS;
//     setQrSecondsLeft(QR_EXPIRY_SECONDS);
//     clearInterval(timerRef.current);
//     timerRef.current = setInterval(() => {
//       secondsRef.current -= 1;
//       setQrSecondsLeft(secondsRef.current);
//       if (secondsRef.current <= 0) {
//         clearInterval(timerRef.current);
//         clearInterval(pollRef.current);
//         setPayStatus(PAY_STATUS.EXPIRED);
//       }
//     }, 1000);
//   }, []);

//   // ── Start polling Telegram for /confirm ──
//   const startPolling = useCallback((invoiceId) => {
//     clearInterval(pollRef.current);
//     let lastId = lastTelegramUpdate;
//     pollRef.current = setInterval(async () => {
//       const result = await pollForConfirmation(invoiceId, lastId);
//       lastId = result.lastUpdateId;
//       setLastTelegramUpdate(result.lastUpdateId);

//       if (result.status === 'confirmed') {
//         clearInterval(pollRef.current);
//         clearInterval(timerRef.current);
//         setPayStatus(PAY_STATUS.CONFIRMED);
//       } else if (result.status === 'cancelled') {
//         clearInterval(pollRef.current);
//         clearInterval(timerRef.current);
//         setPayStatus(PAY_STATUS.FAILED);
//       }
//     }, 4000);
//   }, [lastTelegramUpdate]);

//   // ── STEP 1: Proceed to payment — validate form & show QR ──
//   const handleProceedToPayment = () => {
//     setFormError('');
//     if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
//       setFormError('Required Fields Missing: Please enter your Name, Phone Number, and Address.');
//       return;
//     }

//     const date = new Date().toLocaleDateString('en-US', {
//       year: 'numeric', month: 'long', day: 'numeric',
//       hour: '2-digit', minute: '2-digit',
//     });
//     const uniqueId = Math.floor(100000 + Math.random() * 900000);

//     const invoice = {
//       id:           uniqueId,
//       accountEmail: userEmail,
//       customerName, items: [...cart],
//       subtotal,     shippingFee,  total: grandTotal,
//       phone:        phoneNumber,  address, mapLocation,
//       carrier:      deliveryMethod, date,
//       status:       'pending',
//     };

//     setPendingInvoice(invoice);
//     setProofFile(null);
//     setProofPreview(null);
//     setProofError('');
//     setPayStatus(PAY_STATUS.PENDING);
//     setShowQrModal(true);
//     startTimer();
//   };

//   // ── STEP 2: User clicked "I Have Transferred" → move to proof upload ──
//   const handleUserConfirm = () => {
//     if (payStatus !== PAY_STATUS.PENDING) return;
//     setPayStatus(PAY_STATUS.UPLOADING);
//     setProofError('');
//   };

//   // ── Handle file selection ──
//   const handleFileSelect = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     processFile(file);
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files?.[0];
//     if (!file) return;
//     processFile(file);
//   };

//   const processFile = (file) => {
//     setProofError('');
//     const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
//     if (!allowed.includes(file.type)) {
//       setProofError('Only images (JPG, PNG, WebP) or PDF files are accepted.');
//       return;
//     }
//     if (file.size > 10 * 1024 * 1024) { // 10 MB limit
//       setProofError('File too large. Maximum size is 10 MB.');
//       return;
//     }

//     setProofFile(file);

//     if (file.type !== 'application/pdf') {
//       const url = URL.createObjectURL(file);
//       setProofPreview(url);
//     } else {
//       setProofPreview(null); // PDF: show icon instead
//     }
//   };

//   const handleRemoveProof = () => {
//     if (proofPreview) URL.revokeObjectURL(proofPreview);
//     setProofFile(null);
//     setProofPreview(null);
//     setProofError('');
//     if (fileInputRef.current) fileInputRef.current.value = '';
//   };

//   // ── STEP 3: Submit proof to Telegram ──
//   const handleSubmitProof = async () => {
//     if (!proofFile) {
//       setProofError('Please attach your payment screenshot or PDF before submitting.');
//       return;
//     }

//     setPayStatus(PAY_STATUS.SUBMITTING);
//     setUploadProgress('Sending order details…');

//     try {
//       // 1. Send order alert text
//       await sendOrderAlert(pendingInvoice);

//       setUploadProgress('Uploading payment proof…');

//       // 2. Send the proof file
//       const proofResult = await sendPaymentProof(
//         proofFile,
//         pendingInvoice.id,
//         pendingInvoice.customerName,
//         pendingInvoice.total.toFixed(2)
//       );

//       if (!proofResult?.ok) {
//         throw new Error('File upload failed');
//       }

//       setUploadProgress('Waiting for admin confirmation…');

//       // 3. Start polling
//       setPayStatus(PAY_STATUS.VERIFYING);
//       startPolling(pendingInvoice.id);

//     } catch (err) {
//       console.error(err);
//       setProofError('Upload failed. Please check your connection and try again.');
//       setPayStatus(PAY_STATUS.UPLOADING);
//     }
//   };

//   // ── STEP 4: Owner confirmed via Telegram → finalize ──
//   useEffect(() => {
//     if (payStatus !== PAY_STATUS.CONFIRMED || !pendingInvoice) return;

//     const finalize = async () => {
//       const finalInvoice = saveOrder(pendingInvoice, orderHistory);
//       setInvoiceDetails(finalInvoice);

//       await sendPaymentConfirmedAlert(finalInvoice);

//       checkout();
//       setCustomerName(''); setPhoneNumber(''); setAddress(''); setMapLocation('');
//       setPendingInvoice(null);
//       setProofFile(null);
//       setProofPreview(null);
//       setShowQrModal(false);
//       setShowInvoiceModal(true);
//     };

//     finalize();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [payStatus]);

//   // ── Reset / retry payment ──
//   const handleRetry = () => {
//     clearInterval(timerRef.current);
//     clearInterval(pollRef.current);
//     setProofFile(null);
//     setProofPreview(null);
//     setProofError('');
//     setPayStatus(PAY_STATUS.PENDING);
//     startTimer();
//   };

//   const handleCancelPayment = () => {
//     clearInterval(timerRef.current);
//     clearInterval(pollRef.current);
//     if (proofPreview) URL.revokeObjectURL(proofPreview);
//     setPayStatus(PAY_STATUS.IDLE);
//     setShowQrModal(false);
//     setPendingInvoice(null);
//     setProofFile(null);
//     setProofPreview(null);
//   };

//   // ── Copy invoice ID ──
//   const copyInvoiceId = (id) => {
//     navigator.clipboard.writeText(`#${id}`);
//     setCopyFeedback(id);
//     setTimeout(() => setCopyFeedback(''), 1500);
//   };

//   // ── Delete history (admin only) ──
//   const handleDeleteHistoryItem = (orderId) => {
//     if (userRole !== 'admin') { alert('Access Denied.'); return; }
//     if (!window.confirm(`Permanently delete Order #${orderId}?`)) return;
//     const updated = orderHistory.filter(o => o.id !== orderId);
//     localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
//     setOrderHistory(updated);
//   };

//   // ── Share invoice ──
//   const handleShareInvoice = async () => {
//     if (!invoiceDetails) return;
//     const text = `PSP Mart Invoice #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}\nCustomer: ${invoiceDetails.customerName}`;
//     if (navigator.share) {
//       try { await navigator.share({ title: 'PSP Mart Receipt', text, url: window.location.href }); } catch {}
//     } else {
//       navigator.clipboard.writeText(text);
//       alert('Invoice copied to clipboard!');
//     }
//   };

//   // ── Timer display helpers ──
//   const timerMM     = String(Math.floor(qrSecondsLeft / 60)).padStart(2, '0');
//   const timerSS     = String(qrSecondsLeft % 60).padStart(2, '0');
//   const timerPct    = (qrSecondsLeft / QR_EXPIRY_SECONDS) * 100;
//   const timerUrgent = qrSecondsLeft <= 60;

//   // ─────────────────────────────────────────────────────────────────────────
//   return (
//     <div className="max-w-6xl mx-auto font-sans px-4">

//       {/* ═══ SCREEN VIEW ═══════════════════════════════════════════════════ */}
//       <div className="print:hidden">
//         {cart.length === 0 ? (
//           <div className="max-w-md mx-auto text-center py-16 bg-white border border-gray-100 rounded-2xl shadow-sm px-6 text-xs">
//             <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//             <h2 className="text-base font-bold text-gray-900 mb-1">Your cart is empty</h2>
//             <p className="text-gray-400 mb-6">Browse products and add them to start checkout.</p>
//             <button onClick={() => setShowHistoryModal(true)}
//               className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm">
//               <History size={14} className="text-blue-600" />
//               {userRole === 'admin' ? `Total Sales (${allowedHistory.length})` : `Purchase History (${allowedHistory.length})`}
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

//             {/* ── Left 2 columns ── */}
//             <div className="lg:col-span-2 space-y-6">

//               {/* Cart items */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
//                 <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
//                   <h2 className="text-base font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
//                     <ShoppingBag size={18} className="text-blue-700" /> Review Items ({cart.length})
//                   </h2>
//                   <button onClick={() => setShowHistoryModal(true)}
//                     className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1 bg-blue-50 py-1.5 px-3 rounded-lg transition">
//                     <History size={13} /> {userRole === 'admin' ? 'Total Sales' : 'My History'} ({allowedHistory.length})
//                   </button>
//                 </div>
//                 <div className="divide-y divide-gray-100">
//                   {cart.map(item => (
//                     <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0 text-xs">
//                       <div className="flex items-center space-x-3.5">
//                         <img src={item.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm" />
//                         <div>
//                           <h4 className="font-bold text-gray-900 line-clamp-1 text-sm">{item.name}</h4>
//                           <p className="text-blue-600 font-bold text-xs mt-0.5">${Number(item.price || 0).toFixed(2)}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center space-x-4">
//                         <div className="flex items-center space-x-2 border border-gray-200 rounded-xl p-1 bg-gray-50">
//                           <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Minus className="h-3 w-3" /></button>
//                           <span className="font-bold text-gray-900 px-1 w-5 text-center">{item.quantity}</span>
//                           <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-lg text-gray-500 shadow-sm transition"><Plus className="h-3 w-3" /></button>
//                         </div>
//                         <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Delivery form */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-4 mb-4 flex items-center gap-2">
//                   <MapPin size={18} className="text-blue-700" /> Delivery Routing Metadata
//                 </h2>
//                 {formError && (
//                   <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 font-semibold text-center border border-red-100 flex items-center gap-2">
//                     <AlertCircle size={14} /> {formError}
//                   </div>
//                 )}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {[
//                     { label: 'Recipient Full Name *', icon: User,  val: customerName, set: setCustomerName, ph: 'e.g., Phy Sopheak',             col: '' },
//                     { label: 'Contact Phone *',       icon: Phone, val: phoneNumber,  set: setPhoneNumber,  ph: 'e.g., 012 345 678',             col: '' },
//                     { label: 'Drop-off Address *',    icon: Home,  val: address,      set: setAddress,      ph: 'Street, House, Sangkat, Khan…', col: 'md:col-span-2' },
//                     { label: 'Google Maps Link (Optional)', icon: MapPin, val: mapLocation, set: setMapLocation, ph: 'https://maps.google.com/…', col: 'md:col-span-2', type: 'url' },
//                   ].map(({ label, icon: Icon, val, set, ph, col, type }) => (
//                     <div key={label} className={col}>
//                       <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1.5">{label}</label>
//                       <div className="relative">
//                         <Icon size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
//                         <input type={type || 'text'} placeholder={ph} value={val} onChange={e => set(e.target.value)}
//                           className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ── Right column ── */}
//             <div className="space-y-6">

//               {/* Carrier */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                   <Truck size={16} className="text-blue-700" /> Logistics Carrier
//                 </h2>
//                 <div className="space-y-2">
//                   {deliveryServices.map(({ id, name, rate, eta, icon: Icon }) => {
//                     const sel = deliveryMethod === name;
//                     return (
//                       <label key={id} onClick={() => { setDeliveryMethod(name); setShippingFee(rate); }}
//                         className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition ${sel ? 'border-blue-600 bg-blue-50/50 font-bold text-blue-900 shadow-sm' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}>
//                         <div className="flex items-center space-x-3">
//                           <Icon size={16} className={sel ? 'text-blue-600' : 'text-gray-400'} />
//                           <div>
//                             <span className="block font-bold">{name}</span>
//                             <span className="text-[10px] text-gray-400">ETA: {eta}</span>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <span className="block font-black text-blue-600">${rate.toFixed(2)}</span>
//                           <input type="radio" readOnly checked={sel} className="h-3 w-3 text-blue-600 mt-0.5" />
//                         </div>
//                       </label>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Order summary */}
//               <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm text-xs">
//                 <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
//                   <DollarSign size={16} className="text-blue-700" /> Order Summary
//                 </h2>
//                 <div className="space-y-3 pb-4 border-b border-gray-100 font-medium text-gray-500">
//                   <div className="flex justify-between"><span>Cart Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
//                   <div className="flex justify-between"><span>Shipping Fee</span><span className="font-bold text-gray-900">${shippingFee.toFixed(2)}</span></div>
//                   <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl text-[11px]">
//                     <span className="flex items-center gap-1 text-slate-600"><ShieldCheck size={14} className="text-green-600" /> Payment Protection</span>
//                     <span className="text-green-600 font-bold">Active</span>
//                   </div>
//                 </div>
//                 <div className="flex justify-between items-center pt-4 mb-5">
//                   <span className="font-black text-gray-900 uppercase text-xs">Grand Total</span>
//                   <span className="text-lg font-black text-blue-700">${grandTotal.toFixed(2)}</span>
//                 </div>
//                 <button onClick={handleProceedToPayment}
//                   className="w-full bg-blue-700 hover:bg-blue-800 text-white font-black py-3.5 rounded-xl transition shadow-md uppercase tracking-wider text-xs flex items-center justify-center gap-2">
//                   <ShieldCheck size={14} /> Authorize Payment via KHQR
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ═══ QR PAYMENT MODAL ══════════════════════════════════════════════ */}
//       {showQrModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
//           <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">

//             {/* Modal header */}
//             <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 pt-6 pb-5 text-white text-center">
//               <div className="flex items-center justify-center gap-2 mb-1">
//                 <ShieldCheck size={16} className="opacity-80" />
//                 <span className="text-xs font-bold tracking-widest uppercase opacity-80">Bakong KHQR · NBC Licensed</span>
//               </div>
//               <div className="text-3xl font-black">${grandTotal.toFixed(2)}</div>
//               <div className="text-blue-200 text-xs mt-1">Invoice #{pendingInvoice?.id}</div>

//               {/* Progress steps */}
//               <div className="flex items-center justify-center gap-2 mt-3">
//                 {['Scan & Pay', 'Upload Proof', 'Confirmed'].map((step, i) => {
//                   const stepStatuses = [
//                     [PAY_STATUS.PENDING],
//                     [PAY_STATUS.UPLOADING, PAY_STATUS.SUBMITTING],
//                     [PAY_STATUS.VERIFYING, PAY_STATUS.CONFIRMED],
//                   ];
//                   const isActive = stepStatuses[i].includes(payStatus);
//                   const isPast = (
//                     (i === 0 && [PAY_STATUS.UPLOADING, PAY_STATUS.SUBMITTING, PAY_STATUS.VERIFYING, PAY_STATUS.CONFIRMED].includes(payStatus)) ||
//                     (i === 1 && [PAY_STATUS.VERIFYING, PAY_STATUS.CONFIRMED].includes(payStatus))
//                   );
//                   return (
//                     <React.Fragment key={step}>
//                       <div className="flex flex-col items-center">
//                         <div className={`w-5 h-5 rounded-full text-[9px] font-black flex items-center justify-center border-2 transition
//                           ${isPast ? 'bg-white border-white text-blue-700' :
//                             isActive ? 'bg-blue-500 border-white text-white' :
//                             'bg-transparent border-blue-400 text-blue-300'}`}>
//                           {isPast ? '✓' : i + 1}
//                         </div>
//                         <span className={`text-[8px] mt-0.5 font-bold ${isActive || isPast ? 'text-white' : 'text-blue-400'}`}>{step}</span>
//                       </div>
//                       {i < 2 && <div className={`w-6 h-px mb-3 ${isPast ? 'bg-white' : 'bg-blue-400/40'}`} />}
//                     </React.Fragment>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="px-6 pb-6 pt-4">

//               {/* ── STEP 1: PENDING — show QR ── */}
//               {payStatus === PAY_STATUS.PENDING && (
//                 <>
//                   <div className="mb-3">
//                     <div className="flex justify-between items-center mb-1">
//                       <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
//                         <Timer size={10} /> QR Expires In
//                       </span>
//                       <span className={`font-black text-sm font-mono ${timerUrgent ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
//                         {timerMM}:{timerSS}
//                       </span>
//                     </div>
//                     <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                       <div className={`h-full rounded-full transition-all duration-1000 ${timerUrgent ? 'bg-red-500' : 'bg-blue-500'}`}
//                         style={{ width: `${timerPct}%` }} />
//                     </div>
//                   </div>

//                   <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-center mb-3 shadow-inner">
//                     <img src={khqrImage} alt="KHQR" className="w-52 h-52 object-contain" />
//                   </div>

//                   <p className="text-center text-[11px] text-gray-400 mb-4">
//                     Open <b>Bakong App</b> → Scan QR → Transfer <b>${grandTotal.toFixed(2)}</b> → tap confirm below
//                   </p>

//                   <div className="flex gap-3 text-xs font-bold">
//                     <button onClick={handleCancelPayment}
//                       className="w-2/5 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition">
//                       Cancel
//                     </button>
//                     <button onClick={handleUserConfirm}
//                       className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2">
//                       <CheckCircle2 size={14} /> I Have Transferred
//                     </button>
//                   </div>
//                 </>
//               )}

//               {/* ── STEP 2: UPLOADING — attach proof of payment ── */}
//               {payStatus === PAY_STATUS.UPLOADING && (
//                 <div>
//                   <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
//                     <ShieldCheck size={14} className="text-amber-600 mt-0.5 shrink-0" />
//                     <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
//                       To protect both parties, please attach a screenshot or PDF of your Bakong transfer confirmation. This is sent directly to the shop owner for verification.
//                     </p>
//                   </div>

//                   {/* Drop zone */}
//                   {!proofFile ? (
//                     <div
//                       onDrop={handleDrop}
//                       onDragOver={e => e.preventDefault()}
//                       onClick={() => fileInputRef.current?.click()}
//                       className="border-2 border-dashed border-gray-300 hover:border-blue-400 bg-gray-50 hover:bg-blue-50/30 rounded-2xl p-6 text-center cursor-pointer transition group mb-3">
//                       <div className="flex flex-col items-center gap-2">
//                         <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition">
//                           <Upload size={20} className="text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs font-bold text-gray-700">Drop your file here or <span className="text-blue-600">browse</span></p>
//                           <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP or PDF · Max 10 MB</p>
//                         </div>
//                         <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
//                           <span className="flex items-center gap-1"><ImagePlus size={10} /> Screenshot</span>
//                           <span>or</span>
//                           <span className="flex items-center gap-1"><FileText size={10} /> PDF Receipt</span>
//                         </div>
//                       </div>
//                       <input ref={fileInputRef} type="file" accept="image/*,application/pdf"
//                         onChange={handleFileSelect} className="hidden" />
//                     </div>
//                   ) : (
//                     /* File preview */
//                     <div className="border border-green-200 bg-green-50 rounded-2xl p-3 mb-3 relative">
//                       <button onClick={handleRemoveProof}
//                         className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-0.5 hover:bg-red-50 hover:border-red-300 transition">
//                         <X size={12} className="text-gray-500" />
//                       </button>

//                       {proofPreview ? (
//                         <img src={proofPreview} alt="Payment proof" className="w-full max-h-40 object-contain rounded-xl mb-2" />
//                       ) : (
//                         <div className="flex items-center gap-3 mb-2">
//                           <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
//                             <FileText size={18} className="text-red-600" />
//                           </div>
//                           <div>
//                             <p className="text-xs font-bold text-gray-800 truncate max-w-[180px]">{proofFile.name}</p>
//                             <p className="text-[10px] text-gray-400">PDF Document</p>
//                           </div>
//                         </div>
//                       )}

//                       <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-bold">
//                         <CheckCircle2 size={11} className="text-green-600" />
//                         {proofFile.name} · {(proofFile.size / 1024).toFixed(0)} KB
//                       </div>
//                     </div>
//                   )}

//                   {proofError && (
//                     <div className="flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl p-2.5 mb-3">
//                       <AlertCircle size={12} className="shrink-0" /> {proofError}
//                     </div>
//                   )}

//                   <div className="flex gap-3 text-xs font-bold">
//                     <button onClick={() => setPayStatus(PAY_STATUS.PENDING)}
//                       className="w-2/5 border border-gray-200 text-gray-500 py-3 rounded-xl hover:bg-gray-50 transition">
//                       ← Back
//                     </button>
//                     <button onClick={handleSubmitProof} disabled={!proofFile}
//                       className={`flex-1 py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${proofFile ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
//                       <Send size={13} /> Submit Proof
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* ── STEP 2b: SUBMITTING — uploading to Telegram ── */}
//               {payStatus === PAY_STATUS.SUBMITTING && (
//                 <div className="text-center py-6">
//                   <div className="relative inline-flex items-center justify-center mb-4">
//                     <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
//                     <Upload size={20} className="absolute text-blue-600" />
//                   </div>
//                   <h3 className="font-black text-gray-900 text-sm mb-1">Sending to Shop Owner…</h3>
//                   <p className="text-gray-400 text-xs">{uploadProgress}</p>
//                 </div>
//               )}

//               {/* ── STEP 3: VERIFYING — waiting for admin /confirm ── */}
//               {payStatus === PAY_STATUS.VERIFYING && (
//                 <div className="text-center py-4">
//                   <div className="relative inline-flex items-center justify-center mb-4">
//                     <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
//                     <Wifi size={22} className="absolute text-blue-600" />
//                   </div>
//                   <h3 className="font-black text-gray-900 text-sm mb-1">Proof Submitted!</h3>
//                   <p className="text-gray-400 text-xs mb-2">Shop owner is reviewing your payment proof.</p>

//                   <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-left">
//                     <div className="flex items-center gap-2 mb-1">
//                       <CheckCircle2 size={12} className="text-green-600" />
//                       <span className="text-[11px] font-bold text-green-800">Receipt delivered to admin</span>
//                     </div>
//                     <p className="text-[10px] text-green-700 font-mono">
//                       Auto-checking for approval every 4s…
//                     </p>
//                   </div>

//                   <div className="flex items-center justify-center gap-1 mb-4">
//                     <Timer size={11} className={timerUrgent ? 'text-red-500' : 'text-gray-400'} />
//                     <span className={`font-mono font-black text-sm ${timerUrgent ? 'text-red-600 animate-pulse' : 'text-gray-600'}`}>
//                       {timerMM}:{timerSS} remaining
//                     </span>
//                   </div>

//                   <button onClick={handleCancelPayment}
//                     className="w-full border border-gray-200 text-gray-400 py-2.5 rounded-xl hover:bg-gray-50 font-bold text-xs">
//                     Cancel Order
//                   </button>
//                 </div>
//               )}

//               {/* ── EXPIRED ── */}
//               {payStatus === PAY_STATUS.EXPIRED && (
//                 <div className="text-center py-4">
//                   <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-4">
//                     <Clock size={28} className="text-amber-500" />
//                   </div>
//                   <h3 className="font-black text-gray-900 text-sm mb-1">QR Code Expired</h3>
//                   <p className="text-gray-400 text-xs mb-4">The payment window has closed. Generate a new QR to try again.</p>
//                   <div className="flex gap-3 text-xs font-bold">
//                     <button onClick={handleCancelPayment}
//                       className="flex-1 border border-gray-200 text-gray-500 py-3 rounded-xl">Cancel</button>
//                     <button onClick={handleRetry}
//                       className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl flex items-center justify-center gap-1.5">
//                       <RefreshCw size={12} /> New QR Code
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* ── FAILED / CANCELLED BY OWNER ── */}
//               {payStatus === PAY_STATUS.FAILED && (
//                 <div className="text-center py-4">
//                   <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto mb-4">
//                     <WifiOff size={28} className="text-red-500" />
//                   </div>
//                   <h3 className="font-black text-red-700 text-sm mb-1">Order Rejected</h3>
//                   <p className="text-gray-400 text-xs mb-4">The shop owner could not verify this payment. Please contact support or try again.</p>
//                   <button onClick={handleCancelPayment}
//                     className="w-full border border-gray-200 text-gray-600 py-3 rounded-xl font-bold text-xs">
//                     Close
//                   </button>
//                 </div>
//               )}

//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══ INVOICE MODAL ═════════════════════════════════════════════════ */}
//       {showInvoiceModal && invoiceDetails && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[60] print:hidden">
//           <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
//             <div className="text-xs text-gray-800">
//               <div className="text-center pb-4 border-b border-dashed border-gray-300">
//                 <CheckCircle2 className="h-9 w-9 text-green-500 mx-auto mb-2" />
//                 <h2 className="text-xl font-black tracking-wide text-gray-900 uppercase">PSP MART INVOICE</h2>
//                 <p className="text-gray-400 text-[10px]">Payment Verified · High Quality Product Logistics</p>
//               </div>

//               <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
//                 <div>
//                   <span className="text-gray-400 block">Invoice ID</span>
//                   <button onClick={() => copyInvoiceId(invoiceDetails.id)}
//                     className="font-bold text-gray-900 flex items-center gap-1 hover:text-blue-600">
//                     #{invoiceDetails.id}
//                     {copyFeedback === invoiceDetails.id ? <CheckCircle2 size={10} className="text-green-500" /> : <Copy size={10} />}
//                   </button>
//                 </div>
//                 <div className="text-right"><span className="text-gray-400 block">Date</span><span className="font-medium text-gray-600">{invoiceDetails.date}</span></div>
//                 <div><span className="text-gray-400 block">Customer</span><span className="font-bold text-gray-900">{invoiceDetails.customerName}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Phone</span><span className="font-medium text-gray-900">{invoiceDetails.phone}</span></div>
//                 <div><span className="text-gray-400 block">Carrier</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
//                 <div className="text-right"><span className="text-gray-400 block">Shipping</span><span className="font-bold text-gray-900">${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Account</span><span className="font-medium text-blue-600">{invoiceDetails.accountEmail}</span></div>
//                 <div className="col-span-2"><span className="text-gray-400 block">Address</span><span className="font-medium text-gray-900">{invoiceDetails.address}</span></div>
//                 {invoiceDetails.mapLocation && (
//                   <div className="col-span-2">
//                     <a href={invoiceDetails.mapLocation} target="_blank" rel="noreferrer"
//                       className="flex items-center gap-1 text-blue-500 hover:underline font-medium">
//                       <ExternalLink size={10} /> View Map Route
//                     </a>
//                   </div>
//                 )}
//               </div>

//               <div className="py-3 border-b border-dashed border-gray-300">
//                 <span className="block font-black uppercase tracking-wider text-gray-400 text-[9px] mb-2">Itemized Manifest</span>
//                 <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
//                   {invoiceDetails.items.map((item, idx) => (
//                     <div key={idx} className="flex justify-between items-center text-[11px] bg-slate-50 p-1.5 rounded-lg border border-slate-100/60">
//                       <span className="font-medium text-gray-900">{item.name} <span className="text-blue-600 font-bold">×{item.quantity}</span></span>
//                       <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-4 flex justify-between items-center">
//                 <span className="text-xs font-black uppercase tracking-wider text-gray-900">Total Paid</span>
//                 <span className="text-xl font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="mt-5 grid grid-cols-2 gap-3 font-bold text-xs">
//               <button onClick={() => window.print()}
//                 className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 shadow-sm">
//                 <Download size={14} /> Print Receipt
//               </button>
//               <button onClick={handleShareInvoice}
//                 className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 shadow-md">
//                 <Share2 size={14} /> Share Invoice
//               </button>
//               <button onClick={() => setShowInvoiceModal(false)}
//                 className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2.5 rounded-xl hover:bg-gray-50">
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══ HISTORY MODAL ═════════════════════════════════════════════════ */}
//       {showHistoryModal && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:hidden">
//           <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[80vh] flex flex-col border border-gray-100">
//             <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-2">
//               <h3 className="text-base font-black text-gray-900 flex items-center gap-2 uppercase tracking-wide">
//                 <Receipt size={18} className="text-blue-700" />
//                 {userRole === 'admin' ? 'Sales Manifest (Admin)' : 'My Purchase History'}
//               </h3>
//               <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">{filteredHistory.length} records</span>
//             </div>

//             <div className="relative my-2">
//               <Search size={14} className="absolute left-3 top-3.5 text-gray-400" />
//               <input type="text" placeholder="Search by Invoice ID, Name, or Phone…"
//                 value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
//                 className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white outline-none transition" />
//               {searchQuery && (
//                 <button onClick={() => setSearchQuery('')}
//                   className="absolute right-3 top-2.5 font-bold text-gray-400 hover:text-gray-600 text-[10px] bg-gray-200/60 px-1.5 py-0.5 rounded">
//                   Clear
//                 </button>
//               )}
//             </div>

//             <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs mt-2">
//               {filteredHistory.length === 0 ? (
//                 <div className="text-center py-12 text-gray-400 italic">No records found.</div>
//               ) : filteredHistory.map(order => (
//                 <div key={order.id} className="bg-slate-50/70 p-4 border border-slate-100 rounded-xl hover:border-blue-300 transition shadow-sm">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <span className="font-black text-gray-900 block">Invoice #{order.id}</span>
//                       <span className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><Clock size={10} /> {order.date}</span>
//                     </div>
//                     <span className="font-black text-blue-700 text-sm">${order.total.toFixed(2)}</span>
//                   </div>
//                   <div className="text-gray-500 space-y-0.5 border-t border-gray-200/60 pt-2 text-[11px]">
//                     {userRole === 'admin' && (
//                       <div className="text-red-600 font-bold"><span className="text-gray-700 font-semibold">Email:</span> {order.accountEmail}</div>
//                     )}
//                     <div><span className="font-semibold text-gray-700">Customer:</span> {order.customerName} ({order.phone})</div>
//                     <div className="text-[11px] text-slate-500 italic mt-1">{order.items.reduce((s, i) => s + i.quantity, 0)} item(s) · {order.carrier}</div>
//                   </div>
//                   <div className="mt-3 flex gap-2">
//                     <button onClick={() => { setInvoiceDetails(order); setShowInvoiceModal(true); }}
//                       className="flex-1 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold py-2 rounded-xl text-[11px] shadow-sm transition flex items-center justify-center gap-1.5">
//                       <Receipt size={13} /> View Invoice
//                     </button>
//                     {userRole === 'admin' && (
//                       <button onClick={() => handleDeleteHistoryItem(order.id)}
//                         className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold p-2 rounded-xl transition">
//                         <Trash2 size={14} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button onClick={() => setShowHistoryModal(false)}
//               className="mt-5 w-full bg-slate-900 hover:bg-black text-white font-bold py-3 rounded-xl transition text-xs tracking-wider uppercase">
//               Return to Checkout
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ═══ PRINT LAYOUT ══════════════════════════════════════════════════ */}
//       {invoiceDetails && (
//         <div className="hidden print:block text-black bg-white p-0 text-[12px] font-mono leading-tight max-w-[80mm] mx-auto">
//           <div className="text-center border-b border-black pb-3 mb-3">
//             <h1 className="text-lg font-black tracking-wide">PSP MART RECEIPT</h1>
//             <p className="text-[10px]">Phnom Penh, Cambodia · KHQR Verified</p>
//           </div>
//           <div className="space-y-1 pb-2 border-b border-black">
//             <div><strong>INVOICE:</strong> #{invoiceDetails.id}</div>
//             <div><strong>DATE:</strong> {invoiceDetails.date}</div>
//             <div><strong>CUSTOMER:</strong> {invoiceDetails.customerName}</div>
//             <div><strong>PHONE:</strong> {invoiceDetails.phone}</div>
//             <div><strong>CARRIER:</strong> {invoiceDetails.carrier}</div>
//             <div><strong>EMAIL:</strong> {invoiceDetails.accountEmail}</div>
//             <div><strong>ADDRESS:</strong> {invoiceDetails.address}</div>
//           </div>
//           <div className="py-2 border-b border-black">
//             <div className="flex justify-between font-bold text-[11px] mb-1"><span>Item</span><span>Total</span></div>
//             {invoiceDetails.items.map((item, i) => (
//               <div key={i} className="flex justify-between">
//                 <span>{item.name} (×{item.quantity})</span>
//                 <span>${(item.price * item.quantity).toFixed(2)}</span>
//               </div>
//             ))}
//           </div>
//           <div className="pt-2 space-y-1 text-right">
//             <div className="flex justify-between"><span>Subtotal:</span><span>${invoiceDetails.subtotal.toFixed(2)}</span></div>
//             <div className="flex justify-between"><span>Shipping:</span><span>${invoiceDetails.shippingFee.toFixed(2)}</span></div>
//             <div className="flex justify-between text-sm font-black pt-1 border-t border-dotted border-black">
//               <span>GRAND TOTAL:</span><span>${invoiceDetails.total.toFixed(2)}</span>
//             </div>
//           </div>
//           <div className="text-center pt-6 mt-6 border-t border-black text-[10px]">
//             <p>Thank you for shopping with PSP Mart!</p>
//             <p>Please retain receipt for verification.</p>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }





















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
  PENDING:    'pending',    // QR shown, waiting
  UPLOADING:  'uploading',  // User clicked "I Have Transferred" — now must attach proof
  SUBMITTING: 'submitting', // Sending proof to Telegram
  VERIFYING:  'verifying',  // Proof sent, waiting for admin /confirm
  CONFIRMED:  'confirmed',  // Admin replied /confirm_XXXXXX
  EXPIRED:    'expired',    // Timer ran out
  FAILED:     'failed',     // Error / admin cancelled
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

// Send multipart form (for photo/document upload)
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

// Send the NEW ORDER alert to the shop owner
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

// Send the payment proof file (image → sendPhoto, PDF → sendDocument)
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

// Send PAYMENT CONFIRMED alert
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

// Poll Telegram for confirmation reply from owner
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
      {/* Header */}
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

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {visible.map(product => {
          const inCart  = cartIds.has(product.id);
          const justAdded = addedId === product.id;
          const rating = product.rating ?? (3.5 + Math.random() * 1.5).toFixed(1);
          const reviews = product.reviews ?? Math.floor(10 + Math.random() * 290);

          return (
            <div key={product.id}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">

              {/* Image */}
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

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug mb-1">{product.name}</h3>

                {/* Star rating */}
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

      {/* Pagination dots */}
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

  // Modals
  const [showQrModal,      setShowQrModal]      = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Invoice & history
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [orderHistory,   setOrderHistory]   = useState([]);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Delivery form
  const [customerName,    setCustomerName]    = useState('');
  const [phoneNumber,     setPhoneNumber]     = useState('');
  const [address,         setAddress]         = useState('');
  const [mapLocation,     setMapLocation]     = useState('');
  const [deliveryMethod,  setDeliveryMethod]  = useState('Standard Home Delivery');
  const [shippingFee,     setShippingFee]     = useState(1.00);
  const [formError,       setFormError]       = useState('');

  // ── Payment flow state ──
  const [payStatus,          setPayStatus]          = useState(PAY_STATUS.IDLE);
  const [qrSecondsLeft,      setQrSecondsLeft]      = useState(QR_EXPIRY_SECONDS);
  const [pendingInvoice,     setPendingInvoice]      = useState(null);
  const [lastTelegramUpdate, setLastTelegramUpdate]  = useState(null);
  const [copyFeedback,       setCopyFeedback]        = useState('');

  // ── Proof of payment upload state ──
  const [proofFile,     setProofFile]     = useState(null);   // File object
  const [proofPreview,  setProofPreview]  = useState(null);   // Object URL for image preview
  const [proofError,    setProofError]    = useState('');
  const [uploadProgress, setUploadProgress] = useState('');
  const fileInputRef = useRef(null);

  const timerRef   = useRef(null);
  const pollRef    = useRef(null);
  const secondsRef = useRef(QR_EXPIRY_SECONDS);

  // ── Load history ──
  const loadHistory = useCallback(() => {
    const saved = localStorage.getItem('psp_market_order_history');
    setOrderHistory(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    loadHistory();
    const iv = setInterval(loadHistory, 1500);
    return () => clearInterval(iv);
  }, [loadHistory]);

  // ── Cleanup on unmount ──
  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(pollRef.current);
    if (proofPreview) URL.revokeObjectURL(proofPreview);
  }, []);

  // ── Filtered history ──
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

  // ── Delivery services ──
  const deliveryServices = [
    { id: 'home',      name: 'Standard Home Delivery', rate: 1.00, eta: '1-2 Days',   icon: Home },
    { id: 'vireak',    name: 'Vireak Buntham Express', rate: 1.75, eta: 'Next Day',    icon: Truck },
    { id: 'foodpanda', name: 'FoodPanda Instant',      rate: 2.50, eta: '30-45 Mins', icon: ShoppingBag },
    { id: 'wownow',    name: 'WOW NOW Logistics',      rate: 1.50, eta: 'Same Day',   icon: Truck },
    { id: 'egets',     name: 'E-GetS Delivery',        rate: 2.00, eta: '40 Mins',    icon: Truck },
  ];

  const subtotal   = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const grandTotal = subtotal + shippingFee;

  // ── Save order to localStorage ──
  const saveOrder = useCallback((invoice, history) => {
    const existIdx = history.findIndex(
      o => o.customerName.toLowerCase().trim() === invoice.customerName.toLowerCase().trim() &&
           o.phone.trim() === invoice.phone.trim() &&
           o.accountEmail === invoice.accountEmail
    );

    let updated;
    if (existIdx !== -1) {
      const merged = [...history[existIdx].items];
      invoice.items.forEach(ni => {
        const mi = merged.findIndex(i => i.id === ni.id);
        mi !== -1 ? (merged[mi].quantity += ni.quantity) : merged.push({ ...ni });
      });
      const newSub = merged.reduce((s, i) => s + i.price * i.quantity, 0);
      const final  = { ...history[existIdx], items: merged, subtotal: newSub, total: newSub + history[existIdx].shippingFee, date: invoice.date };
      updated = [...history];
      updated.splice(existIdx, 1);
      updated.unshift(final);
      localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
      setOrderHistory(updated);
      return final;
    } else {
      updated = [invoice, ...history];
      localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
      setOrderHistory(updated);
      return invoice;
    }
  }, []);

  // ── Start QR expiry countdown ──
  const startTimer = useCallback(() => {
    secondsRef.current = QR_EXPIRY_SECONDS;
    setQrSecondsLeft(QR_EXPIRY_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      secondsRef.current -= 1;
      setQrSecondsLeft(secondsRef.current);
      if (secondsRef.current <= 0) {
        clearInterval(timerRef.current);
        clearInterval(pollRef.current);
        setPayStatus(PAY_STATUS.EXPIRED);
      }
    }, 1000);
  }, []);

  // ── Start polling Telegram for /confirm ──
  const startPolling = useCallback((invoiceId) => {
    clearInterval(pollRef.current);
    let lastId = lastTelegramUpdate;
    pollRef.current = setInterval(async () => {
      const result = await pollForConfirmation(invoiceId, lastId);
      lastId = result.lastUpdateId;
      setLastTelegramUpdate(result.lastUpdateId);

      if (result.status === 'confirmed') {
        clearInterval(pollRef.current);
        clearInterval(timerRef.current);
        setPayStatus(PAY_STATUS.CONFIRMED);
      } else if (result.status === 'cancelled') {
        clearInterval(pollRef.current);
        clearInterval(timerRef.current);
        setPayStatus(PAY_STATUS.FAILED);
      }
    }, 4000);
  }, [lastTelegramUpdate]);

  // ── STEP 1: Proceed to payment — validate form & show QR ──
  const handleProceedToPayment = () => {
    setFormError('');
    if (!customerName.trim() || !phoneNumber.trim() || !address.trim()) {
      setFormError('Required Fields Missing: Please enter your Name, Phone Number, and Address.');
      return;
    }

    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
    const uniqueId = Math.floor(100000 + Math.random() * 900000);

    const invoice = {
      id:           uniqueId,
      accountEmail: userEmail,
      customerName, items: [...cart],
      subtotal,     shippingFee,  total: grandTotal,
      phone:        phoneNumber,  address, mapLocation,
      carrier:      deliveryMethod, date,
      status:       'pending',
    };

    setPendingInvoice(invoice);
    setProofFile(null);
    setProofPreview(null);
    setProofError('');
    setPayStatus(PAY_STATUS.PENDING);
    setShowQrModal(true);
    startTimer();
  };

  // ── STEP 2: User clicked "I Have Transferred" → move to proof upload ──
  const handleUserConfirm = () => {
    if (payStatus !== PAY_STATUS.PENDING) return;
    setPayStatus(PAY_STATUS.UPLOADING);
    setProofError('');
  };

  // ── Handle file selection ──
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    setProofError('');
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setProofError('Only images (JPG, PNG, WebP) or PDF files are accepted.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10 MB limit
      setProofError('File too large. Maximum size is 10 MB.');
      return;
    }

    setProofFile(file);

    if (file.type !== 'application/pdf') {
      const url = URL.createObjectURL(file);
      setProofPreview(url);
    } else {
      setProofPreview(null); // PDF: show icon instead
    }
  };

  const handleRemoveProof = () => {
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofFile(null);
    setProofPreview(null);
    setProofError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── STEP 3: Submit proof to Telegram ──
  const handleSubmitProof = async () => {
    if (!proofFile) {
      setProofError('Please attach your payment screenshot or PDF before submitting.');
      return;
    }

    setPayStatus(PAY_STATUS.SUBMITTING);
    setUploadProgress('Sending order details…');

    try {
      // 1. Send order alert text
      await sendOrderAlert(pendingInvoice);

      setUploadProgress('Uploading payment proof…');

      // 2. Send the proof file
      const proofResult = await sendPaymentProof(
        proofFile,
        pendingInvoice.id,
        pendingInvoice.customerName,
        pendingInvoice.total.toFixed(2)
      );

      if (!proofResult?.ok) {
        throw new Error('File upload failed');
      }

      setUploadProgress('Waiting for admin confirmation…');

      // 3. Start polling
      setPayStatus(PAY_STATUS.VERIFYING);
      startPolling(pendingInvoice.id);

    } catch (err) {
      console.error(err);
      setProofError('Upload failed. Please check your connection and try again.');
      setPayStatus(PAY_STATUS.UPLOADING);
    }
  };

  // ── STEP 4: Owner confirmed via Telegram → finalize ──
  useEffect(() => {
    if (payStatus !== PAY_STATUS.CONFIRMED || !pendingInvoice) return;

    const finalize = async () => {
      const finalInvoice = saveOrder(pendingInvoice, orderHistory);
      setInvoiceDetails(finalInvoice);

      await sendPaymentConfirmedAlert(finalInvoice);

      checkout();
      setCustomerName(''); setPhoneNumber(''); setAddress(''); setMapLocation('');
      setPendingInvoice(null);
      setProofFile(null);
      setProofPreview(null);
      setShowQrModal(false);
      setShowInvoiceModal(true);
    };

    finalize();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payStatus]);

  // ── Reset / retry payment ──
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

  // ── Copy invoice ID ──
  const copyInvoiceId = (id) => {
    navigator.clipboard.writeText(`#${id}`);
    setCopyFeedback(id);
    setTimeout(() => setCopyFeedback(''), 1500);
  };

  // ── Delete history (admin only) ──
  const handleDeleteHistoryItem = (orderId) => {
    if (userRole !== 'admin') { alert('Access Denied.'); return; }
    if (!window.confirm(`Permanently delete Order #${orderId}?`)) return;
    const updated = orderHistory.filter(o => o.id !== orderId);
    localStorage.setItem('psp_market_order_history', JSON.stringify(updated));
    setOrderHistory(updated);
  };

  // ── Share invoice ──
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

  // ── Timer display helpers ──
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

            {/* ── Left 2 columns ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Cart items */}
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

              {/* Delivery form */}
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

            {/* ── Right column ── */}
            <div className="space-y-6">

              {/* Carrier */}
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

              {/* Order summary */}
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
        // Build a category-based similarity set first, then fill with random picks
        const cartCategories = new Set(cart.map(i => i.category).filter(Boolean));
        const allProducts = Array.isArray(products) ? products : [];

        const similar = [
          // Prefer same category, not in cart
          ...allProducts.filter(p => !cartIds.has(p.id) && cartCategories.has(p.category)),
          // Then fill with any other products not in cart
          ...allProducts.filter(p => !cartIds.has(p.id) && !cartCategories.has(p.category)),
        ].slice(0, 12); // cap at 12 for the carousel

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

            {/* Modal header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 pt-6 pb-5 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck size={16} className="opacity-80" />
                <span className="text-xs font-bold tracking-widest uppercase opacity-80">Bakong KHQR · NBC Licensed</span>
              </div>
              <div className="text-3xl font-black">${grandTotal.toFixed(2)}</div>
              <div className="text-blue-200 text-xs mt-1">Invoice #{pendingInvoice?.id}</div>

              {/* Progress steps */}
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

              {/* ── STEP 1: PENDING — show QR ── */}
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

              {/* ── STEP 2: UPLOADING — attach proof of payment ── */}
              {payStatus === PAY_STATUS.UPLOADING && (
                <div>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <ShieldCheck size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                      To protect both parties, please attach a screenshot or PDF of your Bakong transfer confirmation. This is sent directly to the shop owner for verification.
                    </p>
                  </div>

                  {/* Drop zone */}
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
                    /* File preview */
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

              {/* ── STEP 2b: SUBMITTING — uploading to Telegram ── */}
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

              {/* ── STEP 3: VERIFYING — waiting for admin /confirm ── */}
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

              {/* ── EXPIRED ── */}
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

              {/* ── FAILED / CANCELLED BY OWNER ── */}
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

      {/* ═══ PRINT LAYOUT ══════════════════════════════════════════════════ */}
      {invoiceDetails && (
        <div className="hidden print:block text-black bg-white p-0 text-[12px] font-mono leading-tight max-w-[80mm] mx-auto">
          <div className="text-center border-b border-black pb-3 mb-3">
            <h1 className="text-lg font-black tracking-wide">PSP MART RECEIPT</h1>
            <p className="text-[10px]">Phnom Penh, Cambodia · KHQR Verified</p>
          </div>
          <div className="space-y-1 pb-2 border-b border-black">
            <div><strong>INVOICE:</strong> #{invoiceDetails.id}</div>
            <div><strong>DATE:</strong> {invoiceDetails.date}</div>
            <div><strong>CUSTOMER:</strong> {invoiceDetails.customerName}</div>
            <div><strong>PHONE:</strong> {invoiceDetails.phone}</div>
            <div><strong>CARRIER:</strong> {invoiceDetails.carrier}</div>
            <div><strong>EMAIL:</strong> {invoiceDetails.accountEmail}</div>
            <div><strong>ADDRESS:</strong> {invoiceDetails.address}</div>
          </div>
          <div className="py-2 border-b border-black">
            <div className="flex justify-between font-bold text-[11px] mb-1"><span>Item</span><span>Total</span></div>
            {invoiceDetails.items.map((item, i) => (
              <div key={i} className="flex justify-between">
                <span>{item.name} (×{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="pt-2 space-y-1 text-right">
            <div className="flex justify-between"><span>Subtotal:</span><span>${invoiceDetails.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping:</span><span>${invoiceDetails.shippingFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm font-black pt-1 border-t border-dotted border-black">
              <span>GRAND TOTAL:</span><span>${invoiceDetails.total.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-center pt-6 mt-6 border-t border-black text-[10px]">
            <p>Thank you for shopping with PSP Mart!</p>
            <p>Please retain receipt for verification.</p>
          </div>
        </div>
      )}

    </div>
  );
  
}