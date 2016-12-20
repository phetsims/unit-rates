// Copyright 2016, University of Colorado Boulder

/**
 * Displays a double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );

  // sim modules
  var MarkerEditor = require( 'UNIT_RATES/common/view/MarkerEditor' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Property.<number>} unitRateProperty
   * @param {Node} doubleNumberLinePanel - panel that contains the double number line, for positioning the keypad
   * @param {Node} keypadLayer - layer in which the (modal) keypad will be displayed
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineNode( unitRateProperty, doubleNumberLinePanel, keypadLayer, options ) {

    options = _.extend( {

      // vertical axis
      verticalAxisLength: 60,
      verticalAxisColor: 'black',
      verticalAxisLineWidth: 1.5,
      
      // common to both horizontal axes
      horizontalAxisLength: 660,
      horizontalAxisLineWidth: 1.5,
      arrowSize: new Dimension2( 8, 8 ),
      horizontalAxisYSpacing: 20, // vertical spacing between top and bottom axes
      labelXSpacing: 12, // horizontal spacing between axis and its label
      
      // top horizontal axis
      topAxisLabel: null, // {Node|null} label on the top axis
      topAxisColor: 'black',
      
      // bottom horizontal axis
      bottomAxisLabel: null, // {Node|null} label on the bottom axis
      bottomAxisMaxDecimals: 1, // {number} maximum number of decimal places for the bottom axis
      bottomAxisColor: 'black'

    }, options );

    Node.call( this, options );

    var verticalAxis = new Line( 0, 0, 0, options.verticalAxisLength, {
      stroke: options.verticalAxisColor,
      lineWidth: options.verticalAxisLineWidth
    } );
    this.addChild( verticalAxis );

    var topAxisNode = new ArrowNode( 0, 0, options.horizontalAxisLength, 0, {
      fill: options.topAxisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.horizontalAxisLineWidth,
      x: verticalAxis.x,
      y: verticalAxis.centerY - ( options.horizontalAxisYSpacing / 2 )
    } );
    this.addChild( topAxisNode );
    
    if ( options.topAxisLabel ) {
      this.addChild( options.topAxisLabel );
      options.topAxisLabel.left = topAxisNode.right + options.labelXSpacing;
      options.topAxisLabel.centerY =  topAxisNode.centerY;
    }

    var bottomAxisNode = new ArrowNode( 0, 0, options.horizontalAxisLength, 0, {
      fill: options.bottomAxisColor,
      stroke: null,
      headWidth: options.arrowSize.width,
      headHeight: options.arrowSize.height,
      tailWidth: options.horizontalAxisLineWidth,
      y: verticalAxis.centerY + ( options.horizontalAxisYSpacing / 2 )
    } );
    this.addChild( bottomAxisNode );

    if ( options.bottomAxisLabel ) {
      this.addChild( options.bottomAxisLabel );
      options.bottomAxisLabel.left = bottomAxisNode.right + options.labelXSpacing;
      options.bottomAxisLabel.centerY =  bottomAxisNode.centerY;
    }

    var markerEditor = new MarkerEditor( unitRateProperty, doubleNumberLinePanel, keypadLayer, {
      denominatorMaxDecimals: options.bottomAxisMaxDecimals,
      centerX: verticalAxis.centerX + 200, //TODO
      centerY: verticalAxis.centerY //TODO
    } );
    this.addChild( markerEditor );

    this.mutate( options );

    var unitRateObserver = function() {
      //TODO
    };
    unitRateProperty.link( unitRateObserver );

    // @private
    this.disposeDoubleNumberLineNode = function() {
      unitRateProperty.unlink( unitRateObserver );
      markerEditor.dispose();
    };
  }

  unitRates.register( 'DoubleNumberLineNode', DoubleNumberLineNode );

  return inherit( Node, DoubleNumberLineNode, {

    // @public
    dispose: function() {
      this.disposeDoubleNumberLineNode();
    }
  } );
} );
