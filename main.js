// CSS imports
import 'ol/ol.css';
import './external/sidebar-v2/css/ol3-sidebar.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import './css/ol-umbe.css';

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

import Sidebar from './external/sidebar-v2/js/ol5-sidebar';

import LayerSwitcher from 'ol-layerswitcher';

import * as WmsParser from './js/wms_parser';
import {
    fancyAlert
} from './js/fancy_alert';
import {
    getInfoUrl
} from './js/get_info';
import {
    getOLLayers
} from './js/ol_layers';
import {
    renderLegend
} from './js/render_legend';
import {
    userLocation
} from './js/user_position';
import {
    zoomIcon, ZoomToExtent
} from './js/zoom_to_extent';

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

// BASEMAP group
var basemap_group = new LayerGroup({
    title: 'Basemaps',
    layers: [
        basemap1,
        basemap2,
        basemap3,
    ]
});

// VIEW

var view = new View({
    center: [952014.59, 5571269.68],
    zoom: 8
});

// MAP

var map = new Map({
    layers: basemap_group,
    target: 'map',
    view: view
});

// SIDEBAR
var sidebar = new Sidebar({
    element: 'sidebar',
    position: 'left'
});

// OL-LAYERSWITCHER
// Get out-of-the-map div element with the ID "layers" and renders layers to it.
// NOTE: If the layers are changed outside of the layer switcher then you
// will need to call ol.control.LayerSwitcher.renderPanel again to refesh
// the layer tree. Style the tree via CSS.
var toc = document.getElementById("layers");
LayerSwitcher.renderPanel(map, toc);

// add sidebar to map
map.addControl(sidebar);

// GEOLOCATION (https://openlayers.org/en/latest/examples/geolocation.html)
userLocation('track', map);

// WMS URL
var wms_url = 'https://servizigis.regione.emilia-romagna.it/wms/rete_escursionistica?';

// Parse WMS Capabilities to retrieve layers and build the map
WmsParser.getWMSLayers(wms_url).then(wms_layers => {
    // OPERATIONAL LAYERS
    var operational_layers = WmsParser.getLayers(wms_layers, wms_url, map);

    // add layers to map and re-render layerswitcher to show them
    map.addLayer(operational_layers[0]);
    LayerSwitcher.renderPanel(map, toc);

    // array of ol layers in the map (excluding groups)
    var ol_layers = getOLLayers(map.getLayerGroup());

    // get HTML elements with "layer" class
    var layer_class = document.getElementsByClassName("layer");

    // ZOOM TO LAYER EXTENT
    // add zoom icon
    for (let i = 0; i < layer_class.length; ++i) {
        zoomIcon(layer_class[i]);
    }

    // add onclick event listener to zoom icons
    var zoom_icons = document.getElementsByClassName("fa-search-plus");
    ZoomToExtent(zoom_icons, ol_layers, view);

    // RENDER LEGEND
    renderLegend(ol_layers, layer_class);

    // DISPLAY INFO ONCLICK
    map.on('singleclick', function(evt) {
        // display info in fancyAlert
        for (let i = 0; i < ol_layers.length; ++i) {
            let layer = ol_layers[i];
            let text = getInfoUrl(evt, view, layer);
            if (text) {

                var xhttp = new XMLHttpRequest();
                // overrideMimeType() can be used to force the response to be parsed as XML
                xhttp.overrideMimeType('text/xml');
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        // if ServiceExceptionReport occurs, place it in alert type "error"
                        var xhr = this.responseXML;
                        if (xhr.documentElement.nodeName === 'ServiceExceptionReport') {
                            fancyAlert(this.responseText, 'error');
                        } else {
                            fancyAlert(this.responseText, 'info', 'Layer Info');
                        }
                    }
                };
                xhttp.open("GET", text, true);
                xhttp.send();
            }
        }
    })
});
