import React, { useState } from 'react';
import axios from 'axios';

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
      const response = await axios.post('http://35.209.21.140:8000/add_athlete', athleteData);
      setMessage(response.data.success);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h1>Add Athlete</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" name="name" value={athleteData.name} onChange={handleChange} required />
        </label>
        <label>
          Country Name:
          <input type="text" name="country_name" value={athleteData.country_name} onChange={handleChange} required />
        </label>
        <label>
          Sport Name:
          <input type="text" name="sport_name" value={athleteData.sport_name} onChange={handleChange} required />
        </label>
        <label>
          Coach Name (optional):
          <input type="text" name="coach_name" value={athleteData.coach_name} onChange={handleChange} />
        </label>
        <button type="submit">Add Athlete</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddAthlete;
