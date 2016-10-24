// Copyright 2016, University of Colorado Boulder

/**
 * The base shopping model - shelf, scale & number line.
 *
 * @author Dave Schmitz (Schmitzware)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ItemData = require( 'UNIT_RATES/common/shopping/model/ItemData' );
  var NumberLine = require( 'UNIT_RATES/common/shopping/model/NumberLine' );
  var Property = require( 'AXON/Property' );
  var Scale = require( 'UNIT_RATES/common/shopping/model/Scale' );
  var Shelf = require( 'UNIT_RATES/common/shopping/model/Shelf' );
  var unitRates = require( 'UNIT_RATES/unitRates' );

  /**
   * @param {ShoppingScene[]} scenes
   * @param {Object} [options]
   * @constructor
   */
  function URShoppingModel( scenes, options ) {

    // validate args
    assert && assert( scenes && scenes.length > 0, 'at least 1 scene is required' );

    options = _.extend( {
      sceneIndex: 0 // {number} index of the scene that is initially selected
    }, options );

    // validate options
    assert && assert( options.sceneIndex >= 0 && options.sceneIndex < scenes.length, 'invalid sceneIndex: ' + options.sceneIndex );

    this.scenes = scenes; // @public (read-only)
    this.sceneProperty = new Property( scenes[ options.sceneIndex ] ); // @public the selected scene

    // @public
    this.itemDataProperty = new Property( this.sceneProperty.value.itemDataProperty.value ); // the currently selected item data

    //TODO why do we need these 2 Properties? they are fields of this.itemDataProperty.value
    this.itemTypeProperty = new Property( this.itemDataProperty.value.type );
    this.itemRateProperty = new Property( this.itemDataProperty.value.rate );

    var self = this;

    // @private
    this.rateMap = {};    // holds the current rates for all item types
    this.initializeRateMap();

    // @public
    this.shelf = new Shelf( this.itemTypeProperty );
    this.scale = new Scale( this.itemTypeProperty, this.itemRateProperty );
    this.numberLine = new NumberLine( this.itemTypeProperty, this.itemRateProperty );

    // when scene changes, link to its itemDataProperty
    var itemDataObserver = function( itemData ) {
      self.itemDataProperty.value = itemData;
    };
    this.sceneProperty.link( function( newScene, oldScene ) {
      oldScene && oldScene.itemDataProperty.unlink( itemDataObserver );
      newScene.itemDataProperty.link( itemDataObserver );
    } );

    // save the potentially adjusted rate and change the current type and rate on an item data change
    this.itemDataProperty.link( function( itemData, oldItemData ) {

      // save old rate which may have been changed
      if ( oldItemData ) {
        self.rateMap[ oldItemData.type ] = self.itemRateProperty.value;
      }

      // set new type & rate
      self.itemTypeProperty.value = itemData.type;
      self.itemRateProperty.value = self.rateMap[ itemData.type ];
    } );
  }

  unitRates.register( 'URShoppingModel', URShoppingModel );

  return inherit( Object, URShoppingModel, {

    // no dispose, persists for the lifetime of the sim.

    // @public
    reset: function() {

      this.shelf.reset();
      this.scale.reset();
      this.numberLine.reset();

      // scenes
      this.scenes.forEach( function( scene ) {
        scene.reset();
      } );

      // Properties
      this.sceneProperty.reset();
      this.itemDataProperty.reset();
      this.itemTypeProperty.reset();
      this.itemRateProperty.reset();
    },

    /**
     * create rate entries for each item type (i.e. apples, carrots, etc..)
     *
     * @public
     * @override
     */
    initializeRateMap: function() {
      var self = this;

      for ( var key in ItemData ) {
        var itemData = ItemData[ key ];
        self.rateMap[ itemData.type ] = itemData.rate;
      }
    },

    /**
     * Removes an item from the shelf and adds it to the scale
     *
     * @param {Item} item
     * @public
     */
    addShelfItemToScale: function( item ) {

      // Remove from shelf & add to scale
      this.shelf.removeItem( item );
      this.scale.addItem( item );
    },

    /**
     * Removes an item from the scale and adds it to the shelf
     *
     * @param {Item} item
     * @public
     */
    addScaleItemToShelf: function( item ) {

      // Remove from scale & add to shelf
      this.scale.removeItem( item );
      this.shelf.addItem( item );
    },

    /**
     * Adds all items on the scale to the number line (Note: the number line will ignore duplicates)
     *
     * @public
     */
    addScaleItemsToNumberLine: function() {

      // create a new item on the number line representing the total number/weight of items currently on the scale
      var count = this.scale.getItemCount();
      if ( count > 0 ) {
        // The correct answers
        var correctCost = ( count * this.itemRateProperty.value );
        var correctUnit = ( count );

        this.numberLine.createMarker( correctCost, correctUnit, {} );
      }
    }

  } ); // inherit

} ); // define
