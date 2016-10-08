"use strict";

!(function($){
    var global = {
        w: window,
        d: document,
        drop: function(list){
            list.each(function(i){
                $(this).addClass("drop_" + (i + 1));
            });
        },
        slider: function(obj){
            if(obj.length){
                obj.slick({
                    dots: true,
                    prevArrow: '<button type="button" class="slick-prev"> </button>',
                    nextArrow: '<button type="button" class="slick-next"> </button>'
                });
                var new_prev = $("button.slick-prev").detach(),
                    slick_dots = $(".slick-dots").detach();
                new_prev.appendTo(obj);
                $(".slick-arrow").wrapAll("<div class='new_wrap_button'></div>");
                $(".new_wrap_button").find(".slick-prev").detach();
                slick_dots.appendTo(".new_wrap_button");
                new_prev.appendTo(".new_wrap_button");
            }
        },
        init: function(){
            this.drop($(".headerNavDropWrapList").find("li > a"));
            this.slider($(".slider"));
        }
    };
    global.init();
})(jQuery);