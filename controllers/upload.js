var path = require('path');
var formidable = require('formidable');
var fs = require('fs-extra');
const uuidV1 = require('uuid/v1');


exports.uploadImage = function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // every time a file has been uploaded successfully,
  // rename it to it's original name
  form.on('file', function(field, file) {
    fileEndName = uuidV1() + file.name;

    fs.copySync(file.path, path.join(uploadDir + fileEndName));
    fs.remove(file.path);

  });

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('/media/' + fileEndName);
  });

  // parse the incoming request containing the form data
  form.parse(req);
};
