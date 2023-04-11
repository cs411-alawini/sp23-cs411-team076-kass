import React, { useState } from 'react';
import axios from 'axios';
import './AddAthlete.css'

const AddAthlete = () => {
  const [athleteData, setAthleteData] = useState({
    name: '',
    country_name: '',
    sport_name: '',
    coach_name: '',
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setAthleteData({ ...athleteData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...athleteData,
        coach_name: athleteData.coach_name || null,
      };
      const response = await axios.post('http://35.209.21.140:8000/add_athlete', data);
      setMessage(response.data.success);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div class = 'add-container'>
      <div class = 'add-header'>
      <h3>Add Athlete</h3>
      </div>
      <form onSubmit={handleSubmit} class = 'add-form'>
        <label>
          Name:
          <input class = 'add-input' type="text" name="name" value={athleteData.name} onChange={handleChange} required />
        </label>
        <br></br>
        <label>
          Country Name:
          <input class = 'add-input' type="text" name="country_name" value={athleteData.country_name} onChange={handleChange} required />
        </label>
        <br></br>
        <label>
          Sport Name:
          <input class = 'add-input' type="text" name="sport_name" value={athleteData.sport_name} onChange={handleChange} required />
        </label>
        <button type="submit">Add Athlete</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddAthlete;
