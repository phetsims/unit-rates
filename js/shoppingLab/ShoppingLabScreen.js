// Copyright 2016, University of Colorado Boulder

/**
 * The 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Screen = require( 'JOIST/Screen' );
  var ShoppingLabModel = require( 'UNIT_RATES/shoppingLab/model/ShoppingLabModel' );
  var ShoppingLabScreenView = require( 'UNIT_RATES/shoppingLab/view/ShoppingLabScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var screenShoppingLabString = require( 'string!UNIT_RATES/screen.shoppingLab' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/shopping_lab_screen_icon.png' );

  /**
   * @constructor
   */
  function ShoppingLabScreen() {

    var options = {
      name: screenShoppingLabString,
      backgroundColor: 'rgb(226,255,249)',
      homeScreenIcon: new Image( screenIcon )
    };

    Screen.call( this,
      function() { return new ShoppingLabModel(); },
      function( model ) { return new ShoppingLabScreenView( model ); },
      options
    );
  }

  unitRates.register( 'ShoppingLabScreen', ShoppingLabScreen );

  return inherit( Screen, ShoppingLabScreen );

} ); // define
