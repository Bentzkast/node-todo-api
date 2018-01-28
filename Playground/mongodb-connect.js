const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('Mongodb').ObjectID;

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

	// db.collection('Todos').find().toArray().then((docs)=>{
	// 	console.log('Todos');
	// 	console.log(JSON.stringify(docs,undefined,2));
	// }).catch((err)=>{
	// 	console.log(err);
	// });

	// // deleteOne
	// db.collection('Todos').findOneAndDelete({_id: ObjectId("5a6e168e3ed47fc3d2725cb8")}).then((res)=>{
	// 	console.log(res);
	// });

	// deletemany
	// findOneAndDelete

	db.collection('Todos').findOneAndUpdate(
		{"_id" : ObjectId("5a6e19aa3ed47fc3d2725d31")
	},{
		$set: {
			done: false
		},
		$inc: {
			priority: 1
		}
	},{
		returnOriginal: false
	}
	).then((result)=>{
		console.log(result);
	}
	)

	database.close();
})