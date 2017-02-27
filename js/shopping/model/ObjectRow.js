// Copyright 2017, University of Colorado Boulder

/**
 * ObjectRow manages a row of objects.
 * - Each row has N cells.
 * - Cells are indexed from left to right.
 * - At most 1 object can occupy a cell.
 * - An object cannot occupy more than 1 cell.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ObjectRow( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {number} bottom center of the row
      numberOfCells: 4, // {number} number of cells in the row
      cellSize: new Dimension2( 100, 100 ), // {number} dimensions of each cell
      cellSpacing: 8 // {number} horizontal space between cells
    }, options );

    // @public (read-only)
    this.cellSize = options.cellSize;

    // @public (read-only) bottom center of the row
    this.location = options.location;

    // distance between the centers of adjacent cells
    var deltaX = options.cellSize.width + options.cellSpacing;

    // distance between the centers of the left-most and right-most cells
    var leftToRightDistance = deltaX * ( options.numberOfCells - 1 );

    // center of left-most cell
    var leftX = options.location.x - ( leftToRightDistance / 2 );
    
    // @private the container's cells.
    // Each cell contains a data structure with this format:
    // {Object|null} object - the object that occupies the cell, null if the cell is empty
    // {Vector} location - bottom center of the cell
    this.cells = [];
    for ( var i = 0; i < options.numberOfCells; i++ ) {
      this.cells.push( {
        object: null,
        location: new Vector2( leftX + ( i * deltaX ), options.location.y )
      } );
    }
    
    // @public (read-only) number of objects in the row
    this.numberOfObjectsProperty = new Property( 0 );
  }

  unitRates.register( 'ObjectRow', ObjectRow );

  return inherit( Object, ObjectRow, {

    // @public
    reset: function() {

      // empty all cells
      this.cells.forEach( function( cell ) {
        cell.object = null;
      } );
      this.numberOfObjectsProperty.reset();
    },

    /**
     * Gets the index of the first unoccupied cell. Cells are visited left to right.
     * @returns {number} - cell index, -1 if all cells are occupied
     * @public
     */
    getFirstUnoccupiedCell: function() {
      var index = -1;
      for ( var i = 0; i < this.cells.length; i++ ) {
        if ( this.isEmptyCell( i ) ) {
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
          if ( this.isEmptyCell( i ) ) {
            if ( this.getDistanceFromCell( i, location ) < this.getDistanceFromCell( index, location ) ) {
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
     * Puts an object in the specified cell.  
     * The cell must be empty, and object cannot occupy more than 1 cell.
     * @param {Object} object
     * @param {number} index - the cell index
     * @public
     */
    addObject: function( object, index ) {
      assert && assert( !this.containsObject( object ), 'object is already in row at index ' + this.indexOfObject( object ) );
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      assert && assert( this.isEmptyCell( index ), 'cell is occupied: ' + index );
      this.cells[ index ].object = object;
      this.numberOfObjectsProperty.value++;
    },

    /**
     * Removes an object from the container.
     * @param {Object} object
     * @public
     */
    removeObject: function( object ) {
      var index = this.indexOfObject( object );
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      this.cells[ index ].object = null;
      this.numberOfObjectsProperty.value--;
    },

    /**
     * Does the row contain a specified object?
     * @param {Object} object
     * @returns {boolean}
     * @public
     */
    containsObject: function( object ) {
      return ( this.indexOfObject( object ) !== -1 );
    },

    /**
     * Is a cell empty?
     * @param {number} index - the cell index
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( index ) {
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      return ( this.cells[ index ].object === null );
    },

    /**
     * Gets the location of a cell.
     * @param {number} index - the cell index
     * @returns {Vector2}
     * @public
     */
    getCellLocation: function( index ) {
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      return this.cells[ index ].location;
    },

    /**
     * Gets the index of the cell that is occupied by a specified object.
     * @param {Object} object
     * @returns {number} -1 if the object is not found
     * @private
     */
    indexOfObject: function( object ) {
      var index = -1;
      for ( var i = 0; i < this.cells.length; i++ ) {
        if ( this.cells[ i ].object === object ) {
          index = i;
          break;
        }
      }
      return index;
    },

    /**
     * Gets the distance between a cell and a location.
     * @param {number} index - the cell index
     * @param {Vector2} location
     * @returns {number}
     * @private
     */
    getDistanceFromCell: function( index, location ) {
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      return this.getCellLocation( index ).distance( location );
    },

    /**
     * Is the cell index valid?
     * @param {number} index - the cell index
     * @returns {boolean}
     * @private
     */
    isValidCellIndex: function( index ) {
      return ( ( typeof index === 'number' ) && !isNaN( index ) && index >= 0 && index < this.cells.length );
    }
  } );
} );
