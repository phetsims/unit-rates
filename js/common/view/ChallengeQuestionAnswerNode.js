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
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var NumberDisplay = require( 'SCENERY_PHET/NumberDisplay' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  // constants
  var SPACING         = 5;
  var TEXT_FONT       = new PhetFont( 14 );
  var TEXT_MAX_WIDTH  = 125;
  var TEMP_EDIT_BUTTON_CONTENT  = new Text( 'E', { font: new PhetFont( 10 ), fontWeight: 'bold', maxWidth: 30 } );

  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );


  /**
   *
   * @param {ChallengeQuestionAnswer} challenge
   * @param {NumberKeypad} keypad
   * @param {Object} [options]
   * @constructor
   */
  function ChallengeQuestionAnswerNode( challenge, keypad, options ) {

    options = _.extend( {
    },  options || {} );
    assert && assert( !options.children, 'additional children not supported' );

    var self = this;

    this.keypad = keypad;
    this.valueProperty = challenge.valueProperty;

    this.challengeText = new Text( challenge.question, {
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );

    this.editButton = new RectangularPushButton( {
      top: this.challengeText.bottom + SPACING,
      content:TEMP_EDIT_BUTTON_CONTENT,
      baseColor: URConstants.EDIT_CONTROL_COLOR,
      pickable: true,
      listener: function() {
        self.showKeypadWithProperty( self.valueProperty );
      }
    } );

    //  NumberDisplay options
    var numberDisplayOptions = {
      left: this.editButton.right + SPACING,
      centerY: this.editButton.centerY,
      font: TEXT_FONT,
      xMargin: 5,
      yMargin: 2,
      decimalPlaces: 2,
      maxWidth: TEXT_MAX_WIDTH,
      numberFill: 'rgba(0,0,0,1)',
      backgroundStroke: 'rgba(0,0,0,1)',
      pickable: false
    };
    this.numberDisplay = new NumberDisplay( this.valueProperty, new Range( 0, 10), '',
      currencySymbolString + '{0}', numberDisplayOptions );

    options.children = [ this.editButton, this.challengeText, this.numberDisplay ];

    Node.call( this, options );
  }

  unitRates.register( 'ChallengeQuestionAnswerNode', ChallengeQuestionAnswerNode );

  return inherit( Node, ChallengeQuestionAnswerNode, {

    /**
     * Makes the keypad visible and links up it's built-in property to the update function
     * @protected
     */
    showKeypadWithProperty: function( itemProperty ) {
      var self = this;

      this.keypad.digitStringProperty.unlinkAll();
      this.keypad.visible = true;
      this.keypad.clear();
      this.keypad.digitStringProperty.link( function( value, oldValue ) {
        // check for bogus keypad values
        if( isNaN( value ) || !isFinite( value ) ) {
            value = 0;
        }
        itemProperty.value = value;
        //self.updateEditState();
      } );
    },

    /**
     * Hides the keypad and unlinks
     * @protected
     */
    hideKeypad: function() {
      this.keypad.visible = false;
      this.keypad.digitStringProperty.unlinkAll();
      this.keypad.digitStringProperty.value = 0;
    }

  } );  // define

} );  // inherit
