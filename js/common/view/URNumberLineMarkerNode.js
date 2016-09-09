// Copyright 2002-2016, University of Colorado Boulder

/**
 * A parent node (of baically two editable number displays) which represents a spot on the double number line.
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var EditNumberDisplayNode = require( 'UNIT_RATES/common/view/EditNumberDisplayNode' );
  var MovableItemNode = require( 'UNIT_RATES/common/view/MovableItemNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Property = require( 'AXON/Property' );

  // constants
  var LARGE_LINE_HEIGHT     = 35;
  var SMALL_LINE_HEIGHT     = 18;
  var EDIT_BUTTON_MARGIN    = 5;
  var EDIT_BORDER_COLOR     = 'rgba(0,0,0,1)';
  var EDIT_BG_COLOR         = 'rgba(255,255,255,1)';
  var PRECISION_TEXT_COLOR  = 'rgba(128,128,128,1)';
  var DEFAULT_TEXT_COLOR    = 'rgba(0,0,0,1)';
  var DEFAULT_LINE_COLOR    = 'rgba(0,0,0,1)';
  var DEFAULT_BORDER_COLOR  = 'rgba(0,0,0,0)';
  var RANGE_TEXT_COLOR      = 'rgba(255,0,0,1)';
  var TRANSPARENT_COLOR     = 'rgba(0,0,0,0)';
  var LARGE_FONT            = new PhetFont( 11 );
  var SMALL_FONT            = new PhetFont( 9 );

  /**
   * @param {URNumberLineMarker} marker
   * @param {Vector2} position - x,y position on the number line
   * @param {KeypadPanelNode} keypad - shared keypad
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineMarkerNode( marker, position, keypad, options ) {

    options = _.extend( {
      topPattern:           '{0}',
      topDecimalPlaces:     2,
      bottomPattern:        '{0}',
      bottomDecimalPlaces:  1,
      lineWidth:            1.25,
      markerColor:          DEFAULT_LINE_COLOR
    }, options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    // @public (read-write)
    this.marker             = marker;
    this.keypad             = keypad;
    this.markerColor        = options.markerColor;

    // top label - cost
    this.topNumberDisplay = new EditNumberDisplayNode( keypad, this.marker.topQnA.valueProperty, options.topPattern, {
        centerX:          -2,
        bottom:           -SMALL_LINE_HEIGHT,
        decimalPlaces:    options.topDecimalPlaces,
        buttonPosition:   'top',
        buttonSpacing:    EDIT_BUTTON_MARGIN,
        textColor:        DEFAULT_TEXT_COLOR,
        backgroundColor:  TRANSPARENT_COLOR,
        borderColor:      EDIT_BORDER_COLOR,
        font:             SMALL_FONT
    } );

    this.smallLineShape = new Shape()
      .moveTo( 0, -SMALL_LINE_HEIGHT )
      .lineTo( 0,  SMALL_LINE_HEIGHT );
    this.largeLineShape = new Shape()
      .moveTo( 0, -LARGE_LINE_HEIGHT )
      .lineTo( 0,  LARGE_LINE_HEIGHT );

    this.markerLine = new Path( this.smallLineShape, {
        centerX:    0,
        centerY:    0,
        lineWidth:  options.lineWidth,
        stroke:     options.markerColor,
        pickable:   false
      } );

    // bottom label - unit
    this.bottomNumberDisplay = new EditNumberDisplayNode( keypad, this.marker.bottomQnA.valueProperty, options.bottomPattern, {
        centerX:          -2,
        top:              SMALL_LINE_HEIGHT,
        decimalPlaces:    options.bottomDecimalPlaces,
        buttonPosition:   'bottom',
        buttonSpacing:    EDIT_BUTTON_MARGIN,
        textColor:        DEFAULT_TEXT_COLOR,
        backgroundColor:  TRANSPARENT_COLOR,
        borderColor:      EDIT_BORDER_COLOR,
        font:             SMALL_FONT
    } );

    // add all child nodes
    options.children = [ this.topNumberDisplay, this.markerLine, this.bottomNumberDisplay ];

    MovableItemNode.call( this, marker, position, options );

    // check answers on user input
    this.qnaMultilink = Property.multilink( [ this.marker.topQnA.valueProperty, this.marker.bottomQnA.valueProperty, this.marker.outOfRangeProperty ],
      function( costProperty, unitProperty, outOfRangeProperty ) {
        self.checkEditable();
    } );
 }

  unitRates.register( 'URNumberLineMarkerNode', URNumberLineMarkerNode );

  return inherit( MovableItemNode, URNumberLineMarkerNode, {

    /**
     * Changes various color/visibility attributes based on the edit state
     * @protected
     */
    checkEditable: function() {

      // non-editable/locked marker
      if ( !this.marker.editableProperty.value ) {

        // fractional counts have different visual represenation than whole counts.
        if ( this.marker.isFractionalProperty.value ) {

          // text/line color
          this.markerLine.stroke = PRECISION_TEXT_COLOR;
          this.topNumberDisplay.setTextColor( PRECISION_TEXT_COLOR );
          this.bottomNumberDisplay.setTextColor( PRECISION_TEXT_COLOR );

          this.topNumberDisplay.setBackgroundColor( TRANSPARENT_COLOR );
          this.bottomNumberDisplay.setBackgroundColor( TRANSPARENT_COLOR );
        }
        else {

          // layout
          this.markerLine.setShape(this.largeLineShape);
          this.topNumberDisplay.bottom = -LARGE_LINE_HEIGHT;
          this.bottomNumberDisplay.top =  LARGE_LINE_HEIGHT;

          // text color
          this.topNumberDisplay.setTextColor( this.markerColor );
          this.bottomNumberDisplay.setTextColor( this.markerColor );

          // font
          this.topNumberDisplay.setFont( LARGE_FONT );
          this.bottomNumberDisplay.setFont( LARGE_FONT );
        }

        // edit button
        this.topNumberDisplay.hideEditButton();
        this.bottomNumberDisplay.hideEditButton();

        // background color
        this.topNumberDisplay.setBackgroundColor( TRANSPARENT_COLOR );
        this.bottomNumberDisplay.setBackgroundColor( TRANSPARENT_COLOR );

        // border color
        this.topNumberDisplay.setBorderColor( DEFAULT_BORDER_COLOR );
        this.bottomNumberDisplay.setBorderColor( DEFAULT_BORDER_COLOR );
      }
      else {
        // editable marker

        // layout
        this.markerLine.setShape(this.smallLineShape);
        this.topNumberDisplay.bottom = -SMALL_LINE_HEIGHT;
        this.bottomNumberDisplay.top =  SMALL_LINE_HEIGHT;

        // edit button
        this.topNumberDisplay.showEditButton();
        this.bottomNumberDisplay.showEditButton();

        // text color
        if ( this.marker.topQnA.isAnswerValid() ) {
           this.topNumberDisplay.setTextColor( this.marker.outOfRangeProperty.value ? RANGE_TEXT_COLOR : DEFAULT_TEXT_COLOR );
        }
        else {
          this.topNumberDisplay.setTextColor( TRANSPARENT_COLOR );
        }

        if ( this.marker.bottomQnA.isAnswerValid() ) {
          this.bottomNumberDisplay.setTextColor( this.marker.outOfRangeProperty.value ? RANGE_TEXT_COLOR : DEFAULT_TEXT_COLOR );
        }
        else {
          this.bottomNumberDisplay.setTextColor( TRANSPARENT_COLOR );
        }

        // background color
        this.topNumberDisplay.setBackgroundColor( EDIT_BG_COLOR );
        this.bottomNumberDisplay.setBackgroundColor( EDIT_BG_COLOR );

        // border color
        if ( !this.topNumberDisplay.hasKeypadFocus ) {
          this.topNumberDisplay.setBorderColor( EDIT_BORDER_COLOR );
        }
        if ( !this.bottomNumberDisplay.hasKeypadFocus ) {
          this.bottomNumberDisplay.setBorderColor( EDIT_BORDER_COLOR );
        }
      }
    },

    // @public
    dispose: function() {
      this.qnaMultilink.dispose();
      this.topNumberDisplay.dispose();
      this.bottomNumberDisplay.dispose();
      MovableItemNode.prototype.dispose.call( this );
    }

  } ); // inherit

} ); // define

