// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Emitter = require( 'AXON/Emitter' );
  var Vector2 = require( 'DOT/Vector2' );
  var Property = require( 'AXON/Property' );

  /**
   * @param {Item} item
   * @param {Vector2} position
   * @param (function} movedCallback - function called when item drag ends
   * @param {Object} [options]
   * @constructor
   */
  function ItemNode( item, position, movedCallback, options ) {

    options = options || {};

    Node.call( this, options );

    var self = this;

    this.item = item;
    this.lastPosition = position;
    this.item.positionProperty.value = this.lastPosition;

    // @protected - used to tell when an item node is moved
    this.dragEndEmitter = new Emitter();
    this.dragEndEmitter.addListener( movedCallback );

    // translate node according to item position property
    this.item.positionProperty.link( function( position, oldPosition ) {
        self.translation = position;
    } );

    // add a drag listener
    this.addInputListener( new SimpleDragHandler( {

      start: function( e ) {
        self.moveToFront();
        var clickOffset = self.globalToParentPoint( e.pointer.point ).subtract( e.currentTarget.translation );
        self.lastPosition = self.globalToParentPoint( e.pointer.point ).subtract( clickOffset );
      },
      end: function( e ) {
        // announce drag complete
        self.dragEndEmitter.emit1( self );
      },

      translate: function( translation ) {
        // update node position in screen coordinates
        self.item.positionProperty.value = translation.position;
      }

    } ) );
  }

  unitRates.register( 'ItemNode', ItemNode );

  return inherit( Node, ItemNode, {

    /**
     * Moves the node to the position before the last drag
     * @public
     */
    restoreLastPosition: function() {
       this.item.positionProperty.value = this.lastPosition;
    }

  } ); // inherit

} ); // define

