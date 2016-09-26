// Copyright 2002-2016, University of Colorado Boulder

/**
 * Consolidates two QuestionAnswer classes into a number line marker. A marker is considered 'edtiable' until both
 * QuestionAnswers are answered correctly. Markers can also be tagged as 'out of range' (aka. off the end of the
 * number line)in which they will remain as 'editable'. Markers can also be marked as of 'high precision' (which means
 * they will have a different visual representation on the NL.)
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var QuestionAnswer = require( 'UNIT_RATES/common/model/QuestionAnswer' );

  /**
   * @param {number} answerValue - the correct answer value
   * @param {number} answerText - the text to display on a correct answer value
   * @param {Property.<number>} rateProperty - the current unit rate of the model/number line
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineMarker( correctTopValue, correctBottomValue, rateProperty, options ) {

    options = _.extend( {
      color:                'black',
      editable:             false,
      topDecimalPlaces:     2,        // # decimals place for display
      bottomDecimalPlaces:  1,        // # decimals place for display
      topHighPrecision:     1,        // # decimals which makes a marker a 'high precision', potentially display differently
      bottomHighPrecision:  2         // # decimals which makes a marker a 'high precision', potentially display differently
     }, options || {} );

    Movable.call( this, options );

    var self = this;

    // @public - all
    this.topQnA    = new QuestionAnswer( this, correctTopValue, correctTopValue );
    this.bottomQnA = new QuestionAnswer( this, correctBottomValue, correctBottomValue );

    // @protected (read-only) - all
    this.rateProperty         = rateProperty;
    this.color                = options.color;
    this.topDecimalPlaces     = options.topDecimalPlaces;
    this.bottomDecimalPlaces  = options.bottomDecimalPlaces;
    this.topHighPrecision     = options.topHighPrecision;
    this.bottomHighPrecision  = options.bottomHighPrecision;

    // @public (read-write) - all
    this.addProperty( 'outOfRange', false );
    this.addProperty( 'highPrecision', false );
    this.addProperty( 'editable', options.editable );

    // non-editable markers are automatically 'correct'
    if ( !this.editableProperty.value ) {
      this.topQnA.valueProperty.value    = correctTopValue;
      this.bottomQnA.valueProperty.value = correctBottomValue;
    }

    // On incorrect top values, assign new correct bottom answers
    this.topQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if ( !allCorrect && value >= 0 ) {
        self.topQnA.answerValue = Number( value );
        self.bottomQnA.answerValue = value / self.rateProperty.value;
        self.bottomQnA.valueProperty.set( Number( -1 ) );
      }
    } );

    // On incorrect bottom values, assign new correct top answers
    this.bottomQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if ( !allCorrect && value >= 0 ) {
        self.bottomQnA.answerValue = Number( value );
        self.topQnA.answerValue = value * self.rateProperty.value;
        self.topQnA.valueProperty.set( Number( -1 ) );
      }
    } );

    // Update top QnA on rate change
    this.rateProperty.lazyLink( this.onRateChange.bind( this ) );
  }

  unitRates.register( 'URNumberLineMarker', URNumberLineMarker );

  return inherit( Movable, URNumberLineMarker, {

    /**
     * Changes the top & bottom correct answers when the unit rate changes
     * @param {number} rate
     * @param {number} oldRate
     * @public
     */
    onRateChange: function( rate, oldRate ) {
      if( !this.editableProperty.value ) {
        this.topQnA.answerValue = this.bottomQnA.valueProperty.value * rate;
        this.topQnA.valueProperty.value = this.topQnA.answerValue;

        this.bottomQnA.answerValue = this.topQnA.valueProperty.value / rate;
        this.bottomQnA.valueProperty.value = this.bottomQnA.answerValue;
      }
    },

    /**
     * returns the current top value
     * @returns {number}
     * @public
     */
    getTopValue: function() {
      return this.topQnA.valueProperty.value;
    },

    /**
     * returns the current bottom value
     * @returns {number}
     * @public
     */
    getBottomValue: function() {
      return this.bottomQnA.valueProperty.value;
    },

    /**
     * Checks both the top & bottom answers for correctness
     * @returns {boolean}
     * @public
     */
    checkCorrectAnswers: function() {

      var topPrecision    = this.topQnA.getAnswerPrecision();
      var bottomPrecision = this.bottomQnA.getAnswerPrecision();
      this.highPrecisionProperty.set( topPrecision >= this.topHighPrecision || bottomPrecision >= this.bottomHighPrecision );

      var allCorrect = ( this.topQnA.isAnswerCorrect() && this.bottomQnA.isAnswerCorrect() );

      this.editableProperty.set( !allCorrect || this.outOfRangeProperty.value );

      return allCorrect;
    },

     /**
     * Tells whether a marker is 'removable'. Markers which are 'removable' are those which
     * are either still editable (i.e. not locked in) or those which have fractional values past a specified precision.
     * @returns {boolean}
     * @private
     */
    isRemovable: function() {
      return ( this.editableProperty.value || this.highPrecisionProperty.value );
    },

    /**
     * Resets the properties and answer to the default (unanswered) state
     * @public
     */
    reset: function() {

      if ( this.topQnA ) {
        this.topQnA.answerValue = Number( 0 );
        this.topQnA.valueProperty.value = Number( 0 );
      }

      if ( this.bottomQnA ) {
        this.bottomQnA.answerValue = Number( 0 );
        this.bottomQnA.valueProperty.value = Number( 0 );
      }

      this.highPrecisionProperty.reset();
      this.editableProperty.reset();
    },

    // @public
    dispose: function() {
      this.topQnA.dispose();
      this.bottomQnA.dispose();
      this.rateProperty.unlink( this.onRateChange.bind( this ) );
      this.outOfRangeProperty.unlinkAll();
      this.highPrecisionProperty.unlinkAll();
      this.editableProperty.unlinkAll();
    }

  } ); // inherit

} ); // define
