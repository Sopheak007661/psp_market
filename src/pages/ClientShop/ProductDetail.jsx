
import React, { useContext } from 'react';
import Foot from '../../components/Foot'
import { ShopContext } from '../../context/ShopContext';
import { ChevronLeft, ShoppingCart } from 'lucide-react';

export default function ProductDetail({ productId, setView }) {
  const { products, addToCart } = useContext(ShopContext);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return <p className="text-gray-500 text-center py-12">Product configuration error.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      <div className=''>
          <button onClick={() => setView('shop-home')} className="flex items-center space-x-1 text-gray-500 hover:text-gray-900 text-xs font-semibold mb-6 transition">
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Directory</span>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8  p-6 border border-gray-200 rounded-3xl shadow-xs">
            <div className="w-200 h-200  p-3 overflow-hidden  border-r-4 border-gray-500">
              <img src={product.image} alt={product.name} className="w-full object-cover " />
            </div>
            <div className="flex flex-col justify-between py-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest font-extrabold text-white  bg-blue-500 px-3.5 py-0 shadow-md shadow-blue-800 rounded-md">{product.category}</span>
                <h1 className="text-2xl font-black text-gray-900 mt-3">{product.name}</h1>
                <p className="text-2xl font-black text-gray-900 mt-2">${Number(product.price||0).toFixed(2)}</p>
                
                {/* 🔥 STREAMING DYNAMIC INPUT DESCRIPTION FROM CONTEXT STORE MEMORY */}
                <p className="text-gray-600 text-md mt-4 leading-relaxed whitespace-pre-line text-left">
                  {product.description || "This is a standard frontend design description mock view. This product represents verified, highly responsive layout scaling options configured specifically within React framework properties."}
                </p>
              </div>
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 transition shadow-sm shadow-indigo-100 mt-6"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Secure to Bag</span>
              </button>
            </div>
          </div>
        </div>
        <Foot/>
    </div>
  );
}