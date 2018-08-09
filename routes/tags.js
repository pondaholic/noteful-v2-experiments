const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/', (req, res, next) => {
	knex.select('id', 'name')
		.from('tags')
		.then(results => {
			res.json(results);
		})
		.catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
	const id = req.params.id;

	knex.first('id', 'name')
		.from('tags')
		.where('id', id)
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			next(err);
		});
});

router.put('/:id', (req, res, next) => {
	const id = req.params.id;

	const newObj = req.body;

	if(!newObj.name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}

	knex.select('id', 'name')
		.from('tags')
		.where('id', id)
		.update(newObj, ['id', 'name'])
		.then(results => {
			res.json(results[0]);
		})
		.catch(err => {
			next(err);
		});
});

router.delete('/:id', (req, res, next) => {
	const id = req.params.id;

	knex('tags')
		.where('id', id)
		.del()
		.then(results =>
			res.json({status: 204}))
		.catch(err => {
			next(err);
		})
});

router.post('/', (req, res, next) => {
	const {name} = req.body;

	if (!name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}

	const newItem = {name};

	knex.insert(newItem)
		.into('tags')
		.returning(['id', 'name'])
		.then(results => {
			res.json(results[0]);
		})
		.catch(err => next(err));
});

module.exports = router;