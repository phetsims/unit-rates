// Copyright 2017-2020, University of Colorado Boulder

/**
 * View of a shopping item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const ShoppingItemDragHandler = require( 'UNIT_RATES/shopping/view/ShoppingItemDragHandler' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URConstants = require( 'UNIT_RATES/common/URConstants' );

  /**
   * @param {ShoppingItem} item
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @param {Node} frontItemLayer
   * @param {Node} backItemLayer
   * @param {Node} dragLayer
   * @constructor
   */
  function ShoppingItemNode( item, shelf, scale, frontItemLayer, backItemLayer, dragLayer ) {

    const self = this;

    // This type does not propagate options to the supertype because the model determines position.
    Image.call( this, item.image, {
      scale: URConstants.SHOPPING_ITEM_IMAGE_SCALE,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    const positionObserver = function( position ) {
      self.centerX = position.x;
      self.bottom = position.y;
    };
    item.positionProperty.link( positionObserver ); // unlink in dispose

    const visibleObserver = function( visible ) {
      self.visible = visible;
      if ( visible ) {
        self.getParent() && self.getParent().removeChild( self );

        // put the Node in the proper layer
        if ( shelf.isItemInFrontRow( item ) || scale.isItemInFrontRow( item ) ) {
          frontItemLayer.addChild( self );
        }
        else {
          backItemLayer.addChild( self );
        }
      }
    };
    item.visibleProperty.link( visibleObserver ); // unlink in dispose

    const dragHandler = new ShoppingItemDragHandler( this, item, shelf, scale, frontItemLayer, backItemLayer, dragLayer );
    this.addInputListener( dragHandler );

    // @private
    this.disposeShoppingItemNode = function() {
      item.positionProperty.unlink( positionObserver );
      item.visibleProperty.unlink( visibleObserver );
      self.removeInputListener( dragHandler );
    };

    // @private used by prototype functions
    this.item = item;
  }

  unitRates.register( 'ShoppingItemNode', ShoppingItemNode );

  return inherit( Image, ShoppingItemNode, {

    // @public
    dispose: function() {
      this.disposeShoppingItemNode();
      Image.prototype.dispose.call( this );
    }
  } );
} );
