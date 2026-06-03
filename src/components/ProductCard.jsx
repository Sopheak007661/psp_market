import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, setView, setSelectedProductId }) {
  const { addToCart } = useContext(ShopContext);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setView('shop-detail');
    
  };

  return (
    <div className="[background:radial-gradient(circle_at_bottom,rgba(56,189,248,0.25)_0%,rgba(255,255,255,0)_70%)]  border-2  bg-gray-300 hover:border-gray-300  overflow-hidden shadow-blue-500 hover:shadow-[0px_10px_10px_rgba(59,130,246,0.5)]  transition flex flex-col justify-between group">
      <div className="h-full bg-gray-50 overflow-hidden relative cursor-pointer" onClick={handleCardClick}>
        <img src={product.image} alt={product.name} className="w-full h-full object-fit group-hover:scale-110 transition duration-300" />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider">{product.category}</span>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="cursor-pointer" onClick={handleCardClick}>
          <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{product.name}</h3>
          <p className="text-base font-black text-gray-900">${Number(product.price||0).toFixed(2)}</p>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="mt-4 w-full bg-blue-800 hover:border-blue-500 active:bg-blue-300 active:scale-100 hover:bg-green-60  hover:bg-blue-50 hover:text-blue-600 font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center text-gray-300 space-x-2 transition border-2 border-gray-100"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>+ Add</span>
        </button>
      </div>
    </div>
  );
}