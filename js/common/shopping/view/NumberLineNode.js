// Copyright 2016, University of Colorado Boulder

/**
 * A derived, shopping-specific, double number line. Basically adds swapping x-axis labels based on item type
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );

  // strings
  var applesString = require( 'string!UNIT_RATES/apples' );
  var dollarsString = require( 'string!UNIT_RATES/dollars' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var pearsString = require( 'string!UNIT_RATES/pears' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );

  /**
   * @param {NumberLine} numberLine - the model
   * @param {NumberKeypad} keypad - shared keypad
   * @param {Object} [options]
   * @constructor
   */
  function NumberLineNode( numberLine, keypad, options ) {

    options = _.extend( {
      graphWidth: 655,
      xAxisOffset: 9,
      yAxisOffset: 55,
      xAxisLength: 615,
      yAxisLength: 28,
      markerLargeHeight: 45,
      markerSmallHeight: 25
    }, options );

    var self = this;

    URNumberLineNode.call( this, numberLine, keypad, options );

    numberLine.removeAllMarkers();

    // refresh on item type change
    numberLine.itemTypeProperty.link( function( itemType, oldType ) {

      // set number line labels
      switch( itemType ) {
        case ItemData.APPLES.type:
          self.setLineLabels( dollarsString, applesString );
          break;
        case ItemData.LEMONS.type:
          self.setLineLabels( dollarsString, lemonsString );
          break;
        case ItemData.ORANGES.type:
          self.setLineLabels( dollarsString, orangesString );
          break;
        case ItemData.PEARS.type:
          self.setLineLabels( dollarsString, pearsString );
          break;
        case ItemData.CARROTS.type:
          self.setLineLabels( dollarsString, carrotsString );
          break;
        case ItemData.CUCUMBERS.type:
          self.setLineLabels( dollarsString, cucumbersString );
          break;
        case ItemData.POTATOES.type:
          self.setLineLabels( dollarsString, potatoesString );
          break;
        case ItemData.TOMATOES.type:
          self.setLineLabels( dollarsString, tomatoesString );
          break;

        // candy cases are identical cases below here
        case ItemData.RED_CANDY.type:
        case ItemData.PURPLE_CANDY.type:
        case ItemData.GREEN_CANDY.type:
        case ItemData.BLUE_CANDY.type:
          self.setLineLabels( dollarsString, poundsString );
          break;

        default:
          assert && assert( false, 'Number line using unrecognized type' );
      }

      self.removeAllMarkerNodes();
      self.populate();
    } );
  }

  unitRates.register( 'NumberLineNode', NumberLineNode );

  return inherit( URNumberLineNode, NumberLineNode );
} );
