// Copyright 2017, University of Colorado Boulder

/**
 * Container for bags and shopping items, used as the base type for Shelf and Scale.
 * Provides 1 row of bags, and 2 rows of shopping items (front and back).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bag = require( 'UNIT_RATES/shopping/model/Bag' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RowOfMovables = require( 'UNIT_RATES/shopping/model/RowOfMovables' );
  var ShoppingItem = require( 'UNIT_RATES/shopping/model/ShoppingItem' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingContainer( options ) {

    options = _.extend( {

      location: new Vector2( 0, 0 ), // {Vector2} location of the container

      // bags
      numberOfBags: 4, // {number} maximum number of bags on the shelf
      bagSize: new Dimension2( 100, 100 ), // {number} dimensions of each bag
      bagRowYOffset: 0, // {number} offset of bag row from the container's origin

      // items
      itemSize: new Dimension2( 10, 10 ), // {number} dimensions of each item
      itemCellSpacing: 8, // {number} horizontal spacing between cells in each row
      backRowYOffset: 0, // {number} offset of items front row from the container's origin
      frontRowYOffset: 0 // {number} offset of items back row from the container's origin

    }, options );

    // @public (read-only)
    this.location = options.location;

    // @public row of bags, dispose not required, exists for sim lifetime
    this.bagRow = new RowOfMovables( {
      location: new Vector2( options.location.x, options.location.y + options.bagRowYOffset ),
      numberOfCells: options.numberOfBags,
      cellSize: options.bagSize,

      // These values were determined empirically, to look visually pleasing.
      // For fruit, the spacing affects how cells are populated when bags open to reveal items.
      cellSpacing: ( options.numberOfBags < 4 ) ? 25 : 15
    } );

    // Back row has 1 more cell than front row
    var backNumberOfCells = Math.floor( options.numberOfItems / 2 ) + 1;
    var frontNumberOfCells = options.numberOfItems - backNumberOfCells;
    assert && assert( backNumberOfCells + frontNumberOfCells === options.numberOfItems );

    // @public back row of items, dispose not required, exists for sim lifetime
    this.backItemRow = new RowOfMovables( {
      location: new Vector2( options.location.x, options.location.y + options.backRowYOffset ),
      numberOfCells: backNumberOfCells,
      cellSize: options.itemSize,
      cellSpacing: options.itemCellSpacing
    } );

    // @public front row of items, dispose not required, exists for sim lifetime
    this.frontItemRow = new RowOfMovables( {
      location: new Vector2( options.location.x, options.location.y + options.frontRowYOffset ),
      numberOfCells: frontNumberOfCells,
      cellSize: options.itemSize,
      cellSpacing: options.itemCellSpacing
    } );

    // @public dispose not required, exists for sim lifetime
    this.numberOfBagsProperty = new DerivedProperty( [ this.bagRow.numberOfMovablesProperty ],
      function( numberOfMovables ) {
        return numberOfMovables;
      } );

    // @public dispose not required, exists for sim lifetime
    this.numberOfItemsProperty = new DerivedProperty(
      [ this.frontItemRow.numberOfMovablesProperty, this.backItemRow.numberOfMovablesProperty ],
      function( frontNumberOfMovables, backNumberOfMovables ) {
        return frontNumberOfMovables + backNumberOfMovables;
      } );
  }

  unitRates.register( 'ShoppingContainer', ShoppingContainer );

  return inherit( Object, ShoppingContainer, {

    // @public
    reset: function() {
      this.bagRow.reset();
      this.backItemRow.reset();
      this.frontItemRow.reset();
    },

    /**
     * @param {Bag} bag
     * @returns {boolean}
     * @public
     */
    containsBag: function( bag ) {
      assert && assert( bag instanceof Bag );
      return this.bagRow.contains( bag );
    },

    /**
     * @param {ShoppingItem} item
     * @returns {boolean}
     * @public
     */
    containsItem: function( item ) {
      assert && assert( item instanceof ShoppingItem );
      return ( this.backItemRow.contains( item ) || this.frontItemRow.contains( item ) );
    },

    /**
     * Removes a bag.
     * @param {Bag} bag
     * @public
     */
    removeBag: function( bag ) {
      assert && assert( bag instanceof Bag );
      assert && assert( this.containsBag( bag ), 'does not contain bag' );
      this.bagRow.remove( bag );
    },

    /**
     * Removes an item.
     * @param {ShoppingItem} item
     * @public
     */
    removeItem: function( item ) {
      assert && assert( item instanceof ShoppingItem );
      assert && assert( this.containsItem( item ), 'does not contain item' );
      if ( this.backItemRow.contains( item ) ) {
        this.backItemRow.remove( item );
      }
      else {
        this.frontItemRow.remove( item );
      }
    },

    /**
     * Is the specific item in the front row?
     * @param {ShoppingItem} item
     * @returns {boolean}
     */
    isItemInFrontRow: function( item ) {
      return this.frontItemRow.contains( item );
    }
  } );
} );
