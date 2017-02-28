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

  // modules
  var Bag = require( 'UNIT_RATES/shopping/model/Bag' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var DoubleNumberLine = require( 'UNIT_RATES/common/model/DoubleNumberLine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Marker = require( 'UNIT_RATES/common/model/Marker' );
  var MarkerEditor = require( 'UNIT_RATES/common/model/MarkerEditor' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Rate = require( 'UNIT_RATES/common/model/Rate' );
  var Scale = require( 'UNIT_RATES/shopping/model/Scale' );
  var Shelf = require( 'UNIT_RATES/shopping/model/Shelf' );
  var ShoppingItem = require( 'UNIT_RATES/shopping/model/ShoppingItem' );
  var ShoppingItemData = require( 'UNIT_RATES/shopping/model/ShoppingItemData' );
  var ShoppingQuestionFactory = require( 'UNIT_RATES/shopping/model/ShoppingQuestionFactory' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URQueryParameters = require( 'UNIT_RATES/common/URQueryParameters' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

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

      rate: null, // {Rate|null} if null, will be initialized to unit rate

      // range of the denominator (quantity) is fixed
      fixedAxis: 'denominator',
      fixedAxisRange: new Range( 0, 16 ),

      numerationOptions: null, // {*} options specific to the rate's numerator, see below
      denominatorOptions: null, // {*} options specific to the rate's denominator, see below

      // questions
      quantitySingularUnits: itemData.singularName, // {string} units for questions with singular quantities
      quantityPluralUnits: itemData.pluralName,  // {string} units for questions with plural quantities
      amountOfQuestionUnits: itemData.pluralName,  // {string} units used for "Apples for $10.00?" type questions

      // scale
      scaleQuantityIsDisplayed: false, // {boolean} whether quantity is displayed on the scale
      scaleQuantityUnits: '', // {string} units for quantity on scale
      bagsOpen: false, // {boolean} do bags open to display individual items?

      // Major markers have integer denominators
      isMajorMarker: function( numerator, denominator ) {
        return Util.isInteger( denominator );
      }

    }, options );

    var self = this;

    // @public (read-only) options specific to the rate's numerator
    this.numeratorOptions = _.extend( {
      axisLabel: dollarsString, // {string} label for the axis on the double number line
      valueFormat: currencyValueString, // {string} format with '{0}' placeholder for value
      maxDigits: 4, // {number} number of digits that can be entered via the keypad
      maxDecimals: 2, // {number} maximum number of decimal places
      trimZeros: false, // {boolean} whether to trim trailing zeros from decimal places
      pickerColor: 'black' // {Color|string} color of the number picker for the numerator in the Rate accordion box
    }, options.numeratorOptions );

    // @public (read-only) options specific to the rate's denominator
    this.denominatorOptions = _.extend( {
      axisLabel: itemData.pluralName, // {string} label for the axis on the double number line
      valueFormat: '{0}', // {string} format with '{0}' placeholder for value
      maxDigits: 4, // {number} number of digits that can be entered via the keypad
      maxDecimals: 2, // {number} maximum number of decimal places
      trimZeros: true, // {boolean} whether to trim trailing zeros from decimal places
      pickerColor: 'black' // {Color|string} color of the number picker for the denominator in the Rate accordion box
    }, options.denominatorOptions );

    // @public {Rate}
    this.rate = options.rate || Rate.withUnitRate( itemData.unitRate );

    // @public (read-only) unpack itemData
    this.numberOfBags = itemData.numberOfBags;
    this.quantityPerBag = itemData.quantityPerBag;
    this.singularName = itemData.singularName;
    this.pluralName = itemData.pluralName;
    this.itemImage = itemData.itemImage;
    this.bagImage = itemData.bagImage;

    // @public (read-only) unpack options
    this.scaleQuantityIsDisplayed = options.scaleQuantityIsDisplayed;

    // @public
    this.doubleNumberLine = new DoubleNumberLine( this.rate.unitRateProperty, {
      fixedAxis: options.fixedAxis,
      fixedAxisRange: options.fixedAxisRange,
      numeratorOptions: this.numeratorOptions,
      denominatorOptions: this.denominatorOptions,
      isMajorMarker: options.isMajorMarker
    } );

    // @public
    this.markerEditor = new MarkerEditor( this.rate.unitRateProperty, {
      numeratorMaxDecimals: this.numeratorOptions.maxDecimals,
      denominatorMaxDecimals: this.denominatorOptions.maxDecimals
    } );

    // Does not work for mipmap, bagImage.width is undefined.
    // If considering a switch to mipmaps, see https://github.com/phetsims/unit-rates/issues/157
    assert && assert( this.bagImage.width && this.bagImage.height, 'Are you using the image plugin?' );
    var bagSize = new Dimension2(
      URConstants.BAG_IMAGE_SCALE * this.bagImage.width,
      URConstants.BAG_IMAGE_SCALE * this.bagImage.height );

    assert && assert( this.itemImage.width && this.itemImage.height, 'Are you using the image plugin?' );
    var itemSize = new Dimension2(
      URConstants.SHOPPING_ITEM_IMAGE_SCALE * this.itemImage.width,
      URConstants.SHOPPING_ITEM_IMAGE_SCALE * this.itemImage.height );

    // @public
    this.shelf = new Shelf( {
      location: new Vector2( 512, 575 ),
      numberOfBags: this.numberOfBags,
      bagSize: bagSize,
      numberOfItems: this.numberOfBags * this.quantityPerBag,
      itemSize: itemSize
    } );

    // @public
    this.scale = new Scale( this.rate.unitRateProperty, {
      location: this.shelf.location.minusXY( 0, 200 ), // centered above the shelf
      numberOfBags: this.numberOfBags,
      bagSize: bagSize,
      numberOfItems: this.numberOfBags * this.quantityPerBag,
      itemSize: itemSize,
      quantityPerBag: this.quantityPerBag,
      quantityUnits: options.scaleQuantityUnits
    } );

    // The marker that corresponds to what's currently on the scale
    var scaleMarker = null;

    // Create a marker when what's on the scale changes
    this.scale.quantityProperty.lazyLink( function( quantity ) {

      // the marker for what was previously on the scale becomes erasable
      if ( scaleMarker ) {
        scaleMarker.colorProperty.value = URColors.majorMarker;
        scaleMarker.erasable = true;
      }

      // the new marker for what's on the scale
      if ( quantity > 0 ) {
        scaleMarker = new Marker( self.scale.costProperty.value, quantity, 'scale', {
          isMajor: true, // all scale markers are major, per the design document
          color: URColors.scaleMarker,
          erasable: false
        } );
        self.doubleNumberLine.addMarker( scaleMarker );
      }
    } );

    // @public {ShoppingQuestion} 'Unit Rate?'
    this.unitRateQuestion = ShoppingQuestionFactory.createUnitRateQuestion( this.rate.unitRateProperty.value,
      options.quantitySingularUnits, this.numeratorOptions, this.denominatorOptions );

    // @private {ShoppingQuestion[][]} instantiate ShoppingQuestions, grouped into sets
    this.questionSets = ShoppingQuestionFactory.createQuestionSets( itemData.questionQuantities, this.rate.unitRateProperty.value,
      options.quantitySingularUnits, options.quantityPluralUnits, options.amountOfQuestionUnits,
      this.numeratorOptions, this.denominatorOptions );

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

    // When the unit rate changes, cancel any marker edit that is in progress, unlink not needed
    this.rate.unitRateProperty.lazyLink( function( unitRate ) {
      self.markerEditor.reset();
    } );

    /**
     * When a question is answered correctly, create a corresponding marker on the double number line.
     * @param {ShoppingQuestion} question
     */
    var questionCorrectListener = function( question ) {
      var marker = new Marker( question.numerator, question.denominator, 'question', {
        isMajor: true, // all question markers are major, per the design document
        color: URColors.questionMarker,
        erasable: false
      } );
      self.doubleNumberLine.addMarker( marker );
    };
    this.unitRateQuestion.correctEmitter.addListener( questionCorrectListener ); // no removeListener required
    this.questionSets.forEach( function( questionSet ) {
      questionSet.forEach( function( question ) {
        question.correctEmitter.addListener( questionCorrectListener ); // no removeListener required
      } );
    } );

    // @public (read-only) create bags and items on the shelf
    this.bags = [];
    for ( var i = 0; i < this.numberOfBags; i++ ) {

      // the bag's location on the shelf
      var bagCellIndex = this.shelf.bagRow.getFirstUnoccupiedCell();
      assert && assert( bagCellIndex !== -1, 'shelf is full' );
      var bagLocation = this.shelf.bagRow.getCellLocation( bagCellIndex );

      // create items if the bag opens when placed on the scale
      var items = null;
      if ( options.bagsOpen ) {
        items = [];
        for ( var j = 0; j < this.quantityPerBag; j++ ) {

          var itemCellIndex = this.shelf.itemRow.getFirstUnoccupiedCell();
          assert && assert( itemCellIndex !== -1, 'shelf is full' );
          var itemLocation = this.shelf.itemRow.getCellLocation( itemCellIndex );

          // create item
          var item = new ShoppingItem( this.pluralName, this.itemImage, {
            location: itemLocation
          } );
          items.push( item );
          
          // put item on shelf
          this.shelf.itemRow.addObject( item, itemCellIndex );
        }
      }

      // create bag
      var bag = new Bag( this.pluralName, this.bagImage, {
        location: bagLocation,
        items: items
      } );
      this.bags.push( bag );

      // put bag on shelf
      this.shelf.bagRow.addObject( bag, bagCellIndex );
    }
  }

  unitRates.register( 'ShoppingScene', ShoppingScene );

  return inherit( Object, ShoppingScene, {

    /**
     * Updates time-dependent parts of the model.
     * @param {number} dt - time since the previous step, in seconds
     * @public
     */
    step: function( dt ) {

      // animate bags
      for ( var i = 0; i < this.bags.length; i++ ) {
        this.bags[ i ].step( dt );

        // animate items
        var items = this.bags[ i ].items;
        if ( items ) {
          for ( var j = 0; j < items.length; j++ ) {
            items[ j ].step( dt );
          }
        }
      }
    },

    // @public
    reset: function() {

      this.rate.reset();

      this.doubleNumberLine.reset();
      this.markerEditor.reset();
      this.scale.reset();
      this.shelf.reset();

      // reset questions
      this.unitRateQuestion.reset();
      this.questionSets.forEach( function( questionSet ) {
        questionSet.forEach( function( question ) {
          question.reset();
        } );
      } );
      this.questionSetsIndexProperty.reset();

      //TODO this is likely wrong and incomplete
      // return all bags to shelf
      var shelf = this.shelf;
      this.bags.forEach( function( bag ) {

        // return bag to shelf
        var bagCellIndex = shelf.bagRow.getFirstUnoccupiedCell();
        assert && assert( bagCellIndex !== -1, 'shelf is full' );
        shelf.bagRow.addObject( bag, bagCellIndex );

        // return bag's items to shelf
        var items = bag.items;
        if ( items ) {
          items.forEach( function( item ) {

            // return item to shelf
            var itemCellIndex = shelf.itemRow.getFirstUnoccupiedCell();
            assert && assert( itemCellIndex !== -1, 'shelf is full' );
            shelf.itemRow.addObject( item, itemCellIndex );
          } );
        }
      } );
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
