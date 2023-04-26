import React, { useState } from 'react';
import { Outlet, Route, Routes, BrowserRouter as Router } from "react-router-dom";
import MedalTable from './components/Medal/MedalTable';
import SearchAthlete from './components/Athelete/Search/SearchAthlete';
import NavBar from './components/NavBar/NavBar';
import SportsParticipants from './components/Medal/SportsParticipants';
import AddAthlete from './components/Athelete/Add/AddAthlete';
import DeleteAthlete from './components/Athelete/Delete/DeleteAthlete';
import UpdateMedals from './components/Medal/UpdateMedals';
import StoredProceduredFilter from './components/Medal/StoredProceduredFilter';
import Bobba from './components/Athelete/Visuals/BubbleChart';
import Schedule from './components/Medal/Schedule';

function App() {
  return (
    <Router>
      <Routes>
          {/* Routes that need the NavBar*/} 
          <Route path="/" element={<LayoutsWithNavbar/>}>
            <Route path="/atheletes" element={<SearchAthlete/>} />
            <Route path="/medals" element={<MedalTable/>} />
            <Route path="/add" element={<AddAthlete/>} />
            <Route path="/delete" element={<DeleteAthlete/>} />
            <Route path="/update" element={<UpdateMedals/>} />
            <Route path="/filter" element={<SportsParticipants/>} />
            <Route path="/sp2" element={<Bobba/>} />
            <Route path="/schedule" element={<Schedule/>} />
            <Route path="/stored" element={<StoredProceduredFilter/>} />
          </Route>
      </Routes>
    </Router>
  );
  // const [activeComponent, setActiveComponent] = useState('medalTable');

  // const handleComponentChange = (componentName) => {
  //   setActiveComponent(componentName);
  // };

  // return (
  //   <div className="App">
  //     <button onClick={() => handleComponentChange('medalTable')}>
  //       Show Medal Table
  //     </button>
  //     <button onClick={() => handleComponentChange('searchAthlete')}>
  //       Search Athlete
  //     </button>
  //     <button onClick={() => handleComponentChange('sportParticipants')}>
  //       Some other button 1
  //     </button>
  //     <button onClick={() => handleComponentChange('addAthlete')}>
  //       Add now
  //     </button>
  //     <button onClick={() => handleComponentChange('deleteAthlete')}>
  //       Delete now
  //     </button>
  //     <button onClick={() => handleComponentChange('updateMedals')}>
  //       Update now
  //     </button>

  //     {activeComponent === 'medalTable' && <MedalTable />}
  //     {activeComponent === 'searchAthlete' && <SearchAthlete />}
  //     {activeComponent === 'sportParticipants' && <SportsParticipants />}
  //     {activeComponent === 'addAthlete' && <AddAthlete />}
  //     {activeComponent === 'deleteAthlete' && <DeleteAthlete />}
  //     {activeComponent === 'updateMedals' && <UpdateMedals />}
  //   </div>
  // );
}

function LayoutsWithNavbar() {
  return (
    <>
      <NavBar/>
      <Outlet/>
    </>
  );
}

export default App;
