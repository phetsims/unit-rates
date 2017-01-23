// Copyright 2017, University of Colorado Boulder

/**
 * Model of the shelf.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var Bag = require( 'UNIT_RATES/shopping/model/Bag' );
  var RowLayout = require( 'UNIT_RATES/shopping/model/RowLayout' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function Shelf( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the shelf's top face
      width: 325, // {number} width of the top face, at its center
      numberOfBags: 4,
      bagWidth: 70
    }, options );

    // @public (read-only)
    this.location = options.location;
    this.width = options.width;
    this.height = 17; // {number} height of the front face
    this.depth = 20; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 15; // {number} offset for parallel perspective, after flattening to 2D

    // @private manages the layout of objects on the shelf
    this.rowLayout = new RowLayout( {
      centerX: this.location.x,
      numberOfObjects: options.numberOfBags,
      objectWidth: options.bagWidth
    } );
  }

  unitRates.register( 'Shelf', Shelf );

  return inherit( Object, Shelf, {

    // @public
    reset: function() {
      this.rowLayout.reset();
    },

    /**
     * Gets the index of the first unoccupied cell on the shelf.
     * @returns {Vector2}
     * @public
     */
    getIndexFirstUnoccupied: function() {
      var cellIndex = this.rowLayout.getIndexFirstUnoccupied();
      assert && assert( cellIndex !== -1, 'shelf is full' );
      return cellIndex;
    },

    /**
     * Gets the location of a cell.
     * @param {number} index
     * @returns {number}
     * @public
     */
    getLocationAt: function( index ) {
      return new Vector2( this.rowLayout.getXAt( index ), this.location.y );
    },

    /**
     * Adds a bag to the shelf.
     * @param {Bag} bag
     * @param {number} index - cell index
     */
    addBag: function( bag, index ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      this.rowLayout.setContents( index, bag );
    },

    /**
     * Removes a bag from the shelf.
     * @param {Bag} bag
     */
    removeBag: function( bag ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      var cellIndex = this.rowLayout.indexOf( bag );
      this.rowLayout.clearCell( cellIndex );
    },

    /**
     * Adds a shopping item to the shelf.
     * @param {ShoppingItem} shoppingItem
     * @param {number} index - cell index
     */
    addShoppingItem: function( shoppingItem, index ) {
      //TODO
    },

    /**
     * Removes a shopping item from the shelf.
     * @param {ShoppingItem} shoppingItem
     */
    removeShoppingItem: function( shoppingItem ) {
      //TODO
    }
  } );
} );