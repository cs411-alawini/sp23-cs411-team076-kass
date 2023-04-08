import React, { useState } from 'react';
import MedalTable from './MedalTable';
import SearchAthlete from './SearchAthlete';
import SportParticipant from './SportParticipant';
import SportsParticipants from './SportsParticipants';
import AddAthlete from './AddAthlete';
import DeleteAthlete from './DeleteAthlete';

function App() {
  const [activeComponent, setActiveComponent] = useState('medalTable');

  const handleComponentChange = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="App">
      <button onClick={() => handleComponentChange('medalTable')}>
        Show Medal Table
      </button>
      <button onClick={() => handleComponentChange('searchAthlete')}>
        Search Athlete
      </button>
      <button onClick={() => handleComponentChange('sportParticipant')}>
        Some other button
      </button>
      <button onClick={() => handleComponentChange('sportParticipants')}>
        Some other button 1
      </button>
      <button onClick={() => handleComponentChange('addAthlete')}>
        Add now
      </button>
      <button onClick={() => handleComponentChange('deleteAthlete')}>
        Delete now
      </button>

      {activeComponent === 'medalTable' && <MedalTable />}
      {activeComponent === 'searchAthlete' && <SearchAthlete />}
      {activeComponent === 'sportParticipant' && <SportParticipant />}
      {activeComponent === 'sportParticipants' && <SportsParticipants />}
      {activeComponent === 'addAthlete' && <AddAthlete />}
      {activeComponent === 'deleteAthlete' && <DeleteAthlete />}
    </div>
  );
}

export default App;
