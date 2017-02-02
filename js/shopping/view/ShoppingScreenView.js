// Copyright 2016-2017, University of Colorado Boulder

/**
 * View for the 'Shopping' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var ScreenView = require( 'JOIST/ScreenView' );

  // sim modules
  var KeypadLayer = require( 'UNIT_RATES/common/view/KeypadLayer' );
  var ShoppingCategoryRadioButtons = require( 'UNIT_RATES/shopping/view/ShoppingCategoryRadioButtons' );
  var ShoppingCategoryNode = require( 'UNIT_RATES/shopping/view/ShoppingCategoryNode' );
  var ShoppingViewProperties = require( 'UNIT_RATES/shopping/view/ShoppingViewProperties' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );

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

    var keypadLayer = new KeypadLayer();
    this.addChild( keypadLayer );

    // create the view for each category
    model.categories.forEach( function( category ) {
      playAreaLayer.addChild( new ShoppingCategoryNode( category, model.categoryProperty, self.layoutBounds, keypadLayer, viewProperties ) );
    } );

    // Category radio buttons
    var categoryRadioButtons = new ShoppingCategoryRadioButtons( model.categories, model.categoryProperty, {
      left: this.layoutBounds.left + URConstants.SCREEN_X_MARGIN,
      bottom: this.layoutBounds.bottom - URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( categoryRadioButtons );

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        viewProperties.reset();
      },
      right: this.layoutBounds.maxX - URConstants.SCREEN_X_MARGIN,
      bottom: this.layoutBounds.maxY - URConstants.SCREEN_Y_MARGIN
    } );
    playAreaLayer.addChild( resetAllButton );
  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( ScreenView, ShoppingScreenView );
} );

