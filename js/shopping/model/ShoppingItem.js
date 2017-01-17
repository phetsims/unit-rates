// Copyright 2016-2017, University of Colorado Boulder

/**
 * A type of item in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  // sim modules
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );
  var Marker = require( 'UNIT_RATES/common/model/Marker' );
  var MarkerEditor = require( 'UNIT_RATES/common/model/MarkerEditor' );
  var Scale = require( 'UNIT_RATES/common/model/Scale' );
  var Shelf = require( 'UNIT_RATES/common/model/Shelf' );
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var ShoppingQuestionFactory = require( 'UNIT_RATES/shopping/model/ShoppingQuestionFactory' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );
  var dollarsString = require( 'string!UNIT_RATES/dollars' );

  /**
   * @param {Object} itemData - data structure that describes a type of item, see for example Fruit.APPLES.
   *   Using a data structure like this is an alternative to having a large number of constructor parameters.
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingItem( itemData, options ) {

    // verify that itemData has all required properties
    assert && ShoppingItemData.assertIsItemData( itemData );
    assert && assert( itemData.questionQuantities.length > 1, 'more than 1 set of questions is required' );

    // default option values apply to Fruit items
    options = _.extend( {

      numerationOptions: null, // {*} options specific to the rate's numerator, see below
      denominatorOptions: null, // {*} options specific to the rate's denominator, see below

      // questions
      questionSingularUnits: itemData.singularName, // {string} units for questions with singular quantities
      questionPluralUnits: itemData.pluralName,  // {string} units for questions with plural quantities
      uniformQuestions: false, // {boolean} are all questions of the same form? see createQuestionSets

      // scale
      scaleCostIsHideable: false, // {boolean} whether cost is hideable on the scale
      scaleQuantityIsDisplayed: false, // {boolean} whether quantity is displayed on the scale
      scaleQuantityUnits: '', // {string} units for quantity on scale
      bagsOpen: true // {boolean} do bags open to display individual items?

    }, options );

    var self = this;

    // options specific to the rate's numerator
    var numeratorOptions = _.extend( {
      axisLabel: dollarsString, // {string} label for the axis on the double number line
      valueFormat: currencyValueString, // {string} format with '{0}' placeholder for value
      maxDigits: 4, // {number} number of digits that can be entered via the keypad
      maxDecimals: 2, // {number} maximum number of decimal places
      trimZeros: false // {boolean} whether to trim trailing zeros from decimal places
    }, options.numeratorOptions );

    // options specific to the rate's denominator
    var denominatorOptions = _.extend( {
      axisLabel: itemData.pluralName, // {string} label for the axis on the double number line
      valueFormat: '{0}', // {string} format with '{0}' placeholder for value
      maxDigits: 4, // {number} number of digits that can be entered via the keypad
      maxDecimals: 2, // {number} maximum number of decimal places
      trimZeros: true, // {boolean} whether to trim trailing zeros from decimal places
      axisRange: new Range( 0, 16 ), // {Range} range of bottom axis
      majorMarkerDecimals: 0 // {number} number of decimal places for major markers
    }, options.denominatorOptions );

    // numerator and denominator must have the same number of decimal places,
    // or we will end up with rates that share a common numerator or denominator.
    assert && assert( numeratorOptions.maxDecimals === denominatorOptions.maxDecimals,
      'maxDecimals must be the same for numerator and denominator' );

    // @public (read-only) unpack itemData
    this.unitRate = itemData.unitRate;
    this.numberOfBags = itemData.numberOfBags;
    this.unitsPerBag = itemData.unitsPerBag;
    this.singularName = itemData.singularName;
    this.pluralName = itemData.pluralName;
    this.itemImage = itemData.itemImage;
    this.bagImage = itemData.bagImage;

    // unit rate is constant in this model, but some model elements require a Property
    var unitRateProperty = new Property( this.unitRate );

    // @public {DoubleNumberLine} double number line associated with this item
    this.doubleNumberLine = new DoubleNumberLine( unitRateProperty, {
      numeratorOptions: numeratorOptions,
      denominatorOptions: denominatorOptions
    } );

    // @public
    this.markerEditor = new MarkerEditor( unitRateProperty, {
      numeratorMaxDecimals: numeratorOptions.maxDecimals,
      denominatorMaxDecimals: denominatorOptions.maxDecimals
    } );

    // @public
    this.shelf = new Shelf( this );

    // @public
    this.scale = new Scale( {
      costIsHideable: options.scaleCostIsHideable,
      quantityIsDisplayed: options.scaleQuantityIsDisplayed,
      quantityUnits: options.scaleQuantityUnits
    });

    // @public {ShoppingQuestion} 'Unit Rate?'
    this.unitRateQuestion = ShoppingQuestionFactory.createUnitRateQuestion( itemData.unitRate,
      options.questionSingularUnits, numeratorOptions, denominatorOptions );

    // @private {ShoppingQuestion[][]} instantiate ShoppingQuestions, grouped into sets
    this.questionSets = ShoppingQuestionFactory.createQuestionSets( itemData.questionQuantities, itemData.unitRate,
      options.questionSingularUnits, options.questionPluralUnits, options.uniformQuestions,
      numeratorOptions, denominatorOptions );

    // Randomize the order of the question sets
    if ( URQueryParameters.randomEnabled ) {
      this.questionSets = phet.joist.random.shuffle( this.questionSets );
    }

    // @private index of the question set that's being shown
    this.questionSetsIndexProperty = new Property( 0 );

    // @public (read-only) {Property.<ShoppingQuestion[]>} the current set of questions
    this.questionSetProperty = new Property( this.questionSets[ this.questionSetsIndexProperty.value ] );

    this.questionSetsIndexProperty.lazyLink( function( questionSetsIndex ) { // no unlink required
      self.questionSetProperty.value = self.questionSets[ questionSetsIndex ];
    } );

    /**
     * When a question is answered correctly, create a corresponding marker on the double number line.
     * @param {ShoppingQuestion} question
     */
    var questionCorrectListener = function( question ) {
      var marker = Marker.createQuestionMarker( question, URColors.questionMarker, denominatorOptions.majorMarkerDecimals );
      self.doubleNumberLine.addMarker( marker );
    };
    this.unitRateQuestion.correctEmitter.addListener( questionCorrectListener ); // no removeListener required
    this.questionSets.forEach( function( questionSet ) {
      questionSet.forEach( function( question ) {
        question.correctEmitter.addListener( questionCorrectListener ); // no removeListener required
      } );
    } );
  }

  unitRates.register( 'ShoppingItem', ShoppingItem );

  return inherit( Object, ShoppingItem, {

    // @public
    reset: function() {

      this.doubleNumberLine.reset();
      this.markerEditor.reset();
      this.scale.reset();
      this.shelf.reset();

      // reset all ShoppingQuestions
      this.unitRateQuestion.reset();
      this.questionSets.forEach( function( questionSet ) {
        questionSet.forEach( function( question ) {
          question.reset();
        } );
      } );

      // rest current question set
      this.questionSetsIndexProperty.reset();
    },

    /**
     * Gets the next set of questions.
     * While the order of the sets is random, we cycle through the sets in the same order each time.
     * @public
     */
    nextQuestionSet: function() {

      assert && assert( this.questionSets.length > 1, 'this implementation requires more than 1 question set' );

      // adjust the index to point to the next question set
      if ( this.questionSetsIndexProperty.value < this.questionSets.length - 1 ) {
        this.questionSetsIndexProperty.value = this.questionSetsIndexProperty.value + 1;
      }
      else {
        this.questionSetsIndexProperty.value = 0;
      }
    }
  } );
} );
