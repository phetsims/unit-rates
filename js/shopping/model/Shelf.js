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
      numberOfBags: 4, // {number} maximum number of bags on the shelf
      bagWidth: 70 // {number} width of each bag
    }, options );

    // @public (read-only)
    this.location = options.location;
    this.width = options.width;
    this.height = 17; // {number} height of the front face
    this.depth = 20; // {number} depth, after flattening to 2D
    this.perspectiveXOffset = 15; // {number} offset for parallel perspective, after flattening to 2D

    // @private manages the layout of objects on the shelf
    this.rowLayout = new RowLayout( {
      location: this.location,
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
     * @returns {number} cell index
     * @public
     */
    getFirstUnoccupiedCell: function() {
      var cellIndex = this.rowLayout.getFirstUnoccupiedCell();
      assert && assert( cellIndex !== -1, 'shelf is full' );
      return cellIndex;
    },
    
    /**
     * Gets the index of the closest unoccupied cell on the shelf.
     * @param {Vector2} location
     * @returns {number} cell index
     * @public
     */
    getClosestUnoccupiedCell: function( location ) {
      var cellIndex = this.rowLayout.getClosestUnoccupiedCell( location );
      assert && assert( cellIndex !== -1, 'shelf is full' );
      return cellIndex;
    },

    /**
     * Gets the location of a cell.
     * @param {number} index - cell index
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( index ) {
      return this.rowLayout.getLocationAt( index );
    },

    /**
     * Is this bag on the shelf?
     * @param {Bag} bag
     * @returns {boolean}
     */
    containsBag: function( bag ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      return this.rowLayout.containsObject( bag );
    },

    /**
     * Is the specified cell empty?
     * @param index - cell index
     * @returns {boolean}
     */
    isEmpty: function( index ) {
      return this.rowLayout.isEmpty( index );
    },

    /**
     * Gets the location of a specific cell.
     * @param {number} index - cell index
     * @returns {Vector2}
     */
    getLocationAt: function( index ) {
      return this.rowLayout.getLocationAt( index );
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
      this.rowLayout.removeObject( bag );
    }
  } );
} );