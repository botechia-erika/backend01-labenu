-- Active: 1688554096358@@127.0.0.1@3306


CREATE TABLE
    users (
        id TEXT PRIMARY KEY NOT NULL UNIQUE,
        name TEXT NOT NULL,
        nickname TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role text not null DEFAULT "NORMAL",
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

DROP TABLE users;

INSERT INTO
    users(
        id,
        name,
        nickname,
        email,
        password,
        role
    )
VALUES (
        "f001",
        "FULANO",
        "fulano-bastos",
        "fulano@email.com",
        "jzD_yyEcp0M",
        "BUYER"
    ), (
        "f002",
        "BELTRANO",
        "beltrano-silva",
        "beltranosilva@email.com",
        "m4PlFzASXUc",
        "NORMAL"
    ), (
        "f003",
        "ERIKA LUISA MENDONCA BOTECHIA DE JESUS LEITE",
        "erika-botechia",
        "botechiaeri@gmail.com",
        "Conway22124748",
        "ADM"
    );

SELECT * FROM users WHERE name LIKE '%BELTRANO%';
SELECT * FROM users WHERE name LIKE '%ERIKA%';
SELECT * FROM users WHERE name LIKE '%FULANO%';

SELECT * FROM users ;

SELECT id , created_at FROM users ORDER BY id DESC;

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
    users_tasks (
        id_users TEXT NOT NULL,
        id_task TEXT NOT NULL,
        FOREIGN KEY (id_users) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (id_task) REFERENCES tasks(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

SELECT id  FROM tasks ORDER BY id DESC;
DROP TABLE users_tasks;

SELECT *
FROM users
    LEFT JOIN users_tasks ON users_tasks.id_task = users.id;

SELECT * FROM users_tasks;

INSERT INTO
    users_tasks(id_users, id_task)
VALUES ("f001", "t001"), ("f002", "t002"), ("f003", "t003"), ("f001", "t004"), ("f002", "t004");

SELECT
    users.name,
    users.email,
    users.role,
    tasks.title,
    tasks.description,
    tasks.status
FROM tasks
    INNER JOIN users_tasks ON tasks.id = users_tasks.id_task
    INNER JOIN users ON users_tasks.id_users = users.id;