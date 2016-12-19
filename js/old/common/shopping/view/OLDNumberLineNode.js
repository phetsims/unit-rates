// Copyright 2016, University of Colorado Boulder

/**
 * A derived, shopping-specific, double number line. Basically adds swapping x-axis labels based on item type
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // common modules
  var inherit = require( 'PHET_CORE/inherit' );

  // sim modules
  var OLDItemData = require( 'UNIT_RATES/old/common/shopping/model/OLDItemData' );
  var OLDURNumberLineNode = require( 'UNIT_RATES/old/common/view/OLDURNumberLineNode' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  //TODO get these strings from OLDItemData
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
   * @param {OLDNumberLine} numberLine - the model
   * @param {NumberKeypad} keypad - shared keypad
   * @param {Object} [options]
   * @constructor
   */
  function OLDNumberLineNode( numberLine, keypad, options ) {

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

    OLDURNumberLineNode.call( this, numberLine, keypad, options );

    numberLine.removeAllMarkers();

    numberLine.itemTypeProperty.link( function( itemType ) {

      // axis labels
      var topLabel = dollarsString; // default for fruits and vegetables
      var bottomLabel = poundsString; // default for candy
      switch( itemType ) {

        // fruits
        case OLDItemData.APPLES.type:
          bottomLabel = applesString;
          break;
        case OLDItemData.LEMONS.type:
          bottomLabel = lemonsString;
          break;
        case OLDItemData.ORANGES.type:
          bottomLabel = orangesString;
          break;
        case OLDItemData.PEARS.type:
          bottomLabel = pearsString;
          break;

        // vegetables
        case OLDItemData.CARROTS.type:
          bottomLabel = carrotsString;
          break;
        case OLDItemData.CUCUMBERS.type:
          bottomLabel = cucumbersString;
          break;
        case OLDItemData.POTATOES.type:
          bottomLabel = potatoesString;
          break;
        case OLDItemData.TOMATOES.type:
          bottomLabel = tomatoesString;
          break;

        // candy cases are identical cases below here
        case OLDItemData.RED_CANDY.type:
        case OLDItemData.PURPLE_CANDY.type:
        case OLDItemData.GREEN_CANDY.type:
        case OLDItemData.BLUE_CANDY.type:
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

  unitRates.register( 'OLDNumberLineNode', OLDNumberLineNode );

  return inherit( OLDURNumberLineNode, OLDNumberLineNode );
} );
