// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var SceneMode = require( 'UNIT_RATES/shopping/enum/SceneMode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  // constants
  var SCENE_BUTTON_FONT = new PhetFont( 24 );

  /**
   * @param {Property.<SceneMode>} itemTypeProperty
   * @param {Object} [options]
   * @constructor
   */
  function SceneButtonGroupNode( model, sceneModeProperty, options ) {

    options = options || {};

    options = _.extend( {
      orientation: 'horizontal',
      baseColor: 'white',
      spacing: 15,
      buttonContentXMargin: 20
    }, options );

    // FIXME: move number strings to strings file?
    RadioButtonGroup.call( this, sceneModeProperty, [
      { value: SceneMode.FRUIT, node: new Text( '1', { font: SCENE_BUTTON_FONT, maxWidth: 25 } ) },
      { value: SceneMode.PRODUCE, node: new Text( '2', { font: SCENE_BUTTON_FONT, maxWidth: 25 } ) },
      { value: SceneMode.CANDY, node: new Text( '3', { font: SCENE_BUTTON_FONT, maxWidth: 25 } ) }
    ], options );
  }

  unitRates.register( 'SceneButtonGroupNode', SceneButtonGroupNode );

  return inherit( RadioButtonGroup, SceneButtonGroupNode, {

  } ); // define

} ); // inherit
