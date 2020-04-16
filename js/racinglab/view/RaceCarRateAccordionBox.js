// Copyright 2017-2020, University of Colorado Boulder

/**
 * Control for setting the rate of the race car.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import URConstants from '../../common/URConstants.js';
import URFont from '../../common/URFont.js';
import RateAccordionBox from '../../common/view/RateAccordionBox.js';
import unitRates from '../../unitRates.js';
import unitRatesStrings from '../../unitRatesStrings.js';

class RaceCarRateAccordionBox extends RateAccordionBox {

  /**
   * @param {RaceCar} car
   * @param {Object} [options]
   */
  constructor( car, options ) {

    options = merge( {
      numeratorUnits: unitRatesStrings.miles,
      denominatorUnits: unitRatesStrings.hours,
      numeratorRange: URConstants.MILES_RANGE,
      denominatorRange: URConstants.HOURS_RANGE,
      numeratorPickerColor: car.color,
      denominatorPickerColor: car.color,
      numeratorPickerUpFunction: miles => ( miles + URConstants.MILES_DELTA ),
      numeratorPickerDownFunction: miles => ( miles - URConstants.MILES_DELTA ),
      denominatorPickerUpFunction: value => ( value + URConstants.HOURS_DELTA ),
      denominatorPickerDownFunction: value => ( value - URConstants.HOURS_DELTA ),
      denominatorDecimals: URConstants.HOURS_DECIMALS,
      pickerFont: new URFont( 20 )
    }, options );

    super( car.rate, options );
  }
}

unitRates.register( 'RaceCarRateAccordionBox', RaceCarRateAccordionBox );

export default RaceCarRateAccordionBox;