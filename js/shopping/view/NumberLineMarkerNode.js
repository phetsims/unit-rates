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
  var Shape = require( 'KITE/Shape' );
  var Property = require( 'AXON/Property' );

  // constants
  var LINE_HEIGHT           = 35;
  var EDIT_LINE_HEIGHT      = 18;
  var EDIT_BUTTON_MARGIN    = 5;
  var DEFAULT_TEXT_COLOR    = 'rgba(0,0,0,1)';
  var DEFAULT_BORDER_COLOR  = 'rgba(0,0,0,0)';
  var ZERO_TEXT_COLOR       = 'rgba(0,0,0,0)';
  var EDIT_BORDER_COLOR     = 'rgba(0,0,0,1)';

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
      lineWidth: 1.25
    }, options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    // @public (readwrite)
    this.item   = item;
    this.keypad = keypad;

    // top label - cost
    var topPattern =  currencySymbolString + '{0}';
    this.topNumberDisplay = new EditNumberDisplayNode( keypad, this.item.costQnA.valueProperty, topPattern, {
        centerX: -2,
        bottom: -EDIT_LINE_HEIGHT,
        decimalPlaces: 2,
        buttonPosition: 'top',
        buttonSpacing: EDIT_BUTTON_MARGIN,
        textColor: DEFAULT_TEXT_COLOR,
        borderColor: DEFAULT_BORDER_COLOR
    } );

    this.smallLineShape = new Shape()
      .moveTo( 0, -EDIT_LINE_HEIGHT )
      .lineTo( 0,  EDIT_LINE_HEIGHT );
    this.largeLineShape = new Shape()
      .moveTo( 0, -LINE_HEIGHT )
      .lineTo( 0,  LINE_HEIGHT );

    this.markerLine = new Path( this.smallLineShape, {
        centerX: 0,
        centerY: 0,
        stroke: 'black',
        lineWidth: options.lineWidth,
        pickable: false
      } );

    // bottom label - unit
    var bottomPattern =  ' {0}  ';
    this.bottomNumberDisplay = new EditNumberDisplayNode( keypad, this.item.unitQnA.valueProperty, bottomPattern, {
        centerX: -2,
        top: EDIT_LINE_HEIGHT,
        decimalPlaces: 1,
        buttonPosition: 'bottom',
        buttonSpacing: EDIT_BUTTON_MARGIN,
        textColor: DEFAULT_TEXT_COLOR,
        borderColor: DEFAULT_BORDER_COLOR
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

        //var countPrecision = this.getPrecision( this.item.count );
        //this.markerLine.stroke = 'gray';

        // layout
        this.markerLine.setShape(this.largeLineShape);
        this.topNumberDisplay.bottom  = -LINE_HEIGHT;
        this.bottomNumberDisplay.top  =  LINE_HEIGHT;

        // edit button
        this.topNumberDisplay.hideEditButton();
        this.bottomNumberDisplay.hideEditButton();

        // text color
        this.topNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );
        this.bottomNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );

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
          this.topNumberDisplay.setTextColor( ZERO_TEXT_COLOR );
        }
        else {
          this.topNumberDisplay.setTextColor( DEFAULT_TEXT_COLOR );
        }

        if( this.item.unitQnA.isAnswerZero() ) {
          this.bottomNumberDisplay.setTextColor( ZERO_TEXT_COLOR );
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

