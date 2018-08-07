'use strict';

const knex = require('../knex');

let searchTerm = '';
knex
	.select('notes.id', 'title', 'content')
	.from('notes')
	.modify(queryBuilder => {
		if (searchTerm) {
			queryBuilder.where('title', 'like', `%${searchTerm}%`);
		}
	})
	.orderBy('notes.id')
	.then(results => {
		console.log(JSON.stringify(results, null, 2));
	})
	.catch(err => {
		console.error(err);
	});
	
// knex.first('id', 'title', 'content')
// 	.from('notes')
// 	.where('id', 4)
// 	.then(result => {
// 		console.log(result);
// 	})
// 	.catch(err => {
// 		console.error(err);
// 	});
	
// knex('notes')
// 	.where('id', 5)
// 	.update( {title: 'The Book Thief'} )
// 	.returning(['id', 'title', 'content'])
// 	.then(result => {
// 		console.log(result[0]);
// 	})
// 	.catch(err => {
// 		console.error(err);
// 	});

// knex('notes')
// 	.insert( {title: 'Savage Coast', content: 'post-colonial poetry'} )
// 	.returning(['id', 'title', 'content'])
// 	.then(result => {
// 		console.log(result[0]);
// 	})
// 	.catch(err => {
// 		console.error(err);
// 	});
	
// knex('notes')
// 	.where('id', 14)
// 	.del()
// 	.then(result => {
// 		console.log('deleted');
// 	});