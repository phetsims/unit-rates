// Copyright 2017-2023, University of Colorado Boulder

/**
 * Model of a bag that contains shopping items.
 * Origin is at the bottom center of the bag.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import URMovable, { URMovableOptions } from '../../common/model/URMovable.js';
import unitRates from '../../unitRates.js';
import ShoppingItem from './ShoppingItem.js';
import optionize from '../../../../phet-core/js/optionize.js';

type SelfOptions = {
  visible?: boolean; // is the bag initially visible?
  items?: ShoppingItem[] | null; // items in the bag, null means the bag does not open when placed on the scale
};

type BagOptions = SelfOptions & URMovableOptions;

export default class Bag extends URMovable {

  public readonly name: string;
  public readonly image: HTMLImageElement;
  public readonly items: ShoppingItem[] | null;
  public readonly visibleProperty: BooleanProperty;

  /**
   * @param name - for internal use
   * @param image - image used by the view to represent this bag
   * @param [providedOptions]
   */
  public constructor( name: string, image: HTMLImageElement, providedOptions?: BagOptions ) {

    const options = optionize<BagOptions, SelfOptions, URMovableOptions>()( {

      // SelfOptions
      visible: true,
      items: null,

      // URMovableOptions
      animationSpeed: 400
    }, providedOptions );

    super( options );

    this.name = name;
    this.image = image;
    this.items = options.items;

    this.visibleProperty = new BooleanProperty( options.visible );
  }

  public override reset(): void {
    this.visibleProperty.reset();
    super.reset();
  }
}

unitRates.register( 'Bag', Bag );