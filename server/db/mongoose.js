const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// heroku addons:create mongolab:sandbox
mongoose.connect(process.env.MONGODB_URI,{
	// remove warning
	useMongoClient: true
})
.then(()=>{console.log('connected to',process.env.MONGODB_URI)} )
.catch(err => console.log(err));

module.exports.mongoose = mongoose;