// Copyright 2002-2016, University of Colorado Boulder

/**
 * A specific instance of an item (i.e. apple, cucumbers, blue candy) with it's attributes
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
  function ItemMarker( data, count, editable ) {

    var self = this;

    Item.call( this, data, count );

    var correctCost = ( count * data.rate );
    var correctUnit = ( count * ( data.isCandy ? data.weight : 1 ) );

    // @public
    this.costQnA = new QuestionAnswer( correctCost );
    this.unitQnA = new QuestionAnswer( correctUnit );

    this.addProperty( 'editable', editable );
    if( !editable ) {
      this.costQnA.valueProperty.value = correctCost;
      this.unitQnA.valueProperty.value = correctUnit;
    }

    this.costQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if( !allCorrect && value > 0 ) {
        self.costQnA.answerValue = Number( value );
        self.unitQnA.answerValue = value / self.rate;
        self.unitQnA.valueProperty.set( Number( 0 ) );
        self.count = value / self.rate;
      }
    } );

    this.unitQnA.valueProperty.lazyLink( function( value, oldValue ) {
      var allCorrect = self.checkCorrectAnswers();
      if( !allCorrect && value > 0 ) {
        self.unitQnA.answerValue = Number( value );
        self.costQnA.answerValue = value * self.rate;
        self.costQnA.valueProperty.set( Number( 0 ) );
        self.count = Number( value );
      }
    } );
  }

  unitRates.register( 'ItemMarker', ItemMarker );

  return inherit( Item, ItemMarker, {

     /**
     * Convenience function
     * @param {Item} item
     * @returns {boolean}
     * @override @public
     */
    //isEqual: function( item ) {
    //  return ( Item.prototype.isEqual.call( this, item ) && this.editable === item.editable );
    //},

    /**
     * Changes various color/visibility attributes based on the users answer
     * @public
     */
    reset: function() {

      self.count = Number( -1 );

      self.costQnA.answerValue = Number( 0 );
      self.costQnA.valueProperty.value = Number( 0 );

      self.unitQnA.answerValue = Number( 0 );
      self.unitQnA.valueProperty.value = Number( 0 );
    },

    /**
     * Changes various color/visibility attributes based on the users answer
     * @protected
     */
    checkCorrectAnswers: function() {

      var allCorrect = ( this.costQnA.isAnswerCorrect() && this.unitQnA.isAnswerCorrect() );

      this.editable = !allCorrect;

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

} ); //define
