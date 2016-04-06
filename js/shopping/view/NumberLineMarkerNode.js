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
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var Util = require( 'DOT/Util' );

  // constants
  var TEXT_FONT = new PhetFont( 10 );
  var TEXT_MAX_WIDTH = 75;
  var TEXT_MARGIN = 8;

  // strings
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  /**
   * @param {Item} item
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineMarkerNode( item, options ) {

    options = _.extend( {
      lineHeight: 50,
      stroke: 'black',
      lineWidth: 1.25
    }, options || {} );

    this.item = item;

    // top label - cost
    var topFixed = Util.toFixed( (item.count * item.rate), 2 );
    var topString = currencySymbolString + topFixed.toString();
    var topTextNode = new Text( topString, {
      centerX: 0,
      centerY: -options.lineHeight / 2 - TEXT_MARGIN,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    // verticle line
    var markerNode = new Path( new Shape()
      .moveTo( 0, -options.lineHeight / 2 )
      .lineTo( 0,  options.lineHeight / 2 ), options );

    // bottom label - count | weight
    var bottomString = '';
    if( item.type === ItemData.RED_CANDY.type   || item.type === ItemData.YELLOW_CANDY.type ||
        item.type === ItemData.GREEN_CANDY.type || item.type === ItemData.BLUE_CANDY.type ) {
      bottomString = Util.toFixed( ( item.count * item.weight ), 1 ).toString();
    }
    else {
      bottomString = item.count.toString();
    }
    var bottomTextNode = new Text( bottomString, {
      centerX: 0,
      centerY: options.lineHeight / 2 + TEXT_MARGIN,
      font:TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ topTextNode, markerNode, bottomTextNode ];

    Node.call( this, options );
  }

  unitRates.register( 'NumberLineMarkerNode', NumberLineMarkerNode );

  return inherit( Node, NumberLineMarkerNode, {


  } ); // inherit

} ); // define

