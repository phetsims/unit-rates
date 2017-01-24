// Copyright 2017, University of Colorado Boulder

/**
 * A container that holds 1 or more bags.
 * This is the base type for the shelf and scale.
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
  function BagContainer( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {Vector2} location of the center of the shelf's top face
      numberOfBags: 4, // {number} maximum number of bags on the shelf
      bagWidth: 70 // {number} width of each bag
    }, options );

    // @public (read-only)
    this.location = options.location;

    // @private manages the layout of Bags in the container
    this.rowLayout = new RowLayout( {
      location: this.location,
      numberOfObjects: options.numberOfBags,
      objectWidth: options.bagWidth
    } );
  }

  unitRates.register( 'BagContainer', BagContainer );

  return inherit( Object, BagContainer, {

    // @public
    reset: function() {
      this.rowLayout.reset();
    },

    /**
     * Gets the number of cells in the container.
     * @returns {number}
     * @public
     */
    getNumberOfCells: function() {
      return this.rowLayout.getNumberOfCells();
    },

    /**
     * Gets the index of the first unoccupied cell.
     * @returns {number} cell index
     * @public
     */
    getFirstUnoccupiedCell: function() {
      var cellIndex = this.rowLayout.getFirstUnoccupiedCell();
      assert && assert( cellIndex !== -1, 'shelf is full' );
      return cellIndex;
    },

    /**
     * Gets the index of the closet unoccupied cell.
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
     * Is this bag in this container?
     * @param {Bag} bag
     * @returns {boolean}
     * @public
     */
    containsBag: function( bag ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      return this.rowLayout.containsObject( bag );
    },

    /**
     * Is the specified cell empty?
     * @param index - cell index
     * @returns {boolean}
     * @public
     */
    isEmpty: function( index ) {
      return this.rowLayout.isEmpty( index );
    },

    /**
     * Gets the location of a specific cell.
     * @param {number} index - cell index
     * @returns {Vector2}
     * @public
     */
    getLocationAt: function( index ) {
      return this.rowLayout.getLocationAt( index );
    },

    /**
     * Gets the contents of a cell.
     * @param index - cell index
     * @returns {Bag|null}
     * @public
     */
    getContents: function( index ) {
      return this.rowLayout.getContents( index );
    },

    /**
     * Adds a bag to the shelf.
     * @param {Bag} bag
     * @param {number} index - cell index
     * @public
     */
    addBag: function( bag, index ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      this.rowLayout.setContents( index, bag );
    },

    /**
     * Removes a bag from the shelf.
     * @param {Bag} bag
     * @public
     */
    removeBag: function( bag ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
      this.rowLayout.removeObject( bag );
    }
  } );
} );
