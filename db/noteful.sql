DROP TABLE IF EXISTS notes_tags;
DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;
DROP TABLE IF EXISTS tags;

CREATE TABLE folders 
(
    id serial PRIMARY KEY,
    name text NOT NULL
);

ALTER SEQUENCE folders_id_seq RESTART WITH 100;

INSERT INTO folders (name) VALUES
  ('Archive'),
  ('Drafts'),
  ('Personal'),
  ('Work');

CREATE TABLE notes
(
	id serial PRIMARY KEY,
	title text NOT NULL,
	content text,
	created timestamp DEFAULT now(),
	folder_id int REFERENCES folders(id) ON DELETE SET NULL
);

INSERT INTO notes
	(title, content, folder_id) VALUES
		('Paradise Lost', 'Epic poem', 100),
		('The Stranger', 'Camus on alienation', 103);

CREATE TABLE tags
(
	id serial PRIMARY KEY,
	name text NOT NULL
);

CREATE TABLE notes_tags
(
	note_id INTEGER NOT NULL REFERENCES notes ON DELETE CASCADE,
	tag_id INTEGER NOT NULL REFERENCES tags ON DELETE CASCADE
);

INSERT INTO tags (name) VALUES
	('My Tag 1'),
	('My Tag 2'),
	('My Tag 3');

INSERT INTO notes_tags (note_id, tag_id) VALUES
	(1, 2);