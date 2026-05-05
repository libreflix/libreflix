var mongoose = require('mongoose');
var Watch = require('../models/Watch');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/libreflix', {
  useMongoClient: true
});

function pad(str, len) {
  str = String(str);
  while (str.length < len) str += ' ';
  return str;
}

mongoose.connection.once('open', function() {
  Watch.find({ status: 'approved' }, function(err, watches) {
    if (err) {
      console.error('DB error:', err.message);
      process.exit(1);
    }

    console.log('');
    console.log(pad('#', 4) + pad('Permalink', 22) + pad('Title', 30) + 'Qualities');
    console.log(new Array(80).join('-'));

    watches.forEach(function(w, i) {
      var qs = ['sd', 'hd', 'fhd', 'uhd'];
      var badges = qs.map(function(q) {
        var m = (w.magnet && w.magnet[q]) ? 'M' : '-';
        var s = (w.webseed && w.webseed[q]) ? 'W' : '-';
        return q.toUpperCase() + '[' + m + s + ']';
      }).join(' ');

      console.log(
        pad(i + 1, 4) +
        pad(w.permalink, 22) +
        pad(w.title.substring(0, 28), 30) +
        badges
      );
    });

    console.log('');
    console.log('Legend: M=magnet, W=webseed');
    mongoose.connection.close(function() {
      process.exit(0);
    });
  });
});
