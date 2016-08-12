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
  var Bounds2 = require( 'DOT/Bounds2' );

  // constants
  var BACK_DEPTH      = 35;
  var BACK_OFFSET     = 0.15;
  var SHELF_SIZE      = new Dimension2( 340, 20 );
  var NODE_X_SPACING  = 2;
  var NODE_Y_SPACING  = 5;

  /**
   * @param {Shelf} shelf - model
   * @param {Node} itemLayer - a container node which holds the item nodes. Used here for local posiitoning of items
   * @param (function} startMoveCallback - function called when item drag starts
   * @param (function} endMoveCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ShelfNode( shelf, itemLayer, startMoveCallback, endMoveCallback, options ) {

    options = options || {};

    var self = this;

    this.shelf = shelf;
    this.itemLayer = itemLayer;
    this.startMoveCallback = startMoveCallback;
    this.endMoveCallback = endMoveCallback;

    var pathOptions = {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1,
      pickable: true
    };

    this.backEdgeMinX = BACK_OFFSET * SHELF_SIZE.width;
    this.backEdgeMaxX = ( 1 - BACK_OFFSET ) * SHELF_SIZE.width;
    this.dropBounds   = new Bounds2( this.backEdgeMinX, -BACK_DEPTH, this.backEdgeMaxX, 0 );

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

    // @private
    this.dropNode = new Path( new Shape()
        .rect( this.backEdgeMinX - 15, ( -BACK_DEPTH ), ( this.backEdgeMaxX - this.backEdgeMinX + 20), BACK_DEPTH ), {
      //fill: 'rgba(255,255,0,0.5)', // uncomment to see drop zone
      lineWidth: 0,
      pickable: false
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ this.topNode, new Path( frontShape, pathOptions ), this.dropNode ];

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
     * Checks if the specified bounds is in a droppable location
     * @param {Bounds2} bounds - parent (layer) coordinates
     * @return {boolean}
     * @public
     */
    intersectsDropArea: function( bounds ) {
      var localBounds = this.parentToLocalBounds( bounds );
      return this.topNode.intersectsBoundsSelf( localBounds );
    },

    /**
     * Adjusts item nodes bottom center coordinate to be on the top of the shelf all the time.
     * @public
     */
    adjustItemPositions: function( animate ) {

      var globalDropBounds = this.dropNode.getGlobalBounds();
      var localDropBounds  = this.itemLayer.globalToParentBounds( globalDropBounds );

      // get the current array for the item type
      var itemArray = this.shelf.getItemsWithType( this.shelf.itemDataProperty.value.type );

      var nodeX = localDropBounds.minX;
      var nodeY = localDropBounds.centerY - NODE_Y_SPACING;

      // layout the nodes so they're not hidden behind one another.
      this.itemLayer.getChildren().forEach( function( itemNode ) {

        if ( itemArray.contains( itemNode.item ) ) {
          var x = nodeX + NODE_X_SPACING;
          var y = nodeY - ( itemNode.height ) + NODE_Y_SPACING;
          itemNode.item.setPosition( x, y, animate ); // positions are item center
          nodeX += itemNode.width + NODE_X_SPACING;
          if ( nodeX >= localDropBounds.maxX ) {
            nodeX = localDropBounds.minX + itemNode.width / 2 + NODE_X_SPACING;
            nodeY += itemNode.height / 2 - NODE_Y_SPACING;
          }
        }
      } );
    },

    /**
     * Creates nodes for each item
     * @public
     */
    populate: function() {

      var self = this;

      // get the current array for the item type
      var itemArray = this.shelf.getItemsWithType( this.shelf.itemDataProperty.value.type );

      // create nodes for all items of type
      itemArray.forEach( function( item ) {

        // create new item node
        var itemNode = ItemNodeFactory.createItem( item, ShoppingConstants.ITEM_SIZE,
          self.startMoveCallback, self.endMoveCallback );

        // add to the screen item layer
        self.itemLayer.addChild( itemNode );
      } );

      this.adjustItemPositions( false );
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

