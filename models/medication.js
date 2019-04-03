const mongoose = require('mongoose');

// Reservations will be embedded in the Restaurant model
const MedicationSchema = new mongoose.Schema({
    id_: Number,
});

const Medication = mongoose.model('Medication', MedicationSchema);

module.exports = Medication;
