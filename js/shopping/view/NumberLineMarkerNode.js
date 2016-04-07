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
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  //var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Shape = require( 'KITE/Shape' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

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
  function NumberLineMarkerNode( item, options ) {

    options = _.extend( {
      lineHeight: 50,
      stroke: 'black',
      lineWidth: 1.25
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
      .lineTo( 0,  options.lineHeight / 2 ), options );

    // bottom label - count | weight
    numberDisplayOptions.centerY = options.lineHeight / 2 + TEXT_MARGIN;
    numberDisplayOptions.decimalPlaces = 1;
    var bottomNumberDisplay = new NumberDisplay( this.costProperty, new Range( 0, 20), '', '{0}',
      numberDisplayOptions );

    // Edit controls

    // @protected - top button
    var editCostButton = new RectangularPushButton( {
      centerX: 0,
      bottom: topNumberDisplay.top - TEXT_MARGIN,
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR
    } );

    // @protected drag handle
    var dragHandle = new Node();

    var dragHandleLine = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( DRAG_HANDLE_OFFSET, 0 ), {
        stroke: 'black',
        lineWidth: 0.5
    } );
    dragHandle.addChild( dragHandleLine );

    var dragHandleCircle = new Circle( options.lineHeight * .1, {
      centerX: DRAG_HANDLE_OFFSET,
      centerY: 0,
      fill: URConstants.EDIT_CONTROL_COLOR,
      stroke: 'black',
      lineWidth: 0.5
    } );
    dragHandle.addChild( dragHandleCircle );

    // @protected - bottom button
    var editUnitButton = new RectangularPushButton( {
      centerX: 0,
      top: bottomNumberDisplay.bottom + TEXT_MARGIN,
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [  topNumberDisplay,  markerLine,  bottomNumberDisplay, // static UI
    editCostButton, dragHandle, editUnitButton ]; // edit UI

    Node.call( this, options );
  }

  /**
   *
   * @param {Property} property
   * @param {Object} [options]
   * @returns {Panel}
   * @private
   */
  /*
function ValueDisplayNode( property, options ) {

    options = options || {};

    options = _.extend( {
      minWidth: DISPLAY_SIZE.width,
      minHeight: DISPLAY_SIZE.height,
      preText: '',
      decimalPlaces: 1,
      postText: '',
      resize: false,
      cornerRadius: 5,
      lineWidth: 0,
      align: 'center'
    }, options );

    // @private
    var valueText = new Text( '-', {
      font: DISPLAY_FONT,
      maxWidth: 0.9 * DISPLAY_SIZE.width,
      maxHeight: 0.9 * DISPLAY_SIZE.height
    } );

    // update value text
    property.link( function( value, oldValue ) {
      var fixedValue = Util.toFixed( value, options.decimalPlaces );
      valueText.setText( options.preText + ' ' + fixedValue.toString() + ' ' + options.postText );
    } );

    return new Panel( valueText, options);
  }
*/
  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( Node, NumberLineMarkerNode, {


  } ); // inherit

} ); // define

