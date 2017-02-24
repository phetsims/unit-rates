// Copyright 2017, University of Colorado Boulder

/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var Util = require( 'DOT/Util' );
  var ValueNode = require( 'UNIT_RATES/common/view/ValueNode' );
  var ValuePanel = require( 'UNIT_RATES/common/view/ValuePanel' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  // constants
  var TIMER_FONT = new URFont( 16 );
  var DECIMAL_PLACES = 2;

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<boolean>} expandedProperty
   * @param {string} titleString
   * @param {Object} [options]
   * @constructor
   */
  function RaceTimerNode( timeProperty, expandedProperty, titleString, options ) {

    var valueNode = new ValueNode( timeProperty, {
      font: TIMER_FONT,
      valueToString: function( value ) {
        return StringUtils.format( valueUnitsString, Util.toFixed( value, DECIMAL_PLACES ), hoursString );
      }
    } );

    ValuePanel.call( this, valueNode, _.extend( {
      panelWidth: 132,
      expandedProperty: expandedProperty,
      titleString: titleString,
      titleFont: TIMER_FONT
    }, options ) );
  }

  unitRates.register( 'RaceTimerNode', RaceTimerNode );

  return inherit( ValuePanel, RaceTimerNode );
} );
