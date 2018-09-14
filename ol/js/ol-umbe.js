import Control from 'ol/control/Control';
import {METERS_PER_UNIT} from 'ol/proj/Units';
import {Observable} from 'ol/Observable';

//
// Define rotate to north control.
//


/**
* @constructor
* @extends {module:ol/control/Control~Control}
* @param {Object=} opt_options Control options.
*/

export default class ScaleBar extends Control {

    constructor(opt_options) {


        /**
        * Define a namespace for the application.
        */

        var options = opt_options || {};

        var element = document.createElement('div');

        super({element: element, target: options.target});

        this.mapListeners = [];

        element.className = 'ol-unselectable .ol-scale-bar';

        var this_ = this;

        this_.getMap().getView().on('propertychange', function(e) {
            switch (e.key) {
                case 'resolution':
                    // log DPI to console
                    console.log("DPI:" + window.devicePixelRatio);
                    // log scale in map units to console
                    console.log("1:" + mapScale(window.devicePixelRatio * 96));
                    break;
            }
        });
    };

    /**
    * Set the map instance the control is associated with.
    * @param {ol.Map} map The map instance.
    */
    setMap(map) {
        // Clean up listeners associated with the previous map
        for (var i = 0, key; i < this.mapListeners.length; i++) {
            Observable.unByKey(this.mapListeners[i]);
        }
        this.mapListeners.length = 0;
        // Wire up listeners etc. and store reference to new map
        super.setMap(map);
        if (map) {
            var this_ = this;
            this.mapListeners.push(map.on('propertychange', function(e) {
                switch (e.key) {
                    case 'resolution':
                        // log DPI to console
                        console.log("DPI:" + window.devicePixelRatio);
                        // log scale in map units to console
                        console.log("1:" + this_.mapScale(window.devicePixelRatio * 96));
                        break;
                }
            }));
        }
    }


    /**
    * Show the scale.
    */
    mapScale(dpi) {
        var unit = this_.getMap().getView().getProjection().getUnits();
        var resolution = this_.getMap().getView().getResolution();
        var inchesPerMetre = 39.37;

        return resolution * METERS_PER_UNIT[unit] * inchesPerMetre * dpi;
    };

};

// Expose ScaleBar as ol.control.ScaleBar if using a full build of
// OpenLayers
if (window.ol && window.ol.control) {
    window.ol.control.ScaleBar = ScaleBar;
}
