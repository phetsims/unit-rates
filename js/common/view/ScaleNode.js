// Copyright 2017, University of Colorado Boulder

/**
 * View of the scale.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
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

    var scaleImageNode = new Image( scaleImage );

    var valueBoxChildren = [];

    // e.g. '$10.50'
    var maxCostString = StringUtils.format( currencyValueString, URUtil.numberToString( 10.5, 2, false ) );
    var costValueNode = new Text( maxCostString, {
      font: options.valueFont,
      fill: options.valueFill
      //TODO maxWidth
    } );

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

      var expandedProperty = new Property( true ); //TODO reset?
      expandedProperty.link( function( expanded ) {
        costValueNode.visible = expanded;
        costLabelNode.visible = !expanded;
      } );

      var expandCollapseButton = new ExpandCollapseButton( expandedProperty, {
        sideLength: 15,
        touchAreaXDilation: 30,
        touchAreaYDilation: 30
      } );

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
      var maxQuantityString = StringUtils.format( valueUnitsString, URUtil.numberToString( 10.5, 1, false ), scale.quantityUnits );
      var quantityValueNode = new Text( maxQuantityString, {
        font: options.valueFont,
        fill: options.valueFill
        //TODO maxWidth
      } );

      var quantityPanel = new Panel( quantityValueNode, PANEL_OPTIONS );

      valueBoxChildren.push( quantityPanel );
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

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [ scaleImageNode, valueBox ];

    Node.call( this, options );
  }

  unitRates.register( 'ScaleNode', ScaleNode );

  return inherit( Node, ScaleNode );
} );
