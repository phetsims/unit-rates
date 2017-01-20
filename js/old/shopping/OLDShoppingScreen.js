// Copyright 2016, University of Colorado Boulder

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
  var OLDShoppingModel = require( 'UNIT_RATES/old/shopping/model/OLDShoppingModel' );
  var OLDShoppingScreenView = require( 'UNIT_RATES/old/shopping/view/OLDShoppingScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var screenIcon = require( 'image!UNIT_RATES/shopping_screen_icon.png' );

  // strings
  var screenShoppingString = require( 'string!UNIT_RATES/screen.shopping' );

  /**
   * @param {Object} options
   * @constructor
   */
  function OLDShoppingScreen( options ) {

    options = _.extend( {
      name: screenShoppingString + ' (old)', //TODO
      backgroundColorProperty: new Property( Color.toColor( 'rgb( 226, 255, 249 )' ) ),
      homeScreenIcon: new Image( screenIcon )
    }, options );

    Screen.call( this,
      function() { return new OLDShoppingModel(); },
      function( model ) { return new OLDShoppingScreenView( model ); },
      options
    );
  }

  unitRates.register( 'OLDShoppingScreen', OLDShoppingScreen );

  return inherit( Screen, OLDShoppingScreen );
} );
