//// The radar chart inspired by Nadieh Bremer from VisualCinnamon.com ////////////////
import { selectedHike, getSelectedHike, setSelectedHike } from './main.js';

let gData = null;
let oHike = null;
const allAxis = ["duration_hours", "length_3d", "difficulty", "uphill", "downhill"]; // Names of each axis

let svg, cfg, rScales, angleSlice, radarLine, tooltip,g;
function transformDataCountry(data) {
	return data.map(function(d) {
		return {
			name: d.country_name, // Include the name field
			values: [
				{ axis: "duration_hours", value: parseFloat(d.duration_hours) },
				{ axis: "length_3d", value: parseFloat(d.length_3d) },
				{ axis: "difficulty", value: parseFloat(d.difficulty) },
				{ axis: "uphill", value: parseFloat(d.uphill) },
				{ axis: "downhill", value: parseFloat(d.downhill) }
			]
		};
	});
}
function transformDataHike(data) {
	return data.map(function(d) {
		return {
			name: d.name, // Include the name field
			values: [
				{ axis: "duration_hours", value: parseFloat(d.duration_hours) },
				{ axis: "length_3d", value: parseFloat(d.length_3d) },
				{ axis: "difficulty", value: parseFloat(d.difficulty) },
				{ axis: "uphill", value: parseFloat(d.uphill) },
				{ axis: "downhill", value: parseFloat(d.downhill) }
			]
		};
	});
}
function createRadarChart( generalData, oneHike ) {

	console.log("on construit le radar avec",generalData,oneHike)

   // Get the height of the SVG element
    svg = d3.select(".Radar__SVG")
    var svgHeight = svg.node().getBoundingClientRect().height;
	var svgWidth = svg.node().getBoundingClientRect().width;
	var newX, newY;

	cfg = {
	 w: svgWidth,				//Width of the circle
	 h: svgHeight*0.8,				//Height of the circle
	 margin: {top: 50, right: 10, bottom: 30, left: 30}, //The margins of the SVG
	 levels: 3,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.15, 	//The opacity of the area of the blob
	 dotRadius: 6, 			//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 3, 		//The width of the stroke around each blob
	 roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
	 color:  d3.scaleOrdinal().range(["#ffb3ba", "black", "#ffffba", "#baffc9", "#bae1ff"])	//Color function
	};

	

    if (generalData) {gData = transformDataCountry(generalData);}
	if (oneHike) {oHike = transformDataHike(oneHike);}
	else {oHike = null;}

	console.log("finalement on construit avec ",gData,oHike)


	
	var maxValues = allAxis.map(function (axis) {
    if (axis === "difficulty") {
        return 6.33; // Set a fixed value for the "difficulty" axis
    }
    if (axis === "length_3d") {
		return 100000; // Set a fixed value for the "length_3d" axis
	}
	if (axis === "duration_hours") {
		return 48; // Set a fixed value for the "duration_hours" axis
	}
	if (axis === "uphill") {
		return 2000; // Set a fixed value for the "uphill" axis
	}
	if (axis === "downhill") {
		return 2000; // Set a fixed value for the "downhill" axis
	}
	
	else {
        // Find the maximum value for the current axis in generalData
        var maxGeneral = d3.max(gData, function (d) {
            var axisData = d.values.find(function (e) {
                return e.axis === axis;
            });
            return axisData ? axisData.value : 0;
        });

        // Find the maximum value for the current axis in oneHike
		var maxFull;
		if(oHike){
			if (Array.isArray(oHike) && oHike.length > 0) {
				maxFull = oHike[0].values.find(hike => hike.axis === axis).value;
				oHike = oHike[0];
			} else {
				maxFull = oHike.values.find(hike => hike.axis === axis).value;
			}
		}
		else{maxFull=0;}
        var maxValue = Math.max(maxGeneral, maxFull);
        return maxValue;
    }});

    var total = allAxis.length ;                   // The number of different axes
	var radius = Math.min(cfg.w/2, cfg.h/2);     // Radius of the outermost circle
	var Format = d3.format('.2f');                   // Percentage formatting
	var angleSlice = Math.PI * 2 / total;
	
	
	// Create individual rScales for each axis
    rScales = allAxis.map((axis, i) => d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValues[i]]));


	//////////// Create the container SVG and g /////////////

	//Remove whatever chart with the same id/class was present before
	
	//Initiate the radar chart SVG
	
	//Append a g element		
	g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	///////////// legends ////////////////
	var legendData = gData;
	if (oHike) {
		// Add the special hike to the general data
		legendData.push(oHike[0]);
	}
	console.log("legendData",legendData)

    // Create a legend container
    var legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (cfg.margin.left - 20) + "," + cfg.margin.top + ")");

    // Add legend items
    legend.selectAll(".legend-item")
        .data(legendData)
        .enter().append("g")
        .attr("class", "legend-item")
        .attr("transform", function (d, i) { return "translate(0," + (i * 20) + ")"; });

    // Add colored rectangles
    legend.selectAll(".legend-item")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function (d, i) { 
			if (oHike && i === legendData.length - 1) {
				return "black"; // Change this to any color you prefer for the special hike
			}
			return cfg.color(i); });

    // Add text labels
    legend.selectAll(".legend-item")
        .append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function (d) {
			if (d.name=="All") {return "All hikes average"}
			if (d && d.name) {
				return d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name;
			}
		});
	//FILTER--------------------------
	 //first glow
	 var defs = svg.append("defs");
	 var filter = defs.append("filter")
		 .attr("id", "glow");
	 filter.append("feGaussianBlur")
		.attr("stdDeviation", "2.5")
		.attr("result", "coloredBlur");
	 var feMerge = filter.append("feMerge");
	 feMerge.append("feMergeNode")
		.attr("in", "coloredBlur");
	 feMerge.append("feMergeNode")
		.attr("in", "SourceGraphic");
	 //insane glow when hovered
	 var hoverFilter = defs.append("filter")
	 .attr("id", "glow-hover");
 
	 hoverFilter.append("feGaussianBlur")
		.attr("stdDeviation", "6") // Increased glow
		.attr("result", "coloredBlur");
	 var feMergeHover = hoverFilter.append("feMerge");
	 feMergeHover.append("feMergeNode")
		.attr("in", "coloredBlur");
	 feMergeHover.append("feMergeNode")
		.attr("in", "SourceGraphic");  
	
	//////////////////// Draw the axes //////////////////////
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");

	axis.append("g")
	.attr("class", "axisLabel")
	.each(function(d, i) {
		var tickValues = rScales[i].ticks(2);
        tickValues = tickValues.slice(1);
		if (i== 3 || i == 4) {
			var axis = d3.axisTop(rScales[i])
			.tickValues(tickValues)
			.tickSize(3)
			.tickFormat(d3.format(".0f"));	
		}
		else{
		var axis = d3.axisBottom(rScales[i])
			.tickValues(tickValues)
			.tickSize(3)
			.tickFormat(d3.format(".0f"));}
		
	
		d3.select(this)
            .attr("transform", function() {
                var angle = angleSlice * i * 180 / Math.PI - 90;
                return "translate(0,0) rotate(" + angle + ")";
            })
            .call(axis);
			
		if (i == 3 || i == 4) {
				d3.select(this).selectAll("text")
					.attr("transform", "rotate(180)")
					.attr("dy", "+2em")
					.attr("dx", "+1em" ) // Adjust the position of the text
					.style("text-anchor", "end");
			}
		d3.select(this).selectAll("ticks").attr("dy", "+2em")

	});	

	axis.append("text")
        .attr("class", "legendRadar")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i) { return rScales[i](maxValues[i] * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y", function(d, i) { return rScales[i](maxValues[i] * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
        .text(function(d) {  
			if (d =="duration_hours")
			{return "Duration (hours)"}
			else if (d =="length_3d")
			{return "Length 3D "}
			else if (d =="difficulty")
			{return "Difficulty "}
			else if (d =="uphill")
			{return "Uphill (meters)"}
			else if (d =="downhill")
			{return "Downhill (meters"}
			return d; })
        .call(wrap, cfg.wrapWidth);


	///////////// Draw the radar chart blobs ////////////////
	
	var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed) // Change to curveLinearClosed or curveCardinalClosed based on your needs
        .radius(function(d, i) { return rScales[i](d.value); })
        .angle(function(d, i) { return i * angleSlice; });
	if (cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed); // Use a cardinal curve for rounded strokes
	}	   
	   
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(gData)
		.enter().append("g")
		.attr("class", "radarWrapper");
		
	//areas
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d, i) { return radarLine(d.values); })
		.style("fill", function(d, i) { return cfg.color(i); })
		.style("fill-opacity", 0)
		.style("stroke", "none")
		.style("pointer-events", "none");
	
    //lines
	blobWrapper
		.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d.values); })
		.style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function(d, i) { return cfg.color(i); })
		.style("fill", "none")
		.on('mouseover', function (d,i,){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("stroke-width", cfg.strokeWidth-4 + "px")
				.style("filter", "url(#glow)");
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("stroke-width", cfg.strokeWidth +4 + "px")
				.style("filter", "url(#glow-hover)");
			d3.select(this.parentNode).select(".radarArea")
				.transition().duration(400)
				.style("fill-opacity", 0.2);
			tooltip
			.attr('x', 0)
			.attr('y', 0)
			.text(i.name)
			.transition().duration(200)
			.style('opacity', 1)
			.each(function() {
				var bbox = this.getBBox();
				var xOffset = -bbox.width / 2;
				var yOffset = +bbox.height / 2;
				d3.select(this)
					.attr('x', xOffset)
					.attr('y', yOffset-10);
			});
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarStroke")
			   .transition().duration(200)
			   .style("stroke-width", cfg.strokeWidth + "px")
			   .style("filter", "url(#glow)");
		    d3.selectAll(".radarArea")
               .transition().duration(400)
               .style("fill-opacity", 0);
			tooltip
			   .transition().duration(200)
			   .style('opacity', 0);
				
		});

		var pathTooltip = d3.select("#pathTooltip");

	
		if (oHike) {
			g.append("path")
				.datum(oHike.values)
				.enter() // Bind oneHike data
				.attr("class", "oneHikeStroke")
				.attr("d", radarLine) // Use the radarLine function to generate the path
				.style("stroke-width", cfg.strokeWidth*0.8 + "px")
				.style("stroke", "black")
				.style("fill", "none")	
				.on('mouseover', function (d,i,){
					//Dim all blobs
					d3.selectAll(".radarStroke")
						.transition().duration(200)
						.style("stroke-width", cfg.strokeWidth-1 + "px")
						.style("filter", "none");
					//Bring back the hovered over blob
					d3.select(this)
						.transition().duration(200)
						.style("stroke-width", cfg.strokeWidth *1.2 + "px")
						.style("filter", "url(#glow-hover)");

					newX = parseFloat(d3.select(this).attr('cx')) - 10;
					newY = parseFloat(d3.select(this).attr('cy')) - 10;
					tooltip
						.attr('x', 0)
						.attr('y', 0)	
						.text(oHike.name)
						.transition().duration(200)
						.style('opacity', 1);
				})
				.on('mouseout', function(){
					//Bring back all blobs
					d3.select(this)
						.transition().duration(200)
						.style("stroke-width", cfg.strokeWidth*0.8 + "px")
						.style("filter", "none");
					d3.selectAll(".radarStroke")
						.transition().duration(200)
						.style("stroke-width", cfg.strokeWidth + "px")
						.style("filter", "url(#glow)");
					tooltip.transition().duration(200)
						.style('opacity', 0);

						
				});

			g.selectAll(".oneHikeCircle")
				.data(oHike.values)
				.enter().append("circle")
				.attr("class", "oneHikeCircle")
				.attr("r", cfg.dotRadius * 4) // Increase the size of the circles
				.attr("cx", function(d, i) { return rScales[i](d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
				.attr("cy", function(d, i) { return rScales[i](d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
				.style("fill", "url(#radial-gradient)") // Apply the radial gradient
				.style("fill-opacity", 1)
				.style("pointer-events", "all")
				.on("mouseover", function(d, i) {
					newX = parseFloat(d3.select(this).attr('cx')) - 10;
					newY = parseFloat(d3.select(this).attr('cy')) - 10;
					d3.select(this).transition().duration(200).attr("r", cfg.dotRadius * 5);
					tooltip
						.attr('x', newX)
						.attr('y', newY)
						.text(Format(i.value))
						.transition().duration(200)
						.style('opacity', 1);
				})
				.on("mouseout", function() {
					tooltip.transition().duration(200)
						.style("opacity", 0);
					d3.select(this).transition().duration(200).attr("r", cfg.dotRadius * 4);
				});		
			}
			

	
	var style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = '.radarCircle.hovered { fill-opacity: 1; r: ' + (cfg.dotRadius + 2) + '; }';
	document.getElementsByTagName('head')[0].appendChild(style); 

	//////// Append invisible circles for tooltip ///////////

	var defs = svg.append("defs");
	var radialGradient = defs.append("radialGradient")
		.attr("id", "radial-gradient")
		.attr("cx", "50%")
		.attr("cy", "50%")
		.attr("r", "50%")
		.attr("fx", "50%")
		.attr("fy", "50%");

	radialGradient.append("stop")
		.attr("offset", "15%")
		.attr("stop-color", "black")
		.attr("stop-opacity", 1);

	radialGradient.append("stop")
		.attr("offset", "15%") // Faster transition
		.attr("stop-color", "black")
		.attr("stop-opacity", 0.1); // Slightly lighter
	
	radialGradient.append("stop")
		.attr("offset", "60%") // Faster transition
		.attr("stop-color", "black")
		.attr("stop-opacity", 0.05); // Even lighter

	radialGradient.append("stop")
		.attr("offset", "100%")
		.attr("stop-color", "black")
		.attr("stop-opacity", 0);
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(gData)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
	//Append a set of invisible circles on top for the mouseover pop-up
	blobCircleWrapper.selectAll(".radarCircle")
		.data(function(d,i) { return d.values; })
		.enter().append("circle")
		.attr("class", function(d, i, j) { return "radarCircle " + "radarCircle-" + j; })
		.attr("r", cfg.dotRadius*2)
		.attr("cx", function(d,i){ return rScales[i](d.value) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("cy", function(d,i){ return rScales[i](d.value) * Math.sin(angleSlice*i - Math.PI/2); })
		.style("fill", "url(#radial-gradient)") // Apply the radial gradient
		.style("pointer-events", "all")
		.on("mouseover", function(d,i) {
			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
			newY =  parseFloat(d3.select(this).attr('cy')) - 10;
			d3.select(this).transition().duration(200).attr("r", cfg.dotRadius*2.5)
					
			tooltip
				.attr('x', newX)
				.attr('y', newY)
				.text(Format(i.value))
				.transition().duration(200)
				.style('opacity', 1);
		})
		.on("mouseout", function(){
			tooltip.transition().duration(200)
				.style("opacity", 0);
			d3.select(this).transition().duration(200).attr("r", cfg.dotRadius*2)
			
		});
		
	//Set up the small tooltip for when you hover over a circle
	var tooltip = g.append("text")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	/////////////////// Helper Function /////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.4, // ems
			y = text.attr("y"),
			x = text.attr("x"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
			
		while (word = words.pop()) {
		  line.push(word);
		  tspan.text(line.join(" "));
		  if (tspan.node().getComputedTextLength() > width) {
			line.pop();
			tspan.text(line.join(" "));
			line = [word];
			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
		  }
		}
	  });
	}//wrap	
	
}//RadarChart


//-----------UPDATEEEEEEEEE----------//////

function updateRadarPlot() {
	const selectedHike = Array(getSelectedHike());
    if (!selectedHike) return; // Ensure selectedHike is defined

    // Update the radar plot with the selected hike's data
	d3.select(".Radar__SVG").selectAll("*").remove()
	createRadarChart(gData, selectedHike);

}


export { createRadarChart };
export { updateRadarPlot };