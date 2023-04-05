import React, { useState } from 'react';
import MedalTable from './MedalTable';
import SearchAthlete from './SearchAthlete';

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

      {activeComponent === 'medalTable' && <MedalTable />}
      {activeComponent === 'searchAthlete' && <SearchAthlete />}
    </div>
  );
}

export default App;
