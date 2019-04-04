'use strict';
const log = console.log;

const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')
const path = require('path');

// Mongoose
const { mongoose } = require('./db/mongoose');

// Models
const { Patient } = require('./models/patient');
const { Doctor } = require('./models/doctor');

// Express
const port = process.env.PORT || 3000
const app = express();

// Body parser for data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  })); 

// View engine
app.engine('ejs', require('ejs').renderFile);
app.set('view engine', 'ejs');

// Service static files
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

const session = require('express-session')

// Add express sesssion middleware
app.use(session({
	secret: 'oursecret',
	resave: false,
	saveUninitialized: false,
	cookie: {
		expires: 600000,
		httpOnly: true
	}
}));

// Add middleware to check for logged-in users
const sessionChecker = (req, res, next) => {
	if (req.session.user) {
		res.redirect('/')
	} else {
		next();
	}
}

/* Routes */

// Default route to login
app.get("/", (req,res) => {
    res.render("index",{error: false});
});

// Logout route
app.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/')
		}
	})
})

// Route to patient dashboard
app.get("/patient-dashboard", (req,res) => {
	// Route can handle email via query or body
	let email;
	if (req.body.email == undefined) {
		email = req.session.email
	} else {
		email = req.body.email
	}

	// check if we have active session cookie
	if (req.session.user) {
		res.render('patient-dashboard', {
			email: email
		});
	} else {
		res.redirect('/')
	}
});

// Route to doctor dashboard
app.get("/doctor-dashboard", (req,res) => {
    // check if we have active session cookie
	if (req.session.user) {
		res.render('doctor-dashboard', {
			email: req.session.email
		});
	} else {
		res.redirect('/')
	}
});

// Route to patient profile page
// Require email of patient in query to pass to patient profile page
app.get("/patient-profile", (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		res.render("patient-profile", {email: req.query.email});
	} else {
		res.redirect('/')
	}
});

// Route to create user
app.get("/create-user", (req, res) => {
	res.render("create-user", {error:false});
});

app.get("/patient-edit-profile", (req, res) => {
	// check if we have active session cookie
	if (req.session.user) {
		res.render("patient-edit-profile");
	} else {
		res.redirect('/')
	}
});

app.post("/edit-patient", (req, res) => {
	const data = {
		password: req.body.password,
		email: req.body.email, 
		phoneNum:req.body.phone,
		fName:req.body.fname,
		lName:req.body.lname,
		gender:req.body.gender,
		hcNum: req.body.hcnum
	}

	// Otherwise, findById
	Patient.findOne({email:req.session.email}).then((patient) => {
		if (!patient) {
			res.status(404).send();
		} else {
			if (data.password != "") {
				patient.password = data.password;		
				// Mark it as modified
				patient.markModified('password');
			} 
			if (data.email != "") {
				patient.email = data.email;
				// Mark it as modified
				patient.markModified('email');
			}
			if (data.phoneNum != "") {
				patient.phoneNum = data.phoneNum;
				// Mark it as modified
				patient.markModified('phoneNum');
			}
			if (data.fName != "") {
				patient.fName = data.fName;
				// Mark it as modified
				patient.markModified('fName');
			}
			if (data.lName != "") {
				patient.lName = data.lName;
				// Mark it as modified
				patient.markModified('lName');
			}
			if (data.gender != "") {
				patient.gender = data.gender;
				// Mark it as modified
				patient.markModified('gender');
			}
			if (data.hcNum != "") {
				patient.hcNum = data.hcNum;
				// Mark it as modified
				patient.markModified('hcNum');
			}

			// Save it
			patient.save().then(() => {
				res.redirect('/patient-dashboard?email=' + req.session.email)
			}, (error) => {
				res.status(400).send(error) // 400 for bad request
			})
		}
	}).catch((error) => {
		res.status(500).send();
	});
})

/* GET Requests */

// Login
app.get("/login", (req,res) => {
    const email = req.query.email;
	const password = req.query.password;
	
	// Otheriwse, find email / password combo
	Patient.findByEmailPassword(email, password).then((patient) => {
		req.session.user = patient._id;
		req.session.email = patient.email;
		res.redirect("/patient-dashboard");
	}).catch((error) => {
		 // Try finding doctor
		 Doctor.findByEmailPassword(email, password).then((doctor) => {
			req.session.user = doctor._id;
			req.session.email = doctor.email;
			res.redirect("/doctor-dashboard");
		}).catch((error) => {
			// User not found or credentials incorrect
			res.render("index",{error: true});
		});
	});
});

