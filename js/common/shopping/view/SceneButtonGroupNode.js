// Copyright 2016, University of Colorado Boulder

/**
 * Group of radio buttons used to toggle between the various groups of item types (i.e. fruit, produce, candy)
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var Item = require( 'UNIT_RATES/common/shopping/model/Item' );
  var ItemNodeFactory = require( 'UNIT_RATES/common/shopping/view/ItemNodeFactory' );
  var SceneMode = require( 'UNIT_RATES/common/shopping/enum/SceneMode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );

  /**
   * @param {Property.<SceneMode>} sceneModeProperty
   * @param {Object} [options]
   * @constructor
   */
  function SceneButtonGroupNode( sceneModeProperty, options ) {

    options = options || {};

    options = _.extend( {
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 15,
      buttonContentXMargin: 4
    }, options );

    RadioButtonGroup.call( this, sceneModeProperty, [
      {
        value: SceneMode.FRUIT, node: ItemNodeFactory.createItemNode( new Item( ItemData.APPLES.type, 1 ),
        { imageScale: 0.025 } )
      },
      {
        value: SceneMode.PRODUCE, node: ItemNodeFactory.createItemNode( new Item( ItemData.CARROTS.type, 1 ),
        { imageScale: 0.025 } )
      },
      {
        value: SceneMode.CANDY, node: ItemNodeFactory.createItemNode( new Item( ItemData.PURPLE_CANDY.type, 1 ),
        { imageScale: 0.035 } )
      }
    ], options );
  }

  unitRates.register( 'SceneButtonGroupNode', SceneButtonGroupNode );

  return inherit( RadioButtonGroup, SceneButtonGroupNode, {

    // no dispose, persists for the lifetime of the sim.

  } ); // define

} ); // inherit
