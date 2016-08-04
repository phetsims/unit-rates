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
  var ItemNode = require( 'UNIT_RATES/shopping/view/ItemNode' );
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

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  /**
   * @param {NumberLineItem} item
   * @param {Vector2} position - x,y position on the number line
   * @param {KeypadPanelNode} keypad - shared keypad
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineMarkerNode( item, position, keypad, options ) {

    options = _.extend( {
      topDecimalPlaces:     2,
      bottomDecimalPlaces:  1,
      lineWidth:            1.25,
      markerColor:          DEFAULT_LINE_COLOR
    }, options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    // @public (read-write)
    this.item   = item;
    this.keypad = keypad;
    this.markerColor = options.markerColor;
    this.outOfRangeProperty = new Property( false );

    // top label - cost
    var topPattern =  currencySymbolString + '{0} ';  // FIXME: see stringTest=long
    this.topNumberDisplay = new EditNumberDisplayNode( keypad, this.item.costQnA.valueProperty, topPattern, {
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
    var bottomPattern =  ' {0}  ';
    this.bottomNumberDisplay = new EditNumberDisplayNode( keypad, this.item.unitQnA.valueProperty, bottomPattern, {
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

    ItemNode.call( this, item, position, options );

    // check answers on user input
    this.qnaMultilink = Property.multilink( [ this.item.costQnA.valueProperty, this.item.unitQnA.valueProperty, this.item.outOfRangeProperty ],
      function( costProperty, unitProperty, outOfRangeProperty ) {
        self.checkEditable();
    } );
 }

  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( ItemNode, NumberLineMarkerNode, {

    /**
     * Changes various color/visibility attributes based on the edit state
     * @protected
     */
    checkEditable: function() {

      // non-editable/locked marker
      if ( !this.item.editableProperty.value ) {

        var isCandy = this.item.isCandy(); // candy precision is treated differently than fruit & produce
        var countPrecision = this.item.getCountPrecision();

        // fractional counts have different visual represenation than whole counts.
        if ( ( !isCandy && countPrecision >= 1 ) || ( isCandy && countPrecision >= 2 ) ) {

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
        if ( this.item.costQnA.isAnswerValid() ) {
           this.topNumberDisplay.setTextColor( this.item.outOfRangeProperty.value ? RANGE_TEXT_COLOR : DEFAULT_TEXT_COLOR );
        }
        else {
          this.topNumberDisplay.setTextColor( TRANSPARENT_COLOR );
        }

        if ( this.item.unitQnA.isAnswerValid() ) {
          this.bottomNumberDisplay.setTextColor( this.item.outOfRangeProperty.value ? RANGE_TEXT_COLOR : DEFAULT_TEXT_COLOR );
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
      ItemNode.prototype.dispose.call( this );
    }

  } ); // inherit

} ); // define

