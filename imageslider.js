//***********************************************************//
//Image Slider plugin v1.0 - 15/06/2019
//***********************************************************//
$.fn.imageSlider = function (options) {
	//wrap the input with a <div>
    this.wrap("<div class='imageSlider'></div>");
	//plugin settings with default values
    var settings = $.extend({
        sliderWidth: 600,
        sliderHeight: 400,
        sliderDirection: "ltr",
        showNavigation: true,
        navigationPosition: "sides",
        navigationType: "arrows",
        navigationOrientation: "horizontal",
        autoPlay: true,
        autoPlayFrequency: 5000
    }, options);
    $(".imageSlider").css("width", settings.sliderWidth);
    $(".imageSlider").css("height", settings.sliderHeight);    
    if (settings.sliderDirection == null || settings.sliderDirection.length == 0) {
        settings.sliderDirection = "ltr";
    }
    if (settings.navigationOrientation == null || settings.navigationOrientation.length == 0) {
        settings.navigationOrientation = "horizontal";
    }
    $(".imageSlider").attr("data-direction", settings.sliderDirection);
    $(".imageSlider").attr("data-orientation", settings.navigationOrientation);
    if (settings.showNavigation == true && this.find("li").length > 1) {        
        if (settings.navigationPosition == null || settings.navigationPosition.length == 0) {
            settings.navigationPosition = "sides";
        }
        if (settings.navigationType == null || settings.navigationType.length == 0) {
            settings.navigationType = "arrows";
        }

        $(".imageSlider").append("<div class='navigationHolder' data-position='" + settings.navigationPosition + "'></div>");
        var arrowNext = document.createElement("div");
        $(arrowNext).addClass("navigationNext");
        $(arrowNext).attr("title", "Next");        
        var arrowPrev = document.createElement("div");
        $(arrowPrev).addClass("navigationPrev");
        $(arrowPrev).attr("title", "Previous");
        if (settings.sliderDirection == "ltr") {
            $(arrowPrev).append("<i class='fa fa-chevron-left'></i>");
            $(arrowNext).append("<i class='fa fa-chevron-right'></i>");
        }
        else {
            $(arrowPrev).append("<i class='fa fa-chevron-right'></i>");
            $(arrowNext).append("<i class='fa fa-chevron-left'></i>");
        }        
        if (settings.navigationOrientation == "vertical") {
            $(arrowNext).find(".fa").removeClass("fa-chevron-right");
            $(arrowNext).find(".fa").addClass("fa-chevron-down");
            $(arrowPrev).find(".fa").removeClass("fa-chevron-left");
            $(arrowPrev).find(".fa").addClass("fa-chevron-up");
        }

        if (settings.navigationPosition == "sides") {
            $(".navigationHolder").append($(arrowNext));
            $(".navigationHolder").append($(arrowPrev));
        }
        if (settings.navigationPosition == "top" || settings.navigationPosition == "bottom") {
            $(".navigationHolder").attr("data-orientation", settings.navigationOrientation);
            if (settings.navigationType == "arrows") {
                $(".navigationHolder").append($(arrowNext));
                $(".navigationHolder").append($(arrowPrev));
            }
            else {
                var pageCount = this.find("li").length;
                var pager = document.createElement("div");
                $(pager).addClass("pager");
                if (settings.navigationType == "numeric") {
                    $(pager).addClass("numeric");
                    for (i = 0; i < pageCount; i++) {
                        var currentPage = parseInt(i + 1);
                        $(pager).append("<span title='" + currentPage + "' data-page='" + i + "'>" + currentPage + "</span>");
                    }
                }
                if (settings.navigationType == "dots") {
                    for (i = 0; i < pageCount; i++) {
                        var currentPage = parseInt(i + 1);
                        $(pager).append("<span title='" + currentPage + "' data-page='" + i + "'></span>");
                    }
                }                
                $(".navigationHolder").append($(pager));
            }
        }
        var totalWidth = 0;
        var height = 0;
        var slidesCount = this.find("li").length;
        var sliderWidth = $(".imageSlider").width();
        var sliderHeight = $(".imageSlider").height();
        var firstSlide = this.find("li:first-child");
        $(firstSlide).addClass("active");
        var firstPage = $(".navigationHolder .pager span:first-child");
        $(firstPage).addClass("active");
        for (i = 0; i <= slidesCount; i++) {
            var me = this.find("li")[i];
            totalWidth = totalWidth + $(me).width();
            height = $(me).height();
            var x = (i * sliderWidth);
            var y = (i * sliderHeight);
            if (settings.navigationOrientation == "horizontal") {
                if (settings.sliderDirection == "ltr") {
                    $(me).css("left", "-" + x + "px");
                }
                else {
                    $(me).css("right", "-" + x + "px");
                }
                $(me).css("top", 0);
            }
            if (settings.navigationOrientation == "vertical") {
                $(me).css("left", 0);
                $(me).css("top", "-" + y + "px");
            }
        }
        this.css("width", totalWidth);
        this.css("height", height);
    }
    $(".navigationHolder .pager span").click(function () {
        var pageIndex = $(this).data("page");
        navigate(pageIndex, false, settings);
    });    
    $(".navigationHolder .navigationNext").click(function () {
        var slidesNumber = parseInt($(".imageSlider").find("li").length);
        var activeSlide = $(".imageSlider li.active");
        var activeSlidePosition = parseInt($(activeSlide).index());
        var nextSlide = (activeSlidePosition == (slidesNumber - 1) ? 0 : (activeSlidePosition + 1));
        navigate(nextSlide, false, settings);
    });
    $(".navigationHolder .navigationPrev").click(function () {
        var slidesNumber = parseInt($(".imageSlider").find("li").length);
        var activeSlide = $(".imageSlider li.active");
        var activeSlidePosition = parseInt($(activeSlide).index());
        var prevSlide = (activeSlidePosition == 0 ? (slidesNumber - 1) : (activeSlidePosition - 1));
        navigate(prevSlide, false, settings);
    });
    if (settings.autoPlay == true && this.find("li").length > 1) {
        navigate(0, true, settings);
    }
};
var fn;
function navigate(index, auto, settings) {
    var slide = $(".imageSlider").find("li")[index];
    $(slide).addClass("active");
    $(slide).css("top", 0);
    if (settings.sliderDirection == "ltr") {
        $(slide).css("left", 0);
    }
    else {
        $(slide).css("right", 0);
    }
    $(slide).siblings().removeClass("active");
    var prevSlides = $(slide).prevAll();
    var nextSlides = $(slide).nextAll();
    var sliderWidth = $(".imageSlider").width();
    var sliderHeight = $(".imageSlider").height();
    for (var i = $(prevSlides).length; i >= 0; i--) {
        var me = $(prevSlides)[i - 1];
        if (settings.navigationOrientation == "horizontal") {
            var x = (i * sliderWidth);
            if (settings.sliderDirection == "ltr") {
                $(me).css("left", x + "px");
            }
            else {
                $(me).css("right", x + "px");
            }
        }
        if (settings.navigationOrientation == "vertical") {
            var y = (i * sliderHeight);
            $(me).css("top", y + "px");
        }
    }
    for (var i = 0; i <= $(nextSlides).length; i++) {
        var me = $(nextSlides)[i - 1];
        if (settings.navigationOrientation == "horizontal") {
            var x = (i * sliderWidth);
            if (settings.sliderDirection == "ltr") {
                $(me).css("left", "-" + x + "px");
            }
            else {
                $(me).css("right", "-" + x + "px");
            }
        }
        if (settings.navigationOrientation == "vertical") {
            var y = (i * sliderHeight);
            $(me).css("top", "-" + y + "px");
        }
    }
    var pager = $(".navigationHolder .pager span[data-page=" + index + "]");
    $(pager).addClass("active");
    $(pager).siblings().removeClass("active");
    if (auto == true) {
        var slidesNumber = parseInt($(".imageSlider").find("li").length);
        var activeSlide = $(".imageSlider li.active");
        var activeSlidePosition = parseInt($(activeSlide).index());
        var nextSlide = (activeSlidePosition == (slidesNumber - 1) ? 0 : (index + 1));
        fn = setTimeout(function () {            
            navigate(nextSlide, auto, settings);
        }, settings.autoPlayFrequency);
    }
    else {
        clearTimeout(fn);
    }
}