'use client';

import React, { useState, useEffect, useContext } from 'react';
import Ecomcontext from '@/app/contexts/context';

const Page = ({ params }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const context = useContext(Ecomcontext);
  const {
    addToCart,
    handleOrderItem,
    setShowOrderModal,
  } = context;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/apis/Search-Restuarants/${params.slug}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        setResults(result);
      } catch (error) {
        console.error('Error fetching results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [params.slug]);

  const handleQuantityChange = (e) => setQuantity(e.target.value);

  if (loading) {
    return <p className="text-center text-gray-500 mt-8">Loading...</p>;
  }

  if (!results || !results.restaurant) {
    return <p className="text-center text-gray-500 mt-8">No results found</p>;
  }

  const { restaurant } = results;
  const photos = restaurant.photos || [];
  const address = restaurant.address
    ? `${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}, ${restaurant.address.postal_code}`
    : 'Address not available';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">{restaurant.name}</h1>
        <p className="text-center text-gray-600 mb-4">{address}</p>
        <p className="text-center text-gray-600 mb-8">Opening Hours: {restaurant.opening_hours || 'Not available'}</p>

        {/* Restaurant Photos */}
        <div className="flex justify-center space-x-3 h-80">
          {photos.length > 0 ? (
            <>
              {/* Main Large Image */}
              <img
                src={photos[0]}
                alt="Main restaurant view"
                className="object-cover w-[750px] h-full rounded"
              />

              {/* Secondary Images */}
              <div className="space-y-3 h-full">
                {photos.slice(1, 3).map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`Additional view ${i + 1}`}
                    className="object-cover w-[170px] h-[120px] rounded"
                  />
                ))}
              </div>

              {/* Last Image */}
              {photos[3] && (
                <img
                  src={photos[3]}
                  alt="Another restaurant view"
                  className="object-cover w-[200px] h-full rounded"
                />
              )}
            </>
          ) : (
            <p>No photos available</p>
          )}
        </div>

        {/* Menu Section */}
        <h2 className="text-3xl font-bold mt-12 mb-6">Menu</h2>
        {restaurant.menu.map((category, index) => (
          <div key={index} className="mb-12">
            <h3 className="text-2xl font-semibold mb-4">{category.category}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="bg-white shadow-lg rounded-lg p-6">
                  <img
                    src={item.photo || '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h4 className="text-xl font-semibold">{item.name}</h4>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                  <p className="text-lg font-bold mt-4">${item.price}</p>
                  <div className="mt-4">
                    <input
                      type="number"
                      value={quantity}
                      onChange={handleQuantityChange}
                      min="1"
                      className="w-full py-2 px-4 border rounded mb-4"
                    />
                    <button
                      onClick={() =>
                        addToCart({
                          name: item.name,
                          description: item.description,
                          quantity: parseInt(quantity, 10),
                          price: item.price,
                        })
                      }
                      className="bg-green-500 text-white py-2 px-4 rounded w-full"
                    >
                      Add to Cart
                    </button>
                  </div>
                  <button
                    onClick={() => handleOrderItem(item)}
                    className="bg-blue-500 text-white py-2 px-4 rounded mt-4 w-full"
                  >
                    Order Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
