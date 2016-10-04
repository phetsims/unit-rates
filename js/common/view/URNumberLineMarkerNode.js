// Copyright 2016, University of Colorado Boulder

/**
 * A number line marker node (of basically two editable number displays) which represents a spot on the double number line.
 * A marker node has different appearance, which one is used is based on several property values. A marker maybe:
 *  - Editable | non-editable
 *  - High | low precision
 *  - Out of Range
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var EditNumberDisplayNode = require( 'UNIT_RATES/common/view/EditNumberDisplayNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableNode = require( 'UNIT_RATES/common/view/MovableNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var EDIT_BUTTON_MARGIN = 5;
  var EDIT_BORDER_COLOR = 'rgba(0,0,0,1)';
  var EDIT_BG_COLOR = 'rgba(255,255,255,1)';
  var PRECISION_TEXT_COLOR = 'rgba(128,128,128,1)';
  var DEFAULT_TEXT_COLOR = 'rgba(0,0,0,1)';
  var DEFAULT_BORDER_COLOR = 'rgba(0,0,0,0)';
  var RANGE_TEXT_COLOR = 'rgba(255,0,0,1)';
  var TRANSPARENT_COLOR = 'rgba(0,0,0,0)';
  var LARGE_FONT = new PhetFont( 11 );
  var SMALL_FONT = new PhetFont( 9 );

  /**
   * @param {URNumberLineMarker} marker
   * @param {Vector2} position - (x,y) position on the number line
   * @param {KeypadPanelNode} keypad - shared keypad
   * @param {function} updateFunction - the parent number line update function, basically called when the node needs to be moved
   * @param {Object} [options]
   * @constructor
   */
  function URNumberLineMarkerNode( marker, position, keypad, updateFunction, options ) {

    options = _.extend( {
      topPattern: '{0}',
      bottomPattern: '{0}',
      stroke: 'black',
      lineWidth: 1.25,
      largeHeight: 35,
      smallHeight: 18
    }, options );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    // @public (read-write)
    this.marker = marker;
    this.keypad = keypad;
    this.updateFunction = updateFunction;

    // @protected
    this.largeHeight = options.largeHeight;
    this.smallHeight = options.smallHeight;

    // @protected - top label
    this.topNumberDisplay = new EditNumberDisplayNode( keypad, this.marker.topQnA.valueProperty, options.topPattern, {
      centerX: -2,
      bottom: -this.smallHeight,
      decimalPlaces: marker.topDecimalPlaces,
      buttonPosition: 'top',
      buttonSpacing: EDIT_BUTTON_MARGIN,
      textColor: DEFAULT_TEXT_COLOR,
      backgroundColor: TRANSPARENT_COLOR,
      borderColor: EDIT_BORDER_COLOR,
      font: SMALL_FONT,
      minWidth: 100
    } );

    // @protected - both
    this.smallLineShape = new Shape()
      .moveTo( 0, -this.smallHeight )
      .lineTo( 0, this.smallHeight );
    this.largeLineShape = new Shape()
      .moveTo( 0, -this.largeHeight )
      .lineTo( 0, this.largeHeight );

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.markerLine = new Path( this.smallLineShape, {
      centerX: 0,
      centerY: 0,
      lineWidth: options.lineWidth,
      stroke: marker.color,
      pickable: false
    } );

    // @protected - bottom label
    this.bottomNumberDisplay = new EditNumberDisplayNode( keypad, this.marker.bottomQnA.valueProperty, options.bottomPattern, {
      centerX: -2,
      top: this.smallHeight,
      decimalPlaces: marker.bottomDecimalPlaces,
      buttonPosition: 'bottom',
      buttonSpacing: EDIT_BUTTON_MARGIN,
      textColor: DEFAULT_TEXT_COLOR,
      backgroundColor: TRANSPARENT_COLOR,
      borderColor: EDIT_BORDER_COLOR,
      font: SMALL_FONT
    } );

    // add all child nodes
    options.children = [ this.topNumberDisplay, this.markerLine, this.bottomNumberDisplay ];

    MovableNode.call( this, marker, position, options );

    // @private change appearance on user input
    this.qnaMultilink = Property.multilink( [ this.marker.topQnA.valueProperty, this.marker.bottomQnA.valueProperty, this.marker.outOfRangeProperty ],
      function( topProperty, bottomProperty, outOfRangeProperty ) {
        self.checkProperties();
        self.updateFunction( self );
      } );
    assert && assert( this.qnaMultilink, 'you hit this bug: https://github.com/phetsims/unit-rates/issues/106' );
  }

  unitRates.register( 'URNumberLineMarkerNode', URNumberLineMarkerNode );

  return inherit( MovableNode, URNumberLineMarkerNode, {

    /**
     * Changes color/size/other attributes based on various properties
     * @protected
     */
    checkProperties: function() {

      // non-editable/locked marker
      if ( !this.marker.editableProperty.value ) {

        // higher precision markers have different visual representation.
        if ( this.marker.highPrecisionProperty.value ) {

          // layout
          this.markerLine.setShape( this.smallLineShape );
          this.topNumberDisplay.bottom = -this.smallHeight;
          this.bottomNumberDisplay.top = this.smallHeight;

          // text/line color
          this.markerLine.stroke = PRECISION_TEXT_COLOR;
          this.topNumberDisplay.setTextColor( PRECISION_TEXT_COLOR );
          this.bottomNumberDisplay.setTextColor( PRECISION_TEXT_COLOR );

          this.topNumberDisplay.setBackgroundColor( TRANSPARENT_COLOR );
          this.bottomNumberDisplay.setBackgroundColor( TRANSPARENT_COLOR );
        }
        else {

          // layout
          this.markerLine.setShape( this.largeLineShape );
          this.topNumberDisplay.bottom = -this.largeHeight;
          this.bottomNumberDisplay.top = this.largeHeight;

          // text color
          this.topNumberDisplay.setTextColor( this.marker.color );
          this.bottomNumberDisplay.setTextColor( this.marker.color );

          // font
          this.topNumberDisplay.setFont( LARGE_FONT );
          this.bottomNumberDisplay.setFont( LARGE_FONT );
        }

        // edit button
        this.topNumberDisplay.setEditButtonVisible( false );
        this.bottomNumberDisplay.setEditButtonVisible( false );

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
        this.markerLine.setShape( this.smallLineShape );
        this.topNumberDisplay.bottom = -this.smallHeight;
        this.bottomNumberDisplay.top = this.smallHeight;

        // edit button
        this.topNumberDisplay.setEditButtonVisible( true );
        this.bottomNumberDisplay.setEditButtonVisible( true );

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
      MovableNode.prototype.dispose.call( this );
    }

  } ); // inherit

} ); // define

