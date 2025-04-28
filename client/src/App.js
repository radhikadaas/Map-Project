import React, { useState } from 'react';
import './App.css';
import NewJourney from './components/NewJourney';
import SavedJourneys from './components/SavedJourneys';
import mapImage from './mapimage.jpg'; // Background image
import profileImage from './image.jpg'; // Profile card image

function App() {
  const [page, setPage] = useState('home'); // 'home' | 'newJourney' | 'saved'

  const handleClose = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  };

  return (
    <div 
      className="App"
      style={{
        textAlign: 'center',
        minHeight: '100vh',
        backgroundImage: page === 'home' ? `url(${mapImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        paddingTop: '50px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {page === 'home' && (
          <div>
            <h1 className="app-heading">Smart Journey Saver</h1>
            <button className="btn btn-primary m-2" onClick={() => setPage('newJourney')}>
              New Journey
            </button>
            <button className="btn btn-success m-2" onClick={() => setPage('saved')}>
              Saved
            </button>
            <button className="btn btn-danger m-2" onClick={handleClose}>
              Close
            </button>
          </div>
        )}

        {page === 'newJourney' && <NewJourney onBack={() => setPage('home')} />}
        {page === 'saved' && <SavedJourneys onBack={() => setPage('home')} />}
      </div>

      {/* Footer Card - Only on Home Page */}
      {page === 'home' && (
        <footer className="footer-card">
          <div className="profile-card">
            <div className="profile-image">
              <img src={profileImage} alt="profile" />
            </div>
            <div className="profile-info">
              <h2><a href="https://www.linkedin.com/in/krishnadaas/" target="_blank" rel="noopener noreferrer">Keshav Sharma</a></h2>
              <p><a href="mailto:keshavsharmaaa678@gmail.com">Connect ❤️</a></p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
