import React, { useState } from 'react';
import axios from 'axios';
import './SearchAthlete.css';
import { useNavigate } from 'react-router-dom';

const SearchAthlete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://35.209.21.140:8000/search_athlete/${searchTerm}`);
      setSearchResults(response.data.search_results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
    <div class ='search-container'>
      <div class = 'search-bar'>
        <div class = 'search-input'>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter athlete's name"
            class = 'input-box'
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <button onClick={() => navigate(`/add`)}>Add</button>
        <button onClick={() => navigate(`/delete`)}>Delete</button>
        <button onClick={() => navigate(`/filter`)}>Filter</button>
      </div>
      {searchResults.length > 0 ? (
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
                <td>
      {result.coach && result.coach !== "NO COACH NEEDED"
        ? result.coach
        : "N/A"}
    </td>
              </tr>
            ))}
          </tbody>
        </table> ) : ( <p>No results found</p>
      )}
    </div>
    </>
  );
};

export default SearchAthlete;
