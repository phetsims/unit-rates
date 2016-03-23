// Copyright 2002-2016, University of Colorado Boulder

/**
 *
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
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Shape = require( 'KITE/Shape' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Random = require( 'DOT/Random' );

  // constants
  var RAND = new Random();
  var BACK_DEPTH = 15;
  var BACK_OFFSET = 0.15;
  var SHELF_SIZE = new Dimension2( 340, 30 );

  /**
   * @param {Shelf} shelf
   * @param {Node} itemLayer
   * @param (function} itemMovedCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ItemShelfNode( shelf, itemLayer, itemMovedCallback, options ) {

    options = options || {};

    var self = this;

    this.shelf = shelf;
    this.itemLayer = itemLayer;
    this.itemMovedCallback = itemMovedCallback;

    // front & top face
    this.shelfNode = new Path( new Shape()
      .moveTo( 0, 10 )                                                  // Top face
      .lineTo( SHELF_SIZE.width, 10)
      .lineTo( ( 1 - BACK_OFFSET ) * SHELF_SIZE.width, -BACK_DEPTH )
      .lineTo( BACK_OFFSET * SHELF_SIZE.width, -BACK_DEPTH )
      .lineTo( 0, 10 )                                                  // Front face
      .lineTo( 0, SHELF_SIZE.height )
      .lineTo( SHELF_SIZE.width, SHELF_SIZE.height)
      .lineTo( SHELF_SIZE.width, 10), {
      fill: 'white',
      stroke: 'black',
      lineWidth: 1
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ this.shelfNode ];

    // refresh on item change
    shelf.itemDataProperty.lazyLink( function( type, oldType ) {
      self.populate();
    } );

    // refresh on item additions/removals
    shelf.addListeners( function( item, observableArray ) {
      console.log( 'Shelf: ' + observableArray.length );
    },
    function( item, observableArray ) {
      console.log( 'Shelf: ' + observableArray.length );
    } );

    Node.call( this, options );
  }

  unitRates.register( 'ItemShelfNode', ItemShelfNode );

  return inherit( Node, ItemShelfNode, {

    /**
     * Checks if a point is in a droppable location
     *
     * @param {Vector2} point
     * @return {boolean}
     * @public
     */
    pointInDropArea: function( point ) {
      return this.bounds.containsPoint( point );
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
      itemArray.forEach( function( item ) {

        var position = item.positionProperty.value;

        if(position.x === 0 && position.y === 0) {
          // create a random position on the shelf
          var r = RAND.random();
          position = new Vector2( bounds.minX * r +  ( 1.0 - r ) * bounds.maxX, bounds.minY )
        }

        // create new item node
        var itemNode = ItemNodeFactory.createItem( item, ShoppingConstants.ITEM_SIZE, position, self.itemMovedCallback );

        // add to the screen for layering purposes
        self.itemLayer.addChild( itemNode );

      } );
    },

    /**
     * Reset the shelf node to its initial state
     * @public
     */
    reset: function() {
      // FIXME
    }

  } ); // inherit

} ); // define

