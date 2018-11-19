import { getScale } from './get_scale';

export function greyoutLayers(ol_layers, class_layers, map) {
    // this function needs to be called whenever zoom changes
    // (i.e. map.getView().on('propertychange', function(e) {switch (e.key) {case 'resolution':...}})
    // for each OL layer in the map
    for (var j = 0, len_j = ol_layers.length; j < len_j; ++j) {
        var current_layer = ol_layers[j];
        // ignore basemaps (type === 'TILE')
        if (current_layer.type === 'IMAGE') {
            var layer_title = current_layer.values_["title"];
            // for each layer class in the document
            for (var i = 0, len_i = class_layers.length; i < len_i; ++i) {
                var class_lyr = class_layers[i];
                // get lyr_class firstChild which is <input>
                var input_child = class_lyr.firstChild;
                // if class layer name equals ol layer title
                var elem_name = class_lyr.innerText;
                if (elem_name.replace('\t','') === layer_title) {
                    // get current map scale
                    var current_scale = getScale(map);
                    console.log("1:" + current_layer.values_["maxscaledenominator"]);
                    // if layer MaxScaleDenominator is higher than current map scale
                    if (current_scale > current_layer.values_["maxscaledenominator"] || current_scale < current_layer.values_["minscaledenominator"]) {
                        input_child.disabled = true;
                    } else {
                        input_child.disabled = false;
                    }

                    break;
                }
            }
        }
    }
}
