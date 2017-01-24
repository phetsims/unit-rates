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
  var Bag = require( 'UNIT_RATES/shopping/model/Bag' );
  var RowLayout = require( 'UNIT_RATES/shopping/model/RowLayout' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Property.<number>} options
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

    // @private manages the layout of objects on the scale
    this.rowLayout = new RowLayout( {
      location: this.location,
      numberOfObjects: options.numberOfBags,
      objectWidth: options.bagWidth
    } );

    // When unit rate changes, update the cost
    var unitRateObserver = function( unitRate ){
      var cost = 0;
      var numberOfCells = self.rowLayout.getNumberOfCells();
      for ( var i = 0; i < numberOfCells; i++ ) {
        var bag = self.rowLayout.getContents( i );
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

  return inherit( Object, Scale, {

    // @public
    dispose: function() {
     this.disposeScale();
    },

    // @public
    reset: function() {
      this.costProperty.reset();
      this.quantityProperty.reset();
      this.rowLayout.reset();
    },
    
    //TODO identical to Shelf
    /**
     * Gets the index of the first unoccupied cell on the scale.
     * @returns {number} cell index
     * @public
     */
    getFirstUnoccupiedCell: function() {
      var cellIndex = this.rowLayout.getFirstUnoccupiedCell();
      assert && assert( cellIndex !== -1, 'shelf is full' );
      return cellIndex;
    },
    
    //TODO identical to Shelf
    /**
     * Gets the index of the closet unoccupied cell on the shelf.
     * @param {Vector2} location
     * @returns {number} cell index
     * @public
     */
    getClosestUnoccupiedCell: function( location ) {
      var cellIndex = this.rowLayout.getClosestUnoccupiedCell( location );
      assert && assert( cellIndex !== -1, 'shelf is full' );
      return cellIndex;
    },

    //TODO identical to Shelf
    /**
     * Gets the location of a cell.
     * @param {number} index - cell index
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( index ) {
      return this.rowLayout.getLocationAt( index );
    },

    //TODO identical to Shelf
    /**
     * Is this bag on the shelf?
     * @param {Bag} bag
     * @returns {boolean}
     */
    containsBag: function( bag ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      return this.rowLayout.containsObject( bag );
    },

    //TODO identical to Shelf
    /**
     * Is the specified cell empty?
     * @param index - cell index
     * @returns {boolean}
     */
    isEmpty: function( index ) {
      return this.rowLayout.isEmpty( index );
    },

    //TODO identical to Shelf
    /**
     * Gets the location of a specific cell.
     * @param {number} index - cell index
     * @returns {Vector2}
     */
    getLocationAt: function( index ) {
      return this.rowLayout.getLocationAt( index );
    },
    
    //TODO some of this is identical to Shelf
    /**
     * Adds a bag to the shelf.
     * @param {Bag} bag
     * @param {number} index - cell index
     */
    addBag: function( bag, index ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      this.rowLayout.setContents( index, bag );
      this.costProperty.value += bag.unitsPerBag * this.unitRateProperty.value;
      this.quantityProperty.value += bag.unitsPerBag;
    },

    //TODO some of this is identical to Shelf
    /**
     * Removes a bag from the shelf.
     * @param {Bag} bag
     */
    removeBag: function( bag ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      this.rowLayout.removeObject( bag );
      this.costProperty.value -= bag.unitsPerBag * this.unitRateProperty.value;
      this.quantityProperty.value -= bag.unitsPerBag;
    }
  } );
} );
