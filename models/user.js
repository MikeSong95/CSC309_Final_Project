/* User model */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
        email: {
                type: String,
                required: true,
                minlength: 1,
                trim: true, // trim whitespace
                unique: true,
                validate: {
                        validator: validator.isEmail,
                        message: 'Not valid email.'
                }
        },
        password: {
                type: String,
                required: true,
                minlength: [6, "Your password must be at least 6 characters long. Please try another."]
        },
	address: {
		type: String,
		required: [true, "Missing address."]
	},
	phoneNum: {
		type: String,
		required: true,
		minlength: 10
	},
	fName: {
	        type: String,
                required: true,
                minlength: [1, "First name must be at least 1 character long. Please try another."],
                trim: true, // trim whitespace
	},
	lName: {
	        type: String,
                required: true,
                minlength: [1, "Last name must be at least 1 character long. Please try another."],
                trim: true, // trim whitespace
	}
})

// Our own user finding function 
UserSchema.statics.findByEmailPassword = function(email, password) {
        const User = this

        return User.findOne({email: email}).then((user) => {
                if (!user) {
                        return Promise.reject()
                }

                return new Promise((resolve, reject) => {
                        bcrypt.compare(password, user.password, (error, result) => {
                                if (result) {
                                        resolve(user);
                                } else {
                                        reject();
                                }
                        })
                })
        })
}

// This function runs before saving user to database
UserSchema.pre('save', function(next) {
        const user = this

        if (user.isModified('password')) {
                bcrypt.genSalt(10, (error, salt) => {
                        bcrypt.hash(user.password, salt, (error, hash) => {
                                user.password = hash
                                next()
                        })
                })
        } else {
                next();
        }

})

const User = mongoose.model('User', UserSchema)

module.exports = { User }
