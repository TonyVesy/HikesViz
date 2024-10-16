

const worldAtlasURL = 'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';
const enableAnimation = true;
const panningSensitivity = 58;
const margin = 20;
const maxZoom = 80;
const minZoom = 0.9;
const tooltip = d3.select("#tooltip");
let pointData = [];

const state = {
    data: undefined,
    rotation: [0, -20, 0],
    scale: undefined,
    translation: undefined,
    initialScale: undefined,
};




// Select the SVG element by its ID
const mapDiv = d3.select('.Map'); 
const width = mapDiv.node().clientWidth;
const height = mapDiv.node().clientHeight;
const projection = d3.geoOrthographic();
const path = d3.geoPath(projection);
const graticule = d3.geoGraticule();







// Select the SVG element by its class and set its dimensions
const svg = d3.select('.Map__SVG')
    .attr('width', width)
    .attr('height', height);


function createMap(firstTenHikes) {
    pointData = firstTenHikes;
    projection
        .rotate(state.rotation)
        .scale(state.scale)
        .translate(state.translation);

    svg.selectAll('path.outline')
        .data([{ type: 'Sphere' }])
        .join('path')
        .attr('class', 'outline')
        .attr('d', path)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    svg.selectAll('path.graticule')
        .data([null])
        .join('path')
        .attr('class', 'graticule')
        .attr('d', path(graticule()))
        .attr('fill', 'none')
        .attr('stroke', 'lightgrey')
        .attr('stroke-width', 0.5);

    svg.selectAll('path.country')
        .data(state.data.features)
        .join('path')
        .attr('d', path)
        .attr('class', 'country')
        .attr('stroke', 'white')
        .attr('stroke-width', 0.5)
        .on('mouseover', function(event, d) {
            d3.select(this)
                .attr('stroke', 'green') // Change the stroke color on hover
                .attr('stroke-width', 2)
                .attr('fill','green'); // Optionally change the stroke width
            
            // Show the country name
            //d3.select('#country-name').text(d.properties.name); // Assuming the country name is in d.properties.name
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('stroke', 'white') // Reset to original stroke color
                .attr('stroke-width', 0.5)
                .attr('fill','black'); // Reset to original stroke width
        });

    
    // const pinpointCoordinates = [[7.641618, 45.980537],[-33.865143, 151.20990]]; // Longitude, Latitude
    // svg.selectAll('circle.pinpoint')
    //     .data(pinpointCoordinates.filter(d => {
    //         const [longitude, latitude] = d;
    //         const [x, y] = projection([longitude, latitude]);
    //         const center = projection.invert([width / 2, height / 2]);
    //         const angle = d3.geoDistance([longitude, latitude], center);
    //         return angle < Math.PI / 2; // Filter points on the visible side
    //     }))
    //     .join('circle')
    //     .attr('class', 'pinpoint')
    //     .attr('r', 8)
    //     .attr('fill', 'green')
    //     .attr('stroke', 'black')
    //     .attr('stroke-width', 1)
    //     .attr('transform', d => `translate(${projection(d)})`);    

    
}

function createMapPoints() {
    svg.selectAll("circle.pinPoint")
    .data(pointData)
        .enter()
        .append("circle")
        .attr("class", "pinPoint")
        .attr("r", 3)  // Set the initial radius
        .attr("fill", "green")  // Add fill color
        .attr("stroke", "black")  // Add stroke color (outline)
        .attr("stroke-width", 1)
        .attr('transform', d => {
                return `translate(${projection([d.max_pos_lon, d.max_pos_lat])})`;
             })
        .on("mouseover", (event, d) => {
                // Show the tooltip and set its content to the hike name
                
                tooltip.style("visibility", "visible")
                    .style("opacity", 1)
                    .text(d.name);
                const [cx, cy] = projection([d.max_pos_lon, d.max_pos_lat]);
                tooltip.style("top", (event.pageY + 10) + "px")  // Position below the cursor
                    .style("left", (event.pageX + 10) + "px");  // Assuming your data has a `name` property for each hike
            })
        .on("mouseout", () => {
                // Hide the tooltip when the mouse leaves the point
                tooltip.style("visibility", "hidden");
            });
}

function updateMapPoints() {
    const center = projection.invert([width / 2, height / 2]); // Recalculate the center of the map

    svg.selectAll("circle.pinPoint")
        .each(function(d) {
            const longitude= d.max_pos_lon;
            const latitude = d.max_pos_lat;
            const angle = d3.geoDistance([longitude, latitude], center);
            const point = d3.select(this);
            
            // Only update visible points and move their positions
            if (angle < Math.PI / 2) {
                point
                    .attr("display", null)  // Ensure the point is visible
                    .attr("transform", `translate(${projection([longitude, latitude])})`);
            } else {
                point.attr("display", "none");  // Hide points on the other side of the globe
            }
        });
}

function fetchData(data) {
    fetch(worldAtlasURL)
        .then(response => response.json())
        .then(topoJSONData => {
            state.data = topojson.feature(topoJSONData, 'countries');
            const fittedProjection = d3.geoOrthographic().fitExtent(
                [
                    [margin, margin],
                    [width - margin, height - margin],
                ],
                { type: 'Sphere' },
            );
            state.initialScale = fittedProjection.scale();
            state.scale = state.initialScale;
            state.translation = fittedProjection.translate();

            createMap(data);
            createMapPoints();
        });
}

function setupDragBehavior(data) {
    svg.call(d3.drag()
    .on('drag', (event) => {
        const k = panningSensitivity / state.scale;
        state.rotation = [
            state.rotation[0] + event.dx * k,               // Update the longitude (rotation[0])
            Math.max(-70, Math.min(55, state.rotation[1] - event.dy * k)),  // Clamp latitude (rotation[1])
            state.rotation[2],                              // Keep rotation[2] unchanged
        ];
        
        // Update the map and points
        createMap(data);
        updateMapPoints();
    }));
}

function setupZoomBehavior(data) {
    svg.call(d3.zoom()
        .on('zoom', ({ transform }) => {
            const zoomFactor = Math.max(minZoom, Math.min(maxZoom, transform.k));
            // Update the scale using the clamped zoom factor
            state.scale = state.initialScale * zoomFactor;
            createMap(data);
            updateMapPoints();
        }));
}

function initMap(data) {
    fetchData(data);
    setupDragBehavior(data);
    setupZoomBehavior(data);
}

export { initMap };
