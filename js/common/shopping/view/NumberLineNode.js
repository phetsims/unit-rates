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
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var pearsString = require( 'string!UNIT_RATES/pears' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );
  var costUnitsString = require( 'string!UNIT_RATES/costUnits' );
  var weightUnitsString = require( 'string!UNIT_RATES/weightUnits' );

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
    }, options || {} );

    var self = this;

    URNumberLineNode.call( this, numberLine, keypad, options );

    numberLine.removeAllMarkers();

    // refresh on item type change
    numberLine.itemTypeProperty.link( function( itemType, oldType ) {

      // set number line labels
      switch( itemType ) {
        case ItemData.APPLES.type:
          self.setLineLabels( costUnitsString, applesString );
          break;
        case ItemData.LEMONS.type:
          self.setLineLabels( costUnitsString, lemonsString );
          break;
        case ItemData.ORANGES.type:
          self.setLineLabels( costUnitsString, orangesString );
          break;
        case ItemData.PEARS.type:
          self.setLineLabels( costUnitsString, pearsString );
          break;
        case ItemData.CARROTS.type:
          self.setLineLabels( costUnitsString, carrotsString );
          break;
        case ItemData.CUCUMBERS.type:
          self.setLineLabels( costUnitsString, cucumbersString );
          break;
        case ItemData.POTATOES.type:
          self.setLineLabels( costUnitsString, potatoesString );
          break;
        case ItemData.TOMATOES.type:
          self.setLineLabels( costUnitsString, tomatoesString );
          break;
        //TODO identical cases below here
        case ItemData.RED_CANDY.type:
          self.setLineLabels( costUnitsString, weightUnitsString );
          break;
        case ItemData.PURPLE_CANDY.type:
          self.setLineLabels( costUnitsString, weightUnitsString );
          break;
        case ItemData.GREEN_CANDY.type:
          self.setLineLabels( costUnitsString, weightUnitsString );
          break;
        case ItemData.BLUE_CANDY.type:
          self.setLineLabels( costUnitsString, weightUnitsString );
          break;
        default:
          assert && assert( false, 'Number line using unrecognized type' );
      }

      self.removeAllMarkerNodes();
      self.populate();
    } );
  }

  unitRates.register( 'NumberLineNode', NumberLineNode );

  return inherit( URNumberLineNode, NumberLineNode, {

    /**
     * Called when the user selects the sim reset button
     * @override @protected
     */
    reset: function() {
      //TODO why overriding this? It's not adding anything to the supertype call
      URNumberLineNode.prototype.reset.call( this );
    }

  } );  // define

} );  // inherit
