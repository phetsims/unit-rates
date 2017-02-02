// Copyright 2017, University of Colorado Boulder

/**
 * View-specific Properties for the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RacingLabViewProperties( options ) {

    options = _.extend( {
      doubleNumberLineExpanded1: true,
      doubleNumberLineExpanded2: true,
      rateExpanded1: true,
      rateExpanded2: true
    }, options );

    // @public are the 'Double Number Line' accordion boxes expanded?
    this.doubleNumberLineExpandedProperty1 = new Property( options.doubleNumberLineExpanded1 );
    this.doubleNumberLineExpandedProperty2 = new Property( options.doubleNumberLineExpanded2 );

    // @public are the 'Rate' accordion boxes expanded?
    this.rateExpandedProperty1 = new Property( options.rateExpanded1 );
    this.rateExpandedProperty2 = new Property( options.rateExpanded2 );
  }

  unitRates.register( 'RacingLabViewProperties', RacingLabViewProperties );

  return inherit( Object, RacingLabViewProperties, {

    // @public
    reset: function() {
      this.doubleNumberLineExpandedProperty1.reset();
      this.doubleNumberLineExpandedProperty2.reset();
      this.rateExpandedProperty1.reset();
      this.rateExpandedProperty2.reset();
    }
  } );
} );