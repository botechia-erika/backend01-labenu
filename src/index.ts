    
import express from 'express'
import    { Request, Response } from 'express';
import cors from 'cors';
import  {db}   from './models/knex'

import { CATEGORY } from './types/types';


const app = express()

const PORT = 3036
const port = process.env.PORT
app.use(cors())
app.use(express.json())



app.get("/tasks", async (req: Request, res: Response) => {
  
    try {
        const result = await db.select(`*`).from(`tasks`)
        res.status(200).send({ tasks: result ,  message: 'tasks atualizadas' });

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

/*--
app.get("/authors", async (req: Request, res: Response) => {
    const result = await db.raw(`SELECT * FROM authors`)
    res.send(result)
    try {
        res.status(200).send({ tasks: result })
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
*/

app.get("/authors", async (req: Request, res: Response) => {
    try {
    const listAuthors = await db.select("*").from("authors")
        res.status(200).send({authors: listAuthors , message: 'Authors atualizadas' })

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

app.post("/authors/create", async (req: Request, res: Response) => {

    try {
        const id = req.body.id
        const name = req.body.name
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const role = req.body.role


        if (typeof id !== typeof "string") {
            res.status(400).send({ message: 'nome invalido' })
        }

        if (typeof name != "string") {
            res.status(400).send({ message: 'nome invalido' })
        }
        if (typeof username != "string") {
            res.status(400).send('username alfa-numerico')
        }
        if (typeof email != "string") {
            res.status(400).send('username alfa-numerico')
        }
        if (typeof password != "string") {
            res.status(400).send("outra senha essa é invalida tente alfa-numerico")
        }
        if (typeof role != "string") {
            res.status(400).send('username alfa-numerico')
        }

        const newAuthor: { id: string, name: string, username: string, email: string, password: string, role: string } = {
            id,
            name,
            username,
            email,
            password,
            role
        }
        await db("authors").insert(newAuthor)
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
app.delete("/authors/:id", async (req: Request, res: Response) => {

    try {
        const idToDelete = req.params.id

        const [authors] = await db("authors").where({ id: idToDelete })
        if (!authors) {
            throw new Error("usuario  nao encontrado")
        }
        await db("authors").delete().where({ id: idToDelete })
        res.status(200).send({ message: 'authors deletado com sucesso' })
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

app.get("/authors/search", async (req: Request, res: Response) => {

    try {
        const q = req.query.name
        const [authors] = await db("authors").where({ name: q })
        res.status(200).send({ authors })
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

app.put("/authors", async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        const newid = req.body.id as string | undefined
        const newName = req.body.name as string | undefined
        const newUsername = req.body.username as string | undefined
        const newemail = req.body.email as string | undefined
        const newpassword = req.body.password as string | undefined
        const newType = req.body.role as CATEGORY


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


        if (newUsername !== undefined) {
            if (typeof newUsername !== "string") {
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




        const [accountToEdit] = await db.raw(` SELECT * FROM authors where id = "${id}"`)
        if (accountToEdit) {
            accountToEdit.id = newid || accountToEdit.id
            accountToEdit.name = newName || accountToEdit.name
            accountToEdit.username = newUsername || accountToEdit.username
            accountToEdit.email = newemail || accountToEdit.email
            accountToEdit.password = newpassword || accountToEdit.password
            await db("authors").update(accountToEdit).where({ id })
        }
        res.status(301).send("authors editado")
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



