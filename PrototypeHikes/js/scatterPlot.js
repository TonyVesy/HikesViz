var dots;

function createDropmenu(hikeData){
  var attributes = ['duration','max_elevation','min_elevation','uphill','downhill']
  // add the options to the button
  d3.select("#dropdown_container")
      .selectAll('option')
          .data(attributes)
      .enter()
          .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; })
      
  // When the button is changed, run the updateChart function
  d3.select("#dropdown_container").on("change", function(d) {
      // recover the option that has been chosen
      var selectedAttribute = d3.select(this).property("value")
      // run the updateChart function with this selected option
      updateScatterplot(selectedAttribute,hikeData)
  })
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
  
    var x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.length_3d)])
    .range([0, svgWidth]);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.moving_time_seconds)])
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
    var xAxis=svg.append("g")
      .attr("transform", `translate(0,${svgHeight})`)
      .attr("class" , ".xAxis")
      .call(d3.axisBottom(x).ticks(numTicksX)); // Adjust tick count based on width
  
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
    dots=svg.selectAll("circle")
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

      // update colors based on drop down selection
    d3.select("#attributeSelector").on("change", function () {
      // recover the option that has been chosen
      var selectedAttribute = d3.select(this).property("value")
      // run the updateChart function with this selected option
      // Create new data with the selection?
      var dataFilter = data.map(function(d){return {value:d[selectedAttribute],moving_time_seconds: d.moving_time_seconds} })


      const newX = d3.scaleLinear()
        .domain([0, d3.max(data,d => d.value)]).nice()
        .range([0, svgWidth]);
      
      /*svg.select(".xAxis")
        .transition()
        .duration(1000)
        .call(yAxis);*/

      xAxis.transition().duration(1000).call(d3.axisBottom(newX).ticks(numTicksX))
      
      // Give these new data to update line
      dots
        .data(dataFilter)
        .transition()
        .duration(1000)
          .attr("cx", function(d) { return x(+d.value)})
          .attr("cy", function(d) { return y(+d.moving_time_seconds) })
    
    });
}



export { createScatterPlot };