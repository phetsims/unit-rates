// Copyright 2016, University of Colorado Boulder

/**
 * Model for the 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemData = require( 'UNIT_RATES/common/shopping/model/ItemData' );
  var ShoppingScene = require( 'UNIT_RATES/common/shopping/model/ShoppingScene' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URShoppingModel = require( 'UNIT_RATES/common/shopping/model/URShoppingModel' );

  // images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );

  /**
   * @param {Object} options
   * @constructor
   */
  function ShoppingLabModel( options ) {

    var scenes = [
      new ShoppingScene( 'fruit', appleImage, [ ItemData.APPLES ] ),
      new ShoppingScene( 'produce', carrotImage, [ ItemData.CARROTS ] ),
      new ShoppingScene( 'candy', purpleCandyImage, [ ItemData.PURPLE_CANDY ] )
    ];

    URShoppingModel.call( this, scenes, options );
  }

  unitRates.register( 'ShoppingLabModel', ShoppingLabModel );

  return inherit( URShoppingModel, ShoppingLabModel );
} );
