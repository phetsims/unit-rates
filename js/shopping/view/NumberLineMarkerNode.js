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
  var TEXT_FONT                 = new PhetFont( 10 );
  var TEXT_MAX_WIDTH            = 75;
  var TEXT_MARGIN               = 12;
  var DRAG_HANDLE_OFFSET        = 10;
  var EDIT_TEXT_DEFAULT_COLOR   = 'rgba(0,0,0,1)';
  var EDIT_TEXT_INCORRECT_COLOR = 'rgba(255,0,0,1)';
  var EDIT_TEXT_DEFAULT_STROKE  = 'rgba(0,0,0,0)';
  var EDIT_TEXT_ACTIVE_STROKE   = 'rgba(0,0,0,1)';
  var EDIT_BUTTON_MARGIN        = 2;
  var TEMP_EDIT_BUTTON_CONTENT  = new Text( 'E', { font: new PhetFont( 10 ), fontWeight: 'bold', maxWidth: 30 } );

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  /**
   * @param {Item} item
   * @param {Vector2} position - x,y position on teh number line
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

    var isTypeCandy = ( item.type === ItemData.RED_CANDY.type   || item.type === ItemData.YELLOW_CANDY.type ||
                        item.type === ItemData.GREEN_CANDY.type || item.type === ItemData.BLUE_CANDY.type );
    this.correctCost = ( item.count * item.rate );
    this.correctUnit = ( item.count * ( isTypeCandy ? item.weight : 1 ) );

    // properties
    this.costProperty = new Property( ( item.count * item.rate ) );
    this.unitProperty = new Property( ( item.count * ( isTypeCandy ? item.weight : 1 ) ) );

    // Static representation
    var numberDisplayOptions = {
      centerX: -2,
      centerY: -options.lineHeight / 2 - TEXT_MARGIN,
      font: TEXT_FONT,
      xMargin: 5,
      yMargin: 2,
      decimalPlaces: 2,
      maxWidth: TEXT_MAX_WIDTH,
      numberFill: EDIT_TEXT_DEFAULT_COLOR,
      backgroundStroke: EDIT_TEXT_DEFAULT_STROKE,
      pickable: false
    };

    // top label - cost
    numberDisplayOptions.centerY = -options.lineHeight / 2 - TEXT_MARGIN;
    this.topNumberDisplay = new NumberDisplay( this.costProperty, new Range( 0, 10), '', currencySymbolString + '{0}',
      numberDisplayOptions );

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
    numberDisplayOptions.centerY = options.lineHeight / 2 + TEXT_MARGIN;
    numberDisplayOptions.decimalPlaces = 1;
    this.bottomNumberDisplay = new NumberDisplay( this.unitProperty, new Range( 0, 20), '', '{0}',
      numberDisplayOptions );

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
    } );

    // -- Edit controls -- //

    this.editCostButton = new RectangularPushButton( {
      centerX: 0,
      bottom: this.topNumberDisplay.top - EDIT_BUTTON_MARGIN,
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR,
      pickable: true,
      visible: false,
      listener: function() {
        self.keypad.clear()
        self.keypad.visible = true;
        self.keypad.digitStringProperty.unlinkAll();
        self.keypad.digitStringProperty.link( function( value, oldValue ) {
          self.updateEditState();
          console.log(value);
        } );
      }
    } );

    this.editUnitButton = new RectangularPushButton( {
      centerX: 0,
      top: this.bottomNumberDisplay.bottom + EDIT_BUTTON_MARGIN,
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR,
      pickable: true,
      visible: false,
      listener: function() {
        self.keypad.clear()
        self.keypad.visible = true;
        self.keypad.digitStringProperty.unlinkAll();
        self.keypad.digitStringProperty.link( function( value, oldValue ) {
          self.updateEditState();
          console.log(value);
        } );
      }
    } );

    // hide/show edit nodes, change color, etc.
    item.editableProperty.link( function( state, oldState ) {
      self.updateEditState();
    } );

    // add all child nodes
    options.children = [ this.topNumberDisplay,  markerLine,  this.bottomNumberDisplay,
                         this.editCostButton, this.dragHandle, this.editUnitButton ];

    ItemNode.call( this, item, position, options );

     // add drag handlers
    this.addDragListeners( moveStartCallback, moveEndCallback );
  }

  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( ItemNode, NumberLineMarkerNode, {

    /**
     * Called at start of drag
     * @public
     */
    hideDragNodes: function( ) {
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
    showDragNodes: function( ) {
      // Show number display & edit buttons
      this.topNumberDisplay.visible     = true;
      this.bottomNumberDisplay.visible  = true;
      this.editCostButton.visible       = ( this.item.editable === ShoppingConstants.EditMode.COST );
      this.editUnitButton.visible       = ( this.item.editable === ShoppingConstants.EditMode.UNIT );
    },

    /**
     *
     * @public
     */
    updateEditState: function( ) {

      if( this.item.editable === ShoppingConstants.EditMode.NONE ) {
        return;
      }

      // Check for correct answers
      var costCorrect = true;
      if( this.item.editable === ShoppingConstants.EditMode.COST ) {
        costCorrect = Number( this.keypad.digitStringProperty.value ) === Number( this.costProperty.value );
        if( costCorrect ) {
        // set normal display attributes
        this.editCostButton.visible = false;
        this.topNumberDisplay.setNumberFill( EDIT_TEXT_DEFAULT_COLOR );
        this.topNumberDisplay.setBackgroundStroke( EDIT_TEXT_DEFAULT_STROKE );
        }
        else {
          // set 'incorrect' display attributes
          this.editCostButton.visible = true;
          this.topNumberDisplay.setNumberFill( EDIT_TEXT_INCORRECT_COLOR );
          this.topNumberDisplay.setBackgroundStroke( EDIT_TEXT_ACTIVE_STROKE );
        }
      }

      var unitCorrect = true;
      if( this.item.editable === ShoppingConstants.EditMode.UNIT ) {
        unitCorrect = Number( this.keypad.digitStringProperty.value ) === Number( this.unitProperty.value );
        if( unitCorrect ) {
          // set normal display attributes
          this.editUnitButton.visible = false;
          this.bottomNumberDisplay.setNumberFill( EDIT_TEXT_DEFAULT_COLOR );
          this.bottomNumberDisplay.setBackgroundStroke( EDIT_TEXT_DEFAULT_STROKE );
        }
        else {
          // set 'incorrect' display attributes
          this.editUnitButton.visible = true;
          this.bottomNumberDisplay.setNumberFill( EDIT_TEXT_INCORRECT_COLOR );
          this.bottomNumberDisplay.setBackgroundStroke( EDIT_TEXT_ACTIVE_STROKE );
        }
      }

      // if all is correct, clear the various edit attributes
      if( costCorrect && unitCorrect ) {
        this.item.dragableProperty.value = false;
        this.item.dragableProperty.unlinkAll();

        this.keypad.visible = false;
        this.keypad.digitStringProperty.unlinkAll();
        this.keypad.digitStringProperty.reset();

        this.item.editable = ShoppingConstants.EditMode.NONE;
      }
    },

    // @public
    dispose: function() {
    }

  } ); // inherit

} ); // define

