var User = require('../models/User');
let Watch = require('../models/Watch');
var mongoose = require('mongoose');

exports.listWatches = (req, res) => {

  Watch.find({}, null, { sort: '-id' }, function (err, watch) {
    if (err) {
      console.log(err);
    } else {
      res.render('admin/list-watches', {
        title: 'List watches',
        watch: watch
      });
    }
  }).populate('criador');

}
