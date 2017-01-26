// Copyright 2016-2017, University of Colorado Boulder

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
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // sim modules
  var ShoppingQuestionNode = require( 'UNIT_RATES/shopping/view/ShoppingQuestionNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var questionsString = require( 'string!UNIT_RATES/questions' );

  /**
   * @param {ShoppingScene} shoppingScene
   * @param {Node} keypadLayer
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionsAccordionBox( shoppingScene, keypadLayer, options ) {

    options = _.extend( {}, URConstants.ACCORDION_BOX_OPTIONS, {

      // AccordionBox options
      titleNode: new Text( questionsString, { font: new URFont( 18 ), maxWidth: 100 } ),

      // VBox options
      contentYSpacing: 18, // vertical spacing between UI elements in the accordion box's content
      contentAlign: 'right' // alignment of UI elements in the accordion box's content

    }, options );

    var self = this;

    // 'Unit Rate?' question
    var unitRateQuestionNode = new ShoppingQuestionNode( shoppingScene.unitRateQuestion, this, keypadLayer, {
      denominatorVisible: true
    } );

    // Below the 'Unit Rate?' question is a set of questions that change when the refresh button is pressed.
    var questionsParent = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing
    } );
    var questionSetObserver = function( questionSet ) {

      // remove previous questions
      questionsParent.removeAllChildren();

      // add new questions
      var questionNodes = [];
      for ( var i = 0; i < questionSet.length; i++ ) {
        questionNodes.push( new ShoppingQuestionNode( questionSet[ i ], self, keypadLayer ) );
      }
      questionsParent.setChildren( questionNodes );
    };
    shoppingScene.questionSetProperty.link( questionSetObserver );// unlink in dispose

    // Refresh button, advances to the next question set
    var refreshButton = new RectangularPushButton( {
      content: new FontAwesomeNode( 'refresh', { scale: 0.5 } ),
      baseColor: URColors.refreshButton,
      listener: function() {
        shoppingScene.nextQuestionSet();
      }
    } );
    refreshButton.touchArea = refreshButton.localBounds.dilatedXY( 5, 5 );

    // AccordionBox content
    var contentNode = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing,
      children: [
        unitRateQuestionNode,
        questionsParent,
        refreshButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );

    // @private cleanup that's specific to this Node
    this.disposeShoppingQuestionsAccordionBox = function() {
      shoppingScene.questionSetProperty.unlink( questionSetObserver );
      unitRateQuestionNode.dispose();
      questionsParent.getChildren().forEach( function( child ) {
        assert && assert( child instanceof ShoppingQuestionNode );
        child.dispose();
      } );
    };
  }

  unitRates.register( 'ShoppingQuestionsAccordionBox', ShoppingQuestionsAccordionBox );

  return inherit( AccordionBox, ShoppingQuestionsAccordionBox, {

    // @public
    dispose: function() {
      AccordionBox.prototype.dispose && AccordionBox.prototype.dispose.call( this );
      this.disposeShoppingQuestionsAccordionBox();
    }
  } );
} );
