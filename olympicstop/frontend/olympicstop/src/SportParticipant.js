import React, { useState, useEffect } from 'react';

function SportParticipant() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('http://35.209.21.140:8000/sports_participants');
      const data = await response.json();
      setRanking(data.sports_participants);
    }
    fetchData();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Sport</th>
          <th>Country</th>
          <th>Athlete</th>
        </tr>
      </thead>
      <tbody>
        {ranking.map(rankingEntry => (
          <tr key={rankingEntry.sport}>
            <td>{rankingEntry.sport}</td>
            <td>{rankingEntry.country}</td>
            <td>{rankingEntry.athlete}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SportParticipant;
