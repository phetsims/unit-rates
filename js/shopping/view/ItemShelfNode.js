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
  var Emitter = require( 'AXON/Emitter' );
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
   * @param (function} itemMovedCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ItemShelfNode( shelf, itemMovedCallback, options ) {

    options = options || {};

    var self = this;

    // @protected
    this.shelf = shelf;

    // @protected - used to tell when an item node is moved
    this.dragEndEmitter = new Emitter();
    this.dragEndEmitter.addListener( itemMovedCallback );

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
    shelf.itemDataProperty.link( function( type, oldType ) {
      self.refresh();
    } );

    // refresh on item additions/removals
    shelf.addListeners( function( item, observableArray ) {
      self.refresh()
    },
    function( item, observableArray ) {
      self.refresh()
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
      var localPoint = this.shelfNode.globalToParentPoint( point );
      return this.shelfNode.containsPoint( localPoint );
    },

    /**
     * Creates nodes for each item
     * @public
     */
    refresh: function() {

      var self = this;

      // remove old nodes
      this.shelfNode.removeAllChildren();

      // create nodes for all items of type
      var itemArray = this.shelf.getItemsWithType( this.shelf.itemDataProperty.value.type );
      itemArray.forEach( function( item ) {

        var itemNode = ItemNodeFactory.createItemNode( item, ShoppingConstants.ITEM_SIZE );

        // translate node according to item position property
        item.positionProperty.link( function( position, oldPosition ) {
          // update node position in local coordinates
          itemNode.translation = itemNode.globalToParentPoint( position );
        } );

        var x = item.positionProperty.value.x;
        var y = item.positionProperty.value.y;

        // position on scale - FIXME: left to right?
        if ( x === 0 && y === 0 ) {
          // create a random local position on the shelf
          x = itemNode.width + RAND.random() * (SHELF_SIZE.width - 2 * itemNode.width);
          y = -SHELF_SIZE.height / 2.0;

          // store the global screen position in the item
          item.position = itemNode.parentToGlobalPoint( new Vector2( x, y ) );;
        }

        self.shelfNode.addChild( itemNode );

        // add a drag listener
        itemNode.addInputListener( new SimpleDragHandler( {
          end: function( e ) {
            // announce drag complete
            self.dragEndEmitter.emit1( item );
          },

          translate: function( translation ) {
            // update node position in screen coordinates
            item.positionProperty.value = itemNode.parentToGlobalPoint( translation.position );
          }

        } ) );

      } );

      console.log( 'Refresh shelf items: ' + itemArray.length);
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

