// Copyright 2017, University of Colorado Boulder

/**
 * View-specific Properties for the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @constructor
   */
  function RacingLabViewProperties() {

    // @public are the 'Double Number Line' accordion boxes expanded?
    this.doubleNumberLineExpandedProperty1 = new Property( true );
    this.doubleNumberLineExpandedProperty2 = new Property( true );

    // @public are the 'Rate' accordion boxes expanded?
    this.rateExpandedProperty1 = new Property( true );
    this.rateExpandedProperty2 = new Property( true );

    // @public are the race timers expanded?
    this.timerExpandedProperty1 = new Property( true );
    this.timerExpandedProperty2 = new Property( true );
  }

  unitRates.register( 'RacingLabViewProperties', RacingLabViewProperties );

  return inherit( Object, RacingLabViewProperties, {

    // @public
    reset: function() {
      this.doubleNumberLineExpandedProperty1.reset();
      this.doubleNumberLineExpandedProperty2.reset();
      this.rateExpandedProperty1.reset();
      this.rateExpandedProperty2.reset();
      this.timerExpandedProperty1.reset();
      this.timerExpandedProperty2.reset();
    }
  } );
} );