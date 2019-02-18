// Copyright 2016-2018, University of Colorado Boulder

/**
 * The candy scene in the Shopping screen.
 * Candy differs significantly from other item types, as described by the ShoppingScene constructor options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var ShoppingScene = require( 'UNIT_RATES/shopping/model/ShoppingScene' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URUtils = require( 'UNIT_RATES/common/URUtils' );

  // strings
  var lbsString = require( 'string!UNIT_RATES/lbs' );
  var poundsCapitalizedString = require( 'string!UNIT_RATES/poundsCapitalized' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var poundString = require( 'string!UNIT_RATES/pound' );

  /**
   * @param {Object} itemData - data structure that describes a type of candy, see ShoppingItemData
   * @param {Object} [options]
   * @constructor
   */
  function CandyScene( itemData, options ) {

    assert && assert( _.includes( _.values( ShoppingItemData.Candy ), itemData ), 'itemData is not a candy' );

    options = _.extend( {

      // range of denominator, in pounds
      fixedAxisRange: new Range( 0, 1.6 ),

      // Candy quantity is in pounds
      quantitySingularUnits: poundString,
      quantityPluralUnits: poundsString,

      // Candy questions require capitalization of 'Pounds', e.g. 'Pounds for $10.50?'
      // This hack was required by https://github.com/phetsims/unit-rates/issues/20
      amountOfQuestionUnits: poundsCapitalizedString,

      // {*|null} nest options for the rate's denominator, defaults provided below
      denominatorOptions: null,

      // Scale displays quantity in 'lbs' for Candy
      scaleQuantityIsDisplayed: true,
      scaleQuantityUnits: lbsString,

      // Major markers have 1 decimal place in the denominator
      isMajorMarker: function( numerator, denominator ) {
        return URUtils.decimalPlaces( denominator ) <= 1;
      }

    }, options );

    options.denominatorOptions = _.extend( {
      axisLabel: poundsString
    }, options.denominatorOptions );

    ShoppingScene.call( this, itemData, options );
  }

  unitRates.register( 'CandyScene', CandyScene );

  return inherit( ShoppingScene, CandyScene );
} );
