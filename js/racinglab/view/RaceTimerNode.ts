// Copyright 2017-2023, University of Colorado Boulder

/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ValueNode from '../../common/view/ValueNode.js';
import ValuePanel from '../../common/view/ValuePanel.js';
import unitRates from '../../unitRates.js';
import UnitRatesStrings from '../../UnitRatesStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

// constants
const TIMER_FONT = new PhetFont( 16 );
const DECIMAL_PLACES = 2;

export default class RaceTimerNode extends ValuePanel {

  public constructor( timeProperty: TReadOnlyProperty<number>,
                      expandedProperty: BooleanProperty,
                      titleStringProperty: TReadOnlyProperty<string> ) {

    // dispose not required, exists for sim lifetime
    const valueNode = new ValueNode( timeProperty, {
      font: TIMER_FONT,
      valueToString: ( value: number ) => StringUtils.format( UnitRatesStrings.pattern_0value_1units,
        Utils.toFixed( value, DECIMAL_PLACES ), UnitRatesStrings.hours )
    } );

    super( valueNode, {
      panelWidth: 132,
      expandedProperty: expandedProperty,
      titleStringProperty: titleStringProperty,
      titleFont: TIMER_FONT
    } );
  }
}

unitRates.register( 'RaceTimerNode', RaceTimerNode );