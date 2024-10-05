import { createScatterPlot} from './scatterPlot.js';
import { createPseudoMap } from './pseudoMap.js';
import { createPseudoRadar } from './pseudoRadarChart.js';
import { createPseudoPodium } from './pseudoPodium.js';
import { createPseudoJitter } from './pseudoJitter.js';

var globalData;

// Initialization of the dashboard

function init(){
  d3.csv('Hikes_CP3.csv').then(function(data) {
    globalData = data;
    createScatterPlot(globalData,window.innerHeight/3,window.innerWidth/3);
    createPseudoMap(globalData, (window.innerHeight/3) *1.5, window.innerWidth *3/4);
    createPseudoRadar(globalData, window.innerHeight/2.5, window.innerWidth/3);
    createPseudoPodium(globalData, window.innerHeight/2, window.innerWidth/4);
    createPseudoJitter(globalData, window.innerHeight/2.5, window.innerWidth/3);
    resize();
    window.addEventListener('resize', resize);
    resize();
  });
}

function resize() {
    console.log("Resizing");
  // Remove the existing SVG and h3 before redrawing
  d3.select(".ScatterPlot").select("svg").remove();
  d3.select(".ScatterPlot").select("h3").remove();

  d3.select(".PseudoMap").select("svg").remove();
  d3.select(".PseudoMap").select("h3").remove();

  d3.select(".PseudoRadar").select("svg").remove();
  d3.select(".PseudoRadar").select("h3").remove();

  d3.select(".PseudoPodium").select("svg").remove();
  d3.select(".PseudoPodium").select("h3").remove();

  d3.select(".PseudoJitter").select("svg").remove();
  d3.select(".PseudoJitter").select("h3").remove();
  
  // Recreate the scatter plot with the new dimensions
  createScatterPlot(globalData, window.innerHeight / 3, window.innerWidth / 3);
  createPseudoMap(globalData, (window.innerHeight / 3) * 1.5, window.innerWidth *3/4);
  createPseudoRadar(globalData, window.innerHeight / 2.5, window.innerWidth / 3);
  createPseudoPodium(globalData, window.innerHeight / 2, window.innerWidth / 4);
  createPseudoJitter(globalData, window.innerHeight / 2.5, window.innerWidth / 3);
}

init();
