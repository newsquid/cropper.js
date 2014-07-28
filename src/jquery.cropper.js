var cropper = (function($) {
    var crop_image = function(img, selection, scaleWidth) {
        var should_scale_width = scaleWidth !== undefined;

        var output_canvas = document.createElement('canvas');
        output_canvas.width = should_scale_width ? scaleWidth : selection.w;
        output_canvas.height = should_scale_width ? scaleWidth * (selection.h/selection.w) : selection.h;

        var output_ctx = output_canvas.getContext('2d');
        output_ctx.drawImage(img, selection.x, selection.y, selection.w, selection.h, 0, 0, output_canvas.width, output_canvas.height);
        
        return output_canvas.toDataURL();
    }

    var CropModal = function(options, callback) {
        if(callback === undefined) callback = function(data, proportions) {};
        
        this.output_img = "data:text;base64,not set";
        this.output_properties = {
            height: 0,
            width: 0,
            x: 0,
            y: 0
        };

        this.$modal = $('<div class="modal fade"><div class="modal-dialog modal-lg"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal">&times;</button><h4 class="modal-title">Crop Image</h4></div><div class="modal-body"></div><div class="modal-footer"><button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button><button type="button" class="btn btn-primary submit-crop" disabled>Submit cropping</button></div></div></div></div>').appendTo("body").modal({
            backdrop: 'static'
        });

        this.set_image = function(img_url) {
            var $img = $('<img src="'+img_url+'">').appendTo(this.$modal.find('.modal-body'));

            var crop_modal = this;
            var $modal = this.$modal;
            var submit_crop_btn = $modal.find('.submit-crop');

            var set_output = function(selection) {
                if(selection.h > 0 && selection.w > 0) {
                    crop_modal.output = crop_image($img[0], selection, options.scaleWidth);
                }
                
                crop_modal.output_properties = {
                    height: selection.h,
                    width: selection.w,
                    x: selection.x,
                    y: selection.y
                };
            }

            submit_crop_btn.click(function() {
                callback(crop_modal.output, crop_modal.output_properties);
                $modal.modal('hide');
            }).attr("disabled", null);

            var jcrop_settings = {
                bgColor: 'black',
                bgOpacity: .6,
                setSelect: [options.rawWidth / 4, options.rawHeight / 4, (3 * options.rawWidth) / 4, (3 * options.rawHeight) / 4],
                onSelect: set_output,
                onChange: set_output
            };
            
            if(options.aspectRatio) {
                $.extend(jcrop_settings, { aspectRatio: options.aspectRatio });
            }
            
            $img.Jcrop(jcrop_settings);
        }
    };

    return {
        crop_image: crop_image,
        new_crop_modal: function(options, callback) {
            return new CropModal(options, callback);
        },
        prompt_crop_image: function(file, options, callback) {   
            var reader = new FileReader();
            reader.onload = (function(img_file) {
                return function(e) {
                    var image = new Image();
                    image.src = e.target.result;
                    image.onload = function() {
                        var canvas = document.createElement('canvas');
                        
                        var raw_width = image.width < 858 ? image.width : 858;
                        $.extend(options, {
                            rawWidth: raw_width,
                            rawHeight: image.height * (raw_width / image.width)
                        });
                        
                        var crop_modal = new CropModal(options, callback);
                        
                        canvas.width = options.rawWidth;
                        canvas.height = options.rawHeight;
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
    var register_trigger = function(options, callback) {
        var start_cropping = function(e) {
            e.stopPropagation();
            e.preventDefault();
            var file = e.dataTransfer !== undefined ? e.dataTransfer.files[0] : e.target.files[0];

            cropper.prompt_crop_image(file, options, callback);
        }

        this[0].addEventListener('click', function() {this.value = null;}, false);
        this[0].addEventListener('change', start_cropping, false);
    }

    $.fn.trigger_cropping = register_trigger;
})(jQuery);
