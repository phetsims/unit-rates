// Copyright 2016, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberKeypad = require( 'SCENERY_PHET/NumberKeypad' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var enterString = require( 'string!UNIT_RATES/enter' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function KeypadPanel( options ) {

    options = _.extend( {

      // KeypadPanel options
      valueString: '',
      decimalPointKey: true,

      // Panel options
      fill: 'rgb( 230, 230, 230 )',
      backgroundPickable: true,
      xMargin: 10,
      yMargin: 10,

      // RectangularPushButton options
      enterButtonListener: null
    }, options );

    var valueStringProperty = new Property( options.valueString );

    var valueNode = new Text( valueStringProperty.value, {
      font: new URFont( 16 )
    } );

    //TODO background should be sized to maximum value, with some margins
    var valueBackgroundNode = new Rectangle( 0, 0, 85, 30, {
      cornerRadius: 3,
      fill: 'white',
      stroke: 'black'
    } );

    var valueParent = new Node( {
      children: [ valueBackgroundNode, valueNode ]
    } );

    var keypadNode = new NumberKeypad( {
      decimalPointKey: options.decimalPointKey,
      validateKey: NumberKeypad.validateMaxDigits( { maxDigits: 4 } ),
      valueStringProperty: valueStringProperty
    } );

    var enterButton = new RectangularPushButton( {
      listener: options.enterButtonListener,
      baseColor: 'yellow',
      content: new Text( enterString, {
        font: new URFont( 16 ),
        fill: 'black'
      } )
    } );

    var contentNode = new VBox( {
      spacing: 10,
      align: 'center',
      children: [ valueParent, keypadNode, enterButton ]
    } );

    Panel.call( this, contentNode, options );

    valueStringProperty.link( function( valueString ) {
      valueNode.text = valueString;
      valueNode.center = valueBackgroundNode.center;
    } );

    // @public
    this.valueStringProperty = valueStringProperty;
  }

  unitRates.register( 'KeypadPanel', KeypadPanel );

  return inherit( Panel, KeypadPanel );
} );
