// Copyright 2016, University of Colorado Boulder

/**
 * Displays questions for a ShoppingItem.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var QuestionAndAnswerNode = require( 'UNIT_RATES/shoppingNEW/view/QuestionAndAnswerNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var costOfNItemsString = require( 'string!UNIT_RATES/costOfNItems' );
  var unitRateQuestionString = require( 'string!UNIT_RATES/unitRateQuestion' );
  var valueUnitsString = require( 'string!UNIT_RATES/valueUnits' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionsNode( shoppingItem, options ) {

    options = _.extend( {
      align: 'center',
      spacing: 15
    }, options );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [];

    // 'Unit Rate?' question is at the top.
    var unitRateNode = new QuestionAndAnswerNode(
      unitRateQuestionString,
      shoppingItem.unitRate,
      StringUtils.format( valueUnitsString, 1, shoppingItem.singularName ), {
        denominatorVisible: true
      } );
    options.children.push( unitRateNode );

    // Below the 'Unit Rate?' questions is a set of questions that can be updated dynamically.
    var questionsParent = new Node();
    options.children.push( questionsParent );
    shoppingItem.questionsProperty.link( function( questions ) {

      questionsParent.removeAllChildren();

      var questionNodes = [];
      questions.forEach( function( numberOfItems ) {
        var units = ( numberOfItems > 1 ? shoppingItem.pluralName : shoppingItem.singularName );
        var questionString = StringUtils.format( costOfNItemsString, numberOfItems, units );
        var denominatorString = StringUtils.format( valueUnitsString, numberOfItems, units );
        var answer = numberOfItems * shoppingItem.unitRate;
        questionNodes.push( new QuestionAndAnswerNode( questionString, answer, denominatorString ) );
      } );

      questionsParent.addChild( new VBox( {
        children: questionNodes,
        align: options.align,
        spacing: options.spacing
      } ) );
    } );

    VBox.call( this, options );
  }

  unitRates.register( 'ShoppingQuestionsNode', ShoppingQuestionsNode );

  return inherit( VBox, ShoppingQuestionsNode );
} );