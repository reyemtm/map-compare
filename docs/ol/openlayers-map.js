initOl()
function initOl() {
  let selection = {};
  const parcel = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: '#36BBCD',
      width: 1,
    }),
    fill: new ol.style.Fill({
      color: 'rgba(54,187,205,0.2)',
    }),
  });
  const selectedParcel = new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: "#cd4736",
      width: 2,
    }),
    fill: new ol.style.Fill({
      color: "rgba(205,71,54,0.2)"
    }),
  });
  const hosted = window.location.pathname.includes('map-compare')
  const tiles = window.location.origin + (hosted ? '/map-compare' : '') + '/tiles/fairfield/{z}/{x}/{y}.mvt'
  const vtLayer = new ol.layer.VectorTile({
    declutter: true,
    source: new ol.source.VectorTile({
      maxZoom: 15,
      format: new ol.format.MVT({
        idProperty: 'vtlid',
      }),
      url: tiles
    }),
    style: parcel,
  });
  const olMap = new ol.Map({
    controls: [],
    layers: [vtLayer],
    target: 'map',
    view: new ol.View({
      // center: [ -82.6062,39.711,],
      center: ol.proj.fromLonLat([-82.611995,39.713426],
        ),
      zoom: 15,
      minZoom: 12
    }),
  });
  const selectionLayer = new ol.layer.VectorTile({
    map: olMap,
    renderMode: 'vector',
    source: vtLayer.getSource(),
    style: function (feature) {
      if (feature.getId() in selection) {
        return selectedParcel;
      }
    },
  });
  let fid = null
  olMap.on(['click', 'pointermove'], function (event) {
    vtLayer.getFeatures(event.pixel).then(function (features) {
      if (!features.length) {
        selection = {};
        selectionLayer.changed();
        return;
      }
      const feature = features[0];
      const newFid = feature.getId()
      if (fid && fid === newFid) return
      selection = {};
      selectionLayer.changed();
      selection[newFid] = feature;
      selectionLayer.changed();
      fid = newFid;
    });
  });
}