import express from 'express';
import bcrypt from 'bcrypt';
const app = express();

app.use(express.json())

let users = [];

app.get('/users', (request, response) => {
    response.json(users)
})

app.post('/users', async (request, response) => {
    try {
        const hashedPassword = await bcrypt.hash(request.body.password, 10)
        const user = { name: request.body.name, password: hashedPassword }
        users.push(user)
        response.status(201).send({ status: true, user })
    } catch (err) {
        response.status(500).send({ status: false, error: err })
    }
})

app.post('/login', async (request, response) => {
    const user = users.find(user => user.name == request.body.name)
    console.log("0", user);
    if (user == null) {
        response.status(400).send({ status: "false 1" })
    }
    try {
        if (await bcrypt.compare(request.body.password, user.password)) {
            response.status(200).send({ status: true })
        }
        else {
            response.send({ status: "false 2" })
        }
    } catch (err) {
        response.status(500).send({ status: false, error: err })
    }
})

app.listen(4000)