import LayerGroup from 'ol/layer/Group';

// check if layer is a ol.layer.Group (return BOOLEAN)
function isGroup(layer) {
    if (layer instanceof LayerGroup) {
        return true;
    } else {
        return false;
    }
}

// get layers in a group
export function getOLLayers(group) {
    let ol_layers = [];

    // get single layer
    function getOLLayer(layer, lyr_array) {
        if (isGroup(layer)) {
            let layers = layer.getLayers().getArray();
            for (let i = 0; i < layers.length; ++i) {
                getOLLayer(layers[i], lyr_array);
            }
        } else {
            lyr_array.push(layer);

            return;
        }
    }
    let layers = group.getLayers().getArray();
    for (let i = 0; i < layers.length; ++i) {
        let lyr = getOLLayer(layers[i], ol_layers);
    }
    return ol_layers;
}
