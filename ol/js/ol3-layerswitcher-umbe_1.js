(function (root, factory) {
  if(typeof define === "function" && define.amd) {
    define(["openlayers"], factory);
  } else if(typeof module === "object" && module.exports) {
    module.exports = factory(require("openlayers"));
  } else {
    root.LayerSwitcher = factory(root.ol);
  }
}(this, function(ol) {
    /**
     * OpenLayers v3/v4 Layer Switcher Control.
     * See [the examples](./examples) for usage.
     * @constructor
     * @extends {ol.control.Control}
     */
    ol.control.LayerSwitcher = function() {

        this.hiddenClassName = 'ol-unselectable ol-control layer-switcher';

        var element = document.createElement('div');
        element.className = this.hiddenClassName;
		
		var this_ = this;
		$(function (e) {
			this_.showPanel();
		});

        ol.control.Control.call(this, {
            element: element,
        });

    };

    ol.inherits(ol.control.LayerSwitcher, ol.control.Control);
	
    /**
     * Show the layer panel.
     */
    ol.control.LayerSwitcher.prototype.showPanel = function() {
		this.element.classList.add(this.shownClassName);
		this.renderPanel();
    };

    /**
     * Re-draw the layer panel to represent the current state of the layers.
     */
    ol.control.LayerSwitcher.prototype.renderPanel = function() {

        this.ensureTopVisibleBaseLayerShown_();

        while(this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }

        var ul = document.createElement('ul');
        this.element.appendChild(ul);
        this.renderLayers_(this.getMap(), ul);

    };

    /**
     * Ensure only the top-most base layer is visible if more than one is visible.
     * @private
     */
    ol.control.LayerSwitcher.prototype.ensureTopVisibleBaseLayerShown_ = function() {
        var lastVisibleBaseLyr;
        ol.control.LayerSwitcher.forEachRecursive(this.getMap(), function(l, idx, a) {
            if (l.get('type') === 'base' && l.getVisible()) {
                lastVisibleBaseLyr = l;
            }
        });
        if (lastVisibleBaseLyr) this.setVisible_(lastVisibleBaseLyr, true);
    };

    /**
     * Toggle the visible state of a layer.
     * Takes care of hiding other layers in the same exclusive group if the layer
     * is toggle to visible.
     * @private
     * @param {ol.layer.Base} The layer whos visibility will be toggled.
     */
    ol.control.LayerSwitcher.prototype.setVisible_ = function(lyr, visible) {
        var map = this.getMap();
        lyr.setVisible(visible);
        if (visible && lyr.get('type') === 'base') {
            // Hide all other base layers regardless of grouping
            ol.control.LayerSwitcher.forEachRecursive(map, function(l, idx, a) {
                if (l != lyr && l.get('type') === 'base') {
                    l.setVisible(false);
                }
            });
        }
    };

    /**
     * Render all layers that are children of a group.
     * @private
     * @param {ol.layer.Base} lyr Layer to be rendered (should have a title property).
     * @param {Number} idx Position in parent group list.
     */
    ol.control.LayerSwitcher.prototype.renderLayer_ = function(lyr, idx) {

        var this_ = this;

        var li = document.createElement('li');

        var lyrTitle = lyr.get('title');
        var lyrId = ol.control.LayerSwitcher.uuid();

        var label = document.createElement('label');

        if (lyr.getLayers && !lyr.get('combine')) {

            li.className = 'group';
            label.innerHTML = lyrTitle;
            li.appendChild(label);
            var ul = document.createElement('ul');
            li.appendChild(ul);

            this.renderLayers_(lyr, ul);

        } else {

            li.className = 'layer';
            var input = document.createElement('input');
            if (lyr.get('type') === 'base') {
                input.type = 'radio';
                input.name = 'base';
            } else {
                input.type = 'checkbox';
            }
            input.id = lyrId;
            input.checked = lyr.get('visible');
            input.onchange = function(e) {
                this_.setVisible_(lyr, e.target.checked);
            };
            li.appendChild(input);

            label.htmlFor = lyrId;
            label.innerHTML = lyrTitle;

            var rsl = this.getMap().getView().getResolution();
            if (rsl > lyr.getMaxResolution() || rsl < lyr.getMinResolution()){
                label.className += ' disabled';
            }

            li.appendChild(label);

        }

        return li;

    };

    /**
     * Render all layers that are children of a group.
     * @private
     * @param {ol.layer.Group} lyr Group layer whos children will be rendered.
     * @param {Element} elm DOM element that children will be appended to.
     */
    ol.control.LayerSwitcher.prototype.renderLayers_ = function(lyr, elm) {
        var lyrs = lyr.getLayers().getArray().slice().reverse();
        for (var i = 0, l; i < lyrs.length; i++) {
            l = lyrs[i];
            if (l.get('title')) {
                elm.appendChild(this.renderLayer_(l, i));
            }
        }
    };

    /**
     * **Static** Call the supplied function for each layer in the passed layer group
     * recursing nested groups.
     * @param {ol.layer.Group} lyr The layer group to start iterating from.
     * @param {Function} fn Callback which will be called for each `ol.layer.Base`
     * found under `lyr`. The signature for `fn` is the same as `ol.Collection#forEach`
     */
    ol.control.LayerSwitcher.forEachRecursive = function(lyr, fn) {
        lyr.getLayers().forEach(function(lyr, idx, a) {
            fn(lyr, idx, a);
            if (lyr.getLayers) {
                ol.control.LayerSwitcher.forEachRecursive(lyr, fn);
            }
        });
    };

    /**
     * Generate a UUID
     * @returns {String} UUID
     *
     * Adapted from http://stackoverflow.com/a/2117523/526860
     */
    ol.control.LayerSwitcher.uuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }
    var LayerSwitcher = ol.control.LayerSwitcher;
    return LayerSwitcher;
}));
