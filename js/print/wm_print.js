import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
    FancyAlert
} from '../fancy_alert';

window.html2canvas = html2canvas;

export function print_map(map, exportButton, orientation, format, resolution, dims) {
    var loader = buildLoader();
    var legend = buildLegend();
    var print_alert = new FancyAlert(new XMLSerializer().serializeToString(loader), "info", "Printing...");
    exportButton.disabled = true;
    document.body.style.cursor = 'progress';
    var dim = dims[format];
    // convert page dimension from mm to px
    var pageWidth, pageHeight;
    if (orientation === 'p') {
        pageWidth = Math.round(dim[1] * resolution / 25.4);
        pageHeight = Math.round(dim[0] * resolution / 25.4);
    } else if (orientation === 'l') {
        pageWidth = Math.round(dim[0] * resolution / 25.4);
        pageHeight = Math.round(dim[1] * resolution / 25.4);
    }
    var size = /** @type {module:ol/size~Size} */ (map.getSize());
    var extent = map.getView().calculateExtent(size);
    
    map.once('rendercomplete', function(event) {
        var canvas = event.context.canvas;
        var data = canvas.toDataURL('image/jpeg');
        var pdf = new jsPDF(orientation, undefined, format);
        if (orientation === 'p') {
            pdf.addImage(data, 'JPEG', 0, 0, dim[1], dim[0]);
        } else if (orientation === 'l') {
            pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
        }
        // code to generate PDf from legend (UNCOMMENT WHEN READY!)
        /*
        pdf.html(legend, {
            callback: function () {
                window.open(pdf.output('bloburl'));
            }
        });
        */
        window.open(pdf.output('bloburl'));
        // pdf.save('map.pdf');
        // Reset original map size
        map.setSize(size);
        map.getView().fit(extent, {
            size: size,
            constrainResolution: false});
        exportButton.disabled = false;
        document.body.style.cursor = 'auto';
        print_alert.closeAlert();
    });
    
    // Set print size
    var printSize = [pageWidth, pageHeight];
    map.setSize(printSize);
    map.getView().fit(extent, {size: printSize});
}

function buildLoader(){
    var loader = document.createElement('div');
    loader.className = "loader";
    
    return loader
}

function buildLegend() {
    // function to build the legend from the layers symbols
    var legend = document.createElement("TABLE");
    var legend_items = document.getElementsByClassName("lyr_symbol");
    for (var i = 0, len = legend_items.length; i < len; ++i) {
        var tr = document.createElement("TR");
        var td = document.createElement("TD");
        var img = document.createElement("IMG");
        img.src = legend_items[i].src;
        td.appendChild(img);
        tr.appendChild(td);
        legend.appendChild(tr);
    }

    return legend;
}

