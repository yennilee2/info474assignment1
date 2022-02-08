import * as topojson from "topojson-client";
import worldTopo from "./world-topo";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { scaleLinear } from '@visx/scale';

import gdp from './gdp.js'

const _worldTopo = topojson.feature(worldTopo, worldTopo.objects.units);
const countryShapes = _worldTopo.features;

var income1950 = [];
gdp.forEach((row) => {
    if (row.Year == 1950) {
        income1950[row.Entity] = parseInt(row['GDP per capita']);
    }
});

const color = scaleLinear({
    domain: [
        0,50000
    ],
    range: ["#ffedea", "#ff5233"],
  });

const GDPMap1950 = ({ width = 960, height = 500 }) => {
    const projection = geoNaturalEarth1()
      .center([0, 5])
      .scale(150)
      .rotate([0, 0]);
    const path = geoPath().projection(projection);
  
    return (
      <div>
        <svg width={width + 500} height={height}>
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
                    const d = income1950[row.properties.name];
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
                Figure 2. GPD per capita in 1950.
            </foreignObject>

            <foreignObject x={width} y={200} width={300} height={300}>
                This choropleth map highlights the differences in GDP per capita in different countries in 1950. Compared to
                Figure 1, the maximum average GDP per capita is significantly lower than in 2018. Australia, Canada, USA, and 
                Saudi Arabia are amongst several other countries who have had a drastic increase in their average income per
                person.
            </foreignObject>
        </svg>
      </div>
    );
  };
  
  export default GDPMap1950;