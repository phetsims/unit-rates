// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/shopping_lab_screen_icon_png.js';
import URColors from '../common/URColors.js';
import unitRatesStrings from '../unit-rates-strings.js';
import unitRates from '../unitRates.js';
import ShoppingLabModel from './model/ShoppingLabModel.js';
import ShoppingLabScreenView from './view/ShoppingLabScreenView.js';

const screenShoppingLabString = unitRatesStrings.screen.shoppingLab;

/**
 * @param {Object} [options]
 * @constructor
 */
function ShoppingLabScreen( options ) {

  options = merge( {
    name: screenShoppingLabString,
    backgroundColorProperty: new Property( URColors.shoppingScreenBackground ),
    homeScreenIcon: new Image( screenIcon )
  }, options );

  Screen.call( this,
    function() { return new ShoppingLabModel(); },
    function( model ) { return new ShoppingLabScreenView( model ); },
    options
  );
}

unitRates.register( 'ShoppingLabScreen', ShoppingLabScreen );

inherit( Screen, ShoppingLabScreen );
export default ShoppingLabScreen;