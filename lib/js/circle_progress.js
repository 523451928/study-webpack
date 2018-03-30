/**
 * circle-progress
 * 样式在 circle-progress.less
 */
define(function(require, exports, module) {
    var Ctr = function($ele, initNum) {
        isNaN(initNum) && (initNum = 0);
        this.$ele = $ele;
        this.$rightHalf = $ele.find('.r-fill');
        this.$leftHalf = $ele.find('.l-fill');
        this.$per = $ele.find('.per');

        if (initNum > 0) {
            proto.circle(initNum);
        }
    };

    var proto = Ctr.prototype;


    proto.circle = function(num) {

        this.$per.html(num + '%');

        var deg, type;

        if (num > 50) {
            !this.$ele.hasClass('per50') && this.$ele.addClass('per50');

            deg = (num - 50) * 3.6;
            type = 2; // right
        } else {
            deg = num * 3.6;
            type = 1; // left
        }

        !isNaN(deg) && this._setRotate(type, deg);
    }

    proto.clear = function() {
        this.$ele.removeClass('per50');
        this.$per.html('0%');

        this.$rightHalf.css(rotate(0));
        this.$leftHalf.css(rotate(0));
    }

    proto._setRotate = function(type, deg) {
        if (type === 1) {
            this.$rightHalf.css(rotate(deg))
        } else {
            this.$leftHalf.css(rotate(deg))
        }
    }

    function rotate(deg) {
        return {
            "-webkit-transform": "rotate(" + deg + "deg)",
            "-moz-transform": "rotate(" + deg + "deg)",
            "-ms-transform": "rotate(" + deg + "deg)",
            "transform": "rotate(" + deg + "deg)"
        }
    }

    module.exports = Ctr;
})
