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
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ShoppingQuestionNode = require( 'UNIT_RATES/shoppingNEW/view/ShoppingQuestionNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var costOfNItemsString = require( 'string!UNIT_RATES/costOfNItems' );
  var questionsString = require( 'string!UNIT_RATES/questions' );
  var unitRateQuestionString = require( 'string!UNIT_RATES/unitRateQuestion' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionsAccordionBox( shoppingItem, options ) {

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
      contentYSpacing: 15, // vertical spacing between UI elements in the accordion box's content
      contentAlign: 'right' // alignment of UI elements in the accordion box's content
    }, options );

    // 'Unit Rate?' question is at the top.
    var unitRateNode = new ShoppingQuestionNode(
      unitRateQuestionString,
      shoppingItem.unitRate,
      StringUtils.format( valueUnitsString, 1, shoppingItem.singularName ), {
        denominatorVisible: true
      } );

    // Below the 'Unit Rate?' questions is a set of questions that can be updated dynamically.
    var questionsParent = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing
    } );
    shoppingItem.questionsProperty.link( function( questions ) {

      questionsParent.removeAllChildren();

      var questionNodes = [];
      questions.forEach( function( numberOfItems ) {
        var units = ( numberOfItems > 1 ? shoppingItem.pluralName : shoppingItem.singularName );
        var questionString = StringUtils.format( costOfNItemsString, numberOfItems, units );
        var denominatorString = StringUtils.format( valueUnitsString, numberOfItems, units );
        var answer = numberOfItems * shoppingItem.unitRate;
        questionNodes.push( new ShoppingQuestionNode( questionString, answer, denominatorString ) );
      } );

      questionsParent.setChildren( questionNodes );
    } );

    var refreshButton = new RectangularPushButton( {
      baseColor: '#f2f2f2',
      content: new FontAwesomeNode( 'refresh', { scale: 0.38 } ),
      listener: function() {
        shoppingItem.nextQuestions();
      }
    } );

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
