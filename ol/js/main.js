// CSS imports
import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import './sidebar-v2/css/ol3-sidebar.css';

// JS imports
import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import LayerImage from 'ol/layer/Image';
import LayerTile from 'ol/layer/Tile';
import SourceOSM from 'ol/source/OSM';

import LayerSwitcher from 'ol-layerswitcher';

import sidebar from './sidebar-v2/js/ol3-sidebar.js';

// PROJECTION

proj4.defs('EPSG:3857', '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs');

// IMAGE EXTENT

var imageExtent = [952014.59, 5571269.68, 1272301.10, 5862273.22];

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
var esriBasemap = new ol.source.XYZ({
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

// define array of layer groups

var layer_groups = [
    basemap_group,
]

// VIEW

var view = new View({
    center: ol.extent.getCenter(imageExtent),
    zoom: 8
});

// MAP

var map = new Map({
    layers: layer_groups,
    target: 'map',
    view: view
});

// SIDEBAR

var sidebar = new ol.control.Sidebar({
    element: 'sidebar',
    position: 'left'
});

// OL-LAYERSWITCHER

// Get out-of-the-map div element with the ID "layers" and renders layers to it.
// NOTE: If the layers are changed outside of the layer switcher then you
// will need to call ol.control.LayerSwitcher.renderPanel again to refesh
// the layer tree. Style the tree via CSS.
var toc = document.getElementById("layers");
ol.control.LayerSwitcher.renderPanel(map, toc);

// add sidebar to map

map.addControl(sidebar);
