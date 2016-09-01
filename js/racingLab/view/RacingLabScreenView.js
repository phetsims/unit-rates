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
  var CarWorksheetNode = require( 'UNIT_RATES/racingLab/view/CarWorksheetNode' );
  var KeypadPanelNode = require( 'UNIT_RATES/common/view/KeypadPanelNode' );
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

    // properties
    this.carCountProperty = new Property( 1 );

    // shared keypad which becomes visible when an edit number display button is selected.
    this.keypad = new KeypadPanelNode( {
      maxDigits: 4,
      visible: false
    } );
    this.addChild( this.keypad );

    this.worksheetNode1 = new CarWorksheetNode( model, this.keypad, {
      left:             URConstants.SCREEN_PANEL_SPACING,
      top:              URConstants.SCREEN_VERTICAL_MARGIN,
      numberLineTitle:  doubleNumberLine1String,
      rateTitle:        rate1String,
      timerTitle:       timer1String
    } );
    this.addChild( this.worksheetNode1 );

    this.worksheetNode2 = new CarWorksheetNode( model, this.keypad, {
        left:             URConstants.SCREEN_PANEL_SPACING,
        top:              this.worksheetNode1.bottom + URConstants.SCREEN_PANEL_SPACING,
        trackOnTop:       true,
        numberLineTitle:  doubleNumberLine2String,
        rateTitle:        rate2String,
        timerTitle:       timer2String
    } );
    this.addChild( this.worksheetNode2 );

    // play/pause button
    var playPauseButton = new PlayPauseButton( model.runningProperty, {
      right: this.worksheetNode2.right,
      centerY: this.worksheetNode2.top - URConstants.SCREEN_PANEL_SPACING / 2,
      radius: 34
    } );
    this.addChild( playPauseButton );

    // keypad layout
    this.keypad.right = this.worksheetNode1.right - 30;
    this.keypad.top   = this.worksheetNode1.bottom + 2 * URConstants.SCREEN_PANEL_SPACING;

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

    var carCountButtons = new RadioButtonGroup( this.carCountProperty, [
      { value: 1, node: new Image( oneCarImage, { scale: 0.075 } ) },
      { value: 2, node: new Image( twoCarImage, { scale: 0.075 } ) }
    ], {
      right:  this.layoutBounds.right - URConstants.SCREEN_HORIZONTAL_MARGIN,
      bottom: resetAllButton.top - URConstants.SCREEN_VERTICAL_MARGIN,
      orientation:  'vertical',
      baseColor:    'white',
      spacing:        5
    } );
    this.addChild( carCountButtons );

    this.carCountProperty.link( function( value, oldValue ) {
      self.worksheetNode2.visible = ( value === 2 );
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
    resetAll: function() {
        this.model.reset();

        this.carCountProperty.reset();

        this.worksheetNode1.reset();
        this.worksheetNode2.reset();

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
