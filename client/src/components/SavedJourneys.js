import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StartOptionsPopup from './StartOptionsPopup';
import FollowJourney from './FollowJourney';

const SavedJourneys = ({ onBack }) => {
  const [journeys, setJourneys] = useState([]);
  const [selectedJourney, setSelectedJourney] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [startOption, setStartOption] = useState(null);

  useEffect(() => {
    async function fetchJourneys() {
      try {
        const response = await axios.get('http://localhost:5000/journeys');
        setJourneys(response.data);
      } catch (err) {
        console.error('Failed to load journeys', err);
      }
    }
    fetchJourneys();
  }, []);

  const handleJourneyClick = (journey) => {
    setSelectedJourney(journey);
    setShowPopup(true);
  };

  const handleOptionSelect = (option) => {
    setStartOption(option);
    setShowPopup(false);
  };

  if (startOption && selectedJourney) {
    return (
      <FollowJourney
        journey={selectedJourney}
        option={startOption}
        onBack={() => {
          setStartOption(null);
          setSelectedJourney(null);
        }}
      />
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Saved Journeys</h2>
      <button className="btn btn-secondary mb-3" onClick={onBack}>Back</button>
      {journeys.length === 0 ? (
        <p>No journeys found!</p>
      ) : (
        <ul className="list-group">
          {journeys.map((journey) => (
            <li key={journey.id} className="list-group-item d-flex justify-content-between align-items-center">
              {journey.name}
              <button className="btn btn-primary" onClick={() => handleJourneyClick(journey)}>
                Open
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedJourney && (
        <StartOptionsPopup
          show={showPopup}
          onClose={() => setShowPopup(false)}
          onOptionSelect={handleOptionSelect}
        />
      )}
    </div>
  );
};

export default SavedJourneys;
