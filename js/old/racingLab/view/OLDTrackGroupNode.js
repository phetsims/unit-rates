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
  
  // sim modules
  var OLDSpeedRateNode = require( 'UNIT_RATES/old/racingLab/view/OLDSpeedRateNode' );
  var OLDTrackNode = require( 'UNIT_RATES/old/racingLab/view/OLDTrackNode' );
  var OLDURConstants = require( 'UNIT_RATES/old/common/OLDURConstants' );
  var OLDURNumberLineNode = require( 'UNIT_RATES/old/common/view/OLDURNumberLineNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var milesString = require( 'string!UNIT_RATES/miles' );
  
  // constants
  var RACE_TRACK_NUMBER_LINE_OFFSET = 55; // the offset of the start of X=0 (aka. the space for the edit marker)
  var RACING_LAB_NUMBER_LINE_WIDTH = 670; // width of the number line

  /**
   * @param {OLDTrackGroup} model
   * @param {string} carImageName
   * @param {OLDKeypadPanelNode} keypad - the shared keypad
   * @param {Object} [options]
   * @constructor
   */
  function OLDTrackGroupNode( model, carImageName, keypad, options ) {

    options = _.extend( {
      numberLineTitle: '',
      rateTitle: '',
      rateColor: 'rgb(50,50,50)',
      ratePressedColor: 'rgb(100,100,100)',
      timerTitle: '',
      trackOnTop: false
    }, options );

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.trackGroup = model;

    // number line
    this.numberLineNode = new OLDURNumberLineNode( this.trackGroup.numberline, keypad, {
      numberLineTitle: options.numberLineTitle,
      graphWidth: RACING_LAB_NUMBER_LINE_WIDTH,
      graphHeight: 95,
      xAxisOffset: 9,
      yAxisOffset: RACE_TRACK_NUMBER_LINE_OFFSET,
      xAxisLength: RACING_LAB_NUMBER_LINE_WIDTH - RACE_TRACK_NUMBER_LINE_OFFSET,
      yAxisLength: 28,
      markerLargeHeight: 30,
      markerSmallHeight: 15
    } );
    this.numberLineNode.setLineLabels( milesString, hoursString );

    // rate spinners
    this.rateNode = new OLDSpeedRateNode( this.trackGroup, {
      left: this.numberLineNode.right + OLDURConstants.PANEL_SPACING,
      rateTitle: options.rateTitle,
      pickerColor: options.rateColor,
      pickerPressedColor: options.ratePressedColor
    } );

    // car track
    var trackOptions = {
      trackWidth: RACING_LAB_NUMBER_LINE_WIDTH,
      trackHeight: 100,
      trackStartOffset: RACE_TRACK_NUMBER_LINE_OFFSET,
      timerTitle: options.timerTitle
    };
    trackOptions = ( options.trackOnTop ?
                     _.extend( { bottom: this.numberLineNode.top - 4 }, trackOptions ) :
                     _.extend( { top: this.numberLineNode.bottom + 4 }, trackOptions )
    );
    this.trackNode = new OLDTrackNode( this.trackGroup, carImageName, trackOptions );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ this.numberLineNode, this.rateNode, this.trackNode ];

    Node.call( this, options );

    this.trackGroup.trackPixelLengthProperty.lazyLink( function( value, oldValue ) {
      self.numberLineNode.setPixelLength( value );
    } );
  }

  unitRates.register( 'OLDTrackGroupNode', OLDTrackGroupNode );

  return inherit( Node, OLDTrackGroupNode, {

    // @public
    reset: function() {
      this.numberLineNode.reset();
      this.rateNode.reset();
      this.trackNode.reset();
    }

  } ); // inherit

} ); // define
