import { insertAfter } from './init';
import {
    CORS_PREFIX
} from './init';

// ADD LEGEND TO TOC

export function renderLegend(ol_layers, class_layers) {
    // get layer names to build lgend request
    for (var i = 0; i < class_layers.length; ++i) {
        var class_elem = class_layers[i];
        var elem_name = class_layers[i].innerText;
        for (var j = 0; j < ol_layers.length; ++j) {
            var layer_name = ol_layers[j].values_["name"];
            var layer_title = ol_layers[j].values_["title"];
            if (elem_name === layer_title) {
                // create new li element
                var lyr = ol_layers[j];
                var li_elem = document.createElement("LI");
                // build GetLegendGraphics request
                // ignore basemaps (type === 'TILE')
                if (lyr.type === 'IMAGE') {
                    var img_url = lyr.get('source').url_;
                    img_url += 'service=WMS&request=GetLegendGraphic&version=1.3.0&format=image/png&sld_version=1.1.0&layer=';
                    img_url += layer_name;
                    // create img elem and add legend url
                    var img_elem = document.createElement("IMG");
                    img_elem.setAttribute("src", img_url);
                    // add img elem to li elem
                    li_elem.appendChild(img_elem);
                    // add li with layer legend after layer li
                    insertAfter(li_elem, class_elem);
                }
            }
        }
    }
}
