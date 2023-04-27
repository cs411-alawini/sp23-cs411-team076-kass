import React from 'react';
import { Outlet, Route, Routes, BrowserRouter as Router } from 'react-router-dom';
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
import Login from './components/NavBar/Login';
import StoredVisual from './components/Medal/StoredVisual';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<LayoutsWithNavbar />}>
          <Route path="atheletes" element={<SearchAthlete />} />
          <Route path="medals" element={<MedalTable />} />
          <Route path="add" element={<AddAthlete />} />
          <Route path="delete" element={<DeleteAthlete />} />
          <Route path="update" element={<UpdateMedals />} />
          <Route path="filter" element={<SportsParticipants />} />
          <Route path="sp2" element={<Bobba />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="stored" element={<StoredProceduredFilter />} />
          <Route path="sv" element={<StoredVisual />} />
        </Route>
      </Routes>
    </Router>
  );
}

function LayoutsWithNavbar() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
