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
  var Vector2 = require( 'DOT/Vector2' );

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
      location: new Vector2( 0, 0 ), // {number} center of the row
      numberOfObjects: 4, // {number} maximum number of objects in the row
      objectWidth: 70, // {number} width of each object
      spacing: 8 // {number} horizontal space between objects
    }, options );

    // @public (read-only)
    this.location = options.location;

    // distance between the centers of adjacent cell
    var deltaX = options.objectWidth + options.spacing;

    // distance between the centers of the left-most and right-most cells
    var leftToRightDistance = deltaX * ( options.numberOfObjects - 1 );

    // center of left-most cell
    var leftX = options.location.x - ( leftToRightDistance / 2 );
    
    // @private the row's cells.
    // Each cell contains a data structure with this format:
    // {Object|null} contents - the object that occupies the cell, null if the cell is empty
    // {Vector} location - center of the cell
    this.cells = [];
    for ( var i = 0; i < options.numberOfObjects; i++ ) {
      this.cells.push( {
        contents: EMPTY,
        location: new Vector2( leftX + ( i * deltaX ), options.location.y )
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
      return this.getCellLocation( index ).distance( location );
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
     * Sets the contents of a specific cell.  The cell must be empty, and duplicates are not allowed in a row.
     * @param {number} index - the cell index
     * @param {Object} object
     * @public
     */
    setContents: function( index, object ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( this.isEmpty( index ), 'cell is occupied: ' + index );
      assert && assert( !this.contains( object ), 'object is already in row at index ' + this.indexOf( object ) );
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
     * @public
     */
    clearCell: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      assert && assert( !this.isEmpty( index ), 'cell is empty: ' + index );
      this.cells[ index ].contents = EMPTY;
    },

    /**
     * Removes an object from the row.
     * @param {Object} object
     * @public
     */
    removeObject: function( object ) {
      this.clearCell( this.indexOf( object ) );
    },

    /**
     * Gets the location of a cell.
     * @param {number} index - the cell index
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( index ) {
      assert && assert( this.isValidIndex( index ), 'invalid index: ' + index );
      return this.cells[ index ].location;
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
    contains: function( object ) {
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
