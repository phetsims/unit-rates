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
  var AnswerNumberDisplayNode = require( 'UNIT_RATES/common/view/AnswerNumberDisplayNode' );
  var ItemNode = require( 'UNIT_RATES/shopping/view/ItemNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var EDIT_TEXT_MARGIN  = 5;

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
      lineHeight: 50,
      stroke: 'black',
      lineWidth: 1.25
    }, options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    // @public (readwrite)
    this.item   = item;
    this.keypad = keypad;

    // top label - cost
    var topPattern =  currencySymbolString + '{0}';
    this.topNumberDisplay = new AnswerNumberDisplayNode( keypad, this.item.costQnA, topPattern, {
        centerX: -2,
        bottom: -options.lineHeight / 2 - EDIT_TEXT_MARGIN,
        decimalPlaces: 2,
        buttonPosition: 'top',
        buttonSpacing: EDIT_TEXT_MARGIN
    } );

    var markerLine = new Path( new Shape()
      .moveTo( 0, -options.lineHeight / 2 )
      .lineTo( 0,  options.lineHeight / 2 ), {
        centerX: 0,
        centerY: 0,
        stroke: options.stroke,
        lineWidth: options.lineWidth,
        pickable: false
      } );

    // bottom label - unit
    var bottomPattern =  '{0}';
    this.bottomNumberDisplay = new AnswerNumberDisplayNode( keypad, this.item.unitQnA, bottomPattern, {
        centerX: -2,
        top: options.lineHeight / 2 + EDIT_TEXT_MARGIN,
        decimalPlaces: 1,
        buttonPosition: 'bottom',
        buttonSpacing: EDIT_TEXT_MARGIN
    } );

    // add all child nodes
    options.children = [ this.topNumberDisplay,  markerLine,  this.bottomNumberDisplay ];

    ItemNode.call( this, item, position, options );
 }

  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( ItemNode, NumberLineMarkerNode, {

    // @public
    dispose: function() {
    }

  } ); // inherit

} ); // define

