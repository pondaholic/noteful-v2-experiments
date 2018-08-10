'use strict';

const express = require('express');

// Create an router instance (aka "mini-app")
const router = express.Router();

// TEMP: Simple In-Memory Database
// const data = require('../db/notes');
// const simDB = require('../db/simDB');
// const notes = simDB.initialize(data);

const knex = require('../knex');
const hydrateNotes = require('../utils/hydrateNotes');

// Get All (and search by query)
router.get('/', (req, res, next) => {
	const { searchTerm } = req.query;
	const { folderId }  = req.query;
	const {tagId} = req.query;
	
	knex
		.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
		.from('notes')
		.leftJoin('folders', 'notes.folder_id', 'folders.id')
		.leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
		.leftJoin('tags', 'notes_tags.tag_id','tags.id' )
		.modify(queryBuilder => {
			if (searchTerm) {
				queryBuilder.where('title', 'like', `%${searchTerm}%`);
			}
		})
		.modify(function(queryBuilder) {
			if(folderId) {
				queryBuilder.where('folder_id', folderId);
			}
		})
		.modify(function (queryBuilder) {
			if (tagId) {
				queryBuilder.where('tag_id', tagId);
			}
		})
		.orderBy('notes.id')
		.then(result => {
			if(result) {
				const hydrated = hydrateNotes(result);
				res.json(hydrated);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});

// Get a single item
router.get('/:id', (req, res, next) => {
	const id = req.params.id;

	knex.select('notes.id', 'title', 'content', 'folders.id as folderId', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
		.from('notes')
		.leftJoin('folders', 'notes.folder_id', 'folders.id')
		.leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
		.leftJoin('tags', 'notes_tags.tag_id','tags.id')
		.where('notes.id', id)
		.then(result => {
			if (!result) {
				next({status : 404});
			}
			if (result) {const hydrated = hydrateNotes(result);
				res.json(hydrated);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});

// Put update an item
router.put('/:id', (req, res, next) => {
	const id = req.params.id;

	/***** Never trust users - validate input *****/
	const {title, content, folder_id, tags} = req.body;

	const updateObj = {
		title: title,
		content: content,
		folder_id: folder_id,
	};

	const updateableFields = ['title', 'content', 'folderId'];

	updateableFields.forEach(field => {
		if (field in req.body) {
			updateObj[field] = req.body[field];
		}
	});

	/***** Never trust users - validate input *****/
	if (!updateObj.title) {
		const err = new Error('Missing `title` in request body');
		err.status = 400;
		return next(err);
	}
	
	knex('notes')
		.where('notes.id', id)
		.update(updateObj)
		.returning('id')
		.then( () => {
			return knex('notes_tags')
				.del().where('note_id', id);
		}).then( () => {
			const tagsInsert = tags.map(tagId => ({ note_id: id, tag_id: tagId}));
			return knex.insert(tagsInsert).into('notes_tags');
		})	
		.then( () => {	
			return knex.select('notes.id', 'title', 'content', 'folder_id', 'folders.name as folderName', 'tags.id as tagId', 'tags.name as tagName')
				.from('notes')
				.leftJoin('folders', 'notes.folder_id', 'folders.id')
				.leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
				.leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
				.where('note_id', id);
		}).then(result => {
			if(result) {
				const hydrated = hydrateNotes(result);
				res.json(hydrated);
			} else {
				next();
			}
		})
		.catch(err => {
			next(err);
		});
});

// Post (insert) an item
router.post('/', (req, res, next) => {
	const { title, content, folderId, tags } = req.body;

	const newItem = { 
		title: title, 
		content: content,
		folder_id: folderId,
		tags: tags,
	};
	/***** Never trust users - validate input *****/
	if (!newItem.title) {
		const err = new Error('Missing `title` in request body');
		err.status = 400;
		return next(err);
	}

	let noteId;

	knex.insert(newItem)
		.into('notes').returning('id')
		.then(([id]) => {
			noteId = id;
			const tagsInsert = tags.map(tagId => ({ note_id: noteId, tag_id: tagId}));
			return knex.insert(tagsInsert).into('notes_tags');
		})
		.then(() => {
			return knex.select('notes.id', 'title', 'content',
				'folders.id as folder_id', 'folders.name as folderName',
				'tags.id as tagId', 'tags.name as tagName')
				.from('notes')
				.leftJoin('folders', 'notes.folder_id', 'folders.id')
				.leftJoin('notes_tags', 'notes.id', 'notes_tags.note_id')
				.leftJoin('tags', 'tags.id', 'notes_tags.tag_id')
				.where('notes.id', noteId);
		})
		.then(result => {
			if(result) {
				const hydrated = hydrateNotes(result)[0];
				res.json(hydrated);
			} else {
				next();
			}
		})
		.catch(err => next(err));
});

// Delete an item
router.delete('/:id', (req, res, next) => {
	const id = req.params.id;

	knex('notes')
		.where('id', id)
		.del()
		.then(result => {
			res.json('deleted');
		})
		.catch(err => {
			next(err);
		});
});

module.exports = router;
