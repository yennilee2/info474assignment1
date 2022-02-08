import * as d3 from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { scaleLinear, scaleBand, extent, line, symbol, csv, format} from "d3";
import gdp from './gdp.js'

// change of USA
var chartSize = 500;
var chartMarginL = 50;
var chartMarginB = 20;
const usa_income_decade = [];
gdp.forEach((row) => {
    if (row.Entity == 'United States' && row.Year % 10 == 0 && row.Year >= 1800) {
        usa_income_decade[row.Year] = parseInt(row['GDP per capita']);
    }
});

const usaScale = scaleLinear()
    .domain([1800, 2010])
    .range([chartMarginB, chartSize - chartMarginB - chartMarginB]);

const _extent = extent(Object.values(usa_income_decade));

const _scaleY = scaleLinear()
    .domain([0, _extent[1] + 5000])
    .range([chartSize - chartMarginL, chartMarginL]);

const USADecade = () => {
    return (
      <div>
        <svg width={chartSize * 2}
            height={chartSize}
        >
            <text x={120} y={25} fontSize={20}>GDP Per Capita of US by Decade</text>
            <AxisLeft strokeWidth={0} left={chartMarginL + 7} top={-10} scale={_scaleY} />
            <AxisBottom
                strokeWidth={0}
                scale={usaScale}
                numTicks={10}
                left={40}
                top={430}
                tickFormat={d3.format(".0f")}
            />
            {Object.values(usa_income_decade).map((num, i) => {
                return (
                    <circle
                        cx={60 + ((500 - 60) / 21) * i}
                        cy={(370 - (num * 370 / 50000)) + 70}
                        r={2}
                    />
                );
            })}
            <text x="-280" y="8" fontSize={10} transform="rotate(-90)">
                GDP Per Capita ($)
            </text>
            <text x="245" y="475" fontSize={10}>
                Year
            </text>
            <foreignObject x={600} y={100} width={300} height={100}>
                Figure 3. GPD per capita change in the United States per decade starting in 1800.
            </foreignObject>

            <foreignObject x={600} y={200} width={300} height={300}>
                To answer the question of what GDP per capita growth looks like for the United States, 
                This graph shows that there is a steady increase in income from 1800 to 1940, and 1940 
                marks the beginning of a steep increase in income per person. In the span of roughly 60 years,
                GDP per capita is multiplied by almost four. 
            </foreignObject>
        </svg>
      </div>
    );
  };
  
  export default USADecade;