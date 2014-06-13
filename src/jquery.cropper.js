var cropper = (function($) {
    var crop_image = function(img, selection) {
        var output_canvas = document.createElement('canvas');
        output_canvas.width = selection.w;
        output_canvas.height = selection.h;

        var output_ctx = output_canvas.getContext('2d');
        output_ctx.drawImage(img, selection.x, selection.y, selection.w, selection.h, 0, 0, selection.w, selection.h);
        
        return output_canvas.toDataURL();
    }

    var CropModal = function(dimension, callback) {
        if(callback === undefined) callback = function(data) {};
        
        this.output = "data:text;base64,not set";

        console.log("not implemented: open modal");
        this.$modal = $("#modal");
        console.log("not implemented: set save button to trigger upload");

        this.set_image = function(img_url) {
            console.log("not implemented: set image");
            var $img = $("#lolfail")[0];
            console.log("not implemented: get image");

            console.log("not included dependency: Jcrop");

            var set_output = function(selection) {
                this.output = crop_image($img, selection);
            }

            $img.Jcrop({
                bgColor: 'black',
                bgOpacity: .6,
                setSelect: [0, 0, dimension.x, dimension.y],
                aspectRatio: dimension.x / dimension.y,
                onSelect: set_output,
                onChange: set_output
            });
        }
    };

    return {
        crop_image: function(file, selection) {
            return crop_image(file, selection);
        },
        new_crop_modal: function(dimension, callback) {
            return new CropModal(dimension, callback);
        },
        prompt_crop_image: function(file, dimension, callback) {
            var crop_modal = new CropModal(dimension, callback);

            var reader = new FileReader();
            reader.onload = (function(img_file) {
                return function(e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function() {
                        var canvas = document.createElement('canvas');
                        canvas.width = 500;
                        canvas.height = image.height * (canvas.width / image.width);
                        var ctx = canvas.getContext('2d');
                        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                        crop_modal.set_image(canvas.toDataURL());
                    };
                }
            })(file);

            reader.readAsDataURL(file);
        }
    }
})(jQuery);

(function($) {
    var register_trigger = function(dimensions, callback) {
        var start_cropping = function(e) {
            e.stopPropagation();
            e.preventDefault();
            var file = e.dataTransfer !== undefined ? e.dataTransfer.files[0] : e.target.files[0];

            cropper.prompt_crop_image(file, dimensions, callback);
        }

        this.addEventListener('click', function() {this.value = null;}, false);
        this.addEventListener('change', start_cropping, false);
    }

    $.fn.trigger_cropping = register_trigger;
})(jQuery);
