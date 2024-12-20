'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar/page';
import { useContext } from 'react';
import Ecomcontext from './contexts/context';

const Page = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const context = useContext(Ecomcontext)
  const [value,setvalue] = useState()
  const {cart,addToCart,showOrderModal,handleOrderItem,setShowOrderModal,selectedItem,showcart} = context

  const router = useRouter();
  const handleChange = (e) => setQuery(e.target.value);

  useEffect(() => {
    const uniqueid = localStorage.getItem('token')

    const fetchResults = async () => {
      if (!query) return;

      setLoading(true);
      try {
        const res = await fetch(`/apis/search?q=${query}`);
        const data = await res.json();
        setResults(data.results);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  console.log(selectedItem)
  const onvaluechange = (e)=>{
    setvalue(parseInt(e.target.value))


  }


  const handleCheckout = () => {
    // Implement checkout functionality (e.g., API call or payment process)
    console.log("Checking out with items:", cart);
    router.push('/checkout')
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar quereirs={query}/>

      {/* Search Section */}
      <div className="flex flex-col items-center justify-center my-16">
        <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-6">
          Find the Best Restaurants Near You
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Discover top-rated restaurants, cafes, and food places with a click. Start typing to find your favorite meals!
        </p>

        {/* Search Input */}
        <div className="relative w-full max-w-3xl">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for delicious restaurants..."
            className="w-full py-4 pl-6 pr-16 text-lg text-gray-700 border-2 border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button className="absolute top-0 right-0 mt-2 mr-4 text-white bg-blue-500 hover:bg-blue-600 rounded-full p-3 shadow-lg">
            <FaSearch size={18} />
          </button>
        </div>

        {/* Conditional Content */}
        {loading ? (
          <p className="text-center text-gray-500 mt-8">Loading...</p>
        ) : results.length === 0 ? (
          <p className="text-center text-gray-500 mt-8">No results found</p>
        ) : (
          <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-4xl font-bold text-center mb-8">{results[0].name}</h1>

            {/* Menu Section */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-6">Menu</h2>
              {results[0].menu.map((category, index) => (
                <div key={index} className="mb-12">
                  <h3 className="text-2xl font-semibold mb-4">{category.category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white shadow-lg rounded-lg p-6">
                        <img src={item.photo} alt={item.name} className="w-full h-40 object-cover rounded-md mb-4" />
                        <h4 className="text-xl font-semibold">{item.name}</h4>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                        <p className="text-lg font-bold mt-4">${item.price}</p>

                        <button
                          onClick={() => handleOrderItem(item)}
                          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                        >
                          Order
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
            <h3 className="text-2xl font-bold mb-4">Order {selectedItem.name}</h3>
            <p>{selectedItem.description}</p>
            <input
            onChange={onvaluechange}
              type="number"
              min="1"
              placeholder="Quantity"
              className="w-full mt-4 py-2 px-4 border rounded"
            />
            {/* Add customizations if available */}
            {selectedItem.customizations?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold">Customizations:</h4>
                {selectedItem.customizations.map((custom, idx) => (
                  <div key={idx}>
                    <p>{custom.type}:</p>
                    <select className="w-full mt-2 py-2 px-4 border rounded">
                      {custom.options.map((option, optionIndex) => (
                        <option key={optionIndex}>{option}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              
            )}
            <button
              onClick={() => addToCart({ name:selectedItem.name,description:selectedItem.description,quantity:value,price:selectedItem.price})} // Adjust quantity and customizations as needed
              className="bg-green-500 text-white py-2 px-4 rounded mt-4 w-full"
            >
              Add to Cart
            </button>
            <button
              onClick={() => setShowOrderModal(false)}
              className="text-gray-500 mt-4 w-full text-center"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Checkout Section */}
      {showcart > 0 && (
        <div className="fixed bottom-0 w-full bg-gray-900 text-white p-4 flex justify-between items-center">
          <p>{cart.length} items in cart</p>
          <button
            onClick={handleCheckout}
            className="bg-green-500 py-2 px-4 rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      )}

      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
            <span className="ml-3 text-xl">YourBrand</span>
          </a>
          <p className="text-sm text-gray-500 sm:ml-6 sm:mt-0 mt-4">© 2024 YourBrand</p>
        </div>
      </footer>
    </div>
  );
};

export default Page;
