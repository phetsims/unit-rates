// Copyright 2016-2020, University of Colorado Boulder

//TODO replace NumberKeypad with next-generation keypad, see https://github.com/phetsims/unit-rates/issues/153
/***
 * A panel that contains a keypad and Enter button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import StringProperty from '../../../../axon/js/StringProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberKeypad from '../../../../scenery-phet/js/NumberKeypad.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Panel from '../../../../sun/js/Panel.js';
import unitRates from '../../unitRates.js';
import unitRatesStrings from '../../unitRatesStrings.js';
import URColors from '../URColors.js';

// constants
const DECIMAL_POINT = NumberKeypad.DECIMAL_POINT;

class KeypadPanel extends Panel {

  /**
   * @param {Object} [options]
   */
  constructor( options ) {

    options = merge( {

      // KeypadPanel options
      valueBoxWidth: 85, // {number} width of the value field, height determined by valueFont
      valueYMargin: 3, // {number} vertical margin inside the value box
      valueFont: new PhetFont( 16 ),
      valueString: '', // {string} initial value shown in the keypad
      decimalPointKey: true, // {boolean} does the keypad have a decimal point key?
      maxDigits: 4, // {number} maximum number of digits that can be entered on the keypad
      maxDecimals: 2, // {number} maximum number of decimal places that can be entered on the keypd

      // Panel options
      fill: 'rgb( 230, 230, 230 )', // {Color|string} the keypad's background color
      backgroundPickable: true, // {boolean} so that clicking in the keypad's background doesn't close the keypad
      xMargin: 10,
      yMargin: 10,

      // RectangularPushButton options
      enterButtonListener: null  // {function} called when the Enter button is pressed

    }, options );

    const valueStringProperty = new StringProperty( options.valueString );

    const valueNode = new Text( valueStringProperty.value, {
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

    const keypadNode = new NumberKeypad( {
      valueStringProperty: valueStringProperty,
      decimalPointKey: options.decimalPointKey,
      validateKey: validateDigitsAndDecimals( {
        maxDigits: options.maxDigits,
        maxDecimals: options.maxDecimals
      } )
    } );

    const enterButton = new RectangularPushButton( {
      listener: options.enterButtonListener,
      baseColor: URColors.enterButton,
      content: new Text( unitRatesStrings.enter, {
        font: new PhetFont( 16 ),
        fill: 'black',
        maxWidth: keypadNode.width // i18n
      } )
    } );

    const contentNode = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ valueParent, keypadNode, enterButton ]
    } );

    super( contentNode, options );

    // @public
    this.valueStringProperty = valueStringProperty;
    this.valueStringProperty.link( valueString => { // no unlink required
      valueNode.text = valueString;
      valueNode.center = valueBackgroundNode.center;
    } );

    // @private
    this.disposeKeypadPanel = () => {
      keypadNode.disposeSubtree(); // workaround for memory leak https://github.com/phetsims/unit-rates/issues/207
      enterButton.dispose(); // workaround for memory leak https://github.com/phetsims/unit-rates/issues/207
    };
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeKeypadPanel();
    super.dispose();
  }
}

/**
 * Conforms to the API for NumberKeypad options.validateKey.
 * Creates a validation function that constrains the value to have:
 * - a maximum number of digits
 * - a maximum number of decimal places
 * - at most 1 zero to the left of the decimal point
 *
 * @param {Object} [options]
 * @returns {function(string, string)}
 */
function validateDigitsAndDecimals( options ) {

  options = merge( {
    maxDigits: 8, // {number} the maximum number of digits (numbers)
    maxDecimals: 4 // {number} the maximum number of decimal places
  }, options );
  assert && assert( options.maxDigits > 0, `invalid maxDigits: ${options.maxDigits}` );
  assert && assert( options.maxDecimals >= 0, `invalid maxDecimals: ${options.maxDecimals}` );

  /**
   * Creates the new string that results from pressing a key.
   * @param {string} keyString - string associated with the key that was pressed
   * @param {string} valueString - string that corresponds to the sequence of keys that have been pressed
   * @returns {string} the result
   */
  return ( keyString, valueString ) => {

    // start by assuming that keyString will be ignored
    let newValueString = valueString;

    const hasDecimalPoint = valueString.indexOf( DECIMAL_POINT ) !== -1;
    const numberOfDigits = hasDecimalPoint ? valueString.length - 1 : valueString.length;
    const numberOfDecimals = !hasDecimalPoint ? 0 : ( valueString.length - valueString.indexOf( DECIMAL_POINT ) - 1 );

    if ( valueString === '0' && keyString === '0' ) {

      // ignore multiple leading zeros
    }
    else if ( valueString === '0' && keyString !== '0' && keyString !== DECIMAL_POINT ) {

      // replace a leading 0 that's not followed by a decimal point with this key
      newValueString = keyString;
    }
    else if ( numberOfDigits === options.maxDigits ) {

      // maxDigits reached, ignore key
    }
    else if ( keyString === DECIMAL_POINT ) {
      if ( !hasDecimalPoint ) {

        // allow one decimal point
        newValueString = valueString + keyString;
      }
      else {

        // ignore additional decimal points
      }
    }
    else if ( hasDecimalPoint && numberOfDecimals === options.maxDecimals ) {

      // maxDecimals reached, ignore key
    }
    else {

      // add digit
      newValueString = valueString + keyString;
    }

    return newValueString;
  };
}

unitRates.register( 'KeypadPanel', KeypadPanel );

export default KeypadPanel;