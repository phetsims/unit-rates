// Copyright 2017, University of Colorado Boulder

/**
 * Displays a value on a rectangular background, with an expand/collapse button.
 * When the display is expanded, it displays the right-justified value.
 * When the display is collapsed, it displays a left-justified title.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  /**
   * @param {Property.<*>} valueProperty
   * @param {Property.<boolean>} expandedProperty
   * @param {string} titleString
   * @param {Object} [options]
   * @constructor
   */
  function CollapsibleValueNode( valueProperty, expandedProperty, titleString, options ) {

    options = _.extend( {

      // expand/collapse button
      buttonSideLength: 15,
      buttonTouchAreaXDilation: 30,
      buttonTouchAreaYDilation: 30,

      // value
      valueToString: function( value ) { return '' + value; },
      valueMaxString: '12345', // strings longer than this will be scaled down
      valueMaxWidth: 100, // i18n, determined empirically
      backgroundMinHeight: 30, // minimum height of the background

      // title
      titleMaxWidth: 100, // i18n, determined empirically

      // panel
      font: new URFont( 20 ),
      xMargin: 8,
      yMargin: 4,
      xSpacing: 8

    }, options );

    // title, displayed when collapsed
    var titleNode = new Text( titleString, {
      font: options.font,
      maxWidth: options.titleMaxWidth
    } );

    // value, displayed when expanded
    var valueNode = new Text( options.valueMaxString, {
      font: options.font,
      maxWidth: options.valueMaxWidth
    } );

    // dispose required
    var expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
      sideLength: options.buttonSideLength,
      touchAreaXDilation: options.buttonTouchAreaXDilation,
      touchAreaYDilation: options.buttonTouchAreaYDilation
    } );

    // background rectangle
    var maxWidth = _.maxBy( [ titleNode, valueNode ], function( node ) {
      return node.width;
    } ).width;
    var maxHeight = _.maxBy( [ titleNode, valueNode, expandCollapseButton ], function( node ) {
      return node.height;
    } ).height;
    var backgroundWith = maxWidth + expandCollapseButton.width + options.xSpacing + ( 2 * options.xMargin );
    var backgroundHeight = Math.max( options.backgroundMinHeight, maxHeight + ( 2 * options.yMargin ) );
    var backgroundNode = new Rectangle( 0, 0, backgroundWith, backgroundHeight, {
      cornerRadius: 4,
      fill: 'white',
      stroke: 'black'
    } );

    // layout
    expandCollapseButton.left = backgroundNode.left + options.xMargin;
    expandCollapseButton.centerY = backgroundNode.centerY;
    titleNode.left = expandCollapseButton.right + options.xSpacing;
    titleNode.centerY = backgroundNode.centerY;
    // valueNode layout is handled by valueObserver

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ backgroundNode, expandCollapseButton, titleNode, valueNode ];

    Node.call( this, options );

    // expand/collapse
    var expandedObserver = function( expanded ) {
      valueNode.visible = expanded;
      titleNode.visible = !expanded;
    };
    expandedProperty.link( expandedObserver ); // unlink in dispose

    // update value display
    var valueObserver = function( value ) {
      valueNode.text = options.valueToString( value );
      valueNode.right = backgroundNode.right - options.xMargin;
      valueNode.centerY = backgroundNode.centerY;
    };
    valueProperty.link( valueObserver ); // unlink in dispose

    // @private
    this.disposeCollapsibleValueNode = function() {
      expandCollapseButton.dispose();
      expandedProperty.unlink( expandedObserver );
      valueProperty.unlink( valueObserver );
    };
  }

  unitRates.register( 'CollapsibleValueNode', CollapsibleValueNode );

  return inherit( Node, CollapsibleValueNode, {

    // @public
    dispose: function() {
      this.disposeCollapsibleValueNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
