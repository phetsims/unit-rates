// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var ItemNode = require( 'UNIT_RATES/shopping/view/ItemNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Bounds2 = require( 'DOT/Bounds2' );

  //var Emitter = require( 'AXON/Emitter' );

  // constants
  var TEXT_FONT = new PhetFont( 10 );
  var TEXT_MAX_WIDTH = 75;
  var TEXT_MARGIN = 8;
  var DRAG_HANDLE_OFFSET = 10;
  var TEMP_EDIT_BUTTON_CONTENT = new Text( 'e', { font: new PhetFont( 10 ), fontWeight: 'bold', maxWidth: 30 } );

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  /**
   * @param {Item} item
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineMarkerNode( item, position, movedCallback, options ) {

    options = _.extend( {
      lineHeight: 50,
      stroke: 'black',
      lineWidth: 1.25,
      movable: true,
      movementBounds: new Bounds2( 0, 0, 0, 0 ),
      editable: true
    }, options || {} );

    this.item = item;

    var isTypeCandy = ( item.type === ItemData.RED_CANDY.type   || item.type === ItemData.YELLOW_CANDY.type ||
                        item.type === ItemData.GREEN_CANDY.type || item.type === ItemData.BLUE_CANDY.type );
    // properties
    this.costProperty = new Property( ( item.count * item.rate ) );
    this.unitProperty = new Property( ( item.count * ( isTypeCandy ? item.weight : 1 ) ) );

    // Static representation
    var numberDisplayOptions = {
      centerX: - TEXT_MARGIN / 2,
      centerY: -options.lineHeight / 2 - TEXT_MARGIN,
      font: TEXT_FONT,
      decimalPlaces: 2,
      maxWidth: TEXT_MAX_WIDTH,
      backgroundFill: 'rgba(255,255,255,0)',
      backgroundStroke: 'rgba(0,0,0,0)'
    };

    // top label - cost
    numberDisplayOptions.centerY = -options.lineHeight / 2 - TEXT_MARGIN;
    var topNumberDisplay = new NumberDisplay( this.costProperty, new Range( 0, 10), '', currencySymbolString + '{0}',
      numberDisplayOptions );

    // verticle line
    var markerLine = new Path( new Shape()
      .moveTo( 0, -options.lineHeight / 2 )
      .lineTo( 0,  options.lineHeight / 2 ), {
        centerX: 0,
        centerY: 0,
        stroke: options.stroke,
        lineWidth: options.lineWidth
      } );

    // bottom label - count | weight
    numberDisplayOptions.centerY = options.lineHeight / 2 + TEXT_MARGIN;
    numberDisplayOptions.decimalPlaces = 1;
    var bottomNumberDisplay = new NumberDisplay( this.costProperty, new Range( 0, 20), '', '{0}',
      numberDisplayOptions );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [  topNumberDisplay,  markerLine,  bottomNumberDisplay ]; // static UI

    // Edit controls
    if ( options.editable ) {

      var editCostButton = new RectangularPushButton( {
        centerX: 0,
        bottom: topNumberDisplay.top - TEXT_MARGIN,
        content:TEMP_EDIT_BUTTON_CONTENT,
        baseColor: URConstants.EDIT_CONTROL_COLOR
      } );

      var dragHandle = new Node( { pickable: true });

      var dragHandleLine = new Path( new Shape()
        .moveTo( 0, 0 )
        .lineTo( DRAG_HANDLE_OFFSET, 0 ), {
          stroke: 'black',
          lineWidth: 0.5
      } );
      dragHandle.addChild( dragHandleLine );

      var dragHandleCircle = new Circle( options.lineHeight * 0.1, {
        centerX: DRAG_HANDLE_OFFSET,
        centerY: 0,
        fill: URConstants.EDIT_CONTROL_COLOR,
        stroke: 'black',
        lineWidth: 0.5,
        pickable: true
      } );
      dragHandle.addChild( dragHandleCircle );

      var editUnitButton = new RectangularPushButton( {
        centerX: 0,
        top: bottomNumberDisplay.bottom + TEXT_MARGIN,
        content:TEMP_EDIT_BUTTON_CONTENT,
        baseColor: URConstants.EDIT_CONTROL_COLOR
      } );

      options.children = options.children.concat( [ editCostButton, dragHandle, editUnitButton ] ); // edit UI
    }

    ItemNode.call( this, item, position, movedCallback, options );
  }

  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( Node, NumberLineMarkerNode, {


  } ); // inherit

} ); // define

