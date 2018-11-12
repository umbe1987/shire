import { getScale } from './get_scale';

export function greyoutLayers(ol_layers, class_layers, map) {
    // for each layer class in the document
    for (var i = 0, len_i = class_layers.length; i < len_i; ++i) {
        var class_lyr = class_layers[i];
        var elem_name = class_lyr.innerText;
        // for each OL layer in the map
        for (var j = 0, len_j = ol_layers.length; j < len_j; ++j) {
            var current_layer = ol_layers[j];
            var layer_title = current_layer.values_["title"];
            // if class layer name equals ol layer title
            if (elem_name === layer_title) {
                // ignore basemaps (type === 'TILE')
                if (current_layer.type === 'IMAGE') {
                    // get current map scale
                    var current_scale = getScale(map);
                    // if layer MaxScaleDenominator is higher than current map scale
                    if (current_layer.max_scale_den < current_scale) {
                        // get lyr_class firstChild which is <input>
                        var input_child = class_lyr.firstChild;
                        input_child.disabled = true;
                    }
                }
            }
        }
    }
}
