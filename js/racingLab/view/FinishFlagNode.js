// Copyright 2016, University of Colorado Boulder

/**
 * The draggable finish/checkered flag node. It's is only allowed to move along the horizontal axis and is bound that
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Movable = require( 'UNIT_RATES/common/model/Movable' );
  var MovableNode = require( 'UNIT_RATES/common/view/MovableNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants

  /**
   * @param {string} imageString - flag image name
   * @param {Vector2} position - starting position
   * @param {Bounds2} bounds - valid area the flag can be moved
   * @param {Object} [options]
   * @constructor
   */
  function FinishFlagNode( imageString, position, bounds, options ) {

    options = _.extend( {
      imageScale: 1.0,
      cursor: 'pointer'
    }, options || {} );

    var image = new Image( imageString, { scale: options.imageScale } );
    var origin = new Vector2( position.x - image.width / 2, position.y - image.height );

    // adjust the bounds passed in to account for the size of the flag image
    var adjustedBounds = new Bounds2( bounds.minX - image.width / 2, bounds.minY - image.height,
      bounds.maxX - image.width / 2, bounds.maxY );

    // @public
    this.item = new Movable( {
      yAxisEnabled: false,      // horizontal movement only
      bounds: adjustedBounds,
      position: origin
    } );

    assert && assert( !options.children, 'additional children not supported' );
    options.children = [ image ];

    MovableNode.call( this, this.item, position, options );
  }

  unitRates.register( 'FinishFlagNode', FinishFlagNode );

  return inherit( MovableNode, FinishFlagNode, {

    /**
     * Returns the position of the flag
     * @return {Vector2}
     * @public
     */
    getCurrentPosition: function() {
      return this.item.positionProperty.value;
    }

  } ); // inherit

} ); //define
