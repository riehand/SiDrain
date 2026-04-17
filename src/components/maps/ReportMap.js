"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// We need to dynamically import the map to avoid SSR issues
function MapInner({ reports, onMarkerClick, selectedStatus, selectedCategory }) {
  const [L, setL] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    // Import leaflet on client side
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);
      
      // Fix default icon
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      setMapReady(true);
    });
  }, []);

  if (!mapReady || !L) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return <MapContent L={L} reports={reports} onMarkerClick={onMarkerClick} selectedStatus={selectedStatus} selectedCategory={selectedCategory} />;
}

function MapContent({ L, reports, onMarkerClick, selectedStatus, selectedCategory }) {
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");
  
  const statusColors = {
    "Menunggu Verifikasi": "#9ca3af",
    "Diverifikasi": "#3b82f6",
    "Diproses": "#f59e0b",
    "Selesai": "#22c55e",
    "Ditolak": "#ef4444",
  };

  const filteredReports = reports.filter(r => {
    if (selectedStatus && selectedStatus !== "all" && r.status !== selectedStatus) return false;
    if (selectedCategory && selectedCategory !== "all" && r.category_id !== parseInt(selectedCategory)) return false;
    return true;
  });

  const createIcon = (status) => {
    const color = statusColors[status] || "#9ca3af";
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  return (
    <MapContainer
      center={[-6.3, 106.85]}
      zoom={10}
      style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filteredReports.map((report) => (
        <Marker
          key={report.id}
          position={[report.latitude, report.longitude]}
          icon={createIcon(report.status)}
          eventHandlers={{
            click: () => onMarkerClick && onMarkerClick(report),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-semibold text-sm mb-1">{report.title}</h3>
              <p className="text-xs text-gray-500 mb-2">{report.address}</p>
              <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium" style={{
                background: `${statusColors[report.status]}20`,
                color: statusColors[report.status],
              }}>
                {report.status}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// Export as dynamic with no SSR
export default dynamic(() => Promise.resolve(MapInner), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-400">Memuat peta...</p>
      </div>
    </div>
  ),
});
