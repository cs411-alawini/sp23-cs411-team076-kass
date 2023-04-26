import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Schedule = () => {
  const [schedule, setSchedule] = useState([])
  const [filteredSchedule, setFilteredSchedule] = useState([])
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://35.209.21.140:8000/schedule')
        setSchedule(response.data.schedule_stats)
        setFilteredSchedule(response.data.schedule_stats)
      } catch (err) {
        setError(err)
      }
    }
    fetchData()
  }, [])

  const categories = [...new Set(schedule.map(event => event.category))]

  useEffect(() => {
    const filterSchedule = () => {
      let filtered = schedule.filter(event => {
        let categoryMatch =
          !selectedCategory || event.category === selectedCategory
        return categoryMatch
      })
      setFilteredSchedule(filtered)
    }

    filterSchedule()
  }, [selectedCategory, schedule])

  return (
    <div>
      <h1>Schedule</h1>
      <div>
        <label htmlFor='category-filter'>Category:</label>
        <select
          id='category-filter'
          value={selectedCategory}
          onChange={e => {
            setSelectedCategory(e.target.value)
          }}
        >
          <option value=''>All</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
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
              <th>Date</th>
              <th>Game</th>
              <th>Category</th>
              <th>Event</th>
              <th>Team</th>
              <th>Ticket Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedule.map((event, index) => (
              <tr key={index}>
                <td>{event.eventdate}</td>
                <td>{event.game}</td>
                <td>{event.category}</td>
                <td>{event.event}</td>
                <td>{event.team}</td>
                <td>{event.ticket_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Schedule
