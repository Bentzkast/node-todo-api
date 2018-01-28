const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('Mongodb').ObjectID;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,database) =>{
	if(err){
		return console.log('unable to connect to the data base');
	}
	console.log('connected to MongoDB server');
	const db = database.db('TodoApp');

	// db.collection('Users').insert({
	// 	name: "Joseph",
	// 	age: 22,
	// 	location: "here"
	// },(err,result)=>{
	// 	if(err){
	// 		return console.log('Unable to insert todo', err);
	// 	}
	// 	console.log(JSON.stringify(result.ops,undefined,2))
	// });

	db.collection('Todos').find().toArray().then((docs)=>{
		console.log('Todos');
		console.log(JSON.stringify(docs,undefined,2));
	}).catch((err)=>{
		console.log(err);
	});

	database.close();
})