// Copyright 2017, University of Colorado Boulder

/**
 * The 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Screen = require( 'JOIST/Screen' );

  // sim modules
  var ShoppingLabModel = require( 'UNIT_RATES/shoppinglab/model/ShoppingLabModel' );
  var ShoppingLabScreenView = require( 'UNIT_RATES/shoppinglab/view/ShoppingLabScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/shopping_lab_screen_icon.png' );

  // strings
  var screenShoppingLabString = require( 'string!UNIT_RATES/screen.shoppingLab' );

  /**
   * @param {Object} options
   * @constructor
   */
  function ShoppingLabScreen( options ) {

    options = _.extend( {
      name: screenShoppingLabString,
      backgroundColorProperty: new Property( URColors.screenBackground ),
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
