const worldAtlasURL = 'https://unpkg.com/visionscarto-world-atlas@0.1.0/world/110m.json';
const enableAnimation = true;
const panningSensitivity = 58;
const margin = 20;

const state = {
    data: undefined,
    rotation: [0, -20, 0],
    scale: undefined,
    translation: undefined,
    initialScale: undefined,
};

const pinpointCoordinates = [7.641618, 45.980537];

const pinpointGeoJSON = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: {
                name: "Pinpoint Location"
            },
            geometry: {
                type: "Point",
                coordinates: [7.641618, 45.980537] // Longitude, Latitude
            }
        }
    ]
};



// Select the SVG element by its ID
const svg = d3.select('#Map__SVG'); 

const width = +svg.attr('width');
const height = +svg.attr('height');

function createMap() {
    const projection = d3.geoOrthographic();
    const path = d3.geoPath(projection);
    const graticule = d3.geoGraticule();

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
        .attr('stroke', '#BBB')
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
                .attr('stroke', 'orange') // Change the stroke color on hover
                .attr('stroke-width', 2)
                .attr('fill','red'); // Optionally change the stroke width
            
            // Show the country name
            d3.select('#country-name').text(d.properties.name); // Assuming the country name is in d.properties.name
        })
        .on('mouseout', function() {
            d3.select(this)
                .attr('stroke', 'white') // Reset to original stroke color
                .attr('stroke-width', 0.5)
                .attr('fill','black'); // Reset to original stroke width
        });
    
    const pinpointCoordinates = [[7.641618, 45.980537],[-33.865143, 151.20990]]; // Longitude, Latitude
    svg.selectAll('circle.pinpoint')
        .data(pinpointCoordinates.filter(d => {
            const [longitude, latitude] = d;
            const [x, y] = projection([longitude, latitude]);
            const center = projection.invert([width / 2, height / 2]);
            const angle = d3.geoDistance([longitude, latitude], center);
            return angle < Math.PI / 2; // Filter points on the visible side
        }))
        .join('circle')
        .attr('class', 'pinpoint')
        .attr('r', 8)
        .attr('fill', 'green')
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .attr('transform', d => `translate(${projection(d)})`);
    
}

function fetchData() {
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

            createMap();
        });
}

function setupDragBehavior() {
    svg.call(d3.drag()
        .on('drag', (event) => {
            const k = panningSensitivity / state.scale;
            state.rotation = [
                state.rotation[0] + event.dx * k,
                state.rotation[1] - event.dy * k,
                state.rotation[2],
            ];
            createMap();
        }));
}

function setupZoomBehavior() {
    svg.call(d3.zoom()
        .on('zoom', ({ transform }) => {
            state.scale = state.initialScale * transform.k;
            createMap();
        }));
}

function init() {
    fetchData();
    setupDragBehavior();
    setupZoomBehavior();
}

init();
