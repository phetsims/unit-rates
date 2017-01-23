// Copyright 2016-2017, University of Colorado Boulder

/**
 * A scene in the 'Shopping' screen. A scene has:
 * - 1 type of item
 * - N sets of questions
 * - a double number line
 * - a scale
 * - a shelf
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  // sim modules
  var Bag = require( 'UNIT_RATES/shopping/model/Bag' );
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );
  var Marker = require( 'UNIT_RATES/common/model/Marker' );
  var MarkerEditor = require( 'UNIT_RATES/common/model/MarkerEditor' );
  var RowLayout = require( 'UNIT_RATES/shopping/model/RowLayout' );
  var Scale = require( 'UNIT_RATES/shopping/model/Scale' );
  var Shelf = require( 'UNIT_RATES/shopping/model/Shelf' );
  var ShoppingItem = require( 'UNIT_RATES/shopping/model/ShoppingItem' );
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var ShoppingQuestionFactory = require( 'UNIT_RATES/shopping/model/ShoppingQuestionFactory' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );
  var dollarsString = require( 'string!UNIT_RATES/dollars' );

  /**
   * @param {Object} itemData - data structure that describes the item, see ShoppingItemData.
   *   Using a data structure like this is an alternative to having a large number of constructor parameters.
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingScene( itemData, options ) {

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
      amountOfQuestionUnits: itemData.pluralName,  // {string} units used for "Apples for $10.00?" type questions

      // scale
      scaleCostIsCollapsible: false, // {boolean} whether cost is collapsible on the scale
      scaleQuantityIsDisplayed: false, // {boolean} whether quantity is displayed on the scale
      scaleQuantityUnits: '', // {string} units for quantity on scale
      bagsOpen: false // {boolean} do bags open to display individual items?

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

    // @public (read-only) unpack options
    this.scaleCostIsCollapsible = options.scaleCostIsCollapsible;
    this.scaleQuantityIsDisplayed = options.scaleQuantityIsDisplayed;

    //TODO Shopping Lab screen requires mutable unit rate. Factor out a base type that excludes questions?
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
    this.shelf = new Shelf( {
      location: new Vector2( 512, 575 )
    } );

    // @public
    this.scale = new Scale( {
      location: this.shelf.location.minusXY( 0, 200 ), // centered above the shelf
      quantityUnits: options.scaleQuantityUnits
    } );

    // @public {ShoppingQuestion} 'Unit Rate?'
    this.unitRateQuestion = ShoppingQuestionFactory.createUnitRateQuestion( itemData.unitRate,
      options.questionSingularUnits, numeratorOptions, denominatorOptions );

    // @private {ShoppingQuestion[][]} instantiate ShoppingQuestions, grouped into sets
    this.questionSets = ShoppingQuestionFactory.createQuestionSets( itemData.questionQuantities, itemData.unitRate,
      options.questionSingularUnits, options.questionPluralUnits, options.amountOfQuestionUnits,
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

    //TODO this should live elsewhere
    var rowLayout = new RowLayout( {
      centerX: this.shelf.location.x,
      numberOfObjects: this.numberOfBags,
      objectWidth: URConstants.BAG_IMAGE_SCALE * this.bagImage.width //TODO will this work for mipmaps?
    } );

    // @public (read-only) create bags
    this.bags = [];
    for ( var i = 0; i < this.numberOfBags; i++ ) {

      // the bag's location
      var cellIndex = rowLayout.getIndexFirstUnoccupied();
      var bagLocation = new Vector2( rowLayout.getXAt( cellIndex ), this.shelf.location.y );

      // create shopping items if the bag opens when placed on the scale
      var shoppingItems = null;
      if ( options.bagsOpen ) {
        shoppingItems = [];
        for ( var j = 0; j < this.unitsPerBag; j++ ) {
          shoppingItems.push( new ShoppingItem( this.itemImage ) );
        }
      }

      // create bag
      var bag = new Bag( this.bagImage, {
        shoppingItems: shoppingItems,
        location: bagLocation
      } );
      //TODO better to have bags live in 1 place
      this.bags.push( bag );
      rowLayout.populateCell( cellIndex, bag );
    }
  }

  unitRates.register( 'ShoppingScene', ShoppingScene );

  return inherit( Object, ShoppingScene, {

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

      //TODO delete all bags and items, re-stock shelf
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
