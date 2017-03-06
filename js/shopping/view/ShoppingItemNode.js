// Copyright 2017, University of Colorado Boulder

/**
 * View of a shopping item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShoppingItemDragHandler = require( 'UNIT_RATES/shopping/view/ShoppingItemDragHandler' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

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

    var self = this;

    // @private
    this.item = item;

    // This type does not propagate options to the supertype because the model determines location.
    Image.call( this, item.image, {
      scale: URConstants.SHOPPING_ITEM_IMAGE_SCALE,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    var locationObserver = function( location ) {
      self.centerX = location.x;
      self.bottom = location.y;
    };
    item.locationProperty.link( locationObserver ); // must be unlinked in dispose

    var visibleObserver = function( visible ) {
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

    // @private drag handler
    this.dragHandler = new ShoppingItemDragHandler( this, item, shelf, scale, frontItemLayer, backItemLayer, dragLayer );
    this.addInputListener( self.dragHandler );

    // @private
    this.disposeShoppingItemNode = function() {
      item.locationProperty.unlink( locationObserver );
      item.visibleProperty.unlink( visibleObserver );
      self.removeInputListener( self.dragHandler );
    };
  }

  unitRates.register( 'ShoppingItemNode', ShoppingItemNode );

  return inherit( Image, ShoppingItemNode, {

    // @public
    dispose: function() {
      this.disposeShoppingItemNode();
      Image.prototype.dispose.call( this );
    },

    /**
     * Cancels a drag that is in progress, see https://github.com/phetsims/unit-rates/issues/168
     * If no drag is in progress, this is a no-op.
     * @public
     */
    cancelDrag: function() {
      if ( this.item.dragging ) {
        this.dragHandler.endDrag( null /* event */ );
      }
    }
  } );
} );
