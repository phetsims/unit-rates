// Copyright 2017-2019, University of Colorado Boulder

/**
 * Accordion box used to modify a rate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import NumberPicker from '../../../../scenery-phet/js/NumberPicker.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import unitRatesStrings from '../../unit-rates-strings.js';
import unitRates from '../../unitRates.js';
import URConstants from '../URConstants.js';
import URFont from '../URFont.js';

const rateString = unitRatesStrings.rate;

// If the Rate accordion box appears to change size when switching categories, increase this value. Determined empirically.
const MIN_FRACTION_LINE_LENGTH = 115;

/**
 * @param {Rate} rate
 * @param {Object} [options]
 * @constructor
 */
function RateAccordionBox( rate, options ) {

  options = merge( {}, URConstants.ACCORDION_BOX_OPTIONS, {

    // AccordionBox options
    contentXMargin: 20,
    contentYMargin: 24,
    contentYSpacing: 20,

    // RateAccordionBox options
    titleString: rateString,
    unitsFont: new URFont( 16 ),
    unitsMaxWidth: 60, // i18n, determined empirically
    numeratorRange: new Range( 0, 10 ),
    denominatorRange: new Range( 0, 10 ),
    numeratorUnits: '',
    denominatorUnits: '',
    pickerFont: new URFont( 24 ),
    numeratorPickerColor: 'black',
    denominatorPickerColor: 'black',
    numeratorPickerUpFunction: function( value ) { return value + 1; },
    numeratorPickerDownFunction: function( value ) { return value - 1; },
    denominatorPickerUpFunction: function( value ) { return value + 1; },
    denominatorPickerDownFunction: function( value ) { return value - 1; },
    numeratorDecimals: 0,
    denominatorDecimals: 0,
    xSpacing: 10,
    ySpacing: 8

  }, options );

  assert && assert( options.numeratorRange.contains( rate.numeratorProperty.value ),
    'numerator out of range: ' + rate.numeratorProperty.value );
  assert && assert( options.denominatorRange.contains( rate.denominatorProperty.value ),
    'denominator out of range: ' + rate.denominatorProperty.value );

  assert && assert( !options.titleNode, 'creates its own title node' );
  options.titleNode = new Text( options.titleString, {
    font: URConstants.ACCORDION_BOX_TITLE_FONT,
    maxWidth: 100  // i18n, determined empirically
  } );

  // numerator picker, must be disposed
  const numeratorPicker = new NumberPicker( rate.numeratorProperty, new Property( options.numeratorRange ),
    merge( {}, URConstants.NUMBER_PICKER_OPTIONS, {
      upFunction: options.numeratorPickerUpFunction,
      downFunction: options.numeratorPickerDownFunction,
      decimalPlaces: options.numeratorDecimals,
      font: options.pickerFont,
      color: options.numeratorPickerColor
    } ) );

  // numerator units
  const numeratorUnitsNode = new Text( options.numeratorUnits, {
    font: options.unitsFont,
    maxWidth: options.unitsMaxWidth
  } );

  // denominator picker, must be disposed
  const denominatorPicker = new NumberPicker( rate.denominatorProperty, new Property( options.denominatorRange ),
    merge( {}, URConstants.NUMBER_PICKER_OPTIONS, {
      upFunction: options.denominatorPickerUpFunction,
      downFunction: options.denominatorPickerDownFunction,
      decimalPlaces: options.denominatorDecimals,
      font: options.pickerFont,
      color: options.denominatorPickerColor
    } ) );

  // denominator units
  const denominatorUnitsNode = new Text( options.denominatorUnits, {
    font: options.unitsFont,
    maxWidth: options.unitsMaxWidth
  } );

  const contentNode = new Node( {
    children: [ numeratorPicker, numeratorUnitsNode, denominatorPicker, denominatorUnitsNode ]
  } );

  // horizontal layout: center justify pickers, left justify labels
  denominatorPicker.centerX = numeratorPicker.centerX;
  numeratorUnitsNode.left = Math.max( numeratorPicker.right, denominatorPicker.right ) + options.xSpacing;
  denominatorUnitsNode.left = numeratorUnitsNode.left;

  // fraction line
  const fractionLineLength = Math.max( MIN_FRACTION_LINE_LENGTH,
    Math.max( numeratorUnitsNode.right - numeratorPicker.left, denominatorUnitsNode.right - denominatorPicker.left ) );
  const fractionLineNode = new Line( 0, 0, fractionLineLength, 0, {
    stroke: 'black',
    lineWidth: 2,
    left: Math.min( numeratorPicker.left, denominatorPicker.left )
  } );
  contentNode.addChild( fractionLineNode );

  // vertical layout
  numeratorUnitsNode.centerY = numeratorPicker.centerY;
  fractionLineNode.top = numeratorPicker.bottom + options.ySpacing;
  denominatorPicker.top = fractionLineNode.bottom + options.ySpacing;
  denominatorUnitsNode.centerY = denominatorPicker.centerY;

  AccordionBox.call( this, contentNode, options );

  // @private
  this.disposeRateAccordionBox = function() {
    numeratorPicker.dispose();
    denominatorPicker.dispose();
  };
}

unitRates.register( 'RateAccordionBox', RateAccordionBox );

export default inherit( AccordionBox, RateAccordionBox, {

  // @public
  dispose: function() {
    this.disposeRateAccordionBox();
    AccordionBox.prototype.dispose.call( this );
  }
} );