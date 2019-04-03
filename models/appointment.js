/* Appointment model */
const mongoose = require('mongoose')

const AppointmentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Missing appointment description."],
		minlength: 5
	}
	start: Date,
	end: Date,
	with: {
		type: mongoose.Schema.Types.ObjectId,
		required: [true, "Missing user id."]
	}
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);

module.exports = { Appointment };
