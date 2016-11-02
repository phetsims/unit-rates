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
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var ShoppingCategoryRadioButtons = require( 'UNIT_RATES/shoppingNEW/view/ShoppingCategoryRadioButtons' );
  var ShoppingCategoryNode = require( 'UNIT_RATES/shoppingNEW/view/ShoppingCategoryNode' );
  var ShoppingViewProperties = require( 'UNIT_RATES/shoppingNEW/view/ShoppingViewProperties' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  // constants
  var SHOW_KEYPAD_LAYER_BOUNDS = true;

  /**
   * @param {ShoppingModelNEW} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingScreenViewNEW( model, options ) {

    var self = this;

    ScreenView.call( this, options );

    var viewProperties = new ShoppingViewProperties();

    var playAreaLayer = new Node();
    this.addChild( playAreaLayer );

    var keypadLayer = new Rectangle( 0, 0, this.layoutBounds.width, this.layoutBounds.height, {
      stroke: SHOW_KEYPAD_LAYER_BOUNDS ? 'green' : null,
      visible: false
    } );
    this.addChild( keypadLayer );

    //TODO create on demand to reduce startup time?
    // create the view for each category
    model.categories.forEach( function( category ) {
      playAreaLayer.addChild( new ShoppingCategoryNode( category, model.categoryProperty, self.layoutBounds, keypadLayer, viewProperties ) );
    } );

    // Category radio buttons
    var categoryRadioButtons = new ShoppingCategoryRadioButtons( model.categories, model.categoryProperty, {
      right: this.layoutBounds.maxX - 15,
      bottom: this.layoutBounds.maxY - 80
    } );
    playAreaLayer.addChild( categoryRadioButtons );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.maxX - 15,
      bottom: this.layoutBounds.maxY - 15
    } );
    playAreaLayer.addChild( resetAllButton );

    keypadLayer.moveToFront();
  }

  unitRates.register( 'ShoppingScreenViewNEW', ShoppingScreenViewNEW );

  return inherit( ScreenView, ShoppingScreenViewNEW );
} );

