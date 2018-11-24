import {
    renderLegend
} from './render_legend';
import {
    updateSlider
} from './opacity_slider';
import {
    zoomIcon, ZoomToExtent
} from './zoom_to_extent';
import {
    greyoutLayers
} from './greyout_layers';
import LayerSwitcher from 'ol-layerswitcher';


export function updateToc(map, ol_layers, layer_class, zoom_icons, sliders, toc, toc_height=false) {
    if (toc_height === false) {
        toc_height = toc.scrollHeight;
    }
    toc.style.height = toc_height + 'px';

    // RENDER LAYERSWITCHER
    LayerSwitcher.renderPanel(map, toc);

    // ZOOM TO LAYER EXTENT
    // add zoom icon
    zoomIcon(layer_class);
    ZoomToExtent(zoom_icons, ol_layers, map.getView());

    // RENDER LEGEND
    renderLegend(ol_layers, layer_class);

    // DRAW OPACITY SLIDER
    updateSlider(sliders, ol_layers, layer_class);

    // GREY OUT LAYERS ACCORDING TO MIN AND MAX SCALE DENOMINATOR
    greyoutLayers(ol_layers, layer_class, map);

    return toc_height;
}
