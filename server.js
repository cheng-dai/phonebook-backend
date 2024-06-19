import express from 'express'
import cors from 'cors'
import morgan from 'morgan';
import Person from './models/person.js';

const app = express();
morgan.token('body', function getBody (req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  
})



app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist'))

// const generateId = () => Math.floor(Math.random() * 1000)

// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]



app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => 
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  )
  .catch(e => next(e))
  
})


app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(
    persons => res.json(persons)
  ).catch(e => next(e))
  
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(
    person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    }
  )
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id).then(
    deletedPerson => {
      if (deletedPerson) {
        res.status(204).end()
      } else {
        res.json({eror: 'delete failed'})
      }
    }
  ).then(e => next(e))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name) {
    res.status(400).json({error: 'missing name'})
  } else if (!body.number) {
    res.status(400).json({error: 'missing number'})
  } else {
    Person.findOne({name:body.name}).then(samePerson =>{
      if (samePerson) {
        return res.status(400).json({
          error: 'name need to be unique'
        })
      } else {
        const person = new Person({...body})
        person.save().then(savedPerson => res.json(savedPerson)).catch(
          e => next(e)
        )
      }
    })
  } 
  }
)

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number
  }
  console.log('put id', req.params.id)
  console.log('put person', person)
  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(e => next(e))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT

app.listen(PORT)
console.log(`Server running on port ${PORT}`)