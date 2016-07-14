// Copyright 2002-2016, University of Colorado Boulder

/**
 * Displays the shelf and any items that were added to it. The 'top' portion of the shelf is also considered a
 * drop-zone' for items being dragged from the scale
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var ItemNodeFactory = require( 'UNIT_RATES/shopping/view/ItemNodeFactory' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // constants
  var BACK_DEPTH = 35;
  var BACK_OFFSET = 0.15;
  var SHELF_SIZE = new Dimension2( 340, 20 );

  /**
   * @param {Shelf} shelf - model
   * @param {Node} itemLayer - a container node which holds the item nodes. Used here for local posiitoning of items
   * @param (function} itemMovedCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ShelfNode( shelf, itemLayer, itemMovedCallback, options ) {

    options = options || {};

    var self = this;

    this.shelf = shelf;
    this.itemLayer = itemLayer;
    this.itemMovedCallback = itemMovedCallback;

    var pathOptions = {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      pickable: true
    };

    this.backEdgeMinX = BACK_OFFSET * SHELF_SIZE.width;
    this.backEdgeMaxX = ( 1 - BACK_OFFSET ) * SHELF_SIZE.width;

    // @private - top facce
    this.topNode = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( SHELF_SIZE.width, 0)
      .lineTo( this.backEdgeMaxX, -BACK_DEPTH )
      .lineTo( this.backEdgeMinX, -BACK_DEPTH )
      .lineTo( 0, 0 ), pathOptions );

    // @private - front facce
    var frontShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( 0, SHELF_SIZE.height )
      .lineTo( SHELF_SIZE.width, SHELF_SIZE.height)
      .lineTo( SHELF_SIZE.width, 0);

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ this.topNode, new Path( frontShape, pathOptions ) ];

    // refresh on item change
    shelf.itemDataProperty.lazyLink( function( itemData, oldItemData ) {
      self.populate();
    } );

    Node.call( this, options );
  }

  unitRates.register( 'ShelfNode', ShelfNode );

  return inherit( Node, ShelfNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Checks if a point is in a droppable location
     * @param {Vector2} bounds - parent (layer) coordinates
     * @return {boolean}
     * @public
     */
    intersectsDropArea: function( bounds ) {
      var localBounds = this.parentToLocalBounds( bounds );
      return this.topNode.intersectsBoundsSelf( localBounds );
    },

    /**
     * Adjusts item nodes bottom center coordinate to be in the drop area, basically so items always appear
     * to be on the shelf not just covering it.
     * @public
     */
     adjustItemPositions: function() {

      var globalDropBounds = this.topNode.getGlobalBounds();
      var localDropBounds = this.itemLayer.globalToParentBounds( globalDropBounds );

      // get the current array for the item type
      var itemArray = this.shelf.getItemsWithType( this.shelf.itemDataProperty.value.type );

      // Make sure bottoms of all itemNodes are on the scale
      this.itemLayer.getChildren().forEach( function( itemNode ) {

        if ( itemArray.contains( itemNode.item ) ) {
          var x = itemNode.item.positionProperty.value.x;
          var y = itemNode.item.positionProperty.value.y;

          if( x < localDropBounds.minX ) {
            x = localDropBounds.minX;
          }
          else if( x > localDropBounds.maxX ) {
            x = localDropBounds.maxX;
          }

          var bottomY = y + itemNode.height / 2;
          if( bottomY < localDropBounds.minY ) {
              y  = ( localDropBounds.maxY + localDropBounds.minY ) / 2 + ( itemNode.height / 2 );
          }
          else if( bottomY > localDropBounds.maxY ) {
              y  = ( localDropBounds.maxY + localDropBounds.minY ) / 2 - ( itemNode.height / 2 );
          }

          itemNode.item.setPosition( x, y, false );
        }
      } );
    },

    /**
     * Creates nodes for each item
     * @public
     */
    populate: function() {

      var self = this;

      var bounds = self.getBounds();

      // get the current array for the item type
      var itemArray = this.shelf.getItemsWithType( this.shelf.itemDataProperty.value.type );

      // create nodes for all items of type
      var initialX = bounds.minX + self.backEdgeMinX;
      var initialY = bounds.minY;
      itemArray.forEach( function( item ) {

        var position = item.positionProperty.value;

        // create new item node
        var itemNode = ItemNodeFactory.createItem( item, ShoppingConstants.ITEM_SIZE, position, null, self.itemMovedCallback );

        // init position - create a random position on the shelf
        if(position.x === 0 && position.y === 0) {
          item.setPosition( initialX, initialY, false );
        }

        // add to the screen for layering purposes
        self.itemLayer.addChild( itemNode );

        initialX += itemNode.width + 2;
      } );
    },

    /**
     * Basically repopulates the current item type.
     * @public
     */
    resetCurrentItem: function() {
        this.shelf.resetCurrentItem();
        this.populate();
    },

    /**
     * Reset the shelf node to its initial state (all item types)
     * @public
     */
    reset: function() {
      this.populate();
    }

  } ); // inherit

} ); // define

