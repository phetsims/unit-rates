// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Racing Lab' screen
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanRoundToggleButton = require( 'SUN/buttons/BooleanRoundToggleButton' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // sim modules
  var OLDKeypadPanelNode = require( 'UNIT_RATES/old/common/view/OLDKeypadPanelNode' );
  var OLDRacingLabSceneControl = require( 'UNIT_RATES/old/racingLab/view/OLDRacingLabSceneControl' );
  var OLDTrackGroupNode = require( 'UNIT_RATES/old/racingLab/view/OLDTrackGroupNode' );
  var OLDURConstants = require( 'UNIT_RATES/old/common/OLDURConstants' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // images
  var blueCarImage = require( 'image!UNIT_RATES/blue_car.png' );
  var redCarImage = require( 'image!UNIT_RATES/red_car.png' );
  var returnCarButtonImage = require( 'image!UNIT_RATES/return_car_button.png' );
  var goButtonIconImage = require( 'image!UNIT_RATES/go_button_icon.png' );
  var stopButtonImage = require( 'image!UNIT_RATES/stop_button.png' );

  // strings
  var doubleNumberLine1String = require( 'string!UNIT_RATES/doubleNumberLine1' );
  var doubleNumberLine2String = require( 'string!UNIT_RATES/doubleNumberLine2' );
  var rate1String = require( 'string!UNIT_RATES/rate1' );
  var rate2String = require( 'string!UNIT_RATES/rate2' );
  var timer1String = require( 'string!UNIT_RATES/timer1' );
  var timer2String = require( 'string!UNIT_RATES/timer2' );

  /**
   * @param {OLDRacingLabModel} model
   * @constructor
   */
  function OLDRacingLabScreenView( model ) {

    ScreenView.call( this );

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.model = model;

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new OLDKeypadPanelNode( {
      visible: true
    } );
    this.addChild( this.keypad );
    this.keypad.hide();

    // top track
    this.trackGroup1Node = new OLDTrackGroupNode( model.trackGroup1, redCarImage, this.keypad, {
      left: OLDURConstants.PANEL_SPACING,
      top: OLDURConstants.SCREEN_VERTICAL_MARGIN,
      numberLineTitle: doubleNumberLine1String,
      rateTitle: rate1String,
      rateColor: 'rgb(233,33,45)',
      ratePressedColor: 'rgb(213,13,25)',
      timerTitle: timer1String
    } );
    this.addChild( this.trackGroup1Node );

    // bottom track
    this.trackGroup2Node = new OLDTrackGroupNode( model.trackGroup2, blueCarImage, this.keypad, {
      left: OLDURConstants.PANEL_SPACING,
      top: this.trackGroup1Node.bottom + 5,
      trackOnTop: true,
      numberLineTitle: doubleNumberLine2String,
      rateTitle: rate2String,
      rateColor: 'rgb(29,174,235)',
      ratePressedColor: 'rgb(9,154,215)',
      timerTitle: timer2String
    } );
    this.addChild( this.trackGroup2Node );

    // play/pause button
    var goIcon = new Image( goButtonIconImage, { scale: 0.5 } );
    var stopIcon = new Image( stopButtonImage, { scale: 0.5 } );
    this.goStopButton = new BooleanRoundToggleButton( stopIcon, goIcon, model.runningProperty, {
      right: this.layoutBounds.right - OLDURConstants.SCREEN_HORIZONTAL_MARGIN,
      centerY: this.trackGroup2Node.top - OLDURConstants.PANEL_SPACING / 2,
      radius: 45
    } );
    this.addChild( this.goStopButton );

    // restart button which moves the car back to the start line. Is only visible when not racing
    this.restartButton = new RectangularPushButton( {
      right: this.goStopButton.left - OLDURConstants.PANEL_SPACING,
      centerY: this.goStopButton.centerY,
      content: new Image( returnCarButtonImage, { scale: 0.18 } ),
      minWidth: 45,
      minHeight: 45,
      cornerRadius: 4,
      baseColor: '#A9D8FD',
      xMargin: 8,
      yMargin: 5,
      touchAreaXDilation: 0,
      touchAreaYDilation: 0,
      stroke: 'black',
      lineWidth: 0.5,
      enabled: false,
      listener: function() {
        self.restart();
        self.restartButton.enabled = false;
      }
    } );
    this.addChild( this.restartButton );

    // keypad layout
    this.keypad.right = this.width;
    this.keypad.centerY = this.centerY;

    // @protected - covers entire screen, uses picking to close keypad, 'visible' only when the keypad is visible
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
      right: this.layoutBounds.maxX - OLDURConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: this.layoutBounds.maxY - OLDURConstants.SCREEN_HORIZONTAL_MARGIN
    } );
    this.addChild( resetAllButton );

    // scene control, 1 or 2 cars
    var sceneControl = new OLDRacingLabSceneControl( this.model.trackCountProperty, {
      right: this.layoutBounds.right - OLDURConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: resetAllButton.top - OLDURConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( sceneControl );

    // layer thing correctly
    this.keypadCloseArea.moveToFront();
    this.keypad.moveToFront();

    // show/hide the 2nd track based ont eh track count
    this.model.trackCountProperty.link( function( value, oldValue ) {
      self.trackGroup2Node.visible = ( value === 2 );
    } );

    // show/hide the restart button, change the go/stop button color
    this.model.runningProperty.lazyLink( function( value, oldValue ) {
      self.restartButton.enabled = ( !value && !self.model.atStart() );
      self.goStopButton.baseColor = ( value ? '#6D6E70' : '#85d4a6' );
    } );
  }

  unitRates.register( 'OLDRacingLabScreenView', OLDRacingLabScreenView );

  return inherit( ScreenView, OLDRacingLabScreenView, {

    /**
     * Hide the keypad and clear it's listeners
     *
     * @protected
     */
    hideKeypad: function() {
      this.keypad.hide();
      this.keypad.clear();
      this.keypad.clearListeners();
    },

    /**
     * Called when the user selects the sim reset button
     *
     * @protected
     */
    restart: function() {
      this.model.restart();
    },

    /**
     * Called when the user selects the sim reset button
     *
     * @protected
     */
    resetAll: function() {
      this.model.reset();
      this.trackGroup1Node.reset();
      this.trackGroup2Node.reset();
      this.hideKeypad();
    },

    /**
     * Resize the keypad's rectangular pick area to match the full screen of the browser.
     *
     * @protected
     */
    onResize: function() {
      // resize the pick area to match the screen
      this.keypadCloseArea.setRect( 0, 0, window.innerWidth, window.innerHeight );
    }

  } ); // inherit

} ); // define