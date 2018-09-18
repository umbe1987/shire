// CSS imports
import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';

// JS imports
import 'whatwg-fetch'; // A window.fetch JavaScript polyfill.

import 'babel-polyfill'; // babel-polyfill package


import Map from 'ol/Map';
import View from 'ol/View';
import Extent from 'ol/extent';
import LayerGroup from 'ol/layer/Group';
import LayerImage from 'ol/layer/Image';
import LayerTile from 'ol/layer/Tile';
import SourceOSM from 'ol/source/OSM';
import SourceXYZ from 'ol/source/XYZ';

import LayerSwitcher from 'ol-layerswitcher';

import * as WmsParser from './js/wms_parser';
import { fancyAlert } from './js/fancy_alert';
import { getInfoUrl } from './js/get_info';
import { getOLLayers } from './js/ol_layers';

// PROJECTION

proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');

// WMS URL
var wms_url = 'http://www.cartografia.regione.lombardia.it/ArcGIS10/services/wms/dusaf21/MapServer/WMSServer?';

// Parse WMS Capabilities to retrieve layers and build the map
WmsParser.getWMSLayers(wms_url).then(wms_layers => {
    // OPERATIONAL LAYERS
    var operational_layers = WmsParser.getLayers(wms_layers, wms_url);

    // BASEMAP LAYERS

    // OSM Basemap
    var osmBasemap = new SourceOSM();
    var basemap1 = new LayerTile({
        title: 'OSM',
        type: 'base',
        visible: true,
        source: osmBasemap
    });

    // Esri Basemap
    var esriBasemap = new SourceXYZ({
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: 'Tiles © Esri — Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
    });

    var basemap2 = new LayerTile({
        title: 'ESRI_WorldImagery',
        type: 'base',
        visible: false,
        source: esriBasemap
    });

    // Blank Basemap
    var basemap3 = new LayerTile({
        title: 'BLANK',
        type: 'base',
        visible: false,
        source: null,
    });

    // LAYER GROUPS
    var overlays_group = new LayerGroup({
        title: 'Overlays',
        layers: operational_layers,
    });

    // for BASEMAP
    var basemap_group = new LayerGroup({
        title: 'Basemaps',
        layers: [
            basemap1,
            basemap2,
            basemap3,
        ]
    });

    // define array of layer groups

    var layer_groups = [
        basemap_group,
        overlays_group,
    ]

    // VIEW

    var view = new View({
        center: [952014.59, 5571269.68],
        zoom: 8
    });

    // MAP

    var map = new Map({
        layers: layer_groups,
        target: 'map',
        view: view
    });

    // OL-LAYERSWITCHER

    var layerSwitcher = new LayerSwitcher();
    map.addControl(layerSwitcher);

            // array of ol layers in the map (excluding groups)
            var ol_layers = getOLLayers(map.getLayerGroup());

    // DISPLAY INFO ONCLICK
    map.on('singleclick', function(evt) {
        // display info in fancyAlert "info"
        for (let i = 0; i < ol_layers.length; ++i) {
            let layer = ol_layers[i];
            let text = getInfoUrl(evt, view, layer);
            if (text) {

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        fancyAlert('Layer Info', this.responseText, 'info');
                    }
                };
                xhttp.open("GET", text, true);
                xhttp.send();
            }
        }
    })
});
