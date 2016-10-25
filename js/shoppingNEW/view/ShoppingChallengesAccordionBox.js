// Copyright 2016, University of Colorado Boulder

/**
 * Displays challenges in an accordion box, with a refresh button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var FontAwesomeNode = require( 'SUN/FontAwesomeNode' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ShoppingChallengesNode = require( 'UNIT_RATES/shoppingNEW/view/ShoppingChallengesNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var challengesString = require( 'string!UNIT_RATES/challenges' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Object} [options]
   * @constructor
   */
  function ShoppingChallengesAccordionBox( shoppingItem, options ) {

    options = _.extend( {
      expandedProperty: new Property( true ),
      titleNode: new Text( challengesString, { font: new URFont( 18 ), maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 10
    }, options );

    var challengesNode = new ShoppingChallengesNode( shoppingItem );

    var refreshButton = new RectangularPushButton( {
      baseColor: '#f2f2f2',
      content: new FontAwesomeNode( 'refresh', { scale: 0.38 } ),
      listener: function() {
        //TODO
      }
    } );

    var contentNode = new VBox( {
      align: 'center', //TODO right justify the refresh button?
      spacing: 10,
      children: [
        challengesNode,
        new HStrut( 175 ), //TODO temporary
        refreshButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  unitRates.register( 'ShoppingChallengesAccordionBox', ShoppingChallengesAccordionBox );

  return inherit( AccordionBox, ShoppingChallengesAccordionBox );
} );
