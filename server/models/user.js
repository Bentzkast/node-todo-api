const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('User', {
	email: {
		required: true,
		trim: true,
		type: String,
		minlength: 1,
		unique: true,
		validate: {
			validator : value => validator.isEmail(value),
			message: '{VALUE} is not a valid email'
		}
	},
	password: {
		type: String,
		required: true,
		minlength: 6
	},
	token: [{
		access:{
			type: String,
			required: true
		}, 
		token:{
			type: String,
			required: true
		}
	}
	]
});

module.exports.User = User;