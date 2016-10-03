// Copyright 2016, University of Colorado Boulder

/**
 * Node used to display a timer value. This class does no timing calculations itself, simply tacks on a time unit
 * string to a property value and displays it.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );

  // constants
  var DISPLAY_FONT = new PhetFont( 14 );
  var DISPLAY_SIZE = new Dimension2( 135, 45 );
  var DISPLAY_SPACING = 5;

  /**
   * @param {Object} [options]
   * @returns {Panel}
   * @private
   */
  function TimerDisplayNode( options ) {

    options = _.extend( {
      minWidth: DISPLAY_SIZE.width,
      minHeight: DISPLAY_SIZE.height,
      resize: false,
      cornerRadius: 5,
      lineWidth: 1.5,
      align: 'left',
      showTimeProperty: new Property( true ), // property used to toggle the display of the timer value or 'hiddenTimeText'
      hiddenTimeText: ''  // the text show when the timer value is hidden
    }, options );

    var self = this;

    // @public (read-write)
    this.displayValueProperty = new Property( 0.0 );

    // @private - all
    this.showTimeProperty = options.showTimeProperty;
    this.hiddenTimeText = options.hiddenTimeText;

    var contentNode = new Node();

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    this.showTimeButton = new ExpandCollapseButton( this.showTimeProperty, {
      sideLength: 15,
      touchAreaXDilation: 30,
      touchAreaYDilation: 30
    } );
    contentNode.addChild( this.showTimeButton );

    // @private - this indirectly is set via the displayValueProperty
    var timerText = new Text( '-', {
      left: this.showTimeButton.right + DISPLAY_SPACING,
      bottom: this.showTimeButton.bottom,
      font: DISPLAY_FONT,
      maxWidth: 0.6 * DISPLAY_SIZE.width,
      maxHeight: DISPLAY_SIZE.height
    } );
    contentNode.addChild( timerText );

    Panel.call( this, contentNode, options );

    // update timer text
    Property.multilink( [ this.displayValueProperty, this.showTimeProperty ], function( displayValue, showTime ) {
      if ( !showTime ) {
        timerText.setText( self.hiddenTimeText );
      }
      else {
        timerText.setText( displayValue + ' ' + hoursString );    // tack on the hours string
      }
    } );
  }

  unitRates.register( 'TimerDisplayNode', TimerDisplayNode );

  return inherit( Panel, TimerDisplayNode, {

    /**
     * Resets the node to it default
     * @public
     */
    reset: function() {
      this.showTimeProperty.reset();
    }

  } );  // inherit

} );  // define

