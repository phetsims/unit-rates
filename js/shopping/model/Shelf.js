// Copyright 2017, University of Colorado Boulder

//TODO lots of duplication between Shelf and Scale
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
  var MovableRow = require( 'UNIT_RATES/shopping/model/MovableRow' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Shelf( options ) {

    options = _.extend( {

      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the shelf's top face

      // MovableRow options (bags)
      numberOfBags: 4, // {number} maximum number of bags on the shelf
      bagSize: new Dimension2( 100, 100 ), // {number} dimensions of each bag
      bagRowYOffset: 0, // {number} offset of bag row from shelf origin

      // MovableRow options (items)
      numberOfItems: 15, // {number} maximum number of items on the shelf
      itemSize: new Dimension2( 25, 25 ), // {number} dimensions of each item
      itemRowYOffset: 8 // {number} offset of item rows from shelf origin

    }, options );

    // @public (read-only)
    this.location = options.location;
    this.width = 350; // {number} width of the top face, at its center
    this.height = 15; // {number} height of the front face
    this.depth = 45; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 30; // {number} offset for parallel perspective, after flattening to 2D

    //TODO only move bags back if , making it easier to grab bags with fruit in front
    var bagRowLocation = new Vector2( options.location.x, options.location.y + options.bagRowYOffset );
    var backRowLocation =  new Vector2( options.location.x, options.location.y + options.itemRowYOffset );
    var frontRowLocation =  new Vector2( options.location.x, backRowLocation.y + options.itemRowYOffset );

    // @public row of bags
    this.bagRow = new MovableRow( {
      location: bagRowLocation,
      numberOfCells: options.numberOfBags,
      cellSize: options.bagSize,
      cellSpacing: 8
    } );

    // Back row has 1 more cell than front row
    var numberOfCellsBack = Math.floor( options.numberOfItems / 2 ) + 1;
    var numberOfCellsFront = options.numberOfItems - numberOfCellsBack;
    assert && assert( numberOfCellsBack + numberOfCellsFront === options.numberOfItems );

    var itemCellSpacing = 8;

    // @public back row of items
    this.itemRowBack = new MovableRow( {
      location: backRowLocation,
      numberOfCells: numberOfCellsBack,
      cellSize: options.itemSize,
      cellSpacing: itemCellSpacing
    } );

    // @public front row of items
    this.itemRowFront = new MovableRow( {
      location: frontRowLocation,
      numberOfCells: numberOfCellsFront,
      cellSize: options.itemSize,
      cellSpacing: itemCellSpacing
    } );
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( Object, Shelf, {

    // @public
    reset: function() {
      this.bagRow.reset();
      this.itemRowBack.reset();
      this.itemRowFront.reset();
    }
  } );
} );