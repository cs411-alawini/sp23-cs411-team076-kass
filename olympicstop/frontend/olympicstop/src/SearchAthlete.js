import React, { useState } from 'react';
import axios from 'axios';

const SearchAthlete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/search_athlete/${searchTerm}`);
      setSearchResults(response.data.search_results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Search Athlete</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter athlete's name"
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Athlete</th>
              <th>Sport</th>
              <th>Country</th>
              <th>Coach</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.map((result, index) => (
              <tr key={index}>
                <td>{result.athlete}</td>
                <td>{result.sport}</td>
                <td>{result.country}</td>
                <td>{result.coach ? result.coach : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchAthlete;
