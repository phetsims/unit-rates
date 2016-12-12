// Copyright 2016, University of Colorado Boulder

/**
 * An item in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  /**
   * @param {Object} itemData - data structure that describes a type of item, see for example Fruit.APPLES
   * @param {Question} unitRateQuestion - 'Unit Rate?' question
   * @param {Question[][]} questionSets - sets of questions
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItem( itemData, unitRateQuestion, questionSets, options ) {

    options = _.extend( {

      // index of the question set that is initially selected, randomly chosen
      questionSetIndex: URQueryParameters.randomEnabled ? phet.joist.random.nextIntBetween( 0, questionSets.length - 1 ) : 0
    }, options );

    // @public (read-only)
    this.unitRate = itemData.unitRate;
    this.bagRate = itemData.bagRate;
    this.numberOfBags = itemData.numberOfBags;
    this.singularName = itemData.singularName;
    this.pluralName = itemData.pluralName;
    this.numeratorName = itemData.numeratorName;
    this.denominatorName = itemData.denominatorName;
    this.itemImage = itemData.itemImage;
    this.bagImage = itemData.bagImage;
    this.unitRateQuestion = unitRateQuestion;

    // @private
    this.questionSets = questionSets;

    // @public {Property.<Question[]>} the current set of questions
    this.questionSetProperty = new Property( questionSets[ options.questionSetIndex ] );

    // @private {Question[][]} sets of questions that are available for selection
    this.availableQuestionSets = questionSets.slice();
    this.availableQuestionSets.splice( options.questionSetIndex, 1 );

    // @private {Question[][]} sets of question that have already been selected
    this.selectedQuestionSets = [ this.questionSetProperty.value ];
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

  return inherit( Object, ShoppingItem, {

    // @public
    reset: function() {

      // reset all Questions
      this.unitRateQuestion.reset();
      this.questionSets.forEach( function( questionSet ) {
        questionSet.forEach( function( question ) {
            question.reset();
        } );
      } );

      // choose the next set of questions
      this.nextQuestionSet();
    },

    /**
     * Randomly chooses the next set of questions. The same set will not be selected consecutively,
     * and a selected set will not be re-selected until all sets have been selected.
     * @public
     */
    nextQuestionSet: function() {

      // replenish the available sets of questions, excluding the current set of questions
      if ( this.availableQuestionSets.length === 0 ) {
        var currentQuestionSet = this.questionSetProperty.value;
        this.availableQuestionSets = this.selectedQuestionSets;
        this.availableQuestionSets.splice( this.availableQuestionSets.indexOf( currentQuestionSet ), 1 );
        this.selectedQuestionSets = [ currentQuestionSet ];
      }

      // randomly select a set of questions
      var nextIndex = URQueryParameters.randomEnabled ? phet.joist.random.nextIntBetween( 0, this.availableQuestionSets.length - 1 ) : 0;
      var nextQuestionSet = this.availableQuestionSets[ nextIndex ];
      assert && assert( nextQuestionSet, 'nextQuestionSet is null, nextIndex=' + nextIndex );
      assert && assert( nextQuestionSet !== this.questionSetProperty.value, 'repeated questions' );

      // move the set of questions from available to selected
      this.availableQuestionSets.splice( this.availableQuestionSets.indexOf( nextQuestionSet ), 1 );
      this.selectedQuestionSets.push( nextQuestionSet );

      this.questionSetProperty.value = nextQuestionSet;
    }
  } );
} );
