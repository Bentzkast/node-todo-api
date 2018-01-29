const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',{
	// remove warning
	useMongoClient: true
})
.then(()=>{console.log('connected to',process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp')} )
.catch(err => console.log(err));

module.exports.mongoose = mongoose;