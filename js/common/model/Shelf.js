// Copyright 2017, University of Colorado Boulder

/**
 * Model of the shelf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Shelf( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ) // {Vector2} location of the center of the shelf's top face
    }, options );

    // @public (read-only)
    this.location = options.location;
    this.width = 356; // {number} width of the front face
    this.height = 17; // {number} height of the front face
    this.depth = 20; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 25; // {number} offset for parallel perspective, after flattening to 2D

    //TODO
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( Object, Shelf, {

    // @public
    reset: function() {
      //TODO
    }
  } );
} );