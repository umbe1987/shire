import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Point from 'ol/geom/Point.js';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import {
    Circle as CircleStyle,
    Fill,
    Stroke,
    Style
} from 'ol/style.js';

export function userLocation(id, map, view) {
    // GEOLOCATION (https://openlayers.org/en/latest/examples/geolocation.html)
    var geolocation = new Geolocation({
        projection: view.getProjection()
    });

    var el = document.getElementById(id);

    el.addEventListener('change', function() {
        geolocation.setTracking(this.checked);
    });

    // handle geolocation error
    geolocation.on('error', function(error) {
        var location_err = document.getElementById('location_err');
        location_err.innerHTML = error.message;
        location_err.style.display = '';
    });

    // render position feature
    var positionFeature = new Feature();
    positionFeature.setStyle(new Style({
        image: new CircleStyle({
            radius: 6,
            fill: new Fill({
                color: '#3399CC'
            }),
            stroke: new Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));

    geolocation.on('change:position', function() {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ?
            new Point(coordinates) : null);
    });

    // add position feature to map
    new VectorLayer({
        map: map,
        source: new VectorSource({
            features: [positionFeature]
        })
    });
}
