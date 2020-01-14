import {
    WFS
} from 'ol/format.js';

import {
    FancyAlert
} from '../fancy_alert';

export function GetFeatureURL(url, typename, start_index) {
    // generate a GetFeature request
    // WARNING: MAXFEATURES set to 200 not to stress the server!!!
    // avoid geometry field with 'GEOMETRYNAME=none' (https://docs.qgis.org/testing/en/docs/user_manual/working_with_ogc/server/services.html#getfeature)
    url += "SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&MAXFEATURES=200&GEOMETRYNAME=none&";
    url = url + "TYPENAME=" + typename + "&";
    url = url + "STARTINDEX=" + start_index + "&";

    return url;
}

export async function tableArray(url, typename, feat_number) {
    // initialyze page numbers and iframe array
    var pNum = 0;
    var urlArr = [];
    // set maximum features allowed per page
    var featLimit = 200;
    var pTot = Math.ceil(feat_number / featLimit);
    var index = 0;
    for (let i = 0; i < pTot; ++i) {
        let gfc_url = GetFeatureURL(url, typename, index);
        if (gfc_url) {
            urlArr[pNum] = gfc_url;
            pNum += 1;
            index += featLimit;
        }
    }

    return [pNum, urlArr, index];
}

export async function buildTable(getfeature_url, typename, projection, index, filter = null) {
    // get all features from a single typename of a WFS
    var features = await WFSfeatures(getfeature_url, projection, filter)
    // get the FILEDS of the table from the first record (FIELDS are shared by each feature)
    var headers = Object.keys(features[0].values_);
    // initilaize rows for inserting the fileds' values
    var rows = [];

    // build the rows for the table, filling with the values from each field of each record
    for (var i = 0, len = features.length; i < len; ++i) {
        var row = features[i].values_;
        var rowToPush = [];
        // fill the single row and then push in the final table
        for (const key of Object.keys(row)) {
            rowToPush.push(row[key]);
        }
        rows.push(rowToPush);
    }

    return [headers, rows, getfeature_url];
}

export async function GetFeatureCount(url, typename) {
    // get total feature count
    url += "SERVICE=WFS&VERSION=1.1.0&REQUEST=GetFeature&RESULTTYPE=hits&";
    url = url + "TYPENAME=" + typename + "&";

    var response = await fetch(url);
    var text = await response.text();
    var feature_count = new WFS().readFeatureCollectionMetadata(text);

    return feature_count["numberOfFeatures"];
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
        new FancyAlert(error, "error");

        return null;
    }
}
