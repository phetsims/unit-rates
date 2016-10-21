// Copyright 2016, University of Colorado Boulder

/**
 * A collapsible box node containing (several) spinners for changing the current unit rate
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var AccordionBox = require( 'SUN/AccordionBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemData = require( 'UNIT_RATES/common/shopping/model/ItemData' );
  var Node = require( 'SCENERY/nodes/Node' );
  var NumberPicker = require( 'SCENERY_PHET/NumberPicker' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var unitRates = require( 'UNIT_RATES/unitRates' );
  var URConstants = require( 'UNIT_RATES/common/URConstants' );
  var Util = require( 'DOT/Util' );

  // strings
  var dollarsString = require( 'string!UNIT_RATES/dollars' );
  var poundsString = require( 'string!UNIT_RATES/pounds' );
  var rateString = require( 'string!UNIT_RATES/rate' );

  // constants
  var TEXT_FONT = new PhetFont( 18 ); // Font to use for all text
  var TEXT_MAX_WIDTH = 80;
  var DIVISOR_WIDTH = 135;
  var X_MARGIN = 20;
  var Y_MARGIN = 0;
  var X_SPACING = 20;
  var Y_SPACING = 10;

  //TODO yuck
  var APPLES_INDEX = 0;
  var CARROTS_INDEX = 1;
  var CANDY_INDEX = 2;

  /**
   * @param {Property.<string>} itemTypeProperty - the currently selected item type
   * @param {Property.<number>} itemRateProperty - the currently selected item rate
   * @param {Object} [options]
   * @constructor
   */
  function ItemRateNode( itemTypeProperty, itemRateProperty, options ) {

    // @private
    this.itemTypeProperty = itemTypeProperty;
    this.itemRateProperty = itemRateProperty;
    this.itemPickerIndex = APPLES_INDEX;
    this.costRangeProperty = new Property( new Range( 1, 20 ) );
    this.countRangeProperty = new Property( new Range( 1, 20 ) );

    // @private
    this.itemPickerData = [
      {
        // APPLES_INDEX
        costProperty: new Property( 1 ),   // initial number picker apples cost
        costPicker: null,
        countProperty: new Property( 2 ),   // initial number picker apples count
        countPicker: null,
        countPickerColor: 'rgb(233,33,45)',
        countPickerPressedColor: 'rgb(203,3,15)',
        countString: ItemData.APPLES.pluralName,
        visible: true
      }, {
        // CARROTS_INDEX
        costProperty: new Property( 2 ),
        costPicker: null,
        countProperty: new Property( 5 ),
        countPicker: null,
        countPickerColor: 'rgb(241,128,48)',
        countPickerPressedColor: 'rgb(211,98,18)',
        countString: ItemData.CARROTS.pluralName,
        visible: false
      }, {
        // CANDY_INDEX
        costProperty: new Property( 5 ),
        costPicker: null,
        countProperty: new Property( 1 ),
        countPicker: null,
        countPickerColor: 'rgb(144,74,154)',
        countPickerPressedColor: 'rgb(114,44,124)',
        countString: poundsString,
        visible: false
      }
    ];

    this.contentNode = new Node(); // @private

    // layout adjustment
    var strut = new HStrut( DIVISOR_WIDTH + 2 * X_MARGIN );   // This will set the width of the panel
    this.contentNode.addChild( strut );

    // need to create separate pickers for dealing with multiple properties and different NumberPicker colors
    for ( var i = 0; i < this.itemPickerData.length; i++ ) {

      // select the rate for the currently selected item - no dispose as these never go away
      Property.lazyMultilink( [ this.itemPickerData[ i ].costProperty, this.itemPickerData[ i ].countProperty ],
        this.rateChanged.bind( this ) );

      this.itemPickerData[ i ].costPicker = new NumberPicker( this.itemPickerData[ i ].costProperty,
        this.costRangeProperty, {
          left: X_MARGIN,
          top: Y_MARGIN,
          color: 'rgb(50,50,50)',
          pressedColor: 'black',
          xMargin: 8,
          yMargin: 0,
          cornerRadius: 0,
          touchAreaXDilation: 30,
          font: TEXT_FONT,
          visible: this.itemPickerData[ i ].visible
        } );
      this.contentNode.addChild( this.itemPickerData[ i ].costPicker );

      this.itemPickerData[ i ].countPicker = new NumberPicker( this.itemPickerData[ i ].countProperty,
        this.countRangeProperty, {
          left: X_MARGIN,
          top: this.itemPickerData[ i ].costPicker.bottom + 2 * Y_SPACING,
          color: this.itemPickerData[ i ].countPickerColor,
          pressedColor: this.itemPickerData[ i ].countPickerPressedColor,
          xMargin: 8,
          yMargin: 0,
          cornerRadius: 0,
          touchAreaXDilation: 30,
          font: TEXT_FONT,
          visible: this.itemPickerData[ i ].visible
        } );
      this.contentNode.addChild( this.itemPickerData[ i ].countPicker );
    }

    // @private
    this.currencyText = new Text( dollarsString, {
      left: this.itemPickerData[ APPLES_INDEX ].costPicker.right + X_SPACING,
      centerY: this.itemPickerData[ APPLES_INDEX ].costPicker.centerY,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );
    this.contentNode.addChild( this.currencyText );

    var divisorLine = new Path( new Shape()
      .moveTo( this.itemPickerData[ APPLES_INDEX ].costPicker.left,
        this.itemPickerData[ APPLES_INDEX ].costPicker.bottom + Y_SPACING )
      .lineTo( this.itemPickerData[ APPLES_INDEX ].costPicker.left + DIVISOR_WIDTH,
        this.itemPickerData[ APPLES_INDEX ].costPicker.bottom + Y_SPACING ), {
      stroke: 'black',
      lineWidth: 1.25
    } );
    this.contentNode.addChild( divisorLine );

    // @private
    this.unitText = new Text( ItemData.APPLES.pluralName, {
      left: this.itemPickerData[ APPLES_INDEX ].countPicker.right + X_SPACING,
      centerY: this.itemPickerData[ APPLES_INDEX ].countPicker.centerY,
      font: TEXT_FONT,
      maxWidth: TEXT_MAX_WIDTH
    } );
    this.contentNode.addChild( this.unitText );

    // @private
    this.expandedProperty = new Property( true );
    AccordionBox.call( this, this.contentNode, {
      expandedProperty: this.expandedProperty,
      fill: 'white',
      cornerRadius: 10,
      buttonLength: 20,
      buttonXMargin: 15,
      buttonYMargin: 15,
      titleNode: new Text( rateString, { font: URConstants.PANEL_TITLE_FONT, maxWidth: 100 } ),
      titleAlignX: 'left',
      showTitleWhenExpanded: true,
      contentAlign: 'center',
      contentXMargin: 0,
      contentYMargin: 10
    } );

    //TODO visibility annotations, https://github.com/phetsims/unit-rates/issues/63
    // refresh on item change
    this.itemSelectionChangedBound = this.itemSelectionChanged.bind( this );
    this.itemTypeProperty.link( this.itemSelectionChangedBound );

    this.mutate( options );
  }

  unitRates.register( 'ItemRateNode', ItemRateNode );

  return inherit( AccordionBox, ItemRateNode, {

    // no dispose, persists for the lifetime of the sim.

    /**
     * Resets the challenges questions to all unanswered
     *
     * @public
     */
    reset: function() {
      for ( var i = 0; i < this.itemPickerData.length; i++ ) {
        this.itemPickerData[ i ].costProperty.reset();
        this.itemPickerData[ i ].countProperty.reset();
      }
      this.expandedProperty.reset();

      this.itemPickerIndex = APPLES_INDEX;
    },

    /**
     * Called when the user selected a new item type (i.e. 'apples', 'carrots', 'red candy')
     *
     * @param {string} itemType - the currently selected item type
     * @param {string} oldType - the previously selected item type
     * @private
     */
    itemSelectionChanged: function( itemType, oldType ) {

      // hide all pickers
      for ( var i = 0; i < this.itemPickerData.length; i++ ) {
        this.itemPickerData[ i ].costPicker.visible = false;
        this.itemPickerData[ i ].countPicker.visible = false;
      }

      // map item type to picker index
      switch( itemType ) {
        case ItemData.APPLES.type:
          this.itemPickerIndex = APPLES_INDEX;
          break;
        case ItemData.CARROTS.type:
          this.itemPickerIndex = CARROTS_INDEX;
          break;
        case ItemData.PURPLE_CANDY.type:
          this.itemPickerIndex = CANDY_INDEX;
          break;
        default:
          assert && assert( false, 'Unrecognized ite type' );
      }

      // set up the current picker
      this.itemPickerData[ this.itemPickerIndex ].costPicker.visible = true;
      this.itemPickerData[ this.itemPickerIndex ].countPicker.visible = true;
      this.unitText.setText( this.itemPickerData[ this.itemPickerIndex ].countString );
    },

    /**
     * Called when the user changes the total cost or item count
     * Changes the unit rate for the item currently used in the sim
     *
     * @param {number} cost - total cost
     * @param {number}count - number of items
     * @private
     */
    rateChanged: function( cost, count ) {

      // save the number picker values
      this.itemPickerData[ this.itemPickerIndex ].costProperty.value = cost;
      this.itemPickerData[ this.itemPickerIndex ].countProperty.value = count;

      var decimals = 2;
      var rate = cost / count;
      this.itemRateProperty.value = Number( Util.roundSymmetric( rate.toString() + 'e' + decimals.toString() ) + 'e-' + decimals );
    }

  } );  // define

} );  // inherit
