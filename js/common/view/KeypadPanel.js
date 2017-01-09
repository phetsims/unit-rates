// Copyright 2016, University of Colorado Boulder

//TODO replace with new common-code keypad
/***
 * Temporary keypad for Unit Rates.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var enterString = require( 'string!UNIT_RATES/enter' );

  // constants
  var DECIMAL_POINT = NumberKeypad.DECIMAL_POINT;

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeypadPanel( options ) {

    options = _.extend( {

      // KeypadPanel options
      valueString: '',
      decimalPointKey: true,
      maxDigits: 4,
      maxDecimals: 2,

      // Panel options
      fill: 'rgb( 230, 230, 230 )',
      backgroundPickable: true,
      xMargin: 10,
      yMargin: 10,

      // RectangularPushButton options
      enterButtonListener: null
    }, options );

    var valueStringProperty = new Property( options.valueString );

    var valueNode = new Text( valueStringProperty.value, {
      font: new URFont( 16 )
    } );

    //TODO background should be sized to maximum value, with some margins
    var valueBackgroundNode = new Rectangle( 0, 0, 85, 30, {
      cornerRadius: 3,
      fill: 'white',
      stroke: 'black'
    } );

    var valueParent = new Node( {
      children: [ valueBackgroundNode, valueNode ]
    } );

    var keypadNode = new NumberKeypad( {
      valueStringProperty: valueStringProperty,
      decimalPointKey: options.decimalPointKey,
      validateKey: validateDigitsAndDecimals( {
        maxDigits: options.maxDigits,
        maxDecimals: options.maxDecimals
      } )
    } );

    var enterButton = new RectangularPushButton( {
      listener: options.enterButtonListener,
      baseColor: URColors.enterButton,
      content: new Text( enterString, {
        font: new URFont( 16 ),
        fill: 'black'
      } )
    } );

    var contentNode = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ valueParent, keypadNode, enterButton ]
    } );

    Panel.call( this, contentNode, options );

    valueStringProperty.link( function( valueString ) {
      valueNode.text = valueString;
      valueNode.center = valueBackgroundNode.center;
    } );

    // @public
    this.valueStringProperty = valueStringProperty;
  }

  unitRates.register( 'KeypadPanel', KeypadPanel );

  /**
   * Creates a validation function that constrains the value have:
   * - to a maximum number of digits (with 1 leading zero)
   * - a maximum number of decimal places.
   *
   * @param {Object} [options]
   * @returns {function(string, string)}
   */
  var validateDigitsAndDecimals = function( options ) {

    options = _.extend( {
      maxDigits: 8, // {number} the maximum number of digits (numbers)
      maxDecimals: 4 // {number} the maximum number of decimal places
    }, options );
    assert && assert( options.maxDigits > 0, 'invalid maxDigits: ' + options.maxDigits );
    assert && assert( options.maxDecimals >= 0, 'invalid maxDecimals: ' + options.maxDecimals );

    /**
     * Creates the new string that results from pressing a key.
     * @param {string} keyString - string associated with the key that was pressed
     * @param {string} valueString - string that corresponds to the sequence of keys that have been pressed
     * @returns {string} the result
     */
    return function( keyString, valueString ) {

      // start by assuming that keyString will be ignored
      var newValueString = valueString;

      var hasDecimalPoint = valueString.indexOf( DECIMAL_POINT ) !== -1;
      var numberOfDigits = hasDecimalPoint ? valueString.length - 1 : valueString.length;
      var numberOfDecimals = !hasDecimalPoint ? 0 : ( valueString.length - valueString.indexOf( DECIMAL_POINT ) - 1 );

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
      else if ( hasDecimalPoint &&  numberOfDecimals === options.maxDecimals ) {

        // maxDecimals reached, ignore key
      }
      else {

        // add digit
        newValueString = valueString + keyString;
      }

      return newValueString;
    };
  };

  return inherit( Panel, KeypadPanel );
} );
