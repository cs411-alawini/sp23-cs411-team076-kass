import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Medals.css'

function MedalTable() {
  const [ranking, setRanking] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://35.209.21.140:8000/ranking');
      const data = await response.json();
      setRanking(data.ranking);
    }
    fetchData();
  }, []);

  return (
    <div class = 'medal-container'>
      <div class = 'item-div'>
      <button class = 'update-button' onClick={() => navigate(`/update`)}>Update Medal Count</button>
      </div>
      <div class = 'item-div'>
      <table class = 'medal-table'>
        <thead>
          <tr>
            <th>Country</th>
            <th>Gold</th>
            <th>Silver</th>
            <th>Bronze</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map(rankingEntry => (
            <tr key={rankingEntry.country}>
              <td>{rankingEntry.country}</td>
              <td>{rankingEntry.gold}</td>
              <td>{rankingEntry.silver}</td>
              <td>{rankingEntry.bronze}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default MedalTable;
