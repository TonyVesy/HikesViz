var dots,xAxis, yAxis, x ,y,svgWidth,svgHeight, tooltip, numTicksX, numTicksY, header;

var xVar="length_3d";
var yVar ="moving_time_hours" 

var labels = {
  "length_3d": "length(meters)",
  "duration_hours": "duration",
  "max_elevation": "max elevation",
  "min_elevation": "min elevation",
  "max_elevation": "max elevation",
  "uphill":"uphill",
  "downhill":"downhill",
  "moving_time_hours":"moving time(hours)"
}




function createScatterPlot(data,height,width) {
    const margin = { top: 20, right: 30, bottom: 60, left: 80 };
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
  
    header = d3.select(".ScatterPlot")
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

    numTicksX = Math.floor(svgWidth / 50); 
    numTicksY = Math.floor(svgHeight / 50);

    // Add X axis
    xAxis=svg.append("g")
      .attr("transform", `translate(0,${svgHeight})`)
      .call(d3.axisBottom(x).ticks(numTicksX)); // Adjust tick count based on width
   
    // Add Y axis
    yAxis=svg.append("g")
      .call(d3.axisLeft(y).ticks(numTicksY)) // Adjust tick count based on height
    
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
};
 //THIS IS FOR THE COLOR LEGEND OF POINTS (DIFFICULTY)
var color = d3.scaleOrdinal()
    .domain(["t1", "versicolor", "virginica" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

function createDots(container ,data){

      // Add the scatterplot points
      dots=container.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.length_3d))
      .attr("cy", d => y(d.moving_time_hours))
      .attr("r", 2.5)
      .attr("fill", "var(--MainColor)")  // Add fill color
      .attr("stroke", "black")           // Add stroke color (outline)
      .attr("stroke-width", 0.01) 
      //.style("fill", function (d) { return color(d.Species) } )    FOR LENGEND OF DIFFICULTIES
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

header.transition().transition().duration(2000).duration(1000).text("Relation between "+ labels[selectedAttribute] + " and " +labels[xVar])

// Give these new data to update dots
dots
  .data(data)
  .transition()
  .duration(1000)
    .attr("cx", function(d) { return x(+d[xVar])})
    .attr("cy", function(d) { return y(+d[selectedAttribute]) });

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

      header.transition().duration(1000).text("Relation between "+ labels[yVar]+ " and " + labels[selectedAttribute])

      // Give these new data to update dots
      dots
        .data(data)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x(+d[selectedAttribute])})
          .attr("cy", function(d) { return y(+d[yVar]) });
}



export { createScatterPlot };