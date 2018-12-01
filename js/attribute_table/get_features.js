import {
    WFS,
    GeoJSON
} from 'ol/format.js';

import {
    fancyAlert
} from '../fancy_alert';

/**
 * Tries to return all features for a single typename with
 * a getFeature request to a valid WFS.
 * @private
 * @param {string} url of the WFS
 * @param {string} typename of the single layer to request
 * @param {proj4} typename of the single layer to request (proj4)
 * @param {module:ol/format/filter/Filter~Filter} [filter=null] Filter condition
 */
export async function WFSfeatures(url, typename, projection, filter = null) {
    try {
        // generate a GetFeature request
        var featureRequest = new WFS().writeGetFeature({
            featureNS: 'http://www.qgis.org/gml',
            featureTypes: [typename],
            filter: filter,
        });

        // then post the request and add the received features to a layer
        var response = await fetch(url, {
            method: 'POST',
            body: new XMLSerializer().serializeToString(featureRequest),
        });
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
