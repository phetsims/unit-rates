// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ShoppingLabModel = require( 'UNIT_RATES/shoppingLab/model/ShoppingLabModel' );
  var ShoppingLabScreenView = require( 'UNIT_RATES/shoppingLab/view/ShoppingLabScreenView' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var screenShoppingLabString = require( 'string!UNIT_RATES/screen.shoppingLab' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/Shopping-Lab-screen-icon.png' );

  /**
   * @constructor
   */
  function ShoppingLabScreen() {

    Screen.call( this,
      screenShoppingLabString,
      new Image( screenIcon ),
      function() { return new ShoppingLabModel(); },
      function( model ) { return new ShoppingLabScreenView( model ); },
      { backgroundColor: 'rgb(226,255,249)' }
    );
  }

  unitRates.register( 'ShoppingLabScreen', ShoppingLabScreen );

  return inherit( Screen, ShoppingLabScreen, {

    } ); // inherit

} ); // define
