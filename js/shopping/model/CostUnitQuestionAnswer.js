// Copyright 2002-2016, University of Colorado Boulder

/**
 * A cost & unit duo of questions and answers. Instances are mainly used the number line model.
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

  /**
   * @param {ItemData} data
   * @param {number} [count]
   * @constructor
   */
  function CostUnitQuestionAnswer( data, count ) {

    var self = this;

    Item.call( this, data, count );

    var correctCost = ( count * data.rate );
    var correctUnit = ( count * ( data.isCandy ? data.weight : 1 ) );

    // @public
    this.costQnA = new QuestionAnswer( this, correctCost );
    this.unitQnA = new QuestionAnswer( this, correctUnit );

    // @public (read-only) - all
    this.addProperty( 'outOfRange', false );
    this.addProperty( 'editable', ( count < 0 ) );
    if( !this.editableProperty.value ) {
      this.costQnA.valueProperty.value = correctCost;
      this.unitQnA.valueProperty.value = correctUnit;
    }

    this.costQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if( !allCorrect && value >= 0 ) {
        self.costQnA.answerValue = Number( value );
        self.unitQnA.answerValue = value / self.rate;
        self.unitQnA.valueProperty.set( Number( -1 ) );
        self.count = value / self.rate;
      }
    } );

    this.unitQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if( !allCorrect && value >= 0 ) {
        self.unitQnA.answerValue = Number( value );
        self.costQnA.answerValue = value * self.rate;
        self.costQnA.valueProperty.set( Number( -1 ) );
        self.count = Number( value );
      }
    } );
  }

  unitRates.register( 'CostUnitQuestionAnswer', CostUnitQuestionAnswer );

  return inherit( Item, CostUnitQuestionAnswer, {

    /**
     * Changes various color/visibility attributes based on the users answer
     * @public
     */
    reset: function() {

      this.count = Number( -1 );

      if( this.costQnA ) {
        this.costQnA.answerValue = Number( 0 );
        this.costQnA.valueProperty.value = Number( 0 );
      }

      if( this.unitQnA ) {
        this.unitQnA.answerValue = Number( 0 );
        this.unitQnA.valueProperty.value = Number( 0 );
      }
    },

    /**
     * Changes various color/visibility attributes based on the users answer
     * @protected
     */
    checkCorrectAnswers: function() {

      var allCorrect = ( this.costQnA.isAnswerCorrect() && this.unitQnA.isAnswerCorrect() );

      this.editableProperty.set( !allCorrect || this.outOfRangeProperty.value );

      return allCorrect;
    },

    /**
     *
     * @return {number}
     * @protected
     */
    getCountPrecision: function() {

      if ( !isFinite( this.count ) ) {
        return 0;
      }

      var e = 1;
      var p = 0;
      while ( Math.round( this.count * e ) / e !== this.count ) {
        e *= 10; p++;
      }
      return p;
    }

  } ); // inherit

} ); // define
