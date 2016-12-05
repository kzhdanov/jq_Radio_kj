function GetPrevPage() {
  $.ajax({
    method: 'POST',
    async: true,
    data: { week: Number($('#fullWeekNumber').text()) - 1 },
    url: '/weeks/getPrev',
  }).done(function (data) {
    if (data) {
      $('.need-more-minerals').remove();
      $('.container').append('<hr />').append(data);
    } else {
      toastr.warning('Ошибка получения альбомов');
    }
  }).fail(function (ex) {
    toastr.error('Oh, something went wrong...');
  });
}

(function () {
  $('.mask').click( function () { $('.mask, .window').hide(); });
})();

function ShowModal(e, _self) {
  e.preventDefault();
  var maskHeight = $(window).height();
  var maskWidth = $(window).width();
  $('.mask').css({'width':maskWidth,'height':maskHeight});
  $('.mask').fadeIn(1000);
  $('.mask').fadeTo("slow",0.8);
  var winH = $(window).height();
  var winW = $(window).width();
  var dialog = _self.next().find('#dialog');
  dialog.css('top',  winH/2-dialog.height()/2);
  dialog.css('left', winW/2-dialog.width()/2);
  dialog.fadeIn(2000);
}

function CloseModal(e) {
  e.preventDefault();
  $('.mask, .window').hide();
}
