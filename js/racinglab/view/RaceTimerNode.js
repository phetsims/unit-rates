// Copyright 2017-2020, University of Colorado Boulder

/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import URFont from '../../common/URFont.js';
import ValueNode from '../../common/view/ValueNode.js';
import ValuePanel from '../../common/view/ValuePanel.js';
import unitRatesStrings from '../../unitRatesStrings.js';
import unitRates from '../../unitRates.js';

// strings
const hoursString = unitRatesStrings.hours;
const pattern0Value1UnitsString = unitRatesStrings.pattern_0value_1units;

// constants
const TIMER_FONT = new URFont( 16 );
const DECIMAL_PLACES = 2;

class RaceTimerNode extends ValuePanel {

  /**
   * @param {Property.<number>} timeProperty
   * @param {Property.<boolean>} expandedProperty
   * @param {string} titleString
   * @param {Object} [options]
   */
  constructor( timeProperty, expandedProperty, titleString, options ) {

    // dispose not required, exists for sim lifetime
    const valueNode = new ValueNode( timeProperty, {
      font: TIMER_FONT,
      valueToString: value => StringUtils.format( pattern0Value1UnitsString, Utils.toFixed( value, DECIMAL_PLACES ), hoursString )
    } );

    super( valueNode, merge( {
      panelWidth: 132,
      expandedProperty: expandedProperty,
      titleString: titleString,
      titleFont: TIMER_FONT
    }, options ) );
  }
}

unitRates.register( 'RaceTimerNode', RaceTimerNode );

export default RaceTimerNode;