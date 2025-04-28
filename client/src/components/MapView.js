import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '../App.css'; // custom CSS

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const sourceIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
  iconSize: [40, 40],
});

const LocationMarker = ({ setSource, setDestination, path, setPath }) => {
  useMapEvents({
    click(e) {
      if (!path.length) {
        setSource(e.latlng);
        setPath([e.latlng]);
      } else if (path.length === 1) {
        setDestination(e.latlng);
        setPath([...path, e.latlng]);
      }
    }
  });

  return null;
};

const MapView = ({ selectedJourney, startOption }) => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (selectedJourney && startOption) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(userLocation);

        if (startOption === 'reach_source') {
          setSource(selectedJourney.source);
          setDestination(selectedJourney.destination);
          setPath(selectedJourney.path);
        } else if (startOption === 'shortest_to_destination') {
          setSource(userLocation);
          setDestination(selectedJourney.destination);
          setPath([userLocation, selectedJourney.destination]);
        } else if (startOption === 'follow_saved_path') {
          setSource(userLocation);
          setDestination(selectedJourney.destination);
          setPath([userLocation, ...selectedJourney.path]);
        }
      });
    }
  }, [selectedJourney, startOption]);

  const handleSaveJourney = async () => {
    if (!source || !destination) {
      alert('Please select both source and destination!');
      return;
    }

    const journeyData = {
      name: prompt("Enter a name for this journey:"),
      user_id: 'test-user',
      source,
      destination,
      path,
      transport_mode: 'drive',
    };

    try {
      await axios.post(`${BACKEND_URL}/journeys`, journeyData);
      alert('Journey saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save journey.');
    }
  };

  const resetJourney = () => {
    if (window.confirm('Are you sure you want to reset this journey?')) {
      setSource(null);
      setDestination(null);
      setPath([]);
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[26.9124, 75.7873]} zoom={10} scrollWheelZoom={true} className="map-container">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          setSource={setSource}
          setDestination={setDestination}
          path={path}
          setPath={setPath}
        />

        {source && <Marker position={source} icon={sourceIcon} />}
        {destination && <Marker position={destination} icon={destinationIcon} />}
        {path.length >= 2 && <Polyline positions={path} color="blue" />}

        {currentLocation && (
          <Marker position={currentLocation} icon={new L.Icon({
              iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
              iconSize: [35, 35],
          })} />
        )}
      </MapContainer>

      <div className="footer-menu">
        <button className="btn btn-success" onClick={handleSaveJourney}>
          Save Journey
        </button>
        <button className="btn btn-danger" onClick={resetJourney}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default MapView;
