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
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var VERICAL_SPACING = 5;
  var HORIZONTAL_SPACING = 25;
  var TEXT_FONT       = new PhetFont( 12 );
  var TEXT_MAX_WIDTH  = 125;

  /**
   *
   * @param {ChallengeQuestionAnswer} qna
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeQuestionAnswerNode( qna, keypad, options ) {

    options = _.extend( {
      preValueString: '',
      postValueString: '',
      decimalPlaces: 2
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    this.qna = qna;
    this.keypad = keypad;

    var challengeText = new Text( this.qna.question, {
      left: 0,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    var pattern = options.preValueString + '{0}' + options.postValueString;
    this.editNumberDisplay = new AnswerNumberDisplayNode( keypad, this.qna.valueProperty,
      this.qna.answer, pattern, {
        centerX: challengeText.centerX - HORIZONTAL_SPACING,
        top: challengeText.bottom + VERICAL_SPACING,
        decimalPlaces: options.decimalPlaces,
        buttonSpacing: HORIZONTAL_SPACING
    } );

   var children = [ challengeText, this.editNumberDisplay ];

    if( qna.unit !== null ) {

      // line
      var divisorLine = new Path( new Shape()
          .moveTo( this.editNumberDisplay.numberDisplay.left - 10, this.editNumberDisplay.bottom + VERICAL_SPACING )
          .lineTo( this.editNumberDisplay.numberDisplay.right + 10, this.editNumberDisplay.bottom + VERICAL_SPACING ), {
        stroke: 'black',
        lineWidth: 1.25
      } );
      children.push( divisorLine );

      // unit label
      var unitText = new Text( this.qna.unit, {
        centerX: this.editNumberDisplay.numberDisplay.centerX,
        top: divisorLine.bottom + VERICAL_SPACING,
        font: TEXT_FONT,
        maxWidth: TEXT_MAX_WIDTH
      } );

      children.push( unitText );
    }

    options.children = children;

    Node.call( this, options );
  }

  unitRates.register( 'ChallengeQuestionAnswerNode', ChallengeQuestionAnswerNode );

  return inherit( Node, ChallengeQuestionAnswerNode, {

  } );  // define

} );  // inherit
