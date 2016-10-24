// Copyright 2016, University of Colorado Boulder

/**
 * Displays a double number line in an accordion box, with a marker editor and eraser button.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var DoubleNumberLineNode = require( 'UNIT_RATES/shoppingNEW/view/DoubleNumberLineNode' );
  var EraserButton = require( 'SCENERY_PHET/buttons/EraserButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  /**
   * @param {ShoppingItem} shoppingItem
   * @param {Object} [options]
   * @constructor
   */
  function DoubleNumberLineAccordionBox( shoppingItem, options ) {

    options = _.extend( {
      expandedProperty: new Property( true ),
      titleNode: new Text( doubleNumberLineString, { font: new URFont( 14 ), maxWidth: 300 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 10
    }, options );

    var doubleNumberLineNode = new DoubleNumberLineNode( shoppingItem, {
      //TODO topLabel, bottomLabel
    } );

    var eraserButton = new EraserButton( {
      listener: function() {
        //TODO
      }
    } );

    //TODO add marker editor

    var contentNode = new VBox( {
      align: 'right',
      spacing: 10,
      children: [
        doubleNumberLineNode,
        eraserButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );
  }

  unitRates.register( 'DoubleNumberLineAccordionBox', DoubleNumberLineAccordionBox );

  return inherit( AccordionBox, DoubleNumberLineAccordionBox );
} );
