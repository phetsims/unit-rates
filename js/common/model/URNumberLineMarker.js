// Copyright 2002-2016, University of Colorado Boulder

/**
 * A derivied Item which has a cost & unit duo of questions and answers. This QuestionAnswer isn't considered 'correct' until the
 * cost & unit answers are both correct. Instances are mainly used the number line model.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var MovableItem = require( 'UNIT_RATES/common/model/MovableItem' );
  var QuestionAnswer = require( 'UNIT_RATES/common/model/QuestionAnswer' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineMarker( correctTopValue, correctBottomValue, rateProperty, options ) {

    var self = this;

    options = _.extend( {
      color:                'black',
      editable:             false,
      topHighPrecision:     1,
      bottomHighPrecision:  2
     }, options || {} );

    MovableItem.call( this, options );

    // @public - all
    this.topQnA    = new QuestionAnswer( this, correctTopValue, correctTopValue );
    this.bottomQnA = new QuestionAnswer( this, correctBottomValue, correctBottomValue );

    // @protected (read-only) - all
    this.rateProperty = rateProperty;
    this.color = options.color;
    this.topHighPrecision = options.topHighPrecision;
    this.bottomHighPrecision = options.bottomHighPrecision;
    this.addProperty( 'outOfRange', false );
    this.addProperty( 'highPrecision', false );
    this.addProperty( 'editable', options.editable );
    if ( !this.editableProperty.value ) {
      this.topQnA.valueProperty.value    = correctTopValue;
      this.bottomQnA.valueProperty.value = correctBottomValue;
    }

    // Clear unit on incorrect cost answers
    this.topQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if ( !allCorrect && value >= 0 ) {
        self.topQnA.answerValue = Number( value );
        self.bottomQnA.answerValue = Util.toFixedNumber( ( value / self.rateProperty.value ), 1 );
        self.bottomQnA.valueProperty.set( Number( -1 ) );
      }
    } );

     // Clear cost on incorrect unit answers
    this.bottomQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if ( !allCorrect && value >= 0 ) {
        self.bottomQnA.answerValue = Number( value );
        self.topQnA.answerValue = Util.toFixedNumber( ( value * self.rateProperty.value ), 2 );
        self.topQnA.valueProperty.set( Number( -1 ) );
      }
    } );
  }

  unitRates.register( 'URNumberLineMarker', URNumberLineMarker );

  return inherit( MovableItem, URNumberLineMarker, {

    /**
     * Checks both the cost & units answers
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
      this.outOfRangeProperty.unlinkAll();
      this.editableProperty.unlinkAll();
    }

  } ); // inherit

} ); // define
