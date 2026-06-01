import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../../context/ShopContext';
import ProductCard from '../../components/ProductCard';

import ProductLight from '../../components/ProductLight';
import ContactUs from '../../components/ContactUs';

import Brand1 from '../../assets/Brand1.jpg'
import Brand3 from '../../assets/Brand3.gif'
import Brand2 from '../../assets/Brand2.png'
import Cart1 from '../../assets/Cart1.png'
// import Car1 from '../../assets/Car1.png'
// import Car2 from '../../assets/Car2.png'
// import Car3 from '../../assets/Car3.png'
import Car4 from '../../assets/Car4.png'
// import Car5 from '../../assets/Car5.png'
import Car6 from '../../assets/Car6.png'
// import Phone1 from '../../assets/Phone1.png'
// import Phone2 from '../../assets/Phone2.png'
import Phone3 from '../../assets/Phone3.jpg'
// import Phone4 from '../../assets/Phone4.png'
import Com1 from '../../assets/Computer1.png'
// import Com2 from '../../assets/Computer2.png'
// import Vege1 from '../../assets/Vege1.png'
import Vege2 from '../../assets/Vege2.png'
import Vege3 from '../../assets/Vege3.webp'
// import Vege4 from '../../assets/Vege4.jpg'
import Vege5 from '../../assets/Vege5.webp'
// import Vege6 from '../../assets/Vege6.jpg'
import { Scale } from 'lucide-react';
// import Fruit1 from '../../assets/Fruit1.png'

export default function Home({ setView, setSelectedProductId }) {
  const { products, searchTerm, setSearchTerm } = useContext(ShopContext);
  const [category, setCategory] = useState('All');

  // 1. Setup the array of background images
  const bgImages = [Com1,  Vege2,  Phone3,Vege3,  Car4,  Car6];
  
  // 2. State to hold the index of the currently visible background image
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // 3. Automated background cycle logic (updates every 3 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 3000); // 3000ms = 3 seconds (Adjust this value to speed up or slow down)

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [bgImages.length]);

  const categories = [
    'All', 
    'Car', 
    'Computer', 
    'Fruit', 
    'Vegetable', 
    'Clothes', 
    'Phone', 
    'Accessories', 
    'Hotel Book', 
    'Meet'
  ];
  
  // 🔄 Combined filtering configuration for Category Selection + Search Keywords
  const filtered = products.filter(p => {
    const matchesCategory = category === 'All' || p.category === category;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });



  const [count, setCount] = useState(0);
  useEffect(() => {
    let currentNumber = 0; // Tracks the next number to add (0, 1, 2... up to 50)

    const intervalId = setInterval(() => {
      if (currentNumber > 50) {
        // If we finished adding 50, reset everything back to 0
        setCount(0);
        currentNumber = 0;
      } else {
        // Add the current number to the total count
        setCount(prevCount => prevCount + currentNumber);
        currentNumber++; // Move to the next number for the next tick
      }
    }, 500); // Runs every 500ms

    // Clean up interval if the component unmounts
    return () => clearInterval(intervalId);
  }, []);


  return (
    
    <div >
      {/* 4. The nav element pulls the active image string instantly from state */}
      <nav 
        className='  bg-no-repeat bg-cover bg-center blur-xs opacity-1 absolute top-20 left-0 right-0  flex   transition-all duration-700 ease-in-out shadow-xl rounded-b-3xl shadow-blue-400'
        style={{ backgroundImage: `url(${bgImages[currentBgIndex]})`,  }}
      >
        <div className="flex flex-col w-[100%] -mb-4 h-[80%]    mb-6 pb-5    p-10 justify-end  gap-20">
          <div className='flex justify-center'>
            <div className='w-[100%] flex flex-col  gap-1 items-center'>
                <h1 className="text-7xl font-black text-blue-800">market<br />online</h1>
                <address className="text-black/85 text-xl mt-0.5 "><b className=''>Find your favourite product here....<br /> Buy now</b> </address>
            </div>
            <div className='hidden lg:flex w-[100%] h-[50%]   flex flex-row  flex items-end pl-5 pb-10 pt-0 '>
               <div className=' hidden font-sans lg:flex md:flex-wrap gap-10  bg-gradient-to-b  from-white/45 to-whit/45 rounded-xl'>
                  <div className='flex flex-col  p-5'>
                    <h3 className='text-[40px]  p-4  border-b border-blue-800 text-blue-800 text-xl'>User</h3>
                    <h1 className='h-[30px] bg-black/80 rounded-full  text-blue-600'>
                    +{count}
                    </h1>
                  </div>
                  <div className='flex flex-col  p-5 '>
                    <h3 className='text-[40px] p-4  border-b border-blue-800 text-blue-800 text-xl'>Selling</h3>
                    <h1 className='h-[30px] text-blue-600 bg-black/80 rounded-full '>+1{count}</h1>
                  </div>
                  <div className='flex flex-col  p-5 '>
                    <h3 className='text-[40px] p-4 border-b border-blue-800  text-blue-800 text-xl'>Favourite</h3>
                    <h1 className='h-[30px] text-blue-600 bg-black/80 rounded-full'>+23</h1>
                  </div>
            </div>
            </div>
          </div>
          
          {/* Scrollable category list buttons */}
          <div className="flex gap-1.5 p-10 justify-start md:justify-center overflow-x-auto  min-w-full md:max-w-xl lg:max-w-3xl custom-scrollbar  ">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1  text-xs font-semibold whitespace-nowrap transition border ${category === cat ? 'bg-blue-800 text-white border-gray-600 rounded-3xl'  : 'bg-white text-gray-800 border-blue-800 rounded-3xl hover:bg-gray-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Search Feedback Label */}
      {searchTerm && (
        <p className="text-xs text-gray-500 mb-6 mt-6 px-4">
          Showing results for: <span className="font-bold text-gray-800">"{searchTerm}"</span> inside <span className="font-bold text-gray-800">{category}</span> ({filtered.length} found)
        </p>
      )}

      {/* Grid Condition Render */}
      <div className=" flex self-center  ">
          <div className="p-4  block left-0 right-0 ">
          {filtered.length === 0 ? (
            <div className="text-center min-h-[400px] mt-[400px] py-16 bg-white border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center ">
              <p className="text-gray-400 text-sm font-medium">
                No listings found matching your criteria.
              </p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-3 px-3.5 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs rounded-lg transition"
                >
                  Clear Search Term
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 [background:radial-gradient(circle_at_top,rgba(56,189,248,0.25)_0%,rgba(255,255,255,0)_70%)] px-5 py-10 md:grid-cols-4 lg:grid-cols-5 gap-16 mt-[200px] md:mt-[300px] pt-[200px] md:pt-[200px] lg:pt-[400px] xl:pt-[200px]  ">  {/* overflow-auto max-h-screen */}
              {filtered.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  setView={setView} 
                  setSelectedProductId={setSelectedProductId} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* // Inside the return, above the grid div: */}
      <ProductLight setView={setView} setSelectedProductId={setSelectedProductId} />
      <ContactUs />
    </div>
  );
}