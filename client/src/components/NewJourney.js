import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const NewJourney = ({ onBack }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const sourceIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [40, 40],
  });

  const destinationIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
    iconSize: [40, 40],
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported!');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const loc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentLocation(loc);
    });
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported!');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(loc);
        setPath([loc]); // Start path with real live location
      },
      (error) => {
        console.error(error);
        alert('Failed to get your location.');
      },
      {
        enableHighAccuracy: true,
      }
    );
  
    const id = navigator.geolocation.watchPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(loc);
        setPath((prevPath) => [...prevPath, loc]);
      },
      (error) => {
        console.error(error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
  
    setTracking(true);
    setWatchId(id);
  };
  

  const stopTracking = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setTracking(false);

      if (path.length < 2) {
        alert('Journey is too short to save!');
        return;
      }

      const journeyName = prompt('Enter a name for your journey:');
      if (!journeyName) {
        alert('Journey not saved - no name provided.');
        return;
      }

      const journeyData = {
        name: journeyName,
        user_id: 'test-user',
        source: path[0],
        destination: path[path.length - 1],
        path: path,
        transport_mode: 'drive',
      };

      try {
        await axios.post('http://localhost:5000/journeys', journeyData);
        alert('Journey saved successfully!');
        onBack();
      } catch (err) {
        console.error(err);
        alert('Failed to save journey.');
      }
    }
  };

  if (!currentLocation) {
    return <div>Loading current location...</div>;
  }

  return (
    <div>
      <MapContainer center={currentLocation} zoom={17} scrollWheelZoom={true} style={{ height: '90vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={currentLocation} icon={sourceIcon} />

        {path.length > 0 && (
          <>
            <Polyline positions={path} color="blue" />
            <Marker position={path[0]} icon={sourceIcon} />
            <Marker position={path[path.length - 1]} icon={destinationIcon} />
          </>
        )}
      </MapContainer>

      <div className="footer-menu">
        {!tracking && <button className="btn btn-success m-2" onClick={startTracking}>Start</button>}
        {tracking && <button className="btn btn-danger m-2" onClick={stopTracking}>End</button>}
        <button className="btn btn-secondary m-2" onClick={onBack}>Close</button>
      </div>
    </div>
  );
};

export default NewJourney;
