"use client";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function LocationMiniMap({ latitude, longitude }) {
  const [L, setL] = useState(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default);

      // Fix default icon paths
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      setMapReady(true);
    });
  }, []);

  if (!mapReady || !L) {
    return (
      <div className="w-full h-[220px] flex items-center justify-center bg-gradient-to-br from-cyan-50 to-teal-50 rounded-2xl">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Memuat peta...</p>
        </div>
      </div>
    );
  }

  return <MiniMapContent L={L} latitude={latitude} longitude={longitude} />;
}

function MiniMapContent({ L, latitude, longitude }) {
  const { MapContainer, TileLayer, Marker, Popup } = require("react-leaflet");

  const markerIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 32px; height: 32px; border-radius: 50%;
        background: linear-gradient(135deg, #06b6d4, #3b82f6);
        border: 3px solid white;
        box-shadow: 0 2px 12px rgba(6, 182, 212, 0.5);
        display: flex; align-items: center; justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={16}
      style={{ height: "220px", width: "100%", borderRadius: "1rem" }}
      scrollWheelZoom={false}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={false}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]} icon={markerIcon}>
        <Popup>
          <div className="text-center">
            <p className="text-xs font-semibold text-slate-700 mb-0.5">
              Lokasi Anda
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
