// Copyright 2017, University of Colorado Boulder

/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CollapsibleValueNode = require( 'UNIT_RATES/common/view/CollapsibleValueNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var Util = require( 'DOT/Util' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<boolean>} expandedProperty
   * @param {string} titleString
   * @param {Object} [options]
   * @constructor
   */
  function RaceTimerNode( timeProperty, expandedProperty, titleString, options ) {

    options = _.extend( {
      font: new URFont( 14 ),
      valueMaxString: StringUtils.format( valueUnitsString, '000.00', hoursString ),
      valueToString: function( value ) {
        return StringUtils.format( valueUnitsString, Util.toFixed( value, 2 ), hoursString );
      }
    }, options );

    CollapsibleValueNode.call( this, timeProperty, expandedProperty, titleString, options );
  }

  unitRates.register( 'RaceTimerNode', RaceTimerNode );

  return inherit( CollapsibleValueNode, RaceTimerNode );
} );
