const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AppointmentModel = require('./appointment');
const NotificationModel = require('./notification');
const DoctorModel = require('./doctor');
const MedicationModel = require('./medication');

const PatientSchema = new mongoose.Schema({
    id_: Number,
    password: String,
    email: String, 
    phoneNum:String,
    fName:String,
    lName:String,
    gender: String,
    bday: String,
    hcNum: Number,
    notifications: [Object],
    appointments: [Object],    // Empty list of appointment IDs
    assignedDoctors: [Object], // Empty list of assigned doctors
    medications: [Object]     // Empty list of assigned medications
});

// Our own student finding function 
PatientSchema.statics.findByEmailPassword = function(email, password) {
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
PatientSchema.pre('save', function(next) {
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

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = {Patient} ;
