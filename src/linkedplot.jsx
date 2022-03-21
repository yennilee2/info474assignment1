import * as d3 from "d3";
import Select from 'react-select';
import { AxisLeft, AxisBottom } from "@visx/axis";
import * as topojson from "topojson-client";
import worldTopo from "./world-topo";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { scaleLinear } from '@visx/scale';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

// datasets
import gdp from './gdp.js';
import pop from './population.js';
import realGDP from './realGDP.js';
import top1 from './top1percent.js';
import popG from './popgrowth.js';
import pov from './poverty.js';

import { useState } from "react";


const _worldTopo = topojson.feature(worldTopo, worldTopo.objects.units);
const countryShapes = _worldTopo.features;


// restructuring gdp dataset
var gdpData = [];

const countries = new Set;
gdp.forEach((row) => {
    countries.add(row.Entity);
});

countries.forEach((row) => {
    var objCountry = {};
    objCountry['Country'] = row;
    gdpData.push(objCountry);
});

gdp.forEach((row) => {
    gdpData.forEach((c, i) => {
        if ((row.Entity == gdpData[i].Country) && (row.Year >= 1900)) {
            c[row.Year] = parseInt(row["GDP per capita"]);
        };
    });
});

// restructuring realGDP dataset
var rGDPData = [];

const rCountries = new Set;
realGDP.forEach((row) => {
    rCountries.add(row.Entity);
});

rCountries.forEach((row) => {
    var objRCountry = {};
    objRCountry['Country'] = row;
    rGDPData.push(objRCountry);
});

realGDP.forEach((row) => {
    rGDPData.forEach((c, i) => {
        if ((row.Entity == rGDPData[i].Country) && (row.Year >= 1900)) {
            c[row.Year] = parseInt(row["GDP"]);
        };
    });
});

// restructuring pop dataset
var popData = [];

const pCountries = new Set;
pop.forEach((row) => {
    pCountries.add(row.Entity);
});

pCountries.forEach((row) => {
    var objPCountry = {};
    objPCountry['Country'] = row;
    popData.push(objPCountry);
});

pop.forEach((row) => {
    popData.forEach((c, i) => {
        if ((row.Entity == popData[i].Country) && (row.Year >= 1900) && (row.Year <= 2020)) {
            c[row.Year] = parseInt(row["Population (thousands)"]);
        };
    });
});

// restructuring top1percent dataset
var top1Data = [];

const top1Countries = new Set;
top1.forEach((row) => {
    top1Countries.add(row.Entity);
});

top1Countries.forEach((row) => {
    var objTop1Country = {};
    objTop1Country['Country'] = row;
    top1Data.push(objTop1Country);
});

top1.forEach((row) => {
    top1Data.forEach((c, i) => {
        if ((row.Entity == top1Data[i].Country) && (row.Year >= 1950) && (row.Year <= 2020)) {
            c[row.Year] = parseInt(row["Top 1%"]);
        };
    });
});

// restructuring poverty dataset
var povData = [];

const povCountries = new Set;
pov.forEach((row) => {
    povCountries.add(row.Entity);
});

povCountries.forEach((row) => {
    var objPovCountry = {};
    objPovCountry['Country'] = row;
    povData.push(objPovCountry);
});

pov.forEach((row) => {
    povData.forEach((c, i) => {
        if ((row.Entity == povData[i].Country) && (row.Year >= 1950) && (row.Year <= 2020)) {
            c[row.Year] = parseInt(row["Percent"]);
        };
    });
});

// m chart and axis
var chartSize = 300;
var chartMarginL = 20;
var chartMarginB = 20;

const yearScale = scaleLinear()
    .domain([1950, 2020])
    .range([chartMarginB, chartSize - chartMarginB - chartMarginB]);

const _scaleY = scaleLinear()
    .domain([0, 30])
    .range([chartSize - chartMarginL, chartMarginL]);

const _scaleYpop = scaleLinear()
    .domain([-5, 5])
    .range([chartSize - chartMarginL, chartMarginL + 10]);

const _scaleYpov = scaleLinear()
    .domain([0, 100])
    .range([chartSize - chartMarginL - 10, chartMarginL]);

// creating array of options for multi select
const options = [];
countries.forEach((c) => {
    var cOption = {};
    cOption['value'] = c;
    cOption['label'] = c;
    options.push(cOption);
})

// country fill and strokeWidth colors
var countryColor = {"United States": Math.floor(Math.random()*16777215).toString(16)}
countries.forEach((c) => {
    countryColor[c] = Math.floor(Math.random()*16777215).toString(16);
});

