const morgan = require('morgan')
const express = (require('express'))
const cors = require('cors')
const app = express()
require('dotenv').config()
const Note = require('./models/person')


app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-4323122"
    }
]

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({
            error: 'name missing'
        })
    }
    else if (!body.number) {
        return res.status(400).json({
            error: 'number missing'
        })
    }
    else if(persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {        
        return res.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * (10000 - 1) + 1),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    return res.status(200).json()
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(202).end()
})

app.get('/info', (req, res) => {
    res.write(`Phonebook has info for ${persons.length} people\n\n`)
    res.write(String(new Date()))
    res.end()
    
})

const PORT = process.env.PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})