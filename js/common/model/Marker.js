// Copyright 2017-2018, University of Colorado Boulder

/**
 * Model of a marker, used to indicate a rate on the double number line.
 * Markers can be major or minor (with semantics similar to major and minor tick marks on a slider).
 * Markers have an associated creator, which determines their precedence; markers created by higher precedence creators
 * will replace markers created by lower precedence creators.  For example, a marker created by answering a question
 * will replace a marker that was created with the marker editor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Property = require( 'AXON/Property' );
  const unitRates = require( 'UNIT_RATES/unitRates' );

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
    this.numeratorProperty = new NumberProperty( numerator );
    this.denominatorProperty = new NumberProperty( denominator );
    this.colorProperty = new Property( options.color );
    this.erasable = options.erasable;

    // @public (read-only)
    this.creator = creator;
    this.isMajor = options.isMajor;
  }

  unitRates.register( 'Marker', Marker );

  return inherit( Object, Marker, {

    /**
     * String representation. For debugging and logging only. Do not rely on the format of this!
     * @returns {string}
     * @public
     */
    toString: function() {
      return 'Marker[' +
             ' rate=' + this.numeratorProperty.value + '/' + this.denominatorProperty.value +
             ' creator=' + this.creator +
             ' isMajor=' + this.isMajor +
             ' erasable=' + this.erasable +
             ' ]';
    },

    /**
     * Does the specified marker conflict with this one?
     * Two markers conflict if they have the same numerator or denominator.
     * This is possible due to rounding errors.
     * See https://github.com/phetsims/unit-rates/issues/148.
     * @param {Marker} marker
     * @returns {boolean}
     * @public
     */
    conflictsWith: function( marker ) {
      assert && assert( marker instanceof Marker );
      return ( marker.numeratorProperty.value === this.numeratorProperty.value ) ||
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
      assert && assert( thisIndex !== -1, 'invalid creator: ' + this.creator );

      var thatIndex = CREATOR_VALUES.indexOf( marker.creator );
      assert && assert( thatIndex !== -1, 'invalid creator: ' + marker.creator );

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
