import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';

// To use other projections, you have to register the projection in OpenLayers.
// This can easily be done with [https://proj4js.org](proj4)
//
// By default OpenLayers does not know about the EPSG:21781 (Swiss) projection.
// So we create a projection instance for EPSG:XXXXX and pass it to
// register to make it available to the library for lookup by its
// code.
proj4.defs("EPSG:32632","+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
register(proj4);
export const EPSG32632 = getProjection('EPSG:32632');

export const CORS_PREFIX = '';

// Insert an element after another (https://stackoverflow.com/a/4793630/1979665)
export function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

export function getSiblings(elem) {
    var siblings = elem.parentNode.childNodes;

    return siblings;
}
