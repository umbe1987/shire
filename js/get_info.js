import {
    CORS_PREFIX
} from './init';

// get url for GetFeatureInfo request
export function getInfoUrl(evt, view, lyr) {
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
