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
  var AnswerNumberDisplayNode = require( 'UNIT_RATES/common/view/AnswerNumberDisplayNode' );
  var ItemNode = require( 'UNIT_RATES/shopping/view/ItemNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Shape = require( 'KITE/Shape' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // constants
  var DRAG_HANDLE_OFFSET        = 10;
  var EDIT_TEXT_MARGIN          = 5;

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  /**
   * @param {Item} item
   * @param {Vector2} position - x,y position on the number line
   * @param (function} moveStartCallback - function called when item drag starts
   * @param (function} moveEndCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineMarkerNode( item, position, keypad, moveStartCallback, moveEndCallback,
    options ) {

    options = _.extend( {
      lineHeight: 50,
      stroke: 'black',
      lineWidth: 1.25,
      dragBounds: new Bounds2( 0, 0, 0, 0 )
    }, options || {} );

    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    // @public (readwrite)
    this.item = item;
    this.keypad = keypad;

    this.correctCost = ( item.count * item.rate );
    this.correctUnit = ( item.count * ( item.isCandy ? item.weight : 1 ) );
    var initialCost = ( this.item.editable === ShoppingConstants.EditMode.COST ? 0 : this.correctCost );
    var initialUnit = ( this.item.editable === ShoppingConstants.EditMode.UNIT ? 0 : this.correctUnit );

    // @private
    this.costProperty = new Property( initialCost );
    this.unitProperty = new Property( initialUnit );

    this.costProperty.link( this.updateEditState.bind( this ) );
    this.unitProperty.link( this.updateEditState.bind( this ) );

    // top label - cost
    var topPattern =  currencySymbolString + '{0}';
    this.topNumberDisplay = new AnswerNumberDisplayNode( keypad, this.costProperty, this.correctCost, topPattern, {
        centerX: -2,
        bottom: -options.lineHeight / 2 - EDIT_TEXT_MARGIN,
        decimalPlaces: 2,
        buttonPosition: 'top',
        buttonSpacing: EDIT_TEXT_MARGIN
    } );

    // vertical line
    var markerLine = new Path( new Shape()
      .moveTo( 0, -options.lineHeight / 2 )
      .lineTo( 0,  options.lineHeight / 2 ), {
        centerX: 0,
        centerY: 0,
        stroke: options.stroke,
        lineWidth: options.lineWidth,
        pickable: false
      } );

    // bottom label - unit
    var bottomPattern =  '{0}';
    this.bottomNumberDisplay = new AnswerNumberDisplayNode( keypad, this.unitProperty, this.correctUnit, bottomPattern, {
        centerX: -2,
        top: options.lineHeight / 2 + EDIT_TEXT_MARGIN,
        decimalPlaces: 1,
        buttonPosition: 'bottom',
        buttonSpacing: EDIT_TEXT_MARGIN
    } );

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

    // hide/show drag nodes
    item.dragableProperty.link( function( state, oldState ) {
      self.dragHandle.visible = state;
      if( !state ) {
        self.item.dragableProperty.unlinkAll();
      }
    } );

    // hide/show edit buttons, change text/border color, etc.
    item.editableProperty.link( function( state, oldState ) {
      //self.updateEditState();
    } );

    // add all child nodes
    options.children = [ this.topNumberDisplay,  markerLine,  this.bottomNumberDisplay, this.dragHandle ];

    ItemNode.call( this, item, position, options );

     // add drag handlers
    this.addDragListeners( moveStartCallback, moveEndCallback );
  }

  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( ItemNode, NumberLineMarkerNode, {

    /**
     * Simplify representation (when dragging)
     * @public
     */
    hideDragNodes: function( ) {
      // Hide number display & edit buttons
      this.topNumberDisplay.visible     = false;
      this.bottomNumberDisplay.visible  = false;
    },

    /**
     * Restore node children (when not dragging)
     * @public
     */
    showDragNodes: function( ) {
      // Show number display & edit buttons
      this.topNumberDisplay.visible     = true;
      this.bottomNumberDisplay.visible  = true;
    },

    /**
     *
     * @public
     */
    updateEditState: function() {
      if( this.costProperty.value === this.correctCost && this.unitProperty.value === this.correctUnit ) {
        // make item undraggable
        this.item.dragableProperty.value = false;

        // make the item uneditable
        this.item.editable = ShoppingConstants.EditMode.NONE;
      }
    },

    // @public
    dispose: function() {
    }

  } ); // inherit

} ); // define

