// Copyright 2017-2021, University of Colorado Boulder

/**
 * Displays the value of some generic Property.
 * Client specifies how the value is converted to a string via options.valueToString.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import unitRates from '../../unitRates.js';

class ValueNode extends Text {

  /**
   * @param {Property.<number>} valueProperty
   * @param {Object} [options]
   */
  constructor( valueProperty, options ) {

    options = merge( {
      font: new PhetFont( 20 ),
      valueToString: value => ( `${value}` )
    }, options );

    super( '' ); // string will be filled in by valueObserver

    // update value display
    const valueObserver = value => {
      this.text = options.valueToString( value );
    };
    valueProperty.link( valueObserver ); // unlink in dispose

    // @private
    this.disposeValueNode = () => {
      valueProperty.unlink( valueObserver );
    };

    this.mutate( options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    this.disposeValueNode();
    super.dispose();
  }
}

unitRates.register( 'ValueNode', ValueNode );

export default ValueNode;