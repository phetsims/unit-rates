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
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  //var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var ChallengeQuestionAnswerNode = require( 'UNIT_RATES/common/view/ChallengeQuestionAnswerNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Property = require( 'AXON/Property' );

  // strings
  var challengesString = require( 'string!UNIT_RATES/Challenges' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  // constants
  var SPACING = 20;

  /**
   * @param {Challenges} challenges
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function ChallengesNode( challenges, keypad, options ) {

    //
    options = options || {};

    var self = this;

    this.challenges = challenges;
    this.keypad = keypad;

    this.contentNode = new Node();

    // refresh on item change
    this.challenges.itemDataProperty.link( function( itemData, oldItemData ) {
        self.contentNode.removeAllChildren();
        self.populate();
    } );

    this.expandedProperty = new Property( true );
    AccordionBox.call( this, this.contentNode, {
      expandedProperty: this.expandedProperty,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 15,
      titleNode: new Text( challengesString, { font: URConstants.PANEL_TITLE_FONT, maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'left',
      contentXMargin: 25,
      contentYMargin: 5
    } );

    this.mutate( options );
  }

  unitRates.register( 'ChallengesNode', ChallengesNode );

  return inherit( AccordionBox, ChallengesNode, {

    /**
     * Creates nodes for each item
     * @public
     */
    populate: function() {

      var self = this;

      var qna0 = this.challenges.getQuestionAnswer( 0 );
      var questionNode0 = new ChallengeQuestionAnswerNode( qna0, this.keypad, { } );
      this.contentNode.addChild( questionNode0  );

      var qna1 = this.challenges.getQuestionAnswer( 1 );
      var questionNode1 = new ChallengeQuestionAnswerNode( qna1, this.keypad, {
        top: questionNode0.bottom + SPACING
      } );
      this.contentNode.addChild( questionNode1  );

      var qna2 = this.challenges.getQuestionAnswer( 2 );
      var questionNode2 = new ChallengeQuestionAnswerNode( qna2, this.keypad, {
        top: questionNode1.bottom + SPACING
      } );
      this.contentNode.addChild( questionNode2  );

      var qna3 = this.challenges.getQuestionAnswer( 3 );
      var questionNode3 = new ChallengeQuestionAnswerNode( qna3, this.keypad, {
        top: questionNode2.bottom + SPACING
      } );
      this.contentNode.addChild( questionNode3  );
    },

    reset: function() {
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
