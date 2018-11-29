import {WFS, GeoJSON} from 'ol/format.js';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import {get as getProjection} from 'ol/proj';

export function testWFS() {

    // To use other projections, you have to register the projection in OpenLayers.
    // This can easily be done with [https://proj4js.org](proj4)
    //
    // By default OpenLayers does not know about the EPSG:21781 (Swiss) projection.
    // So we create a projection instance for EPSG:32632 and pass it to
    // register to make it available to the library for lookup by its
    // code.
    proj4.defs("EPSG:32632","+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs");
    register(proj4);

    var format, xmlDoc;
    const itaProjection = getProjection('EPSG:32632');

    var url = 'https://www.wondermap.it/cgi-bin/qgis_mapserv.fcgi?map=/home/ubuntu/qgis/projects/Demo_sci_WMS/demo_sci.qgs&SERVICE=WFS&REQUEST=Getfeature&TYPENAME=domini_sciabili,impianti_risalita,piste_sci';

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4) {
            format = new WFS({
                featureNS: 'http://www.qgis.org/gml',
            });
            xmlDoc = xmlhttp.response;
            console.log(xmlDoc)
            var features = format.readFeatures(
                xmlDoc,
                {
                    dataProjection:itaProjection,
                }
            );
            console.log(features)

        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

/*
    // generate a GetFeature request
    var featureRequest = new WFS().writeGetFeature({
        featureNS: 'http://www.qgis.org/gml',
        featureTypes: ['domini_sciabili'],
        srsName: 'EPSG:32632',
        outputFormat: 'text/xml; subtype=gml/3.1.1',
    });

    // then post the request and add the received features to a layer
    fetch(url, {
        method: 'POST',
        body: new XMLSerializer().serializeToString(featureRequest)
    }).then(function(response) {
        return response.text();
    }).then(function(text) {
        console.log('text');
        console.log(text);
        var features = new WFS().readFeatures(text);
        console.log(features);
        return features;
    });
}
*/
