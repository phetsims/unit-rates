// Copyright 2017, University of Colorado Boulder

/**
 * Model of a track in the 'Racing Lab' screen.
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
   * @param {Object} [options]
   * @constructor
   */
  function RaceTrack( options ) {

    options = _.extend( {
      length: 150, // initial distance between start and finish line, in miles
      maxLength: 200, // maximum distance between start and finish line, in miles
      markerSpacing: 50  // markers are spaced at this interval, in miles
    }, options );

    // @public (read-only)
    this.maxLength = options.maxLength;
    this.markerSpacing = options.markerSpacing;

    // @public
    this.lengthProperty = new Property( options.length );
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
