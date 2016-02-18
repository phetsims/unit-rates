// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Screen = require( 'JOIST/Screen' );
  var ShoppingModel = require( 'UNIT_RATES/shopping/model/ShoppingModel' );
  var ShoppingScreenView = require( 'UNIT_RATES/shopping/view/ShoppingScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var shoppingString = require( 'string!UNIT_RATES/shopping' );

  /**
   * @constructor
   */
  function ShoppingScreen() {

    var icon = new Rectangle( 0, 0, Screen.HOME_SCREEN_ICON_SIZE.width, Screen.HOME_SCREEN_ICON_SIZE.height, {
      fill: 'green'
    } );

    Screen.call( this, shoppingString, icon,
      function() { return new ShoppingModel(); },
      function( model ) { return new ShoppingScreenView( model ); },
      { backgroundColor: 'white' }
    );
  }

  unitRates.register( 'ShoppingScreen', ShoppingScreen );

  return inherit( Screen, ShoppingScreen );
} );