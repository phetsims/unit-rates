// Copyright 2002-2016, University of Colorado Boulder

/**
 * Group of radio buttons used to toggle between the various groups of item types (i.e. fruit, produce, candy)
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var Item = require( 'UNIT_RATES/shopping/model/Item' );
  var ItemNodeFactory = require( 'UNIT_RATES/shopping/view/ItemNodeFactory' );
  var SceneMode = require( 'UNIT_RATES/shopping/enum/SceneMode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // images
  var appleImage        = require( 'image!UNIT_RATES/apple.png' );
  var carrotImage       = require( 'image!UNIT_RATES/carrot.png' );
  var purpleCandyImage  = require( 'image!UNIT_RATES/purple_candy.png' );

  // constants
  var SCENE_BUTTON_FONT = new PhetFont( 24 );

  /**
   * @param {Property.<SceneMode>} itemTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function SceneButtonGroupNode( sceneModeProperty, options ) {

    options = options || {};

    options = _.extend( {
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 15,
      buttonContentXMargin: 20
    }, options );

    RadioButtonGroup.call( this, sceneModeProperty, [
      { value: SceneMode.FRUIT,   node: ItemNodeFactory.createItem( new Item( ItemData.APPLES, 1 ) ) },
      { value: SceneMode.PRODUCE, node: ItemNodeFactory.createItem( new Item( ItemData.CARROTS, 1 ) ) },
      { value: SceneMode.CANDY,   node: ItemNodeFactory.createItem( new Item( ItemData.PURPLE_CANDY, 1 ) ) }
    ], options );
  }

  unitRates.register( 'SceneButtonGroupNode', SceneButtonGroupNode );

  return inherit( RadioButtonGroup, SceneButtonGroupNode, {

    // no dispose, persists for the lifetime of the sim.

  } ); // define

} ); // inherit
