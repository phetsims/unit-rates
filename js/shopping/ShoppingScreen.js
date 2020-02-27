// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Shopping' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import inherit from '../../../phet-core/js/inherit.js';
import merge from '../../../phet-core/js/merge.js';
import Image from '../../../scenery/js/nodes/Image.js';
import screenIcon from '../../images/shopping_screen_icon_png.js';
import URColors from '../common/URColors.js';
import unitRatesStrings from '../unit-rates-strings.js';
import unitRates from '../unitRates.js';
import ShoppingModel from './model/ShoppingModel.js';
import ShoppingScreenView from './view/ShoppingScreenView.js';

const screenShoppingString = unitRatesStrings.screen.shopping;

/**
 * @param {Object} [options]
 * @constructor
 */
function ShoppingScreen( options ) {

  options = merge( {
    name: screenShoppingString,
    backgroundColorProperty: new Property( URColors.shoppingScreenBackground ),
    homeScreenIcon: new Image( screenIcon )
  }, options );

  Screen.call( this,
    function() { return new ShoppingModel(); },
    function( model ) { return new ShoppingScreenView( model ); },
    options
  );
}

unitRates.register( 'ShoppingScreen', ShoppingScreen );

inherit( Screen, ShoppingScreen );
export default ShoppingScreen;