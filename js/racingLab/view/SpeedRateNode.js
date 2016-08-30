// Copyright 2002-2016, University of Colorado Boulder

/**
 * A collapsable box node containing spinners for changing the current unit rate
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Property = require( 'AXON/Property' );
  //var Util = require( 'DOT/Util' );

  // strings
  var rateString = require( 'string!UNIT_RATES/rate' );
  var milesString = require( 'string!UNIT_RATES/miles' );
  var hoursString = require( 'string!UNIT_RATES/hours' );

  // constants
  var TEXT_FONT       = new PhetFont( 18 ); // Font to use for all text
  var TEXT_MAX_WIDTH  = 125;
  var DIVISOR_WIDTH   = 135;
  var X_MARGIN        = 20;
  var Y_MARGIN        = 0;
  var X_SPACING       = 20;
  var Y_SPACING       = 10;

  /**
   * @param {RacingLabModel} model
   * @param {Object} [options]
   * @constructor
   */
  function SpeedRateNode( model, options ) {

    options = _.extend( {
    },  options || {} );

    // @protected - all
    this.milesRangeProperty = new Property( new RangeWithValue( 1, 250 ) );
    this.milesProperty      = new Property( 50 ),
    this.hoursRangeProperty  = new Property( new RangeWithValue( 1, 20 ) );
    this.hoursProperty       = new Property( 2 ),

    this.contentNode = new Node();

    // layout adjustment
    var strut = new HStrut( DIVISOR_WIDTH + 2 * X_MARGIN );   // This will set the width of the panel
    this.contentNode.addChild( strut );

    // select the rate for the currently selected item - no dispose as these never go away
    Property.lazyMultilink( [ this.milesProperty, this.hoursProperty ], this.rateChanged.bind( this ) );

    this.milesPicker = new NumberPicker(this.milesProperty, this.milesRangeProperty, {
      left:   X_MARGIN,
      top:    Y_MARGIN,
      color: 'rgb(50,50,50)',
      pressedColor: 'black',
      xMargin: 8,
      yMargin: 0,
      cornerRadius: 0,
      touchAreaXDilation: 30,
      font: TEXT_FONT
    } );
    this.contentNode.addChild( this.milesPicker );

    this.hoursPicker = new NumberPicker( this.hoursProperty, this.hoursRangeProperty, {
      centerX:   this.milesPicker.centerX,
      top: this.milesPicker.bottom + 2 * Y_SPACING,
      color: 'rgb(50,50,50)',
      pressedColor: 'black',
      xMargin: 8,
      yMargin: 0,
      cornerRadius: 0,
      touchAreaXDilation: 30,
      font: TEXT_FONT
    } );
    this.contentNode.addChild( this.hoursPicker );

    this.milesText = new Text( milesString , {
      left: this.milesPicker.right + X_SPACING,
      centerY: this.milesPicker.centerY,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );
    this.contentNode.addChild( this.milesText );

    var divisorLine = new Path( new Shape()
        .moveTo( this.milesPicker.left, this.milesPicker.bottom + Y_SPACING )
        .lineTo( this.milesPicker.left + DIVISOR_WIDTH, this.milesPicker.bottom + Y_SPACING ), {
      stroke: 'black',
      lineWidth: 1.25
    } );
    this.contentNode.addChild( divisorLine );

    this.hoursText = new Text( hoursString , {
      left: this.milesText.left,
      centerY: this.hoursPicker.centerY,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );
    this.contentNode.addChild( this.hoursText );

    this.expandedProperty = new Property( true );
    AccordionBox.call( this, this.contentNode, {
      expandedProperty: this.expandedProperty,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 15,
      titleNode: new Text( rateString, { font: URConstants.PANEL_TITLE_FONT, maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'center',
      contentXMargin: 0,
      contentYMargin: 10
    } );

    this.mutate( options );
  }

  unitRates.register( 'SpeedRateNode', SpeedRateNode );

  return inherit( AccordionBox, SpeedRateNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Called when the user changes the miles or hours
     * @param {Property.<number>} miles
     * @param {Property.<number> } hours
     * @private
     */
    rateChanged: function( miles, hours ) {

    },

    /**
     * Resets the challenges questions to all unanswered
     * @public
     */
    reset: function() {
      this.milesProperty.reset();
      this.hoursProperty.reset();
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
