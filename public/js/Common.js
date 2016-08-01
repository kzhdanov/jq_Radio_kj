(function () {
  $.ajax({
    method: 'POST',
    async: true,
    url: '/weeks/getNumber',
  }).done(function (data) {
    if (data.type === 'success')
      $('.WeekNumberOnHead').text(data.number);
  });
})();
