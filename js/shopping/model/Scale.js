// Copyright 2017, University of Colorado Boulder

/**
 * Model of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var BagContainer = require( 'UNIT_RATES/shopping/model/BagContainer' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function Scale( unitRateProperty, options ) {

    options = _.extend( {

      // BagContainer options
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the scale's top surface
      numberOfBags: 4, // {number} maximum number of bags on the scale
      bagWidth: 70, // {number} width of each bag

      // Scale options
      width: 300, // {number} width of the top surface of the scale
      quantityUnits: '' // {string} units for quantity

    }, options );

    var self = this;

    // @public ( read-only)
    this.location = options.location;
    this.width = options.width;
    this.quantityUnits = options.quantityUnits;

    // @public
    this.quantityProperty = new Property( 0 );

    // @public dispose required
    this.costProperty = new DerivedProperty( [ this.quantityProperty, unitRateProperty ],
      function( quantity, unitRate ) {
        return quantity * unitRate;
      } );

    BagContainer.call( this, options );

    // @private
    this.disposeScale = function() {
      self.costProperty.dispose();
    };
  }

  unitRates.register( 'Scale', Scale );

  return inherit( BagContainer, Scale, {

    // @public
    dispose: function() {
     this.disposeScale();
    },

    // @public
    reset: function() {
      BagContainer.prototype.reset.call( this );
      this.quantityProperty.reset();
    },
    
    /**
     * Adds a bag to the scale.
     * @param {Bag} bag
     * @param {number} index - cell index
     * @public
     * @override
     */
    addBag: function( bag, index ) {

      // add to the container
      BagContainer.prototype.addBag.call( this, bag, index );

      // update quantity
      this.quantityProperty.value += bag.unitsPerBag;
    },

    /**
     * Removes a bag from the scale.
     * @param {Bag} bag
     * @public
     * @override
     */
    removeBag: function( bag ) {

      // remove from the container
      BagContainer.prototype.removeBag.call( this, bag );

      // update quantity
      this.quantityProperty.value -= bag.unitsPerBag;
    }
  } );
} );
