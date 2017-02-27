// Copyright 2017, University of Colorado Boulder

//TODO this is untested brainstorming code
/**
 * ShoppingItemContainer is a container for shopping items.
 * Items are arranged in 2 rows, like this:
 *
 *    X X X X X
 *   X X X X X X
 *   
 * Each cell contains at most 1 item. Cells are filled from the base of the triangle upward.
 * Each item in the top row must be supported by 2 items below it.
 * Removing an item from the lower row causes an item above it to fall down.
 * Cells are indexed from left to right, starting with the bottom row.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var ShoppingItem = require( 'UNIT_RATES/shopping/model/ShoppingItem' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItemContainer( options ) {

    options = _.extend( {
      location: new Vector2( 0, 0 ), // {number} bottom center of the triangle's base
      numberOfCells: 15, //  {number} total number of cells, must be an odd number
      cellSize: new Dimension2( 60, 60 ), // {Dimension2} dimensions of each cell
      quantityUnits: '' // {string} units for quantity
    }, options );

    assert && assert( options.numberOfCells % 2 === 1, 'numberOfCells must be odd: ' + options.numberOfCells );

    // @public (read-only) bottom center of the container
    this.location = options.location;

    // @private number of cells in bottom row
    this.numberOfCellsInBottomRow = Math.floor( options.numberOfCells / 2 ) + 1;

    // number of cells in the current row, starting with bottom row
    var numberOfCellsInRow = this.numberOfCellsInBottomRow;

    // center of the left-most cell in the current row
    var leftX = options.location.x - ( ( options.cellSize.width * ( numberOfCellsInRow - 1 ) ) / 2 );

    // bottom center of the left-most cell in the current row
    var bottomY = options.location.y;

    // Cells are in a 1D array, with bottom row before top row.
    // Each cell contains a data structure with this format:
    // {ShoppingItem|null} item - the item that occupies the cell, null if the cell is empty
    // {Vector} location - bottom center of the cell
    this.cells = [];
    for ( var row = 0; row < 2; row++ ) {
      for ( var i = 0; i < numberOfCellsInRow; i++ ) {
        this.cells.push( {
          item: null,
          location: new Vector2( leftX + ( i * options.cellSize.width ), bottomY )
        } );
      }
      numberOfCellsInRow--;
      leftX += ( 0.5 * options.cellSize.width );
      bottomY -= options.cellSize.height;
    }
    assert && assert( this.cells.length === options.numberOfCells,
      'incorrect number of cells were created: ' + this.cells.length );

    // @public quantity represented by the bags currently in the container
    this.quantityProperty = new Property( 0 );
    this.quantityUnits = options.quantityUnits;
  }
  
  unitRates.register( 'ShoppingItemContainer', ShoppingItemContainer );

  return inherit( Object, ShoppingItemContainer, {

    // @public
    reset: function() {

      // empty all cells
      this.cells.forEach( function( cell ) {
        cell.bag = null;
      } );

      this.quantityProperty.reset();
    },

    /**
     * Puts an item in the specified cell. The cell must be empty, and duplicates are not allowed in a row.
     * @param {ShoppingItem} item
     * @param {number} index - the cell index
     * @public
     */
    addItem: function( item, index ) {
      assert && assert( this.isValidItem( item ), 'invalid item' );
      assert && assert( !this.containsItem( item ), 'item is already at index ' + this.indexOfBag( item ) );
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      assert && assert( this.isEmptyCell( index ), 'cell is occupied: ' + index );
      //TODO verify that the cells below this one are both occupied
      this.cells[ index ].item = item;
      this.quantityProperty.value++;
    },

    /**
     * Removes an item from the container.
     * @param {ShoppingItem} item
     * @public
     */
    removeItem: function( item ) {
      assert && assert( this.isValidItem( item ), 'invalid item' );
      var index = this.indexOfItem( item );
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      this.cells[ index ].item = null;
      this.quantityProperty.value--;
      //TODO if this item supported items above it, move one of them down
    },

    /**
     * Does the row contain a specified item?
     * @param {ShoppingItem} item
     * @returns {boolean}
     * @public
     */
    containsItem: function( item ) {
      assert && assert( this.isValidItem( item ), 'invalid item' );
      return ( this.indexOfItem( item ) !== -1 );
    },

    /**
     * Is a cell empty?
     * @param {number} index - the cell index
     * @returns {boolean}
     * @public
     */
    isEmptyCell: function( index ) {
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      return ( this.cells[ index ].item === null );
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
     * Gets the index of the cell that is occupied by a specified item.
     * @param {ShoppingItem} item
     * @returns {number} -1 if the item is not found
     * @private
     */
    indexOfItem: function( item ) {
      assert && assert( this.isValidItem( item ), 'invalid item' );
      var index = -1;
      for ( var i = 0; i < this.cells.length; i++ ) {
        if ( this.cells[ i ].item === item ) {
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
    },

    /**
     * Is the item valid?
     * @param {ShoppingItem} item
     * @returns {boolean}
     * @private
     */
    isValidItem: function( item ) {
      return ( item instanceof ShoppingItem );
    },

    /**
     * Is the specified cell in the bottom row?
     * @param {number} index
     * @returns {boolean}
     * @private
     */
    isCellInBottomRow: function( index ) {
      assert && assert( this.isValidCellIndex( index ), 'invalid index: ' + index );
      return index < this.numberOfCellsInBottomRow;
    },

    /**
     * Is the specified cell in the top row?
     * @param {number} index
     * @returns {boolean}
     * @private
     */
    isCellInTopRow: function( index ) {
      return !this.isCellInBottomRow( index );
    },

    /**
     * Is the specified cell fully supported?
     * @param {number} index
     * @returns {boolean}
     */
    isFullySupported: function( index ) {
      var fullySupported = false;
      if ( this.isCellInBottomRow( index ) ) {

        // all cells in the bottom row are considered fully-supported
        fullySupported = true;
      }
      else {

        // a cell in the top row is fully-supported if the 2 cells below it are occupied
        var leftSupportingCellIndex = index - this.numberOfCellsInBottomRow;
        return ( !this.isEmptyCell( leftSupportingCellIndex ) && !this.isEmptyCell( leftSupportingCellIndex + 1 ) );
      }
      return fullySupported;
    }
  } );
} );
