
import express from 'express'
import { Request, Response } from 'express';
import cors from 'cors';
import { db } from './models/knex'

import { CATEGORY } from './types/types';


const app = express()

const PORT = 3036
const port = process.env.PORT
app.use(cors())
app.use(express.json())



app.get("/tasks", async (req: Request, res: Response) => {

    try {
        const result = await db.select(`*`).from(`tasks`)
        res.status(200).send({ tasks: result, message: 'tasks atualizadas' });

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

/* SEARCH TASKS*/


app.get("/tasks/search", async (req: Request, res: Response) => {

    try {
        const q = req.query.q
        const [tasks] = await db("tasks").where({ id: q })
        res.status(200).send({ tasks })
    }
    catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


/******************************************CREATE TASKS***********************************************/
app.post("/tasks/create", async (req: Request, res: Response) => {

    try {
        const id = req.body.id
        const title = req.body.title
        const description = req.body.description
        const status = req.body.status

        if (typeof id !== typeof "string") {
            res.status(400).send({ message: 'id invalido' })
        }

        if (typeof title != "string") {
            res.status(400).send({ message: 'title deve ser ser descricao alfa numerica iniciada com letras' })
        }
        if (typeof description != "string") {
            res.status(400).send('description deve ser ser descricao alfa numerica iniciada com letras')
        }


        const newTask: { id: string, title: string, description: string, status: number } = {
            id,
            title,
            description,
            status
        }
        await db("tasks").insert(newTask)
        res.status(200).send("new task adicionada com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
/*************************TASKS DELETE *************************/

app.delete("/tasks/:id", async (req: Request, res: Response) => {

    try {
        const idTaskDelete = req.params.id

        const [tasks] = await db("tasks").where({ id: idTaskDelete })
        if (!tasks) {
            throw new Error("usuario  nao encontrado")
        }
        await db("tasks").delete().where({ id: idTaskDelete })
        res.status(200).send({ message: 'tasks deletado com sucesso' })
    }
    catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


/***********************************EDIT TASKS *************************************************/

app.put("/tasks/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const newid = req.body.id as string | undefined
        const newTitle = req.body.title as string | undefined
        const newDescription = req.body.description as string | undefined
        const newStatus = req.body.status as number | undefined


        if (newid !== undefined) {
            if (typeof newid !== "string") {
                res.status(400)
                throw new Error("email deve ser tipo string")
            }
        }


        if (newTitle !== undefined) {
            if (typeof newTitle !== "string") {
                res.status(400)
                throw new Error("email deve ser tipo string")
            }
        }

        if (newDescription !== undefined) {
            if (typeof newDescription !== "string") {
                res.status(400)
                throw new Error("password deve ser tipo string")
            }
        }

        if (!newStatus) {
            {
                res.status(400)
                throw new Error("DESCRIÇÃO deve ser ALFA NUMERICO E COMECAR COM LETRAS")
            }
        }






        const [taskToEdit2] = await db.raw(` SELECT * FROM tasks where id ={id}`)
        if (taskToEdit2) {
            taskToEdit2.id = id || taskToEdit2.id
            taskToEdit2.title = newTitle || taskToEdit2.title
            taskToEdit2.description = newDescription || taskToEdit2.description
            taskToEdit2.status = newStatus || taskToEdit2.status
            await [taskToEdit2]
        }
        res.status(301).send("tasks editado")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.get("/users/:id", async (req: Request, res: Response) => {
    const id = req.params.id

    try {
        if (!id || id === "") {
            const result = await db.raw(`SELECT * FROM users`)
            res.send({ result })
        }
        else if (id === "" || id === undefined) {
            res.status(404).send("author não encontrado")
        }
        else {

            const result = await db.raw(`SELECT * FROM users WHERE id="${id}"`)
            res.status(200).send({ result })
        }
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
}
)



app.get("/users", async (req: Request, res: Response) => {
    const q = req.params.q
    try {
        if (q === undefined) {

            const result = await db("users")
            res.status(200).send({ result })

        }

        else {
            const result = await db("users").where("name", "LIKES", `%${q}%`)
            res.status(200).send({ result })
        }

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/users/create", async (req: Request, res: Response) => {

    try {
        const id = req.body.id
        const name = req.body.name
        const nickname = req.body.nickname
        const email = req.body.email
        const password = req.body.password
        const role = req.body.role


        if (typeof id !== typeof "string") {
            res.status(400).send({ message: 'nome invalido' })
        }

        if (typeof name != "string") {
            res.status(400).send({ message: 'nome invalido' })
        }
        if (typeof nickname != "string") {
            res.status(400).send('nickname alfa-numerico')
        }
        if (typeof email != "string") {
            res.status(400).send('nickname alfa-numerico')
        }
        if (typeof password != "string") {
            res.status(400).send("outra senha essa é invalida tente alfa-numerico")
        }
        if (typeof role != "string") {
            res.status(400).send('nickname alfa-numerico')
        }

        const newAuthor: { id: string, name: string, nickname: string, email: string, password: string, role: string } = {
            id,
            name,
            nickname,
            email,
            password,
            role
        }
        await db("users").insert(newAuthor)
        res.status(200).send("cadastro com sucesso")
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})
app.delete("/users/:id", async (req: Request, res: Response) => {

    try {
        const idToDelete = req.params.id

        const [users] = await db("users").where({ id: idToDelete })
        if (!users) {
            throw new Error("usuario  nao encontrado")
        }
        await db("users").delete().where({ id: idToDelete })
        res.status(200).send({ message: 'users deletado com sucesso' })
    }
    catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})


app.put("/users/:id", async (req: Request, res: Response) => {
    try {

        const id = req.params.id
        const newid = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newNickname = req.body.nickname as string | undefined
        const newemail = req.body.email as string | undefined
        const newpassword = req.body.password as string | undefined
        const newType = req.body.role as CATEGORY.ADM | CATEGORY.INSTRUCTOR | CATEGORY.NORMAL | CATEGORY.BUYER | CATEGORY.AUTHOR

        if (newemail !== undefined) {
            if (typeof newemail !== "string") {
                res.status(400)
                throw new Error("email deve ser tipo string")
            }
        }

        if (newpassword !== undefined) {
            if (typeof newpassword !== "string") {
                res.status(400)
                throw new Error("password deve ser tipo string")
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== "string") {
                res.status(400)
                throw new Error("name deve ser tipo string")
            }
        }


        if (newNickname !== undefined) {
            if (typeof newNickname !== "string") {
                res.status(400)
                throw new Error("name deve ser tipo string")
            }
        }


        if (newid !== undefined) {
            if (typeof newid !== "string") {
                res.status(400)
                throw new Error("id deve ser tipo string")
            }
        }

        if (newType) {
            if (
                newType !== CATEGORY.ADM &&
                newType !== CATEGORY.BUYER &&
                newType !== CATEGORY.AUTHOR &&
                newType !== CATEGORY.INSTRUCTOR &&
                newType !== CATEGORY.NORMAL

            ) {
                res.status(400)

                throw new Error("type deve ser um tipo valido")
            }
        }



        const [accountToEdit] = await db.raw(`SELECT * FROM users WHERE id="${newid}"`)
        if ([accountToEdit]) {
            accountToEdit.id = newid || accountToEdit.id,
                accountToEdit.name = newName || accountToEdit.name,
                accountToEdit.nickname = newNickname || accountToEdit.nickname
            accountToEdit.email = newemail || accountToEdit.email,
                accountToEdit.password = newpassword || accountToEdit.password
            accountToEdit.role = newType || accountToEdit.role
        }
        const result = await db.raw(` UPDATE users
        SET 
        id=${accountToEdit.id}
        name = ${accountToEdit.name}
        nickname = ${accountToEdit.name}
        email=${accountToEdit.email},
        password=${accountToEdit.role}
        WHERE 
        id = ${id}
        `);

        res.status(301).send({ result, message: "users editado" })
    } catch (error) {
        console.log(error)
        if (res.statusCode === 200) {
            res.status(500)
            res.send("error inesperado!")
        }
        res.send(error.message)
    }
})
app.listen(3036, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})



