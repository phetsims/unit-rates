// Copyright 2017, University of Colorado Boulder

//TODO AccordionBox should have been usasble for this, but I ran into problems with i18n, spacing and margins
/**
 * Displays a ValueNode on a rectangular background, with an expand/collapse button.
 * When the display is expanded, it displays right-justified content.
 * When the display is collapsed, it displays left-justified title.
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
   * @param {Node} valueNode
   * @param {Property.<boolean>} expandedProperty
   * @param {string} titleString
   * @param {Object} [options]
   * @constructor
   */
  function CollapsiblePanel( valueNode, expandedProperty, titleString, options ) {

    options = _.extend( {

      // expand/collapse button
      buttonSideLength: 15,
      buttonTouchAreaXDilation: 30,
      buttonTouchAreaYDilation: 30,

      // rectangular background
      backgroundMinWidth: 130, // determined empirically
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
    var backgroundWith = Math.max( options.backgroundMinWidth, 
      maxWidth + expandCollapseButton.width + options.xSpacing + ( 2 * options.xMargin ) );
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
    valueNode.right = backgroundNode.right - options.xMargin;
    valueNode.centerY = backgroundNode.centerY;

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ backgroundNode, expandCollapseButton, titleNode, valueNode ];

    Node.call( this, options );

    // right justify valueNode when its bounds change
    valueNode.on( 'bounds', function() {
      valueNode.right = backgroundNode.right - options.xMargin;
      valueNode.centerY = backgroundNode.centerY;
    } );

    // expand/collapse
    var expandedObserver = function( expanded ) {
      valueNode.visible = expanded;
      titleNode.visible = !expanded;
    };
    expandedProperty.link( expandedObserver ); // unlink in dispose

    // @private
    this.disposeCollapsiblePanel = function() {
      expandCollapseButton.dispose();
      expandedProperty.unlink( expandedObserver );
    };
  }

  unitRates.register( 'CollapsiblePanel', CollapsiblePanel );

  return inherit( Node, CollapsiblePanel, {

    // @public
    dispose: function() {
      this.disposeCollapsiblePanel();
      Node.prototype.dispose.call( this );
    }
  } );
} );
