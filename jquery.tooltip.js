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
if(typeof Object.create !== 'function') {
    Object.create = function( obj ) {
        function F(){}
        F.prototype = obj;
        return new F();
    }
}

(function($, windwow, undefined) {
    var Tooltip = {
        showed: false, // Флаг состояния тултипа

        init: function( options, elem ) {
            var self = this;

            self.options =  $.extend({}, $.fn.tooltip.options, options);
            self.$tooltip = options.$tooltip; // ссылка на тултип для текущего вызова плагина
            self.elem = elem;
            self.$elem = $( elem );

            self.bindEvent();
        },

        bindEvent: function() {
            var self = this,
                $window = $(window);

            if(self.options.event === 'click') {
                self.$elem.bind('click.tooltip', function( e ) {
                    $window.trigger('hidetooltips');
                    self.show();

                    e.stopPropagation();
                });

                self.$tooltip.bind("click.tooltip", function( e ){
                    e.stopPropagation();
                });

                self.$tooltip.$close.bind("click.tooltip", function( e ) {
                    self.hide();

                    e.stopPropagation();
                });

                $window.bind("click.tooltip", function( e ) {
                    self.hide();

                    e.stopPropagation();
                }).bind("resize.tooltip scroll.tooltip", function(){
                        if(self.showed) {
                            self.locate();
                        }
                    }).bind('hidetooltips', function(){
                        self.hide();
                    });
            }
            else if(self.options.event === 'hover') {
                self.$tooltip.addClass(self.options.sHtmlClass + '_hover');
                self.$elem.bind('mouseover.tooltip', function( e ) {
                    self.show();
                }).bind('mouseout.tooltip', function( e ) {
                        self.hide();
                    });
            }
        },

        show: function() {
            var self = this,
                sHtml = self.$elem.find('span.hidden:first').html();

            self.showed = true;
            self.$tooltip.$content.html(sHtml);

            self.$elem.addClass(self.options.sActiveClass);
            // Сначала показываем тултайп (получаем доступ к блочной модели - ширина, высота)...
            self.$tooltip.css({ display:'block' });
            // после чего пересчитываем координаты
            self.locate();
        },

        hide: function() {
            var self = this;

            self.showed = false;
            self.$tooltip.hide();
            self.$elem.removeClass(self.options.sActiveClass);
        },

        locate: function() {
            var self = this,
                top = self.$elem.offset().top,
                left = self.$elem.offset().left,
                options = self.options,
                $window = $(window),
                bIsTheHeight,
                bIsTheWidth;

            // Помещается справа?
            bIsTheWidth = $window.width() > left + self.$tooltip.width();
            // Помещается снизу?
            bIsTheHeight = $window.height() + $window.scrollTop() > top + self.$tooltip.height();

            // Горизонтальный тултип (стрелочка справа или слева от блока подсказки)
            if( !options.vertical && !self.$elem.data('vertical') ) {
                self.$tooltip.removeClass(options.sHtmlClass + '_vertical');

                if( bIsTheWidth ) {
                    left += self.$elem.outerWidth();
                    self.$tooltip.removeClass(options.sHtmlClass + '_left');
                }
                else {
                    left = left - self.$tooltip.width();
                    self.$tooltip.addClass(options.sHtmlClass + '_left');
                }

                if( bIsTheHeight ) {
                    self.$tooltip.removeClass(options.sHtmlClass + "_top");
                }
                else {
                    top = top - self.$tooltip.height() + self.$elem.outerHeight();
                    self.$tooltip.addClass(options.sHtmlClass + "_top");
                }
            }
            // Вертикальный тултип (стрелочка сверху или снизу от блока подсказки)
            else {
                self.$tooltip.addClass(options.sHtmlClass + '_vertical');

                if( bIsTheWidth ) {
                    self.$tooltip.removeClass(options.sHtmlClass + '_left');
                }
                else {
                    left -= self.$tooltip.width() - self.$elem.outerWidth();
                    self.$tooltip.addClass(options.sHtmlClass + '_left');
                }

                if( bIsTheHeight ) {
                    top += self.$elem.outerHeight();
                    self.$tooltip.removeClass(options.sHtmlClass + "_top")
                }
                else {
                    top = top - self.$tooltip.height();
                    self.$tooltip.addClass(options.sHtmlClass + "_top");
                }
            }

            self.$tooltip.css({ 'top': top, 'left': left});
        }

    };

    $.fn.tooltip = function( params ) {
        var options = $.extend({}, $.fn.tooltip.options, params),
            sTooltipClass = options.sHtmlClass;

        sTooltipClass += (options.sHtmlMod !== '') ? ' ' + options.sHtmlMod : '';

        options.$tooltip = $('<div class="' + sTooltipClass + '"></div>').appendTo( options.sParent );
        options.$tooltip.$content = $('<div class="' + options.sHtmlClass + '__content"></div>').appendTo( options.$tooltip );
        options.$tooltip.$close = $('<i class="' + options.sHtmlClass + '__close"></i>').appendTo( options.$tooltip );

        return this.each(function() {
            var tooltip = Object.create( Tooltip );

            tooltip.init( options, this );
        });
    };

    $.fn.tooltip.options = {
        event : "click",
        sParent: 'body div.layout:first', // селектор элемента к которому аппендится тултип
        sHtmlClass: 'i-tooltip', // Класс туллтипа, от него наследуются все модификаторы
        sActiveClass: 'active', // класс для элемента к которому был показан тултип, после скрытия тултипа - удаляется
        sHtmlMod: '', // модификатор, можно добалять несколько одной строкой
        vertical: false //
    };

})(jQuery, window, undefined);