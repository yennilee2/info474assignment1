import * as d3 from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import gdp from './gdp.js'

const chartSize = 500;
var chartMarginL = 50;
var chartMarginB = 20;

const usa_percent_income = [];
var usa2000;
gdp.forEach((row) => {
    if (row.Entity == 'United States' && row.Year >= 2000) {
        if (row.Entity == 'United States' && row.Year == 2000) {
            usa2000 = parseInt(row['GDP per capita']);
        }
        usa_percent_income[row.Year] = parseInt(row['GDP per capita']) / usa2000 - 1;
    }
});
const china_percent_income = [];
var china2000;
gdp.forEach((row) => {
  if (row.Entity == 'China' && row.Year >= 2000) {
    if (row.Entity == 'China' && row.Year == 2000) {
      china2000 = parseInt(row['GDP per capita']);
    }
    china_percent_income[row.Year] = parseInt(row['GDP per capita']) / china2000 - 1;
  }
});

const years = scaleLinear()
    .domain([2000, 2018])
    .range([chartMarginB, chartSize - (4 * chartMarginB)]);

const _extent = extent(Object.values(china_percent_income));

const _scaleY = scaleLinear()
    .domain([0, (_extent[1] + .2) * 100])
    .range([chartSize - chartMarginL, chartMarginL]);

const USAPercentDec = () => {
    return (
        <div>
            <svg width={chartSize * 2}
                height={chartSize}
            >
                <text x={60} y={25} fontSize={20}>Percent Change from 2000's GDP Per Capita</text>
                <text x={205} y={50} fontSize={15} stroke={"blue"}>USA</text>
                <text x={240} y={50} fontSize={15}>vs</text>
                <text x={260} y={50} fontSize={15} stroke={"red"}>China</text>
                <AxisLeft strokeWidth={0} left={chartMarginL} top={-10} scale={_scaleY} />
                <AxisBottom
                    strokeWidth={0}
                    scale={years}
                    numTicks={10}
                    left={50}
                    top={430}
                    tickFormat={d3.format(".0f")}
                />
                {Object.values(usa_percent_income).map((num, i) => {
                    return (
                        <circle
                            cx={60 + ((500 - 60) / 19) * i}
                            cy={(370 - (num * 370 / 1.8)) + 70}
                            r={3}
                            fill={`rgb(0, 0, 255)`}
                        />
                    );
                })};
                {Object.values(china_percent_income).map((num, i) => {
                    return (
                        <circle
                            cx={60 + ((500 - 60) / 19) * i}
                            cy={(370 - (num * 370 / 1.8)) + 70}
                            r={3}
                            fill={`rgb(255, 0, 0)`}
                        />
                    );
                })};
                <text x="-350" y="8" fontSize={10} transform="rotate(-90)">
                    % Increase from 2000's GDP Per Capita
                </text>
                <text x="245" y="480" fontSize={10}>
                    Year
                </text>
                <foreignObject x={600} y={100} width={300} height={100}>
                    Figure 4. Comparison of GDP per capita change in the United States and China between 2000 to 2018.
                </foreignObject>

                <foreignObject x={600} y={200} width={300} height={300}>
                    This graph depicts the difference in GDP per capita using 2000 as the point of comparison for the USA 
                    and China. Interestingly, the graph shows that the maximum increase in average income per person is 
                    roughly 20% after 18 years, and China on the other hand, has seen more than a 180% increase in their
                    average income per person.
                </foreignObject>
            </svg>
        </div>
    );
};
  
export default USAPercentDec;