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
  var ObjectRow = require( 'UNIT_RATES/shopping/model/ObjectRow' );
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

      // ObjectRow options (bags)
      numberOfBags: 4, // {number} maximum number of bags on the scale
      bagSize: new Dimension2( 100, 100 ), // {number} dimensions of each bag
      quantityPerBag: 5, // {number} quantity in each bag

      // ObjectRow options (items)
      numberOfItems: 15, // {number} maximum number of items on the shelf
      itemSize: new Dimension2( 25, 25 ) // {number} dimensions of each item

    }, options );

    var self = this;

    // @public (read-only)
    this.location = options.location;
    this.quantityUnits = options.quantityUnits;

    // @public (read-only) width of the top surface of the scale, specific to scale.png
    this.topWidth = 300;

    // @public row of bags
    this.bagRow = new ObjectRow( {
      location: options.location,
      numberOfCells: options.numberOfBags,
      cellSize: options.bagSize,
      cellSpacing: 8
    } );

    // @public row of items
    this.itemRow = new ObjectRow( {
      location: options.location,
      numberOfCells: options.numberOfItems,
      cellSize: options.itemSize
    } );

    // @public
    this.quantityProperty = new DerivedProperty(
      [ this.bagRow.numberOfObjectsProperty, this.itemRow.numberOfObjectsProperty ],
      function( numberOfBags, numberOfShoppingItems ) {
        return ( numberOfBags * options.quantityPerBag ) + numberOfShoppingItems;
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
      this.itemRow.reset();
    },

    // @public
    dispose: function() {
     this.disposeScale();
    }
  } );
} );
