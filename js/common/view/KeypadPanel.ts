// Copyright 2016-2023, University of Colorado Boulder

/***
 * KeypadPanel is a panel that contains a value display, keypad, and Enter button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Keypad from '../../../../scenery-phet/js/keypad/Keypad.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Node, Rectangle, Text, VBox } from '../../../../scenery/js/imports.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import unitRates from '../../unitRates.js';
import UnitRatesStrings from '../../UnitRatesStrings.js';
import URColors from '../URColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';

type SelfOptions = {
  valueBoxWidth?: number; // width of the value field, height determined by valueFont
  valueYMargin?: number; // vertical margin inside the value box
  valueFont?: PhetFont;
  valueString?: string; // initial value shown in the keypad
  decimalPointKey?: boolean; // does the keypad have a decimal point key?
  maxDigits?: number; // maximum number of digits that can be entered on the keypad
  maxDecimals?: number; // maximum number of decimal places that can be entered on the keypad
  enterButtonListener?: ( () => void ) | null;  // called when the Enter button is pressed
};

type KeypadPanelOptions = SelfOptions;

export default class KeypadPanel extends Panel {

  public readonly valueStringProperty: TReadOnlyProperty<string>; // expose the Keypad's stringProperty
  private readonly disposeKeypadPanel: () => void;

  public constructor( providedOptions?: KeypadPanelOptions ) {

    const options = optionize<KeypadPanelOptions, SelfOptions, PanelOptions>()( {

      // KeypadPanelOptions
      valueBoxWidth: 85,
      valueYMargin: 3,
      valueFont: new PhetFont( 16 ),
      valueString: '',
      decimalPointKey: true,
      maxDigits: 4,
      maxDecimals: 2,
      enterButtonListener: null,

      // PanelOptions
      fill: 'rgb( 230, 230, 230 )',
      backgroundPickable: true, // {boolean} so that clicking in the keypad's background doesn't close the keypad
      xMargin: 10,
      yMargin: 10
    }, providedOptions );

    const keypad = new Keypad( Keypad.PositiveDecimalLayout, {
      buttonFont: new PhetFont( 20 ),
      accumulatorOptions: {
        maxDigits: options.maxDigits,
        maxDigitsRightOfMantissa: options.maxDecimals
      }
    } );

    const valueNode = new Text( '', {
      font: options.valueFont
    } );

    const valueBackgroundNode = new Rectangle( 0, 0, options.valueBoxWidth, valueNode.height + ( 2 * options.valueYMargin ), {
      cornerRadius: 3,
      fill: 'white',
      stroke: 'black'
    } );

    const valueParent = new Node( {
      children: [ valueBackgroundNode, valueNode ]
    } );

    // Show the value entered on the keypad. No unlink is required.
    keypad.stringProperty.link( string => {
      valueNode.string = string;
    } );

    // Keep the value centered in the background. No unlink is required.
    valueNode.boundsProperty.link( () => {
      valueNode.center = valueBackgroundNode.center;
    } );

    const enterButton = new RectangularPushButton( {
      listener: options.enterButtonListener,
      baseColor: URColors.enterButtonColorProperty,
      content: new Text( UnitRatesStrings.enterStringProperty, {
        font: new PhetFont( 16 ),
        fill: 'black',
        maxWidth: keypad.width // i18n
      } )
    } );

    const contentNode = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ valueParent, keypad, enterButton ]
    } );

    super( contentNode, options );

    this.valueStringProperty = keypad.stringProperty;

    this.disposeKeypadPanel = () => {
      keypad.dispose(); // workaround for memory leak https://github.com/phetsims/unit-rates/issues/207
      enterButton.dispose(); // workaround for memory leak https://github.com/phetsims/unit-rates/issues/207
    };
  }

  public override dispose(): void {
    this.disposeKeypadPanel();
    super.dispose();
  }
}

unitRates.register( 'KeypadPanel', KeypadPanel );