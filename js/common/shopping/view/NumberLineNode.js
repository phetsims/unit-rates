// Copyright 2002-2016, University of Colorado Boulder

/**
 * A derived, shopping-specific, double number line. Basically adds swapping x-axis labels based on item type
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URNumberLineNode = require( 'UNIT_RATES/common/view/URNumberLineNode' );
  var ItemData = require( 'UNIT_RATES/common/shopping/enum/ItemData' );

  // strings
  var applesCapString = require( 'string!UNIT_RATES/applesCap' );
  var lemonsCapString = require( 'string!UNIT_RATES/lemonsCap' );
  var orangesCapString = require( 'string!UNIT_RATES/orangesCap' );
  var pearsCapString = require( 'string!UNIT_RATES/pearsCap' );
  var carrotsCapString = require( 'string!UNIT_RATES/carrotsCap' );
  var cucumbersCapString = require( 'string!UNIT_RATES/cucumbersCap' );
  var potatoesCapString = require( 'string!UNIT_RATES/potatoesCap' );
  var tomatoesCapString = require( 'string!UNIT_RATES/tomatoesCap' );
  var costString = require( 'string!UNIT_RATES/cost' );
  var currencySymbolString = require( 'string!UNIT_RATES/currencySymbol' );
  var weightString = require( 'string!UNIT_RATES/weight' );
  var lbsString = require( 'string!UNIT_RATES/lbs' );
  var costCurrencyString = costString + ' (' + currencySymbolString + ')';
  var weightUnitString = weightString + ' (' + lbsString + ')';

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
          self.setLineLabels( costCurrencyString, applesCapString );
          break;
        case ItemData.LEMONS.type:
          self.setLineLabels( costCurrencyString, lemonsCapString );
          break;
        case ItemData.ORANGES.type:
          self.setLineLabels( costCurrencyString, orangesCapString );
          break;
        case ItemData.PEARS.type:
          self.setLineLabels( costCurrencyString, pearsCapString );
          break;
        case ItemData.CARROTS.type:
          self.setLineLabels( costCurrencyString, carrotsCapString );
          break;
        case ItemData.CUCUMBERS.type:
          self.setLineLabels( costCurrencyString, cucumbersCapString );
          break;
        case ItemData.POTATOES.type:
          self.setLineLabels( costCurrencyString, potatoesCapString );
          break;
        case ItemData.TOMATOES.type:
          self.setLineLabels( costCurrencyString, tomatoesCapString );
          break;
        case ItemData.RED_CANDY.type:
          self.setLineLabels( costCurrencyString, weightUnitString );
          break;
        case ItemData.PURPLE_CANDY.type:
          self.setLineLabels( costCurrencyString, weightUnitString );
          break;
        case ItemData.GREEN_CANDY.type:
          self.setLineLabels( costCurrencyString, weightUnitString );
          break;
        case ItemData.BLUE_CANDY.type:
          self.setLineLabels( costCurrencyString, weightUnitString );
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
      URNumberLineNode.prototype.reset.call( this );
    }

  } );  // define

} );  // inherit
