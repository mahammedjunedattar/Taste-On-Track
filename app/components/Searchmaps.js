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

const Searchmap = () => {
  const [address, setAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const mapRef = useRef(null);

  const { markerPosition,setMarkerPosition, handleSubmit, onchange, submissionStatus, setdeliverydetails,searchrestuarants,onaddress,Detectlocation,userLocation,setUserLocation } = useContext(Ecomcontext);
  

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
        Detectlocation(fetchedAddress)
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Set your delivery location
          </h2>
          <div className="">DELIVERY AREA</div>
          <input  name="name" className="w-full my-3 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  onChange={onaddress}  type="text" /> 
          <button onClick={searchrestuarants}
              type="submit"
              className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              confirm And proceed
            </button>

        </div>
      </div>

    </div>
  );
};

export default Searchmap;
