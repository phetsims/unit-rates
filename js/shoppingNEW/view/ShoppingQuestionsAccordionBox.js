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
    var unitRateNode = new ShoppingQuestionNode( shoppingItem.unitRateQuestion, keypadLayer, {
      denominatorVisible: true
    } );

    // Below the 'Unit Rate?' question is a set of questions that change when the refresh button is pressed.
    var questionsParent = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing
    } );
    shoppingItem.questionSetProperty.link( function( questionSet ) {

      // remove previous questions
      questionsParent.removeAllChildren();

      // add new questions
      var questionNodes = [];
      for ( var i = 0; i < questionSet.length; i++ ) {
        questionNodes.push( new ShoppingQuestionNode( questionSet[ i ], keypadLayer ) );
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
