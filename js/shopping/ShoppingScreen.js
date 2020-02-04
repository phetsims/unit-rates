// Copyright 2016-2020, University of Colorado Boulder

/**
 * The 'Shopping' screen
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
  const ShoppingModel = require( 'UNIT_RATES/shopping/model/ShoppingModel' );
  const ShoppingScreenView = require( 'UNIT_RATES/shopping/view/ShoppingScreenView' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URColors = require( 'UNIT_RATES/common/URColors' );

  // images
  const screenIcon = require( 'image!UNIT_RATES/shopping_screen_icon.png' );

  // strings
  const screenShoppingString = require( 'string!UNIT_RATES/screen.shopping' );

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

  return inherit( Screen, ShoppingScreen );
} );
