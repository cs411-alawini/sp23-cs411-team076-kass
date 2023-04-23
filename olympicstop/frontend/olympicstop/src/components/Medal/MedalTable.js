import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts'
import './Medals.css'

function MedalTable () {
  const [ranking, setRanking] = useState([])
  const [lineChartData, setLineChartData] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData () {
      const responseRanking = await fetch('http://35.209.21.140:8000/ranking')
      const dataRanking = await responseRanking.json()
      setRanking(dataRanking.ranking)

      const responseLineChart = await fetch(
        'http://35.209.21.140:8000/ranking1'
      )
      const dataLineChart = await responseLineChart.json()
      setLineChartData(dataLineChart.ranking1)
    }
    fetchData()
  }, [])

  return (
    <div className='medal-container'>
      <div className='item-div'>
        <button className='update-button' onClick={() => navigate(`/update`)}>
          Update Medal Count
        </button>
      </div>
      <div className='item-div'>
        <table className='medal-table'>
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
      <div className='item-div'>
        <LineChart
          width={600}
          height={300}
          data={lineChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='country' />
          <YAxis domain={[0, 250]} />
          <Tooltip />
          <Legend />
          <Line
            type='monotone'
            dataKey='total'
            stroke='#8884d8'
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </div>
    </div>
  )
}
export default MedalTable
