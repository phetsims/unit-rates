// Copyright 2016, University of Colorado Boulder

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
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );
  var SpeedRateNode = require( 'UNIT_RATES/racingLab/view/SpeedRateNode' );
  var RaceTrackNode = require( 'UNIT_RATES/racingLab/view/RaceTrackNode' );
  var Node = require( 'SCENERY/nodes/Node' );

  // strings
  var milesCapString = require( 'string!UNIT_RATES/milesCap' );
  var hoursCapString = require( 'string!UNIT_RATES/hoursCap' );

  /**
   * @param {RacingLabModel} model
   * @constructor
   */
  function CarWorksheetNode( model, keypad, options ) {

    options = _.extend( {
      numberLineTitle:   '',
      rateTitle:         '',
      rateColor:         'rgb(50,50,50)',
      ratePressedColor:  'rgb(100,100,100)',
      timerTitle:        '',
      trackOnTop:       false
    }, options || {} );

    this.model = model;

    // number line
    this.numberLineNode = new URNumberLineNode( {
    //this.numberLineNode = new NumberLineNode( model.numberLine, this.keypad, {
      numberLineTitle:  options.numberLineTitle,
      graphHeight:      75
     } );
    this.numberLineNode.setLineLabels( milesCapString, hoursCapString );

    // number line
    this.rateNode = new SpeedRateNode( model, {
      left: this.numberLineNode.right + URConstants.SCREEN_PANEL_SPACING,
      rateTitle: options.rateTitle,
      pickerColor:        options.rateColor,
      pickerPressedColor: options.ratePressedColor
    } );

    // track
    var trackOptions = { timerTitle: options.timerTitle };
    trackOptions = ( options.trackOnTop ?
      _.extend( { bottom: this.numberLineNode.top - URConstants.SCREEN_VERTICAL_MARGIN }, trackOptions ) :
      _.extend( { top: this.numberLineNode.bottom + URConstants.SCREEN_VERTICAL_MARGIN }, trackOptions )
    );
    this.trackNode = new RaceTrackNode( model.timerProperty, trackOptions );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ this.numberLineNode, this.rateNode, this.trackNode ];

    Node.call( this, options );
  }

  unitRates.register( 'CarWorksheetNode', CarWorksheetNode );

  return inherit( Node, CarWorksheetNode, {

    /**
     *
     * @public
     */
    reset: function() {
      this.numberLineNode.reset();
      this.rateNode.reset();
    }

  } ); // inherit

} ); // define

