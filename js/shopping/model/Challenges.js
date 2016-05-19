// Copyright 2002-2016, University of Colorado Boulder

/**
 * All the challenge information for all items
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var ShoppingConstants = require( 'UNIT_RATES/shopping/ShoppingConstants' );
  var ItemData = require( 'UNIT_RATES/shopping/enum/ItemData' );
  var ChallengeQuestionAnswer = require( 'UNIT_RATES/common/model/ChallengeQuestionAnswer' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Random = require( 'DOT/Random' );
  var Util = require( 'DOT/Util' );

  // strings
  var unitRateQuestionString = require( 'string!UNIT_RATES/UnitRateQuestion' );
  var costOfQuestionString = require( 'string!UNIT_RATES/CostOfQuestion' );
  var forQuestionString = require( 'string!UNIT_RATES/forQuestion' );
  var appleString = require( 'string!UNIT_RATES/apple' );
  var appleCapString = require( 'string!UNIT_RATES/appleCap' );
  var applesString = require( 'string!UNIT_RATES/apples' );
  var applesCapString = require( 'string!UNIT_RATES/applesCap' );
  var lemonString = require( 'string!UNIT_RATES/lemon' );
  var lemonCapString = require( 'string!UNIT_RATES/lemonCap' );
  var lemonsString = require( 'string!UNIT_RATES/lemons' );
  var lemonsCapString = require( 'string!UNIT_RATES/lemonsCap' );
  var orangeString = require( 'string!UNIT_RATES/orange' );
  var orangeCapString = require( 'string!UNIT_RATES/orangeCap' );
  var orangesString = require( 'string!UNIT_RATES/oranges' );
  var orangesCapString = require( 'string!UNIT_RATES/orangesCap' );
  var pearString = require( 'string!UNIT_RATES/pear' );
  var pearCapString = require( 'string!UNIT_RATES/pearCap' );
  var pearsString = require( 'string!UNIT_RATES/pears' );
  var pearsCapString = require( 'string!UNIT_RATES/pearsCap' );
  var carrotString = require( 'string!UNIT_RATES/carrot' );
  var carrotCapString = require( 'string!UNIT_RATES/carrotCap' );
  var carrotsString = require( 'string!UNIT_RATES/carrots' );
  var carrotsCapString = require( 'string!UNIT_RATES/carrotsCap' );
  var cucumberString = require( 'string!UNIT_RATES/cucumber' );
  var cucumberCapString = require( 'string!UNIT_RATES/cucumberCap' );
  var cucumbersString = require( 'string!UNIT_RATES/cucumbers' );
  var cucumbersCapString = require( 'string!UNIT_RATES/cucumbersCap' );
  var potatoeString = require( 'string!UNIT_RATES/potatoe' );
  var potatoeCapString = require( 'string!UNIT_RATES/potatoeCap' );
  var potatoesString = require( 'string!UNIT_RATES/potatoes' );
  var potatoesCapString = require( 'string!UNIT_RATES/potatoesCap' );
  var tomatoeString = require( 'string!UNIT_RATES/tomatoe' );
  var tomatoeCapString = require( 'string!UNIT_RATES/tomatoeCap' );
  var tomatoesString = require( 'string!UNIT_RATES/tomatoes' );
  var tomatoesCapString = require( 'string!UNIT_RATES/tomatoesCap' );

  // constants
  var RAND = new Random();


  /**
   *
   * @constructor
   */
  function Challenges( itemDataProperty ) {

    this.itemDataProperty = itemDataProperty;
    this.populate();
  }

  unitRates.register( 'Challenges', Challenges );

  return inherit( Object, Challenges, {

    /**
     * Populates the initial questions/values for all item types
     * @private
     */
    getQuestionAnswer: function( index ) {

      var itemData = this.itemDataProperty.value;
      var challengeData = this.challengeData[ itemData.type ];

      // FIME: check bounds

      return challengeData[ index ];
    },

    /**
     * Populates the initial questions/values for all item types
     * @private
     */
    populate: function() {

      this.challengeData = {};

      // create questions & answers
      for (var key in ItemData) {
        var itemData = ItemData[ key ];
        this.generateQuestionsAnswersForItem( itemData );
      }
    },

    /**
     * Populates the initial questions/values for item types
     * @private
     */
    generateQuestionsAnswersForItem: function( itemData ) {

      if ( itemData.type === ItemData.RED_CANDY.type   || itemData.type === ItemData.YELLOW_CANDY.type ||
           itemData.type === ItemData.GREEN_CANDY.type || itemData.type === ItemData.BLUE_CANDY.type )  {
        console.log('is candy');
      } else {

        //var name          = this.getNameForItemType(itemData.type, false, false );
        var nameCap       = this.getNameForItemType(itemData.type, false, true );
        var namePlural    = this.getNameForItemType(itemData.type, true, false );
        var namePluralCap = this.getNameForItemType(itemData.type, true, true );

        // Q: Unit rate
        var q0 = new ChallengeQuestionAnswer( unitRateQuestionString, nameCap, itemData.rate );

        // Q: Cost of # <type>?
        var itemCount1 = this.getNextInt( ShoppingConstants.MAX_ITEMS, [] );      // FIXME: this will go away with real data
        var itemCost1 = itemCount1 * itemData.rate;
        var CostOfQuestionString1 =  StringUtils.format( costOfQuestionString, itemCount1, namePlural );
        var q1 = new ChallengeQuestionAnswer( CostOfQuestionString1, null, itemCost1 );

        // Q: Cost of # <type>?
        var itemCount2 =  this.getNextInt( ShoppingConstants.MAX_ITEMS, [ itemCount2 ] ); // FIXME: this will go away with real data
        var itemCost2 = itemCount2 * itemData.rate;
        var CostOfQuestionString2=  StringUtils.format( costOfQuestionString, itemCount2, namePlural );
        var q2 = new ChallengeQuestionAnswer( CostOfQuestionString2, null, itemCost2 );

        // Q: <type> for $?
        var itemCount3 = this.getNextInt( ShoppingConstants.MAX_ITEMS, [] );  // FIXME: this will go away with real data
        var itemCost3 = itemCount3 * itemData.rate;
        var forQuestionString3 =  StringUtils.format( forQuestionString, namePluralCap, Util.toFixed( itemCost3, 2 ) );
        var q3 = new ChallengeQuestionAnswer( forQuestionString3, null, itemCount3 );

        this.challengeData[ itemData.type ] = [ q0, q1, q2, q3 ];
      }
    },

    /**
     *
     * @param {Item.type} type
     * @param {boolean} plural
     * @param {boolean} capitalize
     * @return {string}
     *
     * @private
     *
     */
    getNameForItemType: function( type, plural, capitalize ) {

      var name = '';
      switch( type ) {
          case ItemData.APPLES.type:
            name = ( plural ? ( capitalize ? applesCapString : applesString ) :
                              ( capitalize ? appleCapString : appleString ) );
            break;
          case ItemData.LEMONS.type:
            name = ( plural ? ( capitalize ? lemonsCapString : lemonsString ) :
                              ( capitalize ? lemonCapString : lemonString ) );
            break;
          case ItemData.ORANGES.type:
            name = ( plural ? ( capitalize ? orangesCapString : orangesString ) :
                              ( capitalize ? orangeCapString : orangeString ) );
            break;
          case ItemData.PEARS.type:
            name = ( plural ? ( capitalize ? pearsCapString : pearsString ) :
                              ( capitalize ? pearCapString : pearString ) );
            break;
          case ItemData.CARROTS.type:
            name = ( plural ? ( capitalize ? carrotsCapString : carrotsString ) :
                              ( capitalize ? carrotCapString : carrotString ) );
            break;
          case ItemData.CUCUMBERS.type:
            name = ( plural ? ( capitalize ? cucumbersCapString : cucumbersString ) :
                              ( capitalize ? cucumberCapString : cucumberString ) );
            break;
          case ItemData.POTATOES.type:
            name = ( plural ? ( capitalize ? potatoesCapString : potatoesString ) :
                              ( capitalize ? potatoeCapString : potatoeString ) );
            break;
          case ItemData.TOMATOES.type:
            name = ( plural ? ( capitalize ? tomatoesCapString : tomatoesString ) :
                              ( capitalize ? tomatoeCapString : tomatoeString ) );
            break;
          case ItemData.RED_CANDY.type:
          case ItemData.YELLOW_CANDY.type:
          case ItemData.GREEN_CANDY.type:
          case ItemData.BLUE_CANDY.type:
          default:
            assert && assert( true, 'Unrecognized item type' );
        }

      return name;
    },

    /**
     * Gets a random integer in the range [1 - max] not in the 'taken' list
     * FIXME: this will go away with real data
     *
     * @param {number}
     * @return {number}
     *
     * @private
     *
     */
    getNextInt: function( max, takenList ) {

      var value = 0;
      while( value === 0 || takenList.indexOf( value ) >= 0 ) {
        value = RAND.nextInt( max );
      }

      return value;
    },

    /**
     *
     * @public
     */
    reset: function() {
      this.populate();
    }

  } );

} );
