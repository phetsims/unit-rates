// Copyright 2017, University of Colorado Boulder

/**
 * Model of a marker on the double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var CREATOR_VALUES = [ 'editor', 'question', 'scale' ]; // how the marker was created

  /**
   * @param {number} numerator
   * @param {number} denominator
   * @param {Object} [options]
   * @constructor
   */
  function Marker( numerator, denominator, options ) {

    options = _.extend( {
      creator: null, // {string|null} how the marker was created, see CREATOR_VALUES
      isMajor: true, // {boolean} true: major marker, false: minor marker //TODO make MarkerNode responsible for this?
      color: 'black', // {Color|string} color used to render the marker
      erasable: true // {boolean} is this marker erased when the Eraser button is pressed?
    }, options );

    assert && assert( !options.creator || _.contains( CREATOR_VALUES, options.creator ),
    'invalid creator: ' + options.creator );

    // @public (read-only)
    this.numerator = numerator;
    this.denominator = denominator;

    // @public (read-only) unpack options
    this.creator = options.creator;
    this.isMajor = options.isMajor;
    this.color = options.color;
    this.erasable = options.erasable;
  }

  unitRates.register( 'Marker', Marker );

  return inherit( Object, Marker, {

    // @public
    toString: function() {
      return 'Marker[' +
             ' rate=' + this.numerator + '/' + this.denominator +
             ' creator=' + this.creator +
             ' isMajor=' + this.isMajor +
             ' erasable=' + this.erasable +
             ' ]';
    },

    /**
     * @param {Object} object
     * @returns {boolean}
     */
    equals: function( object ) {
      return ( object instanceof Marker ) && ( object.numerator === this.numerator ) && ( object.denominator === this.denominator );
    }
  } );
} );
