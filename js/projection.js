import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';

// To use other projections, you have to register the projection in OpenLayers.
// This can easily be done with [https://proj4js.org](proj4)
//
// By default OpenLayers does not know about the EPSG:XXXX projection.
// So we create a projection instance for EPSG:XXXXX and pass it to
// register to make it available to the library for lookup by its
// code.

export function registerProjection() {
    // ADD HERE THE DEFINITIONS YOU NEED!!!
    proj4.defs("EPSG:32632","+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
    
    register(proj4);
}
