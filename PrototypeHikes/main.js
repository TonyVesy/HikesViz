
import {createScatterPlot} from './scatterPlot.js';
import {populateCountryDropdown} from './filters.js';
import {createRadarChart, updateRadarPlot} from './radarChart.js';
import {initMap} from './map.js';

let data;
let globalData;
let aData
let countrySelect = document.getElementById("country-filter");
let selectedHike = null;
let selectedCountry = "all";
let filteredCountryData;
let firstTenHikes;

function getSelectedHike() {
  return selectedHike;
}

function setSelectedHike(hike) {
  selectedHike = hike;
  d3.select(".Radar__SVG").selectAll("*").remove();
  createRadarChart(filteredCountryData, [hike]);
}

function init(){
  d3.csv('Hikes_A_12october.csv').then(function(averageData) {
  d3.csv('Hikes_15october.csv').then(function(CSVdata) {
    CSVdata.forEach(d => {
      d.max_pos_lon = +d.max_pos_lon; // Convert to number
      d.max_pos_lat = +d.max_pos_lat; // Convert to number
  });
    firstTenHikes = CSVdata;
    globalData = CSVdata;
    data = CSVdata;
    aData = averageData;
    const allIndex = averageData.findIndex(d => d.country_name === "all");
    const allIndex2 = 57;
    populateCountryDropdown(data);
    
    createScatterPlot(data);
    createRadarChart(averageData.slice(57,58),null);
    initMap(firstTenHikes);
    countrySelect.addEventListener('change', () => {
      const selectedCountry = countrySelect.value;
      filterByCountry(selectedCountry);});
    window.addEventListener('resize', resize);
    filterByCountry("all");
    resize();
  });}
 );
}

function filterByCountry(selectedCountry) {
  let filteredData;
  if (selectedCountry === "all") {
      // If "All" is selected, use the original data
      filteredData = globalData;
      filteredCountryData = aData.slice(57,58)  // Assuming globalData contains all your hike data
  } else {
      // Filter the data based on the selected country
      filteredData = globalData.filter(hike => hike.country_name === selectedCountry);
      filteredCountryData = aData.filter(hike => hike.country_name === selectedCountry);
  }


  data = filteredData;
  // Call the function to update the scatter plot with the filtered data
  d3.select(".Scatter__SVG").selectAll("*").remove();
  createScatterPlot(filteredData);
  d3.select(".Radar__SVG").selectAll("*").remove();

  let d = getSelectedHike() ? [getSelectedHike()] : null;
  createRadarChart(filteredCountryData,d);
  
}

function resize() {
  
// Remove the existing SVG and h3 before redrawing
  d3.select(".Scatter__SVG").selectAll("*").remove();
  createScatterPlot(data);
  d3.select(".Radar__SVG").selectAll("*").remove();
  let d = getSelectedHike() ? [getSelectedHike()] : null;
  createRadarChart(filteredCountryData,d);
}
init();

export {selectedHike};
export {getSelectedHike};
export {setSelectedHike};