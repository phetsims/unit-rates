// Copyright 2016-2019, University of Colorado Boulder

/**
 * The candy scene in the Shopping screen.
 * Candy differs significantly from other item types, as described by the ShoppingScene constructor options.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Range from '../../../../dot/js/Range.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import URUtils from '../../common/URUtils.js';
import unitRatesStrings from '../../unit-rates-strings.js';
import unitRates from '../../unitRates.js';
import ShoppingItemData from './ShoppingItemData.js';
import ShoppingScene from './ShoppingScene.js';

const lbsString = unitRatesStrings.lbs;
const poundsCapitalizedString = unitRatesStrings.poundsCapitalized;
const poundsString = unitRatesStrings.pounds;
const poundString = unitRatesStrings.pound;

/**
 * @param {Object} itemData - data structure that describes a type of candy, see ShoppingItemData
 * @param {Object} [options]
 * @constructor
 */
function CandyScene( itemData, options ) {

  assert && assert( _.includes( _.values( ShoppingItemData.Candy ), itemData ), 'itemData is not a candy' );

  options = merge( {

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

  options.denominatorOptions = merge( {
    axisLabel: poundsString
  }, options.denominatorOptions );

  ShoppingScene.call( this, itemData, options );
}

unitRates.register( 'CandyScene', CandyScene );

inherit( ShoppingScene, CandyScene );
export default CandyScene;