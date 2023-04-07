import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SportsParticipants = () => {
  const [sportsParticipants, setSportsParticipants] = useState([]);
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://35.209.21.140:8000/sports_participants');
        setSportsParticipants(response.data.sports_participants);
        setFilteredParticipants(response.data.sports_participants);
      } catch (err) {
        setError(err);
      }
    };
    fetchData();
  }, []);

  const sports = [...new Set(sportsParticipants.map((participant) => participant.sport))];
  const countries = [...new Set(sportsParticipants.map((participant) => participant.country))];

  useEffect(() => {
    const filterParticipants = () => {
      let filtered = sportsParticipants.filter((participant) => {
        let sportMatch = !selectedSport || participant.sport === selectedSport;
        let countryMatch = !selectedCountry || participant.country === selectedCountry;
        return sportMatch && countryMatch;
      });
      setFilteredParticipants(filtered);
    };

    filterParticipants();
  }, [selectedSport, selectedCountry, sportsParticipants]);

  return (
    <div>
      <h1>Sports Participants</h1>
      <div>
        <label htmlFor="sport-filter">Sport:</label>
        <select
          id="sport-filter"
          value={selectedSport}
          onChange={(e) => {
            setSelectedSport(e.target.value);
          }}
        >
          <option value="">All</option>
          {sports.map((sport, index) => (
            <option key={index} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="country-filter">Country:</label>
        <select
          id="country-filter"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
          }}
        >
          <option value="">All</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <p>Error fetching data</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sport</th>
              <th>Country</th>
              <th>Athlete</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((participant, index) => (
              <tr key={index}>
                <td>{participant.sport}</td>
                <td>{participant.country}</td>
                <td>{participant.athlete}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SportsParticipants;
