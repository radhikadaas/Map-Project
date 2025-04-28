import React, { useState } from 'react';
import './App.css';
import NewJourney from './components/NewJourney';
import SavedJourneys from './components/SavedJourneys';

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
    <div className="App" style={{ textAlign: 'center', paddingTop: '50px' }}>
      {page === 'home' && (
        <div>
          <h1>Smart Journey Saver</h1>
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
  );
}

export default App;