/* POST Requests */
// Create patient
app.post("/create-patient", (req, res) => {
	// Create patient document
	const patient = new Patient({
        password: req.body.password,
        email: req.body.email, 
        phoneNum:req.body.phone,
        fName:req.body.fname,
        lName:req.body.lname,
        gender:req.body.gender,
        hcNum: req.body.hcnum,
        bday:"123",
        notifications: [],
        appointments: [],    // Empty list of appointment IDs
        assignedDoctors: [], // Empty list of assigned doctors
        medications: []   
    });

	// Set session info
	req.session.user = patient._id;
	req.session.email = patient.email;

	// Save patient to the database
	patient.save(function(err, result) {
		if (err) {
			// An error occurred, stop execution and return 500
			return res.status(500).send();
		} else {
			res.redirect('/patient-dashboard')
		}
	});
	
    
});

// Create doctor
app.post("/create-doctor", (req, res) => {
	// Create document
	const doctor = new Doctor({
        password: req.body.password,
        email: req.body.email, 
        phoneNum:req.body.phone,
        fName:req.body.fname,
        lName:req.body.lname,
        specialty:req.body.specialty,
        address: req.body.address,
        notifications: [],
        appointments: [],    // Empty list of appointment IDs
        assignedPatients: [] // Empty list of assigned patients
    });

    // Set session info
    req.session.user = doctor._id;
    req.session.email = doctor.email;

    // Save patient to the database
	doctor.save(function(err, result) {
        if (err) {
            console.error("err", err) 

            // An error occurred, stop execution and return 500
            return res.status(500).send();
        } else {
            res.redirect('/doctor-dashboard')
        }
    });
});

// Update list of assigned patients of doctor email
app.post('/addAssignedPatient', (req, res) => {
	const email = req.body.email;

	const patient = req.body.patient;

	// Find doctor by email
	Doctor.findOne({email:email}).then((doctor) => {
		if (!doctor) {
			res.status(404).send();
		} else {
			// Push reservation onto restaurant array
			doctor.assignedPatients.push(patient);
			// Mark it as modified
			doctor.markModified('assignedPatients');
			// Save it
			doctor.save().then(() => {
				res.redirect('/doctor-dashboard')
			}, (error) => {
				res.status(400).send(error) // 400 for bad request
			})
		}
	}).catch((error) => {
		res.status(500).send();
	});
});

// Update list of assigned doctor of patient email
app.post('/addAssignedDoctor', (req, res) => {
	// Add code here
	const email = req.body.email;

	const doctor = req.body.doctor;

	// Otherwise, findById
	Patient.findOne({email:email}).then((patient) => {
		if (!patient) {
			res.status(404).send();
		} else {
			// Push reservation onto restaurant array
			patient.assignedDoctors.push(doctor);
			// Mark it as modified
			patient.markModified('assignedDoctors');
			// Save it
			patient.save().then(() => {
				res.redirect('/doctor-dashboard')
			}, (error) => {
				res.status(400).send(error) // 400 for bad request
			})
		}
	}).catch((error) => {
		res.status(500).send();
	});
});

