// Copyright 2017-2019, University of Colorado Boulder

/**
 * Control for setting the rate of the race car.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const RateAccordionBox = require( 'UNIT_RATES/common/view/RateAccordionBox' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URConstants = require( 'UNIT_RATES/common/URConstants' );
  const URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  const hoursString = require( 'string!UNIT_RATES/hours' );
  const milesString = require( 'string!UNIT_RATES/miles' );

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

  return inherit( RateAccordionBox, RaceCarRateAccordionBox );
} );