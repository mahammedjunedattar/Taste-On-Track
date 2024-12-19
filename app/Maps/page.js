'use client'
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/map"), { ssr: false });

const MapPage = () => {
  return (
    <div  >
      <Map />
    </div>
    
  );
};

export default MapPage;
