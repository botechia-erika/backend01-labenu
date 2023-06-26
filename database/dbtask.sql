

CREATE TABLE
    authors (
        id TEXT PRIMARY KEY NOT NULL UNIQUE,
        name TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role text not null DEFAULT "NORMAL",
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

DROP TABLE authors;

INSERT INTO
    authors(
        id,
        name,
        username,
        email,
        password,
        role
    )
VALUES (
        "f001",
        "VITOR LUIS LEITE",
        "VITOR-LEITE",
        "vitor94leite@gmail.com",
        "PGelVLbc94!pc",
        "NORMAL"
    ), (
        "f002",
        "ROSAURIA SOAREZ",
        "ROSAURIA-SOAREZ",
        "rohtop@gmail.com",
        "laROH!96",
        "NORMAL"
    ), (
        "f003",
        "IAN KALEB MENDONCA",
        "IAN-MENDONCA",
        "iankaleb@gmail.com",
        "kalebinho!pc",
        "NORMAL"
    );

SELECT * FROM authors WHERE name LIKE '%VITOR%';

SELECT * FROM authors ;

SELECT id , created_at FROM authors ORDER BY created_at DESC;

CREATE TABLE
    tasks (
        id TEXT PRIMARY KEY NOT NULL UNIQUE,
        title TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        status BLOB,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

DROP TABLE tasks;

INSERT INTO
    tasks(id, title, description, status)
VALUES (
        "t001",
        "HEADER COMPONENT",
        "CRIAR COMPONENTE HEADER DO SITE",
        0
    ), (
        "t002",
        "FOOTER COMPONENT",
        "CRIAR COMPONENTE FOOTER DO SITE",
        0
    ), (
        "t003",
        "TESTING USABILITY",
        "TESTAR USABILIDADE DE TODO SITE",
        0
    ), (
        "t004",
        "DEPLOY SURGE",
        "CRIAR DEPLOY SITE EM SURGE",
        0
    );

SELECT * FROM tasks;

CREATE TABLE
    authors_tasks (
        id_author TEXT NOT NULL,
        id_task TEXT NOT NULL,
        FOREIGN KEY (id_author) REFERENCES authors(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (id_task) REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT id FROM authors WHERE ASC ;

DROP TABLE authors_tasks;

SELECT *
FROM authors
    LEFT JOIN authors_tasks ON authors_tasks.id_task = authors.id;

SELECT * FROM authors_tasks;

INSERT INTO
    authors_tasks(id_author, id_task)
VALUES ("f001", "t001"), ("f002", "t002"), ("f003", "t003"), ("f001", "t004"), ("f002", "t004");

SELECT
    authors.name,
    authors.email,
    authors.role,
    tasks.title,
    tasks.description,
    tasks.status
FROM tasks
    INNER JOIN authors_tasks ON tasks.id = authors_tasks.id_task
    INNER JOIN authors ON authors_tasks.id_author = authors.id;