// Copyright 2017, University of Colorado Boulder

/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var CollapsiblePanel = require( 'UNIT_RATES/common/view/CollapsiblePanel' );
  var inherit = require( 'PHET_CORE/inherit' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var Util = require( 'DOT/Util' );
  var ValueNode = require( 'UNIT_RATES/common/view/ValueNode' );

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

      // ValueNode options
      font: new URFont( 14 ),
      valueToString: function( value ) {
        return StringUtils.format( valueUnitsString, Util.toFixed( value, 2 ), hoursString );
      }
    }, options );

    var valueNode = new ValueNode( timeProperty, {
      font: options.font,
      valueToString: options.valueToString
    } );

    CollapsiblePanel.call( this, valueNode, expandedProperty, titleString, options );
  }

  unitRates.register( 'RaceTimerNode', RaceTimerNode );

  return inherit( CollapsiblePanel, RaceTimerNode );
} );
