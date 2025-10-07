'use client'; // Client-only for geolocation/map

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import Link from 'next/link';
// Update the path below to the correct relative path if needed:
import shopsData from '../../data/shops.json'; // Adjust path as necessary

// Fix Leaflet markers (add to a lib if you want)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Full shop type (now includes all fields from your JSON + extras)
interface Shop {
  id: number;
  name: string;
  city: string;
  address: string;
  website: string;
  lat: number;
  lng: number;
  desc: string;
  rating: number;
}

const shops: Shop[] = shopsData as Shop[]; // Safe cast since we added desc/rating to JSON

export default function ShopsPage() {
  const [userPosition, setUserPosition] = useState<LatLngExpression | null>(null);
  const [ratings, setRatings] = useState<Record<string | number, number | string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('coffeeRatings');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.geolocation && !userPosition) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.warn('Geolocation error:', err);
          setError('Location access denied. Using default view—enable for nearby spots.');
          setUserPosition([33.7490, -84.3880]); // Fallback: Atlanta centroid
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, [userPosition]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('coffeeRatings', JSON.stringify(ratings));
    }
  }, [ratings]);

  const updateRating = (id: number, value?: number, note?: string) => {
    setRatings((prev) => {
      const updated: Record<string | number, string | number> = { ...prev };
      if (value !== undefined) {
        updated[id] = value;
      }
      if (note !== undefined) {
        updated[`${id}-note`] = note;
      }
      return updated;
    });
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-amber-900 to-amber-200 text-amber-900">
        <div className="text-center">
          <div className="text-6xl mb-4">☕</div>
          <p className="text-xl italic">Finding your location...</p>
        </div>
      </main>
    );
  }

  const LocationMarker = ({ position }: { position: LatLngExpression }) => (
    <Marker position={position}>
      <Popup>You are here! ☕</Popup>
    </Marker>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber-900 to-amber-200 text-amber-900 p-0"> {/* Cozy gradient */}
      <header className="bg-black/20 backdrop-blur-sm text-center py-6 px-8">
        <h1 className="text-4xl font-bold mb-2">☕ Coffee Snob Shops</h1>
        <p className="text-lg opacity-90">Snob-approved spots on the map</p>
      </header>
      <div className="flex h-[calc(100vh-12rem)]"> {/* Responsive height */}
        <MapContainer
          center={userPosition || [33.7490, -84.3880]}
          zoom={userPosition ? 12 : 6} // Tighter zoom if located
          className="flex-1 h-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {userPosition && <LocationMarker position={userPosition} />}
          {shops.map((shop) => (
            <Marker key={shop.id} position={[shop.lat, shop.lng]}>
              <Popup>
                <div className="min-w-[200px]">
                  <b>{shop.name}</b>
                  <br />
                  {shop.desc}
                  <br />
                  Avg Rating: {shop.rating}/5
                  <br />
                  <Link
                    href={`/shops/${shop.id}`}
                    className="text-blue-400 hover:underline block mt-2 text-sm"
                  >
                    View Full Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="w-80 bg-white/95 backdrop-blur-sm overflow-y-auto shadow-xl">
          <h2 className="text-xl font-semibold p-4 border-b text-amber-900">Rate Nearby Spots</h2>
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.01)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <h3 className="font-semibold text-amber-900 mb-1">{shop.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{shop.desc}</p>
              <p className="text-sm font-medium mb-2">Avg: {shop.rating}/5</p>
              <div className="flex flex-col items-start mb-2">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label key={star} className="cursor-pointer mr-1">
                      <input
                        type="radio"
                        name={`rating-${shop.id}`}
                        value={star}
                        checked={Number(ratings[shop.id]) >= star}
                        onChange={(e) => updateRating(shop.id, parseInt(e.target.value), ratings[`${shop.id}-note`] as string)}
                        className="hidden"
                      />
                      <span
                        className="text-2xl"
                        style={{ color: (ratings[shop.id] as number) >= star ? '#FF4500' : '#FFD700' }}
                      >
                        ⭐
                      </span>
                    </label>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Quick note (e.g., 'Bold & balanced!')"
                  value={ratings[`${shop.id}-note`] || ''}
                  onChange={(e) => updateRating(shop.id, ratings[shop.id] as number, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded text-black text-sm"
                />
              </div>
              <button
                onClick={() => alert('Saved! Your snob cred ↑ ☕')}
                className="w-full bg-amber-900 text-white py-1 rounded text-sm hover:bg-amber-800 transition"
              >
                Save Take
              </button>
            </div>
          ))}
        </div>
      </div>
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg max-w-sm">
          {error}{' '}
          <button onClick={() => window.location.reload()} className="underline ml-2">
            Retry
          </button>
        </div>
      )}
      <Link
        href="/"
        className="fixed top-4 left-4 bg-white text-amber-900 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition"
      >
        ← Home
      </Link>
    </main>
  );
}