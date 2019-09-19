// Copyright 2016-2018, University of Colorado Boulder

/**
 * Displays questions in an accordion box, with a refresh button.
 * Layout is specified in https://github.com/phetsims/unit-rates/issues/152
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const inherit = require( 'PHET_CORE/inherit' );
  const RefreshButton = require( 'SCENERY_PHET/buttons/RefreshButton' );
  const ShoppingQuestionNode = require( 'UNIT_RATES/shopping/view/ShoppingQuestionNode' );
  const Text = require( 'SCENERY/nodes/Text' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URColors = require( 'UNIT_RATES/common/URColors' );
  const URConstants = require( 'UNIT_RATES/common/URConstants' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  const questionsString = require( 'string!UNIT_RATES/questions' );

  /**
   * @param {ShoppingScene} shoppingScene
   * @param {Node} keypadLayer
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionsAccordionBox( shoppingScene, keypadLayer, options ) {

    const self = this;

    options = _.extend( {}, URConstants.ACCORDION_BOX_OPTIONS, {

      // AccordionBox options
      // tight vertical margins and spacing, see https://github.com/phetsims/unit-rates/issues/140
      titleYMargin: 0,
      contentXMargin: 10,
      contentYMargin: 6,
      contentYSpacing: 2,
      titleNode: new Text( questionsString, {
        font: URConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: 100
      } ),

      // VBox options
      vBoxSpacing: 12 // vertical spacing between UI elements in the accordion box's content

    }, options );

    // 'Unit Rate?' question, dispose required
    const unitRateQuestionNode = new ShoppingQuestionNode( shoppingScene.unitRateQuestion, this, keypadLayer, {
      denominatorVisible: true
    } );

    // Below the 'Unit Rate?' question is a set of questions that change when the refresh button is pressed.
    const questionsParent = new VBox( {
      align: 'right',
      spacing: options.vBoxSpacing
    } );
    const questionSetObserver = function( questionSet ) {

      // remove previous questions
      questionsParent.getChildren().forEach( function( child ) {
        assert && assert( child instanceof ShoppingQuestionNode );
        child.dispose();
      } );
      questionsParent.removeAllChildren();

      // add new questions, dispose required
      const questionNodes = [];
      for ( let i = 0; i < questionSet.length; i++ ) {
        questionNodes.push( new ShoppingQuestionNode( questionSet[ i ], self, keypadLayer ) );
      }
      questionsParent.setChildren( questionNodes );
    };
    shoppingScene.questionSetProperty.link( questionSetObserver ); // unlink in dispose

    // Refresh button, advances to the next question set
    const refreshButton = new RefreshButton( {
      iconScale: 0.36,
      xMargin: 10,
      yMargin: 5,
      baseColor: URColors.refreshButton,
      listener: function() {
        shoppingScene.nextQuestionSet();
      }
    } );
    refreshButton.touchArea = refreshButton.localBounds.dilatedXY( 5, 5 );

    // AccordionBox content
    const contentNode = new VBox( {
      spacing: 0, // no space here, we want refreshButton snug against bottom question
      align: 'left',
      children: [
        new VBox( {
          spacing: options.vBoxSpacing,
          align: 'right',
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
      refreshButton.dispose(); // workaround for memory leak https://github.com/phetsims/unit-rates/issues/207
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
