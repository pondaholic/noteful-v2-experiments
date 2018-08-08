DROP TABLE IF EXISTS notes;
DROP TABLE IF EXISTS folders;

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
		('Paradise Lost', 'Epic poem', 100);