// Copyright 2016-2023, University of Colorado Boulder

/**
 * Displays questions in an accordion box, with a refresh button.
 * Layout is specified in https://github.com/phetsims/unit-rates/issues/152
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import RefreshButton from '../../../../scenery-phet/js/buttons/RefreshButton.js';
import { NodeTranslationOptions, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import AccordionBox, { AccordionBoxOptions } from '../../../../sun/js/AccordionBox.js';
import URColors from '../../common/URColors.js';
import URConstants from '../../common/URConstants.js';
import unitRates from '../../unitRates.js';
import UnitRatesStrings from '../../UnitRatesStrings.js';
import ShoppingQuestionNode from './ShoppingQuestionNode.js';
import KeypadLayer from '../../common/view/KeypadLayer.js';
import ShoppingScene from '../model/ShoppingScene.js';
import { optionize4 } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import ShoppingQuestion from '../model/ShoppingQuestion.js';

type SelfOptions = {
  vBoxSpacing?: number; // vertical spacing between UI elements in the accordion box's content
};

type ShoppingQuestionsAccordionBoxOptions = SelfOptions & NodeTranslationOptions & PickRequired<AccordionBox, 'expandedProperty'>;

export default class ShoppingQuestionsAccordionBox extends AccordionBox {

  private readonly disposeShoppingQuestionsAccordionBox: () => void;

  public constructor( shoppingScene: ShoppingScene, keypadLayer: KeypadLayer, providedOptions?: ShoppingQuestionsAccordionBoxOptions ) {

    const options = optionize4<ShoppingQuestionsAccordionBoxOptions, SelfOptions, AccordionBoxOptions>()(
      {}, URConstants.ACCORDION_BOX_OPTIONS, {

        // SelfOptions
        vBoxSpacing: 12,

        // AccordionBoxOptions
        // tight vertical margins and spacing, see https://github.com/phetsims/unit-rates/issues/140
        titleYMargin: 0,
        contentXMargin: 10,
        contentYMargin: 6,
        contentYSpacing: 2,
        titleNode: new Text( UnitRatesStrings.questionsStringProperty, {
          font: URConstants.ACCORDION_BOX_TITLE_FONT,
          maxWidth: 100
        } )
      }, providedOptions );

    // An invisible rectangle that has the same bounds as the accordion box. Used to position the keypad.
    // Dimensions will be set after calling super.  This was added so when converting to an ES6 class, because
    // we can't use this before super.  See https://github.com/phetsims/tasks/issues/1026#issuecomment-594357784
    const thisBoundsNode = new Rectangle( 0, 0, 1, 1, {
      visible: false,
      pickable: false
    } );

    // 'Unit Rate?' question, dispose required.
    // This question is separate because it does not change when the refresh button is pressed.
    const unitRateQuestionNode = new ShoppingQuestionNode( shoppingScene.unitRateQuestion, thisBoundsNode, keypadLayer, {
      denominatorVisible: true
    } );

    // Below the 'Unit Rate?' question is a set of questions that change when the refresh button is pressed.
    const questionsParent = new VBox( {
      align: 'right',
      spacing: options.vBoxSpacing
    } );
    const questionSetObserver = ( questionSet: ShoppingQuestion[] ) => {

      // remove previous questions
      questionsParent.getChildren().forEach( child => child.dispose() );
      questionsParent.removeAllChildren();

      // add new questions, dispose required
      const questionNodes = [];
      for ( let i = 0; i < questionSet.length; i++ ) {
        questionNodes.push( new ShoppingQuestionNode( questionSet[ i ], thisBoundsNode, keypadLayer ) );
      }
      questionsParent.setChildren( questionNodes );
    };
    shoppingScene.questionSetProperty.link( questionSetObserver ); // unlink in dispose

    // Refresh button, advances to the next question set
    const refreshButton = new RefreshButton( {
      iconHeight: 14,
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

    super( contentNode, options );

    // Adjust rectangle to match accordion box size.
    thisBoundsNode.setRectBounds( this.localBounds );
    this.addChild( thisBoundsNode );
    thisBoundsNode.moveToBack();

    this.disposeShoppingQuestionsAccordionBox = () => {
      shoppingScene.questionSetProperty.unlink( questionSetObserver );
      unitRateQuestionNode.dispose();
      questionsParent.getChildren().forEach( child => child.dispose() );
      refreshButton.dispose(); // workaround for memory leak https://github.com/phetsims/unit-rates/issues/207
    };
  }

  public override dispose(): void {
    this.disposeShoppingQuestionsAccordionBox();
    super.dispose();
  }
}

unitRates.register( 'ShoppingQuestionsAccordionBox', ShoppingQuestionsAccordionBox );