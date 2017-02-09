// Copyright 2017, University of Colorado Boulder

/**
 * Model of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var BagContainer = require( 'UNIT_RATES/shopping/model/BagContainer' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

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

    // @private
    this.unitRateProperty = unitRateProperty;

    // @public ( read-only)
    this.location = options.location;
    this.width = options.width;
    this.quantityUnits = options.quantityUnits;

    // @public
    this.costProperty = new Property( 0 );
    this.quantityProperty = new Property( 0 );

    BagContainer.call( this, options );

    // When unit rate changes, update the cost
    var unitRateObserver = function( unitRate ){
      var cost = 0;
      var numberOfCells = self.getNumberOfCells();
      for ( var i = 0; i < numberOfCells; i++ ) {
        var bag = self.getBagAt( i );
        if ( bag ) {
          cost += bag.unitsPerBag * unitRate;
        }
      }
      self.costProperty.value = cost;
    };
    this.unitRateProperty.link( unitRateObserver ); // unlink in dispose

    // @private
    this.disposeScale = function() {
      unitRateProperty.unlink( unitRateObserver );
    };
  }

  unitRates.register( 'Scale', Scale );

  return inherit( BagContainer, Scale, {

    // @public
    dispose: function() {
     this.disposeScale();
      BagContainer.prototype.dispose && BagContainer.prototype.dispose.call( this );
    },

    // @public
    reset: function() {
      BagContainer.prototype.reset.call( this );
      this.costProperty.reset();
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

      // update cost and quantity
      this.costProperty.value += bag.unitsPerBag * this.unitRateProperty.value;
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

      // update cost and quantity
      this.costProperty.value -= bag.unitsPerBag * this.unitRateProperty.value;
      this.quantityProperty.value -= bag.unitsPerBag;
    }
  } );
} );
