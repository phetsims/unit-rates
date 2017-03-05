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
  var ShoppingContainer = require( 'UNIT_RATES/shopping/model/ShoppingContainer' );
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

      // ShoppingContainer options
      numberOfBags: 4, // {number} maximum number of bags on the scale
      bagSize: new Dimension2( 100, 100 ), // {number} dimensions of each bag
      quantityPerBag: 5, // {number} quantity in each bag
      bagRowYOffset: 5, // {number} offset of bag row from scale origin
      numberOfItems: 15, // {number} maximum number of items on the shelf
      itemSize: new Dimension2( 25, 25 ), // {number} dimensions of each item
      backRowYOffset: -10, // // {number} offset of items back row from scale origin
      frontRowYOffset: 10 // // {number} offset of items front row from scale origin

    }, options );

    ShoppingContainer.call( this, options );

    var self = this;

    // @public (read-only)
    this.quantityUnits = options.quantityUnits;

    // @public (read-only) description of pseudo-3D shape
    this.width = 350; // {number} diameter of the top platter
    this.height = 60; // {number} height of the front face
    this.depth = 45; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 30; // {number} offset for parallel perspective, after flattening to 2D

    // @public
    this.quantityUpdateEnabled = true;

    // @public
    this.quantityProperty = new DerivedProperty(
      [ this.numberOfBagsProperty, this.numberOfItemsProperty ],
      function( numberOfBags, numberOfItems ) {
        if ( self.quantityUpdateEnabled ) {
          return ( numberOfBags * options.quantityPerBag ) + numberOfItems;
        }
        else {
          return self.quantityProperty.value;
        }
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

  return inherit( ShoppingContainer, Scale, {

    // @public
    dispose: function() {
     this.disposeScale();
     ShoppingContainer.prototype.dispose.call( this );
    }
  } );
} );
