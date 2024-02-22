// Copyright 2017-2023, University of Colorado Boulder

/**
 * Timer in the 'Racing Lab' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Utils from '../../../../dot/js/Utils.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ValuePanel from '../../common/view/ValuePanel.js';
import unitRates from '../../unitRates.js';
import UnitRatesStrings from '../../UnitRatesStrings.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import { Text } from '../../../../scenery/js/imports.js';
import { DerivedStringProperty } from '../../../../axon/js/imports.js';

// constants
const TIMER_FONT = new PhetFont( 16 );
const DECIMAL_PLACES = 2;

export default class RaceTimerNode extends ValuePanel {

  public constructor( timeProperty: TReadOnlyProperty<number>,
                      expandedProperty: BooleanProperty,
                      titleStringProperty: TReadOnlyProperty<string> ) {

    const valueStringProperty = new DerivedStringProperty(
      [ timeProperty, UnitRatesStrings.pattern_0value_1unitsStringProperty, UnitRatesStrings.hoursStringProperty ],
      ( time, patternString, hoursString ) => StringUtils.format( patternString, Utils.toFixed( time, DECIMAL_PLACES ), hoursString )
    );

    const valueText = new Text( valueStringProperty, {
      font: TIMER_FONT
    } );

    super( valueText, {
      panelWidth: 132,
      expandedProperty: expandedProperty,
      titleStringProperty: titleStringProperty,
      titleFont: TIMER_FONT
    } );
  }
}

unitRates.register( 'RaceTimerNode', RaceTimerNode );