// Copyright 2017-2023, University of Colorado Boulder

/**
 * Model of a shopping item. Origin is at the bottom center of the item.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import URMovable, { URMovableOptions } from '../../common/model/URMovable.js';
import unitRates from '../../unitRates.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  visible?: boolean; // is the item initially visible?
};

type ShoppingItemOptions = SelfOptions & URMovableOptions;

export default class ShoppingItem extends URMovable {

  public readonly name: string;
  public readonly image: HTMLImageElement;
  public readonly visibleProperty: BooleanProperty;

  /**
   * @param name - for internal use
   * @param image - image used by the view to represent this item
   * @param [providedOptions]
   */
  public constructor( name: string, image: HTMLImageElement, providedOptions?: ShoppingItemOptions ) {

    const options = optionize<ShoppingItemOptions, SelfOptions, URMovableOptions>()( {

      // SelfOptions
      visible: true,

      // URMovableOptions
      animationSpeed: 400
    }, providedOptions );

    super( options );

    this.name = name;
    this.image = image;
    this.visibleProperty = new BooleanProperty( options.visible );
  }

  public override reset(): void {
    this.visibleProperty.reset();
    super.reset();
  }
}

unitRates.register( 'ShoppingItem', ShoppingItem );