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
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var questionsString = require( 'string!UNIT_RATES/questions' );

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

    // 'Unit Rate?' question
    var unitRateNode = ShoppingQuestionNode.createUnitRateNode( shoppingItem, keypadLayer );

    // Below the 'Unit Rate?' question is a set of questions that change when the refresh button is pressed.
    var questionsParent = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing
    } );
    shoppingItem.questionSetProperty.link( function( questionSet ) {

      questionsParent.removeAllChildren();

      var questionNodes = []; // {ShoppingQuestionNode[]}

      if ( shoppingItem instanceof Candy ) {

        // all Candy questions are of the form 'Cost of 3 pounds?'
        questionSet.forEach( function( numberOfPounds ) {
          questionNodes.push( ShoppingQuestionNode.createCostOfNode( numberOfPounds, shoppingItem, keypadLayer ) );
        } );
      }
      else {

        // Other items types have questions of the form 'Cost of 3 Apples?',
        // followed by 1 question of the form 'Apples for $3.00?'
        for ( var i = 0; i < questionSet.length; i++ ) {
          var numberOfItems = questionSet[ i ];
          if ( i < questionSet.length - 1 ) {

            // E.g., 'Cost of 3 Apples?'
            questionNodes.push( ShoppingQuestionNode.createCostOfNode( numberOfItems, shoppingItem, keypadLayer ) );
          }
          else {

            // E.g., 'Apples for $3.00?'
            questionNodes.push( ShoppingQuestionNode.createAmountOfNode( numberOfItems, shoppingItem, keypadLayer ) );
          }
        }
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
