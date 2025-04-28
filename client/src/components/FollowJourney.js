import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

const FollowJourney = ({ journey, option, onBack }) => {
  const [path, setPath] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [moving, setMoving] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const arrowIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [35, 35],
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCurrentLocation(userLoc);

      if (option === 'reach_source') {
        fetchPath(userLoc, journey.source, journey.path);
      } else if (option === 'shortest_path') {
        fetchPath(userLoc, journey.destination);
      }
    });
  }, [journey, option]);

  const fetchPath = async (start, end, savedPath = []) => {
    try {
      const response = await axios.post('http://localhost:5000/route', {
        source: start,
        destination: end,
      });

      const routeCoordinates = response.data.features[0].geometry.coordinates.map(coord => ({
        lat: coord[1],
        lng: coord[0],
      }));

      if (savedPath.length > 0) {
        setPath([...routeCoordinates, ...savedPath]);
      } else {
        setPath(routeCoordinates);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to get real road route.\nPlease check your internet or try again later.');
    }
  };

  const startJourney = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported!');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(userLoc);

        if (path.length > 0) {
          // Find nearest path point
          const nearestIndex = path.findIndex(p =>
            Math.abs(p.lat - userLoc.lat) < 0.0005 && Math.abs(p.lng - userLoc.lng) < 0.0005
          );

          if (nearestIndex !== -1 && nearestIndex >= path.length - 2) {
            alert('You came to your destination 😀');
            navigator.geolocation.clearWatch(id);
            setMoving(false);
            setWatchId(null);
          }
        }
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

    setMoving(true);
    setWatchId(id);
  };

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  if (!currentLocation) {
    return <div>Loading current location...</div>;
  }

  return (
    <div>
      <MapContainer center={currentLocation} zoom={15} scrollWheelZoom={true} style={{ height: '90vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {path.length > 0 && (
          <>
            <Polyline positions={path} color="blue" />
            <Marker position={currentLocation} icon={arrowIcon} />
          </>
        )}
      </MapContainer>

      <div className="footer-menu">
        {!moving && <button className="btn btn-success m-2" onClick={startJourney}>Start</button>}
        <button className="btn btn-secondary m-2" onClick={onBack}>Close</button>
      </div>
    </div>
  );
};

export default FollowJourney;
