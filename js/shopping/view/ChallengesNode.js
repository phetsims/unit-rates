// Copyright 2002-2016, University of Colorado Boulder

/**
 * A node containing all the challenge Q&A's nodes in a collapsable box
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var ChallengeQuestionAnswerNode = require( 'UNIT_RATES/common/view/ChallengeQuestionAnswerNode' );
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Image = require( 'SCENERY/nodes/Image' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Property = require( 'AXON/Property' );

  // strings
  var challengesString = require( 'string!UNIT_RATES/challenges' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  // images
  var refreshButtonImage = require( 'image!UNIT_RATES/refresh-button.png' );

  // constants
  var VERTICAL_SPACING    = 20;

  /**
   * @param {Challenges} challenges - the challenges model
   * @param {NumberKeypad} keypad - shared keypad
   * @param {number} fixedWidth - the fixed width of the node
   * @param {function} onPopulateCallback - called everytime the Node is populated
   * @param {Object} [options]
   * @constructor
   */
  function ChallengesNode( challenges, keypad, fixedWidth, onPopulateCallback, options ) {

    options = _.extend( {
    },  options || {} );

    var self = this;

    this.challenges = challenges;
    this.keypad = keypad;
    this.fixedWidth = fixedWidth;
    this.onPopulateCallback = onPopulateCallback;

    this.contentNode = new Node();

    // refresh on item change
    this.challenges.itemDataProperty.link( function( itemData, oldItemData ) {
        self.removeAllContent();
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
      contentAlign: 'center',
      contentXMargin: 0,
      contentYMargin: 10
    } );

    this.mutate( options );
  }

  unitRates.register( 'ChallengesNode', ChallengesNode );

  return inherit( AccordionBox, ChallengesNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Creates the questions and answer nodes for all challenge questions
     * @public
     */
    populate: function() {

      var self = this;

      // layout adjustment
      var strut = new HStrut( this.fixedWidth );
      this.contentNode.addChild( strut );

      // Create the 1st question (which is always what is the Unit Rate?)
      var qna0 = this.challenges.getQuestionAnswer( 0 );
      var questionNode0 = new ChallengeQuestionAnswerNode( qna0, this.keypad, {
        centerX: strut.centerX,
        top: VERTICAL_SPACING,
        preValueString: currencySymbolString,
        decimalPlaces: 2,
        showUnitText: true,
        correctTextColor:  ShoppingConstants.UNIT_RATE_CORRECT_PROMPT_COLOR
      } );
      this.contentNode.addChild( questionNode0  );

      // 2nd question
      var qna1 = this.challenges.getQuestionAnswer( 1 );
      var questionNode1 = new ChallengeQuestionAnswerNode( qna1, this.keypad, {
        centerX: strut.centerX,
        top: questionNode0.bottom + VERTICAL_SPACING,
        preValueString: currencySymbolString,
        decimalPlaces: 2,
        correctTextColor:  ShoppingConstants.DEFAULT_CORRECT_PROMPT_COLOR
      } );
      this.contentNode.addChild( questionNode1  );

      // 3rd question
      var qna2 = this.challenges.getQuestionAnswer( 2 );
      var questionNode2 = new ChallengeQuestionAnswerNode( qna2, this.keypad, {
        centerX: strut.centerX,
        top: questionNode1.bottom + VERTICAL_SPACING,
        preValueString: currencySymbolString,
        decimalPlaces: 2,
        correctTextColor:  ShoppingConstants.DEFAULT_CORRECT_PROMPT_COLOR
      } );
      this.contentNode.addChild( questionNode2  );

      // 4th. question - note: this question is formatted differently if the item type is candy.
      var itemType = this.challenges.itemDataProperty.value.type;
      var isCandy  =  ( itemType === ItemData.RED_CANDY.type   || itemType === ItemData.YELLOW_CANDY.type ||
                        itemType === ItemData.GREEN_CANDY.type || itemType === ItemData.BLUE_CANDY.type );
      var preValueString  = ( isCandy ? currencySymbolString : '  ' );
      var postValueString = ( isCandy ? '' : '    ' );
      var decimalPlaces   = ( isCandy ? 2 :  0 );

      var qna3 = this.challenges.getQuestionAnswer( 3 );
      var questionNode3 = new ChallengeQuestionAnswerNode( qna3, this.keypad, {
        centerX: strut.centerX,
        top: questionNode2.bottom + VERTICAL_SPACING,
        preValueString: preValueString,
        decimalPlaces: decimalPlaces,
        postValueString: postValueString,
        correctTextColor:  ShoppingConstants.DEFAULT_CORRECT_PROMPT_COLOR
      } );
      this.contentNode.addChild( questionNode3  );

      // @private - refresh questions button
      var refreshButtonNode = new RectangularPushButton( {
        right:  this.contentNode.right - 8,
        top: questionNode3.bottom + 2,
        baseColor: URConstants.DEFAULT_BUTTON_COLOR,
        content: new Image( refreshButtonImage, { scale: 0.25 } ),
        listener: function() {
          self.removeAllContent();
          self.challenges.refresh(); // update the model
          self.populate();
        }
      } );
      this.contentNode.addChild( refreshButtonNode );

      if( this.onPopulateCallback ) {
        this.onPopulateCallback.call();
      }
    },

    /**
     * @protected
     */
    removeAllContent: function() {
      this.contentNode.getChildren().forEach( function( child ) {
        if ( child.dispose ) {
          if( child instanceof RectangularPushButton ) {
            !assert && child.dispose();  // SUN buttons dispose fails when assertions are enabled - see sun/#212
          }
          else {
            child.dispose();
          }
        }
      } );
      this.contentNode.removeAllChildren();
    },

    /**
     * Resets the challenges questions to all unanswered
     * @public
     */
    reset: function() {
      this.expandedProperty.reset();
      this.removeAllContent();
      this.populate();
    }

  } );  // define

} );  // inherit
