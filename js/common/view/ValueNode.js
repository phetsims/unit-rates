// Copyright 2017-2020, University of Colorado Boulder

/**
 * Displays the value of some generic Property.
 * Client specifies how the value is converted to a string via options.valueToString.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import unitRates from '../../unitRates.js';
import URFont from '../URFont.js';

/**
 * @param {Property.<number>} valueProperty
 * @param {Object} [options]
 * @constructor
 */
function ValueNode( valueProperty, options ) {

  const self = this;

  options = merge( {
    font: new URFont( 20 ),
    valueToString: function( value ) { return '' + value; }
  }, options );

  Text.call( this, '' ); // string will be filled in by valueObserver

  // update value display
  const valueObserver = function( value ) {
    self.text = options.valueToString( value );
  };
  valueProperty.link( valueObserver ); // unlink in dispose

  // @private
  this.disposeValueNode = function() {
    valueProperty.unlink( valueObserver );
  };

  this.mutate( options );
}

unitRates.register( 'ValueNode', ValueNode );

export default inherit( Text, ValueNode, {

  // @public
  dispose: function() {
    this.disposeValueNode();
    Text.prototype.dispose.call( this );
  }
} );