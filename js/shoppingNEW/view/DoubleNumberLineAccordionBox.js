// Copyright 2016, University of Colorado Boulder

//TODO move to common, generalize to be usable in all Screens
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
  var dollarsString = require( 'string!UNIT_RATES/dollars' );
  var doubleNumberLineString = require( 'string!UNIT_RATES/doubleNumberLine' );

  // constants
  var AXIS_LABEL_OPTIONS = {
    font: new URFont( 14 ),
    fill: 'black'
  };

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

    var doubleNumberLineNode = new DoubleNumberLineNode( {
      topLabel: new Text( dollarsString, AXIS_LABEL_OPTIONS ),
      bottomLabel: new Text( shoppingItem.denominatorName || shoppingItem.pluralName, AXIS_LABEL_OPTIONS )
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
