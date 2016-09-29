
:GENERAL:

- Shelf, Scale & Number Line all use a add/remove/clear/populate mechanism for managing movable items. User draggable
items are managed at the top-most model level (i.e. URShoppingModel & RacingLabModel)

- Positioning & tween animation for all movable nodes is done in the common/model/Movable base class

- The touch area for all movable objects is currently the bounds of the image being used. This is problematic when trying
adjust the touch area. Right now you have to resize the image (see. Racing Lab checkered_flag.png).
There's got to be a better way to handle this.

- When profiling memory usage, if asserts are enabled the sim will leak memory because of the
SUN/buttons/RectangularPushButton's being used. Apparently SUN buttons dispose fails when assertions are enabled, so the
disposes are turned off if asserts are turned on (see sun/#212)

- FuzzMouse memory testing seems to stablize around 30Mb, though I have a sneaking suspecion a few URNumberLineMarkers are
still not getting disposed of properly.

:SHOPPING & SHOPPING LAB:

- The main models (Shelf, Scale & Number Line) are all dervived from ItemCollection which holds multiple arrays of items
(i.e. apples, carrots, etc.. ). Instanced of individual items are moved from one model to another when a user drags them.
(i.e. from shelf to scale or vice versa). The item arrays are switched in each model when the itemTypeProperty changes.

- Any item that is not dragged to the scale drop zone is automatically moved back to the shelf.

:RACING LAB:

