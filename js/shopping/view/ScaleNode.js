// Copyright 2017, University of Colorado Boulder

/**
 * View of the scale.
 * Origin is at the center of the top surface.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CollapsibleValueNode = require( 'UNIT_RATES/common/view/CollapsibleValueNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
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
  // values longer than these will be displayed properly, but the display will be scaled to fit
  var MAX_COST = 100.5;
  var MAX_QUANTITY = 10.5;

  /**
   * @param {Scale} scale
   * @param {Property.<boolean>} costExpandedProperty - is the cost display expanded?
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( scale, costExpandedProperty, options ) {

    options = _.extend( {
      costIsCollapsible: false,
      quantityIsDisplayed: false
    }, options );

    // Body of the scale, origin at center of top surface
    var scaleImageNode = new Image( scaleImage, { scale: 0.5 } );
    scaleImageNode.x = -scaleImageNode.width / 2;
    scaleImageNode.y = -0.1 * scaleImageNode.height; // multiplier is specific to image file

    // Nodes that make up the numeric display on the scale
    var displayChildren = [];

    // Cost display
    var costNode = null;
    var COST_DISPLAY_OPTIONS = {
      valueMaxString: costToString( MAX_COST ),
      valueToString: function( value ) {
        return costToString( value );
      }
    };
    if ( options.costIsCollapsible ) {

      // dispose required
      costNode = new CollapsibleValueNode( scale.costProperty, costExpandedProperty, costString, COST_DISPLAY_OPTIONS );
    }
    else {

      // dispose required
      costNode = new ValueNode( scale.costProperty, COST_DISPLAY_OPTIONS );
    }
    displayChildren.push( costNode );

    // Quantity display
    var quantityNode = null;
    if ( options.quantityIsDisplayed ) {

      // dispose required
      quantityNode = new ValueNode( scale.quantityProperty, {
        valueMaxString: quantityToString( MAX_QUANTITY, scale.quantityUnits ),
        valueToString: function( value ) {
          return quantityToString( value, scale.quantityUnits );
        }
      } );
      displayChildren.push( quantityNode );
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
