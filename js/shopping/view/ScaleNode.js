// Copyright 2017, University of Colorado Boulder

/**
 * View of the scale, with display for cost and (optionally) quantity.
 * Origin is at the center of the top surface.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CostNode = require( 'UNIT_RATES/shopping/view/CostNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );
  var ValueNode = require( 'UNIT_RATES/common/view/ValueNode' );
  var ValuePanel = require( 'UNIT_RATES/common/view/ValuePanel' );

  // strings
  var costString = require( 'string!UNIT_RATES/cost' );
  var pattern0Value1UnitsString = require( 'string!UNIT_RATES/pattern_0value_1units' );

  // constants
  var PANEL_WIDTH = 132;
  var PANEL_MIN_HEIGHT = 32;
  var DISPLAY_X_MARGIN = 25;
  var DISPLAY_Y_MARGIN = 7;

  /**
   * @param {Scale} scale
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( scale, options ) {

    options = _.extend( {
      costExpandedProperty: null, // {Property.<boolean>|null} null indicates that cost display is not collapsible
      extraCostDecimalVisible: false, // {boolean} does the scale show a 3rd decimal place for cost?
      quantityIsDisplayed: false // {boolean} does the scale show quantity?
    }, options );

    // round platter on top, origin at center ---------------------------------------------------

    var topThickness = 8;
    var topRadiusX = 0.5 * scale.width;
    var topRadiusY = 0.5 * scale.depth;
    var topFaceShape = new Shape()
      .ellipse( 0, 0, topRadiusX, topRadiusY, 0 );
    var topSideShape = new Shape()
      .moveTo( -topRadiusX, 0 )
      .lineTo( -topRadiusX, topThickness )
      .ellipticalArc( 0, topThickness, topRadiusX, topRadiusY, 0, Math.PI, 0, true )
      .lineTo( topRadiusX, 0 )
      .close();

    var topFaceNode = new Path( topFaceShape, {
      fill: new LinearGradient( -topRadiusX / 2, -topRadiusX / 2, topRadiusX / 2, topRadiusX / 2 )
        .addColorStop( 0, URColors.scaleTopLight )
        .addColorStop( 0.5, URColors.scaleTopDark )
        .addColorStop( 1, URColors.scaleTopLight ),
      stroke: 'black'
    } );
    var topSideNode = new Path( topSideShape, {
      fill: 'rgb( 140, 140, 140 )',
      stroke: 'black'
    } );
    var topNode = new Node( {
      children: [ topSideNode, topFaceNode ]
    } );

    // shadow under the top platter
    var shadowNode = new Path( topFaceShape, {
      fill: 'rgb( 100, 100, 100 )',
      opacity: 0.2,
      y: topFaceNode.y + ( 2 * topThickness )
    } );

    // body of the scale ---------------------------------------------------------------------

    // scale.width is the width at the midpoint of the scale's top face, compute the foreground and background widths
    var foregroundWidth = scale.width + scale.perspectiveXOffset;
    var backgroundWidth = scale.width - scale.perspectiveXOffset;

    // draw top face clockwise, starting at front-left corner, in pseudo-3D using parallel perspective
    var bodyShape = new Shape()
      .moveTo( 0, 0 )
      .lineTo( scale.perspectiveXOffset, -scale.depth )
      .lineTo( scale.perspectiveXOffset + backgroundWidth, -scale.depth )
      .lineTo( foregroundWidth, 0 );

    // add front face
    bodyShape.rect( 0, 0, scale.width + scale.perspectiveXOffset, scale.height );

    // origin at center of top face
    var bodyNode = new Path( bodyShape, {
      fill: URColors.scaleBody,
      stroke: 'black',
      lineJoin: 'round',
      centerX: topNode.centerX,
      centerY: topNode.centerY + scale.depth
    } );

    // display on front of the scale ---------------------------------------------------------------------

    // display background
    var displayBackgroundNode = new Rectangle( 0, 0, foregroundWidth - ( 2 * DISPLAY_X_MARGIN ), scale.height - ( 2 * DISPLAY_Y_MARGIN ), {
      fill: 'black',
      cornerRadius: 4,
      left: bodyNode.left + DISPLAY_X_MARGIN,
      bottom: bodyNode.bottom - DISPLAY_Y_MARGIN
    } );

    // Nodes that make up the numeric display on the scale
    var displayChildren = [];

    // dispose required
    var costNode = new CostNode( scale.costProperty, {
      extraDecimalVisible: options.extraCostDecimalVisible,
      maxWidth: 90 // i18n, determined empirically
    } );

    // dispose required
    var costPanel = new ValuePanel( costNode, {
      panelWidth: PANEL_WIDTH,
      panelMinHeight: PANEL_MIN_HEIGHT,
      expandedProperty: options.costExpandedProperty,
      titleString: costString
    } );
    displayChildren.push( costPanel );

    // optional quantity display
    if ( options.quantityIsDisplayed ) {

      // dispose required
      var quantityNode = new ValueNode( scale.quantityProperty, {
        valueToString: function( value ) {
          return quantityToString( value, scale.quantityUnits );
        }
      } );

      // dispose required
      var quantityPanel = new ValuePanel( quantityNode, {
        panelWidth: PANEL_WIDTH,
        panelMinHeight: PANEL_MIN_HEIGHT
      } );
      displayChildren.push( quantityPanel );
    }

    // Assemble the display
    var displayNode = new Node( {
      children: [
        displayBackgroundNode,
        new HBox( {
          children: displayChildren,
          align: 'center',
          spacing: 8,
          center: displayBackgroundNode.center
        } ) ]
    } );

    // put all of the above pieces together ---------------------------------------------------------------------

    // This type does not propagate options to the supertype because the model determines location.
    Node.call( this, {
      children: [ bodyNode, shadowNode, topNode, displayNode ]
    } );

    // red dot at origin, red line at drag threshold
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
      var lineY = scale.yAboveScale - scale.location.y;
      this.addChild( new Line( -foregroundWidth / 2, lineY, foregroundWidth / 2, lineY, { stroke: 'red' } ) );
    }

    // move to model location
    this.translation = scale.location;

    // @private
    this.disposeScaleNode = function() {
      costNode.dispose();
      costPanel.dispose();
      quantityNode && quantityNode.dispose();
      quantityPanel && quantityPanel.dispose();
    };
  }

  unitRates.register( 'ScaleNode', ScaleNode );

  /**
   * Converts a quantity to a string, e.g. 10.5 -> '10.5 lb'
   * @param {number} quantity
   * @param {string} units
   * @returns {string}
   */
  var quantityToString = function( quantity, units ) {
    return StringUtils.format( pattern0Value1UnitsString,
      URUtil.numberToString( quantity, 1 /* maxDecimals */, false /* trimZeros */ ), units );
  };

  return inherit( Node, ScaleNode, {

    // @public
    dispose: function() {
      this.disposeScaleNode();
      Node.prototype.dispose.call( this );
    }
  } );
} );
