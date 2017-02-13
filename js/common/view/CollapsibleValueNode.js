// Copyright 2017, University of Colorado Boulder

/**
 * Collapsible display for a value.
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
   * @param {Property.<number>} valueProperty
   * @param {Property.<boolean>} expandedProperty
   * @param {Object} [options]
   * @constructor
   */
  function CollapsibleValueNode( valueProperty, expandedProperty, options ) {

    options = _.extend( {

      // expand/collapse button
      buttonSideLength: 15,
      buttonTouchAreaXDilation: 30,
      buttonTouchAreaYDilation: 30,

      // value
      valueMaxWidth: 95,
      valueFont: new URFont( 14 ),
      valueMaxString: '',
      valueToString: function( value ) { return '' + value; },

      // title
      titleString: '',
      titleMaxWidth: 95,
      titleFont: new URFont( 14 ),

      // panel
      fill: 'white',
      cornerRadius: 4,
      xMargin: 8,
      yMargin: 4,
      xSpacing: 4

    }, options );

    // title, displayed when collapsed
    var titleNode = new Text( options.titleString, {
      font: options.titleFont,
      maxWidth: options.titleMaxWidth // i18n, determined empirically
    } );

    // value, displayed when expanded
    var valueNode = new Text( options.valueMaxString, {
      font: options.valueFont,
      maxWidth: options.valueMaxWidth // i18n, determined empirically
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
    var backgroundHeight = maxHeight + ( 2 * options.yMargin );
    var backgroundNode = new Rectangle( 0, 0, backgroundWith, backgroundHeight, {
      cornerRadius: options.cornerRadius,
      fill: options.fill,
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

    // update time display
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
