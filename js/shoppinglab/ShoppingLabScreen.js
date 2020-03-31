// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/shopping_lab_screen_icon_png.js';
import URColors from '../common/URColors.js';
import unitRatesStrings from '../unitRatesStrings.js';
import unitRates from '../unitRates.js';
import ShoppingLabModel from './model/ShoppingLabModel.js';
import ShoppingLabScreenView from './view/ShoppingLabScreenView.js';

// strings
const screenShoppingLabString = unitRatesStrings.screen.shoppingLab;

class ShoppingLabScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      name: screenShoppingLabString,
      backgroundColorProperty: new Property( URColors.shoppingScreenBackground ),
      homeScreenIcon: new Image( screenIcon )
    }, options );

    super(
      () => new ShoppingLabModel(),
      model => new ShoppingLabScreenView( model ),
      options
    );
  }
}

unitRates.register( 'ShoppingLabScreen', ShoppingLabScreen );

export default ShoppingLabScreen;