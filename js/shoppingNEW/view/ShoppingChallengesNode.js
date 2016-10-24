// Copyright 2016, University of Colorado Boulder

/**
 * Displays challenges for a ShoppingItem.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingChallengesNode( shoppingItem, options ) {

    options = _.extend( {
      spacing: 25
    }, options );

    assert && assert( !options.children, 'decoration not supported' );
    options.children = [];

    //TODO temporary placeholder
    shoppingItem.challenges[ 0 ].forEach( function( value ) {
      options.children.push( new Text( value, { font: new URFont( 24 ) } ) );
    } );

    VBox.call( this, options );
  }

  unitRates.register( 'ShoppingChallengesNode', ShoppingChallengesNode );

  return inherit( VBox, ShoppingChallengesNode );
} );