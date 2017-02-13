// Copyright 2017, University of Colorado Boulder

/**
 * Model of a marker, used to indicate a rate on the double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  // how the marker was created, ordered by ascending precedence
  var CREATOR_VALUES = [ 'editor', 'scale', 'question', 'race' ];

  /**
   * @param {number} numerator
   * @param {number} denominator
   * @param {string} creator - indicates how the marker was created, see CREATOR_VALUES
   * @param {Object} [options]
   * @constructor
   */
  function Marker( numerator, denominator, creator, options ) {

    options = _.extend( {
      isMajor: true, // {boolean} true: major marker, false: minor marker
      color: 'black', // {Color|string} color used to render the marker
      erasable: true // {boolean} is this marker erased when the Eraser button is pressed?
    }, options );

    assert && assert( _.includes( CREATOR_VALUES, creator ), 'invalid creator: ' + creator );

    // @public
    this.numeratorProperty = new Property( numerator );
    this.denominatorProperty = new Property( denominator );

    // @public (read-only)
    this.creator = creator;

    // @public (read-only) unpack options
    this.isMajor = options.isMajor;
    this.erasable = options.erasable;

    // @public color is mutable
    this.colorProperty = new Property( options.color );
  }

  unitRates.register( 'Marker', Marker );

  return inherit( Object, Marker, {

    // @public
    toString: function() {
      return 'Marker[' +
             ' rate=' + this.numeratorProperty.value + '/' + this.denominatorProperty.value +
             ' creator=' + this.creator +
             ' isMajor=' + this.isMajor +
             ' erasable=' + this.erasable +
             ' ]';
    },

    /**
     * Does the specified marker have the same rate?
     * @param {Marker} marker
     * @returns {boolean}
     * @public
     */
    rateEquals: function( marker ) {
      assert && assert( marker instanceof Marker );
      return ( marker.numeratorProperty.value === this.numeratorProperty.value ) &&
             ( marker.denominatorProperty.value === this.denominatorProperty.value );
    },

    /**
     * Gets the precedence of the specified marker, relative to this marker.
     * @param {Marker} marker
     * @returns {number}
     *    1 : marker has higher precedence
     *   -1 : marker has lower precedence
     *    0 : marker has same precedence
     * @public
     */
    precedenceOf: function( marker ) {

      var thisIndex = CREATOR_VALUES.indexOf( this.creator );
      assert && assert( thisIndex !== - 1, 'invalid creator: ' + this.creator );

      var thatIndex = CREATOR_VALUES.indexOf( marker.creator );
      assert && assert( thatIndex !== - 1, 'invalid creator: ' + marker.creator );

      if ( thatIndex > thisIndex ) {
        return 1;
      }
      else if ( thatIndex < thisIndex ) {
        return -1;
      }
      else {
        return 0;
      }
    }
  } );
} );
