var globalData;

// Initialization of the dashboard

function init(){
  d3.csv('projTime.csv').then(function(data) {
    globalData = data;
    createScatterPlot(globalData);
  });
}

function createScatterPlot(data) {
    const margin = { top: 10, right: 30, bottom: 20, left: 50 };
    const svgWidth = window.innerWidth/3 - margin.left - margin.right;
    const svgHeight = 300- margin.top - margin.bottom;
    // Create a tooltip div that is hidden by default
    const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    data.forEach(d => {
      d.length_3d = +d.length_3d;
      d.moving_time_seconds = +d.moving_time_seconds;
    });
  
    const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.length_3d)]).nice()
    .range([0, svgWidth]);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.moving_time_seconds)]).nice()
      .range([svgHeight, 0]);
  
    d3.select(".ScatterPlot")
        .append("h3")
        .style("margin-left", `10px`)
        .text("Relation between hiking time and total length");

    // Create SVG container
    const svg = d3.select(".ScatterPlot")
    .append("svg")
    .attr("width", svgWidth + margin.left + margin.right)
    .attr("height", svgHeight + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${svgHeight})`)
      .call(d3.axisBottom(x))
      .append("text")
      .attr("x", svgWidth/2)
      .attr("y", 20)
      .attr("fill", "black")
      .text("Length(meters)");
  
    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("x", -10)
      .attr("y", svgHeight/2)
      //.attr("transform", "rotate(90)")
      .attr("fill", "black")
      .text("Moving Time (hours)");
  
    // Add the scatterplot points
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.length_3d))
      .attr("cy", d => y(d.moving_time_seconds))
      .attr("r", 2.5)
      .attr("fill", "steelblue")
      .attr("stroke", "black")           // Add stroke color (outline)
      .attr("stroke-width", 0.01)         // Add stroke width
      .on("mouseover", (event, d) => {
          tooltip.transition()
              .duration(200)
              .style("opacity", 1);
          tooltip.html(d.name)
              .style("left", (event.pageX + 5) + "px")
              .style("top", (event.pageY - 28) + "px");
          // Change fill color and outline on hover
          d3.select(event.currentTarget) // Select the hovered circle
          .attr("fill", "green") // Change fill color
          .attr("stroke", "black")
          .attr("r",4)   // Change stroke color
          .attr("stroke-width", 1); // Increase stroke width
      })
      .on("mouseout", () => {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);

            d3.select(event.currentTarget) // Select the hovered circle
            .attr("fill", "steelblue") // Reset fill color
            .attr("stroke", "black")    // Reset stroke color
            .attr("stroke-width", 0.01) 
            .attr("r",2.5);  // Reset stroke width
      });
}

function createPseudoChart(chartId, color) {
    // Append SVG to each chart
    d3.select(chartId)
        .append("svg")
        .attr("width", 300)
        .attr("height", 300)
        .append("circle")
        .attr("cx", 150)  // Center of the SVG
        .attr("cy", 150)  // Center of the SVG
        .attr("r", 50)    // Circle radius
        .style("fill", color);  // Circle color
}

// Chart 1: Red Circle
createChart("#chart1", "red");
d3.select("#chart1")
    .append("text")
    .style("font-size", "20px")
    .text("Here will be the Map in progress...");

// Chart 2: Blue Circle
createChart("#chart2", "blue");
d3.select("#chart2")
    .append("text")
    .style("font-size", "20px")
    .text("Here will be the Podium in progress...");


// Chart 3: Green Circle
createChart("#chart3", "green");
d3.select("#chart3")
    .append("text")
    .style("font-size", "20px")
    .text("Here will be the ScatterPlot in progress...");


// Chart 4: Yellow Circle
createChart("#chart4", "yellow");
d3.select("#chart4")
    .append("text")
    .style("font-size", "20px")
    .text("Here will be the starplot in progress...");

// Chart 5: Purple Circle
createChart("#chart5", "purple");
d3.select("#chart5")
    .append("text")
    .style("font-size", "20px")
    .text("Here will be the jitterplot in progress...");
