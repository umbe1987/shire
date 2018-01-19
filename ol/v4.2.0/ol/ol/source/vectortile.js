goog.provide('ol.source.VectorTile');

goog.require('ol');
goog.require('ol.TileState');
goog.require('ol.VectorImageTile');
goog.require('ol.VectorTile');
goog.require('ol.proj');
goog.require('ol.size');
goog.require('ol.tilegrid');
goog.require('ol.source.UrlTile');


/**
 * @classdesc
 * Class for layer sources providing vector data divided into a tile grid, to be
 * used with {@link ol.layer.VectorTile}. Although this source receives tiles
 * with vector features from the server, it is not meant for feature editing.
 * Features are optimized for rendering, their geometries are clipped at or near
 * tile boundaries and simplified for a view resolution. See
 * {@link ol.source.Vector} for vector sources that are suitable for feature
 * editing.
 *
 * @constructor
 * @fires ol.source.Tile.Event
 * @extends {ol.source.UrlTile}
 * @param {olx.source.VectorTileOptions} options Vector tile options.
 * @api
 */
ol.source.VectorTile = function(options) {

  ol.source.UrlTile.call(this, {
    attributions: options.attributions,
    cacheSize: options.cacheSize !== undefined ? options.cacheSize : 128,
    extent: options.extent,
    logo: options.logo,
    opaque: false,
    projection: options.projection,
    state: options.state,
    tileGrid: options.tileGrid,
    tileLoadFunction: options.tileLoadFunction ?
        options.tileLoadFunction : ol.VectorImageTile.defaultLoadFunction,
    tileUrlFunction: options.tileUrlFunction,
    tilePixelRatio: options.tilePixelRatio,
    url: options.url,
    urls: options.urls,
    wrapX: options.wrapX === undefined ? true : options.wrapX
  });

  /**
   * @private
   * @type {ol.format.Feature}
   */
  this.format_ = options.format ? options.format : null;

  /**
   * @private
   * @type {Object.<string,ol.VectorTile>}
   */
  this.sourceTiles_ = {};

  /**
   * @private
   * @type {boolean}
   */
  this.overlaps_ = options.overlaps == undefined ? true : options.overlaps;

  /**
   * @protected
   * @type {function(new: ol.VectorTile, ol.TileCoord, ol.TileState, string,
   *        ol.format.Feature, ol.TileLoadFunctionType)}
   */
  this.tileClass = options.tileClass ? options.tileClass : ol.VectorTile;

  /**
   * @private
   * @type {Object.<string,ol.tilegrid.TileGrid>}
   */
  this.tileGrids_ = {};

  if (!this.tileGrid) {
    this.tileGrid = this.getTileGridForProjection(ol.proj.get(options.projection || 'EPSG:3857'));
  }

};
ol.inherits(ol.source.VectorTile, ol.source.UrlTile);


/**
 * @return {boolean} The source can have overlapping geometries.
 */
ol.source.VectorTile.prototype.getOverlaps = function() {
  return this.overlaps_;
};


/**
 * @inheritDoc
 */
ol.source.VectorTile.prototype.getTile = function(z, x, y, pixelRatio, projection) {
  var tileCoordKey = this.getKeyZXY(z, x, y);
  if (this.tileCache.containsKey(tileCoordKey)) {
    return /** @type {!ol.Tile} */ (this.tileCache.get(tileCoordKey));
  } else {
    var tileCoord = [z, x, y];
    var urlTileCoord = this.getTileCoordForTileUrlFunction(
        tileCoord, projection);
    var tileUrl = urlTileCoord ?
        this.tileUrlFunction(urlTileCoord, pixelRatio, projection) : undefined;
    var tile = new ol.VectorImageTile(
        tileCoord,
        tileUrl !== undefined ? ol.TileState.IDLE : ol.TileState.EMPTY,
        tileUrl !== undefined ? tileUrl : '',
        this.format_, this.tileLoadFunction, urlTileCoord, this.tileUrlFunction,
        this.tileGrid, this.getTileGridForProjection(projection),
        this.sourceTiles_, pixelRatio, projection, this.tileClass,
        this.handleTileChange.bind(this));

    this.tileCache.set(tileCoordKey, tile);
    return tile;
  }
};


/**
 * @inheritDoc
 */
ol.source.VectorTile.prototype.getTileGridForProjection = function(projection) {
  var code = projection.getCode();
  var tileGrid = this.tileGrids_[code];
  if (!tileGrid) {
    // A tile grid that matches the tile size of the source tile grid is more
    // likely to have 1:1 relationships between source tiles and rendered tiles.
    var sourceTileGrid = this.tileGrid;
    tileGrid = this.tileGrids_[code] = ol.tilegrid.createForProjection(projection, undefined,
        sourceTileGrid ? sourceTileGrid.getTileSize(sourceTileGrid.getMinZoom()) : undefined);
  }
  return tileGrid;
};


/**
 * @inheritDoc
 */
ol.source.VectorTile.prototype.getTilePixelRatio = function(opt_pixelRatio) {
  return opt_pixelRatio == undefined ?
      ol.source.UrlTile.prototype.getTilePixelRatio.call(this, opt_pixelRatio) :
      opt_pixelRatio;
};


/**
 * @inheritDoc
 */
ol.source.VectorTile.prototype.getTilePixelSize = function(z, pixelRatio, projection) {
  var tileSize = ol.size.toSize(this.getTileGridForProjection(projection).getTileSize(z));
  return [Math.round(tileSize[0] * pixelRatio), Math.round(tileSize[1] * pixelRatio)];
};
