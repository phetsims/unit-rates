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

    //TODO is this right for items?
    // Offset slightly, so that item sit on the shelf and scale more naturally, determined empirically.
    var yOffset = ( 0.07 * self.height );

    // origin is at bottom center
    var locationObserver = function( location ) {
      self.centerX = location.x;
      self.bottom = location.y + yOffset;
    };
    item.locationProperty.link( locationObserver ); // must be unlinked in dispose

    // @private drag handler
    this.dragHandler = new ShoppingItemDragHandler( this, item, shelf, scale, frontItemLayer, backItemLayer, dragLayer );
    this.addInputListener( self.dragHandler );

    // @private
    this.disposeShoppingItemNode = function() {
      item.locationProperty.unlink( locationObserver );
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

    //TODO not currently used, should it be? delete this?
    //FUTURE revisit when scenery supports drag cancellation, see https://github.com/phetsims/function-builder/issues/57
    /**
     * Cancels a drag that is in progress.
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
