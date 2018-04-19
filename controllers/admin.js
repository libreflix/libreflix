var User = require('../models/User');
let Watch = require('../models/Watch');

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
  });

}