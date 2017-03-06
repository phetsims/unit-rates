# Unit Rates - implementation notes

This document contains miscellaneous notes related to the implementation of Unit Rates. It
supplements the internal (source code) documentation, and (hopefully) provides insight into
"big picture" implementation issues.  The audience for this document is software developers who are familiar
with JavaScript and PhET simulation development (as described in [PhET Development Overview]
(http://bit.ly/phet-html5-development-overview)).

First, read [model.md](https://github.com/phetsims/unit-rates/blob/master/doc/model.md), which provides
a high-level description of the simulation model.

## Terminology

This section enumerates terms that you'll see used throughout the internal and external documentation.
In addition to helping you understand the code, they're useful when creating GitHub issues.

General:

* denominator - the second term in a rate, corresponds to the bottom number line
* double number line - a pair of number lines, used to diagram rates
* edit button - yellow button with a pencil icon, pressing it opens a keypad, for editing some value
* keypad - for entering numeric values
* marker - vertical line with values above and below, appears on double number line, used to indicate a rate 
* marker editor - user-interface component used to manually create markers on the double number line 
* numerator - the first term in a rate, corresponds to the top number line
* rate - a ratio where the terms are in different units 
* ratio - a comparison of 2 numbers
* term - one of the 2 numbers in a ratio
* unit rate - a rate where the denominator is 1

Shopping and Shopping Lab screens:

* bag - a bag of items (Apples, Carrots, Purple Candy, etc.)
* category - one of 3 collection of items: fruit, vegetables, candy
* category radio buttons - used to select a category
* item - the fundamental type of thing in the shopping screens
* items combo box - used to select an item
* "Refresh Questions" button - button in the lower-left corner of the Questions accordion box, cycles through questions
* "Reset Shelf" button - button to the left of the shelf, resets the shelf to its initial state
* scale - place bags and items here to display their corresponding cost and (optionally) 
* shelf - place below the scale where bags and items live
* spinner - user-interface control for changing one of the terms in the Rate accordion box

Racing Lab screen:

* cue arrows - green arrows that initially appear around the finish flag
* finish flag - checkered flag that appear at the finish line, move it to change track length
* car position indicator - small colored rectangle that moves along the double number line to indicate car position
* timer - indicates the time for a race
* scene radio buttons - used to select between 1 or 2 cars
* start/stop button - used to start and stop the race
* start flag - flag that appears at the starting line on the track
* track - car moves along this during a race
* track markers - triangles that are spaced at 50-mile intervals below the track

## General

This section describes how this simulation uses patterns that are common to most PhET simulations.

**Model-view transform**: All model-view transforms are concerned solely with the horizontal dimension,
for which we use a linear function. For the double number line, see `modelToViewNumerator` and `modelToViewDenominator` 
in `DoubleNumberLine`. For the race track, see `modelToView` in `RaceTrackNode`.

**Query parameters**: Query parameters are used to enable sim-specific features, mainly for debugging and
testing. All such query parameters are documented in
[URQueryParameters](https://github.com/phetsims/unit-rates/blob/master/js/common/URQueryParameters.js).

**Memory management**: The model exists for the lifetime of the simulation. Large portions of the view are 
reconstructed when the selected item changes. So `dispose` is implemented throughout, and all function calls 
that register an observer have an associated comment indicating whether a corresponding de-register call is 
required. For example, in `CostNode`:

```js
var costObserver = function( cost ) {...};
costProperty.link( costObserver ); // unlink in dispose
```

## Shopping and Shopping Lab screens

## Racing Lab screen