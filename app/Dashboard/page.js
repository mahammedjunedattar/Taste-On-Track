'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from "react-icons/fa";


const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('id');
    router.push('/');
  };

  const tabs = [
    { name: 'Orders', id: 'orders' },
    { name: 'Menu Management', id: 'menu' },
    { name: 'Analytics', id: 'analytics' },
    { name: 'Deleveryparteners', id: 'deleveryparteners' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white p-4 flex justify-between">
        <h1 className="text-2xl font-bold">Restaurant Management Dashboard</h1>
        <button
          onClick={logout}
          className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-md hover:from-red-600 hover:to-pink-600 transform transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1">
        <nav className="w-1/4 bg-white p-4 shadow-lg">
          <ul className="space-y-4">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`block w-full text-left py-2 px-4 rounded-md ${
                    activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="w-3/4 p-6">
          {activeTab === 'orders' && <OrdersSection/>}
          {activeTab === 'menu' && <MenuManagementSection />}
          {activeTab === 'analytics' && <AnalyticsSection />}
          {activeTab === 'deleveryparteners' && <Deleveryparteners />}
        </div>
      </div>
    </div>
  );
};


const OrdersSection = () => {
  const [orders, setOrders] = useState([]); // State to hold orders
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage errors
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [selectedOrder, setSelectedOrder] = useState(null); // State to hold the selected order
  const [newStatus, setNewStatus] = useState(""); // State to hold the new status
  const [query, setQuery] = useState("");
  const [result, setResults] = useState([]);
  const [loadings, setLoadings] = useState(true);


  const handleChange = (event) => {
    setQuery(event.target.value);
    // Add search functionality here (e.g., filter the delivery partners list based on the query)
  };
    useEffect(() => {
  
  const fetchResults = async () => {
    if (!query) return;

    setLoadings(true);
    try {
      const res = await fetch(`/apis/getparteners?q=${query}`);
      const data = await res.json();
      console.log(data)
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadings(false);
    }
  };
  fetchResults();
}, [query])


  useEffect(() => {
    // Function to fetch orders from the server
    const fetchOrders = async () => {
      try {
        const response = await fetch("/apis/display-orders", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Error fetching orders: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data.users); // Assuming the response contains a 'users' array

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


    fetchOrders();
  }, []); // Run only once when the component is mounted
  console.log(orders)


  const openModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || "Pending"); // Pre-fill with the current status
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
    setNewStatus("");
  };

  const handleStatusUpdate = async () => {
    try {
      const response = await fetch(`/apis/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedOrder._id,
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the local state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: newStatus }
            : order
        )
      );

      closeModal(); // Close the modal after updating
    } catch (err) {
      console.error(err);
    }
  };
  const Assignorders = async (cart,deliveryDetails,stauses,deliveryDate) => {
    try {
      const response = await fetch(`/apis/Assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart: cart,
          deliveryDetails: deliveryDetails,
          status: stauses, // e.g., Pending, In Progress, Delivered
          deliveryDate: deliveryDate, // Add a timestamp for when the order was delivered
      }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to assign order");
      }
  
      // Update the local state to reflect the assignment
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: newStatus }
            : order
        )
      );
  
      alert("Order assigned successfully!");
    } catch (err) {
      console.error("Error assigning order:", err);
      alert("Failed to assign order. Please try again.");
    }
  };
  // Conditional rendering for loading, error, and no orders
  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!orders || orders.length === 0) {
    return <div>No orders found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Current Orders</h2>
      <div className="bg-white p-4 rounded-md shadow-md">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left p-2 border-b">Order ID</th>
              <th className="text-left p-2 border-b">Customer</th>
              <th className="text-left p-2 border-b">Items</th>
              <th className="text-left p-2 border-b">Status</th>
              <th className="text-left p-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td className="p-2 border-b">{order._id || "N/A"}</td>
                <td className="p-2 border-b">
                  {order.deliveryDetails.Name || "Unknown"}
                </td>
                <td className="p-2 border-b">
                  {order.cart.map((item, idx) => (
                    <div key={idx}>
                      {item.name} (x{item.quantity})
                    </div>
                  ))}
                </td>
                <td className="p-2 border-b">
                  <span className="text-yellow-500">
                    {order.status || "Pending"}
                  </span>
                </td>
                <td className="p-2 border-b">
                  <button
                    onClick={() => openModal(order)}
                    className="py-1 px-3 bg-blue-500 text-white rounded"
                  >
                    Update Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Update Order Status</h2>
            <p className="mb-2">
              Order ID: <strong>{selectedOrder._id}</strong>
            </p>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Out of delivery">Out of delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
        <div className="p-6 bg-gray-50 min-h-screen">
    {/* Search Bar */}
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for delivery partners..."
        className="w-full h-16 my-6 py-4 pl-6 pr-16 text-lg text-gray-700 border-2 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <button className="absolute top-7 right-6 text-white bg-blue-500 hover:bg-blue-600 rounded-full p-3 shadow-lg">
        <FaSearch size={18} />
      </button>
    </div>

    {/* Results Section */}
    <div className="mt-8">
      {result.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No delivery partners found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.map((partner, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {partner.name}
              </h3>
              <p className="text-gray-600 mt-2">
                <strong>contact:</strong> {partner.contact}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Email:</strong> {partner.email}
              </p>
              <button onClick={()=>Assignorders(partner.cart,partner.deliveryDetails,partner.status,partner.createdAt)}
                    
                    className="py-1 px-3 bg-blue-500 text-white rounded my-8"
                  >
                    Assign order
                  </button>

            </div>
          ))}
        </div>
      )}
    </div>
  </div>

    </div>
    
  );
};


const MenuManagementSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState({ category: '', items: [{ name: '', description: '' }] });

  const restaurantName = localStorage.getItem('Name');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (!restaurantName) throw new Error("Restaurant name not found in localStorage");

        const res = await fetch(`/apis/search?q=${restaurantName}`);
        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json();
        setResults(data.results);

        setMenu({
          category: data.results[0]?.menu[0]?.category || '',
          items: data.results[0]?.menu[0]?.items   ||[{ name: '', description: '' }]
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [restaurantName]);
  const openModal = (categorys,item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    setMenu({ category: categorys, items: item||[{ name: '', description: '' }] });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setMenu({ category: '', items: [{ name: '', description: '' }] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMenu((prev) => ({
      ...prev,
      items: [{ ...prev.items[0], [name]: value }],
    }));
  };


  const handleSaveChanges = async () => {
    try {
      const dataToSave = [{
        _id: localStorage.getItem('id'),
        category: menu.category,
        items: menu.items
      },];

      const response = await fetch(`/apis/updatemenu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      });

      if (!response.ok) throw new Error("Failed to save changes");

      const fetchResults = async () => {
        try {
          if (!restaurantName) throw new Error("Restaurant name not found in localStorage");
  
          const res = await fetch(`/apis/search?q=${restaurantName}`);
          if (!res.ok) throw new Error("Failed to fetch data");
  
          const data = await res.json();
          setResults(data.results);
  
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchResults();
        closeModal();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Menu</h2>
      <div className="bg-white p-4 rounded-md shadow-md">
        {loading ? (
          <p>Loading...</p>
        ) : (
          results[0].menu.map((category) => (
            <div key={category.category} className="bg-gray-100 p-3 rounded-md mb-4">
              <h4 className="font-bold">{category.category}</h4>
              {category.items.map((item) => (
                <div key={item.name} className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <button onClick={() => openModal(category.category,item)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit Item
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2>Edit Item: {menu.items.name}</h2>
            <input
              name="name"
              value={menu.items.name}
              onChange={handleInputChange}
              className="w-full p-2 border mb-4 rounded"
            />
            <textarea
              name="description"
              value={menu.items.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            ></textarea>
            <div className="flex justify-end mt-4">
              <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded mr-2">
                Cancel
              </button>
              <button onClick={handleSaveChanges} className="bg-blue-500 text-white px-4 py-2 rounded">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsSection = () => (
  <div>
    <h2 className="text-xl font-bold mb-4">Analytics</h2>
    <p>Coming Soon!</p>
  </div>
);
const Deleveryparteners = () => {
  const [query, setQuery] = useState("");
  const [result, setResults] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleChange = (event) => {
    setQuery(event.target.value);
    // Add search functionality here (e.g., filter the delivery partners list based on the query)
  };
    useEffect(() => {
  
  const fetchResults = async () => {
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch(`/apis/getparteners?q=${query}`);
      const data = await res.json();
      console.log(data)
      setResults(data.results);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchResults();
}, [query])


return (
  <div className="p-6 bg-gray-50 min-h-screen">
    {/* Search Bar */}
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search for delivery partners..."
        className="w-full h-16 my-6 py-4 pl-6 pr-16 text-lg text-gray-700 border-2 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <button className="absolute top-7 right-6 text-white bg-blue-500 hover:bg-blue-600 rounded-full p-3 shadow-lg">
        <FaSearch size={18} />
      </button>
    </div>

    {/* Results Section */}
    <div className="mt-8">
      {result.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No delivery partners found.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.map((partner, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {partner.name}
              </h3>
              <p className="text-gray-600 mt-2">
                <strong>contact:</strong> {partner.contact}
              </p>
              <p className="text-gray-600 mt-1">
                <strong>Email:</strong> {partner.email}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
};



export default RestaurantDashboard;
