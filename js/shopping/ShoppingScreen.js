// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Shopping' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/shopping_screen_icon_png.js';
import URColors from '../common/URColors.js';
import unitRates from '../unitRates.js';
import unitRatesStrings from '../unitRatesStrings.js';
import ShoppingModel from './model/ShoppingModel.js';
import ShoppingScreenView from './view/ShoppingScreenView.js';

class ShoppingScreen extends Screen {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {
      name: unitRatesStrings.screen.shopping,
      backgroundColorProperty: new Property( URColors.shoppingScreenBackground ),
      homeScreenIcon: new ScreenIcon( new Image( screenIcon ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } )
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