// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var TrackGroupNode = require( 'UNIT_RATES/racingLab/view/TrackGroupNode' );
  var KeypadPanelNode = require( 'UNIT_RATES/common/view/KeypadPanelNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var oneCarSceneImage = require( 'image!UNIT_RATES/one_car_scene.png' );
  var twoCarSceneImage = require( 'image!UNIT_RATES/two_car_scene.png' );
  var blueCarImage = require( 'image!UNIT_RATES/blue_car.png' );
  var redCarImage = require( 'image!UNIT_RATES/red_car.png' );
  var returnCarButtonImage = require( 'image!UNIT_RATES/return_car_button.png' );
  var goButtonImage = require( 'image!UNIT_RATES/go_button.png' );
  var stopButtonImage = require( 'image!UNIT_RATES/stop_button.png' );

  // strings
  var doubleNumberLine1String = require( 'string!UNIT_RATES/doubleNumberLine1' );
  var doubleNumberLine2String = require( 'string!UNIT_RATES/doubleNumberLine2' );
  var rate1String = require( 'string!UNIT_RATES/rate1' );
  var rate2String = require( 'string!UNIT_RATES/rate2' );
  var timer1String = require( 'string!UNIT_RATES/timer1' );
  var timer2String = require( 'string!UNIT_RATES/timer2' );

  /**
   * @param {RacingLabModel} model
   * @constructor
   */
  function RacingLabScreenView( model ) {

    ScreenView.call( this );

    var self = this;

    this.model = model;

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new KeypadPanelNode( {
      maxDigits: 4,
      visible: false
    } );
    this.addChild( this.keypad );
    this.keypad.hide();

    this.trackGroup1Node = new TrackGroupNode( model.trackGroup1, blueCarImage, this.keypad, {
      left:             URConstants.SCREEN_PANEL_SPACING,
      top:              URConstants.SCREEN_VERTICAL_MARGIN,
      numberLineTitle:  doubleNumberLine1String,
      rateTitle:        rate1String,
      rateColor:        'rgb(29,174,235)',
      ratePressedColor: 'rgb(9,154,215)',
      timerTitle:       timer1String
    } );
    this.addChild( this.trackGroup1Node );

    this.trackGroup2Node = new TrackGroupNode( model.trackGroup2, redCarImage, this.keypad, {
        left:             URConstants.SCREEN_PANEL_SPACING,
        top:              this.trackGroup1Node.bottom + 5,
        trackOnTop:       true,
        numberLineTitle:  doubleNumberLine2String,
        rateTitle:        rate2String,
        rateColor:        'rgb(233,33,45)',
        ratePressedColor: 'rgb(213,13,25)',
        timerTitle:       timer2String
    } );
    this.addChild( this.trackGroup2Node );

    // play/pause button
    this.goStopButton = new BooleanRoundToggleButton(
      new Image( stopButtonImage, { scale: 0.25 } ),
      new Image( goButtonImage, { scale: 0.25 } ), model.runningProperty, {
      right: this.layoutBounds.right    - URConstants.SCREEN_HORIZONTAL_MARGIN,
      centerY: this.trackGroup2Node.top - URConstants.SCREEN_PANEL_SPACING / 2,
      radius: 45
    } );
    this.addChild( this.goStopButton );

    var restartButton = new RectangularPushButton( {
      right: this.goStopButton.left - URConstants.SCREEN_PANEL_SPACING,
      centerY: this.goStopButton.centerY,
      content: new Image( returnCarButtonImage, { scale: 0.18 } ),
      minWidth: 45,
      minHeight: 45,
      cornerRadius: 4,
      baseColor: '#A9D8FD',
      xMargin: 8, // should be visibly greater than yMargin, see issue #109
      yMargin: 5,
      touchAreaXDilation: 0,
      touchAreaYDilation: 0,
      stroke: 'black',
      lineWidth: 0.5,
      listener: function() {
        self.restart();
      }
    });
    this.addChild( restartButton );

    // keypad layout
    this.keypad.right = this.trackGroup1Node.right - 30;
    this.keypad.top   = this.trackGroup1Node.bottom + 2 * URConstants.SCREEN_PANEL_SPACING;

    // @protected - covers entire screen, uses pick to close keypad
    this.keypadCloseArea = new Rectangle( 0, 0, window.innerWidth, window.innerHeight, { visible: false } );
    this.addChild( this.keypadCloseArea );

    this.keypad.visibleProperty.link( function( value, oldValue ) {
      self.keypadCloseArea.visible = value;
    } );

    // Click on pickCloseArea to close keypad
    this.keypadCloseArea.addInputListener( {
      down: function( event ) {
        self.keypad.hide();
        self.keypad.clear();
        self.keypad.clearListeners();
      }
    } );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        self.resetAll();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    this.carCountButtons = new RadioButtonGroup( this.model.carCountProperty, [
      { value: 1, node: new Image( oneCarSceneImage, { scale: 0.22 } ) },
      { value: 2, node: new Image( twoCarSceneImage, { scale: 0.22 } ) }
    ], {
      right:  this.layoutBounds.right - URConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: resetAllButton.top - URConstants.SCREEN_VERTICAL_MARGIN,
      orientation:  'vertical',
      baseColor:    'white',
      spacing:       11
    } );
    this.addChild( this.carCountButtons );

    this.model.carCountProperty.link( function( value, oldValue ) {
      self.trackGroup2Node.visible = ( value === 2 );
    } );

    this.model.runningProperty.link( function( value, oldValue ) {
      self.goStopButton.baseColor = ( value ? '#6D6E70' :  '#85d4a6' );
      //self.carCountButtons.opacity = ( value ? 0.5 : 1.0 );   // FIXME: what to disable when running
      //self.carCountButtons.pickable = !value;
    } );
  }

  unitRates.register( 'RacingLabScreenView', RacingLabScreenView );

  return inherit( ScreenView, RacingLabScreenView, {

    /**
     * @protected
     */
    hideKeypad: function() {
      this.keypad.hide();
      this.keypad.clear();
      this.keypad.clearListeners();
    },

    /**
     * Called when the user selects the sim reset button
     * @protected
     */
    restart: function() {
      this.model.restart();
    },

    /**
     * Called when the user selects the sim reset button
     * @protected
     */
    resetAll: function() {
        this.model.reset();
        this.trackGroup1Node.reset();
        this.trackGroup2Node.reset();
        this.hideKeypad();
    },

    /**
     * @protected
     */
    onResize: function() {
      // resize the pick area to match the screen
      this.keypadCloseArea.setRectBounds( new Bounds2( 0, 0,  window.innerWidth, window.innerHeight ) );
    }

  } ); // inherit

} ); // define
