const morgan = require('morgan')
const express = (require('express'))
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', function getBody (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :req[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            }
            else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
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

    const person = new Person({
        name: body.name,
        number: body.number
    })    

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    Person.findByIdAndDelete(req.params.id)
        .then(person => {
            if (person) {
                res.status(202).end()
            }
            else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id'), (req, res) => {
    
}

app.get('/info', (req, res) => {
    Person.count({})
        .then(personCount => {
            res.write(`Phonebook has info for ${personCount} people\n\n`)
            res.write(String(new Date()))
            res.end()
    })        
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})