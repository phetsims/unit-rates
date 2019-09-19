// Copyright 2017, University of Colorado Boulder

/**
 * Displays the value of some generic Property.
 * Client specifies how the value is converted to a string via options.valueToString.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const inherit = require( 'PHET_CORE/inherit' );
  const Text = require( 'SCENERY/nodes/Text' );
  const unitRates = require( 'UNIT_RATES/unitRates' );
  const URFont = require( 'UNIT_RATES/common/URFont' );

  /**
   * @param {Property.<number>} valueProperty
   * @param {Object} [options]
   * @constructor
   */
  function ValueNode( valueProperty, options ) {

    const self = this;

    options = _.extend( {
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

  return inherit( Text, ValueNode, {

    // @public
    dispose: function() {
      this.disposeValueNode();
      Text.prototype.dispose.call( this );
    }
  } );
} );