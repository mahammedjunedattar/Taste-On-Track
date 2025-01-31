'use client';
import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { FaTimes } from 'react-icons/fa';
import LoadingBar from 'react-top-loading-bar';

const Page = ({ params }) => {
  const [originalData, setOriginalData] = useState([]); // Full dataset
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState(''); // Rating filter
  const [isVeg, setIsVeg] = useState(false); // Veg filter
  const [error, setError] = useState(''); // Error state
  const loadingBarRef = React.useRef(null); // Reference for LoadingBar

  // Filter count dynamically calculated
  const filterCount = [isVeg, ratingFilter].filter(Boolean).length;

  // Fetching data
  useEffect(() => {
    const fetchResult = async () => {
      if (loadingBarRef.current) loadingBarRef.current.continuousStart();

      try {
        const response = await fetch(`/apis/getproducts/${params.slug}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setOriginalData(result.restaurant);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load restaurants. Please try again later.');
      } finally {
        setLoading(false);
        if (loadingBarRef.current) loadingBarRef.current.complete();
      }
    };

    fetchResult();
  }, [params.slug]);

  // Filtered data
  const filteredData = useMemo(() => {
    let data = [...originalData];

    if (isVeg) {
      data = data.filter((item) => item.category === 'Vegetarian');
    }

    if (ratingFilter) {
      data = data.filter((item) => Math.floor(item.rating) === parseInt(ratingFilter));
    }

    return data;
  }, [isVeg, ratingFilter, originalData]);

  // Handlers for filters
  const toggleVegFilter = () => setIsVeg((prev) => !prev);
  const resetVegFilter = () => setIsVeg(false);
  const resetRatingFilter = () => setRatingFilter('');

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  return (
    <>
      <LoadingBar color="#f11946" ref={loadingBarRef} />

      <div>
        <div className="text-center my-8 sticky flex justify-center space-x-4 top-0 bottom-0">
          <button
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Active Filters: {filterCount}
          </button>

          {!isVeg ? (
            <button
              className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-200"
              onClick={toggleVegFilter}
            >
              Pure Veg
            </button>
          ) : (
            <button
              onClick={resetVegFilter}
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-200 flex items-center space-x-2"
            >
              <span>Pure Veg</span>
              <FaTimes className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center space-x-2">
            <label htmlFor="rating" className="text-gray-700 font-semibold">
              Select Rating:
            </label>
            {!ratingFilter ? (
              <select
                id="rating"
                className="bg-gray-50 border cursor-pointer border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
                onChange={(e) => setRatingFilter(e.target.value)}
                value={ratingFilter || ''}
              >
                <option value="">Choose Rating</option>
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
              </select>
            ) : (
              <button
                onClick={resetRatingFilter}
                className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-200 flex items-center space-x-2"
              >
                <span>Rating {ratingFilter}</span>
                <FaTimes className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap mx-20 space-y-6">
          {filteredData.length > 0 ? (
            filteredData.map((restaurant) => (
              <Link
                href={`/restuarant/${restaurant.title}`}
                key={restaurant._id}
                className="max-w-80 block bg-white rounded-lg mx-auto shadow-lg overflow-hidden hover:shadow-xl transition duration-200"
              >
                <img
                  loading="lazy"
                  src={restaurant.image || '/fallback-image.jpg'}
                  alt={`Image of ${restaurant.title || 'restaurant'}`}
                  className="w-full h-60 object-cover"
                />
                <div className="p-6">
                  <h1 className="text-xl font-bold text-gray-800 mb-2">
                    {restaurant.title}
                  </h1>
                  <p className="text-gray-600 mb-2">{restaurant.description}</p>
                  <p className="text-yellow-500 font-semibold">
                    Rating: {restaurant.rating} ⭐
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No restaurants found matching your criteria.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
