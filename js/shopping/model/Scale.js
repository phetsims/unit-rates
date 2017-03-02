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

      // MovableRow options (items)
      numberOfItems: 15, // {number} maximum number of items on the shelf
      itemSize: new Dimension2( 25, 25 ), // {number} dimensions of each item
      itemRowOverlap: 0 // {number} how much rows should overlap, so that items appear to touch when stacked

    }, options );

    var self = this;

    // @public (read-only)
    this.location = options.location;
    this.quantityUnits = options.quantityUnits;

    // @public (read-only) width of the top surface of the scale, specific to scale.png
    this.topWidth = 300;

    // @public row of bags
    this.bagRow = new MovableRow( {
      location: options.location,
      numberOfCells: options.numberOfBags,
      cellSize: options.bagSize,
      cellSpacing: 8
    } );

    // Top row has 1 less cell than bottom row,
    // because each cell in the top row will be centered above 2 adjacent cells in the bottom row.
    var numberOfBottomCells = Math.floor( options.numberOfItems / 2 ) + 1;
    var numberOfTopCells = options.numberOfItems - numberOfBottomCells;
    assert( numberOfBottomCells + numberOfTopCells === options.numberOfItems );

    // @public bottom row of items
    this.itemRowBottom = new MovableRow( {
      location: options.location,
      numberOfCells: numberOfBottomCells,
      cellSize: options.itemSize
    } );

    // @public top row of items
    this.itemRowTop = new MovableRow( {
      location: new Vector2( options.location.x, options.location.y - options.itemSize.height + options.itemRowOverlap ),
      numberOfCells: numberOfTopCells,
      cellSize: options.itemSize
    } );

    // @public
    this.quantityProperty = new DerivedProperty(
      [ this.bagRow.numberOfMovablesProperty, this.itemRowBottom.numberOfMovablesProperty, this.itemRowTop.numberOfMovablesProperty ],
      function( numberOfBags, numberOfItemsBottom, numberOfItemsTop ) {
        return ( numberOfBags * options.quantityPerBag ) + numberOfItemsBottom + numberOfItemsTop;
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
      this.itemRowBottom.reset();
      this.itemRowTop.reset();
    },

    // @public
    dispose: function() {
     this.disposeScale();
    }
  } );
} );
