import React, { useEffect, useState, useCallback, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import bangaloreImg from "../../images/Bangalore.png";

const containerStyle = {
  width: "100%",
  height: "80vh",
  borderRadius: "1rem",
};

const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Bangalore
const dummyPlaces = [
  { name: "Cubbon Park", vicinity: "MG Road", _distance: 1.2, rating: 4.6 },
  { name: "Lalbagh Botanical Garden", vicinity: "Lalbagh", _distance: 3.8, rating: 4.7 },
  { name: "Bangalore Palace Grounds", vicinity: "Vasanth Nagar", _distance: 3.2, rating: 4.4 },
  { name: "Sankey Tank", vicinity: "Sadashivanagar", _distance: 4.5, rating: 4.5 },
  { name: "Ulsoor Lake", vicinity: "Halasuru", _distance: 2.3, rating: 4.2 },
];

export default function MapScreen() {
  const [places, setPlaces] = useState([]);
  const [selected, setSelected] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [origin, setOrigin] = useState(null);
  const [list, setList] = useState([]);
  const mapRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const useDummy = import.meta.env.VITE_USE_DUMMY_MAP === 'true';
  const [loadError, setLoadError] = useState(false);

  const searchNearby = useCallback((map, loc) => {
    const service = new window.google.maps.places.PlacesService(map);
    const types = ["park", "library"];
    const all = [];
    let pending = types.length;
    types.forEach((t) => {
      const req = {
        location: new window.google.maps.LatLng(loc.lat, loc.lng),
        rankBy: window.google.maps.places.RankBy.DISTANCE,
        type: t,
        openNow: true,
      };
      service.nearbySearch(req, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && Array.isArray(results)) {
          all.push(...results);
        }
        pending -= 1;
        if (pending === 0) {
          const seen = new Set();
          const dedup = [];
          all.forEach((r) => {
            if (!seen.has(r.place_id)) {
              seen.add(r.place_id);
              dedup.push(r);
            }
          });
          const withDist = dedup
            .map((r) => {
              const p = r.geometry && r.geometry.location ? r.geometry.location : null;
              let d = null;
              if (p && window.google.maps.geometry) {
                d = window.google.maps.geometry.spherical.computeDistanceBetween(
                  new window.google.maps.LatLng(loc.lat, loc.lng),
                  new window.google.maps.LatLng(p.lat(), p.lng())
                );
              }
              return { ...r, _distance: d };
            })
            .sort((a, b) => (a._distance ?? Infinity) - (b._distance ?? Infinity))
            .slice(0, 20);
          setPlaces(withDist);
          setList(withDist);
        }
      });
    });
  }, []);

  const handleLoad = useCallback((map) => {
    mapRef.current = map;
    const loc = origin || center;
    searchNearby(map, loc);
  }, [origin, center, searchNearby]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCenter(loc);
          setOrigin(loc);
        },
        () => {}
      );
    }
  }, []);

  useEffect(() => {
    window.gm_authFailure = () => {
      setLoadError(true);
    };
    return () => {
      try { delete window.gm_authFailure; } catch {}
    };
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const loc = origin || center;
      searchNearby(mapRef.current, loc);
    }
  }, [origin, center, searchNearby]);

  const focusPlace = useCallback((place) => {
    setSelected(place);
    if (mapRef.current && place?.geometry?.location) {
      mapRef.current.panTo({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  }, []);

  if (!apiKey || useDummy || loadError) {
    return (
      <div className="max-w-6xl mx-auto px-8 py-10">
        <h1 className="text-2xl font-semibold text-green-700 mb-6">🌱 Green Map of Bangalore</h1>
        <div className="shadow-lg rounded-2xl overflow-hidden">
          <img
            src={bangaloreImg}
            alt="Bangalore map"
            className="w-full h-[60vh] object-cover"
          />
        </div>
        <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-slate-900">Nearest free places (central Bengaluru)</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {dummyPlaces.map((p) => (
              <li key={p.name} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium text-slate-900">{p.name}</div>
                  <div className="text-sm text-slate-600">{p.vicinity}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-emerald-600">{p._distance.toFixed(1)} km</div>
                  <div className="text-xs text-yellow-600">⭐ {p.rating}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-10">
      <h1 className="text-2xl font-semibold text-green-700 mb-6">
        🌱 Green Map of Bangalore
      </h1>

      <div className="shadow-lg rounded-2xl overflow-hidden">
        <LoadScript
          googleMapsApiKey={apiKey}
          libraries={["places", "geometry"]}
          onError={() => setLoadError(true)}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={13}
            onLoad={handleLoad}
          >
            {(origin || center) && (
              <Marker
                position={origin || center}
                icon={{ url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" }}
              />
            )}
            {places.map((place) => (
              <Marker
                key={place.place_id}
                position={{
                  lat: place.geometry.location.lat(),
                  lng: place.geometry.location.lng(),
                }}
                onClick={() => setSelected(place)}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }}
              />
            ))}

            {selected && (
              <InfoWindow
                position={{
                  lat: selected.geometry.location.lat(),
                  lng: selected.geometry.location.lng(),
                }}
                onCloseClick={() => setSelected(null)}
              >
                <div>
                  <h2 className="font-semibold text-green-800">
                    {selected.name}
                  </h2>
                  {selected.vicinity && (
                    <p className="text-sm text-gray-600">{selected.vicinity}</p>
                  )}
                  {selected.rating && (
                    <p className="text-sm text-yellow-600 mt-1">
                      ⭐ {selected.rating} / 5
                    </p>
                  )}
                  {typeof selected._distance === "number" && (
                    <p className="text-sm text-gray-600 mt-1">
                      {(selected._distance / 1000).toFixed(2)} km
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-slate-900">Nearest free places</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {list.map((p) => (
            <li
              key={p.place_id}
              className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer"
              onClick={() => focusPlace(p)}
            >
              <div>
                <div className="font-medium text-slate-900">{p.name}</div>
                <div className="text-sm text-slate-600">
                  {p.vicinity || p.formatted_address || ""}
                </div>
              </div>
              <div className="text-right">
                {typeof p._distance === "number" && (
                  <div className="text-sm font-semibold text-emerald-600">
                    {(p._distance / 1000).toFixed(2)} km
                  </div>
                )}
                {p.rating && (
                  <div className="text-xs text-yellow-600">⭐ {p.rating}</div>
                )}
              </div>
            </li>
          ))}
          {list.length === 0 && (
            <li className="p-4 text-sm text-slate-500">No nearby places found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
