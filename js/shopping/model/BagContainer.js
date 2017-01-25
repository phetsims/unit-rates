// Copyright 2017, University of Colorado Boulder

/**
 * BagContainer is the base type for the shelf and scale. It handles the layout of bags in a row.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var Bag = require( 'UNIT_RATES/shopping/model/Bag' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var EMPTY = null; // contents of an empty cell

  /**
   * @param {Object} [options]
   * @constructor
   */
  function BagContainer( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {number} center of the row
      numberOfBags: 4, // {number} maximum number of bags in the row
      bagWidth: 70, // {number} width of each bag
      bagSpacing: 8 // {number} horizontal space between bags
    }, options );

    // @public (read-only)
    this.location = options.location;

    // distance between the centers of adjacent cells
    var deltaX = options.bagWidth + options.bagSpacing;

    // distance between the centers of the left-most and right-most cells
    var leftToRightDistance = deltaX * ( options.numberOfBags - 1 );

    // center of left-most cell
    var leftX = options.location.x - ( leftToRightDistance / 2 );
    
    // @private the row's cells.
    // Each cell contains a data structure with this format:
    // {Bag|null} bag - the bag that occupies the cell, null if the cell is empty
    // {Vector} location - center of the cell
    this.cells = [];
    for ( var i = 0; i < options.numberOfBags; i++ ) {
      this.cells.push( {
        bag: EMPTY,
        location: new Vector2( leftX + ( i * deltaX ), options.location.y )
      } );
    }
  }

  unitRates.register( 'BagContainer', BagContainer );

  return inherit( Object, BagContainer, {

    // @public
    reset: function() {

      // empty all cells
      this.cells.forEach( function( cell ) {
        cell.bag = EMPTY;
      } );
    },

    /**
     * Gets the number of cells.
     * @returns {number}
     * @public
     */
    getNumberOfCells: function() {
       return this.cells.length;
    },

    /**
     * Gets the index of the first unoccupied cell. Cells are visited left to right.
     * @returns {number} - cell index, -1 if all cells are occupied
     * @public
     */
    getFirstUnoccupiedCell: function() {
      var index = -1;
      for ( var i = 0; i < this.cells.length; i++ ) {
        if ( this.isEmpty( i ) ) {
          index = i;
          break;
        }
      }
      return index;
    },

    /**
     * Gets the index of the closest unoccupied cell.
     * @param {Vector2} location
     * @returns {number} - cell index, -1 if all cells are occupied
     * @public
     */
    getClosestUnoccupiedCell: function( location ) {
      var index = this.getFirstUnoccupiedCell();
      if ( index !== -1 ) {
        for ( var i = index + 1; i < this.cells.length; i++ ) {
          if ( this.isEmpty( i ) ) {
            if ( this.getDistanceBetween( i, location ) < this.getDistanceBetween( index, location ) ) {
              index = i;
            }
            else {
              break;
            }
          }
        }
      }
      return index;
    },

    /**
     * Gets the distance between a cell and a location.
     * @param {number} index - the cell index
     * @param {Vector2} location
     * @returns {number}
     * @public
     */
    getDistanceBetween: function( index, location ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      return this.getLocationAt( index ).distance( location );
    },

    /**
     * Puts a bag in the specified cell.  The cell must be empty, and duplicates are not allowed in a row.
     * @param {Bag} bag
     * @param {number} index - the cell index
     * @public
     */
    addBag: function( bag, index ) {
      assert && assert( this.isValidBag( bag ), 'invalid bag' );
      assert && assert( !this.contains( bag ), 'bag is already in row at index ' + this.indexOf( bag ) );
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( this.isEmpty( index ), 'cell is occupied: ' + index );
      this.cells[ index ].bag = bag;
    },

    /**
     * Removes a bag from the container.
     * @param {Bag} bag
     * @public
     */
    removeBag: function( bag ) {
      assert && assert( this.isValidBag( bag ), 'invalid bag' );
      this.clearCell( this.indexOf( bag ) );
    },

    /**
     * Gets the bag that occupies a cell.
     * @param {number} index - the cell index
     * @returns {Bag|null} - null if the cell is empty
     * @public
     */
    getBagAt: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      return this.cells[ index ].bag;
    },

    /**
     * Clears the specified cell. The cell must be occupied.
     * @param {number} index - the cell index
     * @public
     */
    clearCell: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( !this.isEmpty( index ), 'cell is empty: ' + index );
      this.cells[ index ].bag = EMPTY;
    },

    /**
     * Gets the location of a cell.
     * @param {number} index - the cell index
     * @returns {Vector2}
     * @public
     */
    getLocationAt: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      return this.cells[ index ].location;
    },

    /**
     * Gets the index of the cell that is occupied by a specified bag.
     * @param {Bag} bag
     * @returns {number} -1 if the bag is not found
     * @public
     */
    indexOf: function( bag ) {
      assert && assert( this.isValidBag( bag ), 'invalid bag' );
      var index = -1;
      for ( var i = 0; i < this.cells.length; i++ ) {
        if ( this.getBagAt( i ) === bag ) {
          index = i;
          break;
        }
      }
      return index;
    },

    /**
     * Does the row contain a specified bag?
     * @param {Bag} bag
     * @returns {boolean}
     * @public
     */
    contains: function( bag ) {
      assert && assert( this.isValidBag( bag ), 'invalid bag' );
      return ( this.indexOf( bag ) !== -1 );
    },

    /**
     * Is a cell empty?
     * @param {number} index - the cell index
     * @returns {boolean}
     * @public
     */
    isEmpty: function( index ) {
      return ( this.getBagAt( index ) === EMPTY );
    },

    /**
     * Is the cell index valid?
     * @param {number} index - the cell index
     * @returns {boolean}
     * @private
     */
    isValidIndex: function( index ) {
      return ( ( typeof index === 'number' ) && !isNaN( index ) && index >= 0 && index < this.cells.length );
    },

    /**
     * Is the bag valid?
     * @param {Bag} bag
     * @returns {boolean}
     */
    isValidBag: function( bag ) {
      return ( bag instanceof Bag );
    }
  } );
} );
