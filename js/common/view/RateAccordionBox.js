// Copyright 2017, University of Colorado Boulder

/**
 * Accordion box used to modify a rate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var rateString = require( 'string!UNIT_RATES/rate' );

  // If the Rate accordion box appears to change size when switching categories, increase this value. Determined empirically.
  var MIN_FRACTION_LINE_LENGTH = 115;

  /**
   * @param {Rate} rate
   * @param {Object} [options]
   * @constructor
   */
  function RateAccordionBox( rate, options ) {

    options = _.extend( {}, URConstants.ACCORDION_BOX_OPTIONS, {

      // AccordionBox options
      contentXMargin: 20,

      // RateAccordionBox options
      titleString: rateString,
      unitsFont: new URFont( 16 ),
      unitsMaxWidth: 125, // i18n, set empirically
      numeratorRange: new Range( 0, 10 ),
      denominatorRange: new Range( 0, 10 ),
      numeratorUnits: '',
      denominatorUnits: '',
      pickerFont: new URFont( 24 ),
      numeratorPickerColor: 'black',
      denominatorPickerColor: 'black',
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
      maxWidth: 100
    } );

    // numerator picker, must be disposed
    var numeratorPicker = new NumberPicker( rate.numeratorProperty, new Property( options.numeratorRange ), _.extend( {},
      URConstants.NUMBER_PICKER_OPTIONS, {
        font: options.pickerFont,
        color: options.numeratorPickerColor
      } ) );

    // numerator units
    var numeratorUnitsNode = new Text( options.numeratorUnits, {
      font: options.unitsFont,
      maxWidth: options.unitsMaxWidth
    } );

    // denominator picker, must be disposed
    var denominatorPicker = new NumberPicker( rate.denominatorProperty, new Property( options.denominatorRange ), _.extend( {},
      URConstants.NUMBER_PICKER_OPTIONS, {
        font: options.pickerFont,
        color: options.denominatorPickerColor
      } ) );

    // denominator units
    var denominatorUnitsNode = new Text( options.denominatorUnits, {
      font: options.unitsFont,
      maxWidth: options.unitsMaxWidth
    } );

    var contentNode = new Node( {
      children: [ numeratorPicker, numeratorUnitsNode, denominatorPicker, denominatorUnitsNode ]
    } );

    // horizontal layout: center justify pickers, left justify labels
    denominatorPicker.centerX = numeratorPicker.centerX;
    numeratorUnitsNode.left = Math.max( numeratorPicker.right, denominatorPicker.right ) + options.xSpacing;
    denominatorUnitsNode.left = numeratorUnitsNode.left;

    // fraction line
    var fractionLineLength = Math.max( MIN_FRACTION_LINE_LENGTH,
      Math.max( numeratorUnitsNode.right - numeratorPicker.left, denominatorUnitsNode.right - denominatorPicker.left ) );
    var fractionLineNode = new Line( 0, 0, fractionLineLength, 0, {
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

  return inherit( AccordionBox, RateAccordionBox, {

    // @public
    dispose: function() {
      this.disposeRateAccordionBox();
      AccordionBox.prototype.dispose.call( this );
    }
  } );
} );

