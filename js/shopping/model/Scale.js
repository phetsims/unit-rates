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
   * @param {Object} [options]
   * @constructor
   */
  function Scale( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the scale's top surface
      width: 300, // {number} width of the top surface of the scale
      quantityUnits: '', // {string} units for quantity
      numberOfBags: 4, // {number} maximum number of bags on the scale
      bagWidth: 70 // {number} width of each bag
    }, options );

    // @public ( read-only)
    this.location = options.location;
    this.width = options.width;
    this.quantityUnits = options.quantityUnits;

    // @public
    this.costProperty = new Property( 0 );
    this.quantityProperty = new Property( 0 );

    // @private manages the layout of objects on the scale
    this.rowLayout = new RowLayout( {
      centerX: this.location.x,
      numberOfObjects: options.numberOfBags,
      objectWidth: options.bagWidth
    } );
  }

  unitRates.register( 'Scale', Scale );

  return inherit( Object, Scale, {

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
     * @param {number} x - x coordinate
     * @returns {number} cell index
     * @public
     */
    getClosestUnoccupiedCell: function( x ) {
      var cellIndex = this.rowLayout.getClosestUnoccupiedCell( x );
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
      return new Vector2( this.rowLayout.getXAt( index ), this.location.y );
    },
    
    //TODO identical to Shelf
    /**
     * Adds a bag to the shelf.
     * @param {Bag} bag
     * @param {number} index - cell index
     */
    addBag: function( bag, index ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      this.rowLayout.setContents( index, bag );
    },

    //TODO identical to Shelf
    /**
     * Removes a bag from the shelf.
     * @param {Bag} bag
     */
    removeBag: function( bag ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      var cellIndex = this.rowLayout.indexOf( bag );
      this.rowLayout.clearCell( cellIndex );
    }
  } );
} );
