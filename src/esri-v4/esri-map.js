require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/VectorTileLayer"
], function (Map, MapView, VectorTileLayer) {
  var map = new Map();
  var view = new MapView({
    container: "map",
    map: map,
    center: [-82.611995,39.713426],
    zoom: 14,
    constraints: {
      minZoom: 11
    }
  });
  const tiles = window.location.origin + '//tiles/fairfield/{z}/{x}/{y}.mvt'
  const style = {
    "version": 8,
    "sprite": "https://cdn.arcgis.com/sharing/rest/content/items/75f4dfdff19e445395653121a95a85db/resources/styles/../sprites/sprite",
    "glyphs": "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer/resources/fonts/{fontstack}/{range}.pbf",
    "sources": {
      "local": {
        "type": "vector",
        "tiles": [tiles],
        "maxZoom": 15
      }
    },
    "capabilities": "TilesOnly, TileInfo, FeatureInfo",
    "layers": [{
        "id": "background",
        "type": "background",
        "paint": {
          "background-color": "#202020"
        }
      },
      {
        "id": "local",
        "type": "fill",
        "source": "local",
        "source-layer": "fairfield",
        "paint": {
          "fill-color": "#ffa000",//"#0396B0",
          "fill-opacity": 0.2,
          "fill-outline-color": "white"
        }
      },
      {
        'id': 'local-line',
        'type': 'line',
        'source': 'local',
        'source-layer': 'fairfield',
        'paint': {
          'line-width': 1,
          'line-opacity': 1,
          'line-color': "#ffa000"
        },
        "popupTemplate": {
          "test": "Test"
        }
      }
    ]
  }
  var tileLayer = new VectorTileLayer({
    style: style
  });
  view.on("pointer-move", e => {
    moveEnd(view, tiles, e)
  });
  view.on("pointer-down", e => {
    moveEnd(view, tiles, e)
  })
  map.add(tileLayer);
});
let featureId = null;
function moveEnd(view, tiles, e) {
  const info = document.querySelector("#info");
  const coords = view.toMap({ x: e.x, y: e.y });
  const lngLat = [coords.longitude, coords.latitude];
  getData(lngLat, tiles)
  .then(f => {
    if (f) {
      if (featureId != f.id);
      info.innerHTML = (f.properties.index) ? f.properties.index.split("|")[0] : ""
      featureId = f.id
    }
  })
}
async function getData(point, tiles) {
  const geojson = await tilequery({
    point: point,//[-82.62212276458742,39.88099237527944], 
    radius: 10,
    units: 'feet',
    tiles: tiles,
    layer: 'fairfield', 
    zoom: 15,
    buffer: false,
    pointInPolygon: true
  });
  return (geojson.features.length) ? geojson.features[0] : false
}