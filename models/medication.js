/* Medication model */
const mongoose = require('mongoose')

const MedicationSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Missing drug name."]
	}
	dosage: String,
	description: String
});

const Medication = mongoose.model("Medication", MedicationSchema);

module.exports = { Medication };
