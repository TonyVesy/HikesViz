var dots,xAxis, yAxis, x ,y,svgWidth,svgHeight, tooltip;

var xVar="length_3d";
var yVar ="moving_time_hours" 




function createScatterPlot(data,height,width) {
    const margin = { top: 10, right: 30, bottom: 50, left: 50 };
     svgWidth = width - margin.left - margin.right;
     svgHeight = height- margin.top - margin.bottom;
    // Create a tooltip div that is hidden by default
    tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    data.forEach(d => {
      d.length_3d = +d.length_3d;
      d.moving_time_hours = +d.moving_time_hours;
    });

    x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.length_3d)])
    .range([0, svgWidth]);
  
    y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.moving_time_hours)])
      .range([svgHeight, 0]);
  
    d3.select(".ScatterPlot")
        .append("h3")
        .style("margin-left", `10px`)
        .text("Relation between hiking time and total length")
        .style("color", "var(--MainColor)");

    // Create SVG container
    var svg = d3.select(".ScatterPlot")
    .append("svg")
    .attr("width", svgWidth + margin.left + margin.right)
    .attr("height", svgHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

    const numTicksX = Math.floor(svgWidth / 50); 
    const numTicksY = Math.floor(svgHeight / 50);

    // Add X axis
    xAxis=svg.append("g")
      .attr("transform", `translate(0,${svgHeight})`)
      .call(d3.axisBottom(x).ticks(numTicksX)); // Adjust tick count based on width
   
    // Add Y axis
    yAxis=svg.append("g")
      .call(d3.axisLeft(y).ticks(numTicksY)) // Adjust tick count based on height
  
    // Add the scatterplot points
    dots=svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.length_3d))
      .attr("cy", d => y(d.moving_time_hours))
      .attr("r", 2.5)
      .attr("fill", "var(--MainColor)")  // Add fill color
      .attr("stroke", "black")           // Add stroke color (outline)
      .attr("stroke-width", 0.01)        
      .on("mouseover", (event, d) => {
          tooltip.transition()
              .duration(200)
              .style("opacity", 1);
          tooltip.html(d.name)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px")
              .style("color", "white");
          // Change fill color and outline on hover
          d3.select(event.currentTarget) // Select the hovered circle
          .attr("fill", "green") // Change fill color
          .attr("stroke", "black") // Change stroke color
          .attr("r",4)   // Change stroke color
          .attr("stroke-width", 1); // Increase stroke width
      })
      .on("mouseout", () => {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);

            d3.select(event.currentTarget) // Select the hovered circle
            .attr("fill", "var(--MainColor)") // Reset fill color
            .attr("stroke", "black")    // Reset stroke color
            .attr("stroke-width", 0.01) 
            .attr("r",2.5);  // Reset stroke width
      });

      // update chart based on drop down selection
    d3.select("#attributeSelector").on("change", function () {
      // recover the option that has been chosen
      var selectedAttribute = d3.select(this).property("value")
      updateScatterPlotX(selectedAttribute,data);
    
    });

    d3.select("#attributeSelectorLeft").on("change", function () {
      // recover the option that has been chosen
      var selectedAttribute = d3.select(this).property("value")
      updateScatterPlotY(selectedAttribute,data);
    
    });
};

function updateScatterPlotY(selectedAttribute,data) {

  // run the updateChart function with this selected option
// Create new data with the selection?
var dataFilter = data.map(function(d){return {xAxis: d[xVar], value:d[selectedAttribute]} })


const newY = d3.scaleLinear()
  .domain([0, d3.max(data,d => d.value)])
  .range([svgHeight, 0]);



yAxis.transition().duration(1000).call(d3.axisLeft(newY));

console.log("passei aqui")

// Give these new data to update line
dots
  .data(dataFilter)
  .transition()
  .duration(1000)
    .attr("cx", function(d) { return x(+d.xAxis)})
    .attr("cy", function(d) { return y(+d.value) });

}


function updateScatterPlotX(selectedAttribute,data) {

        // run the updateChart function with this selected option
      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {value:d[selectedAttribute],yAxis: d[yVar]} })


      const newX = d3.scaleLinear()
        .domain([0, d3.max(data,d => d.value)])
        .range([0, svgWidth]);

      

      xAxis.transition().duration(1000).call(d3.axisBottom(newX));

      console.log("passei aqui")
      
      // Give these new data to update line
      dots
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x(+d.value)})
          .attr("cy", function(d) { return y(+d.yAxis) });

}



export { createScatterPlot };