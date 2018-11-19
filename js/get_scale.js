
import {METERS_PER_UNIT} from 'ol/proj/Units.js';

// return current scale in map units according to DPI
function mapScale(map, dpi) {
    var unit = map.getView().getProjection().getUnits();
    var resolution = map.getView().getResolution();
    var inchesPerMetre = 39.37;
    return resolution * METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
}

export function getScale(map) {
    var device_px_ratio = window.devicePixelRatio;
    // log DPI to console
    console.log("DPI:" + device_px_ratio);
    // log scale in map units to console
    var dpi = device_px_ratio * 96;
    var current_scale = mapScale(map, dpi);
    console.log("1:" + current_scale);
    
    return current_scale;
}
