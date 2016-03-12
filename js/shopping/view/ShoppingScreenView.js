// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author TBD
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var SceneMode = require( 'UNIT_RATES/shopping/enum/SceneMode' );
  var ItemType = require( 'UNIT_RATES/shopping/enum/ItemType' );
  var SceneControlButtons = require( 'UNIT_RATES/shopping/view/SceneControlButtons' );
  var ItemComboBox = require( 'UNIT_RATES/shopping/view/ItemComboBox' );
  var DoubleNumberLineNode = require( 'UNIT_RATES/common/view/DoubleNumberLineNode' );
  var ChallangesNode = require( 'UNIT_RATES/common/view/ChallangesNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );


  // constants
  var SCREEN_MARGIN = 20;

  // strings
  var challengesString = require( 'string!UNIT_RATES/challenges' );

  /**
   * @param {ShoppingModel} model
   * @constructor
   */
  function ShoppingScreenView( model ) {

    ScreenView.call( this );

    // properties
    this.sceneModeProperty = new Property( SceneMode.FRUIT );
    this.itemTypeProperty = new Property( ItemType.APPLES );

    // scene buttons
    var sceneControlButtons = new SceneControlButtons( this.sceneModeProperty, {
      left:  this.layoutBounds.left + SCREEN_MARGIN,
      top: this.layoutBounds.top + SCREEN_MARGIN
    } );
    this.addChild( sceneControlButtons );

    // number line
    var doubleNumberLineNode = new DoubleNumberLineNode( {
      left:  sceneControlButtons.right + 35,
      top: this.layoutBounds.top + SCREEN_MARGIN } );
    this.addChild( doubleNumberLineNode );

    // item selection
    var itemsComboBox = new ItemComboBox( this.itemTypeProperty, this, {
      left:  this.layoutBounds.left + SCREEN_MARGIN,
      bottom: this.layoutBounds.bottom - SCREEN_MARGIN
    } );
    this.addChild( itemsComboBox );

    // shelf

    // scale

    // challenges

    // Reset All button
    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      right:  this.layoutBounds.maxX - 10,
      bottom: this.layoutBounds.maxY - 10
    } );
    this.addChild( resetAllButton );
  }

  unitRates.register( 'ShoppingScreenView', ShoppingScreenView );

  return inherit( ScreenView, ShoppingScreenView, {

    //TODO Called by the animation loop. Optional, so if your view has no animation, please delete this.
    // @public
    step: function( dt ) {
      //TODO Handle view animation here.
    }
  } );
} );
