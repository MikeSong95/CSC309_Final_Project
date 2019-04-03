/* Notification  model */
const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
	description: {
		type: String,
		required: true,
		minlength: 1
	},
	alertFreq: {
		type: Number,
		default: 5000
	}
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };
