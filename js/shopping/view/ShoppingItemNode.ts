// Copyright 2017-2023, University of Colorado Boulder

/**
 * View of a shopping item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Image, Node } from '../../../../scenery/js/imports.js';
import URConstants from '../../common/URConstants.js';
import unitRates from '../../unitRates.js';
import ShoppingItemDragListener from './ShoppingItemDragListener.js';
import Shelf from '../model/Shelf.js';
import Scale from '../model/Scale.js';
import ShoppingItem from '../model/ShoppingItem.js';
import Vector2 from '../../../../dot/js/Vector2.js';

export default class ShoppingItemNode extends Image {

  private readonly disposeShoppingItemNode: () => void;

  public constructor( item: ShoppingItem, shelf: Shelf, scale: Scale,
                      frontItemLayer: Node, backItemLayer: Node, dragLayer: Node ) {

    // This type does not propagate options to the supertype because the model determines position.
    super( item.image, {
      scale: URConstants.SHOPPING_ITEM_IMAGE_SCALE,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    const positionObserver = ( position: Vector2 ) => {
      this.centerX = position.x;
      this.bottom = position.y;
    };
    item.positionProperty.link( positionObserver ); // unlink in dispose

    const visibleObserver = ( visible: boolean ) => {
      this.visible = visible;
      if ( visible ) {
        const parent = this.parent;
        parent && parent.removeChild( this );

        // put the Node in the proper layer
        if ( shelf.isItemInFrontRow( item ) || scale.isItemInFrontRow( item ) ) {
          frontItemLayer.addChild( this );
        }
        else {
          backItemLayer.addChild( this );
        }
      }
    };
    item.visibleProperty.link( visibleObserver ); // unlink in dispose

    const dragListener = new ShoppingItemDragListener( this, item, shelf, scale, frontItemLayer, backItemLayer, dragLayer );
    this.addInputListener( dragListener ); // removeInputListener in dispose

    this.disposeShoppingItemNode = () => {
      item.positionProperty.unlink( positionObserver );
      item.visibleProperty.unlink( visibleObserver );
      this.removeInputListener( dragListener );
    };
  }

  public override dispose(): void {
    this.disposeShoppingItemNode();
    super.dispose();
  }
}

unitRates.register( 'ShoppingItemNode', ShoppingItemNode );