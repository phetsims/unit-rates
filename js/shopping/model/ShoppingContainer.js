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
  var MovableRow = require( 'UNIT_RATES/shopping/model/MovableRow' );
  var ShoppingItem = require( 'UNIT_RATES/shopping/model/ShoppingItem' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingContainer( options ) {

    options = _.extend( {

      location: new Vector2( 0, 0 ),

      // bags
      numberOfBags: 4, // {number} maximum number of bags on the shelf
      bagSize: new Dimension2( 100, 100 ), // {number} dimensions of each bag
      bagRowYOffset: 0,

      // items
      itemSize: new Dimension2( 10, 10 ),
      itemCellSpacing: 8,
      backRowYOffset: 0,
      frontRowYOffset: 0

    }, options );

    // @public (read-only)
    this.location = options.location;

    // @public row of bags
    this.bagRow = new MovableRow( {
      location: new Vector2( options.location.x, options.location.y + options.bagRowYOffset ),
      numberOfCells: options.numberOfBags,
      cellSize: options.bagSize,
      cellSpacing: 8
    } );

    // Back row has 1 more cell than front row
    var backNumberOfCells = Math.floor( options.numberOfItems / 2 ) + 1;
    var frontNumberOfCells = options.numberOfItems - backNumberOfCells;
    assert && assert( backNumberOfCells + frontNumberOfCells === options.numberOfItems );

    // @public back row of items, dispose required
    this.backItemRow = new MovableRow( {
      location: new Vector2( options.location.x, options.location.y + options.backRowYOffset ),
      numberOfCells: backNumberOfCells,
      cellSize: options.itemSize,
      cellSpacing: options.itemCellSpacing
    } );

    // @public front row of items, dispose required
    this.frontItemRow = new MovableRow( {
      location: new Vector2( options.location.x, options.location.y + options.frontRowYOffset ),
      numberOfCells: frontNumberOfCells,
      cellSize: options.itemSize,
      cellSpacing: options.itemCellSpacing
    } );

    // @public dispose required, dispose required
    this.numberOfBagsProperty = new DerivedProperty( [ this.bagRow.numberOfMovablesProperty ],
      function( numberOfMovables ) {
        return numberOfMovables;
      } );

    // @public dispose required
    this.numberOfItemsProperty = new DerivedProperty(
      [ this.frontItemRow.numberOfMovablesProperty, this.backItemRow.numberOfMovablesProperty ],
      function( frontNumberOfMovables, backNumberOfMovables ) {
        return frontNumberOfMovables + backNumberOfMovables;
      } );

    // @private
    this.disposeShoppingContainer = function() {
      this.bagRow.dispose();
      this.backItemRow.dispose();
      this.frontItemRow.dispose();
      this.numberOfBagsProperty.dispose();
      this.numberOfItemsProperty.dispose();
    };
  }
  
  unitRates.register( 'ShoppingContainer', ShoppingContainer );

  return inherit( Object, ShoppingContainer, {

    // @public
    reset: function() {
      this.bagRow.reset();
      this.backItemRow.reset();
      this.frontItemRow.reset();
    },

    // @public
    dispose: function() {
      this.disposeShoppingContainer();
    },

    /**
     * @param {Bag} bag
     * @returns {boolean}
     * @public
     */
    containsBag: function( bag ) {
      assert && assert( bag instanceof Bag );
      return this.bagRow.containsMovable( bag );
    },

    /**
     * @param {ShoppingItem} item
     * @returns {boolean}
     * @public
     */
    containsItem: function( item ) {
      assert && assert( item instanceof ShoppingItem );
      return ( this.backItemRow.containsMovable( item ) || this.frontItemRow.containsMovable( item ) );
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
      if ( this.backItemRow.containsMovable( item ) ) {
        this.backItemRow.remove( item );
      }
      else {
        this.frontItemRow.remove( item );
      }
    }
  } );
} );
