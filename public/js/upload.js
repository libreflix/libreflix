var fl = document.getElementById('upload-input');


fl.onchange = function(e){
    var ext = this.value.match(/\.(.+)$/)[1];
    switch(ext)
    {
        case 'jpg':
        case 'png':
            break;
        default:
            alert('Formato de arquivo inválido.');
            this.value='';
    }
};

$('#upload-input').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
          $( "img1" ).html( "<input name='imgbg' style='display: none;' value='" + data + "'>");
      },
    });

  }
});

$('#upload-input2').on('change', function(){

  var files = $(this).get(0).files;

  if (files.length > 0){
    // create a FormData object which will be sent as the data payload in the
    // AJAX request
    var formData = new FormData();

    // loop through all the selected files and add them to the formData object
    for (var i = 0; i < files.length; i++) {
      var file = files[i];

      // add the files to formData object for the data payload
      formData.append('uploads[]', file, file.name);
    }

    $.ajax({
      url: '/upload',
      type: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(data){
          console.log('upload successful!\n' + data);
          $( "img2" ).html( "<input name='thumb480' style='display: none;' value='" + data + "'>");
      },
    });

  }
});
