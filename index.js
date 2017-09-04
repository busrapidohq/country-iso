'use strict';

const PolygonLookup = require('polygon-lookup');

/**
 * Pre computes an R-Tree from the geojson file and uses the data future queries
 * geojson must be a valid GeoJson FeatureCollection.
 * Each feature must have a 'ISO_A3' as property
 * For an example @see {@link https://github.com/busrapidohq/world-countries-boundaries}
 * @param  {[type]} geojson a FeatureCollection
 * @return {[type]}         [description]
 */
module.exports.use = function (geojson) {
  this.worldGeojson = geojson;
  this.worldLookup = new PolygonLookup(this.worldGeojson);
};

/**
 * @param {Number} lat  latitude of the point
 * @param {Number} lng  longitude of the point
 * @returns an array of ISO 3166 alpha-3 country code for the geographic coordinates
 */
module.exports.get = function (lat, lng) {
  return new Promise((resolve, reject) => {
    if (this.worldGeojson === undefined) {
      reject(new Error('No geographical data loaded'));
    }
    const countries = this.worldLookup.search(lng, lat, -1);
    resolve(countries.features.map(f => f.properties.ISO_A3));
  });
};
