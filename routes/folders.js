const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/', (req, res, next) => {
	knex.select('id', 'name')
		.from('folders')
		.then(results => {
			res.json(results);
		})
		.catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
	const id = req.params.id;

	knex.first('id', 'name')
		.from('folders')
		.where('id', id)
		.then(item => {
			res.json(item);
		})
		.catch(err =>
			next(err));
});

router.put('/:id', (req, res, next) => {
	const id = req.params.id;

	const updateObj = req.body;
	if(!updateObj.name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}
	knex('folders')
		.where('id', id)
		.update(updateObj, ['id', 'name'])
		.then(result => {
			res.json(result);
		})
		.catch(err => {
			next(err);
		});
});

router.post('/', (req, res, next) => {
	const {name: name} = req.body;
	const newItem = {name: name};
	if(!newItem.name) {
		const err = new Error('Missing `name` in request body');
		err.status = 400;
		return next(err);
	}
	knex('folders')
		.insert(newItem, ['id', 'name'])
		.then(item => {
			res.json(item);
		})
		.catch(err => {
			next(err);
		});
});

router.delete('/:id', (req, res, next) => {
	const id = req.params.id;

	knex('folders')
		.where('id', id)
		.del()
		.then(result => {
			res.json({status: 204});
		});
});


module.exports = router;