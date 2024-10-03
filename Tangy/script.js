function createChart(chartId, color) {
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
