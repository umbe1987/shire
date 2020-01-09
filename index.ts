// CSS imports
import 'ol/ol.css';
import 'sidebar-v2/css/ol3-sidebar.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import './css/ol-umbe.css';

// JS imports
import 'whatwg-fetch'; // A window.fetch JavaScript polyfill.

import 'babel-polyfill'; // babel-polyfill package


import Map from 'ol/Map';
import View from 'ol/View';
import LayerGroup from 'ol/layer/Group';
import LayerTile from 'ol/layer/Tile';
import SourceOSM from 'ol/source/OSM';
import { defaults as defaultControls, Attribution, ScaleLine } from 'ol/control.js';

import Sidebar from 'sidebar-v2/js/ol5-sidebar';

import LayerSwitcher from 'ol-layerswitcher';

// WONDERMAP IMPORTS
// generic imports
import {
    JD, toggleTitle
} from './src/init';

// ToC imports
import * as WmsParser from './src/toc/wms_parser';
import {
    getInfo
} from './src/get_info';
import {
    getOLLayers
} from './src/ol_layers';
import {
    userLocation
} from './src/user_position';
import {
    updateToc
} from './src/toc/update_toc';
import {
    opacitySlider
} from './src/toc/opacity_slider';

// Print imports
import {
    print_map
} from './src/print/wm_print';

// CORS ANYWHERE

// https://github.com/Rob--W/cors-anywhere/#client
(function () {
    var cors_api_host = 'cors-anywhere.herokuapp.com';
    var cors_api_url = 'https://' + cors_api_host + '/';
    var slice = [].slice;
    var origin = window.location.protocol + '//' + window.location.host;
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        var args = slice.call(arguments);
        var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1]);
        if (targetOrigin && targetOrigin[0].toLowerCase() !== origin &&
            targetOrigin[1] !== cors_api_host) {
            args[1] = cors_api_url + args[1];
        }
        return open.apply(this, args);
    };
})();

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

// Blank Basemap
var basemap2 = new LayerTile({
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

// SCALE LINE

var scaleLineControl = new ScaleLine();

// MAP

var map = new Map({
    layers: basemap_group,
    target: 'map',
    view: view,
    controls: defaultControls({
        attribution: false,
    }).extend([
        attribution,
        scaleLineControl,
    ]),
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

function onPrintBtnClick() {
    var format = (<HTMLInputElement>document.getElementById("format")).value;
    var orientation = (<HTMLInputElement>document.getElementById("orientation")).value;
    var resolution = (<HTMLInputElement>document.getElementById("resolution")).value;
    print_map(map, exportButton, orientation, format, resolution, dims);
};

exportButton.addEventListener('click', onPrintBtnClick, false);

// WMS/WFS URL
// var service_url = 'https://www.wondermap.it/cgi-bin/qgis_mapserv.fcgi?map=/home/ubuntu/qgis/projects/Demo_sci_WMS/demo_sci.qgs&';

// When the user clicks anywhere outside of a dropdown button, close the drodown
// (https://www.w3schools.com/howto/howto_js_dropdown.asp)
window.addEventListener('click', function (event) {
    var matches = event.target.matches ? event.target.matches('.wm-btn') : event.target.msMatchesSelector('.wm-btn');
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
// service_url is a global var defined in map.php before calling this js!
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
    var toc_scroll = [0, 0];
    toc_scroll = updateToc(map, ol_layers, layer_class, zoom_icons, table_icons, input_sliders, toc, toc_scroll[0], toc_scroll[1]);

    function drawToc(toc_scroll, layer_switcher = false) {
        
        if (layer_switcher) {
            LayerSwitcher.renderPanel(map, toc);
        }
        toc_scroll = updateToc(map, ol_layers, layer_class, zoom_icons, table_icons, input_sliders, toc, toc_scroll[0], toc_scroll[1]);
    }

    var currZoom = map.getView().getZoom();

    // redraw the toc whenever the zoom changes
    map.on('moveend', function (e) {
        var newZoom = map.getView().getZoom();
        if (currZoom != newZoom) {
            drawToc();
            currZoom = newZoom;
        }
    });

    // get toc scroll position whenever layerswitcher starts rendering
    toc.addEventListener("render", function () {
        console.log("RENDENRING LAYERSWITCHER");
        toc_scroll[0] = toc.scrollLeft; // toc horizontal position
        toc_scroll[1] = toc.scrollTop; // toc vertical position
    });

    // redraw the toc whenever layerswitcher has finished rendering
    toc.addEventListener("rendercomplete", function () {
        console.log("RENDER COMPLETED");
        drawToc(toc_scroll);
    });

    // DISPLAY INFO ONCLICK
    map.on('singleclick', function (evt) {
        // display info in fancyAlert
        getInfo(evt, view, ol_layers);
    })
});
