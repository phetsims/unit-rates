// Copyright 2017, University of Colorado Boulder

/**
 * MovableRow manages a row of URMovables (movable model elements).
 * Used to manage the location of bags and items on the scale and shelf.
 *
 * - Each row has N cells.
 * - Cells are indexed from left to right.
 * - At most 1 movable can occupy a cell.
 * - A movable cannot occupy more than 1 cell.
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
  function MovableRow( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {number} bottom center of the row
      numberOfCells: 4, // {number} number of cells in the row
      cellSize: new Dimension2( 100, 100 ), // {number} dimensions of each cell
      cellSpacing: 0 // {number} horizontal space between cells
    }, options );

    // @public (read-only)
    this.cellSize = options.cellSize;

    // @public (read-only) bottom center of the row
    this.location = options.location;

    // @private the container's cells.
    this.cells = createCells( options.numberOfCells, options.location, options.cellSize, options.cellSpacing );

    // @public (read-only) number of movables in the row (number of occupied cells)
    this.numberOfMovablesProperty = new Property( 0 );
  }

  unitRates.register( 'MovableRow', MovableRow );

  /**
   * Creates a row of empty cells.
   * @param {number} numberOfCells
   * @param {Vector2} location - bottom center of the row
   * @param {Dimension2} cellSize
   * @param {number} cellSpacing
   * @returns {{movable:URMovable|null, location:Vector2}[]}
   */
  function createCells( numberOfCells, location, cellSize, cellSpacing ) {

    // distance between the centers of adjacent cells
    var deltaX = cellSize.width + cellSpacing;

    // distance between the centers of the left-most and right-most cells
    var leftToRightDistance = deltaX * ( numberOfCells - 1 );

    // center of the first (left-most) cell
    var firstCenterX = location.x - ( leftToRightDistance / 2 );

    // Each cell contains a data structure with this format:
    // {URMovable|null} movable - the movable that occupies the cell, null if the cell is empty
    // {Vector} location - bottom center of the cell
    var cells = [];
    for ( var i = 0; i < numberOfCells; i++ ) {
      cells.push( {
        movable: null,
        location: new Vector2( firstCenterX + ( i * deltaX ), location.y )
      } );
    }

    return cells;
  }

  return inherit( Object, MovableRow, {

    // @public
    reset: function() {

      // empty all cells
      this.cells.forEach( function( cell ) {
        cell.movable = null;
      } );
      this.numberOfMovablesProperty.reset();
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
     * Puts a movable in the specified cell.
     * The cell must be empty, and the movable cannot occupy more than 1 cell.
     * @param {URMovable} movable
     * @param {number} index - the cell index
     * @public
     */
    put: function( movable, index ) {

      assert && assert( !this.containsMovable( movable ),
        'movable is already in row at index ' + this.indexOf( movable ) );
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      assert && assert( this.isEmptyCell( index ), 'cell is occupied: ' + index );

      // put in cell
      this.cells[ index ].movable = movable;
      this.numberOfMovablesProperty.value++;

      // move immediately to cell
      movable.moveTo( this.getCellLocation( index ) );
    },

    /**
     * Removes a movable from the container.
     * @param {URMovable} movable
     * @public
     */
    remove: function( movable ) {
      var index = this.indexOf( movable );
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      this.cells[ index ].movable = null;
      this.numberOfMovablesProperty.value--;
    },

    /**
     * Does the row contain a specified movable?
     * @param {URMovable} movable
     * @returns {boolean}
     * @public
     */
    containsMovable: function( movable ) {
      return ( this.indexOf( movable ) !== -1 );
    },

    /**
     * Is a cell empty?
     * @param {number} index - the cell index
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( index ) {
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      return ( this.cells[ index ].movable === null );
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
     * Gets the index of the cell that is occupied by a specified movable.
     * @param {URMovable} movable
     * @returns {number} -1 if the movable is not found
     * @private
     */
    indexOf: function( movable ) {
      var index = -1;
      for ( var i = 0; i < this.cells.length; i++ ) {
        if ( this.cells[ i ].movable === movable ) {
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
