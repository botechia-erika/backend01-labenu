"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const knex_1 = require("./models/knex");
const types_1 = require("./types/types");
const app = (0, express_1.default)();
const PORT = 3036;
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield knex_1.db.select(`*`).from(`tasks`);
        res.status(200).send({ tasks: result, message: 'tasks atualizadas' });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/tasks/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const q = req.query.q;
        const [tasks] = yield (0, knex_1.db)("tasks").where({ id: q });
        res.status(200).send({ tasks });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.post("/tasks/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const title = req.body.title;
        const description = req.body.description;
        const status = req.body.status;
        if (typeof id !== typeof "string") {
            res.status(400).send({ message: 'id invalido' });
        }
        if (typeof title != "string") {
            res.status(400).send({ message: 'title deve ser ser descricao alfa numerica iniciada com letras' });
        }
        if (typeof description != "string") {
            res.status(400).send('description deve ser ser descricao alfa numerica iniciada com letras');
        }
        const newTask = {
            id,
            title,
            description,
            status
        };
        yield (0, knex_1.db)("tasks").insert(newTask);
        res.status(200).send("new task adicionada com sucesso");
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.delete("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idTaskDelete = req.params.id;
        const [tasks] = yield (0, knex_1.db)("tasks").where({ id: idTaskDelete });
        if (!tasks) {
            throw new Error("usuario  nao encontrado");
        }
        yield (0, knex_1.db)("tasks").delete().where({ id: idTaskDelete });
        res.status(200).send({ message: 'tasks deletado com sucesso' });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.put("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newid = req.body.id;
        const newTitle = req.body.title;
        const newDescription = req.body.description;
        const newStatus = req.body.status;
        if (newid !== undefined) {
            if (typeof newid !== "string") {
                res.status(400);
                throw new Error("email deve ser tipo string");
            }
        }
        if (newTitle !== undefined) {
            if (typeof newTitle !== "string") {
                res.status(400);
                throw new Error("email deve ser tipo string");
            }
        }
        if (newDescription !== undefined) {
            if (typeof newDescription !== "string") {
                res.status(400);
                throw new Error("password deve ser tipo string");
            }
        }
        if (!newStatus) {
            {
                res.status(400);
                throw new Error("DESCRIÇÃO deve ser ALFA NUMERICO E COMECAR COM LETRAS");
            }
        }
        const [taskToEdit2] = yield knex_1.db.raw(` SELECT * FROM tasks where id ={id}`);
        if (taskToEdit2) {
            taskToEdit2.id = id || taskToEdit2.id;
            taskToEdit2.title = newTitle || taskToEdit2.title;
            taskToEdit2.description = newDescription || taskToEdit2.description;
            taskToEdit2.status = newStatus || taskToEdit2.status;
            yield [taskToEdit2];
        }
        res.status(301).send("tasks editado");
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id || id === "") {
            const result = yield knex_1.db.raw(`SELECT * FROM users`);
            res.send({ result });
        }
        else if (id === "" || id === undefined) {
            res.status(404).send("author não encontrado");
        }
        else {
            const result = yield knex_1.db.raw(`SELECT * FROM users WHERE id="${id}"`);
            res.status(200).send({ result });
        }
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const q = req.params.q;
    try {
        if (q === undefined) {
            const result = yield (0, knex_1.db)("users");
            res.status(200).send({ result });
        }
        else {
            const result = yield (0, knex_1.db)("users").where("name", "LIKES", `%${q}%`);
            res.status(200).send({ result });
        }
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.post("/users/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        const name = req.body.name;
        const nickname = req.body.nickname;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;
        if (typeof id !== typeof "string") {
            res.status(400).send({ message: 'nome invalido' });
        }
        if (typeof name != "string") {
            res.status(400).send({ message: 'nome invalido' });
        }
        if (typeof nickname != "string") {
            res.status(400).send('nickname alfa-numerico');
        }
        if (typeof email != "string") {
            res.status(400).send('nickname alfa-numerico');
        }
        if (typeof password != "string") {
            res.status(400).send("outra senha essa é invalida tente alfa-numerico");
        }
        if (typeof role != "string") {
            res.status(400).send('nickname alfa-numerico');
        }
        const newAuthor = {
            id,
            name,
            nickname,
            email,
            password,
            role
        };
        yield (0, knex_1.db)("users").insert(newAuthor);
        res.status(200).send("cadastro com sucesso");
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idToDelete = req.params.id;
        const [users] = yield (0, knex_1.db)("users").where({ id: idToDelete });
        if (!users) {
            throw new Error("usuario  nao encontrado");
        }
        yield (0, knex_1.db)("users").delete().where({ id: idToDelete });
        res.status(200).send({ message: 'users deletado com sucesso' });
    }
    catch (error) {
        console.log(error);
        if (req.statusCode === 200) {
            res.status(500);
        }
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro inesperado");
        }
    }
}));
app.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const newid = req.body.id;
        const newName = req.body.name;
        const newNickname = req.body.nickname;
        const newemail = req.body.email;
        const newpassword = req.body.password;
        const newType = req.body.role;
        if (newemail !== undefined) {
            if (typeof newemail !== "string") {
                res.status(400);
                throw new Error("email deve ser tipo string");
            }
        }
        if (newpassword !== undefined) {
            if (typeof newpassword !== "string") {
                res.status(400);
                throw new Error("password deve ser tipo string");
            }
        }
        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400);
                throw new Error("name deve ser tipo string");
            }
        }
        if (newNickname !== undefined) {
            if (typeof newNickname !== "string") {
                res.status(400);
                throw new Error("name deve ser tipo string");
            }
        }
        if (newid !== undefined) {
            if (typeof newid !== "string") {
                res.status(400);
                throw new Error("id deve ser tipo string");
            }
        }
        if (newType) {
            if (newType !== types_1.CATEGORY.ADM &&
                newType !== types_1.CATEGORY.BUYER &&
                newType !== types_1.CATEGORY.AUTHOR &&
                newType !== types_1.CATEGORY.INSTRUCTOR &&
                newType !== types_1.CATEGORY.NORMAL) {
                res.status(400);
                throw new Error("type deve ser um tipo valido");
            }
        }
        const [accountToEdit] = yield knex_1.db.raw(`SELECT * FROM users WHERE id="${newid}"`);
        if ([accountToEdit]) {
            accountToEdit.id = newid || accountToEdit.id,
                accountToEdit.name = newName || accountToEdit.name,
                accountToEdit.nickname = newNickname || accountToEdit.nickname;
            accountToEdit.email = newemail || accountToEdit.email,
                accountToEdit.password = newpassword || accountToEdit.password;
            accountToEdit.role = newType || accountToEdit.role;
        }
        const result = yield knex_1.db.raw(` UPDATE users
        SET 
        id=${accountToEdit.id}
        name = ${accountToEdit.name}
        nickname = ${accountToEdit.name}
        email=${accountToEdit.email},
        password=${accountToEdit.role}
        WHERE 
        id = ${id}
        `);
        res.status(301).send({ result, message: "users editado" });
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
            res.send("error inesperado!");
        }
        res.send(error.message);
    }
}));
app.listen(3036, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
//# sourceMappingURL=index.js.map