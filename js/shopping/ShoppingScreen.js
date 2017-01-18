// Copyright 2016-2017, University of Colorado Boulder

/**
 * The 'Shopping' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Color = require( 'SCENERY/util/Color' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // sim modules
  var ShoppingModel = require( 'UNIT_RATES/shopping/model/ShoppingModel' );
  var ShoppingScreenView = require( 'UNIT_RATES/shopping/view/ShoppingScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/shopping_screen_icon.png' );

  // strings
  var screenShoppingString = require( 'string!UNIT_RATES/screen.shopping' );

  /**
   * @param {Object} options
   * @constructor
   */
  function ShoppingScreen( options ) {

    options = _.extend( {
      name: screenShoppingString,
      backgroundColorProperty: new Property( Color.toColor( 'rgb( 226, 255, 249 )' ) ),
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
