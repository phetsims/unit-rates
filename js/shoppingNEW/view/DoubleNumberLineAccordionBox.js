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
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URFont = require( 'UNIT_RATES/common/URFont' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
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
      titleNode: new Text( doubleNumberLineString, { font: new URFont( 18 ), maxWidth: 300 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 10
    }, options );

    var doubleNumberLineNode = new DoubleNumberLineNode( {
      topLabel: new Text( shoppingItem.topAxisLabel, AXIS_LABEL_OPTIONS ),
      bottomLabel: new Text( shoppingItem.bottomAxisLabel, AXIS_LABEL_OPTIONS )
    } );

    //TODO erase markers that were created using the marker editor, or by putting items on the scale
    var eraserButton = new EraserButton( {
      baseColor: 'rgb( 255, 255, 219 )',
      listener: function() {
        //TODO
      }
    } );

    //TODO add marker editor

    var contentNode = new VBox( {
      align: 'right',
      spacing: 10,
      children: [
        new VBox( {
          align: 'left',
          spacing: 0,
          children: [
            doubleNumberLineNode,
            new HStrut( 745 ) //TODO temporary solution for uniform width
          ]
        } ),
        eraserButton
      ]
    } );

    AccordionBox.call( this, contentNode, options );

    // @private
    this.disposeDoubleNumberLineAccordionBox = function() {
      doubleNumberLineNode.dispose();
      //TODO
    };
  }

  unitRates.register( 'DoubleNumberLineAccordionBox', DoubleNumberLineAccordionBox );

  return inherit( AccordionBox, DoubleNumberLineAccordionBox, {

    // @public
    dispose: function() {
      AccordionBox.prototype.dispose.call( this );
      this.disposeDoubleNumberLineAccordionBox();
    }
  } );
} );
