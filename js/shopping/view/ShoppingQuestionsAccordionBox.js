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
  var ShoppingQuestionNode = require( 'UNIT_RATES/shopping/view/ShoppingQuestionNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var VBox = require( 'SCENERY/nodes/VBox' );

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
      // tight vertical margins and spacing, see https://github.com/phetsims/unit-rates/issues/140
      titleYMargin: 0,
      contentYMargin: 6,
      contentYSpacing: 2,
      titleNode: new Text( questionsString, {
        font: URConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: 100
      } ),

      // VBox options
      vBoxSpacing: 10 // vertical spacing between UI elements in the accordion box's content

    }, options );

    var self = this;

    // 'Unit Rate?' question
    var unitRateQuestionNode = new ShoppingQuestionNode( shoppingScene.unitRateQuestion, this, keypadLayer, {
      denominatorVisible: true
    } );

    // Below the 'Unit Rate?' question is a set of questions that change when the refresh button is pressed.
    var questionsParent = new VBox( {
      align: 'right',
      spacing: options.vBoxSpacing
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
      content: new FontAwesomeNode( 'refresh', { scale: 0.35 } ),
      xMargin: 10,
      baseColor: URColors.refreshButton,
      listener: function() {
        shoppingScene.nextQuestionSet();
      }
    } );
    refreshButton.touchArea = refreshButton.localBounds.dilatedXY( 5, 5 );

    // AccordionBox content
    var contentNode = new VBox( {
      spacing: 0,
      align: 'left',
      children: [
        new VBox( {
          spacing: options.vBoxSpacing,
          children: [
            unitRateQuestionNode,
            questionsParent
          ]
        } ),
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
      this.disposeShoppingQuestionsAccordionBox();
      AccordionBox.prototype.dispose.call( this );
    }
  } );
} );
