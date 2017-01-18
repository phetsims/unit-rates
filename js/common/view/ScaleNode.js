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
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // sim modules
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
  var PANEL_OPTIONS = {
    xMargin: 8,
    yMargin: 4,
    cornerRadius: 4,
    resizable: false
  };

  /**
   * @param {Scale} scale
   * @param {Object} [options]
   * @constructor
   */
  function ScaleNode( scale, options ) {

    options = _.extend( {
      valueFont: new URFont( 20 ),
      valueFill: 'black'
    }, options );

    // Body of the scale, origin at center of top surface
    var scaleImageNode = new Image( scaleImage, { scale: 0.5 } );
    scaleImageNode.x = -scaleImageNode.width / 2;
    scaleImageNode.y = -0.1 * scaleImageNode.height; // multiplier is specific to image file

    var valueBoxChildren = [];

    // Cost value, e.g. '$10.50'
    var maxCostString = costToString( 10.5 );
    var costValueNode = new Text( maxCostString, {
      font: options.valueFont,
      fill: options.valueFill
      //TODO maxWidth
    } );

    // Update cost value
    var costObserver = function( cost ) {
      costValueNode.text = costToString( cost );
    };
    scale.costProperty.link( costObserver );

    // panel for displaying cost
    var costPanel = null;
    if ( !scale.costIsHideable ) {

      // cost value is always visible, put it in a panel
      costPanel = new Panel( costValueNode, PANEL_OPTIONS );
    }
    else {

      // build a panel with an expand/collapse button, to show/hide the cost value

      // 'Cost', displayed when collapsed
      var costLabelNode = new Text( costString, {
        font: options.valueFont,
        fill: options.valueFill,
        maxWidth: 1.1 * costValueNode.width
        //TODO maxWidth
      } );

      // dispose required
      var expandCollapseButton = new ExpandCollapseButton( scale.costVisibleProperty, {
        sideLength: 15,
        touchAreaXDilation: 30,
        touchAreaYDilation: 30
      } );

      var costVisibleObserver = function( expanded ) {
        costValueNode.visible = expanded;
        costLabelNode.visible = !expanded;
      };
      scale.costVisibleProperty.link( costVisibleObserver ); // unlink in dispose

      var valueParent = new Node( {
        children: [ costValueNode, costLabelNode ]
      } );

      var hBox = new HBox( {
        align: 'center',
        children: [ expandCollapseButton, valueParent ],
        spacing: 10
      } );

      costPanel = new Panel( hBox, PANEL_OPTIONS );
    }
    valueBoxChildren.push( costPanel );

    // panel for displaying quantity
    if ( scale.quantityIsDisplayed ) {

      // e.g. '10.5 lbs'
      var maxQuantityString = quantityToString( 10.5, scale.quantityUnits );
      var quantityValueNode = new Text( maxQuantityString, {
        font: options.valueFont,
        fill: options.valueFill
        //TODO maxWidth
      } );

      var quantityPanel = new Panel( quantityValueNode, PANEL_OPTIONS );

      valueBoxChildren.push( quantityPanel );

      // Update quantity value
      var quantityObserver = function( quantity ) {
        quantityValueNode.text = quantityToString( quantity, scale.quantityUnits );
      };
      scale.quantityProperty.link( quantityObserver );
    }

    var valueBox = new HBox( {
      children: valueBoxChildren,
      align: 'center',
      spacing: 15,
      resize: false,

      // These coordinates are dependent on the image file, and were determined empirically
      centerX: scaleImageNode.centerX,
      bottom: scaleImageNode.bottom - 17
    } );

    // This type does not propagate options to the supertype because the model determines location.
    Node.call( this, {
      children: [ scaleImageNode, valueBox ]
    } );

    // red dot at origin, red line where items will be placed
    if ( phet.chipper.queryParameters.dev ) {
      this.addChild( new Circle( 2, { fill: 'red' } ) );
      this.addChild( new Line( -scale.width / 2, 0, scale.width/2, 0, { stroke: 'red' } ) );
    }

    this.center = scale.location;

    // @private
    this.disposeScaleNode = function() {
      scale.costProperty.unlink( costObserver );
      costVisibleObserver && scale.costVisibleProperty.unlink( costVisibleObserver );
      quantityObserver && scale.quantityProperty.unlink( quantityObserver );
      expandCollapseButton && expandCollapseButton.dispose();
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
      URUtil.numberToString( quantity, 1 /* maxDecimals */, false /* trimZeros */  ), units );
  };

  return inherit( Node, ScaleNode, {

    // @public
    dispose: function() {
      Node.prototype.dispose && Node.prototype.dispose.call( this );
      this.disposeScaleNode();
    }
  } );
} );
