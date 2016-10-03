// Copyright 2016, University of Colorado Boulder

/**
 * Node encompassing the number line, race track and rate adjustment panel.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var RacingLabConstants = require( 'UNIT_RATES/racingLab/RacingLabConstants' );
  var SpeedRateNode = require( 'UNIT_RATES/racingLab/view/SpeedRateNode' );
  var TrackNode = require( 'UNIT_RATES/racingLab/view/TrackNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );

  // strings
  var hoursCapString = require( 'string!UNIT_RATES/hoursCap' );
  var milesCapString = require( 'string!UNIT_RATES/milesCap' );

  /**
   * @param {TrackGroup} model
   * @param {string} carImageName
   * @param {KeypadPanelNode} keypad - the shared keypad
   * @param {Object} [options]
   * @constructor
   */
  function TrackGroupNode( model, carImageName, keypad, options ) {

    options = _.extend( {
      numberLineTitle: '',
      rateTitle: '',
      rateColor: 'rgb(50,50,50)',
      ratePressedColor: 'rgb(100,100,100)',
      timerTitle: '',
      trackOnTop: false
    }, options || {} );

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.trackGroup = model;

    // number line
    this.numberLineNode = new URNumberLineNode( this.trackGroup.numberline, keypad, {
      numberLineTitle: options.numberLineTitle,
      graphWidth: RacingLabConstants.TRACK_NUMBER_LINE_WIDTH,
      graphHeight: 95,
      xAxisOffset: 9,
      yAxisOffset: RacingLabConstants.TRACK_NUMBER_LINE_OFFSET,
      xAxisLength: RacingLabConstants.TRACK_NUMBER_LINE_WIDTH - RacingLabConstants.TRACK_NUMBER_LINE_OFFSET,
      yAxisLength: 28,
      markerLargeHeight: 30,
      markerSmallHeight: 15
    } );
    this.numberLineNode.setLineLabels( milesCapString, hoursCapString );

    // rate spinners
    this.rateNode = new SpeedRateNode( this.trackGroup, {
      left: this.numberLineNode.right + URConstants.SCREEN_PANEL_SPACING,
      rateTitle: options.rateTitle,
      pickerColor: options.rateColor,
      pickerPressedColor: options.ratePressedColor
    } );

    // car track
    var trackOptions = {
      trackWidth: RacingLabConstants.TRACK_NUMBER_LINE_WIDTH,
      trackHeight: 100,
      trackStartOffset: RacingLabConstants.TRACK_NUMBER_LINE_OFFSET,
      timerTitle: options.timerTitle
    };
    trackOptions = ( options.trackOnTop ?
                     _.extend( { bottom: this.numberLineNode.top - 4 }, trackOptions ) :
                     _.extend( { top: this.numberLineNode.bottom + 4 }, trackOptions )
    );
    this.trackNode = new TrackNode( this.trackGroup, carImageName, trackOptions );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ this.numberLineNode, this.rateNode, this.trackNode ];

    Node.call( this, options );

    this.trackGroup.trackPixelLengthProperty.lazyLink( function( value, oldValue ) {
      self.numberLineNode.setPixelLength( value );
    } );
  }

  unitRates.register( 'TrackGroupNode', TrackGroupNode );

  return inherit( Node, TrackGroupNode, {

    // @public
    reset: function() {
      this.numberLineNode.reset();
      this.rateNode.reset();
      this.trackNode.reset();
    }

  } ); // inherit

} ); // define

