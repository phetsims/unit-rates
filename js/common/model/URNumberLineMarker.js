// Copyright 2016, University of Colorado Boulder

/**
 * Consolidates two QuestionAnswer classes into a number line marker. A marker is considered 'editable' until both
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
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var Property = require( 'AXON/Property' );
  var QuestionAnswer = require( 'UNIT_RATES/common/model/QuestionAnswer' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {number} correctTopValue - the correct value for the top X-axis entry
   * @param {number} correctBottomValue  - the correct value for the bottom X-axis entry
   * @param {Property.<number>} rateProperty - the current unit rate of the model/number line
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineMarker( correctTopValue, correctBottomValue, rateProperty, options ) {

    options = _.extend( {
      color: 'black',
      editable: false,
      topDecimalPlaces: 2,        // # decimals place for display
      bottomDecimalPlaces: 1,        // # decimals place for display
      topHighPrecision: 1,        // # decimals which makes a marker a 'high precision', potentially display differently
      bottomHighPrecision: 2         // # decimals which makes a marker a 'high precision', potentially display differently
    }, options );

    Movable.call( this, options );

    // @public
    this.topQnA = new QuestionAnswer( this, correctTopValue, correctTopValue );
    this.bottomQnA = new QuestionAnswer( this, correctBottomValue, correctBottomValue );

    // @protected (read-only)
    this.rateProperty = rateProperty;
    this.color = options.color;
    this.topDecimalPlaces = options.topDecimalPlaces;
    this.bottomDecimalPlaces = options.bottomDecimalPlaces;
    this.topHighPrecision = options.topHighPrecision;
    this.bottomHighPrecision = options.bottomHighPrecision;

    // @public
    this.outOfRangeProperty = new Property( false );
    this.highPrecisionProperty = new Property( false );
    this.editableProperty = new Property( options.editable );

    // non-editable markers are automatically 'correct'
    if ( !this.editableProperty.value ) {
      this.topQnA.valueProperty.value = correctTopValue;
      this.bottomQnA.valueProperty.value = correctBottomValue;
    }

    // On incorrect top values, assign new correct bottom answers
    this.onTopValueChangeBound = this.onTopValueChange.bind( this );
    this.topQnA.valueProperty.lazyLink( this.onTopValueChangeBound );

    // On incorrect bottom values, assign new correct top answers
    this.onBottomValueChangeBound = this.onBottomValueChange.bind( this );
    this.bottomQnA.valueProperty.lazyLink( this.onBottomValueChangeBound );

    // Update top QnA on rate change
    this.onRateChangeBound = this.onRateChange.bind( this );
    this.rateProperty.lazyLink( this.onRateChangeBound );
  }

  unitRates.register( 'URNumberLineMarker', URNumberLineMarker );

  return inherit( Movable, URNumberLineMarker, {

    // @public
    reset: function() {

      Movable.prototype.reset.call( this );

      this.outOfRangeProperty.reset();
      this.highPrecisionProperty.reset();
      this.editableProperty.reset();

      if ( this.topQnA ) {
        this.topQnA.answerValue = Number( 0 );
        this.topQnA.valueProperty.value = Number( 0 );
      }

      if ( this.bottomQnA ) {
        this.bottomQnA.answerValue = Number( 0 );
        this.bottomQnA.valueProperty.value = Number( 0 );
      }
    },

    // @public
    dispose: function() {

      Movable.prototype.dispose.call( this );

      this.topQnA.valueProperty.unlink( this.onTopValueChangeBound );
      this.topQnA.dispose();

      this.bottomQnA.valueProperty.unlink( this.onBottomValueChangeBound );
      this.bottomQnA.dispose();

      //TODO call dispose for this Property?
      this.rateProperty.unlink( this.onRateChangeBound );

      //TODO call dispose for these Properties?
      this.outOfRangeProperty.unlinkAll();
      this.highPrecisionProperty.unlinkAll();
      this.editableProperty.unlinkAll();
    },

    /**
     * On incorrect top values, assign new correct bottom answers
     *
     * @param {number} value
     * @param {number} oldValue
     * @public
     */
    onTopValueChange: function( value, oldValue ) {
      var allCorrect = this.checkCorrectAnswers();
      if ( !allCorrect && value >= 0 ) {
        this.topQnA.answerValue = Number( value );
        this.bottomQnA.answerValue = value / this.rateProperty.value;
        this.bottomQnA.valueProperty.value = Number( -1 );
      }
    },

    /**
     * On incorrect bottom values, assign new correct top answers
     *
     * @param {number} value
     * @param {number} oldValue
     * @public
     */
    onBottomValueChange: function( value, oldValue ) {
      var allCorrect = this.checkCorrectAnswers();
      if ( !allCorrect && value >= 0 ) {
        this.bottomQnA.answerValue = Number( value );
        this.topQnA.answerValue = value * this.rateProperty.value;
        this.topQnA.valueProperty.value = Number( -1 );
      }
    },

    /**
     * Changes the top & bottom correct answers when the unit rate changes
     *
     * @param {number} rate
     * @param {number} oldRate
     * @public
     */
    onRateChange: function( rate, oldRate ) {
      if ( !this.editableProperty.value ) {
        this.topQnA.answerValue = this.bottomQnA.valueProperty.value * rate;
        this.topQnA.valueProperty.value = this.topQnA.answerValue;

        this.bottomQnA.answerValue = this.topQnA.valueProperty.value / rate;
        this.bottomQnA.valueProperty.value = this.bottomQnA.answerValue;
      }
    },

    /**
     * returns the current top value
     *
     * @returns {number}
     * @public
     */
    getTopValue: function() {
      return this.topQnA.valueProperty.value;
    },

    /**
     * returns the current bottom value
     *
     * @returns {number}
     * @public
     */
    getBottomValue: function() {
      return this.bottomQnA.valueProperty.value;
    },

    /**
     * Checks both the top & bottom answers for correctness
     *
     * @returns {boolean}
     * @public
     */
    checkCorrectAnswers: function() {

      var topPrecision = this.topQnA.getAnswerPrecision();
      var bottomPrecision = this.bottomQnA.getAnswerPrecision();
      this.highPrecisionProperty.value = ( topPrecision >= this.topHighPrecision || bottomPrecision >= this.bottomHighPrecision );

      var allCorrect = ( this.topQnA.isAnswerCorrect() && this.bottomQnA.isAnswerCorrect() );

      this.editableProperty.value = ( !allCorrect || this.outOfRangeProperty.value );

      return allCorrect;
    },

    /**
     * Tells whether a marker is 'removable'. Markers which are 'removable' are those which
     * are either still editable (i.e. not locked in) or those which have fractional values past a specified precision.
     *
     * @returns {boolean}
     * @private
     */
    isRemovable: function() {
      return ( this.editableProperty.value || this.highPrecisionProperty.value );
    }

  } ); // inherit

} ); // define
