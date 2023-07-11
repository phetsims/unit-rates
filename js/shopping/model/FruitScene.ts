// Copyright 2017-2023, University of Colorado Boulder

/**
 * The fruit scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import unitRates from '../../unitRates.js';
import ShoppingScene, { ShoppingSceneOptions } from './ShoppingScene.js';
import ShoppingItemData from './ShoppingItemData.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;
type FruitSceneOptions = SelfOptions & PickOptional<ShoppingSceneOptions, 'rate' | 'denominatorOptions'>;

export default class FruitScene extends ShoppingScene {

  public constructor( itemData: ShoppingItemData, providedOptions?: FruitSceneOptions ) {

    const options = optionize<FruitSceneOptions, SelfOptions, ShoppingSceneOptions>()( {

      // ShoppingSceneOptions
      bagsOpen: true // Fruit bags open when placed on the scale
    }, providedOptions );

    super( itemData, options );
  }
}

unitRates.register( 'FruitScene', FruitScene );