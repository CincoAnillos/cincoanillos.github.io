/*!
 * RelativeScroll jQuery plugin
 *
 * Copyright 2011, Andrew McKenzie
 * Licensed under GPL Version 2 license
 * http://www.gnu.org/licenses/gpl-2.0.html
 *
 * Version 0.1.0
 */

(function($){

    var RelativeScroll = function(element, options){
        options = options || {};

        this._elem = element;

        this._elemHeight = element.height();
        this._vpHeight = $(window).height();
        this._ctrHeight = element.parent().height();
        this._ctrOffset = element.parent().offset().top;

        this._elemLeft = element.offset().left;

        var that = this;
        this._elem.parent().css('position','relative');
        this._elem.css('position','relative');
        $(document).scroll(function(){ that._setFixedTop(); });
        // TODO: use relative top on scroll for IE6

    };

    RelativeScroll.version = '0.1.0';

    RelativeScroll.prototype._setFixedTop = function(){
        var scrollTop = $(document).scrollTop();
        var progress = this._scrollProgress(scrollTop);

        if(progress === 0 || progress === 1){

            if(this._elem.css('visibility') === 'hidden'){
                this._elem.css('visibility','');
                this._clone.css('display','none');
            }
            this._elem.css( 'top', this._calcRelativeTop(progress) );

        } else {

            if(this._elem.css('visibility') !== 'hidden'){
                if(! this._clone){
                    this._clone = this._elem.clone()
                                            .css({
                                                'position':'fixed',
                                                'left': this._elemLeft,
                                                'width': this._elem.width()
                                            });
                    this._elem.parent().append(this._clone);
                }
                this._elem.css('visibility','hidden');
                this._clone.css('display','block');
            }
            this._clone.css( 'top', this._calcFixedTop(progress) );

        }
    };

    RelativeScroll.prototype._setRelativeTop = function(){
        var scrollTop = $(document).scrollTop();
        var progress = this._scrollProgress(scrollTop);
        var top = this._calcRelativeTop(progress);

        this._elem.css('top', top);
    };

    RelativeScroll.prototype._scrollProgress = function(scrollTop){
        var progress = (scrollTop - this._ctrOffset) / ( this._ctrHeight - this._vpHeight );
        if(progress < 0) progress = 0;
        if(progress > 1) progress = 1;
        return progress;
    };

    RelativeScroll.prototype._calcRelativeTop = function(progress){
        return progress * ( this._ctrHeight - this._elemHeight );
    };

    RelativeScroll.prototype._calcFixedTop = function(progress){
        return progress * (0 - (this._elemHeight - this._vpHeight) );
    };

    $.fn.relativeScroll = function(method, options){

        return this.each(function(){
            var that = $(this);
            if( typeof method !== 'string' ){
                options = method;
                method = 'init';
            }

            var relativeScroll = that.data('relativeScroll');

            if(method === 'init'){
                if(relativeScroll) throw Error('Relative scroll already initialised on this element.',that);
                that.data( 'relativeScroll', new RelativeScroll(that, options) );
                return that;
            }

            if(! relativeScroll ) throw Error('Relative scroll not initialised on this element.', that);
            if(! relativeScroll[method] ) throw Error('Invalid relativeScroll method: ' + method, that);
            return relativeScroll[method](that, options);
        });

    };

    $.RelativeScroll = RelativeScroll;

})(jQuery);