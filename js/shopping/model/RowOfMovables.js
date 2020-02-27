// Copyright 2017-2020, University of Colorado Boulder

/**
 * RowOfMovables manages a row of URMovables (movable model elements).
 * Used to manage the position of bags and items on the scale and shelf.
 *
 * - Each row has N cells.
 * - Cells are indexed from left to right.
 * - At most 1 movable can occupy a cell.
 * - A movable cannot occupy more than 1 cell.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import unitRates from '../../unitRates.js';

/**
 * @param {Object} [options]
 * @constructor
 */
function RowOfMovables( options ) {

  options = merge( {
    position: new Vector2( 0, 0 ), // {number} bottom center of the row
    numberOfCells: 4, // {number} number of cells in the row
    cellSize: new Dimension2( 100, 100 ), // {number} dimensions of each cell
    cellSpacing: 0 // {number} horizontal space between cells
  }, options );

  // @public (read-only)
  this.cellSize = options.cellSize;

  // @public (read-only) bottom center of the row
  this.position = options.position;

  // @private the container's cells.
  this.cells = createCells( options.numberOfCells, options.position, options.cellSize, options.cellSpacing );

  // @public (read-only) number of movables in the row (number of occupied cells)
  this.numberOfMovablesProperty = new NumberProperty( 0 );
}

unitRates.register( 'RowOfMovables', RowOfMovables );

/**
 * Creates a row of empty cells.
 * @param {number} numberOfCells
 * @param {Vector2} position - bottom center of the row
 * @param {Dimension2} cellSize
 * @param {number} cellSpacing
 * @returns {{movable:URMovable|null, position:Vector2}[]}
 */
function createCells( numberOfCells, position, cellSize, cellSpacing ) {

  // distance between the centers of adjacent cells
  const deltaX = cellSize.width + cellSpacing;

  // distance between the centers of the left-most and right-most cells
  const leftToRightDistance = deltaX * ( numberOfCells - 1 );

  // center of the first (left-most) cell
  const firstCenterX = position.x - ( leftToRightDistance / 2 );

  // Each cell contains a data structure with this format:
  // {URMovable|null} movable - the movable that occupies the cell, null if the cell is empty
  // {Vector} position - bottom center of the cell
  const cells = [];
  for ( let i = 0; i < numberOfCells; i++ ) {
    cells.push( {
      movable: null,
      position: new Vector2( firstCenterX + ( i * deltaX ), position.y )
    } );
  }

  return cells;
}

export default inherit( Object, RowOfMovables, {

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
    let index = -1;
    for ( let i = 0; i < this.cells.length; i++ ) {
      if ( this.isEmptyCell( i ) ) {
        index = i;
        break;
      }
    }
    return index;
  },

  /**
   * Gets the index of the closest unoccupied cell.
   * @param {Vector2} position
   * @returns {number} - cell index, -1 if all cells are occupied
   * @public
   */
  getClosestUnoccupiedCell: function( position ) {
    let index = this.getFirstUnoccupiedCell();
    if ( index !== -1 ) {
      for ( let i = index + 1; i < this.cells.length; i++ ) {
        if ( this.isEmptyCell( i ) ) {
          if ( this.getDistanceFromCell( i, position ) < this.getDistanceFromCell( index, position ) ) {
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

    assert && assert( !this.contains( movable ),
      'movable is already in row at index ' + this.indexOf( movable ) );
    assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
    assert && assert( this.isEmptyCell( index ), 'cell is occupied: ' + index );

    // put in cell
    this.cells[ index ].movable = movable;
    this.numberOfMovablesProperty.value++;

    // move immediately to cell
    movable.moveTo( this.getCellPosition( index ) );
  },

  /**
   * Removes a movable from the container.
   * @param {URMovable} movable
   * @public
   */
  remove: function( movable ) {
    const index = this.indexOf( movable );
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
  contains: function( movable ) {
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
   * Gets the position of a cell.
   * @param {number} index - the cell index
   * @returns {Vector2}
   * @public
   */
  getCellPosition: function( index ) {
    assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
    return this.cells[ index ].position;
  },

  /**
   * Gets the number of cells in the row.
   * @returns {number}
   * @public
   */
  getNumberOfCells: function() {
    return this.cells.length;
  },

  /**
   * Gets the index of the cell that is occupied by a specified movable.
   * @param {URMovable} movable
   * @returns {number} -1 if the movable is not found
   * @private
   */
  indexOf: function( movable ) {
    let index = -1;
    for ( let i = 0; i < this.cells.length; i++ ) {
      if ( this.cells[ i ].movable === movable ) {
        index = i;
        break;
      }
    }
    return index;
  },

  /**
   * Gets the distance between a cell and a position.
   * @param {number} index - the cell index
   * @param {Vector2} position
   * @returns {number}
   * @private
   */
  getDistanceFromCell: function( index, position ) {
    assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
    return this.getCellPosition( index ).distance( position );
  },

  /**
   * Is the cell index valid?
   * @param {number} index - the cell index
   * @returns {boolean}
   * @private
   */
  isValidCellIndex: function( index ) {
    return ( ( typeof index === 'number' ) && !isNaN( index ) && index >= 0 && index < this.cells.length );
  },

  /**
   * For use only by debug code in RowOfMovablesNode.
   * @returns {*[]}
   * @private
   */
  getCells: function() {
    return this.cells;
  }
} );