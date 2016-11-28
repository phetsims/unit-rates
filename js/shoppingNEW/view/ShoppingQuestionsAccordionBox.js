// Copyright 2016, University of Colorado Boulder

/**
 * Displays questions in an accordion box, with a refresh button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Candy = require( 'UNIT_RATES/shoppingNEW/model/Candy' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ShoppingQuestionNode = require( 'UNIT_RATES/shoppingNEW/view/ShoppingQuestionNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var costOfNUnitsString = require( 'string!UNIT_RATES/costOfNUnits' );
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );
  var itemsForAmountString = require( 'string!UNIT_RATES/itemsForAmount' );
  var poundString = require( 'string!UNIT_RATES/pound' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var questionsString = require( 'string!UNIT_RATES/questions' );
  var unitRateQuestionString = require( 'string!UNIT_RATES/unitRateQuestion' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Node} keypadLayer
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionsAccordionBox( shoppingItem, keypadLayer, options ) {

    options = _.extend( {
      expandedProperty: new Property( true ),
      titleNode: new Text( questionsString, { font: new URFont( 18 ), maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 10,
      contentYSpacing: 18, // vertical spacing between UI elements in the accordion box's content
      contentAlign: 'right' // alignment of UI elements in the accordion box's content
    }, options );

    // 'Unit Rate?' question is at the top.
    var unitRateNode = new ShoppingQuestionNode(
      unitRateQuestionString,
      shoppingItem.unitRate,
      Util.toFixed( shoppingItem.unitRate, 2 ),
      StringUtils.format( valueUnitsString, 1, ( shoppingItem instanceof Candy ) ? poundString : shoppingItem.singularName ),
      keypadLayer, {
        denominatorVisible: true
      } );

    // Below the 'Unit Rate?' question is a set of questions that change when the refresh button is pressed.
    var questionsParent = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing
    } );
    shoppingItem.questionSetProperty.link( function( questionSet ) {

      questionsParent.removeAllChildren();

      // explicitly hoist these vars
      var numberOfItems;
      var units;
      var questionString;
      var numeratorString;
      var denominatorString;
      var answer;

      var questionNodes = []; // {ShoppingQuestionNode[]}

      if ( shoppingItem instanceof Candy ) {

        // all Candy questions are of the form 'Cost of 3 pounds?'
        questionSet.forEach( function( numberOfPounds ) {
          answer = Util.toFixedNumber( numberOfPounds * shoppingItem.unitRate, 2 );
          units = ( numberOfPounds > 1 ? poundsString : poundString );
          questionString = StringUtils.format( costOfNUnitsString, numberOfPounds, units );
          numeratorString = Util.toFixed( answer, 2 );
          denominatorString = StringUtils.format( valueUnitsString, numberOfPounds, units );
          questionNodes.push( new ShoppingQuestionNode( questionString, answer, numeratorString, denominatorString, keypadLayer, {
            valueFormat: currencyValueString
          } ) );
        } );
      }
      else {

        // other items types (Fruit, Vegetable) have questions of the form 'Cost of 3 Apples?'
        for ( var i = 0; i < questionSet.length - 1; i++ ) {
          numberOfItems = questionSet[ i ];
          answer = Util.toFixedNumber( numberOfItems * shoppingItem.unitRate, 2 );
          units = ( numberOfItems > 1 ? shoppingItem.pluralName : shoppingItem.singularName );
          questionString = StringUtils.format( costOfNUnitsString, numberOfItems, units );
          numeratorString = StringUtils.format( currencyValueString, Util.toFixed( answer, 2 ) );
          denominatorString = StringUtils.format( valueUnitsString, numberOfItems, units );
          questionNodes.push( new ShoppingQuestionNode( questionString, answer, numeratorString, denominatorString, keypadLayer, {
            valueFormat: currencyValueString
          } ) );
        }

        // ... followed by 1 question of the form 'Apples for $3.00?'
        numberOfItems = questionSet[ questionSet.length - 1 ];
        assert && assert( Util.isInteger( numberOfItems ), 'by design, numberOfItems should be integer: ' + numberOfItems );
        answer = numberOfItems;
        var costString = StringUtils.format( currencyValueString, Util.toFixed( numberOfItems * shoppingItem.unitRate, 2 ) );
        units = ( numberOfItems > 1 ? shoppingItem.pluralName : shoppingItem.singularName );
        questionString = StringUtils.format( itemsForAmountString, shoppingItem.pluralName, costString );
        numeratorString = costString;
        denominatorString = StringUtils.format( valueUnitsString, numberOfItems, units );
        questionNodes.push( new ShoppingQuestionNode( questionString, answer, numeratorString, denominatorString, keypadLayer ) );
      }

      questionsParent.setChildren( questionNodes );
    } );

    // Refresh button update the set of dynamic questions
    var refreshButton = new RectangularPushButton( {
      baseColor: '#f2f2f2',
      content: new FontAwesomeNode( 'refresh', { scale: 0.38 } ),
      listener: function() {
        shoppingItem.nextQuestionSet();
      }
    } );

    // AccordionBox content
    var contentNode = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing,
      children: [
        unitRateNode,
        questionsParent,
        refreshButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  unitRates.register( 'ShoppingQuestionsAccordionBox', ShoppingQuestionsAccordionBox );

  return inherit( AccordionBox, ShoppingQuestionsAccordionBox );
} );
