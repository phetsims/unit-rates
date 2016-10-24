// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShoppingSceneControlNEW = require( 'UNIT_RATES/shoppingNEW/view/ShoppingSceneControlNEW' );
  var ShoppingSceneNode = require( 'UNIT_RATES/shoppingNEW/view/ShoppingSceneNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingModelNEW} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingScreenViewNEW( model, options ) {

    var self = this;

    ScreenView.call( this, options );

    // create the view for each scene
    model.scenes.forEach( function( scene ) {
      self.addChild( new ShoppingSceneNode( scene, model.sceneProperty, self.layoutBounds ) );
    } );

    // Scene control
    var sceneControl = new ShoppingSceneControlNEW( model.scenes, model.sceneProperty, {
      right: this.layoutBounds.maxX - 15,
      bottom: this.layoutBounds.maxY - 80
    } );
    this.addChild( sceneControl );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right: this.layoutBounds.maxX - 15,
      bottom: this.layoutBounds.maxY - 15
    } );
    this.addChild( resetAllButton );
  }

  unitRates.register( 'ShoppingScreenViewNEW', ShoppingScreenViewNEW );

  return inherit( ScreenView, ShoppingScreenViewNEW );
} );

