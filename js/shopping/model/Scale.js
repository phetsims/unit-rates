// Copyright 2017, University of Colorado Boulder

/**
 * Model of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableRow = require( 'UNIT_RATES/shopping/model/MovableRow' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function Scale( unitRateProperty, options ) {

    options = _.extend( {

      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the scale's top surface
      quantityUnits: '', // {string} units for quantity

      // MovableRow options (bags)
      numberOfBags: 4, // {number} maximum number of bags on the scale
      bagSize: new Dimension2( 100, 100 ), // {number} dimensions of each bag
      quantityPerBag: 5, // {number} quantity in each bag
      bagRowYOffset: 5, // {number} offset of bag row from scale origin

      // MovableRow options (items)
      numberOfItems: 15, // {number} maximum number of items on the shelf
      itemSize: new Dimension2( 25, 25 ), // {number} dimensions of each item
      itemRowOffset: 10 // // {number} offset of item rows from scale origin

    }, options );

    var self = this;

    // @public (read-only)
    this.location = options.location;
    this.quantityUnits = options.quantityUnits;

    // @public (read-only) width of the top surface of the scale, specific to scale.png
    this.width = 350;
    this.height = 60; // {number} height of the front face
    this.depth = 45; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 30; // {number} offset for parallel perspective, after flattening to 2D

    var bagRowLocation = new Vector2( options.location.x, options.location.y + options.bagRowYOffset );
    var backRowLocation =  new Vector2( options.location.x, options.location.y - options.itemRowOffset );
    var frontRowLocation =  new Vector2( options.location.x, options.location.y + options.itemRowOffset );

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

    // @public
    this.quantityProperty = new DerivedProperty(
      [ this.bagRow.numberOfMovablesProperty, this.itemRowBack.numberOfMovablesProperty, this.itemRowFront.numberOfMovablesProperty ],
      function( numberOfBags, numberOfItemsBack, numberOfItemsFront ) {
        return ( numberOfBags * options.quantityPerBag ) + numberOfItemsBack + numberOfItemsFront;
      } );

    // @public dispose required
    this.costProperty = new DerivedProperty( [ this.quantityProperty, unitRateProperty ],
      function( quantity, unitRate ) {
        return quantity * unitRate;
      } );

    // @private
    this.disposeScale = function() {
      self.quantityProperty.dispose();
      self.costProperty.dispose();
    };
  }

  unitRates.register( 'Scale', Scale );

  return inherit( Object, Scale, {

    // @public
    reset: function() {
      this.bagRow.reset();
      this.itemRowBack.reset();
      this.itemRowFront.reset();
    },

    // @public
    dispose: function() {
     this.disposeScale();
    }
  } );
} );
