import { insertAfter } from './init';

// ADD OPACITY SLIDER TO EACH OPERATIONAL LAYER

export function opacitySlider(ol_layers, class_layers) {
    // draw slider under each layer in the toc
    for (var j = 0, len_j = ol_layers.length; j < len_j; ++j) {
        var current_layer = ol_layers[j];
        // ignore basemaps (type === 'TILE')
        if (current_layer.type === 'IMAGE') {
            var layer_title = current_layer.values_["title"];
            for (var i = 0, len_i = class_layers.length; i < len_i; ++i) {
                var class_elem = class_layers[i];
                var elem_name = class_layers[i].innerText;
                if (elem_name === layer_title) {
                    // create new li element
                    var li_elem = document.createElement("LI");
                    // create slider input elem
                    var input_slider = document.createElement("INPUT");
                    input_slider.setAttribute("class", "slider");
                    input_slider.setAttribute("type", "range");
                    input_slider.setAttribute("min", "0.0");
                    input_slider.setAttribute("max", "1.0");
                    input_slider.setAttribute("value", "1.0");
                    input_slider.setAttribute("step", "0.1");
                    // set id of slider elem to layer_title
                    input_slider.setAttribute("id", layer_title);
                    // add slider input to li elem
                    li_elem.appendChild(input_slider);
                    // add li with layer legend after layer li
                    insertAfter(li_elem, class_elem);
                    changeOpacity(input_slider, ol_layers);

                    break;
                }
            }
        }
    }
}

function changeOpacity(slider_elem, ol_layers) {
    slider_elem.oninput = function() {
        for (var i = 0, len = ol_layers.length; i < len; ++i) {
            var lyr = ol_layers[i];
            if (lyr.get('title') === this.id) {
                lyr.setProperties({opacity: this.value});
            }
        }
    }
}