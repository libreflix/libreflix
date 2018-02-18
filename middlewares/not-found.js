'use strict';

const Watch = require('../models/Watch');

/**
 * Resolve 404 with 2 last uploaded productions
 */
module.exports = (req, res) => {
	Watch.find({'top': 'new-l'}, null, {sort: '-_id'}, function(err, watches){
		let options = {
			title: 'Ops, não encontramos o que você procura',
			watches: []
		}

		if (watches) {
			options.watches = watches
		}

		res.status(404).render('error/404', options);
	}).limit(4);
};
