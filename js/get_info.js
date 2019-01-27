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
    if (lyr.get('type') != 'base') {
        var visible = lyr.getVisible();
        if (visible) {
            url += lyr.get('source').getGetFeatureInfoUrl(evt.coordinate, viewResolution, 'EPSG:3857', {
                'INFO_FORMAT': 'text/html'
            });
            return url;
        }
    }
}

export function getInfo(evt, view, ol_layers) {
    // display info in fancyAlert at map's 'singleclick' events
    for (let i = 0; i < ol_layers.length; ++i) {
        let layer = ol_layers[i];
        let text = getInfoUrl(evt, view, layer);
        if (text) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText.indexOf('</TABLE>') != this.responseText.lastIndexOf('</TABLE>')) {
                        fancyAlert(this.responseText, 'info', 'Layer Info');
                    }
                }
            };
            xhttp.open("GET", text, true);
            xhttp.send();
        }
    }
}
