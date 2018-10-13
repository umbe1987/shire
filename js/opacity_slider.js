import { insertAfter } from './init';

// ADD OPACITY SLIDER TO EACH OPERATIONAL LAYER

export function opacitySlider(ol_layers, class_layers) {
    // draw slider under each layer in the toc
    for (var i = 0; i < class_layers.length; ++i) {
        var class_elem = class_layers[i];
        var elem_name = class_layers[i].innerText;
        for (var j = 0; j < ol_layers.length; ++j) {
            var layer_title = ol_layers[j].values_["title"];
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
            }
        }

    }
}

function changeOpacity(slider_elem, ol_layers) {
    slider_elem.oninput = function() {
        for (var i = 0; i < ol_layers.length; ++i) {
            var lyr = ol_layers[i];
            if (lyr.get('title') === this.id) {
                lyr.setProperties({opacity: this.value});
            }
        }
    }
}
