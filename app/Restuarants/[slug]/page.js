'use client';

import React, { useState, useEffect } from 'react';

const Page = ({ params }) => {
  const [results, setResults] = useState([]);
  const [isDropdown, setIsDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      console.log(params.slug);
      try {
        const res = await fetch(`/apis/search?q=${params.slug}`);
        const data = await res.json();
        
        setResults(data.results); 
        setIsDropdown(true);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setResults([]); 
        setIsDropdown(false);
        setLoading(false);
      }
    };
  
    setLoading(true);
    if (params.slug) {
      fetchResults();
    }
  }, [params.slug]);
  
  // Debugging: Log whenever results change
  useEffect(() => {
    console.log('Results updated:', results);
  }, [results]);
    console.log(results)
  return (
          <div className="max-w-7xl mx-auto p-6">
      {/* Restaurant Name */}
      <h1 className="text-4xl font-bold text-center mb-8">{results[0].name}</h1>
            {/* Top Section with Two Photos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <img src={results[0].photos[0].url} alt="Restaurant Photo 1" className="w-full h-96 object-cover rounded-lg" />
        <img src={results[0].photos[1].url} alt="Restaurant Photo 2" className="w-full h-96 object-cover rounded-lg" />
        
      </div>
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Menu</h2>

        {results[0].menu.map((category, index) => (
          <div key={index} className="mb-12">
            {/* Category Title */}
            <h3 className="text-2xl font-semibold mb-4">{category.category}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((item) => (
                <div key={item.id} className="bg-white shadow-lg rounded-lg p-6">
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-40 object-cover rounded-md mb-4"
                  />
                  <h4 className="text-xl font-semibold">{item.name}</h4>
                  <p className="text-gray-600 mt-2">{item.description}</p>
                  <p className="text-lg font-bold mt-4">${item.price.toFixed(2)}</p>

                  {/* Tags */}
                  <div className="mt-2">
                    {item.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-200 text-gray-800 rounded-full px-2 py-1 mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Customizations */}
                  {item.customizations?.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-semibold text-sm">Customizations:</h5>
                      {item.customizations.map((customization, customizationIndex) => (
                        <div key={customizationIndex} className="mt-2">
                          <p className="text-sm text-gray-700">{customization.type}:</p>
                          <ul className="pl-4 list-disc">
                            {customization.options.map((option, optionIndex) => (
                              <li key={optionIndex} className="text-sm text-gray-600">
                                {option}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
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
