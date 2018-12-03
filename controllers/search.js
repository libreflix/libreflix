'use strict';

var User = require('../models/User');
var Watch = require('../models/Watch');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var elasticsearch = require('elasticsearch');



var client = new elasticsearch.Client({
  host: '142.93.82.223:9200',
  // log: 'trace'
});

function doSearch(busca) {
  return new Promise(function(resolve, reject) {
    setTimeout(function () {
      const result = client.search({
        "from" : 0, "size" : 20,
        index: 'my-app',
        type: 'watches',
        body: {
          query: {
            "bool": {
              "must": [
                {
                  "query_string": {
                    "query": busca,
                    "analyze_wildcard": true,
                    "default_field": "*"
                  }
                }
              ],
              "filter": [],
              "should": [],
              "must_not": [],
          }
  }}
})
        resolve(result)
    }, 0);
  });
}

/**
 * Get the Search page
 */
exports.searchGet = function(req, res){
  var busca = req.params.busca.toString()
  doSearch(busca)
    .then(function(value) {
      console.log('Async success!', value.hits.hits)

      var test = value.hits.hits
      // var test = JSON.parse(value.hits.hits)

      var options = {
        busca: busca,
        title: "Resultados para " + "\""+ busca + "\"",
        q: test
      }

      res.render('search', options)
    })
    .catch(function(err) {
      options = {
        title: "Resultados para " + "\""+ busca + "\"",
        error: "Erro de conexão ao fazer a busca. :("
      }

      console.log('Caught an error!', err)

      req.flash('error', { msg: 'Parece que a conexão o banco de buscas falhou. :(' });
      res.redirect('/')

    })




};
