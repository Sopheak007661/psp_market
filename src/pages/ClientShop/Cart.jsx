import React, { useState, useContext, useRef } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Trash2, Minus, Plus, ShoppingBag, MapPin, Phone, Home, Truck, Download, Share2, CheckCircle2 } from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, checkout, khqrImage } = useContext(ShopContext);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  
  // Invoice state to persist summary after cart wipes out
  const [invoiceDetails, setInvoiceDetails] = useState(null);

  // Delivery Form State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [mapLocation, setMapLocation] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('Home Delivery');
  const [formError, setFormError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Delivery service partners configuration
  const deliveryServices = [
    { id: 'home', name: 'Standard Home Delivery', icon: Home },
    { id: 'vireak', name: 'Vireak Buntham', icon: Truck },
    { id: 'foodpanda', name: 'FoodPanda Express', icon: ShoppingBag },
    { id: 'wownow', name: 'WOW NOW Logistics', icon: Truck },
    { id: 'egets', name: 'E-GetS Delivery', icon: Truck },
  ];

  // Trigger Telegram Notification Webhook
  const sendTelegramAlert = async (invoiceId, currentCart) => {
    const TELEGRAM_BOT_TOKEN = "8999298089:AAHxNNQFkXy6Toucptt8oHt25yTVfago8jg"; 
    const TELEGRAM_CHAT_ID = "6710148858";     

    let itemDetails = currentCart.map(item => `• ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    const message = `
🔔 *NEW ORDER RECEIVED - PSP MART* 🔔
----------------------------------
🆔 *Invoice ID:* #${invoiceId}
💰 *Grand Total:* $${subtotal.toFixed(2)}
🚚 *Service Provider:* ${deliveryMethod}

📦 *Product Summary:*
${itemDetails}

📍 *Delivery Information:*
• *Phone:* ${phoneNumber}
• *Address:* ${address}
• *Map Link:* ${mapLocation ? mapLocation : 'None provided'}
----------------------------------
🚀 *Action Required:* Please prepare packages for delivery!
`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.error("Failed to transmit order alert to Telegram channel:", err);
    }
  };

  // Validate form details before pulling up QR modal
  const handleProceedToPayment = () => {
    setFormError('');
    if (!phoneNumber.trim() || !address.trim()) {
      setFormError('Please input your delivery address and contact phone number first.');
      return;
    }
    setShowQrModal(true);
  };

  const handleFinalizePayment = async () => {
    setShowQrModal(false);
    
    const uniqueInvoiceId = Math.floor(100000 + Math.random() * 900000);
    const invoiceData = {
      id: uniqueInvoiceId,
      items: [...cart],
      total: subtotal,
      phone: phoneNumber,
      address: address,
      carrier: deliveryMethod,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    // Stash invoice info locally to present layout view
    setInvoiceDetails(invoiceData);
    setShowInvoiceModal(true);
    
    // Trigger the automated bot alert
    await sendTelegramAlert(uniqueInvoiceId, cart);
    
    // Clear out client shopping provider states
    checkout();
  };

  // Trigger system browser print UI wrapper targeted specifically for receipts
  const handleSaveInvoice = () => {
    window.print();
  };

  // HTML Web Share API Integration
  const handleShareInvoice = async () => {
    if (!invoiceDetails) return;
    const shareText = `PSP Mart Order #${invoiceDetails.id}\nTotal: $${invoiceDetails.total.toFixed(2)}\nCarrier: ${invoiceDetails.carrier}\nDelivery to: ${invoiceDetails.phone}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PSP Mart Receipt',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing summary stream:', err);
      }
    } else {
      // Fallback copy paste action
      navigator.clipboard.writeText(shareText);
      alert('Invoice details copied directly to clipboard clipboard!');
    }
  };

  if (cart.length === 0 && !showInvoiceModal) {
    return (
      <div className="text-center py-24 bg-white border border-gray-100 rounded-2xl shadow-sm max-w-md mx-auto">
        <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <h2 className="text-sm font-bold text-gray-900 mb-1">Your bag is empty</h2>
        <p className="text-gray-400 text-xs px-6">Add active catalog options from the home panel to populate this review stream.</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-start print:hidden">
      
      {/* LEFT COLUMN: Shopping Cart Items */}
      <div className="lg:col-span-2 bg-gray-50 border border-gray-200 p-5 rounded-2xl shadow-sm">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">Review Items</h2>
        <div className="divide-y divide-gray-100 bg-white p-2 rounded-xl border border-gray-100">
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 text-xs">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-xl bg-gray-50 border border-gray-100" />
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                  <p className="text-gray-400 text-[11px] font-semibold">${Number(item.price||0).toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 border border-gray-200 rounded-lg p-1 bg-gray-50/50">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-0.5 hover:bg-white rounded text-gray-500 shadow-sm"><Minus className="h-3 w-3" /></button>
                  <span className="font-bold text-gray-900 px-1 w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-0.5 hover:bg-white rounded text-gray-500 shadow-sm"><Plus className="h-3 w-3" /></button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN: Delivery Options & Computation Summary */}
      <div className="space-y-5">
        
        {/* SHIPPING FORM DATA CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-xs">
          <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">Delivery Routing</h2>
          
          {formError && (
            <div className="bg-red-50 text-red-600 p-2.5 rounded-xl mb-3 font-semibold text-center border border-red-100">
              {formError}
            </div>
          )}

          <div className="space-y-3.5">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1">Contact Phone *</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="e.g., 012 345 678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1">Drop-off Home Address *</label>
              <div className="relative">
                <Home size={14} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Street No, House No, Sangkat, Khan"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wide mb-1">Google Maps Link (Optional)</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="url" 
                  placeholder="https://maps.google.com/..."
                  value={mapLocation}
                  onChange={(e) => setMapLocation(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            {/* NEW: LOGISTICS PARTNER SELECTION PANEL */}
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wide mb-2">Select Delivery Method Provider</label>
              <div className="grid grid-cols-1 gap-2">
                {deliveryServices.map((service) => {
                  const IconComponent = service.icon;
                  const isSelected = deliveryMethod === service.name;
                  return (
                    <label 
                      key={service.id} 
                      className={`flex items-center justify-between p-2.5 border rounded-xl cursor-pointer transition ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-900' 
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <IconComponent size={14} className={isSelected ? 'text-blue-600' : 'text-gray-400'} />
                        <span>{service.name}</span>
                      </div>
                      <input 
                        type="radio" 
                        name="deliveryMethod" 
                        value={service.name} 
                        checked={isSelected}
                        onChange={() => setDeliveryMethod(service.name)}
                        className="h-3.5 w-3.5 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* PRICING COMPUTATION AND BUTTON */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm text-xs">
          <h2 className="font-black text-gray-900 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">Pricing Computation</h2>
          <div className="space-y-2.5 pb-4 border-b border-gray-100 font-medium text-gray-500">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Logistics Fees</span><span className="text-green-600 font-semibold">Free/Included</span></div>
          </div>
          <div className="flex justify-between items-center pt-4 mb-5">
            <span className="font-black text-gray-900 uppercase">Grand Valuation</span>
            <span className="text-base font-black text-gray-900">${subtotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleProceedToPayment} 
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 rounded-xl transition shadow-md uppercase tracking-wider"
          >
            Pay via KHQR
          </button>
        </div>
      </div>

      {/* DYNAMIC QR DISPLAY MODAL */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-xl">
            <h3 className="text-base font-black text-gray-900 mb-1">Scan Bakong KHQR</h3>
            <p className="text-gray-400 text-[11px] mb-4">Transfer the correct total using any Cambodian banking app.</p>
            
            <div className="bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 mb-4 inline-block">
              <span className="text-[10px] text-gray-400 block font-bold uppercase">Amount Due</span>
              <span className="text-xl font-black text-blue-600">${subtotal.toFixed(2)}</span>
            </div>

            <div className="bg-white border border-gray-200 p-3 rounded-xl inline-block shadow-sm mb-4">
              <img src={khqrImage} alt="Bakong KHQR" className="w-48 h-48 object-contain mx-auto rounded" />
            </div>

            <p className="text-[10px] text-gray-400 italic mb-5 px-4">
              *Please complete the scanner transaction first, then press Confirm to process store logs.
            </p>

            <div className="flex gap-3 text-xs font-bold">
              <button onClick={() => setShowQrModal(false)} className="w-1/2 border border-gray-200 text-gray-500 py-2.5 rounded-xl hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleFinalizePayment} className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl shadow-md transition">I Have Paid</button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: DYNAMIC INVOICE DISPLAY MODAL */}
      {showInvoiceModal && invoiceDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 print:bg-white print:absolute print:inset-0">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl print:shadow-none print:p-0">
            
            {/* Printable Frame Layout begins here */}
            <div id="invoice-print-area" className="text-xs text-gray-800">
              <div className="text-center pb-4 border-b border-dashed border-gray-200">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2 print:hidden" />
                <h2 className="text-lg font-black tracking-wide text-gray-900">PSP MART RECEIPT</h2>
                <p className="text-gray-400 text-[10px] mt-0.5">Thank you for shopping with us!</p>
              </div>

              <div className="grid grid-cols-2 gap-y-2 py-4 border-b border-gray-100 text-[11px]">
                <div><span className="text-gray-400 block">Invoice Reference</span><span className="font-bold text-gray-900">#{invoiceDetails.id}</span></div>
                <div className="text-right"><span className="text-gray-400 block">Date Issued</span><span className="font-medium">{invoiceDetails.date}</span></div>
                <div><span className="text-gray-400 block">Contact Phone</span><span className="font-medium">{invoiceDetails.phone}</span></div>
                <div className="text-right"><span className="text-gray-400 block">Service Carrier</span><span className="font-bold text-blue-600">{invoiceDetails.carrier}</span></div>
                <div className="col-span-2"><span className="text-gray-400 block">Delivery destination</span><span className="font-medium line-clamp-1">{invoiceDetails.address}</span></div>
              </div>

              {/* Items Breakdown inside invoice block */}
              <div className="py-4 space-y-2.5 border-b border-dashed border-gray-200">
                <span className="block font-bold uppercase tracking-wider text-gray-400 text-[10px]">Itemized Manifest</span>
                {invoiceDetails.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px]">
                    <span className="font-medium text-gray-900">{item.name} <span className="text-gray-400 font-normal">x{item.quantity}</span></span>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center text-gray-900">
                <span className="text-sm font-black uppercase">Paid Total</span>
                <span className="text-lg font-black text-green-600">${invoiceDetails.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Interactive Control Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3 font-bold text-xs print:hidden">
              <button 
                onClick={handleSaveInvoice} 
                className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm"
              >
                <Download size={14} /> Save / Print PDF
              </button>
              <button 
                onClick={handleShareInvoice} 
                className="flex items-center justify-center gap-1.5 bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md"
              >
                <Share2 size={14} /> Share Receipt
              </button>
              <button 
                onClick={() => setShowInvoiceModal(false)} 
                className="col-span-2 mt-1 border border-dashed border-gray-300 text-gray-400 text-center py-2 rounded-xl hover:bg-gray-50 transition"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}