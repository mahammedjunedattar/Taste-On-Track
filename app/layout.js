'use client'
import { Inter } from 'next/font/google';
import './globals.css';
import Ecomcontext from './contexts/context';
import { useState,useEffect } from 'react';
import Footer from './components/Footer/footer';
import Navbar from './components/Navbar/page';



const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
    const [query, setQuery] = useState('');
    const [form, setform] = useState('');
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showcart,setshowcart] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState(null); // Submission status
  const [display, setDisplay] = useState(false);
    const [markerPosition, setMarkerPosition] = useState([20.5937, 78.9629]); // Default to India
  
    const [newaddress, setnewaddress] = useState("");
      const [userLocation, setUserLocation] = useState(null);
    
      const [location, setlocation] = useState("");


    const [order ,setorder] =  useState([])
    const onplaceorder = async (e) => {
      e.preventDefault(); // Prevent default form submission behavior
      
      try {
        // Prepare the payload as an array
        console.log(deliverydetails)
        let carts = cart[1].items
        const payload = [deliverydetails, carts];
    
        // Send POST request to the server
        const response = await fetch("/apis/order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include", // Include cookies in the request
        });
    
        // Check if the response is successful
        if (!response.ok) {
          throw new Error(`Failed to place order: ${response.statusText}`);
        }
    
        // Parse the server response
        const data = await response.json();
    
        // Update submission status or perform further actions
        setSubmissionStatus("success");
    
        // Optionally clear cart or redirect
      } catch (error) {
        console.error("Error placing order:", error);
        setSubmissionStatus("error"); // Update UI to show error status
      }
    };
          const toggleDisplay = () => {
    setDisplay(!display);
  };
  const handleChange = (e) => setQuery(e.target.value);
  const onsearch = (e) => setform(e.target.value);


  const [deliverydetails, setdeliverydetails] = useState({
    Name : "",
    Address: "",
    flat: "",
    area: "",
    landmark: "",
  });
  const onchange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value)
    setdeliverydetails((prev) => ({ ...prev, [name]: value }));
  };
  console.log(deliverydetails)
  const onaddress = (e) => {
    const { name, value } = e.target;
    setlocation('')
    setform((prev) => ({ ...prev, [name]: value }));
  };
const searchrestuarants = ()=>{
  setlocation(form)
  setDisplay(false)
}
const Detectlocation = (locations)=>{
  setlocation(locations)
}
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus("loading");
    try {
      const response = await fetch("/apis/Address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deliverydetails),
        credentials: "include",
      });
      if (response.ok) {
        localStorage.setItem('address',deliverydetails.Address)
        setSubmissionStatus("success");
      setDisplay(false)
      } else {
        throw new Error("Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setSubmissionStatus("error");
    }
  };


  const addToCart = (item) => {
    const uniqueid = localStorage.getItem('token');
    if (!uniqueid) {
      console.error("No user token found!");
      return;
    }
  
    const existingCartIndex = cart.findIndex((cartItem) => cartItem.uniqueid === uniqueid);
  
    let updatedCart;
  
    if (existingCartIndex !== -1) {
      // User already has a cart; check for the item
      const userCart = cart[existingCartIndex];
      const itemIndex = userCart.items.findIndex(
        (cartItem) => cartItem.name === item.name && cartItem.description === item.description
      );
  
      if (itemIndex !== -1) {
        // Update the existing item's quantity
        userCart.items[itemIndex].quantity += item.quantity;
      } else {
        // Add the new item
        userCart.items.push(item);
      }
  
      updatedCart = [...cart];
      updatedCart[existingCartIndex] = userCart; // Update the user's cart
    } else {
      // Create a new cart for the user
      updatedCart = [...cart, { uniqueid, items: [item] }];
    }
  
    saveCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart)); // Save to localStorage
    setShowOrderModal(false);
    setshowcart(true);
  };
    setTimeout(() => {
    setshowcart(false)
    
  }, 3000);
  useEffect(() => {
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart)); // Load saved cart into state
    }
  }, []);
  


  const removeFromCart = (itemCode, qty) => {
    const updatedCart = cart.map((item) => {
      // Update the nested `items` array within each cart item
      const updatedItems = item.items.map((e) => {
        // Check if the item matches and update its quantity
        if (e.name === itemCode) {
          return { ...e, quantity: Math.max(e.quantity - qty, 0) };
        }
        return e;
      });
  
      // Filter out items with zero quantity
      const filteredItems = updatedItems.filter((e) => e.quantity > 0);
  
      // Return the updated cart object with the filtered `items`
      return { ...item, items: filteredItems };
    });
  
    // Filter out cart entries where all items are removed
    const filteredCart = updatedCart.filter((item) => item.items.length > 0);
  
    // Save the updated cart
    saveCart(filteredCart);
  };
  


  const handleOrderItem = (item) => {
    setSelectedItem(item);
    setShowOrderModal(true);
  };
  const saveCart = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <html lang="en">
      <body className={inter.className}>

        <Ecomcontext.Provider value={{ onplaceorder, cart, addToCart, showOrderModal, handleOrderItem, setShowOrderModal, selectedItem,showcart ,handleSubmit,onchange,submissionStatus,setdeliverydetails,deliverydetails,toggleDisplay,display,removeFromCart,query,handleChange,onsearch,form,searchrestuarants,onaddress,location,Detectlocation,setMarkerPosition,markerPosition,userLocation,setUserLocation}}>
                <Navbar quereirs={query}/>
                {children}

          

          <Footer/>
        </Ecomcontext.Provider>
      </body>
    </html>
  );
}
