// Copyright 2016, University of Colorado Boulder

//TODO move to common, use in all Screens
/**
 * Displays a double number line.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineNode( options ) {

    options = _.extend( {

      length: 725, // length of both lines
      spacing: 50, // vertical spacing between top and bottom line

      // top line
      topLineColor: 'black',
      topLineWidth: 1,
      topLabel: '',
      topLabelColor: 'black',

      // bottom line
      bottomLineColor: 'black',
      bottomLineWidth: 1,
      bottomLabel: '',
      bottomLabelColor: 'black',

      // vertical line
      verticalLineExtension: 30,
      verticalLineColor: 'black',
      verticalLineWidth: 1

    }, options );

    Node.call( this, options );

    var verticalLine = new Line( 0, 0, 0, options.spacing + ( 2 * options.verticalLineExtension ), {
      stroke: options.verticalLineColor,
      lineWidth: options.verticleLineWidth
    } );
    this.addChild( verticalLine );

    var topLineNode = new ArrowNode( 0, 0, options.length, 0, {
      fill: options.topLineColor,
      stroke: null,
      tailWidth: options.topLineWidth,
      x: verticalLine.x,
      y: verticalLine.y + options.verticalLineExtension
    } );
    this.addChild( topLineNode );

    var bottomLineNode = new ArrowNode( 0, 0, options.length, 0, {
      fill: options.bottomLineColor,
      stroke: null,
      tailWidth: options.bottomLineWidth,
      y: topLineNode.y + options.spacing
    } );
    this.addChild( bottomLineNode );

    this.mutate( options );
  }

  unitRates.register( 'DoubleNumberLineNode', DoubleNumberLineNode );

  return inherit( Node, DoubleNumberLineNode );
} );
