// Copyright 2017, University of Colorado Boulder

/**
 * Bags are arranged in a row on the shelf and scale.
 * This type manages where items are in the row, which 'cells' are occupied vs free,
 * which cell is closest to a specified point, etc.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var Bag = require( 'UNIT_RATES/shopping/model/Bag' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var NO_BAG = null; // contents of an empty cell

  /**
   * @param {Object} [options]
   * @constructor
   */
  function BagRow( options ) {

    options = _.extend( {
      centerX: 0, // {number} x coordinate of the center of the row
      numberOfBags: 4,
      bagWidth: 70,
      bagSpacing: 8 // {number} horizontal space between bags
    }, options );

    // @private the row's cells.
    // Each cell contains a data structure with this format:
    // {Bag|null} bag - the bag that occupies the cell, null if the cell is empty
    // {number} x - the x coordinate of the cell, corresponds to the bottom-center of a bag's location
    this.cells = [];
    var leftX = options.centerX - ( ( options.numberOfBags / 2 ) * options.bagWidth ) + ( options.bagWidth / 2 ) - ( ( ( options.numberOfBags - 1 ) * options.bagSpacing ) / 2 );
    var deltaX = options.bagWidth + options.bagSpacing;
    for ( var i = 0; i < options.numberOfBags; i++ ) {
      this.cells.push( {
        bag: NO_BAG,
        x: leftX + ( i * deltaX )
      } );
    }
  }

  unitRates.register( 'BagRow', BagRow );

  return inherit( Object, BagRow, {

    /**
     * Gets the index of the unoccupied cell that is closest to x.
     * @param {number} x  - x coordinate
     * @returns {number} - cell index, -1 if all cells are occupied
     * @public
     */
    getIndexClosestUnoccupied: function( x ) {
      assert && assert( this.isValidX( x ), 'invalid x: ' + x );
      var index = this.getIndexFirstUnoccupied();
      if ( index !== -1 ) {
        for ( var i = index + 1; i < this.cells.length; i++ ) {
          if ( this.getDistanceBetween( i, x ) < this.getDistanceBetween( index, x ) ) {
            index = i;
          }
          else {
            break;
          }
        }
      }
      return index;
    },

    /**
     * Gets the index of the first unoccupied. Cells are visited left to right.
     * @returns {number} - cell index, -1 if all cells are occupied
     * @private
     */
    getIndexFirstUnoccupied: function() {
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
     * Gets the distance between a cell and an x coordinate.
     * @param {number} index - the cell index
     * @param {number} x
     * @returns {number}
     * @private
     */
    getDistanceBetween: function( index, x ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( this.isValidX( x ), 'invalid x: ' + x );
      return Math.abs( this.getXAt( index ) - x );
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
     * Is the x coordinate valid?
     * @param {number} x
     * @returns {boolean}
     */
    isValidX: function( x ) {
      return ( ( typeof x === 'number' ) && !isNaN( x ) );
    },

    /**
     * Puts a bag in a specific cell.
     * @param {number} index - the cell index
     * @param {Bag} bag
     * @public
     */
    populateCell: function( index, bag ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( this.isEmpty( index ), 'cell is occupied: ' + index );
      assert && assert( bag instanceof Bag, 'invalid bag' );
      assert && assert( !this.containsBag( bag ), 'bag is already in row at index ' + this.indexOfBag( bag ) );
      this.cells[ index ].bag = bag;
    },

    /**
     * Clears the specified cell.
     * @param {number} index - the cell index
     */
    clearCell: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( !this.isEmpty( index ), 'cell is empty: ' + index );
      this.cells[ index ].bag = NO_BAG;
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
     * Gets the x coordinate of a cell.
     * @param {number} index - the cell index
     * @returns {number}
     * @public
     */
    getXAt: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      return this.cells[ index ].x;
    },

    /**
     * Gets the index of the cell that is occupied by a specified bag.
     * @param {Bag} bag
     * @returns {number} -1 if the bag is not found
     * @public
     */
    indexOfBag: function( bag ) {
      assert && assert( bag instanceof Bag, 'invalid bag' );
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
    containsBag: function( bag ) {
      return ( this.indexOfBag( bag ) !== -1 );
    },

    /**
     * Is a cell empty?
     * @param {number} index - the cell index
     * @returns {boolean}
     * @public
     */
    isEmpty: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      return ( this.cells[ index ].bag === NO_BAG );
    }
  } );
} );
