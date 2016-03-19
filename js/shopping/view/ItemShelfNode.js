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
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Random = require( 'DOT/Random' );

  // constants
  var RAND = new Random();
  var BACK_DEPTH = 15;
  var BACK_OFFSET = 0.15;
  var SHELF_SIZE = new Dimension2( 340, 30 );

  /**
   * @param {Shelf} shelf
   * @param {Object} [options]
   * @constructor
   */
  function ItemShelfNode( shelf, options ) {

    options = options || {};

    var self = this;
    this.shelf = shelf;

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

    Node.call( this, options );

    // on item change
    shelf.itemTypeProperty.link( function( type, oldType ) {

      // FIXME: temporary
      if ( self.shelf.items.length === 0 ) {
        self.populateShelf( type );
      }

      // remove old nodes
      self.shelfNode.removeAllChildren();

      // create new nodes
      self.shelf.items.forEach( function( item ) {

        var itemNode = ItemNodeFactory.create( type, ShoppingConstants.ITEM_SIZE );
        itemNode.centerX = item.positionProperty.value.x;
        itemNode.bottom = item.positionProperty.value.y;
        self.shelfNode.addChild( itemNode );
      } );

      console.log( 'Shelf item changed: ' + type + ', Items: ' + shelf.items.length);
    } );
  }

  unitRates.register( 'ItemShelfNode', ItemShelfNode );

  return inherit( Node, ItemShelfNode, {

  /**
   * @param {ItemType} type
   @ @private
   */
  populateShelf: function( type ) {

    // FIXME: item count, rates? random locations on shelf
    var itemCount = RAND.random() * 10;
    for (var i = 0; i < itemCount; i++) {
      this.shelf.createItem( type, 1, ShoppingConstants.APPLE_RATE, new Vector2( RAND.random() * SHELF_SIZE.width, 0 ) );
    }
  }

  } );

} ); // define

