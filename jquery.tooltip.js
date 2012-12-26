/*
 *   jQuery Tooltip Plugin
 *   jquery.tooltip.js
 *   jquery.tooltip.css
 *
 *   Example:
 *      HTML:
 *      <i class="selector">show tooltip<span class="hidden">This is tooltip text</span></i>
 *
 *      JS:
 *      $('.selector').tooltip();
 *
 */
if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
        function F () {}
        F.prototype = obj;
        return new F();
    }
}

(function ($, windwow, undefined) {
    var Tooltip = {
        showed: false, 
        
        init: function (options, elem) {
            var self = this;

            self.options =  $.extend({}, $.fn.tooltip.options, options);
            self.$tooltip = options.$tooltip;
            self.elem = elem;
            self.$elem = $(elem);

            self.bindEvent();
        },

        bindEvent: function () {
            var self = this,
                $window = $(window);

            if (self.options.event === 'click') {
                self.$elem.bind('click.tooltip', function (e) {
                    $window.trigger('hidetooltips');
                    self.show();

                    e.stopPropagation();
                });

                self.$tooltip.bind("click.tooltip", function (e){
                    e.stopPropagation();
                });

                self.$tooltip.$close.bind("click.tooltip", function (e) {
                    self.hide();

                    e.stopPropagation();
                });

                $window.bind("click.tooltip", function (e) {
                    self.hide();

                    e.stopPropagation();
                }).bind("resize.tooltip scroll.tooltip", function (){
                        if (self.showed) {
                            self.locate();
                        }
                    }).bind('hidetooltips', function(){
                        self.hide();
                    });
            }
            else if (self.options.event === 'hover') {
                self.$tooltip.addClass(self.options.sHtmlClass + '_hover');
                self.$elem.bind('mouseover.tooltip', function (e) {
                    self.show();
                }).bind('mouseout.tooltip', function (e) {
                        self.hide();
                    });
            }
        },

        show: function () {
            var self = this,
                sHtml = self.$elem.find('span.hidden:first').html();

            self.showed = true;
            self.$tooltip.$content.html(sHtml);

            self.$elem.addClass(self.options.sActiveClass);
            
            self.$tooltip.css({display: 'block'});
            
            self.locate();
        },

        hide: function () {
            var self = this;

            self.showed = false;
            self.$tooltip.hide();
            self.$elem.removeClass(self.options.sActiveClass);
        },

        locate: function () {
            var self = this,
                top = self.$elem.offset().top,
                left = self.$elem.offset().left,
                options = self.options,
                $window = $(window),
                bIsTheHeight,
                bIsTheWidth;

            bIsTheWidth = $window.width() > left + self.$tooltip.width();
            bIsTheHeight = $window.height() + $window.scrollTop() > top + self.$tooltip.height();

            if (!options.vertical && !self.$elem.data('vertical')) {
                self.$tooltip.removeClass(options.sHtmlClass + '_vertical');

                if (bIsTheWidth) {
                    left += self.$elem.outerWidth();
                    self.$tooltip.removeClass(options.sHtmlClass + '_left');
                } else {
                    left = left - self.$tooltip.width();
                    self.$tooltip.addClass(options.sHtmlClass + '_left');
                }

                if (bIsTheHeight) {
                    self.$tooltip.removeClass(options.sHtmlClass + "_top");
                } else {
                    top = top - self.$tooltip.height() + self.$elem.outerHeight();
                    self.$tooltip.addClass(options.sHtmlClass + "_top");
                }
            } else {
                self.$tooltip.addClass(options.sHtmlClass + '_vertical');

                if (bIsTheWidth) {
                    self.$tooltip.removeClass(options.sHtmlClass + '_left');
                } else {
                    left -= self.$tooltip.width() - self.$elem.outerWidth();
                    self.$tooltip.addClass(options.sHtmlClass + '_left');
                }

                if (bIsTheHeight) {
                    top += self.$elem.outerHeight();
                    self.$tooltip.removeClass(options.sHtmlClass + "_top")
                } else {
                    top = top - self.$tooltip.height();
                    self.$tooltip.addClass(options.sHtmlClass + "_top");
                }
            }

            self.$tooltip.css({ 'top': top, 'left': left});
        }

    };

    $.fn.tooltip = function (params) {
        var options = $.extend({}, $.fn.tooltip.options, params),
            sTooltipClass = options.sHtmlClass;

        sTooltipClass += (options.sHtmlMod !== '') ? ' ' + options.sHtmlMod : '';

        options.$tooltip = $('<div class="' + sTooltipClass + '"></div>').appendTo( options.sParent );
        options.$tooltip.$content = $('<div class="' + options.sHtmlClass + '__content"></div>').appendTo( options.$tooltip );
        options.$tooltip.$close = $('<i class="' + options.sHtmlClass + '__close"></i>').appendTo( options.$tooltip );

        return this.each(function () {
            var tooltip = Object.create(Tooltip);

            tooltip.init(options, this);
        });
    };

    $.fn.tooltip.options = {
        event : "click",
        sParent: 'body div.layout:first',
        sHtmlClass: 'i-tooltip',
        sActiveClass: 'active',
        sHtmlMod: '',
        vertical: false
    };

})(jQuery, window, undefined);
