// Copyright 2017-2023, University of Colorado Boulder

/**
 * The vegetable scene in the Shopping screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import unitRates from '../../unitRates.js';
import ShoppingScene, { ShoppingSceneOptions } from './ShoppingScene.js';
import ShoppingItemData from './ShoppingItemData.js';
import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = EmptySelfOptions;
type VegetableSceneOptions = SelfOptions & PickOptional<ShoppingSceneOptions, 'rate'>;

export default class VegetableScene extends ShoppingScene {

  public constructor( itemData: ShoppingItemData, providedOptions?: VegetableSceneOptions ) {
    super( itemData, providedOptions );
  }
}

unitRates.register( 'VegetableScene', VegetableScene );