// Copyright 2017-2020, University of Colorado Boulder

/**
 * Control for setting the rate of the race car.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import URConstants from '../../common/URConstants.js';
import URFont from '../../common/URFont.js';
import RateAccordionBox from '../../common/view/RateAccordionBox.js';
import unitRatesStrings from '../../unit-rates-strings.js';
import unitRates from '../../unitRates.js';

const hoursString = unitRatesStrings.hours;
const milesString = unitRatesStrings.miles;

/**
 * @param {RaceCar} car
 * @param {Object} [options]
 * @constructor
 */
function RaceCarRateAccordionBox( car, options ) {

  options = merge( {
    numeratorUnits: milesString,
    denominatorUnits: hoursString,
    numeratorRange: URConstants.MILES_RANGE,
    denominatorRange: URConstants.HOURS_RANGE,
    numeratorPickerColor: car.color,
    denominatorPickerColor: car.color,
    numeratorPickerUpFunction: function( miles ) { return miles + URConstants.MILES_DELTA; },
    numeratorPickerDownFunction: function( miles ) { return miles - URConstants.MILES_DELTA; },
    denominatorPickerUpFunction: function( value ) { return value + URConstants.HOURS_DELTA; },
    denominatorPickerDownFunction: function( value ) { return value - URConstants.HOURS_DELTA; },
    denominatorDecimals: URConstants.HOURS_DECIMALS,
    pickerFont: new URFont( 20 )
  }, options );

  RateAccordionBox.call( this, car.rate, options );
}

unitRates.register( 'RaceCarRateAccordionBox', RaceCarRateAccordionBox );

inherit( RateAccordionBox, RaceCarRateAccordionBox );
export default RaceCarRateAccordionBox;