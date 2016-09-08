// Copyright 2002-2016, University of Colorado Boulder

/**
 * A specific instance of an item (i.e. apple, cucumber, blue candy) with it's dynamic attributes
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var MovableItem = require( 'UNIT_RATES/common/model/MovableItem' );
  var MovableItemNode = require( 'UNIT_RATES/common/view/MovableItemNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants

  /**
   * @constructor
   */
  function FinishFlagNode( imageString, position, options ) {

    options = _.extend( {
      imageScale: 1.0,
      bounds:     null
    }, options || {} );

    var image   = new Image( imageString, { scale: options.imageScale } );
    var origin  = new Vector2( position.x, position.y - image.height );
    var bounds  = new Bounds2( options.bounds.minX, options.bounds.minY - image.height,
                               options.bounds.maxX, options.bounds.maxY );

    // @public
    this.item = new MovableItem( {
      yAxisEnabled: false,
      bounds:       bounds,
      position:     origin
    });

    options.children = [ image ];
    MovableItemNode.call( this, this.item, position, options );
  }

  unitRates.register( 'FinishFlagNode', FinishFlagNode );

  return inherit( MovableItemNode, FinishFlagNode, {

  getCurrentPosition: function() {
    return this.item.positionProperty.value;
  }

  } ); // inherit

} ); //define
