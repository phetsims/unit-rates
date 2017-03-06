// Copyright 2017, University of Colorado Boulder

/**
 * Displays a value in a panel, with an optional expand/collapse button.
 * When expanded, it displays the right-justified Node.
 * When collapsed, it displays a left-justified title.
 *
 * NOTE: While this seems like a good application for AccordionBox,
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

  // constants
  var BACKGROUND_RECTANGLE_STROKE = ( phet.chipper.queryParameters.dev ? 'red' : null );

  /**
   * @param {Node} valueNode
   * @param {Object} [options]
   * @constructor
   */
  function ValuePanel( valueNode, options ) {

    options = _.extend( {

      panelWidth: 100, // {number} contents are scaled to fit, height depends on contents
      panelMinHeight: 0, // {number} minimum panel height

      // expand/collapse button
      expandedProperty: null, // {Property.<boolean>|null} null indicates no expand/collapse button
      buttonSideLength: 15,
      buttonTouchAreaXDilation: 30,
      buttonTouchAreaYDilation: 30,

      // title
      titleString: '', // {string} string displayed when the panel is collapsed
      titleMaxWidth: 100, // i18n, determined empirically
      titleFont: new URFont( 20 ),
      xSpacing: 8,  // space between expand/collapse button and title

      // Panel options
      cornerRadius: 4,
      xMargin: 8,
      yMargin: 4

    }, options );

    var contentNode = new Node();
    contentNode.addChild( valueNode );

    // width of panel content
    var contentWidth = options.panelWidth - ( 2 * options.xMargin );
    var minContentHeight = Math.max( 0, options.panelMinHeight - ( 2 * options.yMargin ) );

    // invisible rectangle whose size is equivalent to the size of the panel's content, used for right justifying valueNode
    var backgroundNode = null; // assigned below

    var contentHeight = 0; // computed below
    if ( !options.expandedProperty ) {

      // limit valueNode width
      valueNode.maxWidth = contentWidth;

      contentHeight = Math.max( minContentHeight, valueNode.height );
      
      backgroundNode = new Rectangle( 0, 0, contentWidth, contentHeight, { stroke: BACKGROUND_RECTANGLE_STROKE } );
      contentNode.addChild( backgroundNode );
    }
    else {

      // expand/collapse button, dispose required
      var expandCollapseButton = new ExpandCollapseButton( options.expandedProperty, {
        sideLength: options.buttonSideLength,
        touchAreaXDilation: options.buttonTouchAreaXDilation,
        touchAreaYDilation: options.buttonTouchAreaYDilation
      } );
      contentNode.addChild( expandCollapseButton );

      // space to right of button
      var maxExpandedWidth = contentWidth - expandCollapseButton.width - options.xSpacing;

      // title, displayed when collapsed
      var titleNode = new Text( options.titleString, {
        font: options.titleFont,
        maxWidth: maxExpandedWidth
      } );
      contentNode.addChild( titleNode );

      // limit valueNode width
      valueNode.maxWidth = maxExpandedWidth;

      contentHeight = Math.max( minContentHeight, _.maxBy( [ titleNode, valueNode, expandCollapseButton ], function( node ) {
        return node.height;
      } ).height );
      backgroundNode = new Rectangle( 0, 0, contentWidth, contentHeight, { stroke: BACKGROUND_RECTANGLE_STROKE } );
      contentNode.addChild( backgroundNode );

      // layout
      expandCollapseButton.left = backgroundNode.left;
      expandCollapseButton.centerY = backgroundNode.centerY;
      titleNode.left = expandCollapseButton.right + options.xSpacing;
      titleNode.centerY = backgroundNode.centerY;

      // expand/collapse
      var expandedObserver = function( expanded ) {
        valueNode.visible = expanded;
        titleNode.visible = !expanded;
      };
      options.expandedProperty.link( expandedObserver ); // unlink in dispose
    }

    backgroundNode.moveToBack();
    valueNode.right = backgroundNode.right;
    valueNode.centerY = backgroundNode.centerY;

    Panel.call( this, contentNode, options );

    // right justify valueNode when its bounds change
    valueNode.on( 'bounds', function() {
      valueNode.right = backgroundNode.right;
      valueNode.centerY = backgroundNode.centerY;
    } );

    // @private
    this.disposeValuePanel = function() {
      expandCollapseButton && expandCollapseButton.dispose();
      options.expandedProperty && options.expandedProperty.unlink( expandedObserver );
    };
  }

  unitRates.register( 'ValuePanel', ValuePanel );

  return inherit( Panel, ValuePanel, {

    // @public
    dispose: function() {
      this.disposeValuePanel();
      Panel.prototype.dispose.call( this );
    }
  } );
} );
