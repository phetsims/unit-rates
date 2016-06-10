// Copyright 2002-2016, University of Colorado Boulder

/**
 *
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
  var PRECISION_TEXT_COLOR  = 'rgba(128,128,128,1)';
  var DEFAULT_TEXT_COLOR    = 'rgba(0,0,0,1)';
  var DEFAULT_BORDER_COLOR  = 'rgba(0,0,0,0)';
  var TRANSPARENT_COLOR     = 'rgba(0,0,0,0)';
  var LARGE_FONT            = new PhetFont( 11 );
  var SMALL_FONT            = new PhetFont( 9 );

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  /**
   * @param {Item} item
   * @param {Vector2} position - x,y position on the number line
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineMarkerNode( item, position, keypad, options ) {

    options = _.extend( {
      topDecimalPlaces:     2,
      bottomDecimalPlaces:  1,
      lineWidth:            1.25
    }, options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    // @public (readwrite)
    this.item   = item;
    this.keypad = keypad;

    // top label - cost
    var topPattern =  currencySymbolString + '{0} ';
    this.topNumberDisplay = new EditNumberDisplayNode( keypad, this.item.costQnA.valueProperty, topPattern, {
        centerX: -2,
        bottom: -SMALL_LINE_HEIGHT,
        decimalPlaces: options.topDecimalPlaces,
        buttonPosition: 'top',
        buttonSpacing: EDIT_BUTTON_MARGIN,
        textColor: DEFAULT_TEXT_COLOR,
        borderColor: EDIT_BORDER_COLOR,
        font: SMALL_FONT
    } );

    this.smallLineShape = new Shape()
      .moveTo( 0, -SMALL_LINE_HEIGHT )
      .lineTo( 0,  SMALL_LINE_HEIGHT );
    this.largeLineShape = new Shape()
      .moveTo( 0, -LARGE_LINE_HEIGHT )
      .lineTo( 0,  LARGE_LINE_HEIGHT );

    this.markerLine = new Path( this.smallLineShape, {
        centerX: 0,
        centerY: 0,
        stroke: DEFAULT_TEXT_COLOR,
        lineWidth: options.lineWidth,
        pickable: false
      } );

    // bottom label - unit
    var bottomPattern =  ' {0}  ';
    this.bottomNumberDisplay = new EditNumberDisplayNode( keypad, this.item.unitQnA.valueProperty, bottomPattern, {
        centerX: -2,
        top: SMALL_LINE_HEIGHT,
        decimalPlaces: options.bottomDecimalPlaces,
        buttonPosition: 'bottom',
        buttonSpacing: EDIT_BUTTON_MARGIN,
        textColor: DEFAULT_TEXT_COLOR,
        borderColor: EDIT_BORDER_COLOR,
        font: SMALL_FONT
    } );

    // add all child nodes
    options.children = [ this.topNumberDisplay, this.markerLine, this.bottomNumberDisplay ];

    ItemNode.call( this, item, position, options );

    // check answers on user input
    Property.multilink( [ this.item.costQnA.valueProperty, this.item.unitQnA.valueProperty ],
      function( costProperty, unitProperty ) {
        self.checkEditable();
    } );

 }

  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( ItemNode, NumberLineMarkerNode, {

    /**
     * Changes various color/visibility attributes based on edit state
     * @protected
     */
    checkEditable: function() {

      if( !this.item.editable ) {

        var countPrecision = this.getPrecision( this.item.count );
        var isCandy = this.item.isCandy();
        if( ( !isCandy && countPrecision >= 1 ) || ( isCandy && countPrecision >= 2 ) ) {

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
          this.topNumberDisplay.bottom  = -LARGE_LINE_HEIGHT;
          this.bottomNumberDisplay.top  =  LARGE_LINE_HEIGHT;

          // text color
          this.topNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );
          this.bottomNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );

          // font
          this.topNumberDisplay.setFont( LARGE_FONT );
          this.bottomNumberDisplay.setFont( LARGE_FONT );
        }

        // edit button
        this.topNumberDisplay.hideEditButton();
        this.bottomNumberDisplay.hideEditButton();

        // border color
        this.topNumberDisplay.setBorderColor( DEFAULT_BORDER_COLOR );
        this.bottomNumberDisplay.setBorderColor( DEFAULT_BORDER_COLOR );
      }
      else {
        // edit button
        this.topNumberDisplay.showEditButton();
        this.bottomNumberDisplay.showEditButton();

        // text color
        if( this.item.costQnA.isAnswerZero() ) {
          this.topNumberDisplay.setTextColor( TRANSPARENT_COLOR );
        }
        else {
          this.topNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );
        }

        if( this.item.unitQnA.isAnswerZero() ) {
          this.bottomNumberDisplay.setTextColor( TRANSPARENT_COLOR );
        }
        else {
          this.bottomNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );
        }

        // border color
        if( !this.topNumberDisplay.hasKeypadFocus ) {
          this.topNumberDisplay.setBorderColor( EDIT_BORDER_COLOR );
        }
        if( !this.bottomNumberDisplay.hasKeypadFocus ) {
          this.bottomNumberDisplay.setBorderColor( EDIT_BORDER_COLOR );
        }
      }
    },

    /**
     *
     * @return {number}
     * @protected
     */
    getPrecision: function( value ) {

      if ( !isFinite( value ) ) {
        return 0;
      }

      var e = 1;
      var p = 0;
      while ( Math.round( value * e ) / e !== value ) {
        e *= 10; p++;
      }
      return p;
    },

    // @public
    dispose: function() {
    }

  } ); // inherit

} ); // define

