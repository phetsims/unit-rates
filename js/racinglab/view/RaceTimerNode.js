// Copyright 2017-2019, University of Colorado Boulder

/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const merge = require( 'PHET_CORE/merge' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URFont = require( 'UNIT_RATES/common/URFont' );
  const Utils = require( 'DOT/Utils' );
  const ValueNode = require( 'UNIT_RATES/common/view/ValueNode' );
  const ValuePanel = require( 'UNIT_RATES/common/view/ValuePanel' );

  // strings
  const hoursString = require( 'string!UNIT_RATES/hours' );
  const pattern0Value1UnitsString = require( 'string!UNIT_RATES/pattern_0value_1units' );

  // constants
  const TIMER_FONT = new URFont( 16 );
  const DECIMAL_PLACES = 2;

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<boolean>} expandedProperty
   * @param {string} titleString
   * @param {Object} [options]
   * @constructor
   */
  function RaceTimerNode( timeProperty, expandedProperty, titleString, options ) {

    // dispose not required, exists for sim lifetime
    const valueNode = new ValueNode( timeProperty, {
      font: TIMER_FONT,
      valueToString: function( value ) {
        return StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( value, DECIMAL_PLACES ), hoursString );
      }
    } );

    ValuePanel.call( this, valueNode, merge( {
      panelWidth: 132,
      expandedProperty: expandedProperty,
      titleString: titleString,
      titleFont: TIMER_FONT
    }, options ) );
  }

  unitRates.register( 'RaceTimerNode', RaceTimerNode );

  return inherit( ValuePanel, RaceTimerNode );
} );
