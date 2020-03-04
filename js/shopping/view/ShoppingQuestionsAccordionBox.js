// Copyright 2016-2020, University of Colorado Boulder

/**
 * Displays questions in an accordion box, with a refresh button.
 * Layout is specified in https://github.com/phetsims/unit-rates/issues/152
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import RefreshButton from '../../../../scenery-phet/js/buttons/RefreshButton.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import URColors from '../../common/URColors.js';
import URConstants from '../../common/URConstants.js';
import unitRatesStrings from '../../unit-rates-strings.js';
import unitRates from '../../unitRates.js';
import ShoppingQuestionNode from './ShoppingQuestionNode.js';

const questionsString = unitRatesStrings.questions;

/**
 * @param {ShoppingScene} shoppingScene
 * @param {Node} keypadLayer
 * @param {Object} [options]
 * @constructor
 */
function ShoppingQuestionsAccordionBox( shoppingScene, keypadLayer, options ) {

  options = merge( {}, URConstants.ACCORDION_BOX_OPTIONS, {

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
  const questionSetObserver = questionSet => {

    // remove previous questions
    questionsParent.getChildren().forEach( child => {
      assert && assert( child instanceof ShoppingQuestionNode );
      child.dispose();
    } );
    questionsParent.removeAllChildren();

    // add new questions, dispose required
    const questionNodes = [];
    for ( let i = 0; i < questionSet.length; i++ ) {
      questionNodes.push( new ShoppingQuestionNode( questionSet[ i ], this, keypadLayer ) );
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
    listener: () => shoppingScene.nextQuestionSet()
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
  this.disposeShoppingQuestionsAccordionBox = () => {
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

export default inherit( AccordionBox, ShoppingQuestionsAccordionBox, {

  /**
   * @public
   * @override
   */
  dispose: function() {
    this.disposeShoppingQuestionsAccordionBox();
    AccordionBox.prototype.dispose.call( this );
  }
} );