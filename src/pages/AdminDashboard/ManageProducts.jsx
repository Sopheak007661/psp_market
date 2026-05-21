
///////pay Card payment and Qr  backend  by add have detail product

import React, { useState, useContext } from 'react';
import { ShopContext } from '../../context/ShopContext';
import { Trash2, Plus, Upload, QrCode } from 'lucide-react';

export default function ManageProducts() {
  const { products, addProduct, deleteProduct, khqrImage, setKhqrImage } = useContext(ShopContext);
  
  // Added 'description' key to the local form state object
  const [form, setForm] = useState({ 
    name: '', 
    price: '', 
    category: 'Car', 
    description: '', 
    image: '' 
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKhqrImage(reader.result);
        alert("✓ System payment gateway updated with your new KHQR!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price) return alert("Please fill out name and price.");
    
    const imagePlaceholder = form.image.trim() !== '' ? form.image : "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500";
    
    // Pass everything down including the new custom description payload field
    addProduct({ 
      ...form, 
      price: Number(form.price),
      image: imagePlaceholder,
      description: form.description.trim() !== '' ? form.description : "This is a standard frontend design description mock view. This product represents verified, highly responsive layout scaling options configured specifically within React framework properties."
    });
    
    // Clear state data variables
    setForm({ name: '', price: '', category: 'Car', description: '', image: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <div className="space-y-6">
        
        {/* MERCHANT QR CONFIGURATION CARD */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 border-b border-gray-100 pb-2.5 mb-4">
            <QrCode className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-gray-900">Merchant Gateway Config</h3>
          </div>
          <div className="text-xs space-y-3">
            <p className="text-gray-400">Upload your store's global KHQR scan reference code:</p>
            <div className="flex items-center gap-4">
              <img src={khqrImage} alt="Active Gateway" className="w-16 h-16 object-contain border border-gray-200 rounded-lg bg-gray-50" />
              <label className="flex-1 flex flex-col items-center justify-center h-16 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <Upload className="w-4 h-4 text-gray-400 mb-0.5" />
                <span className="text-[10px] text-gray-500 font-medium">Update Checkout QR</span>
                <input type="file" accept="image/*" onChange={handleQrUpload} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* ADD PRODUCT FORM */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2.5 mb-4">Add Entry Form</h3>
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-gray-400 uppercase mb-1">Product Designation</label>
              <input type="text" placeholder="Designation" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-50/50" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1">Price ($)</label>
                <input type="number" step="0.01" placeholder="Valuation" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-50/50" />
              </div>
              <div>
                <label className="block font-bold text-gray-400 uppercase mb-1">Category Group</label>
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-50/50 h-[34px]">
                  <option value="Car">Car</option>
                  <option value="Computer">Computer</option>
                  <option value="Fruit">Fruit</option>
                  <option value="Vegetable">Vegetable</option>
                  <option value="Clothes">Clothes</option>
                  <option value="Phone">Phone</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Hotel Book">Hotel Book</option>
                  <option value="Meet">Meet</option>
                </select>
              </div>
            </div>

            {/* 🔥 NEW SPECIFICATION DESCRIPTION FIELD */}
            <div>
              <label className="block font-bold text-gray-400 uppercase mb-1">Product Detail Description</label>
              <textarea 
                rows="3" 
                placeholder="Type item features, conditions, or point descriptions here..." 
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-gray-50/50 resize-none leading-normal"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-400 uppercase mb-1">Upload Product Image</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition">
                  <div className="flex flex-col items-center justify-center pt-2 pb-2">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <p className="text-[10px] text-gray-500 font-medium">Click to upload from computer</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              {form.image && <p className="text-[10px] text-green-600 mt-1 font-semibold">✓ Image loaded!</p>}
            </div>
            <button type="submit" className="w-full bg-blue-800 hover:bg-green-600 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center space-x-1.5 transition mt-2">
              <Plus className="h-4 w-4" />
              <span>Append Item</span>
            </button>
          </form>
        </div>
      </div>

      {/* CATALOG MANIFEST TABLE */}
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/30"><h3 className="font-bold text-gray-800 text-xs">Catalog Manifest Array</h3></div>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-semibold border-b border-gray-100 uppercase tracking-wider text-[10px]">
                <th className="px-5 py-2.5">Item Context</th>
                <th className="px-5 py-2.5">Category</th>
                <th className="px-5 py-2.5">Pricing</th>
                <th className="px-5 py-2.5 text-right">Erase</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50/40">
                  <td className="px-5 py-2 flex items-center space-x-2">
                    <img src={product.image} alt="" className="w-8 h-8 object-cover rounded-lg bg-gray-100" />
                    <div>
                      <span className="font-bold text-gray-900 line-clamp-1">{product.name}</span>
                      <p className="text-[10px] text-gray-400 font-normal line-clamp-1 max-w-[180px]">{product.description}</p>
                    </div>
                  </td>
                  <td className="px-5 py-2"><span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap">{product.category}</span></td>
                  <td className="px-5 py-2 font-semibold text-gray-900">${Number(product.price||0).toFixed(2)}</td>
                  <td className="px-5 py-2 text-right">
                    <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}







