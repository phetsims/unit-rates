// Copyright 2017-2020, University of Colorado Boulder

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

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import ExpandCollapseButton from '../../../../sun/js/ExpandCollapseButton.js';
import Panel from '../../../../sun/js/Panel.js';
import unitRates from '../../unitRates.js';
import URFont from '../URFont.js';

// constants
const BACKGROUND_RECTANGLE_STROKE = ( phet.chipper.queryParameters.dev ? 'red' : null );

/**
 * @param {Node} valueNode
 * @param {Object} [options]
 * @constructor
 */
function ValuePanel( valueNode, options ) {

  options = merge( {

    panelWidth: 100, // {number} contents are scaled to fit, height depends on contents
    panelMinHeight: 0, // {number} minimum panel height

    // expand/collapse button
    expandedProperty: null, // {Property.<boolean>|null} null indicates no expand/collapse button

    // title
    titleString: '', // {string} string displayed when the panel is collapsed
    titleFont: new URFont( 20 ),
    xSpacing: 8,  // space between expand/collapse button and title

    // Panel options
    cornerRadius: 4,
    xMargin: 8,
    yMargin: 4

  }, options );

  const contentNode = new Node();
  contentNode.addChild( valueNode );

  // width of panel content
  const contentWidth = options.panelWidth - ( 2 * options.xMargin );
  const minContentHeight = Math.max( 0, options.panelMinHeight - ( 2 * options.yMargin ) );

  // invisible rectangle whose size is equivalent to the size of the panel's content, used for right justifying valueNode
  let backgroundNode = null; // assigned below

  let contentHeight = 0; // computed below
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
      sideLength: 15,
      touchAreaXDilation: 8,
      touchAreaYDilation: 10,
      touchAreaYShift: -4,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 5
    } );
    contentNode.addChild( expandCollapseButton );

    // space to right of button
    const maxExpandedWidth = contentWidth - expandCollapseButton.width - options.xSpacing;

    // title, displayed when collapsed
    const titleNode = new Text( options.titleString, {
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
  const boundsListener = function() {
    valueNode.right = backgroundNode.right;
    valueNode.centerY = backgroundNode.centerY;
  };
  valueNode.on( 'bounds', boundsListener ); // off in dispose

  // @private
  this.disposeValuePanel = function() {
    expandCollapseButton && expandCollapseButton.dispose();
    options.expandedProperty && options.expandedProperty.unlink( expandedObserver );
    valueNode.off( 'bounds', boundsListener );
  };
}

unitRates.register( 'ValuePanel', ValuePanel );

export default inherit( Panel, ValuePanel, {

  // @public
  dispose: function() {
    this.disposeValuePanel();
    Panel.prototype.dispose.call( this );
  }
} );