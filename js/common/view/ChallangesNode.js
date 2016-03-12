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
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var challengesString = require( 'string!UNIT_RATES/challenges' );

  /**
   * @param {Object} model
   * @param {Object} [options]
   * @constructor
   */
  function ChallengesNode( model, options ) {

    //
    options = options || {};

    Node.call( this, options );

    var dummyNode = new Text( challengesString, { font: new PhetFont( 18 ), fontWeight: 'bold', maxWidth: 250 } );
    this.addChild( dummyNode );

  }

  unitRates.register( 'ChallengesNode', ChallengesNode );

  return inherit( Node, ChallengesNode, {

  } ); // inherit

} ); // define
