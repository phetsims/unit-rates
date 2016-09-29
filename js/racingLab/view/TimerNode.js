// Copyright 2002-2016, University of Colorado Boulder

/**
 * Displays the scale and any items that were added to it. Also displays the cost for all items (& weight for candy).
 * The 'top' portion of the scale is also considered a 'drop-zone' for items being dragged from the shelf.
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ExpandCollapseButton = require( 'SUN/ExpandCollapseButton' );
  var Panel = require( 'SUN/Panel' );
  var Property = require( 'AXON/Property' );
  var Dimension2 = require( 'DOT/Dimension2' );

  // constants
  var DISPLAY_FONT    = new PhetFont( 14 );
  var DISPLAY_SIZE    = new Dimension2( 135, 45 );
  var DISPLAY_SPACING = 5;

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );

  /**
   * Node used to display an elapsed time (i.e. hours), in a 'collapsable' panel
   * @param {Property.<number>} elapsedTimeProperty
   * @param {Property.<boolean>} disabledProperty
   * @param {Object} [options]
   * @returns {Panel}
   * @private
   */
  function TimerNode( elapsedTimeProperty, disabledProperty, options ) {

    options = _.extend( {
      minWidth:         DISPLAY_SIZE.width,
      minHeight:        DISPLAY_SIZE.height,
      resize:           false,
      cornerRadius:     5,
      lineWidth:        1.5,
      align:            'left',
      showTimeProperty: new Property( true ),
      hiddenTimeText:   ''
    }, options || {} );

    var self = this;

    // @public (read-write)
    this.displayValueProperty    = new Property( 0.0 );

    // @private - all
    this.showTimeProperty = options.showTimeProperty;
    this.hiddenTimeText   = options.hiddenTimeText;
    this.disabledProperty = disabledProperty;

    var contentNode = new Node();

    this.showTimeButton = new ExpandCollapseButton( this.showTimeProperty, {
      sideLength:         15,
      touchAreaXDilation: 30,
      touchAreaYDilation: 30
    } );
    contentNode.addChild( this.showTimeButton );

    // @private
    var timerText = new Text( '-', {
      left:     this.showTimeButton.right + DISPLAY_SPACING,
      bottom:   this.showTimeButton.bottom,
      font:     DISPLAY_FONT,
      maxWidth: 0.6 * DISPLAY_SIZE.width,
      maxHeight: DISPLAY_SIZE.height
    } );
    contentNode.addChild( timerText );

    Panel.call( this, contentNode, options);

    // update timer text
    Property.multilink( [ this.displayValueProperty, this.showTimeProperty ], function( displayValue, showTime ) {

      if( !showTime ) {
        timerText.setText( self.hiddenTimeText );
      } else {
        timerText.setText( displayValue + ' ' + hoursString );    // tack on the hours string
      }
    } );
  }

  unitRates.register( 'TimerNode', TimerNode );

  return inherit( Panel, TimerNode, {

    /**
     * Resets the node to it default
     * @public
     */
    reset: function() {
      this.hideTimeProperty.reset();
    }

  } );  // inherit

} );  // define

