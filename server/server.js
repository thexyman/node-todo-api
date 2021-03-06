// Lodash is bascially a library with lots of realy cool methods,
// particularlry useful for patch route
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

// importing all local dependencies 
// database
var {mongoose} = require('./db/mongoose')
// models
var {Todo} = require('./models/todo')
var {User} = require('./models/user')

var app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())

// (CREATE) POST NEW RESOURCE
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })
    todo.save().then((doc) => {
        res.send(doc)
    }, (e) => {
        res.status(400).send(e)
    })
})

// GET ALL TODOS (INDEX)
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        })
    }, (e) => {
        res.status(400).send(e)
    })
})

// GET SINGLE RESOURCE (SHOW)
app.get('/todos/:id', (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({ todo })
    }).catch((e) => {
        res.status(400).send({})
    })
})

// DELETE
app.delete('/todos/:id', (req, res) => {
    var id = req.params.id

    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send()
        }
        res.send({ todo })
    }).catch((e) => {
        res.status(400).send({})
    })

})

// PATCH/UPDATE
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id 
    // pick pulls of properties if they exist, in this case if present 
    // in the body of the request so that only what we want to allow to 
    // update gets updated
    var body = _.pick(req.body, ['text', 'completed'])

    if (!ObjectID.isValid(id)) {
        res.status(404).send()
    }

    // Code to set the completedAt value
    if (_.isBoolean(body.completed) && body.completed ) {
        body.completedAt = new Date().getTime()
    } else {
        body.completed = false
        body.completedAt = null
    }

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true })
        .then((todo) => {
            if (!todo) {
                return res.status(404).send()
            }
            res.send({ todo })
        }).catch((e) => {
            res.status(400).send()
        })

})



app.listen(port, () => {
    console.log(`Started up at port ${port}`)
})


module.exports = { app }



































// // tell mogoose to use built in promise library instaead of thrid party
// mongoose.Promise = global.Promise

// mongoose.connect('mongodb://localhost:27017/TodoApp', )

// // .model() is a method used to create a new mode
// // the second argument is similar to the schema object on the 
// // mongoose schema website 

// var Todo = mongoose.model('Todo', {
//     text: {
//         type: String, 
//         required: true, 
//         minlength: 1, 
//         trim: true
//     },
//     completed: {
//         type: Boolean, 
//         default: false 
//     },
//     completedAt: {
//         type: Number,
//         default: null
//     }
// })

// // var newTodo = new Todo({
// //     text: "Cook dinner"
// // })

// // newTodo.save().then((doc) => {
// //     console.log("Saved todo", doc)
// // }, (error) => {
// //     console.log('Unable to save Todo')
// // })

// // var secondToDo = new Todo({
// //     text: "hello"
// //  })

// // secondToDo.save().then((doc) => {
// //     console.log(JSON.stringify(doc, undefined, 2))
// // }, (error) => {
// //     console.log("Unable to save todo")
// // })



// // #Challenge: create new User model 
// var User = mongoose.model('User', {
//     email: {
//         type: String,
//         required: true,
//         minlength: 1,
//         trim: true
//     }
// })

// var newUser = new User({
//     email: "makdaa1@gmail.com"
// })

// newUser.save().then((doc) => {
//     console.log(JSON.stringify(doc, undefined, 2))
// }, (error) => {
//     console.log("unable to save user")
// })






/*
https://mongoosejs.com/docs/validation.html

Schema:
https://mongoosejs.com/docs/guide.html
is the same as schema.rb file in RoR and in the same way each model 
has a table, each collection/model has a schema

*/


