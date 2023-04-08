import React, { useState } from 'react';
import axios from 'axios';
import './DeleteAthlete.css';

const DeleteAthlete = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://35.209.21.140:8000/search_athlete/${searchTerm}`);
      setSearchResults(response.data.search_results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //debug
  const handleDelete = async () => {
    console.log('handleDelete called');
    console.log('selectedAthleteId:', selectedAthleteId);
    if (selectedAthleteId && window.confirm('Are you sure ?')) {
      console.log('Attempting ID:', selectedAthleteId);
      try {
        const response = await axios.delete('http://35.209.21.140:8000/delete_athlete', {
          data: { id: selectedAthleteId },
        });
        console.log('Delete response:', response);
        alert(response.data.success);
        setSearchResults(searchResults.filter((result) => result.id !== selectedAthleteId));
      } catch (error) {
        console.error('Error deleting:', error);
      }
    } else {
      console.log('Athlete not selected or deletion not confirmed');
    }
  };
  

  return (
    <div>
      <h1>Delete Athlete</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter athlete's name"
      />
      <button onClick={handleSearch}>Search</button>
      {searchResults.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Select</th>
                <th>Athlete</th>
                <th>Sport</th>
                <th>Country</th>
                <th>Coach</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={index}>
                  <td>
                  {console.log('result.id:', result.id)}
                    <input
                      type="radio"
                      name="athlete"
                      value={result.id}
                      onChange={(e) => setSelectedAthleteId(parseInt(e.target.value, 10))}
                    />
                  </td>
                  <td>{result.athlete}</td>
                  <td>{result.sport}</td>
                  <td>{result.country}</td>
                  <td>
                    {result.coach && result.coach !== 'NO COACH NEEDED' ? result.coach : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleDelete}>Delete Athlete</button>
        </>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default DeleteAthlete;
