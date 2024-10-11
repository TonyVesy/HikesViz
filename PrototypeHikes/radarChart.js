function createRadarChart(data) {
    const margin = { top: 10, right: 30, bottom: 40, left: 30 };

    // Select the SVG element inside the .Scatter div
    const svg = d3.select(".Radar__SVG")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
        
    const svgElement = d3.select(".Radar__SVG").node();
    const { width: svgOriginalWidth, height: svgOriginalHeight } = svgElement.getBoundingClientRect(); // Get dimensions

    svg.append("text")
        .attr("x", margin.top)
        .attr("y", margin.left)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Radar Chart");
    
    
}

export { createRadarChart };
