// Copyright 2016, University of Colorado Boulder

/**
 * Model for the 'Shopping Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var OLDItemData = require( 'UNIT_RATES/old/common/shopping/model/OLDItemData' );
  var OLDURShoppingModel = require( 'UNIT_RATES/old/common/shopping/model/OLDURShoppingModel' );
  var OLDShoppingScene = require( 'UNIT_RATES/old/common/shopping/model/OLDShoppingScene' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var appleImage = require( 'image!UNIT_RATES/apple.png' );
  var carrotImage = require( 'image!UNIT_RATES/carrot.png' );
  var purpleCandyImage = require( 'image!UNIT_RATES/purple_candy.png' );

  /**
   * @param {Object} options
   * @constructor
   */
  function OLDShoppingLabModel( options ) {

    var scenes = [
      new OLDShoppingScene( 'fruit', appleImage, [ OLDItemData.APPLES ] ),
      new OLDShoppingScene( 'produce', carrotImage, [ OLDItemData.CARROTS ] ),
      new OLDShoppingScene( 'candy', purpleCandyImage, [ OLDItemData.PURPLE_CANDY ] )
    ];

    OLDURShoppingModel.call( this, scenes, options );
  }

  unitRates.register( 'OLDShoppingLabModel', OLDShoppingLabModel );

  return inherit( OLDURShoppingModel, OLDShoppingLabModel );
} );
