
function createPseudoMap(data, height, width) {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
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
  
    const rect = svg.append("rect")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .attr("rx", 15) // Rounded corners radius
        .attr("ry", 15) // Rounded corners radius
        .attr("fill", "#e0e0e0"); // Light gray background

    svg.append("defs").append("clipPath")
        .attr("id", "clip-rect")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Append the image with clipping path
    svg.append("image")
        .attr("xlink:href", "img/pMap.jpg") // Path to your image
        .attr("x", 0) // Positioning the image
        .attr("y", -150) // Positioning the image
        .attr("width", svgWidth )
         // Set width for the image // Set height for the image
        .style("opacity", 0.5) // Dim the image
        .attr("clip-path", "url(#clip-rect)"); // Apply clipping path
    
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
       .text("In progress 🔴🚧⌛🔄🟢"); 
  }

  export { createPseudoMap };