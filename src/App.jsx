import { useState } from 'react'
import logo from './logo.svg'
import { AxisLeft, AxisBottom } from "@visx/axis";
import './App.css'
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import census from './census'


function App() {
  const chartSize = 500;
  const margin = 30;
  
  // create objects for just female and male
  const dataM20People = {};
  const dataF20People = {};

  census.forEach((row) => {
    if ((row.Year == 2000) && (row.Sex == 1))  {
      dataM20People[row.Age] = row.People;
    } else if ((row.Year == 2000) && (row.Sex == 2)) {
      dataF20People[row.Age] = row.People;
    }
      
  });

  const ages = Object.keys(dataF20People);

  
  const _extent = extent(Object.values(dataF20People));
  const _scaleY = scaleLinear()
    .domain([0, _extent[1]/1000000 + 1])
    .range([chartSize - margin, margin+ 50]);
  const _scaleX = scaleBand()
    .domain(ages)
    .range([0, chartSize - margin - margin]);
  

  return (
    <div className="App">
      <h1>
        What is the Gender Distribution Across Age Groups in the US?
      </h1>
      <h3>
        2000 Census Data
      </h3>
      <svg width={chartSize}
          height={chartSize}
      >
        <AxisLeft strokeWidth={0} left={margin + 10} top={-50} scale={_scaleY} />
        <AxisBottom
          strokeWidth={0}
          top={chartSize - margin - 50}
          left={margin + 10}
          scale={_scaleX}
          tickValues={ages}
        />
        
        {Object.values(dataF20People).map((num, i) => {
          return (
            <line
              x1={49 + i * 23}
              y1={420}
              x2={49 + i * 23}
              y2={50 + (370 - (num / 1000000) * 370 / 12)}
              stroke={"red"}
            />
          );
        })}
        {Object.values(dataM20People).map((num, i) => {
          return (
            <line
              x1={55 + i * 23}
              y1={420}
              x2={55 + i * 23}
              y2={50 + (370 - (num / 1000000) * 370 / 12)}
              stroke={"blue"}
            />
          );
        })}

        <rect
          x={410}
          y={50}
          width={15}
          height={3}
          fill={"red"}
        />
        <rect
          x={410}
          y={70}
          width={15}
          height={3}
          fill={"blue"}
        />

        <text x="430" y="55" fontSize={10}>
          Female
        </text>
        <text x="430" y="75" fontSize={10}>
          Male
        </text>

        <text x="245" y="460" fontSize={10}>
          Age Groups
        </text>
        <text x="200" y="475" fontSize={10}>
          (binned into 5 year segments)
        </text>
        <text x="-300" y="7" fontSize={10} transform="rotate(-90)">
          Population (millions)
        </text>
      </svg>

      <p>
        I chose to model this visualization through a side-by-side bar chart because I wanted put 
        emphasis on comparing gender populations within individual age groups. I considered creating 
        a line graph to represent the differences, but I did not want imply that there were 
        connections between age groups, or that show that populations of a specific age in between 
        the increments could be found on the lines as the number of people are actually represented 
        categorically in bins. Since there are three different variables in this visualization, number 
        of people, gender, and age group, I made sure to match the dimensions of the graph to that in 
        the x-axis, y-axis, and through color/position.
      </p>
      <p>
        By omitting gridlines, ticks, and axes, I maximized the data-ink ratio and lessened chartjunk 
        that could distract my viewers from the actual data. I also made sure to label my axes and 
        legend with a small/equal font size that would not take away from the data.
      </p>
      <p>
        I chose red and blue as the colors to represent gender because they contrast each other 
        nicely and are vibrant for those who are vision-impaired. Rather than going with dotted 
        lines or shapes, color and position (female on left, male on right) can help a viewer quickly 
        identify key differences between the data at first glance.
      </p>
      <p>
        These decisions are important in effective communication of data because visualizations do not 
        utilize words to convey information. Instead, we rely on visual elements to draw distinctions 
        and explain what viewers should know based on the data. Because of that, we need to ensure that 
        visual elements well-thought-out and intentional, otherwise the information may be misinterpreted.
      </p>
    </div>
  )
}

export default App
