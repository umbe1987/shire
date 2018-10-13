import { insertAfter } from './init';

// ADD OPACITY SLIDER TO EACH OPERATIONAL LAYER

export function opacitySlider(class_layers) {
    // draw slider under each layer in the toc
    for (var i = 0; i < class_layers.length; ++i) {
        var class_elem = class_layers[i];
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
        // add slider input to li elem
        li_elem.appendChild(input_slider);
        // add li with layer legend after layer li
        insertAfter(li_elem, class_elem);
    }
}
