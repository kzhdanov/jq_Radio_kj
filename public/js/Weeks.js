function GetPrevPage() {
  $.ajax({
    method: 'POST',
    async: true,
    data: { week: Number($('#fullWeekNumber').text()) - 1 },
    url: '/weeks/getPrev',
  }).done(function (data) {
    if (data) {
      $('.need-more-minerals').remove();
      $('.container').append(data);
    } else {
      toastr.warning('Ошибка получения альбомов');
    }
  }).fail(function (ex) {
    toastr.error('Oh, something went wrong...');
  });
}
