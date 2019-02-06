import {
    CORS_PREFIX
    } from './init';
import {
    fancyAlert
} from './fancy_alert';

// get url for GetFeatureInfo request
function getInfoUrl(evt, view, lyr) {
    var coordinate = evt.coordinate;
    var url = CORS_PREFIX;
    var viewResolution = /** @type {number} */ (view.getResolution());
    url += lyr.get('source').getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {
        'INFO_FORMAT': 'text/html'
    });

    return url;
}

// https://stackoverflow.com/a/53897629/1979665
function getHTML(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'document';
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                resolve(xhr.response.documentElement.innerHTML);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
}

export async function getInfo(evt, view, ol_layers) {
    // display info in fancyAlert at map's 'singleclick' events
    for (let i = 0; i < ol_layers.length; ++i) {
        let layer = ol_layers[i];
        // only get info for operational layers
        if (layer.get('type') != 'base') {
            // only get info for ovisible layers
            var visible = layer.getVisible();
            if (visible) {
                let gfi_url = getInfoUrl(evt, view, layer);
                if (gfi_url) {
                    var remoteCode = await getHTML(gfi_url);
                    if (remoteCode.indexOf('</table>') != remoteCode.lastIndexOf('</table>')) {
                        fancyAlert(remoteCode, 'info', 'Layer Info');
                    }
                }
            }
        }
    }
}
