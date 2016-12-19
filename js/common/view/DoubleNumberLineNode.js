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
   * @param {Node} doubleNumberLinePanel - panel that contains the double number line, for positioning the keypad
   * @param {Node} keypadLayer - layer in which the (modal) keypad will be displayed
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineNode( doubleNumberLinePanel, keypadLayer, options ) {

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
      labelXSpacing: 4, // horizontal spacing between axis and its label
      
      // top horizontal axis
      topLabel: null, // {Node|null} label on the top axis
      topAxisColor: 'black',
      
      // bottom horizontal axis
      bottomLabel: null, // {Node|null} label on the bottom axis
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
    
    if ( options.topLabel ) {
      this.addChild( options.topLabel );
      options.topLabel.left = topAxisNode.right + options.labelXSpacing;
      options.topLabel.centerY =  topAxisNode.centerY;
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

    if ( options.bottomLabel ) {
      this.addChild( options.bottomLabel );
      options.bottomLabel.left = bottomAxisNode.right + options.labelXSpacing;
      options.bottomLabel.centerY =  bottomAxisNode.centerY;
    }

    //TODO
    var markerEditor = new MarkerEditor( doubleNumberLinePanel, keypadLayer, {
      center: verticalAxis.center //TODO
    } );
    this.addChild( markerEditor );

    this.mutate( options );

    // @private
    this.disposeDoubleNumberLineNode = function() {
      //TODO
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
