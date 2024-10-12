import { selectedHike, setSelectedHike,getSelectedHike } from './main.js';
import { updateRadarPlot } from './radarChart.js';


var dots,xAxis,numTicksX,numTicksY , yAxis, x ,y, tooltip, numTicksX, numTicksY, header;
var xVar = "length_3d";
var yVar = "moving_time_hours" 


function createScatterPlot(data) {
    const margin = { top: 25, right: 40, bottom: 60, left: 35 };

    // Select the SVG element inside the .Scatter div
    const svg = d3.select(".Scatter__SVG")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
        
    const svgElement = d3.select(".Scatter__SVG").node();
    const { width: svgOriginalWidth, height: svgOriginalHeight } = svgElement.getBoundingClientRect(); // Get dimensions

    numTicksX = Math.floor(svgOriginalWidth / 50); 
    numTicksY = Math.floor(svgOriginalHeight / 50);

    data.forEach(d => {
      d[xVar] = +d[xVar];
      d[yVar] = +d[yVar];
    });
  
    x = d3.scaleLinear()
    .domain([d3.min(data, d => d[xVar]), d3.max(data, d => d[xVar])])
    .range([margin.left,svgOriginalWidth-margin.right-margin.left]);
  
    y = d3.scaleLinear()
      .domain([d3.min(data, d => d[yVar]), d3.max(data, d => d[yVar])])
      .range([svgOriginalHeight-margin.bottom-margin.top, margin.top]);


    // Create a tooltip div that is hidden by default
    tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
    
        // Add X axis
    xAxis = svg.append("g")
        .attr("transform", `translate(0,${svgOriginalHeight - margin.bottom -margin.top})`)
        .call(d3.axisBottom(x).ticks(numTicksX)) // Adjust tick count based on width
    // Add Y axis
    yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(numTicksY))

    //create the hike dots
    createDots(svg,data);

    // update x axis based on drop down selection
    d3.select("#attributeSelector").on("change", function () {
        // recover the option that has been chosen
        var selectedAttribute = d3.select(this).property("value")
        updateScatterPlotX(selectedAttribute,data);  
    });
      
    // update y axis based on drop down selection
    d3.select("#attributeSelectorLeft").on("change", function () {
        // recover the option that has been chosen
        var selectedAttribute = d3.select(this).property("value")
        updateScatterPlotY(selectedAttribute,data);
    });
    
}

function createDots(container, data){

    dots = container.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => x(d[xVar]))
    .attr("cy", d => y(d[yVar]))
    .attr("r", 2.5)
    .attr("fill", "green")  // Add fill color
    .attr("stroke", "black")           // Add stroke color (outline)
    .attr("stroke-width", 0.01)        
    .on("mouseover", (event, d) => {
        tooltip.transition()
            .duration(200)
            .style("opacity", 1);
        tooltip.html(d.name)
            .style("left", (event.pageX + 5) + "px")
            .style("top", (event.pageY - 28) + "px")
            .style("color", "black");
        // Change fill color and outline on hover
        d3.select(event.currentTarget) // Select the hovered circle
        .attr("fill", "green") // Change fill color
        .attr("stroke", "black") // Change stroke color
        .attr("r",4)   // Change stroke color
        .attr("stroke-width", 1); // Increase stroke width
    })
    .on("mouseout", (event,d) => {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);

        d3.select(event.currentTarget) // Select the hovered circle
            .attr("r", d === getSelectedHike() ? 4 : 2.5) // Reset radius based on selection
            .attr("fill", d === getSelectedHike() ? "red" : "green") // Reset fill color based on selection
            .attr("stroke", "black")    // Reset stroke color
            .attr("stroke-width", 0.01) 
    })
    .on("click", (event, d) => {
        setSelectedHike(d); 
        console.log("Selected hike:", getSelectedHike());
        updateScatterPlotHighlight();
    });
}
function updateScatterPlotHighlight() {
    dots.attr("fill", d => d === selectedHike ? "red" : "green")
        .attr("r", d => d === selectedHike ? 4 : 2.5)
        .each(function(d) {
            if (d === getSelectedHike()) {
                d3.select(this).raise(); // Bring the selected dot to the front
            }
        });
}

function updateScatterPlotX(selectedAttribute,data) {

    // run the updateChart function with this selected option
    data.forEach(d => {
        d[selectedAttribute] = +d[selectedAttribute];
        d[yVar] = +d[yVar];
    });

    //define new xVAR
    xVar=selectedAttribute;

    //change x axis domain
    x.domain([d3.min(data,d => d[selectedAttribute]), d3.max(data,d => d[selectedAttribute])]);

    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(numTicksX));

    // Give the new data to update dots
    dots
        .data(data)
        .transition()
        .duration(1000)
        .attr("cx", function(d) { return x(+d[selectedAttribute])})
        .attr("cy", function(d) { return y(+d[yVar]) });
}

function updateScatterPlotY(selectedAttribute,data) {

    // run the updateChart function with this selected option
    data.forEach(d => {
      d[xVar] = +d[xVar];
      d[selectedAttribute] = +d[selectedAttribute];
    });
    
    //define new yVar
    yVar=selectedAttribute
    
    //define new y axis domain
    y.domain([0, d3.max(data,d => d[selectedAttribute])])
    
    yAxis.transition().duration(1000).call(d3.axisLeft(y).ticks(numTicksY));
    
    // Give the new data to update dots
    dots
      .data(data)
      .transition()
      .duration(1000)
        .attr("cx", function(d) { return x(+d[xVar])})
        .attr("cy", function(d) { return y(+d[selectedAttribute]) });
    }


export { createScatterPlot};
