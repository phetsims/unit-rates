// Copyright 2017, University of Colorado Boulder

/**
 * Model of a marker, used to indicate a rate on the double number line.
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
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  // constants
  // how the marker was created determines, ordered by ascending precedence
  var CREATOR_VALUES = [ 'editor', 'scale', 'question' ];

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

    assert && assert( _.contains( CREATOR_VALUES, creator ), 'invalid creator: ' + creator );

    // @public
    this.numeratorProperty = new Property( numerator );

    // @public (read-only)
    this.denominator = denominator;
    this.creator = creator;

    // @public (read-only) unpack options
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
     * Does the specified marker have the same rate?
     * @param {Marker} marker
     * @returns {boolean}
     */
    rateEquals: function( marker ) {
      assert && assert( marker instanceof Marker );
      return ( marker.numerator === this.numerator ) && ( marker.denominator === this.denominator );
    },

    /**
     * Gets the precedence of the specified marker, relative to this marker.
     * @param {Marker} marker
     * @returns {number}
     *    1 : marker has higher precedence
     *   -1 : marker has lower precedence
     *    0 : marker has same precedence
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
  }, {

    /**
     * Creates a marker for a question.
     * @param {ShoppingQuestion} question
     * @param {Color|string} color
     * @param {number} majorMarkerDecimals - major markers have at most this number of decimal places
     * @returns {Marker}
     * @static
     */
    createQuestionMarker: function( question, color, majorMarkerDecimals ) {
      return new Marker( question.numerator, question.denominator, 'question', {
        isMajor: ( URUtil.decimalPlaces( question.denominator ) <= majorMarkerDecimals ),
        color: color,
        erasable: false
      } );
    }
  } );
} );
