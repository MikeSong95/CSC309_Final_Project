/* Admin model */
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const AdminSchema = new mongoose.Schema({
        email: {
                type: String,
                required: true,
                minlength: 1,
                trim: true, // trim whitespace
                unique: true,
        },
        password: {
                type: String,
                required: true,
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

// Our own admin finding function 
AdminSchema.statics.findByEmailPassword = function(email, password) {
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

// This function runs before saving admin to database
AdminSchema.pre('save', function(next) {
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

const Admin = mongoose.model('Admin', AdminSchema)

module.exports = { Admin }
