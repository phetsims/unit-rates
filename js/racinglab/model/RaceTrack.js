// Copyright 2017-2019, University of Colorado Boulder

/**
 * Model of a race track in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function RaceTrack( options ) {

    options = merge( {
      length: 200, // {number} initial distance between start and finish line, in miles
      maxLength: 200, // {number} maximum distance between start and finish line, in miles
      markerSpacing: 50  // {number} track markers are spaced at this interval, in miles
    }, options );

    // @public (read-only)
    this.maxLength = options.maxLength;
    this.markerSpacing = options.markerSpacing;

    // @public
    this.lengthProperty = new NumberProperty( options.length );

    // validate length, unlink not needed
    this.lengthProperty.link( function( length ) {
      assert && assert( length >= 0 && length <= options.maxLength, 'invalid length: ' + length );
    } );
  }

  unitRates.register( 'RaceTrack', RaceTrack );

  return inherit( Object, RaceTrack, {

    // @public
    reset: function() {
      this.lengthProperty.reset();
    }
  } );
} );
