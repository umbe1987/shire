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
import {
    tableIcon, OpenTable
} from './attribute_table';
import LayerSwitcher from 'ol-layerswitcher';


export function updateToc(map, ol_layers, layer_class, zoom_icons, table_icons, sliders, toc, toc_scroll_x, toc_scroll_y) {
    // RENDER LAYERSWITCHER
    LayerSwitcher.renderPanel(map, toc);

    // ZOOM TO LAYER EXTENT
    // add zoom icon
    zoomIcon(layer_class);
    ZoomToExtent(zoom_icons, ol_layers, map.getView());

    // ATTRIBUTE TABLE
    tableIcon(layer_class);
    OpenTable(table_icons, ol_layers);

    // RENDER LEGEND
    renderLegend(ol_layers, layer_class);

    // DRAW OPACITY SLIDER
    updateSlider(sliders, ol_layers, layer_class);

    // GREY OUT LAYERS ACCORDING TO MIN AND MAX SCALE DENOMINATOR
    greyoutLayers(ol_layers, layer_class, map);

    // set former scroll position
    toc.scrollTo(toc_scroll_x, toc_scroll_y);

    // update scroll position
    toc_scroll_x = toc.scrollLeft;
	toc_scroll_y = toc.scrollTop;

    return [toc_scroll_x, toc_scroll_y];
}
