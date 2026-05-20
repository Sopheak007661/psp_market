import React from 'react'
import Playstore from '../assets/Play_store.png'
import Appstore from '../assets/App_store.png'
const Foot = () => {
  return (
    
    <div className=' flex flex-col   border-t-1 border-gray-500 absolute buttom-0  right-0 left-0 justify-center items-center p-10 gap-10 min-h-[50vh]'>

        <div className='flex flex-wrap  justify-around w-full  gap-10'>
            <div className='flex flex-col gap-8 items-start'>
            <div className='flex flex-col items-start '>
                <h2 className='pl-10 cursor-pointer active:scale-95 hover:scale-105'>psp market</h2>
                <div  className='flex  flex-col items-start'>
                    <p>Shop is the next step on our mission to make commerce  </p>
                    <p>better for everyone.</p>
                </div>
            </div>
            <div className='flex gap-1 flex-col'>
                <div >
                    <div className='flex border border-gray-600 p-2 rounded-xl cursor-pointer hover:scale-105 active:scale-95' >
                        <img src={Playstore} alt="Play_store" className='w-[60px] h-[50px]' />
                        <div className=''>
                            <div>Download on the</div>
                            <b>Play Store</b>
                        </div>
                    </div>
                </div>
                <div>
                    <div className='flex gap-5 border border-gray-600 p-2 rounded-xl pl-6 cursor-pointer hover:scale-105 active:scale-95'>
                        <img src={Appstore} alt="App_store" className='w-[40px] h-[50px]'  />
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
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>For brands</li>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>For Creators</li>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>For Build your store</li>
                    </ul>
                    <ul className='flex flex-col gap-2 items-start'>
                        <b>Information</b>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>Shop Pay</li>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>Help center</li>
                    </ul>
                    <ul className='flex flex-col gap-2 items-start'>
                        <b className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>Social</b>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>facebook</li>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>Instagram</li>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>X(Twitter)</li>
                    </ul>
                    <ul className='flex flex-col gap-2 items-start '>
                        <b>Legal</b>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>Terms of Service</li>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>Privacy Policy</li>
                        <li className='hover:text-blue-800 cursor-pointer border-b  active:border-blue-900'>Your Privacy Choices</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className='flex justify-between absolute -bottom-10 left-0 right-0 p-5 pl-10 pr-10 '>
            <div >
                <div className='flex gap-5'>
                    <h3 className='hidden md:flex'>Powered by </h3>
                    <i class="fa-solid fa-shop mt-1 text-green-800"></i>
                        <div><p>|</p></div>
                    <h3 className='hidden md:flex mt-1'>Start selling for free</h3>
                </div>
            </div>
            <div className='flex gap-5'>
                <h3>Languge  Psp martkey </h3>
                <i class="fa-brands fa-facebook mt-1 text-green-800"></i>
            </div>
        </div>
    </div>
  )
}

export default Foot