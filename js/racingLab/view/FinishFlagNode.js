// Copyright 2016, University of Colorado Boulder

/**
 * The draggable finish/checkered flag node. It is only allowed to move horizontally along the track.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var MovableNode = require( 'UNIT_RATES/common/view/MovableNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Vector2 = require( 'DOT/Vector2' );
  
  // images
  var finishFlagImage = require( 'image!UNIT_RATES/finish_flag.png' );

  /**
   * @param {Vector2} position - starting position
   * @param {Bounds2} bounds - valid area the flag can be moved
   * @param {Object} [options]
   * @constructor
   */
  function FinishFlagNode( position, bounds, options ) {

    options = _.extend( {
      imageScale: 1.0,
      cursor: 'pointer'
    }, options );

    var imageNode = new Image( finishFlagImage, { scale: options.imageScale } );
    var origin = new Vector2( position.x - imageNode.width / 2, position.y - imageNode.height );

    // adjust the bounds to account for the shape of the flag
    var adjustedBounds = new Bounds2( bounds.minX, bounds.minY - imageNode.height, bounds.maxX, bounds.maxY );

    //TODO this should be created in model, not view
    // @public
    this.item = new Movable( {
      yAxisEnabled: false,      // horizontal movement only
      bounds: adjustedBounds,
      position: origin
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ imageNode ];

    MovableNode.call( this, this.item, position, options );
  }

  unitRates.register( 'FinishFlagNode', FinishFlagNode );

  return inherit( MovableNode, FinishFlagNode );

} ); //define
