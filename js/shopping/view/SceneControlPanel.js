// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var Panel = require( 'SUN/Panel' );

  /**
   *
   * @param {Property.<SceneMode>} currentSceneProperty
   * @param {Object} [options]
   * @constructor
   */
  function SceneControlPanel( currentSceneProperty, options ) {

    options = _.extend( {
      xMargin: 15,
      yMargin: 8,
      minWidth: 100,
      maxWidth: 100,
      align: 'left',
      fill: 'white',
      stroke: 'black'
    }, options );


    Panel.call( this, content, options );
  }

  unitRates.register( 'SceneControlPanel', SceneControlPanel );

  return inherit( Panel, SceneControlPanel );

} );
