DROP TABLE IF EXISTS recaps;
DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS notes;

CREATE TABLE notes
(
	id serial PRIMARY KEY,
	title text NOT NULL,
	content text FOREIGN KEY,
	created timestamp DEFAULT now()
);

INSERT INTO notes
	(title, content) VALUES
		('Paradise Lost', 'Epic poem'),
		('The Stranger', 'Camus on alienation'),
		('David Copperfield', 'Dickensian fiction'),
		('Ragtime', '1920 civil rights'),
		('Lord of the Rings', 'Tolkein trilogy');

-- ALTER SEQUENCE notes.id START WITH 202;

CREATE TABLE authors
(
	id serial PRIMARY KEY,
	name text NOT NULL
);

CREATE TABLE notes_tags
(
	note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
	author_name INTEGER NOT NULL REFERENCES authors ON DELETE CASCADE
);

-- INSERT INTO authors (name) VALUES
-- 	('John Milton'),
-- 	('Albert Camus'),
-- 	('Charles Dickenson'),
-- 	('E.L. Doctorow'),
-- 	('JRR Tolkein');


-- INSERT INTO notes_tags (note_id, tag_id) VALUES
-- 	(1, 2),
-- 	(2, 2),
-- 	(3, 1);

CREATE TABLE recaps
(
	id serial PRIMARY KEY,
	summary text NOT NULL,
	book_id int REFERENCES notes,
	book_content text REFERENCES notes(content) ON DELETE SET NULL
);
