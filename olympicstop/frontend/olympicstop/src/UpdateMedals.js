import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateMedals = () => {
  const [medalStats, setMedalStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [gold, setGold] = useState('');
  const [silver, setSilver] = useState('');
  const [bronze, setBronze] = useState('');

  useEffect(() => {
    const fetchMedalStats = async () => {
      try {
        const response = await axios.get('http://35.209.21.140:8000/medalstats');
        setMedalStats(response.data.medal_stats);
      } catch (error) {
        console.error('Error fetching medal stats:', error);
      }
    };

    fetchMedalStats();
  }, []);

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setGold(country.gold);
    setSilver(country.silver);
    setBronze(country.bronze);
  };

  const handleUpdate = async () => {
    if (selectedCountry && window.confirm('Are you sure you want to update the medal count?')) {
      try {
        const response = await axios.post('http://35.209.21.140:8000/update_medals', {
          country: selectedCountry.country,
          gold,
          silver,
          bronze,
        });

        alert(response.data.success);
      } catch (error) {
        console.error('Error updating medals:', error);
      }
    }
  };

  const filteredCountries = medalStats.filter((c) =>
    c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>Update Medal Count</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a country"
      />
      <ul>
        {filteredCountries.map((country, index) => (
          <li key={index}>
            <input
              type="radio"
              name="country"
              checked={selectedCountry && selectedCountry.country === country.country}
              onChange={() => handleSelectCountry(country)}
            />
            {country.country}
          </li>
        ))}
      </ul>
      {selectedCountry && (
        <div>
          <input type="text" value={selectedCountry.country} readOnly />
          <input type="number" value={gold} onChange={(e) => setGold(parseInt(e.target.value))} />
          <input type="number" value={silver} onChange={(e) => setSilver(parseInt(e.target.value))} />
          <input type="number" value={bronze} onChange={(e) => setBronze(parseInt(e.target.value))} />
          <button onClick={handleUpdate}>Update Medals</button>
        </div>
      )}
    </div>
  );
};

export default UpdateMedals;