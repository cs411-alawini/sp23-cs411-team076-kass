import React, { useState } from 'react';
import MedalTable from './MedalTable';
import SearchAthlete from './SearchAthlete';
import SportsParticipants from './SportsParticipants';
import AddAthlete from './AddAthlete';
import DeleteAthlete from './DeleteAthlete';
import UpdateMedals from './UpdateMedals';

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
      <button onClick={() => handleComponentChange('sportParticipants')}>
        Some other button 1
      </button>
      <button onClick={() => handleComponentChange('addAthlete')}>
        Add now
      </button>
      <button onClick={() => handleComponentChange('deleteAthlete')}>
        Delete now
      </button>
      <button onClick={() => handleComponentChange('updateMedals')}>
        Update now
      </button>

      {activeComponent === 'medalTable' && <MedalTable />}
      {activeComponent === 'searchAthlete' && <SearchAthlete />}
      {activeComponent === 'sportParticipants' && <SportsParticipants />}
      {activeComponent === 'addAthlete' && <AddAthlete />}
      {activeComponent === 'deleteAthlete' && <DeleteAthlete />}
      {activeComponent === 'updateMedals' && <UpdateMedals />}
    </div>
  );
}

export default App;
