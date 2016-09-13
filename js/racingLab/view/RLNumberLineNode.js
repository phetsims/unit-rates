// Copyright 2002-2016, University of Colorado Boulder

/**
 * Base class for all number line nodes in the simulation. Base functionality includes, drawing and labeling the
 * double axes managing a current list of number line markers.
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );

  /**
   * @param {URNumberLine} numberline
   * @param {KeypadPanelNode} keypad
   * @param {Object} [options]
   * @constructor
   */
  function RLNumberLineNode( numberline, keypad, options ) {


    URNumberLineNode.call( this, numberline, keypad, options );
  }

  unitRates.register( 'RLNumberLineNode', RLNumberLineNode );

  return inherit( URNumberLineNode, RLNumberLineNode, {

    // no dispose, persists for the lifetime of the sim.


  } );  // define

} );  // inherit
