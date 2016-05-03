// Copyright 2002-2016, University of Colorado Boulder

/**
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  //var unitRates = require( 'UNIT_RATES/unitRates' );
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var AccordionBox = require( 'SUN/AccordionBox' );
  var Property = require( 'AXON/Property' );

  // strings
  var challengesString = require( 'string!UNIT_RATES/Challenges' );
  var unitRateString = require( 'string!UNIT_RATES/UnitRate' );


  /**
   * @param {Object} model
   * @param {Object} [options]
   * @constructor
   */
  function ChallengesNode( model, options ) {

    //
    options = options || {};

    this.expandedProperty = new Property( false );

    var contentNode = new Node();

    var dummyNode = new Text( unitRateString, { font: new PhetFont( 14 ),  maxWidth: 100 } );
    contentNode.addChild( dummyNode );

    AccordionBox.call( this, contentNode, {
      expandedProperty: this.expandedProperty,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 15,
      titleNode: new Text( challengesString, { font: ShoppingConstants.PANEL_TITLE_FONT, maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'left',
      contentXMargin: 25,
      contentYMargin: 5
    } );

    this.mutate( options );
  }

  return inherit( AccordionBox, ChallengesNode, {

    reset: function() {
      this.expandedProperty.reset();
    }

  } );  // define

} );  // inherit
