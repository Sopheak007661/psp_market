import React from 'react'
import Playstore from '../assets/Play_store.png'
import Appstore from '../assets/App_store.png'
import BrandLogo from '../assets/BrandLogo.png'

const Foot = () => {
  return (
    /* - Added overflow-hidden to keep the glow contained inside the footer.
      - Applied a blue radial gradient centered at the bottom, radiating upward.
      - Keeps the text natural/black as in your original setup.
    */
    <div className='relative left-0 right-0 bottom-0  flex min-h-[50vh] flex-col items-center justify-center gap-10 border-t-[5px] border-gray-300 p-10 overflow-hidden bg-white text-black [background:radial-gradient(circle_at_bottom,rgba(56,189,248,0.25)_0%,rgba(255,255,255,0)_70%)]'>
      
      {/* Blue Sun Core Flare at the bottom center */}
      <div className='absolute bottom-0 left-1/2 h-[120px] w-[280px] -translate-x-1/2 rounded-t-full bg-blue-600/40 blur-2xl pointer-events-none' />

      <div className='z-10 flex w-full flex-wrap justify-around gap-10'>
        <div className='flex flex-col gap-8 items-start'>
          <div className='flex flex-col items-start '>
            <div className='flex justify-center items-center'>
              <img src={BrandLogo} alt="BrandLogo" className='w-[120px] h-[120px] rounded-full p-3' />
              <h2 className='pt-2 cursor-pointer active:scale-95 hover:scale-105 transition-transform duration-200 font-semibold'>PSP MARKET</h2>
            </div>
            <div className='flex flex-col items-start mt-2'>
              <p>Shop is the next step on our mission to make commerce </p>
              <p>better for everyone.</p>
            </div>
          </div>
          
          <div className='flex gap-2 flex-col'>
            <div>
              <div className='flex border border-gray-400 p-2 rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 bg-white/60 backdrop-blur-sm' >
                <img src={Playstore} alt="Play_store" className='w-[60px] h-[50px] object-contain' />
                <div>
                  <div>Download on the</div>
                  <b>Play Store</b>
                </div>
              </div>
            </div>
            <div>
              <div className='flex gap-5 border border-gray-400 p-2 rounded-xl pl-6 cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 bg-white/60 backdrop-blur-sm'>
                <img src={Appstore} alt="App_store" className='w-[40px] h-[50px] object-contain'  />
                <div>
                  <div>Download on the</div>
                  <b>App Store</b>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className='flex flex-wrap gap-20 p-5 justify-between'>
            <ul className='flex flex-col gap-2 items-start'>
              <b>Start Selling</b>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>For brands</li>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>For Creators</li>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>For Build your store</li>
            </ul>
            <ul className='flex flex-col gap-2 items-start'>
              <b>Information</b>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>Shop Pay</li>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>Help center</li>
            </ul>
            <ul className='flex flex-col gap-2 items-start'>
              <b className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>Social</b>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>
                  <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">Facebook</a>
              </li>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>
                 <a href="https://www.instagram.com/sopheak123.pheak/" target="_blank" rel="noopener noreferrer">Instagram</a>
              </li>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>
                <a href="https://x.com/PSopheak23887" target="_blank" rel="noopener noreferrer">X (Twitter)</a>
              </li>
           </ul>
            <ul className='flex flex-col gap-2 items-start '>
              <b>Legal</b>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>Terms of Service</li>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>Privacy Policy</li>
              <li className='hover:text-blue-800 cursor-pointer border-b border-transparent hover:border-blue-600 active:border-blue-900 transition-colors'>Your Privacy Choices</li>
            </ul>
          </div>
        </div>
      </div>

      <div className='z-10 flex items-center border-t border-gray-400 justify-between w-full px-10 pt-5 mt-auto'>
        <div>
          <div className='flex gap-5 items-center'>
            <h3 className='hidden md:flex'>Powered by </h3>
            <i className="fa-solid fa-shop text-green-800"></i>
            <div className='hidden md:flex'><p>|</p></div>
            <h3 className='hidden md:flex'>Start selling for free</h3>
          </div>
        </div>
        <div className='flex gap-5 items-center'>
          <h3>Language Psp market</h3>
          <i className="fa-brands fa-facebook text-green-800 cursor-pointer"></i>
        </div>
      </div>
    </div>
  )
}

export default Foot