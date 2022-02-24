import { useState } from 'react'
import logo from './logo.svg'
import { AxisLeft, AxisBottom } from "@visx/axis";
import './App.css'
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import census from './census'
import gdp from './gdp.js'
import GDPMap from "./gdp2018map";
import GDPMap1950 from './gdp1950map';
import USADecade from './graph1';
import USAPercentDec from './graph2';
import IncomeHist from './graph3';
import Interactive from './interactive';


function App() {
  // ASSIGNMENT 1 CONTENT
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
  
  // ASSIGNMENT 2 CONTENT

  const income2018 = [];

  gdp.forEach((row) => {
    if (row.Year == 2018) {
      income2018[row.Entity] = parseInt(row['GDP per capita']);
    }
  });

  const top10values = (obj, num = 10) => {
    const topvalues = {};
    Object.keys(obj).sort((a, b) => obj[b] - obj[a]).forEach((key, ind) => {
      if (ind < num) {
        topvalues[key] = obj[key];
      }
    });
    return topvalues;
  };
  
  const top10 = (top10values(income2018));

  return (
    <div className="App">
      {/* ASSIGNMENT 3 */}
      <h1>Assignment 3</h1>
      <Interactive />

      {/* ASSIGNMENT 2 */}
      <h1>Assignment 2</h1>
      <GDPMap />
      <GDPMap1950 />
      <USADecade />
      <USAPercentDec />
      <IncomeHist />
      <div id="in-line">
        <div>
          <h4>Top 10 Countries with Highest GDP Per Capita</h4>
          <table class="table">
            <thead>
              <tr>
                <th>Country</th>
                <th>GDP</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(top10).map(([k,v]) => {
                return (
                  <tr>
                    <td>
                      {k}
                    </td>
                    <td>
                      {v}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div class="f6">
          <p>Figure 6. Table of Countries with the highest GDP per capita in 2018.</p>
          <p>This table shows the highest amounts of average GDP per capita, with Qatar at a significantly 
            higher amount. The 10th highest GDP per capita in the world is in Hong Kong, at $50,839.
          </p>
        </div>
      </div>
      <div class="response">
        <p>
          Questions:
        </p>
        <ol>
          <li>How does the US’s gdp/gdp growth compare to other countries?</li>
          <li>Are there specific areas of the world that are more susceptible to lower gdps? 
            Which countries suffer most from lack of gdp growth and what factors influence that?</li>
          <li>Which countries’ gdp have grown most significantly?</li>
        </ol>
        <p>
          Analysis process:
        </p>
        <p>
          I wanted to explore the data with an intention of finding inequality or extreme differences in GDP per country.
          Although there is a lot more to dig in to, I chose to answer my questions using choropleth maps, dot plots, and 
          bar charts that highlights the differents in the distribution. Using data from ilostat, I transformed the csv to 
          a js file and created objects and arrays that filtered for the specific data I would need to plot these visualizations.
        </p>
        <p>
          From this assignment, I learned that time and location have some sort of an effect on GDP per capita. In order
          to confidently say that there is correlation, I would have to do a lot more analysis and create more charts. Visually, 
          there are many ways to have communicated this finding, but there are specific types of charts, for example, a 
          choropleth map to show a location variable, that aids in this process. 
        </p>
      </div>



      {/* ASSIGNMENT 1 */}
      <h1>
        Assignment 1
      </h1>
      <h2>
        What is the Gender Distribution Across Age Groups in the US?
      </h2>
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
