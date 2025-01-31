'use client';
import React, { useState, useContext,useEffect } from 'react';
import Ecomcontext from '../contexts/context';
import MapPage from '../Maps/page';
import { useRef } from 'react';
import Image from 'next/image';
  
const Page = () => {
  const context = useContext(Ecomcontext);
  const {submissionStatus,toggleDisplay,display,deliverydetails} = context
  const [address,setaddress] = useState('')
  useEffect(()=>{
    setaddress(localStorage.getItem('address'))

  },[])

  const { cart,onplaceorder } = context;
  console.log(cart);
  const total = cart.reduce((sum,item)=>{return sum+=(parseInt(item.price) ||0)},0)


  return (
    <div className={`max-w-7xl mx-auto p-6 ${display?'bg-gray-600':''}`}>
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Checkout</h1>
          <p className="text-gray-500">Step 3 of 4</p>
        </div>
        <a href="/cart" className="text-blue-600 hover:underline">← Back to Cart</a>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Section */}
        {
          submissionStatus ==='success'?<div className='flex'> <div className=' relative top-32 shadow hover:shadow-2xl w-64 h-40 text-sm px-4 py-10' >   {address}  </div> 
                    <section>
          <div>
            <div className="font-bold text-xl mb-4">Add a delivery address</div>
            <p>You seem to be in a new location</p>

            {/* Add New Address Button */}
            <div className="shadow hover:shadow-2xl cursor-pointer w-72 h-40 my-16 mx-6 text-sm">
              <button
                onClick={toggleDisplay}
                className="border-2   my-12 border-sky-600 text-sky-600 px-10 py-2 mx-20  "
              >
                <div className='flex space-x-1'>

                <div>
                Add

                </div>
                <div>
                New

                </div>
                </div>

                 
              </button>
            </div>

            {/* Toggle Content */}
            <div
              className={` bg-white   absolute top-0 -left-2 overflow-y-scroll transition-all duration-500 ease-in-out transform ${
                display ? 'max-h-screen   ' : ' -translate-x-full  '
              } overflow-hidden `}
            >
              
              <img width={'22'} onClick={toggleDisplay} src='https://cdn-icons-png.flaticon.com/128/2961/2961937.png' className='relative translate-x-80 mx-4 cursor-pointer'></img>
              <div className="mb-6">
                <MapPage />
              </div>
            </div>
          </div>
        </section>

          </div> :
          <section>
          <div>
            <div className="font-bold text-xl mb-4">Add a delivery address</div>
            <p>You seem to be in a new location</p>

            {/* Add New Address Button */}
            <div className="shadow hover:shadow-2xl cursor-pointer w-80 h-64 my-16 ">
              <button
                onClick={toggleDisplay}
                className="border-2 border-sky-600 text-sky-600 px-10 py-2 mx-20 my-16 "
              >
                Add New
              </button>
            </div>

            {/* Toggle Content */}
            <div
              className={` bg-white   absolute top-0 -left-2 overflow-y-scroll transition-all duration-500 ease-in-out transform ${
                display ? 'max-h-screen   ' : ' -translate-x-full  '
              } overflow-hidden `}
            >
              
              <img width={'22'} onClick={toggleDisplay} src='https://cdn-icons-png.flaticon.com/128/2961/2961937.png' className='relative translate-x-80 mx-4 cursor-pointer'></img>
              <div className="mb-6">
                <MapPage />
              </div>
            </div>
          </div>
        </section>

        }

        {/* Right Section */}
        <section className={`bg-white p-6 rounded-lg shadow ${display?'bg-gray-400':''}` }>
          <h2 className="text-xl font-semibold mb-4">Payment Options</h2>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" className="form-radio" defaultChecked />
              <span>Credit/Debit Card</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" className="form-radio" />
              <span>Digital Wallet</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="payment" className="form-radio" />
              <span>Cash on Delivery</span>
            </label>
          </div>

          <h2 className="text-xl font-semibold mt-6">Order Summary</h2>
          <div className="mt-4 space-y-2">
            {
              cart.map((item,i)=>{
               return <div >
                {
                  item.price !== undefined && <div className='flex justify-between'>
                                       <span>Item {i+1}</span>    
                                       <span>{item.price}$</span>


                  </div>

  
  
                }
                
              </div>
               
              })
            }
            <hr className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{total}$</span>
            </div>
          </div>

          <button
  className={`w-full mt-6 p-3 rounded-lg font-semibold ${
    submissionStatus === 'success'
      ? 'bg-blue-600 text-white hover:bg-blue-700'
      : 'bg-gray-400 text-gray-700 cursor-not-allowed'
  }`}

onClick={onplaceorder}>
  Place Order
</button>
        </section>
      </div>
    </div>
  );
};

export default Page;