const LinkedPlot = () => {
    const [selectC, setSelectC] = useState(
        ["United States"],
    );

    // slider for year
    const [selectYear, setYear] = useState(2000);

    var incomeYear = [];
    gdp.forEach((row) => {
        if (row.Year == selectYear) {
            incomeYear[row.Entity] = parseInt(row['GDP per capita']);
        }
    });

    const colorScale = scaleLinear({
        domain: [
            d3.min(Object.values(incomeYear)), d3.max(Object.values(incomeYear))
        ],
        range: ["#EDF3F4", "#456D71"],
    });

    // map content
    const projection = geoNaturalEarth1()
      .center([60, 0])
      .scale(150)
      .rotate([0, 0]);
    const path = geoPath().projection(projection);

    // graphing gdp v population, population -> [0] realGDP -> [1]
    var selectedData = {}
    selectC.forEach((c) => {
        let temp = []
        popData.forEach((row) => {
            if (c == row.Country) {
                temp.push(row[selectYear]);
            };
        });
        rGDPData.forEach((row) => {
            if (c == row.Country) {
                temp.push(row[selectYear]);
            };
        });
        selectedData[c] = temp;
    });

    // adding US so that selectedData is not empty
    selectedData["United States"] = [(popData[231][selectYear]), (rGDPData[167][selectYear])];

    return (
        <div>
            <h2>Understanding GDP Per Capita</h2>
            <p className="intro">
                At first glance, GDP per capita seems straightforward. However, there are many factors that influence and play into its
                calculation, understanding, and short and long-term consequences that are vital for our leaders to grasp. Below are some
                of these factors to explore.
            </p>
            <div className="row">
                <div className="col-1">
                    <svg width={800} height={500}>
                        <g>
                            {countryShapes.map((row) => {
                                const d = incomeYear[row.properties.name];
                                return (
                                    <>
                                        <path
                                            d={path(row)}
                                            fill={colorScale(d)}
                                            stroke={selectC.indexOf(row.properties.name) > -1 || (row.properties.name == "United States") ? "#"+countryColor[row.properties.name] : "white"}
                                            strokeWidth={selectC.indexOf(row.properties.name) > -1 || (row.properties.name == "United States") ? 1.5 : 0.3}
                                        />
                                    </>
                                );
                            })};
                        </g>
                        <>
                            <text x={0} y={300} fontSize={12}>GDP Per Capita</text>
                            <text x={25} y={320} fontSize={10}>${d3.max(Object.values(incomeYear))}</text>
                            <text x={25} y={340} fontSize={10}>${d3.min(Object.values(incomeYear))}</text>
                            <text x={25} y={360} fontSize={10}>No data</text>
                            <rect x={15} y={313} width={7} height={7} fill="#456D71"/>
                            <rect x={15} y={333} width={7} height={7} fill="#EDF3F4"/>
                            <rect x={15} y={353} width={7} height={7} fill="black"/>
                        </>
                    </svg>
                    <div className="slider">
                        <div className="slider-title">
                            <text>Select Year:</text>
                        </div>
                        <div className="range-slider">
                            <RangeSlider
                                value={selectYear}
                                onChange={changeEvent => {
                                    setYear(changeEvent.target.value);
                                }}
                                min={1950}
                                max={2018}
                                tooltipPlacement="top"
                                tooltip="on"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-2">
                    <div className="select-2">
                        <Select
                            isMulti={true}
                            value={selectC.value}
                            onChange={(handleC) => {
                                let temp = handleC.map((c) => {
                                    return c.value;
                                });
                                setSelectC(temp);
                            }}
                            options={options}
                            placeholder={"Select Countries"}
                        />
                    </div>
                    <div className="gdps">
                        {selectC.map((c) => {
                            return (
                                <>
                                    <svg width={10} height={10}>
                                        <rect width={10} height={10} fill={"#" + countryColor[c]}/>
                                    </svg>
                                    <text>{" " + c + ": $" + incomeYear[c]}</text><br></br>
                                </>
                            )
                        })}
                    </div>
                    {/* population v real gdp */}
                    <div className="svg-sm">
                        <svg width={300} height={300}>
                            <text x={50} y={10} fontSize={13}>How is GDP Per Capita Calculated?</text>
                            <text x={13} y={287} fontSize={7}>0</text>
                            <text x={265} y={288} fontSize={7}>1.5 billion</text>
                            <line x1={20} y1={280} x2={290} y2={280} stroke="black"/>
                            <text x={3} y={22} fontSize={7}>19.5 trillion</text>
                            <line x1={20} y1={280} x2={20} y2={25} stroke="black"/>
                            {Object.entries(selectedData).map(([key, value]) => {
                                return (
                                    <circle
                                        cx={value[0] / 1500000000 * 270 + 20}
                                        cy={255 - (value[1] / 19500000000000 * 255) + 25}
                                        r={5}
                                        fill={"#"+countryColor[key]}
                                    />
                                )
                            })}
                            <text x={140} y={298} fontSize={10}>Population</text>
                            <text x={-175} y={12} fontSize={10} transform="rotate(-90)">Real GDP ($)</text>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="row-2">
                <div className="svg-m">
                    <svg width={chartSize} height={chartSize}>
                        <text x={35} y={10} fontSize={13}>What Share of GDP Does the Top 1% Get?</text>
                        <AxisLeft strokeWidth={0} left={chartMarginL + 17} top={0} scale={_scaleY} />
                        <AxisBottom
                            strokeWidth={0}
                            scale={yearScale}
                            numTicks={8}
                            left={20}
                            top={265}
                            tickFormat={d3.format(".0f")}
                        />
                        {selectC.map((c) => {
                            return (
                                top1Data.map((row) => {
                                    if ((c == row.Country) || (row.Country == "United States")) {
                                        return (
                                            Object.entries(row).map(([key, value]) => {
                                                if (key != "Country") {
                                                    return (
                                                        <circle
                                                            cx={(key - 1950) * (255 / 70) + 37}
                                                            cy={270 - (value * 270 / 31)}
                                                            r={2}
                                                            fill={(key == selectYear) ? "#f18" : "#"+countryColor[row["Country"]]}
                                                        />
                                                    )
                                                }
                                            })
                                        )
                                    }
                                })
                            )
                        })};
                        <text x={148} y={298} fontSize={10}>Year</text>
                        <text x={-165} y={12} fontSize={10} transform="rotate(-90)">Share (%)</text>
                    </svg>
                </div>
                <div className="svg-m">
                    <svg width={300} height={300}>
                    <text x={65} y={10} fontSize={13}>How Has Population Changed?</text>
                        <AxisLeft strokeWidth={0} left={chartMarginL + 17} top={-2} scale={_scaleYpop} />
                        <AxisBottom
                            strokeWidth={0}
                            scale={yearScale}
                            numTicks={8}
                            left={20}
                            top={265}
                            tickFormat={d3.format(".0f")}
                        />
                        {selectC.map((c) => {
                            return (
                                popG.map((row) => {
                                    if ((c == row["Country Name"]) || (row["Country Name"] == "United States")) {
                                        return (
                                            Object.entries(row).map(([key, value]) => {
                                                console.log(key, value)
                                                if (key != "Country Name" || key != "Indicator Name" || key != "Country Code" || key != "Indicator Code") {
                                                    return (
                                                        <circle
                                                            cx={(key - 1950) * (255 / 75) + 40}
                                                            cy={270 - ((value + 5) * 270 / 10 - 18)}
                                                            r={2}
                                                            fill={(key == selectYear) ? "#f18" : "#"+countryColor[row["Country Name"]]}
                                                        />
                                                    )
                                                }
                                            })
                                        )
                                    }
                                })
                            )
                        })};
                        <text x={148} y={298} fontSize={10}>Year</text>
                        <text x={-205} y={12} fontSize={10} transform="rotate(-90)">Population Change (%)</text>
                        <line x1={35} y1={18 + 135} x2={280} y2={18 + 135} stroke="black"/>
                    </svg>
                </div>
                <div className="svg-m">
                    <svg width={chartSize} height={chartSize}>
                        <text x={30} y={10} fontSize={13}>How Much of the Population is in Poverty?</text>
                        <AxisLeft strokeWidth={0} left={chartMarginL + 17} top={0} scale={_scaleYpov} />
                        <AxisBottom
                            strokeWidth={0}
                            scale={yearScale}
                            numTicks={8}
                            left={20}
                            top={265}
                            tickFormat={d3.format(".0f")}
                        />
                        {selectC.map((c) => {
                            return (
                                povData.map((row) => {
                                    if ((c == row.Country) || (row.Country == "United States")) {
                                        return (
                                            Object.entries(row).map(([key, value]) => {
                                                if (key != "Country") {
                                                    return (
                                                        <circle
                                                            cx={(key - 1950) * (255 / 70) + 30}
                                                            cy={270 - (value * 270 / 100)}
                                                            r={2}
                                                            fill={(key == selectYear) ? "#f18" : "#"+countryColor[row["Country"]]}
                                                        />
                                                    )
                                                }
                                            })
                                        )
                                    }
                                })
                            )
                        })};
                        <text x={148} y={298} fontSize={10}>Year</text>
                        <text x={-160} y={12} fontSize={10} transform="rotate(-90)">Share (%)</text>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default LinkedPlot;