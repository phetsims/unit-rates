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
  var ItemData = require( 'UNIT_RATES/common/shopping/model/ItemData' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );

  //TODO get these strings from ItemData
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

    numberLine.itemTypeProperty.link( function( itemType ) {

      // axis labels
      var topLabel = dollarsString; // default for fruits and vegetables
      var bottomLabel = poundsString; // default for candy
      switch( itemType ) {

        // fruits
        case ItemData.APPLES.type:
          bottomLabel = applesString;
          break;
        case ItemData.LEMONS.type:
          bottomLabel = lemonsString;
          break;
        case ItemData.ORANGES.type:
          bottomLabel = orangesString;
          break;
        case ItemData.PEARS.type:
          bottomLabel = pearsString;
          break;

        // vegetables
        case ItemData.CARROTS.type:
          bottomLabel = carrotsString;
          break;
        case ItemData.CUCUMBERS.type:
          bottomLabel = cucumbersString;
          break;
        case ItemData.POTATOES.type:
          bottomLabel = potatoesString;
          break;
        case ItemData.TOMATOES.type:
          bottomLabel = tomatoesString;
          break;

        // candy cases are identical cases below here
        case ItemData.RED_CANDY.type:
        case ItemData.PURPLE_CANDY.type:
        case ItemData.GREEN_CANDY.type:
        case ItemData.BLUE_CANDY.type:
          topLabel = dollarsString;
          break;

        default:
          throw new Error( 'invalid itemType: ' + itemType );
      }

      self.setLineLabels( topLabel, bottomLabel );
      self.removeAllMarkerNodes();
      self.populate();
    } );
  }

  unitRates.register( 'NumberLineNode', NumberLineNode );

  return inherit( URNumberLineNode, NumberLineNode );
} );
