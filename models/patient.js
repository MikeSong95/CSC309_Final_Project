/* Patient model */
const mongoose = require('mongoose')
const Notification = require('./notification')
const Appointment = require('./appointment')
const Doctor = require('./doctor')
const Medication = require('./medication')

const PatientSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, "Missing user id."]
	},
	gender: {
		type: String,
		required: [true, "Gender required."],
		enum : ['M', 'F'],
	},
	bday: {
		type: String,
		required: [true, "Birth date required."],
		validate: {
			validator: function (v) { 
				return /\d{2}-\d{2}-\d{4}/.test(v);
			},
			message:  prop => "Date string must be of the form MM-DD-YYYY."
		}
	},
	hcNum : {
		type: String,
		required: [true, "Health card required."],
		validate: {
			validator: function(v) { 
				return /\d{4}-\d{4}-\d{3}-\[a-zA-Z]{2}/.test(v);
			},
			message:  prop => "Invalid health card number."
		}
	},
	notifications: [Notification.schema],
	appointments: [Appointment.schema],
	assignedDoctors: [Doctors.schema],
	medications: [Medication.schema]
});

const Patient = mongoose.model("Patient", PatientSchema);

module.exports = { Patient };
