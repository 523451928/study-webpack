/**
 * Dialog Box
 */
define(function(require, exports, module) {
    require('component/transition');

    var $ = require('jquery'),
        dialogWrap = '<div class="ww-dialog"></div>',
        confirmNode = '<div class="dialog confirm">' +
        '<h2 class="msg"></h2>' +
        '<div class="msg-detail"></div>' +
        '<div class="dialog-btn">' +
        '<button type="button" class="btn btn-default btn-lg mr10" data-confirm="dialog">确认</button>' +
        '<button type="button" class="btn btn-default btn-lg" data-dismiss="dialog">取消</button>' +
        '</div></div>',
        listNode = '<div class="dialog list">' +
            '<ul class="image-list changed-list dialog-list"></ul>' +
            '<h1 class="fixed-head msg dialog-msg"></h1>' +
            '<div class="fixed-btn-wrap dialog-btn">' +
                '<button type="button" class="btn btn-default btn-lg">确定</button>' +
            '</div></div>',
        dialogMap = {
            confirm: confirmNode,
            list: listNode
        };

    var TRANSITION_DURATION = 300;

    var Dialog = {
        $body: $(document.body),
        $dialogWrap: null,
        mapDialog: {},
        currDialog: null,
        $backdrop: null,

        show: function() {
            if (!this.currDialog) return;

            this.$dialogWrap.on('click.dismiss.ww.dialog', '[data-dismiss="dialog"]', $.proxy(this.hide, this));

            if (!this.$backdrop) {
                $('<div class="dialog-overlay"></div>').prependTo(this.$dialogWrap);
                this.$backdrop = this.$dialogWrap.find('.dialog-overlay');
            }
            this.$backdrop.on('click',$.proxy(this.hide, this));
            this.checkScrollbar();
            this.$body.addClass('modal-open');

            this.setScrollbar();

            this.$dialogWrap.addClass('dialog-open');
        },

        hide: function() {
            var self = this;

            this.$dialogWrap.off('click.dismiss.ww.dialog', '[data-dismiss="dialog"]');
            this.$dialogWrap.off('click.confirm.ww.dialog', '[data-confirm="dialog"]');
            this.$backdrop.off('click');

            if ($.support.transition) {
                this.$dialogWrap.addClass('dialog-close');

                this.currDialog.one('bsTransitionEnd', function(e) {
                    self.currDialog = null;
                    self.$dialogWrap.removeClass('dialog-open dialog-close');

                    self.$body.removeClass('modal-open');
                    self.resetScrollbar();

                }).emulateTransitionEnd(TRANSITION_DURATION);

                self.currDialog[0].offsetWidth; // force reflow

            } else {
                self.$dialogWrap.removeClass('dialog-open');
                self.$body.removeClass('modal-open');
                self.resetScrollbar();
            }
        },

        confirm: function(msg, callback, msgDetail,msgBtnDom) {
            this.currDialog = this.getDialog('confirm');

            this.currDialog.find('.msg').html(msg);

            if(msgBtnDom){
                var $btnBox = this.currDialog.find('.dialog-btn');
                $btnBox.empty().append(msgBtnDom);
            }

            this.$dialogWrap.on('click.confirm.ww.dialog', '[data-confirm="dialog"]', $.proxy(function(e) {
                this.hide();
                callback();
            }, this));

            if (msgDetail) {
                var $detail = this.currDialog.find('.msg-detail');

                $detail.children().remove();
                $detail.append(msgDetail);
            }


            this.show();
        },

        list: function(msg, callback, imgList, btnNode, duration) {
            this.currDialog = this.getDialog('list');
            if (!msg) {
                console.log('call dialog component lack required parma:msg')
                return;
            }
            if (!callback) {
                console.log('call dialog component lack required parma:callback')
                return;
            }
            if (!(callback instanceof Function)) {
                console.log('parma:callback is not the effective function');
                return;
            }
            this.currDialog.find('.msg').html(msg);

            if (btnNode) {
                var $btnBox = this.currDialog.find('.fixed-btn-wrap');
                $btnBox.empty().append(msgBtnDom);
            }

            this.$dialogWrap.on('click.confirm.ww.dialog', '[data-confirm="dialog"]', $.proxy(function(e) {
                this.hide();
                callback();
            }, this));

            if (imgList) {
                if (imgList instanceof Array) {
                    var imgLength = imgList.length;
                    var itemListNode = '';
                    for (var i=0;i<imgLength;i++) {
                        var itemNodeText = '<li style="background-image: url(' + imgList[i] + ')" class="list-item item"></li>';
                        itemListNode += itemNodeText;
                    }
                    $('.image-list').append(itemListNode);
                }
            }

            if (duration) {

            }

            this.show()
        },

        getDialog: function(type) {
            if (!this.$dialogWrap) {
                this.$body.append(dialogWrap);
                this.$dialogWrap = this.$body.find('.ww-dialog');
            }

            if (!dialogMap[type]) return;

            if (!this.mapDialog[type]) {
                this.$dialogWrap.append(dialogMap[type]);
                this.mapDialog[type] = this.$dialogWrap.find('.dialog.' + type);
            }

            return this.mapDialog[type];
        },

        checkScrollbar: function () {
            this.scrollbarWidth = this.measureScrollbar();
        },

        setScrollbar: function () {
            var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10);
            if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth);
        },

        resetScrollbar: function () {
            this.$body.css('padding-right', '')
        },
        measureScrollbar: function () { // thx walsh
            if (document.body.clientWidth >= window.innerWidth) return 0;
            var scrollDiv = document.createElement('div');
            scrollDiv.className = 'modal-scrollbar-measure';
            this.$body.append(scrollDiv);
            var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
            this.$body[0].removeChild(scrollDiv);
            return scrollbarWidth;
        }
    }

    module.exports = Dialog;
})
