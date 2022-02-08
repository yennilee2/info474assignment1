import * as d3 from "d3";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";
import gdp from './gdp.js'

const chartSize = 500;
var chartMargin = 50;

// 2018 histogram
const income2018 = [];

gdp.forEach((row) => {
  if (row.Year == 2018) {
    income2018[row.Entity] = parseInt(row['GDP per capita']);
  }
});

var i2018buckets = [];
let u5000 = 0, u10000 = 0, u15000 = 0, u20000 = 0, u25000 = 0, u30000 = 0, 
u35000 = 0, u40000 = 0, u45000 = 0, u50000 = 0, u55000 = 0, u60000 = 0, u65000 = 0, m = 0;

Object.entries(income2018).forEach(([k, v]) => {
    if (v < 5000) {
        u5000 = u5000 + 1;
    } else if (v >= 5000 && v < 10000) {
        u10000 = u10000 + 1;
    } else if (v >= 10000 && v < 15000) {
        u15000 = u15000 + 1;
    } else if (v >= 15000 && v < 20000) {
        u20000 = u20000 + 1;
    } else if (v >= 20000 && v < 25000) {
        u25000 = u25000 + 1;
    } else if (v >= 250000 && v < 30000) {
        u30000 = u30000 + 1;
    } else if (v >= 30000 && v < 35000) {
        u35000 = u35000 + 1;
    } else if (v >= 35000 && v < 40000) {
        u40000 = u40000 + 1;
    } else if (v >= 40000 && v < 45000) {
        u45000 = u45000 + 1;
    } else if (v >= 45000 && v < 50000) {
        u50000 = u50000 + 1;
    } else if (v >= 50000 && v < 55000) {
        u55000 = u55000 + 1;
    } else if (v >= 55000 && v < 60000) {
        u60000 = u60000 + 1;
    } else if (v >= 60000 && v < 65000) {
        u65000 = u65000 + 1;
    } else {
        m = m + 1;
    }
});

i2018buckets['0 to 5k'] = u5000;
i2018buckets['5k to 10k'] = u10000;
i2018buckets['10k to 15k'] = u15000;
i2018buckets['15k to 20k'] = u20000;
i2018buckets['20k to 25k'] = u25000;
i2018buckets['25k to 30k'] = u30000;
i2018buckets['30k to 35k'] = u35000;
i2018buckets['35k to 40k'] = u40000;
i2018buckets['40k to 45k'] = u45000;
i2018buckets['45k to 50k'] = u50000;
i2018buckets['50k to 55k'] = u55000;
i2018buckets['55k to 60k'] = u60000;
i2018buckets['60k to 65k'] = u65000;
i2018buckets['More than 65k'] = m;

var buckets = Object.keys(i2018buckets);

const IncomeHist = () => {
    return (
        <div>
            <svg width={chartSize * 2}
                height={chartSize + 20}
            >
                <text x={100} y={25} fontSize={20}>GDP Per Capita vs Number of Countries</text>
                {buckets.map((b, i) => {
                    return (
                        <text x={400} y={-(450 / 14) * i - 50} transform="rotate(90)" fontSize={12}>
                            {b}
                        </text>
                    )
                })};
                {Object.values(i2018buckets).map((num, i) => {
                    return (
                        <line 
                            x1={i * (450 / 14) + 55} 
                            y1={(330 - (num * 300 / 45)) + chartMargin} 
                            x2={i * (450 / 14) + 55} 
                            y2={380}
                            stroke={"black"}
                        />
                    )
                })};
                {Object.values(i2018buckets).map((num, i) => {
                    return (
                        <text x={i * (450 / 14) + 49} y= {(320 - (num * 300 / 45)) + chartMargin}>
                            {num}
                        </text>
                    )
                })};
                <text x="219" y="490" fontSize={10}>
                    GDP Per Capita ($)
                </text>
                <foreignObject x={600} y={100} width={300} height={100}>
                    Figure 5. Number of countries and average GDP per capita in 2018.
                </foreignObject>

                <foreignObject x={600} y={200} width={300} height={300}>
                    This chart shows the distribution of average GDP per capita in the world in 2018. Of note is 
                    the significantly large number of countries that have an average income per person falling between 
                    $0 and $5,000, and 19 other countries having average GDP per capita over $65,000. The distribution is 
                    right-skewed.
                </foreignObject>
            </svg>
        </div>
    );
};

export default IncomeHist;