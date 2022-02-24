import * as d3 from "d3";
import Select from 'react-select';
import { AxisLeft, AxisBottom } from "@visx/axis";
import { scaleLinear, scaleBand, extent, line, symbol, csv, format} from "d3";
import gdp from './gdp.js'
import { useState } from "react";

// attempting to restructure data from js file
var gdpData = [];

// get unique country names
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

// get percentage change from prior year
// var percentChange = [];


// let prev = gdpData[1][Object.keys(gdpData[1])[0]];
// Object.entries(gdpData[1]).forEach(([key, value]) => {
//     if (key != "Country") {
//         //console.log(key, value, prev);
//         prev = value;
//     } else {

//     };
// });



// chart stuff, look at again
var chartSize = 500;
var chartMarginL = 50;
var chartMarginB = 20;

const yearScale = scaleLinear()
    .domain([1900, 2020])
    .range([chartMarginB, chartSize - chartMarginB - chartMarginB]);

const _scaleY = scaleLinear()
    .domain([0, 100000])
    .range([chartSize - chartMarginL, chartMarginL]);

// creating array of options

const options = [];
countries.forEach((c) => {
    var cOption = {};
    cOption['value'] = c;
    cOption['label'] = c;
    options.push(cOption);
})



const Interactive = () => {
    // making interactive
    const [selectC, setSelectC] = useState(
        ["United States"],
    );
    console.log(selectC);

    const color = scaleLinear({
        domain: [
            0,100000
        ],
        range: ["red", "yellow"],
    });
    
    //const handleC = (country) => {
        
        //let cc = country.map((e) => {
            //return e.value;
        //});

        // let temp = countries.map((item) => {
        //     return item;
        // })
        
        // setSelectC(temp);
    //};

    var selectedCountries = [];

    selectC.map((c) => {
        gdpData.forEach((row) => {
            if (row.Country == c) {
                selectedCountries.push(row);
            };
        });
    })

    return (
        <div>
            <div className="i-chart">
                <h2>Average GDP Per Capita by Country</h2>
                <svg width={chartSize + 120}
                height={chartSize}>
                    {selectedCountries.map((c, ind) => {
                        console.log(c);
                        return (
                            <>
                                {Object.entries(c).map(([key, value], i) => {
                                    if (key != "Country") {
                                        return (
                                            <>
                                                <circle
                                                    cx={(440 / 119) * (key - 1900) + 70}
                                                    cy={440 - (408 / 100000 * value)}
                                                    r={2}
                                                    fill={`rgb(${ind * 50},0,240)`}
                                                />
                                            </>
                                        ) 
                                    }  
                                })}
                            </>    
                        )
                    })}
                    {selectedCountries.map((cRow) => {
                        return (
                            <text x={510} y={442 - (408 / 100000 * cRow[2018])} 
                            fontSize={10}>
                                {cRow.Country}
                            </text>
                        )
                    })}
                    <AxisLeft strokeWidth={0} left={chartMarginL + 15} top={-10} scale={_scaleY} />
                    <AxisBottom
                        strokeWidth={0}
                        scale={yearScale}
                        numTicks={10}
                        left={50}
                        top={430}
                        tickFormat={d3.format(".0f")}
                    />
                    <text x={275} y={475} fontSize={10}>Year</text>
                    <text x={-300} y={12} fontSize={10} transform="rotate(-90)">GDP Per Capita ($)</text>
                </svg>
            </div>
            <div className="select">
                <Select
                    isMulti={true}
                    value={selectC.value}
                    onChange={(handleC) => {
                        console.log("yippee", handleC.length);
                        let temp = handleC.map((c) => {
                            // if temp already has, remove
                            return c.value;
                            
                        });
                        console.log(temp.length);
                        //let noDupes = [...new Set(selectC.concat(temp))];
                        //console.log(noDupes);
                        setSelectC(temp);
                    }}
                    options={options}
                    placeholder={"Select Countries"}
                />
            </div>
            <div className="reflection">
                <p>
                    I spent an abundance of time thinking about the specific data I wanted to visualize 
                    because my dataset has a lot of interesting information and variables. Some ideas I 
                    considered were GDP change year after year in percentage, showing a GDP snapshot in 
                    time but based on location, comparing GDP of particular countries, but ultimately I 
                    settled on average GDP per capita over the years because I believe it clearly depicts 
                    key differences between countries and is easy to understand. I chose to use a scatterplot 
                    to show GDP because there are many data points and I do not want my audience to imply 
                    values between points in a time series. The sheer number of countries one may want to 
                    plot can vary, so I also made sure to distinguish countries by color. <br></br>
                    I also chose a dropdown menu as my interaction technique because I wanted to give users 
                    all the countries as options so that they can compare data themselves, and to also fit 
                    it compactly into the website. Alternatively, I could have chosen a slider for the user 
                    to interact with the years plotted, but I really wanted to highlight the contrasting GDPs.<br></br>
                    In keeping the chart junk low and adding minimal features to my plot, the data-ink ratio 
                    reflects what information is most important to me to convey.
                </p>
                <p>
                    In total, I spent roughly 20 hours reorganizing my data, creating my visualization, 
                    and making it interactive. The part that took me the most time was understanding 
                    the react-select element and knowing how to handle it so that it graphs the right 
                    countries on change. I also struggled with having pre-graphed data on the visualization 
                    because it did not also show in the select/search element, but experimenting helped me 
                    figure out a user experience that I was okay with. For a while, I also struggled with 
                    the concept of state, setting it equal to a const. It was hard for me to picture event 
                    handling worked until I went through each part many many times to grasp why each part 
                    is important.
                </p>
            </div>
        </div>
    );
};
export default Interactive;