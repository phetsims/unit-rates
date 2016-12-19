// Copyright 2016, University of Colorado Boulder

/**
 * View for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // sim modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Plane = require( 'SCENERY/nodes/Plane' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // common modules
  var ShoppingCategoryRadioButtons = require( 'UNIT_RATES/shopping/view/ShoppingCategoryRadioButtons' );
  var ShoppingCategoryNode = require( 'UNIT_RATES/shopping/view/ShoppingCategoryNode' );
  var ShoppingViewProperties = require( 'UNIT_RATES/shopping/view/ShoppingViewProperties' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingModel} model
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingScreenView( model, options ) {

    var self = this;

    ScreenView.call( this, options );

    var viewProperties = new ShoppingViewProperties();

    var playAreaLayer = new Node();
    this.addChild( playAreaLayer );

    var keypadLayer = new Plane( {
      fill: 'rgba( 0, 0, 0, 0.2 )',
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
  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( ScreenView, ShoppingScreenView );
} );

