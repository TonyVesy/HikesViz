var globalData;

// Initialization of the dashboard

function init(){
  d3.csv('projTime.csv').then(function(data) {
    globalData = data;
    createScatterPlot(globalData,window.innerHeight/3,window.innerWidth/3);
    createPseudoMap(globalData, (window.innerHeight/3) *1.5, window.innerWidth / 2);
    resize();
    window.addEventListener('resize', resize);
  });
}

function resize() {
  // Remove the existing SVG and h3 before redrawing
  d3.select(".ScatterPlot").select("svg").remove();
  d3.select(".ScatterPlot").select("h3").remove();
  
  // Recreate the scatter plot with the new dimensions
  createScatterPlot(globalData, window.innerHeight / 3, window.innerWidth / 3);
  createPseudoMap(globalData, (window.innerHeight / 3) * 1.5, window.innerWidth / 1.5);
}

function createScatterPlot(data,height,width) {
    const margin = { top: 10, right: 30, bottom: 50, left: 50 };
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height- margin.top - margin.bottom;
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

    const numTicksX = Math.floor(svgWidth / 50); 
    const numTicksY = Math.floor(svgHeight / 50);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0,${svgHeight})`)
        .call(d3.axisBottom(x).ticks(numTicksX)) // Adjust tick count based on width
        .append("text")
        .attr("x", svgWidth / 2)
        .attr("y", 30)
        .attr("fill", "black")
        .text("Length (meters)");
  
    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y).ticks(numTicksY)) // Adjust tick count based on height
      .append("text")
      .attr("x", -svgHeight / 2)    // Move the label to the middle of the axis
      .attr("y", -margin.left + 20)  // Position slightly away from the axis
      .attr("transform", "rotate(-90)")  // Rotate the label by 90 degrees
      .attr("text-anchor", "middle")    // Align the text in the center
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

function createPseudoMap(data, height, width) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const svgWidth = width - margin.left - margin.right;
  const svgHeight = height - margin.top - margin.bottom;

  // Clear existing elements before appending new ones
  d3.select(".PseudoMap").selectAll("*").remove();

  // Create SVG container
  const svg = d3.select(".PseudoMap")
      .append("svg")
      .attr("width", svgWidth + margin.left + margin.right)
      .attr("height", svgHeight + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // Create scales (you can adjust these based on your map's data range)
  const x = d3.scaleLinear()
      .domain([0, 100]) // Example range for X axis
      .range([0, svgWidth]);

  const y = d3.scaleLinear()
      .domain([0, 100]) // Example range for Y axis
      .range([svgHeight, 0]);

  svg.append("rect")
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .attr("rx", 15) // Rounded corners radius
      .attr("ry", 15) // Rounded corners radius
      .attr("fill", "#e0e0e0"); // Light gray background
  
      svg.append("text")
     .attr("x", svgWidth / 2)                  // Center horizontally
     .attr("y", svgHeight / 2)                 // Center vertically
     .attr("text-anchor", "middle")            // Center text horizontally
     .attr("dominant-baseline", "middle")      // Center text vertically
     .attr("fill", "black")
     .style("font-size", "20px")
     .text("My Pseudo Map ")
     .append("tspan")                           // Add second line
     .attr("dy", "2em")
     .attr("dx", "-7em")                         // Move down slightl
     .text("In progress 🔴🚧⌛🔄🟢");                        // Move down for the second line
    
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
