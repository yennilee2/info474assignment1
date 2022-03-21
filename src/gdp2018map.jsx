import * as topojson from "topojson-client";
import worldTopo from "./world-topo";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { scaleLinear } from '@visx/scale';

import gdp from './gdp.js'

const _worldTopo = topojson.feature(worldTopo, worldTopo.objects.units);
const countryShapes = _worldTopo.features;

var income2018 = [];
gdp.forEach((row) => {
    if (row.Year == 2018) {
        income2018[row.Entity] = parseInt(row['GDP per capita']);
    }
});

const color = scaleLinear({
    domain: [
        0,50000
    ],
    range: ["#ffedea", "#ff5233"],
});


const GDPMap = ({ width = 960, height = 500 }) => {
    const projection = geoNaturalEarth1()
      .center([0, 5])
      .scale(150)
      .rotate([0, 0]);
    const path = geoPath().projection(projection);
  
    return (
      <div>
        <svg width={width + 500} height={height}>
            <circle cx={100} cy={10} r={5} fill="black"/>
            <g>
                {countryShapes.map((shape, i) => {
                    return (
                        <path
                            key={i}
                            d={path(shape)}
                            fill="lightgray"
                            stroke="white"
                            strokeWidth={0.3}
                        />
                    );
                })};
            </g>
            <g>
                {countryShapes.map((row) => {
                    const d = income2018[row.properties.name];
                    return (
                        <path 
                            d={path(row)}
                            fill={color(d)}
                            stroke="white"
                            strokeWidth={0.3}
                        />
                    );
                })};
            </g>
            <foreignObject x={width} y={100} width={300} height={100}>
                Figure 1. GPD per capita in 2018.
            </foreignObject>

            <foreignObject x={width} y={200} width={300} height={300}>
                To answer the question of what GDP per capita looks like on a map, this choropleth map shows the
                differences in GDP per capita in 2018. Key information is that North American, European, and Oceanic
                countries seem to have the highest income per person based on the data. Additionally, Saudi Arabia 
                and Japan have a relatively high average income per person as well.
            </foreignObject>
        </svg>
      </div>
    );
  };
  
  export default GDPMap;