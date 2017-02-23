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
  var CollapsiblePanel = require( 'UNIT_RATES/common/view/CollapsiblePanel' );
  var CostNode = require( 'UNIT_RATES/common/view/CostNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );
  var ValueNode = require( 'UNIT_RATES/common/view/ValueNode' );

  // images
  var scaleImage = require( 'image!UNIT_RATES/scale.png' );

  // strings
  var costString = require( 'string!UNIT_RATES/cost' );
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  // constants
  var PANEL_OPTIONS = {
    align: 'right',
    xMargin: 8,
    yMargin: 4,
    minWidth: 110,
    resize: false,
    cornerRadius: 4
  };

  /**
   * @param {Scale} scale
   * @param {Property.<boolean>} costExpandedProperty - is the cost display expanded?
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( scale, costExpandedProperty, options ) {

    options = _.extend( {

      //TODO replace this option with costExpandedProperty:null
      costIsCollapsible: false, // {boolean} is the cost display collapsible?
      extraCostDecimalVisible: false, // {boolean} does the scale show a 3rd decimal place for cost?
      quantityIsDisplayed: false // {boolean} does the scale show quantity?
    }, options );

    // Body of the scale, origin at center of top surface
    var scaleImageNode = new Image( scaleImage, { scale: 0.5 } );
    scaleImageNode.x = -scaleImageNode.width / 2;
    scaleImageNode.y = -0.1 * scaleImageNode.height; // multiplier is specific to image file

    // Nodes that make up the numeric display on the scale
    var displayChildren = [];

    // Cost panel
    // dispose required
    var costNode = new CostNode( scale.costProperty, {
      extraDecimalVisible: options.extraCostDecimalVisible,
      maxWidth: 90 // i18n, determined empirically
    } );
    if ( options.costIsCollapsible ) {

      // dispose required
      var costPanel = new CollapsiblePanel( costNode, costExpandedProperty, costString, {
        minContentWidth: 115,
        minContentHeight: 15,
        valueToString: function( value ) {
          return costToString( value );
        }
      } );
      displayChildren.push( costPanel );
    }
    else {

      // dispose required
      displayChildren.push( new Panel( costNode, PANEL_OPTIONS ) );
    }

    // Quantity panel
    var quantityNode = null;
    if ( options.quantityIsDisplayed ) {

      // dispose required
      quantityNode = new ValueNode( scale.quantityProperty, {
        maxWidth: 100, // i18n, determined empirically
        valueToString: function( value ) {
          return quantityToString( value, scale.quantityUnits );
        }
      } );
      displayChildren.push( new Panel( quantityNode, PANEL_OPTIONS ) );
    }

    // Assemble the numeric display(s)
    var displayNode = new HBox( {
      children: displayChildren,
      align: 'center',
      spacing: 15,

      // These coordinates are dependent on the image file, and were determined empirically
      centerX: scaleImageNode.centerX,
      centerY: scaleImageNode.bottom - 32
    } );

    // This type does not propagate options to the supertype because the model determines location.
    Node.call( this, {
      children: [ scaleImageNode, displayNode ]
    } );

    // red dot at origin, red line where items will be placed
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
      this.addChild( new Line( -scale.width / 2, 0, scale.width / 2, 0, { stroke: 'red' } ) );
    }

    // move to model location
    this.translation = scale.location;

    // @private
    this.disposeScaleNode = function() {
      costNode.dispose();
      costPanel && costPanel.dispose();
      quantityNode && quantityNode.dispose();
    };
  }

  unitRates.register( 'ScaleNode', ScaleNode );

  /**
   * Converts a cost to a string, e.g. 10.5 -> '$10.50'
   * @param {number} cost
   * @returns {string}
   */
  var costToString = function( cost ) {
    return StringUtils.format( currencyValueString,
      URUtil.numberToString( cost, 2 /* maxDecimals */, false /* trimZeros */ ) );
  };

  /**
   * Converts a quantity to a string, e.g. 10.5 -> '10.5 lb'
   * @param {number} quantity
   * @param {string} units
   * @returns {string}
   */
  var quantityToString = function( quantity, units ) {
    return StringUtils.format( valueUnitsString,
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
