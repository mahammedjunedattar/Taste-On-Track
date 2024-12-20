'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem('id');
    router.push('/');
  };
useEffect(()=>{
  let restaurantId = localStorage.getItem('id');
  if (!restaurantId) {
    router.push('/Login-Restaurants');
  }


})

  const tabs = [
    { name: 'Orders', id: 'orders' },
    { name: 'Menu Management', id: 'menu' },
    { name: 'Analytics', id: 'analytics' },
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
          {activeTab === 'orders' && <OrdersSection />}
          {activeTab === 'menu' && <MenuManagementSection />}
          {activeTab === 'analytics' && <AnalyticsSection />}
        </div>
      </div>
    </div>
  );
};

const OrdersSection = () => (
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
          <tr>
            <td className="p-2 border-b">#12345</td>
            <td className="p-2 border-b">John Doe</td>
            <td className="p-2 border-b">2 Burgers, 1 Fries</td>
            <td className="p-2 border-b">
              <span className="text-yellow-500">Preparing</span>
            </td>
            <td className="p-2 border-b">
              <button className="py-1 px-3 bg-blue-500 text-white rounded">Update Status</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

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
    console.log(item)
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

export default RestaurantDashboard;
