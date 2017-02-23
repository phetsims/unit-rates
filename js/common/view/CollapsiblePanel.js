// Copyright 2017, University of Colorado Boulder

/**
 * Displays a Node in a panel, with an expand/collapse button.
 * When expanded, it displays the right-justified Node.
 * When collapsed, it displays a left-justified title.
 * 
 * NOTE: While this seemed like a good application for AccordionBox, 
 * I ran into problems related to justifying and i18n.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
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
      
      // title
      titleMaxWidth: 100, // i18n, determined empirically
      titleFont: new URFont( 20 ),
      xSpacing: 8,  // space between expand/collapse button and title
      
      // minimum content size
      minContentWidth: 0,
      minContentHeight: 0,
      
      // Panel options
      cornerRadius: 4,
      xMargin: 8,
      yMargin: 4

    }, options );

    // dispose required
    var expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
      sideLength: options.buttonSideLength,
      touchAreaXDilation: options.buttonTouchAreaXDilation,
      touchAreaYDilation: options.buttonTouchAreaYDilation
    } );
    
    // title, displayed when collapsed
    var titleNode = new Text( titleString, {
      font: options.titleFont,
      maxWidth: options.titleMaxWidth
    } );

    // invisible background rectangle that sits behind other UI elements, used for justifying valueNode
    var contentWidth = Math.max( options.minContentWidth, _.maxBy( [ titleNode, valueNode ], function( node ) {
      return node.width;
    } ).width );
    var contentHeight = Math.max( options.minContentHeight, _.maxBy( [ titleNode, valueNode, expandCollapseButton ], function( node ) {
      return node.height;
    } ).height );
    var backgroundNode = new Rectangle( 0, 0, contentWidth, contentHeight );

    // layout
    expandCollapseButton.left = backgroundNode.left;
    expandCollapseButton.centerY = backgroundNode.centerY;
    titleNode.left = expandCollapseButton.right + options.xSpacing;
    titleNode.centerY = backgroundNode.centerY;
    valueNode.right = backgroundNode.right;
    valueNode.centerY = backgroundNode.centerY;

    var contentNode = new Node({
      children: [ backgroundNode, expandCollapseButton, titleNode, valueNode ]
    } );

    Panel.call( this, contentNode, options );

    // right justify valueNode when its bounds change
    valueNode.on( 'bounds', function() {
      valueNode.right = backgroundNode.right;
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

  return inherit( Panel, CollapsiblePanel, {

    // @public
    dispose: function() {
      this.disposeCollapsiblePanel();
      Node.prototype.dispose.call( this );
    }
  } );
} );
