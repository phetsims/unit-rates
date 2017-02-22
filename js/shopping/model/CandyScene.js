// Copyright 2016-2017, University of Colorado Boulder

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
  var ShoppingScene = require( 'UNIT_RATES/shopping/model/ShoppingScene' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  // strings
  var lbsString = require( 'string!UNIT_RATES/lbs' );
  var poundString = require( 'string!UNIT_RATES/pound' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var poundsCapitalizedString = require( 'string!UNIT_RATES/poundsCapitalized' );

  /**
   * @param {Object} itemData - data structure that describes a type of candy, see ShoppingItemData
   * @param {Object} [options]
   * @constructor
   */
  function CandyScene( itemData, options ) {

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
        return URUtil.decimalPlaces( denominator ) <= 1;
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
