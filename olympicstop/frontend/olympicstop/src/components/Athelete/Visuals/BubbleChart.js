import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import './BubbleChart.css'

const BubbleChart = ({ apiEndpoint }) => {
  const chartRef = useRef()

  const fetchData = () => {
    fetch(apiEndpoint)
      .then(response => response.json())
      .then(data => {
        const chartData = data.athletes_per_sport || data.athletes_per_country
        drawBubbleChart(chartData)
      })
  }

  const drawBubbleChart = data => {
    const width = 600
    const height = 600
    const margin = { top: 20, right: 20, bottom: 20, left: 20 }

    const svg = d3
      .select(chartRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    const pack = d3.pack().size([width, height]).padding(1.5)

    const root = d3
      .hierarchy({ children: data })
      .sum(d => d.athlete_count)
      .sort((a, b) => b.value - a.value)

    const nodes = pack(root).leaves()

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    svg
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', d => d.r)
      .style('fill', (d, i) => colorScale(i))
      .on('mouseover', (event, d) => {
        tooltip
          .style('opacity', 1)
          .html(
            `Sport/Country: ${d.data.sport || d.data.country}<br/>
             Athlete Count: ${d.data.athlete_count}`
          )
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })
      .on('mousemove', event => {
        tooltip
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0)
      })

    svg
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .style('font-size', d => Math.max(1, d.r / 7))
      .style('fill', 'black')
      .text(d => d.data.sport || d.data.country)
  }

  return (
    <>
      <button onClick={fetchData}>Load Data</button>
      <svg ref={chartRef}></svg>
    </>
  )
}

const Bobba = () => {
  return (
    <div className="chart-container">
      <BubbleChart apiEndpoint="http://35.209.21.140:8000/total_athletes_per_country" />
      <BubbleChart apiEndpoint="http://35.209.21.140:8000/total_athletes_per_sport" />
    </div>
  )
}

export default Bobba;
