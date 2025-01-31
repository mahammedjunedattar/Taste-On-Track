'use client';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import Ecomcontext from './contexts/context';
import Searchmap from './components/Searchmaps';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import Link from 'next/link';

const Page = (params) => {
  const [rotate,setrotate] = useState(0)
    const [markerPosition, setMarkerPosition] = useState(['20.5937', '78.9629']); // Default to India
    const [userLocation, setUserLocation] = useState(null);
      const [address, setAddress] = useState("");
    
  
  const [results, setResults] = useState([]);
    const [data, setData] = useState(null); 
  
  const [loading, setLoading] = useState(false);
  const context = useContext(Ecomcontext)
  const [value,setvalue] = useState()
  const { handleSubmit, onchange, submissionStatus, setdeliverydetails ,onsearch,form,toggleDisplay,display,newaddress} = useContext(Ecomcontext);

  const {cart,addToCart,showOrderModal,handleOrderItem,setShowOrderModal,selectedItem,showcart,query,handleChange,location,Detectlocation,onaddress} = context
 const onarrowclick = ()=>{

  if (rotate ===0) {
    setrotate(180)
    
  }
  else{
  setrotate(0)
  }
 }
  const router = useRouter();
    const getAddressFromLatLng = async (lat, lng) => {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data.display_name || "No address found";
      } catch (error) {
        console.error("Error fetching address:", error);
        return "Unable to retrieve address";
      }
    };
    useEffect(() => {
      if (markerPosition) {
        const [lat, lng] = markerPosition;
        getAddressFromLatLng(lat, lng).then((fetchedAddress) => {
          setAddress(fetchedAddress);
          setdeliverydetails((prev) => ({ ...prev, Address: fetchedAddress }));
        });
      }
    }, [markerPosition]);
  
  useEffect(()=>{
    const area = "Guruwar Peth"; // Replace with the specific area name
    const cityName = "Miraj";   // Replace with the city name
    const url = `https://nominatim.openstreetmap.org/search?q=${area},${cityName}&format=json&addressdetails=1`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          const areaDetails = data[0];
          console.log("Area Details:", areaDetails);
        } else {
          console.log("No results found for the specified area.");
        }
      })
      .catch(error => console.error("Error fetching area details:", error));
    
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        const cityDetails = data[0];
        
        console.log("City Details:", cityDetails);
        setUserLocation([cityDetails.lat, cityDetails.lon]);
        setMarkerPosition([cityDetails.lat, cityDetails.lon]);
  
      } else {
        console.log("No results found for the specified city.");
      }
    })
    .catch(error => console.error("Error fetching city details:", error));
  
  
  },[])
    useEffect(() => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([latitude, longitude]);
            setMarkerPosition([latitude, longitude]);
          },
          (error) => {
            setErrorMessage("Unable to retrieve location. Please enable GPS.");
            console.error(error.message);
          }
        );
      } else {
        setErrorMessage("Geolocation is not supported by your browser.");
      }
    }, []);
  
    useEffect(() => {
      if (markerPosition) {
        const [lat, lng] = markerPosition;
        getAddressFromLatLng(lat, lng).then((fetchedAddress) => {
          setAddress(fetchedAddress);
          setdeliverydetails((prev) => ({ ...prev, Address: fetchedAddress }));
        });
      }
    }, [markerPosition]);
    console.log('mark',markerPosition)
  

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

      {/* Search Section */}
      <div className="flex flex-col items-center justify-center my-16">
        <h1 className="text-5xl font-extrabold text-gray-800 text-center mb-6">
          Find the Best Restaurants Near You
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Discover top-rated restaurants, cafes, and food places with a click. Start typing to find your favorite meals!
        </p>

        {/* Search Input */}
        <div className="relative w-full max-w-3xl flex">
        <div className="relative w-full">
  {/* Map Icon on the Left */}
  <div>

  <div className="relative left-4 top-14 transform -translate-y-1/2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 text-gray-500"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
    </svg>
  </div>

  {/* Input Field */}
  <input
    type="text"
    onChange={onaddress}
    value={location.name?location.name:location===''?form.name:location}
    placeholder="Search for delicious restaurants..."
    className="w-full py-4 pl-12 pr-12 text-lg text-gray-700 border-2 border-gray-300  shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
  />
      </div>
      {
        rotate === 0 &&
        
      
      <div className="bg-gray-100 flex items-center justify-center p-6 sticky top-0 z-50">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Address Details</h2>
            <div className="mb-4">
            <button className='text-xl text-red-600' onClick={()=>Detectlocation(address)}>
            Detect current location
              </button>   
            </div>

      <button onClick={toggleDisplay} className='text-xl text-red-600 cursor-pointer'>
        Add Address
      </button>
      <div className='text-xl my-3'>
        Saved Addresses
      </div>


          {submissionStatus === "loading" && <p>Saving your address...</p>}
          {submissionStatus === "success" && <p className="text-green-500">Address saved successfully!</p>}
          {submissionStatus === "error" && <p className="text-red-500">Error saving address. Please try again.</p>}
        </div>
        </div>
}




  {/* Triangular Icon on the Right */}
  <div className={`absolute right-4 top-14 transform rotate-${rotate} -translate-y-1/2`}onClick={onarrowclick}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 cursor-pointer h-4 text-gray-500"
    >
      <path d="M12 2L22 20H2L12 2z" />
    </svg>
  </div>
</div>
        
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for delicious restaurants..."
            className="w-full h-16 my-6 py-4 pl-6 pr-16 text-lg text-gray-700 border-2 border-gray-300  shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          />
          <button className="absolute top-6 right-0 mt-2 mr-4 text-white bg-blue-500 hover:bg-blue-600 rounded-full p-3 shadow-lg">
            <FaSearch size={18} />
          </button>
        </div>
        {/* search */}
        <div
              className={` bg-white   absolute top-0 -left-2 overflow-y-scroll transition-all duration-500 ease-in-out transform ${
                display ? 'max-h-screen   ' : ' -translate-x-full  '
              } overflow-hidden `}
            >
              
              <img width={'22'} onClick={toggleDisplay} src='https://cdn-icons-png.flaticon.com/128/2961/2961937.png' className='relative translate-x-80 mx-4 cursor-pointer'></img>
              <div className="mb-6">
                <Searchmap />
              </div>
            </div>
          </div>
          <Link href={`/Restufold/${markerPosition[0]}`} class="max-w-sm block bg-white rounded-lg mx-auto shadow-lg overflow-hidden">
    <img 
      src="https://b.zmtcdn.com/webFrontend/e5b8785c257af2a7f354f1addaf37e4e1647364814.jpeg?output-format=webp&fit=around|402:360&crop=402:360;*,*" 
      alt="Order Online" 
      class="w-full h-60 object-cover"
    />
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Order Online</h1>
      <p class="text-gray-600">Stay home and order to your doorstep.</p>
    </div>
  </Link>


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
