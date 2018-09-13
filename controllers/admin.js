var User = require('../models/User');
let Watch = require('../models/Watch');
var mongoose = require('mongoose');

exports.listWatches = (req, res) => {

  Watch.find({}, null, { sort: '-year' }, function (err, watch) {
    if (err) {
      console.log(err);
    } else {
      res.render('account/list-watches', {
        title: 'List watches',
        watch: watch
      });
    }
  }).populate('criador');

}
