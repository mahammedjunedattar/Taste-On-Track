'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import context from "../context/context";
import { useContext } from "react";
import Link from "next/link";
const RestaurantRegistrationForm = ({children}) => {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: {
      street: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
    },
    contact: {
      phone: "",
      email: "",
      website: "",
    },
    opening_hours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    },
    cuisines: [],
    photos: [{ url: "", description: "" }], // Multiple photos
    menu: [
      {
        category: "",
        items: [
          {
            name: "",
            description: "",
            price: 0,
            currency: "USD",
            availability: true,
            tags: [],
            calories: 0,
            customizations: [{ type: "", options: [] }],
          },
        ],
      },
    ],
    delivery_options: {
      available: false,
      platforms: [],
      minimum_order_value: 0,
      delivery_fee: 0,
      estimated_time: "",
    },

  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    console.log(value)
    setRestaurant((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };


  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      contact: { ...prev.contact, [name]: value },
    }));
  };

  const handleOpeningHoursChange = (e) => {
    const { name, value } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      opening_hours: { ...prev.opening_hours, [name]: value },
    }));
  };

  const handleCuisinesChange = (e) => {
    const { value } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      cuisines: value.split(",").map((cuisine) => cuisine.trim()),
    }));
  };

  // New function to handle the menu changes
  const handleMenuChange = (categoryIndex, itemIndex, field, value) => {
    const updatedMenu = [...restaurant.menu];
    if (field === "category") {
      updatedMenu[categoryIndex].category = value;
    } else {
      updatedMenu[categoryIndex].items[itemIndex][field] = value;
    }
    setRestaurant((prev) => ({ ...prev, menu: updatedMenu }));
  };

  // New function to handle multiple photos
  const handlePhotoChange = (index, field, value) => {
    const updatedPhotos = [...restaurant.photos];
    updatedPhotos[index][field] = value;
    setRestaurant((prev) => ({ ...prev, photos: updatedPhotos }));
  };

  const handleAddPhoto = () => {
    setRestaurant((prev) => ({
      ...prev,
      photos: [...prev.photos, { url: "", description: "" }],
    }));
  };



  const handleSubmit =async (e) => {
    e.preventDefault();
    console.log("Restaurant Data:", restaurant);
    // You can now send the restaurant data to your server here.
    try {
      const response = await fetch('/apis/Addrstuarant', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(restaurant),
          credentials: 'include' // Include credentials in the request
  });
      const result = await response.json();
  
      if (response.ok) {
        router.push('Dashboard')
        
      }
  
      
  } catch (error) {
      console.error('Error creating account:', error);
      
  }
  
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Register Your Restaurant</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Restaurant Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
          <input
            type="text"
            name="name"
            value={restaurant.name}
            onChange={handleInputChange}
            className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter restaurant name"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={restaurant.address.street}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={restaurant.address.city}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={restaurant.address.state}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Postal Code"
              value={restaurant.address.postal_code}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={restaurant.address.country}
              onChange={handleAddressChange}
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Information</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={restaurant.contact.phone}
              onChange={handleContactChange}
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={restaurant.contact.email}
              onChange={handleContactChange}
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
            />
            <input
              type="text"
              name="website"
              placeholder="Website"
              value={restaurant.contact.website}
              onChange={handleContactChange}
              className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {Object.keys(restaurant.opening_hours).map((day) => (
              <input
                key={day}
                type="text"
                name={day}
                placeholder={day.charAt(0).toUpperCase() + day.slice(1)}
                value={restaurant.opening_hours[day]}
                onChange={handleOpeningHoursChange}
                className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm"
              />
            ))}
          </div>
          <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        {/* Restaurant Name */}
        <div>
        </div>

        {/* Photos Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Photos</label>
          {restaurant.photos.map((photo, index) => (
            <div key={index} className="space-y-2 mt-2">
              <input
                type="text"
                placeholder="Photo URL"
                value={photo.url}
                onChange={(e) => handlePhotoChange(index, "url", e.target.value)}
                className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
              />
              <input
                type="text"
                placeholder="Photo Description"
                value={photo.description}
                onChange={(e) => handlePhotoChange(index, "description", e.target.value)}
                className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPhoto}
            className="mt-2 py-2 px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
          >
            Add Photo
          </button>
        </div>

        {/* Menu Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Menu</label>
          {restaurant.menu.map((menuCategory, categoryIndex) => (
            <div key={categoryIndex} className="mt-4">
              <input
                type="text"
                placeholder="Menu Category (e.g., Starters, Main Course)"
                value={menuCategory.category}
                onChange={(e) =>
                  handleMenuChange(categoryIndex, null, "category", e.target.value)
                }
                className="block w-full p-2 mb-2 rounded-md border-gray-300 shadow-sm"
              />

              {menuCategory.items.map((item, itemIndex) => (
                <div key={itemIndex} className="space-y-2 p-4 bg-gray-100 rounded-md">
                  <input
                    type="text"
                    placeholder="Item Name"
                    value={item.name}
                    onChange={(e) =>
                      handleMenuChange(categoryIndex, itemIndex, "name", e.target.value)
                    }
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                  />
                  <textarea
                    placeholder="Item Description"
                    value={item.description}
                    onChange={(e) =>
                      handleMenuChange(categoryIndex, itemIndex, "description", e.target.value)
                    }
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.price}
                    onChange={(e) =>
                      handleMenuChange(categoryIndex, itemIndex, "price", e.target.value)
                    }
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Tags (e.g., Vegan, Spicy)"
                    value={item.tags.join(", ")}
                    onChange={(e) =>
                      handleMenuChange(categoryIndex, itemIndex, "tags", e.target.value.split(",").map(tag => tag.trim()))
                    }
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                  />
                  <input
                    type="number"
                    placeholder="Calories"
                    value={item.calories}
                    onChange={(e) =>
                      handleMenuChange(categoryIndex, itemIndex, "calories", e.target.value)
                    }
                    className="block w-full p-2 rounded-md border-gray-300 shadow-sm"
                  />
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-medium text-gray-700">Available:</label>
                    <input
                      type="checkbox"
                      checked={item.availability}
                      onChange={(e) =>
                        handleMenuChange(categoryIndex, itemIndex, "availability", e.target.checked)
                      }
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}

              {/* Button to add another item */}
              <button
                type="button"
                onClick={() => {
                  const updatedMenu = [...restaurant.menu];
                  updatedMenu[categoryIndex].items.push({
                    name: "",
                    description: "",
                    price: 0,
                    availability: true,
                    tags: [],
                    calories: 0,
                  });
                  setRestaurant((prev) => ({ ...prev, menu: updatedMenu }));
                }}
                className="mt-2 py-2 px-4 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600"
              >
                Add Item
              </button>
            </div>
          ))}

          {/* Button to add another category */}
          <button
            type="button"
            onClick={() => {
              setRestaurant((prev) => ({
                ...prev,
                menu: [
                  ...prev.menu,
                  {
                    category: "",
                    items: [
                      {
                        name: "",
                        description: "",
                        price: 0,
                        availability: true,
                        tags: [],
                        calories: 0,
                      },
                    ],
                  },
                ],
              }));
            }}
            className="mt-4 py-2 px-4 bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600"
          >
            Add Menu Category
          </button>
        </div>
<div/>

        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3 px-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Registration
          </button>
        </div>
       <Link href={'/Login-Restuarants'}>  Alread have Register ?  </Link> 
        <div className="my-3">
          <button
            type="submit"
            className="w-10 py-3 px-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Submit Registration
          </button>
        </div>
        </div>

      </form>


      
    </div>
  );
};

export default RestaurantRegistrationForm;
