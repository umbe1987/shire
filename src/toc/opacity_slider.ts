import { insertAfter } from '../init';

// ADD OPACITY SLIDER TO EACH OPERATIONAL LAYER

export function opacitySlider(ol_layers, class_layers) {
    // to be called once at the application start (use 'updateSlider()' then)
    // initialize array to store sliders
    var sliders = [];
    // draw slider under each layer in the toc
    for (var j = 0, len_j = ol_layers.length; j < len_j; ++j) {
        var current_layer = ol_layers[j];
        // ignore basemaps (type === 'TILE')
        if (current_layer.type === 'IMAGE') {
            var layer_title = current_layer.values_["title"];
            for (var i = 0, len_i = class_layers.length; i < len_i; ++i) {
                var class_elem = class_layers[i];
                var elem_name = class_layers[i].innerText;
                if (elem_name.replace('\t','') === layer_title) {
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
                    // push current slider into sliders array
                    sliders.push(input_slider);

                    break;
                }
            }
        }
    }

    return sliders;
}

export function updateSlider(all_sliders, ol_layers, class_layers) {
    // updates slider with the actual opacity of the layers
    for (var i = 0, len_i = all_sliders.length; i < len_i; ++i) {
        var curr_slider = all_sliders[i];
        // get layer from ol_layers whose title is equal to current slider id
        // Find the value of the first element/object in the array, otherwise undefined is returned
        // (https://stackoverflow.com/a/13964186/1979665)
        var lyr = ol_layers.find(obj => {
            return obj.values_["title"] === curr_slider.getAttribute("id")
        });
        // get class_layer (layerswitcher) from class_layers whose title is equal to current slider id
        // (first we need to convert class_layers from HTMLCollection to array otherwise .find will fail)
        var class_layers_arr = Array.from(class_layers);
        var class_elem = class_layers_arr.find(obj => {
            return obj.innerHTML.includes(curr_slider.getAttribute("id"))
        });
        // get current layer opacity and set it as the value of current slider
        var curr_opacity = lyr.values_["opacity"];
        curr_slider.setAttribute("value", curr_opacity);
        // create new li element
        var li_elem = document.createElement("LI");
        // add slider input to li elem
        li_elem.appendChild(curr_slider);
        // add li with layer legend after layer li
        insertAfter(li_elem, class_elem);
        changeOpacity(curr_slider, ol_layers);
    }
}

function changeOpacity(slider_elem, ol_layers) {
    // attach 'oninput' event to slider
    slider_elem.oninput = function() {
        for (var i = 0, len = ol_layers.length; i < len; ++i) {
            var lyr = ol_layers[i];
            if (lyr.get('title') === this.id) {
                lyr.setProperties({opacity: this.value});
            }
        }
    }
}
