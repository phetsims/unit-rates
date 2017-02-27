// Copyright 2017, University of Colorado Boulder

/**
 * Model of the shelf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ObjectRow = require( 'UNIT_RATES/shopping/model/ObjectRow' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Shelf( options ) {

    options = _.extend( {

      // ObjectRow options
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the shelf's top face
      numberOfBags: 4, // {number} maximum number of bags on the shelf
      bagSize: new Dimension2( 100, 100 ), // {number} dimensions of each bag

      // Shelf options
      width: 325 // {number} width of the top face, at its center

    }, options );

    // @public (read-only)
    this.location = options.location;
    this.width = options.width;
    this.height = 17; // {number} height of the front face
    this.depth = 20; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 15; // {number} offset for parallel perspective, after flattening to 2D

    // @public the container for bags
    this.bagRow = new ObjectRow( {
      location: options.location,
      numberOfCells: options.numberOfBags,
      cellSize: options.bagSize
    } );
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( Object, Shelf, {

    // @public
    reset: function() {
      this.bagRow.reset();
    }
  } );
} );