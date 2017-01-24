// Copyright 2017, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var BagDragHandler = require( 'UNIT_RATES/shopping/view/BagDragHandler' );
  var Image = require( 'SCENERY/nodes/Image' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

  /**
   * @param {Bag} bag
   * @param {Shelf} shelf
   * @param {Scale} scale
   * @constructor
   */
  function BagNode( bag, shelf, scale ) {

    var self = this;

    // This type does not propagate options to the supertype because the model determines location.
    Image.call( this, bag.image, {
      scale: URConstants.BAG_IMAGE_SCALE,
      cursor: 'pointer'
    } );

    // origin is at bottom center
    var locationObserver = function( location ) {
      self.centerX = location.x;
      self.bottom = location.y;
    };
    bag.locationProperty.link( locationObserver ); // must be unlinked in dispose

    // @private drag handler
    this.dragHandler = new BagDragHandler( this, bag, shelf, scale );
    this.addInputListener( self.dragHandler );

    // @private
    this.disposeBagNode = function() {
      bag.locationProperty.unlink( locationObserver );
      self.removeInputListener( self.dragHandler );
    };
  }

  unitRates.register( 'BagNode', BagNode );

  return inherit( Image, BagNode, {

    // @public
    dispose: function() {
      Image.prototype.dispose && Image.prototype.dispose.call( this );
      this.disposeBagNode();
    },

    //FUTURE revisit when scenery supports drag cancellation, see https://github.com/phetsims/function-builder/issues/57
    /**
     * Cancels a drag that is in progress.
     * If no drag is in progress, this is a no-op.
     * @public
     */
    cancelDrag: function() {
      this.dragHandler.endDrag( null /* event */ );
    }
  } );
} );
