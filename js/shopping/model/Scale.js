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
  var RowLayout = require( 'UNIT_RATES/shopping/model/RowLayout' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function Scale( unitRateProperty, options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the scale's top surface
      width: 300, // {number} width of the top surface of the scale
      quantityUnits: '', // {string} units for quantity
      numberOfBags: 4, // {number} maximum number of bags on the scale
      bagWidth: 70 // {number} width of each bag
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

    RowLayout.call( this, {
      location: options.location,
      numberOfObjects: options.numberOfBags,
      objectWidth: options.bagWidth
    } );

    // When unit rate changes, update the cost
    var unitRateObserver = function( unitRate ){
      var cost = 0;
      var numberOfCells = self.getNumberOfCells();
      for ( var i = 0; i < numberOfCells; i++ ) {
        var bag = self.getContents( i );
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

  return inherit( RowLayout, Scale, {

    // @public
    dispose: function() {
     this.disposeScale();
    },

    // @public
    reset: function() {
      RowLayout.prototype.reset.call( this );
      this.costProperty.reset();
      this.quantityProperty.reset();
    },
    
    /**
     * Adds a bag to the shelf.
     * @param {Bag} bag
     * @param {number} index - cell index
     * @public
     * @override
     */
    setContents: function( index, bag ) {

      // add to the container
      RowLayout.prototype.setContents.call( this, index, bag );

      // update cost and quantity
      this.costProperty.value += bag.unitsPerBag * this.unitRateProperty.value;
      this.quantityProperty.value += bag.unitsPerBag;
    },

    /**
     * Removes a bag from the shelf.
     * @param {Bag} bag
     * @public
     * @override
     */
    removeObject: function( bag ) {

      // remove from the container
      RowLayout.prototype.removeObject.call( this, bag );

      // update cost and quantity
      this.costProperty.value -= bag.unitsPerBag * this.unitRateProperty.value;
      this.quantityProperty.value -= bag.unitsPerBag;
    }
  } );
} );
