// Copyright 2016, University of Colorado Boulder

/**
 * Displays the shelf and any items that were added to it.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // sim modules
  var OLDItemNodeFactory = require( 'UNIT_RATES/old/common/shopping/view/OLDItemNodeFactory' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var shelfImage = require( 'image!UNIT_RATES/old/shelf.png' );

  // constants
  var BACK_DEPTH = 20;
  var BACK_OFFSET = 0.065;
  var NODE_X_SPACING = 2;
  var NODE_Y_SPACING = 10;

  /**
   * @param {OLDShelf} shelf - model
   * @param {Node} itemLayer - a container node which holds the item nodes. Used here for local positioning of items
   * @param {function} startMoveCallback - function called when item drag starts
   * @param {function} endMoveCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function OLDShelfNode( shelf, itemLayer, startMoveCallback, endMoveCallback, options ) {

    options = options || {};

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.shelf = shelf;
    this.itemLayer = itemLayer;
    this.startMoveCallback = startMoveCallback;
    this.endMoveCallback = endMoveCallback;

    var imageNode = new Image( shelfImage, { scale: 0.5 } );

    this.backEdgeMinX = BACK_OFFSET * imageNode.width;
    this.backEdgeMaxX = ( 1 - BACK_OFFSET ) * imageNode.width;

    // @private - Note: this is used only as a defined area for positioning items on the shelf
    this.topNode = new Path( new Shape()
      .rect( this.backEdgeMinX + 30, 0, ( this.backEdgeMaxX - this.backEdgeMinX - 60), BACK_DEPTH ), {
      //fill: 'rgba(255,255,0,0.5)', // uncomment to see top positioning zone
      lineWidth: 0
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ imageNode, this.topNode ];

    Node.call( this, options );
  }

  unitRates.register( 'OLDShelfNode', OLDShelfNode );

  return inherit( Node, OLDShelfNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * @param {ItemData} itemData
     * @public
     */
    itemDataChanged: function( itemData ) {
      this.populate();
    },

    /**
     * Adjusts item nodes bottom center coordinate to be on the topNode of the shelf at all time.
     * @param {boolean} animate - animate the change in position
     * @public
     */
    adjustItemPositions: function( animate ) {

      var globalDropBounds = this.topNode.getGlobalBounds();
      var localDropBounds = this.itemLayer.globalToParentBounds( globalDropBounds );

      // get the current array for the item type
      var itemArray = this.shelf.getItemsWithType( this.shelf.itemTypeProperty.value );

      var nodeX = localDropBounds.minX;
      var nodeY = localDropBounds.centerY - NODE_Y_SPACING;

      // layout the nodes so they're not hidden behind one another.
      this.itemLayer.getChildren().forEach( function( itemNode ) {

        if ( itemArray.contains( itemNode.item ) ) {

          var x = nodeX - itemNode.width / 4 + NODE_X_SPACING;
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
      var itemArray = this.shelf.getItemsWithType( this.shelf.itemTypeProperty.value );

      // create nodes for all items of type
      itemArray.forEach( function( item ) {

        // create new item node
        var itemNode = OLDItemNodeFactory.createItemNode( item, {
          moveStartCallback: self.startMoveCallback,
          moveEndCallback: self.endMoveCallback
        } );

        // add to the screen item layer
        self.itemLayer.addChild( itemNode );
      } );

      this.adjustItemPositions( false );
    },

    /**
     * Reset the the shelf node to its initial state (current item type only)
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

