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
	console.log(req.body);
	var todo = new Todo({
		text: req.body.text
	});
	console.log(todo);

	// Save with to model 
	todo.save().then((doc)=> {
		res.send(doc);
	})
	.catch((err)=>{
		res.status(400).send(err);
	});
});


app.listen('3000', ()=> console.log('Server started on port 3000!'))

