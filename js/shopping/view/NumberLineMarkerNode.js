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
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
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
  var TEMP_EDIT_BUTTON_CONTENT = new Text( 'E', { font: new PhetFont( 10 ), fontWeight: 'bold', maxWidth: 30 } );

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  /**
   * @param {Item} item
   * @param (function} moveStartCallback - function called when item drag starts
   * @param (function} moveEndCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineMarkerNode( item, position, moveStartCallback, moveEndCallback, options ) {

    options = _.extend( {
      lineHeight: 50,
      stroke: 'black',
      lineWidth: 1.25,
      dragBounds: new Bounds2( 0, 0, 0, 0 )
    }, options || {} );

    var self = this;

    // @public (readwrite)
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
      xMargin: 2,
      yMargin: 2,
      decimalPlaces: 2,
      maxWidth: TEXT_MAX_WIDTH,
      numberFill: 'rgba(0,0,0,1)',
      backgroundFill: 'rgba(255,255,255,0)',
      backgroundStroke: 'rgba(0,0,0,0)',
      pickable: false
    };

    // top label - cost
    numberDisplayOptions.centerY = -options.lineHeight / 2 - TEXT_MARGIN;
    this.topNumberDisplay = new NumberDisplay( this.costProperty, new Range( 0, 10), '', currencySymbolString + '{0}',
      numberDisplayOptions );

    // verticle line
    var markerLine = new Path( new Shape()
      .moveTo( 0, -options.lineHeight / 2 )
      .lineTo( 0,  options.lineHeight / 2 ), {
        centerX: 0,
        centerY: 0,
        stroke: options.stroke,
        lineWidth: options.lineWidth,
         pickable: false
      } );

    // bottom label - count | weight
    numberDisplayOptions.centerY = options.lineHeight / 2 + TEXT_MARGIN;
    numberDisplayOptions.decimalPlaces = 1;
    this.bottomNumberDisplay = new NumberDisplay( this.unitProperty, new Range( 0, 20), '', '{0}',
      numberDisplayOptions );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [  this.topNumberDisplay,  markerLine,  this.bottomNumberDisplay ]; // static UI

    // -- Drag controls -- //
    this.dragHandle = new Node( { pickable: true });

    var dragHandleLine = new Path( new Shape()
      .moveTo( 0, 0 )
      .lineTo( DRAG_HANDLE_OFFSET, 0 ), {
        stroke: 'black',
        lineWidth: 0.5
    } );
    this.dragHandle.addChild( dragHandleLine );

    var dragHandleCircle = new Circle( options.lineHeight * 0.1, {
      centerX: DRAG_HANDLE_OFFSET,
      centerY: 0,
      fill: URConstants.EDIT_CONTROL_COLOR,
      stroke: 'black',
      lineWidth: 0.5,
      pickable: true
    } );
    this.dragHandle.addChild( dragHandleCircle );

    options.dragArea = dragHandleCircle.bounds;

    // Hide/show drag nodes
    item.dragableProperty.link( function( itemState, oldItemState ) {
      self.dragHandle.visible = itemState;
    } );

    // -- Edit controls -- //

    this.editCostButton = new RectangularPushButton( {
      centerX: 0,
      bottom: this.topNumberDisplay.top - TEXT_MARGIN,
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR,
      pickable: true
    } );

    this.editUnitButton = new RectangularPushButton( {
      centerX: 0,
      top: this.bottomNumberDisplay.bottom + TEXT_MARGIN,
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR,
      pickable: true
    } );

    // Hide/show edit nodes
    item.editableProperty.link( function( itemState, oldItemState ) {
      self.editCostButton.visible = ( itemState === ShoppingConstants.EditMode.BOTTOM );
    } );
    item.editableProperty.link( function( itemState, oldItemState ) {
      self.editUnitButton.visible  = ( itemState === ShoppingConstants.EditMode.TOP );
    } );

    options.children = options.children.concat( [ this.editCostButton, this.dragHandle, this.editUnitButton ] );

    ItemNode.call( this, item, position, options );

     // Add drag handlers
    this.addDragListeners( moveStartCallback, moveEndCallback );
  }

  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( ItemNode, NumberLineMarkerNode, {

    /**
     * Called at start of drag
     * @public
     */
    hideDisplayNodes: function( ) {
      // Hide number display & edit buttons
      this.topNumberDisplay.visible     = false;
      this.bottomNumberDisplay.visible  = false;
      this.editCostButton.visible       = false;
      this.editUnitButton.visible       = false;
    },

    /**
     * Called at end of drag
     * @public
     */
    showDisplayNodes: function( ) {

      // Show number display & edit buttons
      this.topNumberDisplay.visible     = true;
      this.bottomNumberDisplay.visible  = true;
      this.editCostButton.visible       = ( this.item.editable === ShoppingConstants.EditMode.BOTTOM );
      this.editUnitButton.visible       = ( this.item.editable === ShoppingConstants.EditMode.TOP );
    },

    // @public
    dispose: function() {
    }

  } ); // inherit

} ); // define

