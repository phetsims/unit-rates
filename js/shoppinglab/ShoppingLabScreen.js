// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/shopping_lab_screen_icon_png.js';
import URColors from '../common/URColors.js';
import unitRates from '../unitRates.js';
import unitRatesStrings from '../unitRatesStrings.js';
import ShoppingLabModel from './model/ShoppingLabModel.js';
import ShoppingLabScreenView from './view/ShoppingLabScreenView.js';

class ShoppingLabScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      name: unitRatesStrings.screen.shoppingLab,
      backgroundColorProperty: new Property( URColors.shoppingScreenBackground ),
      homeScreenIcon: new ScreenIcon( new Image( screenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
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