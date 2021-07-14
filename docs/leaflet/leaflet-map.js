initLeaflet()
function initLeaflet() {
  let id = -1, highlightId = "";
  const map = L.map('map', {
    center: [39.713426, -82.611995],
    zoom: 15,
    minZoom: 12,
    maxZoom: 19,
    zoomControl: false
  });
  L.hash(map)
  const pbf = L.vectorGrid.protobuf(window.location.origin + '/map-compare/tiles/fairfield/{z}/{x}/{y}.mvt', {
    rendererFactory: L.canvas.tile,
    vectorTileLayerStyles: {
      fairfield: {
        weight: 1,
        fill: true,
        fillColor: '#e040fb',
        color: '#e040fb',
        fillOpacity: 0.2,
        opacity: 1,
      },
    },
    maxNativeZoom: 15,
    maxZoom: 22,
    interactive: true,
    getFeatureId: function (feature) {
      return feature.properties.vtlid
    }
  }).addTo(map);
  pbf.on('mouseover', function (e) {
    const props = (e.layer.feature) ? e.layer.feature.properties :  e.layer.properties      //var latlng = [e.latlng.lat,e.latlng.lng]; ////var latlng = [Number(parcel.y),Number(parcel.x)];
    id = props["vtlid"];
    if (id != -1 &&id != highlightId && highlightId) {
      pbf.resetFeatureStyle(highlightId);
    }
    highlightId = id;
    pbf.setFeatureStyle(id, {
      color: "#5cfb40",
      fill: true,
      fillColor: '#5cfb40',
    });
  });
  window.onload = function() {      setTimeout(function(){map.invalidateSize(true);},500);    }
}