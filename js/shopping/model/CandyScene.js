// Copyright 2016-2017, University of Colorado Boulder

/**
 * The candy scene in the Shopping screen.
 * Candy differs significantly from other item types, as described by the ShoppingScene constructor options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Range = require( 'DOT/Range' );

  // sim modules
  var ShoppingScene = require( 'UNIT_RATES/shopping/model/ShoppingScene' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var lbsString = require( 'string!UNIT_RATES/lbs' );
  var poundString = require( 'string!UNIT_RATES/pound' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var poundsUppercaseString = require( 'string!UNIT_RATES/poundsUppercase' );

  /**
   * @param {Object} itemData - data structure that describes a type of candy, see ShoppingItemData
   * @constructor
   */
  function CandyScene( itemData ) {
    ShoppingScene.call( this, itemData, {

      // Candy questions use 'pound' and 'pounds' for the units, e.g. 'Cost of 2.2 pounds?'
      questionSingularUnits: poundString,
      questionPluralUnits: poundsString,

      // Candy questions require capitalization of 'Pounds', e.g. 'Pounds for $10.50?'
      // This hack was required by https://github.com/phetsims/unit-rates/issues/20
      amountOfQuestionUnits: poundsUppercaseString,

      // Bottom axis of the double number line
      denominatorOptions: {
        axisLabel: poundsString,
        axisRange: new Range( 0, 1.6 ),
        majorMarkerDecimals: 1
      },

      // Scale displays quantity in 'lbs' for Candy
      scaleQuantityIsDisplayed: true,
      scaleQuantityUnits: lbsString
    } );
  }

  unitRates.register( 'CandyScene', CandyScene );

  return inherit( ShoppingScene, CandyScene );
} );
