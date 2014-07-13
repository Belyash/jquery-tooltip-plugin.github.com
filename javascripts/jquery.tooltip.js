/*
 *   jQuery Tooltip Plugin
 *   jquery.tooltips.js
 *   jquery.tooltips.css
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
    Object.create = function( obj ) {
        function F(){}
        F.prototype = obj;
        return new F();
    }
}

(function ($, window, undefined) {
    var Tooltip = {
        showed: false, /* just flag */

        init: function (options, el) {
            var self = this;

            self.options =  $.extend({}, $.fn.tooltip.options, options);
            self.$tooltip = options.$tooltip; /* link to current tooltip (need if we use init of plugin more than once) */
            self.el = el;
            self.$el = $(el);

            self.bindEvent();
        },

        bindEvent: function () {
            var self = this,
                $window = $(window);

            if (self.options.event === 'click') {
                self.$el.bind('click.tooltip', function (e) {
                    $window.trigger('hidetooltips');
                    self.show();
                    return false;
                });

                self.$tooltip.bind("click.tooltip", function (e) {
                    e.stopPropagation();
                });

                self.$tooltip.$close.bind("click.tooltip", function (e) {
                    self.hide();

                    e.stopPropagation();
                });

                $window.bind("click.tooltip", function (e) {

                    self.hide();

                }).bind("resize.tooltip scroll.tooltip", function () {
                        /* TODO: call locate from setTimeout() */
                        if(self.showed) {
                            self.locate();
                        }
                    }).bind('hidetooltips', function () {
                        self.hide();
                    });
            } else if(self.options.event === 'hover') {
                self.$tooltip.addClass(self.options.sClass + '_hover');
                self.$el.bind('mouseover.tooltip', function (e) {
                    self.show();
                }).bind('mouseout.tooltip', function (e) {
                        self.hide();
                    });
            }
        },

        show: function () {
            var self = this,
                sHtml = self.$el.find('span.hidden:first').html();

            self.showed = true;
            self.$tooltip.$content.html(sHtml);

            self.$el.addClass(self.options.sActiveClass);

            /* First step: show tooltip to have the block model */
            self.$tooltip.css({display: 'block'});
            /* Second step: relocate tooltip */
            self.locate();
        },

        hide: function () {
            var self = this;

            self.showed = false;
            self.$tooltip.hide();
            self.$el.removeClass(self.options.sActiveClass);
        },

        locate: function () {
            var self = this,
                top = self.$el.offset().top,
                left = self.$el.offset().left,
                options = self.options,
                $window = $(window),
                bIsTheHeight,
                bIsTheWidth;

            /* to the right */
            bIsTheWidth = $window.width() - 20 > left + self.$tooltip.width(); // 20 - width of vertical scrollbar of page

            /* to the bottom */
            bIsTheHeight = $window.height() + $window.scrollTop() > top + self.$tooltip.height();

            /* horizontal tooltip */
            if (!options.vertical && !self.$el.data('vertical')) {
                self.$tooltip.removeClass(options.sClass + '_vertical');

                if (bIsTheWidth) {
                    left += self.$el.outerWidth();
                    self.$tooltip.removeClass(options.sClass + '_left');
                } else {
                    left = left - self.$tooltip.width();
                    self.$tooltip.addClass(options.sClass + '_left');
                }

                if (bIsTheHeight) {
                    self.$tooltip.removeClass(options.sClass + "_top");
                } else {
                    top = top - self.$tooltip.height() + self.$el.outerHeight();
                    self.$tooltip.addClass(options.sClass + "_top");
                }
            /* vertical tooltip */
            } else {
                self.$tooltip.addClass(options.sClass + '_vertical');

                if (bIsTheWidth) {
                    self.$tooltip.removeClass(options.sClass + '_left');
                } else {
                    left -= self.$tooltip.width() - self.$el.outerWidth();
                    self.$tooltip.addClass(options.sClass + '_left');
                }

                if (bIsTheHeight) {
                    top += self.$el.outerHeight();
                    self.$tooltip.removeClass(options.sClass + "_top")
                } else {
                    top = top - self.$tooltip.height();
                    self.$tooltip.addClass(options.sClass + "_top");
                }
            }

            self.$tooltip.css({'top': top, 'left': left});
        }

    };

    $.fn.tooltip = function (params) {
        var options = $.extend({}, $.fn.tooltip.options, params),
            sTooltipClass = options.sClass;

        sTooltipClass += (options.sCssMod !== "") ? " " + options.sCssMod : "";

        options.$tooltip = $('<div class="' + sTooltipClass + '"></div>').appendTo(options.sParent);
        options.$tooltip.$content = $('<div class="' + options.sClass + '__content"></div>').appendTo(options.$tooltip);
        options.$tooltip.$close = $('<i class="' + options.sClass + '__close"></i>').appendTo(options.$tooltip);

        return this.each(function () {
            var tooltip = Object.create(Tooltip);

            tooltip.init(options, this);
        });
    };

    $.fn.tooltip.options = {
        event : "click",
        sParent: 'body', /* parent for div of tooltip */
        sClass: 'i-tooltip', /* CSS-class of tooltip */
        sActiveClass: 'active', /* */
        sCssMod: '', /* this class add to div of tooltip */
        vertical: false /* vertical? */
    };

}(jQuery, window));
