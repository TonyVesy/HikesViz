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
        .text("Relation between hiking time and total length")
        .style("color", "var(--MainColor)");

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
}



export { createScatterPlot };