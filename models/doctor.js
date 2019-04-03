const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const AppointmentModel = require('./appointment');
const NotificationModel = require('./notification');
const PatientModel = require('./patient');

const DoctorSchema = new mongoose.Schema({
    id_: Number,
    password: String,
    email: String, 
    phoneNum:String,
    fName:String,
    lName:String,
    specialty: String,
    address: String,
    notifications: [NotificationModel.schema],
    appointments: [AppointmentModel.schema],    // Empty list of appointment IDs
    assignedPatients: [Object] // Empty list of assigned doctors
});


// Our own student finding function 
DoctorSchema.statics.findByEmailPassword = function(email, password) {
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
DoctorSchema.pre('save', function(next) {
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

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = {Doctor};