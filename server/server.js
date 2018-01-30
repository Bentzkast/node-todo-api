const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose').mongoose;
const ObjectId = require('mongodb').ObjectID;
const User = require('./models/user').User;
const Todo = require('./models/todo').Todo;

const port = process.env.PORT || 3000;
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
		res.send({docs});
	})
	.catch((err)=>{
		res.status(500).send(err);
	});

});

app.get('/todos/:id',(req, res)=>{
	var id = req.params.id;
	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}

	Todo.findById(id).then((docs) =>{
		if(!docs){
			return res.status(404).send({});
		}
		res.send({docs});
	})
	.catch((err)=>{
		return res.status(400).send({});
	});
});

app.delete('/todos/:id',(req, res)=>{
	var id = req.params.id;
	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}

	Todo.findByIdAndRemove(id).then((docs)=>{
		if(!docs){
			return res.status(404).send({});
		}
		res.send({docs});
	}).catch((err)=>{
		return res.status(400).send({});
	});
});

app.patch('/todos/:id',(req,res) =>{
	var id = req.params.id;
	var body = _.pick(req.body, ['text', 'completed']);

	if(!ObjectId.isValid(id)){
		return res.status(404).send();
	}

	if(_.isBoolean(body.completed) && body.completed){
		body.completedAt = new Date().getTime();
	}else{
		body.completed = false;
		body.completedAt = null;
	}
	console.log(body);

	Todo.findByIdAndUpdate(id,{$set: body}, {new :true}).then((docs)=>{
		if(!docs){
			return res.status(404).send();
		}
		res.send({docs});
	})
	.catch((err)=>{
		return res.status(400).send();
	});

});


app.listen(port, ()=> console.log(`Server started on port ${port}!`));
module.exports = {app};