"use client";

import React, { useState, useEffect, useRef, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Ecomcontext from "../contexts/context";
import axios from "axios";

// Configure default Leaflet marker icon
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";


const DefaultIcon = L.icon({
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ClickLocation = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
};

const Map = () => {
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [markerPosition, setMarkerPosition] = useState([20.5937, 78.9629]); // Default to India
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  const { handleSubmit, onchange, submissionStatus, setdeliverydetails } = useContext(Ecomcontext);

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

  const handleMapClick = (lat, lng) => {
    setMarkerPosition([lat, lng]);
    setUserLocation([lat, lng]);
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={userLocation || [20.5937, 78.9629]}
        zoom={userLocation ? 16 : 5}
        style={{ height: "50%", width: "100%" }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {userLocation && (
          <Marker position={markerPosition}>
            <Popup>
              Latitude: {markerPosition[0]}, Longitude: {markerPosition[1]}
            </Popup>
          </Marker>
        )}
        <ClickLocation  onMapClick={handleMapClick} />
      </MapContainer>

      <div className="bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Address Details</h2>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                required
                onChange={onchange}
                name="Name"
                type="text"
                id="Name"
                placeholder="Enter Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                required
                name="Address"
                value={address}
                type="text"
                id="address"
                placeholder="Enter your full address"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly
              />
            </div>

            <div className="mb-4">
              <label htmlFor="flat" className="block text-sm font-medium text-gray-700 mb-1">
                Flat No.
              </label>
              <input
                required
                onChange={onchange}
                name="flat"
                type="text"
                id="flat"
                placeholder="Flat / Apartment Number"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                Area
              </label>
              <input
                required
                onChange={onchange}
                name="area"
                type="text"
                id="area"
                placeholder="Area / Locality"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-700 mb-1">
                Landmark
              </label>
              <input
                onChange={onchange}
                name="landmark"
                type="text"
                id="landmark"
                placeholder="Nearby Landmark (optional)"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              Save Address
            </button>
          </form>

          {submissionStatus === "loading" && <p>Saving your address...</p>}
          {submissionStatus === "success" && <p className="text-green-500">Address saved successfully!</p>}
          {submissionStatus === "error" && <p className="text-red-500">Error saving address. Please try again.</p>}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 text-red-600">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Map;
