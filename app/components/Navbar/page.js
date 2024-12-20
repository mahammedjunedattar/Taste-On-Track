'use client';
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Ecomcontext from '@/app/contexts/context';

const Navbar = ({ queries }) => {
  const [opencart, setopencart] = useState(false);
  const [uniqueid, setUniqueId] = useState(null);
  const { cart, addToCart, removeFromCart } = useContext(Ecomcontext);
  const router = useRouter();

  useEffect(() => {
    // Ensure localStorage access is client-side only
    const storedId = localStorage.getItem('token');
    setUniqueId(storedId);
  }, []);

  const newcart = uniqueid ? cart.filter((e) => e.uniqueid === uniqueid) : [];

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const openModal = () => setopencart(true);
  const mouseLeave = () => setopencart(false);

  return (
    <div>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"></a>
          <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
            <Link href={'/Addrestuarant'} className="mr-5 hover:text-gray-900">
              Add Restaurant
            </Link>
            <Link href={'/Login'} className="mr-5 hover:text-gray-900">
              Login
            </Link>
            <Link href={'/Signup'} className="mr-5 hover:text-gray-900">
              Signup
            </Link>
            <button onMouseEnter={openModal} className="mr-5 hover:text-gray-900">
              Cart
            </button>
          </nav>
        </div>

        {/* Cart Modal */}
        {opencart && (
          <div
            className="absolute right-24 z-10 bg-blue-600 shadow-2xl shadow-black overflow-y-scroll w-80 max-h-96 p-4"
            onMouseLeave={mouseLeave}
          >
            <div className="text-center text-white mb-4">Hotel: {queries}</div>
            {newcart.length === 0 ? (
              <div className="text-white">Your cart is empty</div>
            ) : (
              newcart.map((item, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-white font-bold mb-2">{item.name}</h3>
                  {item.items.map((e, i) => (
                    <div key={i} className="mb-4 bg-gray-800 text-white rounded-lg shadow-md p-4">
                      {/* Item Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-semibold">{e.name || 'Unnamed Item'}</div>
                        <div className="text-sm font-medium">
                          {Number(e.price || 0).toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                          })}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex justify-between items-center space-x-4 mb-4">
                        <button
                          onClick={() =>
                            addToCart({
                              name: e.name,
                              description: e.description,
                              quantity: -1,
                              price: e.price,
                            })
                          }
                          className="bg-red-500 text-white rounded-md px-3 py-1 hover:bg-red-600 disabled:opacity-50"
                          disabled={e.quantity <= 1}
                        >
                          −
                        </button>
                        <div className="text-sm font-medium">{e.quantity || 1}</div>
                        <button
                          onClick={() =>
                            addToCart({
                              name: e.name,
                              description: e.description,
                              quantity: 1,
                              price: e.price,
                            })
                          }
                          className="bg-green-500 text-white rounded-md px-3 py-1 hover:bg-green-600"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="flex justify-between items-center text-sm border-t border-gray-600 pt-2">
                        <div className="font-medium">Subtotal</div>
                        <div className="font-medium">
                          {(Number(e.price || 0) * (e.quantity || 1)).toLocaleString('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                          })}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => removeFromCart(e.name, e.quantity)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          Remove from Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}

            {/* Checkout Button */}
            {newcart.length > 0 && (
              <div className="flex justify-center pb-4">
                <button
                  onClick={handleCheckout}
                  className="bg-green-500 py-2 px-4 rounded mx-auto hover:bg-green-600"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
