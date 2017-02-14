// Copyright 2017, University of Colorado Boulder

/**
 * Displays a value on a rectangular background.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  /**
   * @param {Property.<*>} valueProperty
   * @param {Object} [options]
   * @constructor
   */
  function ValueNode( valueProperty, options ) {

    options = _.extend( {
      valueToString: function( value ) { return '' + value; },
      valueMaxString: '12345', // strings longer than this will be scaled down
      valueMaxWidth: 100, // i18n, determined empirically
      font: new URFont( 20 ),
      xMargin: 8,
      yMargin: 4
    }, options );

    // value, displayed when expanded
    var valueNode = new Text( options.valueMaxString, {
      font: options.font,
      maxWidth: options.valueMaxWidth // i18n, determined empirically
    } );

    // background rectangle
    var backgroundWith = valueNode.width + ( 2 * options.xMargin );
    var backgroundHeight = valueNode.height + ( 2 * options.yMargin );
    var backgroundNode = new Rectangle( 0, 0, backgroundWith, backgroundHeight, {
      cornerRadius: 4,
      fill: 'white',
      stroke: 'black'
    } );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ backgroundNode, valueNode ];

    Node.call( this, options );

    // update value display
    var valueObserver = function( value ) {
      valueNode.text = options.valueToString( value );
      valueNode.right = backgroundNode.right - options.xMargin;
      valueNode.centerY = backgroundNode.centerY;
    };
    valueProperty.link( valueObserver ); // unlink in dispose

    // @private
    this.disposeValueNode = function() {
      valueProperty.unlink( valueObserver );
    };
  }

  unitRates.register( 'ValueNode', ValueNode );

  return inherit( Node, ValueNode, {

    // @public
    dispose: function() {
      this.disposeValueNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );