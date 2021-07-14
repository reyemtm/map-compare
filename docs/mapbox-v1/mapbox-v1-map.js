initMapboxV1()
function initMapboxV1() {
  const map = new mapboxgl.Map({
    container: 'map',
    zoom: 14,
    minZoom: 11,
    center: [-82.611995,39.713426],
  });
  const tiles = window.location.origin + '/map-compare/tiles/fairfield/{z}/{x}/{y}.mvt'
  map.addSource('local', {
    'type': 'vector',
    'tiles': [tiles],
    'minzoom': 0,
    'maxzoom': 15
  });
  map.addLayer({
    'id': 'local',
    'type': 'fill',
    'source': 'local',
    'source-layer': 'fairfield',
    'paint': {
      'fill-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#fbd942',
        '#4264FB'
      ],
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        0.4,
        0.2
      ]
    }
  });
  map.addLayer({
    'id': 'local-line',
    'type': 'line',
    'source': 'local',
    'source-layer': 'fairfield',
    'paint': {
      'line-width': 1,
      'line-opacity': 1,
      'line-color': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#fbd942',
        '#4264FB'
      ],
    }
  });
  let hoveredStateId = null;
  map.on('mousemove', function (e) {
    const features = map.queryRenderedFeatures(e.point);
    if (!features.length && hoveredStateId) {
      map.setFeatureState({
        source: 'local',
        sourceLayer: 'fairfield',
        id: hoveredStateId
      }, {
        hover: false
      });
      hoveredStateId = null;
    }
    if (features.length > 0 && hoveredStateId != features[0].id) {
      if (hoveredStateId) {
        map.setFeatureState({
          source: 'local',
          sourceLayer: 'fairfield',
          id: hoveredStateId
        }, {
          hover: false
        });
      }
      hoveredStateId = features[0].id
      map.setFeatureState({
        source: 'local',
        sourceLayer: 'fairfield',
        id: hoveredStateId
      }, {
        hover: true
      });
    }
  });
  map.on('mouseleave', 'local', function () {
    if (hoveredStateId) {
      map.setFeatureState({
        source: 'local',
        sourceLayer: 'fairfield',
        id: hoveredStateId
      }, {
        hover: false
      });
    }
    hoveredStateId = null;
  });
  setTimeout(function(){map.resize();},500);
}