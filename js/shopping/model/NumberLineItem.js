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
  var Item = require( 'UNIT_RATES/shopping/model/Item' );
  var QuestionAnswer = require( 'UNIT_RATES/common/model/QuestionAnswer' );
  var Util = require( 'DOT/Util' );

  /**
   * @param {ItemData} data
   * @param {number} count
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineItem( data, count, options ) {

    var self = this;

    options = _.extend( {
      isChallenge:          false,    // is this QnA associated with a Challenge prompt
      isChallengeUnitRate:  false     // is this QnA associated with the Unit Rate Challenge prompt
    }, options || {} );

    Item.call( this, data, count );

    // @public - all
    this.isChallenge          = options.isChallenge;
    this.isChallengeUnitRate  = options.isChallengeUnitRate;

    // The correct answers
    var correctCost = ( count * data.rate );
    var correctUnit = ( count * ( data.isCandy ? data.weight : 1 ) );

    // @public - all
    this.costQnA = new QuestionAnswer( this, correctCost, correctCost );
    this.unitQnA = new QuestionAnswer( this, correctUnit, correctCost );

    // @public (read-only) - all
    this.addProperty( 'outOfRange', false );
    this.addProperty( 'editable', ( count < 0 ) );
    if ( !this.editableProperty.value ) {
      this.costQnA.valueProperty.value = correctCost;
      this.unitQnA.valueProperty.value = correctUnit;
    }

    // Clear unit on incorrect cost answers
    this.costQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if ( !allCorrect && value >= 0 ) {
        self.costQnA.answerValue = Number( value );
        self.unitQnA.answerValue = Util.toFixedNumber( ( value / self.rate ), 1 );
        self.unitQnA.valueProperty.set( Number( -1 ) );
        self.count = self.unitQnA.answerValue;
      }
    } );

     // Clear cost on incorrect unit answers
    this.unitQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if ( !allCorrect && value >= 0 ) {
        self.unitQnA.answerValue = Number( value );
        self.costQnA.answerValue = Util.toFixedNumber( ( value * self.rate ), 2 );
        self.costQnA.valueProperty.set( Number( -1 ) );
        self.count = self.unitQnA.answerValue;
      }
    } );
  }

  unitRates.register( 'NumberLineItem', NumberLineItem );

  return inherit( Item, NumberLineItem, {

    /**
     * Resets the properties and answer to the default (unanswered) state
     * @public
     */
    reset: function() {

      this.count = Number( -1 );

      if ( this.costQnA ) {
        this.costQnA.answerValue = Number( 0 );
        this.costQnA.valueProperty.value = Number( 0 );
      }

      if ( this.unitQnA ) {
        this.unitQnA.answerValue = Number( 0 );
        this.unitQnA.valueProperty.value = Number( 0 );
      }
    },

    /**
     * Checks both the cost & units answers
     * @returns {boolean}
     * @public
     */
    checkCorrectAnswers: function() {

      var allCorrect = ( this.costQnA.isAnswerCorrect() && this.unitQnA.isAnswerCorrect() );

      this.editableProperty.set( !allCorrect || this.outOfRangeProperty.value );

      return allCorrect;
    },

    /**
     * Returns the number of decimal places in the 'count' (i.e. 1.1 = 1, 1.33 = 2, 1.234 = 3)
     * @return {number}
     * @public
     */
    getCountPrecision: function() {

      var count = Util.roundSymmetric( this.count );

      if ( !isFinite( count ) ) {
        return 0;
      }

      var e = 1;
      var p = 0;
      while ( Util.roundSymmetric( count * e ) / e !== count ) {
        e *= 10; p++;
      }
      return p;
    },

    // @public
    dispose: function() {
      this.costQnA.dispose();
      this.unitQnA.dispose();
      this.outOfRangeProperty.unlinkAll();
      this.editableProperty.unlinkAll();
    }

  } ); // inherit

} ); // define
