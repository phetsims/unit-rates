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
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Emitter = require( 'AXON/Emitter' );

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
    this.movedCallback = movedCallback;
    this.lastPosition = position;
    this.item.positionProperty.value = this.lastPosition;

    // @protected - used to tell when an item node is moved
    this.dragEndEmitter = new Emitter();
    this.dragEndEmitter.addListener( movedCallback );

    // translate node according to item position property
    this.positionListener = function( position, oldPosition ) {
        self.translation = position;
    };
    this.item.positionProperty.link( this.positionListener );

    // add a drag listener
    this.dragListener = new SimpleDragHandler( {

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
    } );
    this.addInputListener( this.dragListener );
  }

  unitRates.register( 'ItemNode', ItemNode );

  return inherit( Node, ItemNode, {

    // @public
    dispose: function() {

      // unlink position
      this.item.positionProperty.unlink( this.positionListener );

      // remove emitter listener
      this.dragEndEmitter.removeListener( this.movedCallback );

      // remove input listener
      this.removeInputListener( this.dragListener );
    },

    /**
     * Moves the node to the position before the last drag
     * @public
     */
    restoreLastPosition: function() {
       this.item.positionProperty.value = this.lastPosition;
    }

  } ); // inherit

} ); // define

