// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Screen = require( 'JOIST/Screen' );
  var ShoppingModel = require( 'UNIT_RATES/shopping/model/ShoppingModel' );
  var ShoppingScreenView = require( 'UNIT_RATES/shopping/view/ShoppingScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var shoppingString = require( 'string!UNIT_RATES/Shopping' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/Shopping-screen-icon.png' );

  /**
   * @constructor
   */
  function ShoppingScreen() {

    Screen.call( this,
      shoppingString,
      new Image( screenIcon ),
      function() { return new ShoppingModel(); },
      function( model ) { return new ShoppingScreenView( model ); },
      { backgroundColor: 'rgb(226,255,249)' }
    );
  }

  unitRates.register( 'ShoppingScreen', ShoppingScreen );

  return inherit( Screen, ShoppingScreen );
} );
