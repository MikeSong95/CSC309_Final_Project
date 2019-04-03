/* Doctor model */
const mongoose = require('mongoose')
const Notification = require('./notification')
const Appointment = require('./appointment')
const Patient = require('./patient')

const DoctorSchema = new mongoose.Schema({
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "Missing user id."]
        },
        specialty: String,
	notifications: [Notification.schema],
        assignedPatients: [Patientss.schema],
        appointments: [Appointment.schema],
});	
        
const Doctor = mongoose.model("Doctor", DoctorSchema);

module.exports = { Doctor };
