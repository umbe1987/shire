import {
    CORS_PREFIX
} from '../init';
import {
    FancyAlert
} from '../fancy_alert';

import WMSCapabilities from 'ol/format/WMSCapabilities';
import LayerGroup from 'ol/layer/Group';
import ImageWMS from 'ol/source/ImageWMS';
import LayerImage from 'ol/layer/Image';
import {
    transformExtent
} from 'ol/proj.js';

// WMS PARSER (https://bl.ocks.org/ThomasG77/5f9e62d3adeb5602d230a6eacbb9c443)
// async call to get a parseable txt response from a WMS url (using 'ol.format.WMSCapabilities()')
// (async function always return a Promise)
async function getWMSResponse(url) {
    try {
        var parser = new WMSCapabilities();
        // fetch return a Promise
        var getCapabilities_suffix = 'SERVICE=WMS&REQUEST=GetCapabilities';
        var compositeRequest = CORS_PREFIX + url + getCapabilities_suffix;
        // remove white spaces
        var response = await fetch(compositeRequest.replace(" ", ""));
        var text = await response.text();
        return parser.read(text);
    } catch (e) {
        console.log(e);
        return null;
    }
}

// function to let OL handle WMS exceptions (https://stackoverflow.com/a/29790150/1979665)
function imageLoadFunction(image, src) {
    var img = image.getImage();
    if (typeof window.btoa == 'function') {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', CORS_PREFIX + src, true);
        xhr.setRequestHeader("Access-Control-Allow-Headers", "origin,x-requested-with");
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e) {
            if (this.status == 200) {
                var uInt8Array = new Uint8Array(this.response);
                var i = uInt8Array.length;
                var binaryString = new Array(i);
                while (i--) {
                    binaryString[i] = String.fromCharCode(uInt8Array[i]);
                }
                var data = binaryString.join('');
                var type = xhr.getResponseHeader('content-type');
                if (type.indexOf('image') === 0) {
                    img.src = 'data:' + type + ';base64,' + window.btoa(data);
                } else { // HANDLE WMS EXCEPTIONS
                    var exceptionAsText = String.fromCharCode.apply(null, uInt8Array);
                    // as console.error
                    console.error(exceptionAsText);
                    // as fancy alerts
                    new FancyAlert(exceptionAsText, "error");
                }
            } else {
                alert(Error(this.statusText));
            }
        };
        xhr.send();
    } else {
        img.onerror = function() {
            alert(Error());
        };
        img.src = src;
    }
};

// Get layers objects from a WMS parser
// (async function always return a Promise)
export async function getWMSLayers(url) {
    try {
        var wms_parser = await getWMSResponse(url);
        var layers = wms_parser.Capability.Layer;
        return [layers];
    } catch (e) {
        console.log(e);
        return null;
    }
}

// get layers and grouprlayers from getWMSLayers
export function getLayers(layers, url, map) {
    // if there is at least one layer
    if (layers) {
        // get projection code from view
        var view_projection = map.getView().getProjection().getCode();
        let wms_layers = [];
        for (let i = 0, len = layers.length; i < len; i++) {
            let lyr = layers[i];

            // check if current layer has CRS array
            if (lyr.hasOwnProperty('CRS')) {
                // if it includes view CRS, then use it as lys CRS as well
                if (lyr.CRS.includes(view_projection)) {
                    var crs = view_projection;
                // otherwise use the first CRS in the array
                } else {
                    var crs = lyr.CRS[0];
                }
            }

            // check if current layer has Max/Min ScaleDenominator property
            if (lyr.hasOwnProperty('MaxScaleDenominator')) {
                // if MaxScaleDenominator is not undefined
                if (lyr.MaxScaleDenominator) {
                    var max_scale_den = lyr.MaxScaleDenominator;
                }
            }

            if (lyr.hasOwnProperty('MinScaleDenominator')) {
                // if MinScaleDenominator is not undefined
                if (lyr.MinScaleDenominator) {
                    var min_scale_den = lyr.MinScaleDenominator;
                }
            }

            // name of ith layer
            let layer_name = lyr.Name;
            // title of ith layer
            let layer_title = lyr.Title;
            // check if this is a group layer
            if (lyr.Layer) {
                let sublayers = getLayers(lyr.Layer, url, map);
                let ith_group = new LayerGroup({
                    title: layer_title,
                    fold: 'open',
                    layers: sublayers,
                });
                wms_layers.push(ith_group);
            } else {
                let layer_extent = lyr.EX_GeographicBoundingBox; // always in geographic WGS84
                let layer_extent_proj = transformExtent(layer_extent, 'EPSG:4326', view_projection);
                let source = new ImageWMS({
                    url: url,
                    projection: crs,
                    params: {
                        'LAYERS': layer_name, // 'FAKE' (to test exceptions)
                        'FORMAT': 'image/png',
                    },
                });
                // log message in case of error event
                source.on('imageloaderror', function(event) {
                    console.log('imageloaderror event fired');
                });
                source.setImageLoadFunction(imageLoadFunction);
                let ith_lyr = new LayerImage({
                    name: layer_name, // needed by GetLegendGraphic
                    title: layer_title, // needed by layerswitcher
                    visible: true,
                    source: source,
                    extent: layer_extent_proj,
                    minscaledenominator: min_scale_den,
                    maxscaledenominator: max_scale_den,
                });
                wms_layers.push(ith_lyr);
            }
        }
        return wms_layers;
    } else {
        return
    }
}
