// Copyright 2017, University of Colorado Boulder

/**
 * Control for setting the rate of the race car.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var RateAccordionBox = require( 'UNIT_RATES/common/view/RateAccordionBox' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var milesString = require( 'string!UNIT_RATES/miles' );

  /**
   * @param {RaceCar} car
   * @param {Object} [options]
   * @constructor
   */
  function RaceCarRateAccordionBox( car, options ) {

    options = _.extend( {
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