// GET patient by email
app.get('/patients', (req, res) => {
    const email = req.query.email // the id is in the req.body object

	// Otheriwse, find by email
	Patient.findOne({ email: email}).then((patient) => {
		if (!patient) {
			console.log("Patient not found");
		} else {
			res.send(patient)
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
})

// GET all patients
app.get('/allPatients', (req, res) => {
	// Otheriwse, find by email
	Patient.find({}).then((patient) => {
		if (!patient) {
		} else {
			res.send(patient)
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
})

// GET doctor by email
app.get('/doctors', (req, res) => {
    const email = req.query.email // the id is in the req.body object
    
	// Otheriwse, find by email
	Doctor.find({ email: email}).then((doctor) => {
		if (!doctor) {
		} else {
			res.send(doctor)
		}
		
	}).catch((error) => {
		res.status(500).send(error)
	})
})

app.delete("/removeAssignedPatient", (req, res) => {
	const patient_email = req.body.patient_email;	// email of the patient to remove
	const doctor_email = req.body.doctor_email;		// doctor to remove patient from

	// Find patient to remove doctor from
	Patient.findOne({email: patient_email}).then((patient) => {
		if (!patient) {

		} else {
			for (let i = 0; i < patient.assignedDoctors.length; i++) {
				if (patient.assignedDoctors[i].email == doctor_email) {
					patient.assignedDoctors.splice(i, 1);

					// Mark it as modified
					patient.markModified('assignedDoctors');
					// Save it
					patient.save();
				}
			}
		}
	}).catch((error) => {
		res.status(500).send(error)
	});

	// Find doctor to remove patient from
	Doctor.findOne({email: doctor_email}).then((doctor) => {
		if (!doctor) {
		} else {
			for (let i = 0; i < doctor.assignedPatients.length; i++) {
				if (doctor.assignedPatients[i].email == patient_email) {
					doctor.assignedPatients.splice(i, 1);

					// Mark it as modified
					doctor.markModified('assignedPatients');

					// Save it
					doctor.save().then(() => {
						res.send('Success')
					}, (error) => {
						res.status(400).send(error) // 400 for bad request
					})
				}
			}
		}
	}).catch((error) => {
		res.status(500).send(error)
	});
});

app.post("/add-medication", (req, res) => {
	// update patient med array
	// add med button
	const name = req.body.name;
	const dosage = req.body.dosage;
	const description = req.body.description;
	const patient_email = req.body.email;

	Patient.findOne({"email": patient_email})
	.then((patient) => {
		if (!patient) {
			res.status(404).send("Not valid patient email")
		} else {
			patient.medications.push({name, dosage, description});
			patient.save();
		}
	})
	.then((result) => {
		res.redirect("/patient-profile?email=" + patient_email);
	}, (error) => {
		res.status(400).send(error) // 400 for bad request
	})
	.catch((error) => {
		res.status(500).send(error)
	})
})

app.post("/book-appointment", (req, res) => {
	// update patient and doctor appointment array
	// submit appointment

	const patient_email = req.body.email
	const doctor_email = req.session.email

	const date_start = {
		year : req.body.year, 
		month: req.body.month, 
		date: req.body.day, 
		time: req.body.start_t
	}
	const date_end = {
		year : req.body.year, 
		month: req.body.month, 
		date: req.body.day, 
		time: req.body.end_t
	}

	const appointment = {
		name: req.body.appt_type, 
		start: date_start, 
		end: date_end, 
		patient: patient_email,
		doctor: doctor_email
	}

	// Find patient to remove doctor from
	Patient.findOne({email: patient_email}).then((patient) => {
		if (!patient) {

		} else {
			patient.appointments.push(appointment);
			patient.markModified("appointments")
			patient.save();
		}
	}).catch((error) => {
		res.status(500).send(error)
	});

	// Find patient to remove doctor from
	Doctor.findOne({email: doctor_email}).then((doctor) => {
		if (!doctor) {

		} else {
			doctor.appointments.push(appointment);
			doctor.markModified("appointments")
			doctor.save().then(() => {
				res.redirect("/patient-profile?email=" + patient_email);
			}, (error) => {
				res.status(400).send(error) // 400 for bad request
			});
		}
	}).catch((error) => {
		res.status(500).send(error)
	});	
})


app.patch("/update-medication", (req, res) => {
	// update medication in patient med array
	// save and submit
	const medication = req.body.medication
	const description = req.body.description
	const email = req.body.email
	console.log("med: " + medication)
	console.log("desc: " + description)
	console.log("email: " + email)
	// Patient.findOneAndUpdate(
	// 	{"email": email, "medications.name": medication}, 
	// 	{"$set": {"medications.$": {description} }}, 
	// 	{new: true})
	// .then((patient)=> {
	// 	if (!patient) {
	// 		res.status(404).send()
	// 	}
	// 	patient.save()

	// })
	Patient.findOne({"email": email})
	.then((patient)=> {
		if (!patient) {
			res.status(404).send("Patient does not exist")
		}
		console.log(patient.medications)
		patient.medications.forEach(med => {
			console.log(med)
			
			if (med.name == medication) {
				med.description = description
				console.log(med.name)
				console.log(med.description)
			}
		});
		patient.save().then((result) => {
			res.redirect("/patient-profile?email=" + email);
		},(error) => {
			res.status(400).send()
		})
		.catch((error) => {
			res.status(500).send(error)
		})
	})
})

app.delete("/delete-medication", (req, res) => {
	// delete medication from patient med array
	// delete button
	// call get
	const medication = req.body.medication
	const email = req.body.email

	Patient.findOne({email:email})
	.then((patient) => {
		if (!patient) {
			res.status(404).send()
		}
		let index_to_remove;
		for (let i=0; i < patient.medications.length; i++) {
			if (patient.medications[i].name == medication) {
				index_to_remove = i;
			}
		}
		patient.medications.splice(index_to_remove, 1);
		patient.save().then((result) => {
			res.redirect("/patient-profile?email=" + email);
		},(error) => {
			res.status(400).send()
		})
	})
})

// back button to /doctor-dashboard



app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
