import {
    getSiblings
} from '../init';
import {
    fancyAlert
} from '../fancy_alert';
import {
    buildTable, drawTable
} from '../attribute_table/build_table';

// add table icon after "elem"
export function tableIcon(class_layers) {
    for (var i = 0, len = class_layers.length; i < len; ++i) {
        var elem = class_layers[i];
        // avoid adding table to base layers
        if (elem.firstChild.getAttribute("name") !== "base") {
            var span = document.createElement("SPAN");
            span.classList.add("fas", "fa-table");
            elem.appendChild(span);
        }
    }

}

export function OpenTable(table_icons, ol_layers, projection) {
    for (let i = 0, len = table_icons.length; i < len; ++i) {
        table_icons[i].addEventListener('click', fn, false);
    }

    function fn(evt) {
        var siblings = getSiblings(evt.target);
        for (var i = 0, len_i = siblings.length; i < len_i; ++i) {
            var sibling = siblings[i];
            if (sibling.nodeName === "LABEL") {
                // name of layer within label tag
                var layer_title = sibling.textContent;
                // loop through ol layers
                for (var j = 0, len_j = ol_layers.length; j < len_j; ++j) {
                    var lyr = ol_layers[j];
                    // if ol layer name corresponds to label layer name, open its table
                    if (lyr.get("title") === layer_title.replace('\t','')) {
                        // get WMS-WFS base URI
                        var url = lyr.get("source")["url_"]
                        // generate headers and record values of the attr table
                        var rows = buildTable(url, lyr.get("name"), projection);
                        var headers = rows[0];
                        var rows = rows[1];
                        // then draw it!
                        var attr_table = drawTable(headers, rows);
                        fancyAlert(attr_table, "info");
                    }
                }
            }
        }
    }
}
