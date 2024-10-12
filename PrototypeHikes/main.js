
import {createScatterPlot} from './scatterPlot.js';
import {populateCountryDropdown} from './filters.js';
import {createRadarChart, updateRadarPlot} from './radarChart.js';

let data;
let globalData;
let countrySelect = document.getElementById("country-filter");
let selectedHike = null;

function getSelectedHike() {
  return selectedHike;
}

function setSelectedHike(hike) {
  selectedHike = hike;
}

function init(){
  d3.csv('Hikes_A_12october.csv').then(function(averageData) {
  d3.csv('Hikes_12october.csv').then(function(CSVdata) {
    globalData = CSVdata;
    data = CSVdata;
    const allIndex = averageData.findIndex(d => d.country_name === "all");
    const allIndex2 = 57;
    populateCountryDropdown(data);
    createScatterPlot(data);
    createRadarChart(averageData.slice(57,58),null,null);
    countrySelect.addEventListener('change', () => {
      const selectedCountry = countrySelect.value;
      filterByCountry(selectedCountry);});
    window.addEventListener('resize', resize);
    resize();
  });}
 );
}

function filterByCountry(selectedCountry) {
  
  let filteredData;
  if (selectedCountry === "all") {
      // If "All" is selected, use the original data
      filteredData = globalData; // Assuming globalData contains all your hike data
  } else {
      // Filter the data based on the selected country
      filteredData = globalData.filter(hike => hike.country_name === selectedCountry);
  }
  data = filteredData;
  // Call the function to update the scatter plot with the filtered data
  d3.select(".Scatter__SVG").selectAll("*").remove();
  createScatterPlot(filteredData);
}

function resize() {
  console.log("Resizing");
// Remove the existing SVG and h3 before redrawing
  d3.select(".Scatter__SVG").selectAll("*").remove();
  createScatterPlot(data);
  updateRadarPlot();

}
init();

export {selectedHike};
export {getSelectedHike};
export {setSelectedHike};