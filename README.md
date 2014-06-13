cropper.js
==========

Cropper.js provides a visual interface (using jQuery, Jcrop and Bootstrap modals) for cropping images.

An interface is also provided for a few, simple cropping-related operations. For example `cropper.crop_image(img, selection)` takes a jQuery selection of an image (eg. `$("img")[0]`) and an object describing the crop (coordinates for top-left point of cropping, x and y; and width and height of the selection, w and h).

Credit where credit is due...
-----------------------------

Following is a list of resources used in the development of the library.

* [*Jcrop + canvas = Client Side Image Crop*](http://marx-tseng.appspot.com/image_crop/index.html) by Marx Tseng
