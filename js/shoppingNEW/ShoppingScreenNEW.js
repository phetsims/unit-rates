// Copyright 2016, University of Colorado Boulder

/**
 * The 'Shopping' screen
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
  var ShoppingModelNEW = require( 'UNIT_RATES/shoppingNEW/model/ShoppingModelNEW' );
  var ShoppingScreenViewNEW = require( 'UNIT_RATES/shoppingNEW/view/ShoppingScreenViewNEW' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Property = require( 'AXON/Property' );
  var Color = require( 'SCENERY/util/Color' );

  // strings
  var screenShoppingString = require( 'string!UNIT_RATES/screen.shopping' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/shopping_screen_icon.png' );

  /**
   * @param {Object} options
   * @constructor
   */
  function ShoppingScreenNEW( options ) {

    options = _.extend( {
      name: screenShoppingString,
      backgroundColorProperty: new Property( Color.toColor( 'rgb( 226, 255, 249 )' ) ),
      homeScreenIcon: new Image( screenIcon )
    }, options );

    Screen.call( this,
      function() { return new ShoppingModelNEW(); },
      function( model ) { return new ShoppingScreenViewNEW( model ); },
      options
    );
  }

  unitRates.register( 'ShoppingScreenNEW', ShoppingScreenNEW );

  return inherit( Screen, ShoppingScreenNEW );
} );
