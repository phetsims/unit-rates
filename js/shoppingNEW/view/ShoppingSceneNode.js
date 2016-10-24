// Copyright 2016, University of Colorado Boulder

/**
 * View for a scene in the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ShoppingItemComboBox = require( 'UNIT_RATES/shoppingNEW/view/ShoppingItemComboBox' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingScene} scene
   * @param {Property.<ShoppingScene>} sceneProperty
   * @param {Bounds2} layoutBounds
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingSceneNode( scene, sceneProperty, layoutBounds, options ) {

    options = options || {};

    var self = this;

    Node.call( this );

    var comboBox = new ShoppingItemComboBox( scene.shoppingItems, scene.shoppingItemProperty, this, {
      left: layoutBounds.left + 15,
      bottom: layoutBounds.bottom - 15
    } );
    this.addChild( comboBox );

    this.mutate( options );

    // Show this scene when it's selected.
    sceneProperty.link( function( newScene ) {
      self.visible = ( newScene === scene );
    } );
  }

  unitRates.register( 'ShoppingSceneNode', ShoppingSceneNode );

  return inherit( Node, ShoppingSceneNode );
} );
