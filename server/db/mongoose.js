const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp',{
	// remove warning
	useMongoClient: true
})
.then(()=>{} )
.catch(err => console.log(err));

module.exports.mongoose = mongoose;