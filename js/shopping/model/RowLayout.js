// Copyright 2017, University of Colorado Boulder

/**
 * This type manages the layout of a row of objects.
 * The objects are assumed to have homogeneous width.
 * This is used to arrange bags in a row on the shelf and scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var EMPTY = null; // contents of an empty cell

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RowLayout( options ) {

    options = _.extend( {
      centerX: 0, // {number} x coordinate of the center of the row
      numberOfObjects: 4, // {number} maximum number of objects in the row
      objectWidth: 70, // {number} width of each object
      spacing: 8 // {number} horizontal space between objects
    }, options );

    // distance between the centers of adjacent cell
    var deltaX = options.objectWidth + options.spacing;

    // distance between the centers of the left-most and right-most cells
    var leftToRightDistance = deltaX * ( options.numberOfObjects - 1 );

    // center of left-most cell
    var leftX = options.centerX - ( leftToRightDistance / 2 );
    
    // @private the row's cells.
    // Each cell contains a data structure with this format:
    // {Object|null} contents - the object that occupies the cell, null if the cell is empty
    // {number} x - the x coordinate of the cell
    this.cells = [];
    for ( var i = 0; i < options.numberOfObjects; i++ ) {
      this.cells.push( {
        contents: EMPTY,
        x: leftX + ( i * deltaX )
      } );
    }
  }

  unitRates.register( 'RowLayout', RowLayout );

  return inherit( Object, RowLayout, {

    // @public
    reset: function() {

      // empty all cells
      this.cells.forEach( function( cell ) {
        cell.contents = EMPTY;
      } );
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
     * @param {number} x  - x coordinate
     * @returns {number} - cell index, -1 if all cells are occupied
     * @public
     */
    getClosestUnoccupiedCell: function( x ) {
      assert && assert( this.isValidX( x ), 'invalid x: ' + x );
      var index = this.getFirstUnoccupiedCell();
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
     * @private
     */
    isValidX: function( x ) {
      return ( ( typeof x === 'number' ) && !isNaN( x ) );
    },

    /**
     * Sets the contents of a specific cell.  The cell must be empty, and duplicates are not allowed in a row.
     * @param {number} index - the cell index
     * @param {Object} object
     * @public
     */
    setContents: function( index, object ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( this.isEmpty( index ), 'cell is occupied: ' + index );
      assert && assert( !this.containsObject( object ), 'object is already in row at index ' + this.indexOf( object ) );
      this.cells[ index ].contents = object;
    },

    /**
     * Gets the object that occupies a cell.
     * @param {number} index - the cell index
     * @returns {Object|null} - null if the cell is empty
     * @public
     */
    getContents: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      return this.cells[ index ].contents;
    },

    /**
     * Clears the specified cell. The cell must be occupied.
     * @param {number} index - the cell index
     */
    clearCell: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( !this.isEmpty( index ), 'cell is empty: ' + index );
      this.cells[ index ].contents = EMPTY;
    },

    /**
     * Removes an object from the row.
     * @param {Object} object
     */
    removeObject: function( object ) {
      this.clearCell( this.indexOf( object ) );
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
     * Gets the index of the cell that is occupied by a specified object.
     * @param {Object} object
     * @returns {number} -1 if the object is not found
     * @public
     */
    indexOf: function( object ) {
      assert && assert( object, 'invalid object: ' + object );
      var index = -1;
      for ( var i = 0; i < this.cells.length; i++ ) {
        if ( this.getContents( i ) === object ) {
          index = i;
          break;
        }
      }
      return index;
    },

    /**
     * Does the row contain a specified object?
     * @param {Object} object
     * @returns {boolean}
     * @public
     */
    containsObject: function( object ) {
      return ( this.indexOf( object ) !== -1 );
    },

    /**
     * Is a cell empty?
     * @param {number} index - the cell index
     * @returns {boolean}
     * @public
     */
    isEmpty: function( index ) {
      return ( this.getContents( index ) === EMPTY );
    }
  } );
} );
