// Copyright 2016, University of Colorado Boulder

/**
 * A collapsible box node containing spinners for changing the current unit rate
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  
  // sim modules
  var OLDURConstants = require( 'UNIT_RATES/old/common/OLDURConstants' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );
  var milesString = require( 'string!UNIT_RATES/miles' );

  // constants
  var TEXT_FONT = new PhetFont( 14 ); // Font to use for all text
  var TEXT_MAX_WIDTH = 100;
  var PICKER_FONT = new PhetFont( 16 ); // Font to use for all text
  var DIVISOR_WIDTH = 100;
  var X_MARGIN = 10;
  var Y_MARGIN = 0;
  var X_SPACING = 10;
  var Y_SPACING = 10;

  /**
   * @param {TrackGroup} model
   * @param {Object} [options]
   * @constructor
   */
  function OLDSpeedRateNode( model, options ) {

    options = _.extend( {
      rateTitle: '',
      pickerColor: 'rgb(50,50,50)',
      pickerPressedColor: 'rgb(100,100,100)'
    }, options );

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.groupModel = model;

    // the content node for the AccordionBox
    this.contentNode = new Node();

    // layout adjustment
    var strut = new HStrut( DIVISOR_WIDTH + 2 * X_MARGIN );   // This will set the width of the panel
    this.contentNode.addChild( strut );

    // change the rate when either miles/hours spinner changes - no dispose as these never go away
    Property.lazyMultilink( [ this.groupModel.milesProperty, this.groupModel.hoursProperty ], this.rateChanged.bind( this ) );

    var pickerOptions = {
      color: options.pickerColor,
      pressedColor: options.pickerPressedColor,
      xMargin: 8,
      yMargin: 8,
      arrowHeight: 10,
      arrowWidth: 75,
      cornerRadius: 5,
      touchAreaXDilation: 30,
      font: PICKER_FONT
    };
    this.milesPicker = new NumberPicker( this.groupModel.milesProperty, this.groupModel.milesRangeProperty, _.extend( {
      left: X_MARGIN,
      top: Y_MARGIN,
      upFunction: function() { return self.groupModel.milesProperty.value + 5; }, // move miles in increments of 5
      downFunction: function() { return self.groupModel.milesProperty.value - 5; }
    }, pickerOptions ) );
    this.contentNode.addChild( this.milesPicker );

    this.hoursPicker = new NumberPicker( this.groupModel.hoursProperty, this.groupModel.hoursRangeProperty, _.extend( {
      centerX: this.milesPicker.centerX,
      top: this.milesPicker.bottom + 2 * Y_SPACING
    }, pickerOptions ) );
    this.contentNode.addChild( this.hoursPicker );

    this.milesText = new Text( milesString, {
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

    this.hoursText = new Text( hoursString, {
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
      buttonYMargin: 5,
      titleNode: new Text( options.rateTitle, { font: OLDURConstants.PANEL_TITLE_FONT, maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'center',
      contentXMargin: 0,
      contentYMargin: 5
    } );

    this.mutate( options );
  }

  unitRates.register( 'OLDSpeedRateNode', OLDSpeedRateNode );

  return inherit( AccordionBox, OLDSpeedRateNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Called when the user changes the miles or hours, updates the current unit rate
     *
     * @param {number} miles
     * @param {number} hours
     * @private
     */
    rateChanged: function( miles, hours ) {
      this.groupModel.rateProperty.value = miles / hours;
    },

    // @public
    reset: function() {
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit