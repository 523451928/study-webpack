/**
 * Created by admin on 2016/11/24.
 */
var x = 0
export function initBar() {
  var $body = $('body')
  if (x) {
    $body.css('padding-right', x)
    $body.addClass('modal-open')
  } else {
    if (document.body.clientWidth >= window.innerWidth) return 0
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    $body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    $body[0].removeChild(scrollDiv)
    var bodyPad = parseInt(($body.css('padding-right') || 0), 10)
    x =  bodyPad + scrollbarWidth
    if (scrollbarWidth) $body.css('padding-right', x)
    $body.addClass('modal-open')
  }
}
export function resetBar() {
  var $body = $('body')
  $body.removeClass('modal-open')
  $body.css('padding-right', '')
}
