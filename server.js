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



app.get('/info', (req, res) => {
  Person.find({}).then(person => 
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
  )
  
})


app.get('/api/persons', (req, res) => {
  Person.find({}).then(
    persons => res.json(persons)
  )
  
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(
    person => res.json(person)
  )
})

app.delete('/api/persons/:id', (req, res) => {
  Person.deleteOne({_id:req.params.id}).then(
    returnedObject => {
      if (returnedObject.deletedCount) {
        res.status(204).end()
      } else {
        res.json({eror: 'delete failed'})
      }
      }

  )
})

app.post('/api/persons', (req, res) => {
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
        person.save().then(savedPerson => res.json(savedPerson))
      }
    })
  }
  

  
  }
)



const PORT = 3001

app.listen(PORT)
console.log(`Server running on port ${PORT}`)