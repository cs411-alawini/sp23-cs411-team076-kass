import React, { useState, useEffect } from 'react'
import axios from 'axios'

const StoredProceduredFilter = () => {
  const [sportsParticipants, setSportsParticipants] = useState([])
  const [filteredParticipants, setFilteredParticipants] = useState([])
  const [error, setError] = useState(null)
  const [selectedSport, setSelectedSport] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [loading, setLoading] = useState(true)
  const [sports, setSports] = useState([])
  const [countries, setCountries] = useState([])

  useEffect(() => {
    const fetchFilteredParticipants = async () => {
      setLoading(true)
      if (selectedSport !== '' && selectedCountry !== '') {
        try {
          const response = await axios.get(
            'http://35.209.21.140:8000/filtered_sports_participants',
            {
              params: {
                sport: selectedSport,
                country: selectedCountry
              }
            }
          )
          setFilteredParticipants(response.data.sports_participants)
        } catch (err) {
          setError(err)
        }
      } else {
        setFilteredParticipants([])
      }
      setLoading(false)
    }

    fetchFilteredParticipants()
  }, [selectedSport, selectedCountry])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          'http://35.209.21.140:8000/sports_and_countries'
        )
        setSports(response.data.sports)
        setCountries(response.data.countries)
      } catch (err) {
        setError(err)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1>Sports Participants</h1>
      <div>
        <label htmlFor='sport-filter'>Sport:</label>
        <select
          id='sport-filter'
          value={selectedSport}
          onChange={e => {
            setSelectedSport(e.target.value)
          }}
        >
          <option value=''>All</option>
          {sports.map((sport, index) => (
            <option key={index} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor='country-filter'>Country:</label>
        <select
          id='country-filter'
          value={selectedCountry}
          onChange={e => {
            setSelectedCountry(e.target.value)
          }}
        >
          <option value=''>All</option>
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
  )
}

export default StoredProceduredFilter;