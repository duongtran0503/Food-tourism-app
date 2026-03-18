import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🛠️ Sửa lỗi Icon Marker không hiển thị (Lỗi phổ biến của Leaflet với Webpack/Vite)
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapSection = ({ restaurants }) => {
  const center = [21.0285, 105.8542]; // Tọa độ Hà Nội [lat, lng]

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={14} 
        scrollWheelZoom={true}
        className="h-full w-full rounded-[40px]"
        zoomControl={false} // Ẩn nút zoom mặc định để tự tùy chỉnh
      >
        {/* 🌑 Dark Mode Tile Layer từ CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <ZoomControl position="topright" />

        {/* Render Markers */}
        {restaurants.map((res) => (
          <Marker key={res.id} position={[res.lat, res.lng]}>
            <Popup>
              <div className="text-gray-900 p-1">
                <h4 className="font-bold text-sm">{res.name}</h4>
                <p className="text-[10px]">{res.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Trang trí thêm lớp phủ mờ nhẹ lên bản đồ để trông "Glass" hơn */}
      <div className="absolute inset-0 pointer-events-none border-[12px] border-[#020617]/20 rounded-[40px] z-10" />
    </div>
  );
};

export default MapSection;