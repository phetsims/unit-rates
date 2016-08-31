// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );
  var KeypadPanelNode = require( 'UNIT_RATES/common/view/KeypadPanelNode' );
  var SpeedRateNode = require( 'UNIT_RATES/racingLab/view/SpeedRateNode' );
  var RaceTrackNode = require( 'UNIT_RATES/racingLab/view/RaceTrackNode' );
  var PlayPauseButton = require( 'SCENERY_PHET/buttons/PlayPauseButton' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Property = require( 'AXON/Property' );
  var Bounds2 = require( 'DOT/Bounds2' );

  // images
  var oneCarImage = require( 'image!UNIT_RATES/one_car.png' );
  var twoCarImage = require( 'image!UNIT_RATES/two_car.png' );

  // strings
  var milesCapString = require( 'string!UNIT_RATES/milesCap' );
  var hoursCapString = require( 'string!UNIT_RATES/hoursCap' );

  /**
   * @param {RacingLabModel} model
   * @constructor
   */
  function RacingLabScreenView( model ) {

    ScreenView.call( this );

    var self = this;

    this.model = model;

    // properties
    this.carCountProperty = new Property( 1 );

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new KeypadPanelNode( {
      maxDigits: 4,
      visible: false
    } );
    this.addChild( this.keypad );

    // number line
    this.numberLineNode = new URNumberLineNode( {
    //this.numberLineNode = new NumberLineNode( model.numberLine, this.keypad, {
      left: this.layoutBounds.left + URConstants.SCREEN_PANEL_SPACING,
      top:  this.layoutBounds.top  + URConstants.SCREEN_VERTICAL_MARGIN } );
    this.addChild( this.numberLineNode );
    this.numberLineNode.setLineLabels( milesCapString, hoursCapString );

    // number line
    this.rateNode = new SpeedRateNode( model, {
      left: this.numberLineNode.right + URConstants.SCREEN_PANEL_SPACING,
      top:  this.layoutBounds.top     + URConstants.SCREEN_VERTICAL_MARGIN
    } );
    this.addChild( this.rateNode );

    // track
    this.trackNode = new RaceTrackNode( model.timerProperty, {
      left: this.layoutBounds.left + URConstants.SCREEN_PANEL_SPACING,
      top:  this.numberLineNode.bottom  + URConstants.SCREEN_VERTICAL_MARGIN,
      timerText: 'Timer 1'
    } );
    this.addChild( this.trackNode );

    // keypad layout
    this.keypad.right = this.numberLineNode.right - 30;
    this.keypad.top   = this.numberLineNode.bottom + 2 * URConstants.SCREEN_PANEL_SPACING;

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

    // play/pause button
    var playPauseButton = new PlayPauseButton( model.runningProperty, {
      left: this.numberLineNode.right + URConstants.SCREEN_PANEL_SPACING,
      top: this.trackNode.bottom + URConstants.SCREEN_PANEL_SPACING,
      radius: 34
    } );
    this.addChild( playPauseButton );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        self.resetAll();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );

    var carCountButtons = new RadioButtonGroup( this.carCountProperty, [
      { value: 1, node: new Image( oneCarImage, { scale: 0.075 } ) },
      { value: 2, node: new Image( twoCarImage, { scale: 0.075 } ) }
    ], {
      right:  this.layoutBounds.right - URConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: resetAllButton.top - URConstants.SCREEN_VERTICAL_MARGIN,
      orientation: 'vertical',
      baseColor: 'white',
      spacing: 5
    } );
    this.addChild( carCountButtons );
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
    resetAll: function() {
        this.model.reset();

        this.rateNode.reset();

        this.carCountProperty.reset();
        this.hideKeypad();
        this.numberLineNode.reset();
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
