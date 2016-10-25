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

  /**
   * @param {Object} itemDescription - see Fruit.APPLES for an example
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItem( itemDescription, options ) {

    options = _.extend( {

      // index of the question that is initially selected, randomly chosen
      questionIndex: phet.joist.random.nextIntBetween( 0, itemDescription.questions.length - 1 )
    }, options );

    // @public (read-only)
    this.unitRate = itemDescription.unitRate;
    this.bagRate = itemDescription.bagRate;
    this.numberOfBags = itemDescription.numberOfBags;
    this.singularName = itemDescription.singularName;
    this.pluralName = itemDescription.pluralName;
    this.numeratorName = itemDescription.numeratorName;
    this.denominatorName = itemDescription.denominatorName;
    this.itemImage = itemDescription.itemImage;
    this.bagImage = itemDescription.bagImage;

    // @public the current set of questions
    this.questionsProperty = new Property( itemDescription.questions[ options.questionIndex ] );

    // @private sets of questions that are available for selection
    this.availableQuestionSets = itemDescription.questions.slice();
    this.availableQuestionSets.splice( options.questionIndex, 1 );

    // @private sets of question that have already been selected
    this.selectedQuestionSets = [ this.questionsProperty.value ];
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

  return inherit( Object, ShoppingItem, {

    // @public
    reset: function() {
      this.nextQuestions();
    },

    /**
     * Randomly chooses the next set of questions. The same set will not be selected consecutivel,
     * and a selected set will not be re-selected until all sets have been selected.
     *
     * @public
     */
    nextQuestions: function() {

      // replenish the available sets of questions, excluding the current set of questions
      if ( this.availableQuestionSets.length === 0 ) {
        var currentQuestionSet = this.questionsProperty.value;
        this.availableQuestionSets = this.selectedQuestionSets;
        this.availableQuestionSets.splice( this.availableQuestionSets.indexOf( currentQuestionSet ), 1 );
        this.selectedQuestionSets = [ currentQuestionSet ];
      }

      // randomly select a set of questions
      var nextIndex = phet.joist.random.nextIntBetween( 0, this.availableQuestionSets.length - 1 );
      var nextQuestionSet = this.availableQuestionSets[ nextIndex ];
      assert && assert( nextQuestionSet, 'nextQuestionSet is null, nextIndex=' + nextIndex );
      assert && assert( nextQuestionSet !== this.questionsProperty.value, 'repeated questions' );

      // move the set of questions from available to selected
      this.availableQuestionSets.splice( this.availableQuestionSets.indexOf( nextQuestionSet ), 1 );
      this.selectedQuestionSets.push( nextQuestionSet );

      this.questionsProperty.value = nextQuestionSet;
    }
  } );
} );
