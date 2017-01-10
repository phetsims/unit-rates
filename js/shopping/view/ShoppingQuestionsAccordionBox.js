// Copyright 2016, University of Colorado Boulder

/**
 * Displays questions in an accordion box, with a refresh button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // sim modules
  var FontAwesomeButton = require( 'UNIT_RATES/common/view/FontAwesomeButton' );
  var ShoppingQuestionNode = require( 'UNIT_RATES/shopping/view/ShoppingQuestionNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URColors = require( 'UNIT_RATES/common/URColors' );
  var URFont = require( 'UNIT_RATES/common/URFont' );

  // strings
  var questionsString = require( 'string!UNIT_RATES/questions' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Node} keypadLayer
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingQuestionsAccordionBox( shoppingItem, keypadLayer, options ) {

    options = _.extend( {

      // AccordionBox options
      expandedProperty: new Property( true ),
      titleNode: new Text( questionsString, { font: new URFont( 18 ), maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 10,
      buttonTouchAreaXDilation: 5,
      buttonTouchAreaYDilation: 5,

      // VBox options
      contentYSpacing: 18, // vertical spacing between UI elements in the accordion box's content
      contentAlign: 'right' // alignment of UI elements in the accordion box's content

    }, options );

    var self = this;

    // 'Unit Rate?' question
    var unitRateQuestionNode = new ShoppingQuestionNode( shoppingItem.unitRateQuestion, this, keypadLayer, {
      denominatorVisible: true
    } );

    // Below the 'Unit Rate?' question is a set of questions that change when the refresh button is pressed.
    var questionsParent = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing
    } );
    var questionSetObserver = function( questionSet ) {

      // remove previous questions
      questionsParent.removeAllChildren();

      // add new questions
      var questionNodes = [];
      for ( var i = 0; i < questionSet.length; i++ ) {
        questionNodes.push( new ShoppingQuestionNode( questionSet[ i ], self, keypadLayer ) );
      }
      questionsParent.setChildren( questionNodes );
    };
    shoppingItem.questionSetProperty.link( questionSetObserver );

    // Refresh button, advances to the next question set
    var refreshButton = new FontAwesomeButton( 'refresh', {
      iconScale: 0.5,
      baseColor: URColors.refreshButton,
      listener: function() {
        shoppingItem.nextQuestionSet();
      }
    } );
    refreshButton.touchArea = refreshButton.localBounds.dilatedXY( 5, 5 );

    //TODO next/previous buttons - delete this if AR doesn't like this proposed change
    // var HBox = require( 'SCENERY/nodes/HBox' );
    // var Path = require( 'SCENERY/nodes/Path' );
    // var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
    // var Shape = require( 'KITE/Shape' );
    // var rightArrowShape = new Shape()
    //   .moveTo( 0, 0 )
    //   .lineTo( 10, 10 )
    //   .lineTo( 0, 20 );
    // var rightArrowNode = new Path( rightArrowShape, {
    //   scale: 0.8,
    //   stroke: 'black',
    //   lineWidth: 2
    // } );
    // var nextButton = new RectangularPushButton( {
    //   xMargin: 12,
    //   yMargin: 8,
    //   baseColor: URColors.refreshButton,
    //   content: rightArrowNode
    // } );
    // var leftArrowShape = new Shape()
    //   .moveTo( 0, 0 )
    //   .lineTo( -10, 10 )
    //   .lineTo( 0, 20 );
    // var leftArrowNode = new Path( leftArrowShape, {
    //   scale: 0.8,
    //   stroke: 'black',
    //   lineWidth: 2
    // } );
    // var previousButton = new RectangularPushButton( {
    //   xMargin: 12,
    //   yMargin: 8,
    //   baseColor: URColors.refreshButton,
    //   content: leftArrowNode
    // } );
    // var buttonsParent = new HBox( {
    //   spacing: 5,
    //   children: [ previousButton, nextButton ]
    // });

    // AccordionBox content
    var contentNode = new VBox( {
      align: options.contentAlign,
      spacing: options.contentYSpacing,
      children: [
        unitRateQuestionNode,
        questionsParent,
        refreshButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );

    // @private cleanup that's specific to this Node
    this.disposeShoppingQuestionsAccordionBox = function() {
      shoppingItem.questionSetProperty.unlink( questionSetObserver );
      unitRateQuestionNode.dispose();
      questionsParent.getChildren().forEach( function( child ) {
        assert && assert( child instanceof ShoppingQuestionNode );
        child.dispose();
      } );
    };
  }

  unitRates.register( 'ShoppingQuestionsAccordionBox', ShoppingQuestionsAccordionBox );

  return inherit( AccordionBox, ShoppingQuestionsAccordionBox, {

    dispose: function() {
      AccordionBox.prototype.dispose.call( this );
      this.disposeShoppingQuestionsAccordionBox();
    }
  } );
} );
