// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Shopping' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/shopping_screen_icon_png.js';
import URColors from '../common/URColors.js';
import unitRatesStrings from '../unit-rates-strings.js';
import unitRates from '../unitRates.js';
import ShoppingModel from './model/ShoppingModel.js';
import ShoppingScreenView from './view/ShoppingScreenView.js';

// strings
const screenShoppingString = unitRatesStrings.screen.shopping;

class ShoppingScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      name: screenShoppingString,
      backgroundColorProperty: new Property( URColors.shoppingScreenBackground ),
      homeScreenIcon: new Image( screenIcon )
    }, options );

    super(
      () => new ShoppingModel(),
      model => new ShoppingScreenView( model ),
      options
    );
  }
}

unitRates.register( 'ShoppingScreen', ShoppingScreen );

export default ShoppingScreen;