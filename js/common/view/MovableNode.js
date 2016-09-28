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
   * @param {Movable} item - the underlying item model w/ a position
   * @param {Vector2} position - a X,Y position property
   * @param {Object} [options]
   * @constructor
   */
  function MovableNode( item, position, options ) {

    options = _.extend( {
      draggable:  true,
      dragHandle: null,    // Bounds2 - the portion of the node that serves as a drag handle (local coordinates, unused)
      pickable: true
    }, options || {} );

    Node.call( this, options );

    var self = this;

    this.item = item;
    this.lastPosition = position;
    this.item.setPosition( position.x, position.y, false );

    // @protected - all used to track item movement (i.e. dragging, animation)
    this.draggable          = options.draggable;
    this.isDragging         = false;
    this.dragHandle         = ( options.dragHandle !== null ? options.dragHandle : null );
    this.moveStartCallback  = null;
    this.moveCallback       = null;
    this.moveEndCallback    = null;
    this.dragStartEmitter   = new Emitter();
    this.dragEmitter        = new Emitter();
    this.dragEndEmitter     = new Emitter();

    // translate node according to item position property
    this.positionListener = function( position, oldPosition ) {
        self.translation = position;
    };
    this.item.positionProperty.link( this.positionListener );

    // add a drag listener
    if ( this.draggable ) {
      this.dragListener = new SimpleDragHandler( {

        // Allow moving a finger (touch) across a node to pick it up.
        allowTouchSnag: true,

        start: function( e ) {
          self.moveToFront();

          self.isDragging = true;

          // if a specific dragHandle has been defined, check if the point is within the area.
          if ( self.dragHandle ) {
            var globalArea = self.localToGlobalBounds( self.dragHandle );
            if ( !globalArea.containsPoint( e.pointer.point ) ) {
              self.isDragging = false;
              return;
            }
          }

          var clickOffset   = self.globalToParentPoint( e.pointer.point ).subtract( e.currentTarget.translation );
          self.lastPosition = self.globalToParentPoint( e.pointer.point ).subtract( clickOffset );

          // announce drag start
          self.dragStartEmitter.emit1( self );
        },
        end: function( e ) {
          self.isDragging = false;

          // announce drag end
          self.dragEndEmitter.emit1( self );
        },

        translate: function( translation ) {
          if ( !self.isDragging ) {
            return;
          }

          // update node position in screen coordinates
          self.item.setPosition( translation.position.x, translation.position.y, false );

          // announce drag
          self.dragEmitter.emit1( self );
        }
      } );

      this.addInputListener( this.dragListener );
    }
  }

  unitRates.register( 'MovableNode', MovableNode );

  return inherit( Node, MovableNode, {

    /**
     * Adds listeners for drag start & end
     * @param (function} moveStartCallback - function called when item drag starts
     * @param (function} moveCallback - function called when item is dragged
     * @param (function} moveEndCallback - function called when item drag ends
     * @public
     */
    addDragListeners: function( moveStartCallback, moveCallback, moveEndCallback ) {
      this.moveStartCallback = moveStartCallback;
      this.moveCallback      = moveCallback ;
      this.moveEndCallback   = moveEndCallback;

      if ( this.moveStartCallback ) {
        this.dragStartEmitter.addListener( this.moveStartCallback );
      }
      if ( this.moveCallback ) {
        this.dragEmitter.addListener( this.moveCallback );
      }
      if ( this.moveEndCallback ) {
        this.dragEndEmitter.addListener( this.moveEndCallback );
      }
    },

    /**
     * Moves the node back to the position before the last drag
     * @public
     */
    restoreLastPosition: function() {
       this.item.setPosition( this.lastPosition.x, this.lastPosition.y, true );
    },

    // @public
    dispose: function() {

      // unlink position
      this.item.positionProperty.unlink( this.positionListener );

      // remove start drag emitter listener
      if ( this.moveStartCallback ) {
        this.dragStartEmitter.removeListener( this.moveStartCallback );
      }

      // remove start drag emitter listener
      if ( this.moveCallback ) {
        this.dragEmitter.removeListener( this.moveCallback );
      }

      // remove end drag emitter listener
      if ( this.moveEndCallback ) {
        this.dragEndEmitter.removeListener( this.moveEndCallback );
      }

      // remove input listener
      if ( this.dragListener ) {
        this.removeInputListener( this.dragListener );
      }

      Node.prototype.dispose.call( this );
    }

  } ); // inherit

} ); // define

