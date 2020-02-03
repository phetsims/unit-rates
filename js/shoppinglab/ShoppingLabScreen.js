// Copyright 2016-2019, University of Colorado Boulder

/**
 * The 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );
  const ShoppingLabModel = require( 'UNIT_RATES/shoppinglab/model/ShoppingLabModel' );
  const ShoppingLabScreenView = require( 'UNIT_RATES/shoppinglab/view/ShoppingLabScreenView' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URColors = require( 'UNIT_RATES/common/URColors' );

  // images
  const screenIcon = require( 'image!UNIT_RATES/shopping_lab_screen_icon.png' );

  // strings
  const screenShoppingLabString = require( 'string!UNIT_RATES/screen.shoppingLab' );

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

  return inherit( Screen, ShoppingLabScreen );
} );
