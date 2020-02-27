/* eslint-disable */
var img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
