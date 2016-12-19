// Copyright 2016, University of Colorado Boulder

/**
 * A node containing all the challenge Q&A's nodes in a collapsible box
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  
  // sim modules
  var OLDChallengeQuestionAnswerNode = require( 'UNIT_RATES/old/common/shopping/view/OLDChallengeQuestionAnswerNode' );
  var OLDItemData = require( 'UNIT_RATES/old/common/shopping/model/OLDItemData' );
  var OLDURConstants = require( 'UNIT_RATES/old/common/OLDURConstants' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  
  // strings
  var challengesString = require( 'string!UNIT_RATES/challenges' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );

  // constants
  var VERTICAL_SPACING = 20;

  /**
   * @param {Challenges} challenges - the challenges model
   * @param {NumberKeypad} keypad - shared keypad
   * @param {number} fixedWidth - the fixed width of the node
   * @param {function()} onPopulateCallback - called every time the Node is populated
   * @param {Object} [options]
   * @constructor
   */
  function OLDChallengesNode( challenges, keypad, fixedWidth, onPopulateCallback, options ) {

    var self = this;

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
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
      titleNode: new Text( challengesString, { font: OLDURConstants.PANEL_TITLE_FONT, maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'center',
      contentXMargin: 0,
      contentYMargin: 10
    } );

    //TODO these options should be passed via AccordionBox.call
    this.mutate( options );
  }

  unitRates.register( 'OLDChallengesNode', OLDChallengesNode );

  return inherit( AccordionBox, OLDChallengesNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Creates the questions and answer nodes for all challenge questions
     *
     * @public
     */
    populate: function() {

      var self = this;

      // layout adjustment
      var strut = new HStrut( this.fixedWidth );
      this.contentNode.addChild( strut );

      // Create the 1st question (which is always what is the Unit Rate?)
      var qna0 = this.challenges.getQuestionAnswer( 0 );
      var questionNode0 = new OLDChallengeQuestionAnswerNode( qna0, this.keypad, {
        centerX: strut.centerX,
        top: VERTICAL_SPACING,
        preValueString: currencySymbolString,
        decimalPlaces: 2,
        showUnitText: true,
        correctTextColor: OLDURConstants.UNIT_RATE_CORRECT_PROMPT_COLOR
      } );
      this.contentNode.addChild( questionNode0 );

      // 2nd question
      var qna1 = this.challenges.getQuestionAnswer( 1 );
      var questionNode1 = new OLDChallengeQuestionAnswerNode( qna1, this.keypad, {
        centerX: strut.centerX,
        top: questionNode0.bottom + VERTICAL_SPACING,
        preValueString: currencySymbolString,
        decimalPlaces: 2,
        correctTextColor: OLDURConstants.DEFAULT_CORRECT_PROMPT_COLOR
      } );
      this.contentNode.addChild( questionNode1 );

      // 3rd question
      var qna2 = this.challenges.getQuestionAnswer( 2 );
      var questionNode2 = new OLDChallengeQuestionAnswerNode( qna2, this.keypad, {
        centerX: strut.centerX,
        top: questionNode1.bottom + VERTICAL_SPACING,
        preValueString: currencySymbolString,
        decimalPlaces: 2,
        correctTextColor: OLDURConstants.DEFAULT_CORRECT_PROMPT_COLOR
      } );
      this.contentNode.addChild( questionNode2 );

      // 4th. question - note: this question is formatted differently if the item type is candy.
      var itemType = this.challenges.itemDataProperty.value.type;
      var isCandy = ( itemType === OLDItemData.RED_CANDY.type || itemType === OLDItemData.PURPLE_CANDY.type ||
                      itemType === OLDItemData.GREEN_CANDY.type || itemType === OLDItemData.BLUE_CANDY.type );
      var preValueString = ( isCandy ? currencySymbolString : '  ' );
      var postValueString = ( isCandy ? '' : '    ' );
      var decimalPlaces = ( isCandy ? 2 : 0 );

      var qna3 = this.challenges.getQuestionAnswer( 3 );
      var questionNode3 = new OLDChallengeQuestionAnswerNode( qna3, this.keypad, {
        centerX: strut.centerX,
        top: questionNode2.bottom + VERTICAL_SPACING,
        preValueString: preValueString,
        decimalPlaces: decimalPlaces,
        postValueString: postValueString,
        correctTextColor: OLDURConstants.DEFAULT_CORRECT_PROMPT_COLOR
      } );
      this.contentNode.addChild( questionNode3 );

      // @private - refresh questions button
      var refreshButtonNode = new RectangularPushButton( {
        right: this.contentNode.right - 8,
        top: questionNode3.bottom + 2,
        baseColor: '#f2f2f2',
        content: new FontAwesomeNode( 'refresh', { scale: 0.38 } ),
        listener: function() {
          self.removeAllContent();
          self.challenges.refresh(); // update the model
          self.populate();
        }
      } );
      this.contentNode.addChild( refreshButtonNode );

      if ( this.onPopulateCallback ) {
        this.onPopulateCallback.call();
      }
    },

    /**
     * TODO document this
     *
     * @protected
     */
    removeAllContent: function() {
      this.contentNode.getChildren().forEach( function( child ) {
        if ( child.dispose ) {
          if ( child instanceof RectangularPushButton ) {
            !assert && child.dispose();  // SUN buttons dispose fails when assertions are enabled - see sun/#212
          }
          else {
            child.dispose();
          }
        }
      } );
      this.contentNode.removeAllChildren();
    },

    // @public
    reset: function() {
      this.expandedProperty.reset();
      this.removeAllContent();
      this.populate();
    }

  } );  // define

} );  // inherit