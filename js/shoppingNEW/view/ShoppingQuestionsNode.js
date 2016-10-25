// Copyright 2016, University of Colorado Boulder

/**
 * Displays challenges for a ShoppingItem.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var currencyValueString = require( 'string!UNIT_RATES/currencyValue' );

  // constants
  var QUESTION_TEXT_OPTIONS = {
    font: new URFont( 18 )
  };

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionsNode( shoppingItem, options ) {

    options = _.extend( {
      spacing: 25,
      align: 'center'
    }, options );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [];

    //TODO temporary placeholder
    options.children.push( new Text( toCurrency( shoppingItem.unitRate ), QUESTION_TEXT_OPTIONS ) );

    var questionsParent = new Node();
    options.children.push( questionsParent );

    options.children.push( new HStrut( 175 ) ); //TODO temporary solution for uniform width

    //TODO temporary placeholder
    shoppingItem.questionsProperty.link( function( questions ) {
      questionsParent.removeAllChildren();
      var questionNodes = [];
      questions.forEach( function( value ) {
        questionNodes.push( new Text( toCurrency( value ), QUESTION_TEXT_OPTIONS ) );
      } );
      questionsParent.addChild( new VBox( {
        align: 'center',
        spacing: 25,
        children: questionNodes
      } ) );
    } );

    VBox.call( this, options );
  }

  unitRates.register( 'ShoppingQuestionsNode', ShoppingQuestionsNode );

  /**
   * Converts a number to a currency string.
   * @param {number} value
   * @returns {*|string}
   */
  function toCurrency( value ) {
    return StringUtils.format( currencyValueString, Util.toFixed( value, 2 ) );
  }

  return inherit( VBox, ShoppingQuestionsNode );
} );