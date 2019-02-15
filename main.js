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
import LayerGroup from 'ol/layer/Group';
import LayerImage from 'ol/layer/Image';
import LayerTile from 'ol/layer/Tile';
import SourceOSM from 'ol/source/OSM';
import SourceXYZ from 'ol/source/XYZ';
import {defaults as defaultControls, Attribution} from 'ol/control.js';

import Sidebar from './external/sidebar-v2/js/ol5-sidebar';

import LayerSwitcher from 'ol-layerswitcher';

// WONDERMAP IMPORTS
// generic imports
import {
    EPSG32632, JD, toggleTitle
} from './js/init';

// ToC imports
import * as WmsParser from './js/toc/wms_parser';
import {
    getInfo
} from './js/get_info';
import {
    getOLLayers
} from './js/ol_layers';
import {
    userLocation
} from './js/user_position';
import {
    updateToc
} from './js/toc/update_toc';
import {
    opacitySlider
} from './js/toc/opacity_slider';

// Attribute Table imports
import {
    testWFS
} from './js/attribute_table/build_table';

// Print imports
import {
    print_map
} from './js/print/wm_print';

// TOGGLE TITLE BAR
toggleTitle();

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
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
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

// SET ATTRIBUTION CONTROL (SINCE OL v5.3.0)
var attribution = new Attribution({
    collapsible: false
});

// SET VIEW EXTENT
var extent = [1029056, 5759179, 1178602, 5890239];

// VIEW

var view = new View({
    extent: extent, // this will constrain where the user can navigate!
    center: [1103837, 5830388],
    minZoom: 8,
});

// MAP

var map = new Map({
    layers: basemap_group,
    target: 'map',
    view: view,
    controls: defaultControls({attribution: false}).extend([attribution]),
});

// fit the view to a given extent (for more responsiveness)
view.fit(extent);

// SIDEBAR
var sidebar = new Sidebar({
    element: 'sidebar',
    position: 'left'
});

// When the map gets too small (<600px) because of a resize, the attribution will be collapsed
function checkSize() {
    var small = map.getSize()[0] < 600;
    attribution.setCollapsible(small);
    attribution.setCollapsed(small);
}

window.addEventListener('resize', checkSize);
checkSize();

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

function checkSize() {
    var small = map.getSize()[0] < 600;
    attribution.setCollapsible(small);
    attribution.setCollapsed(small);
}

// PRINT (https://openlayers.org/en/latest/examples/export-pdf.html)
var dims = {
    a0: [1189, 841],
    a1: [841, 594],
    a2: [594, 420],
    a3: [420, 297],
    a4: [297, 210],
    a5: [210, 148]
};
var exportButton = document.getElementById("export-pdf");
var format = document.getElementById("format").value;
var resolution = document.getElementById('resolution').value;

function onPrintBtnClick() {
    print_map(map, exportButton, format, resolution, dims);
};

exportButton.addEventListener('click', onPrintBtnClick, false);

// WMS/WFS URL
var service_url = 'https://www.wondermap.it/cgi-bin/qgis_mapserv.fcgi?map=/home/ubuntu/qgis/projects/Demo_sci_WMS/demo_sci.qgs&';

// When the user clicks anywhere outside of a dropdown button, close the drodown
// (https://www.w3schools.com/howto/howto_js_dropdown.asp)
window.addEventListener('click',function(event) {
    var matches = event.target.matches ? event.target.matches('.dropbtn') : event.target.msMatchesSelector('.dropbtn');
    if (!matches) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.className.indexOf("show") > -1) {
                openDropdown.classList.remove('show');
            }
        }
    }
});

// Parse WMS Capabilities to retrieve layers and build the ToC
WmsParser.getWMSLayers(service_url).then(wms_layers => {
    // OPERATIONAL LAYERS
    var operational_layers = WmsParser.getLayers(wms_layers, service_url, map);

    // add layers to map and re-render layerswitcher to show them
    map.addLayer(operational_layers[0]);

    // rerender layerswitcher to add the operational layers
    LayerSwitcher.renderPanel(map, toc);

    // array of ol layers in the map (excluding groups)
    var ol_layers = getOLLayers(map.getLayerGroup());

    // get HTML elements with "layer" class
    var layer_class = document.getElementsByClassName("layer");

    // add onclick event listener to zoom icons
    var zoom_icons = document.getElementsByClassName("fa-search-plus");

    // add onclick event listener to table icons
    var table_icons = document.getElementsByClassName("fa-table");

    // initialize the opacity sliders
    var input_sliders = opacitySlider(ol_layers, layer_class);

    // DRAW THE COMPONENTS OF THE TOC
    // initialize empty array to store toc scroll [x, y] position
    var toc_scroll = [];
    toc_scroll = updateToc(map, EPSG32632, ol_layers, layer_class, zoom_icons, table_icons, input_sliders, toc, 0, 0);

    function onResolutionChange() {
        if (map.getView().getAnimating()) {
            return;
        }
        toc_scroll[0] = toc.scrollLeft; // toc horizontal position
        toc_scroll[1] = toc.scrollTop; // toc vertical position
        toc_scroll = updateToc(map, EPSG32632, ol_layers, layer_class, zoom_icons, table_icons, input_sliders, toc, toc_scroll[0], toc_scroll[1]);
    }

    map.getView().on('change:resolution', JD.debounce(onResolutionChange, 400));

    // DISPLAY INFO ONCLICK
    map.on('singleclick', function(evt) {
        // display info in fancyAlert
        getInfo(evt, view, ol_layers);
    })
});
