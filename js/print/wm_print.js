export function print_map(map, exportButton, format, resolution, dims) {
    exportButton.disabled = true;
    document.body.style.cursor = 'progress';
    var dim = dims[format];
    var width = Math.round(dim[0] * resolution / 25.4);
    var height = Math.round(dim[1] * resolution / 25.4);
    var size = /** @type {module:ol/size~Size} */ (map.getSize());
    var extent = map.getView().calculateExtent(size);
    
    map.once('rendercomplete', function(event) {
        var canvas = event.context.canvas;
        var data = canvas.toDataURL('image/jpeg');
        var pdf = new jsPDF('landscape', undefined, format);
        pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
        pdf.save('map.pdf');
        // Reset original map size
        map.setSize(size);
        map.getView().fit(extent, {size: size});
        exportButton.disabled = false;
        document.body.style.cursor = 'auto';
    });
    
    // Set print size
    var printSize = [width, height];
    map.setSize(printSize);
    map.getView().fit(extent, {size: printSize});
}