import {
    WFS,
    GeoJSON
} from 'ol/format.js';

import {
    fancyAlert
} from '../fancy_alert';

export function GetFeatureURL(url, typename) {
    // generate a GetFeature request
    url += "SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&";
    url = url + "TYPENAME=" + typename + "&";

    return url;
}

/**
 * Tries to return all features for a single typename with
 * a getFeature request to a valid WFS.
 * @private
 * @param {string} url of the WFS
 * @param {string} typename of the single layer to request
 * @param {proj4} typename of the single layer to request (proj4)
 * @param {module:ol/format/filter/Filter~Filter} [filter=null] Filter condition
 */
export async function WFSfeatures(getfeature_request, projection, filter = null) {
    try {
        var response = await fetch(getfeature_request);
        var text = await response.text();
        var features = new WFS().readFeatures(text, {
            dataProjection: projection,
        });

        return features;

    } catch (error) { // HANDLE WFS EXCEPTIONS
        // as console.error
        console.error(error);
        // as fancy alerts
        fancyAlert(error, "error");

        return null;
    }
}
