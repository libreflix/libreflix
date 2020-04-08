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

    //--------------------------------------------------------------------------
    // COWNOTE(n2omatt): fs.rename fails on cross device files.
    //   So if the the tmpfs is mounted on /tmp (which is to be the default)
    //   and the /tmp itself is on other device the call for fs.rename will
    //   trigger an [Error: EXDEV: cross-device link not permitted...]
    //
    //   This make sure that we always have the correct behaviour no matter
    //   the actual underlying devices that we're on.
    //
    //   The call of fs.remove is kind of optional, because by default
    //   the contents of tmpfs is cleared upon reinitialization. But to
    //   ensure that the disk space is preserved we're calling it here.
    //
    //   Please beware of this and remove the fs.remove call if any performance
    //   degradation is perceived at all.
    //
    //   Other thing to keep in mind is that those functions aren't default
    //   fs module calls, but instead fs-extra calls.
    //
    //   Reference:
    //     https://github.com/jprichardson/node-fs-extra
    fs.copySync(file.path, path.join(uploadDir + fileEndName));
    fs.remove(file.path);

  });

  // log any errors that occur
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
