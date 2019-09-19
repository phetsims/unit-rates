// Copyright 2017, University of Colorado Boulder

/**
 * Model of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const DerivedProperty = require( 'AXON/DerivedProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ShoppingContainer = require( 'UNIT_RATES/shopping/model/ShoppingContainer' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function Scale( unitRateProperty, options ) {

    const self = this;

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
      backRowYOffset: -4, // // {number} offset of items back row from scale origin
      frontRowYOffset: 12 // // {number} offset of items front row from scale origin

    }, options );

    ShoppingContainer.call( this, options );

    // @public (read-only)
    this.quantityUnits = options.quantityUnits;

    // @public (read-only) description of pseudo-3D shape
    this.width = 350; // {number} diameter of the top platter
    this.height = 60; // {number} height of the front face
    this.depth = 45; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 30; // {number} offset for parallel perspective, after flattening to 2D

    // @public (read-only) any y value less than this is considered "above the scale"
    // Offset determined empirically, see https://github.com/phetsims/unit-rates/issues/174
    this.yAboveScale = this.location.y + 70;

    // @public
    this.quantityUpdateEnabled = true;

    // @public dispose not required, exists for sim lifetime
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

    // @public dispose not required, exists for sim lifetime
    this.costProperty = new DerivedProperty( [ this.quantityProperty, unitRateProperty ],
      function( quantity, unitRate ) {
        return quantity * unitRate;
      } );
  }

  unitRates.register( 'Scale', Scale );

  return inherit( ShoppingContainer, Scale );
} );
