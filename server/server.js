const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose').mongoose;
const User = require('./models/user').User;
const Todo = require('./models/todo').Todo;

var app = express();

app.use(bodyParser.json())

app.get('/',(req,res)=>{
	res.send('hello');
});

app.post('/todos', (req,res) =>{
	var todo = new Todo({
		text: req.body.text
	});

	// Save with to model 
	todo.save().then((doc)=> {
		res.send(doc);
	})
	.catch((err)=>{
		res.status(400).send(err);
	});
});

app.get('/todos', (req,res) =>{
	Todo.find().then((docs)=>{
		res.send({docs})
	})
	.catch((err)=>{
		res.status(500).send(err);
	});

})


app.listen('3000', ()=> console.log('Server started on port 3000!'))
module.exports = {app};