var http = require('http');
var WebTorrent = require('webtorrent');
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var Watch = require('../models/Watch');

var PORT = process.env.LIBREFLIX_DAEMON_PORT || 9876;
var DOWNLOAD_DIR = process.env.SEEDER_DIR || './seeder-downloads';

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/libreflix', {
  useMongoClient: true
});

var client = new WebTorrent();
var activeTorrents = {};

client.on('error', function(err) {
  console.error('WebTorrent error:', err.message);
});

function startSeed(watch, quality, cb) {
  var key = watch.permalink + '-' + quality;
  if (activeTorrents[key]) {
    return cb(null, 'Already seeding: ' + watch.title + ' (' + quality + ')');
  }
  var magnet = watch.magnet && watch.magnet[quality];
  if (!magnet) {
    return cb(null, 'No magnet link for ' + quality);
  }
  var savePath = path.join(DOWNLOAD_DIR, watch.permalink, quality);
  client.add(magnet, { path: savePath }, function(torrent) {
    activeTorrents[key] = {
      torrent: torrent,
      watch: watch,
      quality: quality,
      addedAt: Date.now()
    };
    var webseed = watch.webseed && watch.webseed[quality];
    if (webseed) torrent.addWebSeed(webseed);
    console.log('[+] Seeding:', watch.title, '(' + quality + ')');
    torrent.on('done', function() {
      console.log('[✓] Complete:', watch.title, '(' + quality + ')');
    });
    cb(null, 'Started seeding ' + watch.title + ' (' + quality + ')');
  });
}

function stopSeed(permalink, quality, cb) {
  var key = permalink + '-' + quality;
  var item = activeTorrents[key];
  if (!item) return cb(null, 'Not seeding: ' + permalink + ' (' + quality + ')');
  client.remove(item.torrent.infoHash);
  delete activeTorrents[key];
  console.log('[-] Stopped:', item.watch.title, '(' + quality + ')');
  cb(null, 'Stopped ' + item.watch.title + ' (' + quality + ')');
}

function getStatus() {
  var out = [];
  Object.keys(activeTorrents).forEach(function(key) {
    var item = activeTorrents[key];
    var t = item.torrent;
    out.push({
      key: key,
      title: item.watch.title,
      quality: item.quality,
      progress: parseFloat((t.progress * 100).toFixed(1)),
      peers: t.numPeers,
      downloadSpeed: t.downloadSpeed,
      uploadSpeed: t.uploadSpeed
    });
  });
  return out;
}

var server = http.createServer(function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  var body = '';
  req.on('data', function(c) { body += c; });
  req.on('end', function() {
    var payload = {};
    try { if (body) payload = JSON.parse(body); } catch(e) {}

    function send(obj) {
      res.end(JSON.stringify(obj));
    }

    if (req.method === 'GET' && req.url === '/status') {
      return send({ success: true, torrents: getStatus() });
    }

    if (req.method === 'POST' && req.url === '/seed') {
      var permalink = payload.permalink;
      var quality = payload.quality || 'all';
      if (!permalink) return send({ success: false, error: 'Missing permalink' });

      Watch.findOne({ permalink: permalink }, function(err, watch) {
        if (err || !watch) return send({ success: false, error: 'Content not found' });
        var qualities = ['sd', 'hd', 'fhd', 'uhd'];
        var available = qualities.filter(function(q) { return watch.magnet && watch.magnet[q]; });
        if (quality !== 'all' && available.indexOf(quality) === -1) {
          return send({ success: false, error: 'Quality not available: ' + quality });
        }
        var targets = (quality === 'all') ? available : [quality];
        var pending = targets.length;
        var messages = [];
        targets.forEach(function(q) {
          startSeed(watch, q, function(err, msg) {
            messages.push(msg);
            pending--;
            if (pending === 0) send({ success: true, messages: messages });
          });
        });
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/stop') {
      var permalink = payload.permalink;
      var quality = payload.quality || 'all';
      if (!permalink) return send({ success: false, error: 'Missing permalink' });

      Watch.findOne({ permalink: permalink }, function(err, watch) {
        if (err || !watch) return send({ success: false, error: 'Content not found' });
        var qualities = ['sd', 'hd', 'fhd', 'uhd'];
        var available = qualities.filter(function(q) { return watch.magnet && watch.magnet[q]; });
        var targets = (quality === 'all') ? available : [quality];
        var pending = targets.length;
        var messages = [];
        targets.forEach(function(q) {
          stopSeed(permalink, q, function(err, msg) {
            messages.push(msg);
            pending--;
            if (pending === 0) send({ success: true, messages: messages });
          });
        });
      });
      return;
    }

    res.statusCode = 404;
    send({ success: false, error: 'Not found' });
  });
});

mongoose.connection.once('open', function() {
  console.log('Connected to MongoDB');
  server.listen(PORT, function() {
    console.log('Libreflix seeder daemon listening on port ' + PORT);
  });
});

process.on('SIGINT', function() {
  console.log('\nShutting down daemon...');
  client.destroy(function() {
    mongoose.connection.close(function() {
      process.exit(0);
    });
  });
});
