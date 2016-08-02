function Build() {
  var _ = this.data[0];
  $('#WeekNumber').val(_.WeekNumber);
  $('#BandName').val(_.BandName);
  $('#AlbumName').val(_.AlbumName);
  $('#Genres').val(_.Genres);
  $('#Year').val(_.Year);
  $('#preView').val(_.preView);
  $('#mainText').val(_.mainText);
  $('#ImgName').val(_.ImgName);
  if (_.IsVisible)
    $('#IsVisible').prop('checked', true);
  else
    $('#IsVisible').prop('checked', false);

  $('#Save').attr('data-id', _.id);
}

function EditClick(e, id) {
  e.preventDefault();

  $.ajax({
    method: 'POST',
    async: true,
    data: { id: id },
    url: '/RadioAdmin/Edit',
  }).done(function (data) {
    if (data.type === 'success') {
      Build.call(data);
    } else {
      toastr.warning('Ошибка редактирования элемента');
      $('#Save').removeAttr('data-id');
    }
  }).fail(function (ex) {
    toastr.error('Oh, something went wrong...');
    $('#Save').removeAttr('data-id');
  });
}

function DeleteClick(e, id) {
  e.preventDefault();
  var _self = e;
  $.ajax({
    method: 'POST',
    async: true,
    data: { id: id },
    url: '/RadioAdmin/Delete',
  }).done(function (data) {
    if (data.type === 'success') {
      _self.target.parentNode.parentNode.remove();
      toastr.success('Элемент удален');
    } else {
      toastr.warning('Ошибка удаления элемента');
    }
  }).fail(function (ex) {
    toastr.error('Oh, something went wrong...');
  });
}

(function () {
  $('#Save').click(function (e) {
    e.preventDefault();
    var _self = $(this);

    if (!Validator($('#AddAlbumInfo')))
      return false;

    _self.hide();
    if (!$('#Save').attr('data-id') && $('#Save').attr('data-id') !== '') {
      $.ajax({
        method: 'POST',
        async: true,
        data: { album: $('#AddAlbumInfo').serialize() },
        url: '/RadioAdmin/Save',
      }).done(function (data) {
        _self.show();
        if (data.type === 'success')
          toastr.success('Все успешно сохранилось');
        else
          toastr.error('Ошибка в процессе сохранения...');
      }).fail(function (ex) {
        _self.show();
        toastr.error('Oh, something went wrong...');
      });
    } else {
      var str = $('#AddAlbumInfo').serialize() + '&id=' + $('#Save').attr('data-id');
      $.ajax({
        method: 'POST',
        async: true,
        data: { album: str },
        url: '/RadioAdmin/EditSave',
      }).done(function (data) {
        _self.show();
        $('#Save').removeAttr('data-id');
        if (data.type === 'success')
          toastr.success('Изменения внесены успешно');
        else
          toastr.error('Ошибка в процессе сохранения редактирования...');
      }).fail(function (ex) {
        _self.show();
        $('#Save').removeAttr('data-id');
        toastr.error('Oh, something went wrong...');
      });
    }
  });

  $('#Search').click(function (e) {
    e.preventDefault();
    var _self = $( this );
    _self.hide();

    $.ajax({
      method: 'POST',
      async: true,
      data: { week: Number($('#WeekNumberSearch').val()) },
      url: '/RadioAdmin/Get',
    }).done(function (data) {
      _self.show();
      $('table tbody').empty().html(data);
    }).fail(function (ex) {
      _self.show();
      toastr.error('Oh, something went wrong...');
    });
  });

  function Validator(form) {
    var triger = true;
    var formObject = getFormData(form);

    if (formObject.WeekNumber === '' || formObject.WeekNumber === 0 ||
        formObject.WeekNumber.length !== 4) {
      toastr.error('Номер недели должен состоять из 4-х цыфр...');
      triger = false;
    }

    if (formObject.BandName === '') {
      toastr.error('Название группы должно быть заполнено...');
      triger = false;
    }

    if (formObject.AlbumName === '') {
      toastr.error('Название альбома должно быть заполнено...');
      triger = false;
    }

    if (formObject.preView === '') {
      toastr.warning('Превью должно быть заполнено...');
      triger = false;
    }

    if (formObject.mainText === '') {
      toastr.warning('Список песен должно быть заполнено...');
      triger = false;
    }

    if (formObject.ImgName === '') {
      toastr.warning('Имя картинки альбома должно быть заполнено или по умолчанию...');
      triger = false;
    }

    return triger;

    function getFormData($form) {
      var unindexedArray = $form.serializeArray();
      var indexedArray = {};

      $.map(unindexedArray, function (n, i) {
          indexedArray[n['name']] = n['value'];
      });

      return indexedArray;
    }
  }
})();
