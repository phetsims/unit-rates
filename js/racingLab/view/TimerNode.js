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
  var Util = require( 'DOT/Util' );


  // constants
  var DISPLAY_FONT    = new PhetFont( 14 );
  var DISPLAY_SIZE    = new Dimension2( 125, 50 );
  var DISPLAY_SPACING = 5;

  // strings
  var hoursString = require( 'string!UNIT_RATES/hours' );

  /**
   * Node used to display an elapsed time (i.e. hours), in a 'collapsable' panel
   * @param {Property.<number>} elapsedTimeProperty
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

    this.showTimeProperty = options.showTimeProperty;
    this.hiddenTimeText   = options.hiddenTimeText;
    this.disabledProperty = disabledProperty;
    this.lastElapsedTime  = 0;

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

    // @private
    var unitText = new Text( hoursString, {
      right:    contentNode.right,
      bottom:   this.showTimeButton.bottom,
      font:     DISPLAY_FONT,
      maxWidth: 0.4 * DISPLAY_SIZE.width,
      maxHeight: DISPLAY_SIZE.height
    } );
    contentNode.addChild( unitText );

    Panel.call( this, contentNode, options);

    // update value text
    Property.multilink( [ elapsedTimeProperty, this.showTimeProperty ], function( elapsedTime, showTime ) {

      if( !self.disabledProperty.value) {
        self.lastElapsedTime = elapsedTime;
      }

      if( !showTime ) {
        timerText.setText( self.hiddenTimeText );
        unitText.visible = false;
      } else {
        var timerString = Util.toFixed( self.lastElapsedTime, 2 ).toString();
        timerText.setText( timerString );
        unitText.visible = true;
      }

      unitText.left = timerText.right + DISPLAY_SPACING;
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

