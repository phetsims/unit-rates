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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var URUtil = require( 'UNIT_RATES/common/URUtil' );

  // images
  var scaleImage = require( 'image!UNIT_RATES/scale.png' );

  // strings
  var costString = require( 'string!UNIT_RATES/cost' );
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  // constants
  var DISPLAY_X_MARGIN = 8;
  var DISPLAY_Y_MARGIN = 4;
  var DISPLAY_X_SPACING = 15; // horizontal space between cost and quantity displays
  var DISPLAY_RECTANGLE_OPTIONS = {
    cornerRadius: 4,
    fill: 'white',
    stroke: 'black'
  };

  /**
   * @param {Scale} scale
   * @param {Property.<boolean>} costExpandedProperty - is the cost display expanded?
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( scale, costExpandedProperty, options ) {

    options = _.extend( {
      costIsCollapsible: false,
      quantityIsDisplayed: false,
      valueFont: new URFont( 20 ),
      valueFill: 'black'
    }, options );

    // Body of the scale, origin at center of top surface
    var scaleImageNode = new Image( scaleImage, { scale: 0.5 } );
    scaleImageNode.x = -scaleImageNode.width / 2;
    scaleImageNode.y = -0.1 * scaleImageNode.height; // multiplier is specific to image file

    // Numeric display(s) on the scale
    var displayNode = null;

    // Cost display -----------------------------------------------

    // Cost value, e.g. '$100.50'
    var maxCostString = costToString( 100.5 );

    var costDisplayNode = null;
    if ( options.costIsCollapsible ) {

      // dispose required
      costDisplayNode = new CollapsibleValueNode( scale.costProperty, costExpandedProperty, {
        titleString: costString,
        titleFont: options.valueFont,
        valueFont: options.valueFont,
        valueMaxWidth: 100,
        valueMaxString: maxCostString,
        valueToString: function( value ) {
          return costToString( value );
        },
        xMargin: DISPLAY_X_MARGIN,
        yMargin: DISPLAY_Y_MARGIN
      } );
    }
    else {
      var costValueNode = new Text( maxCostString, {
        font: options.valueFont,
        fill: options.valueFill,
        maxWidth: 100 // i18n, determined empirically
      } );

      // background rectangle
      var costRectangleWidth = costValueNode.width + ( 2 * DISPLAY_X_MARGIN );
      var costRectangleHeight = costValueNode.height + ( 2 * DISPLAY_Y_MARGIN );
      var costRectangle = new Rectangle( 0, 0, costRectangleWidth, costRectangleHeight, DISPLAY_RECTANGLE_OPTIONS );

      costDisplayNode = new Node( {
        children: [ costRectangle, costValueNode ]
      } );

      var costObserver = function( cost ) {
        costValueNode.text = costToString( cost );
        costValueNode.right = costRectangle.right - DISPLAY_X_MARGIN;
        costValueNode.centerY = costRectangle.centerY;
      };
      scale.costProperty.link( costObserver ); // unlink in dispose
    }

    // Quantity display -----------------------------------------------

    if ( !options.quantityIsDisplayed ) {
      displayNode = costDisplayNode;
    }
    else {

      // e.g. '10.5 lbs'
      var maxQuantityString = quantityToString( 10.5, scale.quantityUnits );
      var quantityValueNode = new Text( maxQuantityString, {
        font: options.valueFont,
        fill: options.valueFill,
        maxWidth: 100 // i18n, determined empirically
      } );

      // rectangle behind the number
      var quantityDisplayWidth = quantityValueNode.width + ( 2 * DISPLAY_X_MARGIN );
      var quantityDisplayHeight = quantityValueNode.height + ( 2 * DISPLAY_Y_MARGIN );
      var quantityRectangle = new Rectangle( 0, 0, quantityDisplayWidth, quantityDisplayHeight, DISPLAY_RECTANGLE_OPTIONS );

      var quantityDisplayNode = new Node( {
        children: [ quantityRectangle, quantityValueNode ]
      } );

      // Update quantity value
      var quantityObserver = function( quantity ) {
        quantityValueNode.text = quantityToString( quantity, scale.quantityUnits );
        quantityValueNode.right = quantityRectangle.right - DISPLAY_X_MARGIN;
        quantityValueNode.centerY = quantityRectangle.centerY;
      };
      scale.quantityProperty.link( quantityObserver );

      displayNode = new HBox( {
        children: [ costDisplayNode, quantityDisplayNode ],
        align: 'center',
        spacing: DISPLAY_X_SPACING
      } );
    }

    // This type does not propagate options to the supertype because the model determines location.
    Node.call( this, {
      children: [ scaleImageNode, displayNode ]
    } );

    // Position the display on the scale.
    // These coordinates are dependent on the image file, and were determined empirically
    displayNode.centerX = scaleImageNode.centerX;
    displayNode.centerY = scaleImageNode.bottom - 32;

    // red dot at origin, red line where items will be placed
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
      this.addChild( new Line( -scale.width / 2, 0, scale.width / 2, 0, { stroke: 'red' } ) );
    }

    // move to model location
    this.translation = scale.location;

    // @private
    this.disposeScaleNode = function() {
      costObserver && scale.costProperty.unlink( costObserver );
      quantityObserver && scale.quantityProperty.unlink( quantityObserver );
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
