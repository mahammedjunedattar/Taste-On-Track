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
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [cart, setCart] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showcart,setshowcart] = useState(false)
  const [submissionStatus, setSubmissionStatus] = useState(null); // Submission status
  const [display, setDisplay] = useState(false);
  const toggleDisplay = () => {
    setDisplay(!display);
  };
  const handleChange = (e) => setQuery(e.target.value);


  const [deliverydetails, setdeliverydetails] = useState({
    Address: "",
    flat: "",
    area: "",
    landmark: "",
  });
  const onchange = (e) => {
    const { name, value } = e.target;
    setdeliverydetails((prev) => ({ ...prev, [name]: value }));
  };

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
  
    console.log(updatedCart);
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
        <Ecomcontext.Provider value={{ cart, addToCart, showOrderModal, handleOrderItem, setShowOrderModal, selectedItem,showcart ,handleSubmit,onchange,submissionStatus,setdeliverydetails,deliverydetails,toggleDisplay,display,removeFromCart,query,handleChange}}>
                <Navbar quereirs={query}/>
          
          {children}

          <Footer/>
        </Ecomcontext.Provider>
      </body>
    </html>
  );
}
