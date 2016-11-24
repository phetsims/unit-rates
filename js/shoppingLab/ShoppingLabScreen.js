// Copyright 2016, University of Colorado Boulder

/**
 * The 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
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
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var screenShoppingLabString = require( 'string!UNIT_RATES/screen.shoppingLab' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/shopping_lab_screen_icon.png' );

  /**
   * @param {Object} options
   * @constructor
   */
  function ShoppingLabScreen( options ) {

    options = _.extend( {
      name: screenShoppingLabString,
      backgroundColorProperty: new Property( Color.toColor( 'rgb( 226, 255, 249 )' ) ),
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
