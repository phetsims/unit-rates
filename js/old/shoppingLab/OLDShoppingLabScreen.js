// Copyright 2016, University of Colorado Boulder

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
  var OLDShoppingLabModel = require( 'UNIT_RATES/old/shoppingLab/model/OLDShoppingLabModel' );
  var OLDShoppingLabScreenView = require( 'UNIT_RATES/old/shoppingLab/view/OLDShoppingLabScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/shopping_lab_screen_icon.png' );

  // strings
  var screenShoppingLabString = require( 'string!UNIT_RATES/screen.shoppingLab' );

  /**
   * @param {Object} options
   * @constructor
   */
  function OLDShoppingLabScreen( options ) {

    options = _.extend( {
      name: screenShoppingLabString + ' (old)', //TODO
      backgroundColorProperty: new Property( 'rgb( 226, 255, 249 )' ),
      homeScreenIcon: new Image( screenIcon )
    }, options );

    Screen.call( this,
      function() { return new OLDShoppingLabModel(); },
      function( model ) { return new OLDShoppingLabScreenView( model ); },
      options
    );
  }

  unitRates.register( 'OLDShoppingLabScreen', OLDShoppingLabScreen );

  return inherit( Screen, OLDShoppingLabScreen );
} );
