// Copyright 2017, University of Colorado Boulder

/**
 * The 'Rate' accordion box in the 'Shopping Lab' screen, used to modify a unit rate.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Fraction = require( 'PHETCOMMON/model/Fraction' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );

  // sim modules
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var rateString = require( 'string!UNIT_RATES/rate' );

  // constants
  var UNITS_TEXT_OPTIONS = {
    font: new URFont( 16 ),
    maxWidth: 125 // i18n, set empirically
  };
  // If the Rate accordion box appears to change size when switching categories, increase this value. Determined empirically.
  var MIN_FRACTION_LINE_LENGTH = 115;

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Object} [options]
   * @constructor
   */
  function RateAccordionBox( unitRateProperty, options ) {

    options = _.extend( {}, URConstants.ACCORDION_BOX_OPTIONS, {

      // AccordionBox options
      titleNode: new Text( rateString, { font: new URFont( 18 ), maxWidth: 100 } ),
      contentXMargin: 20,

      // RateAccordionBox options
      unitRateDecimals: 2,
      numeratorRange: URConstants.COST_RANGE,
      denominatorRange: URConstants.QUANTITY_RANGE,
      numeratorUnits: '',
      denominatorUnits: '',
      numeratorPickerColor: 'black',
      denominatorPickerColor: 'black',
      xSpacing: 10,
      ySpacing: 15

    }, options );

    // numerator
    var numeratorProperty = new Property( options.numeratorRange.min );
    var numeratorPicker = new NumberPicker( numeratorProperty, new Property( options.numeratorRange ), _.extend( {},
      URConstants.NUMBER_PICKER_OPTIONS, {
        color: options.numeratorPickerColor
      } ) );
    var numeratorUnitsNode = new Text( options.numeratorUnits, UNITS_TEXT_OPTIONS );

    // denominator
    var denominatorProperty = new Property( options.numeratorRange.min );
    var denominatorPicker = new NumberPicker( denominatorProperty, new Property( options.denominatorRange ), _.extend( {},
      URConstants.NUMBER_PICKER_OPTIONS, {
        color: options.denominatorPickerColor
      } ) );
    var denominatorUnitsNode = new Text( options.denominatorUnits, UNITS_TEXT_OPTIONS );


    var contentNode = new Node( {
      children: [  numeratorPicker, numeratorUnitsNode,  denominatorPicker, denominatorUnitsNode ]
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

    // Flag to prevent computation of unit rate before both numerator and denominator Properties have been updated.
    var fractionObserverEnabled = true;

    // Update unit rate when numerator or denominator changes
    var fractionObserver = function() {
      if ( fractionObserverEnabled ) {
        unitRateProperty.value = Util.toFixedNumber( numeratorProperty.value / denominatorProperty.value, options.unitRateDecimals );
      }
    };
    numeratorProperty.lazyLink( fractionObserver ); // no unlink needed
    denominatorProperty.lazyLink( fractionObserver ); // no unlink needed

    // Update numerator and denominator when unit rate changes
    var unitRateObserver = function( unitRate ) {

      // round to number of decimal places that we are interested in
      unitRate = Util.toFixedNumber( unitRate, options.unitRateDecimals );

      // Determine if the current numerator and denominator are equivalent to unitRate.
      // This is necessary to handle rates like 1/3, whose corresponding unit rate is 0.33333333333....
      var currentRate = Util.toFixedNumber( numeratorProperty.value / denominatorProperty.value, options.unitRateDecimals );

      // If the current numerator and denominator are not equivalent to unit rate, then update them.
      if ( currentRate !== unitRate ) {

        // compute numerator and denominator
        var denominator = Math.pow( 10, options.unitRateDecimals );
        var fraction = new Fraction( unitRate * denominator, denominator );
        fraction.reduce();

        // update Properties, but don't fire observer until they have both changed
        fractionObserverEnabled = false;
        numeratorProperty.value = Util.toFixedNumber( fraction.numerator, 0 );
        fractionObserverEnabled = true;
        denominatorProperty.value = Util.toFixedNumber( fraction.denominator, 0 );
      }
    };
    unitRateProperty.link( unitRateObserver ); // unlink in dispose

    // @private
    this.disposeRateAccordionBox = function() {
      unitRateProperty.unlink( unitRateObserver );
    };
  }

  unitRates.register( 'RateAccordionBox', RateAccordionBox );

  return inherit( AccordionBox, RateAccordionBox, {

    // @public
    dispose: function() {
      AccordionBox.prototype.dispose && AccordionBox.prototype.dispose.call( this );
      this.disposeRateAccordionBox();
    }
  } );
} );

