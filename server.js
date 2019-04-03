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
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

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

// Route to patient dashboard
app.get("/patient-dashboard", (req,res) => {
    // check if we have active session cookie
	if (req.session.user) {
		res.render('patient-dashboard', {
			email: req.session.email
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

// Route to create user
app.get("/create-user", (req, res) => {
	res.render("create-user");
});

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
            console.err("err", err) 

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
        assignedPatients: [], // Empty list of assigned patients
    });

    // Set session info
    req.session.user = doctor._id;
    req.session.email = doctor.email;

    // Save patient to the database
	doctor.save(function(err, result) {
        if (err) {
            console.err("err", err) 

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
			console.log(doctor);
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
			console.log(patient);
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
	Patient.find({ email: email}).then((patient) => {
		if (!patient) {
			console.log("Patient not found");
		} else {
			console.log(patient);
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

app.listen(port, () => {
	log(`Listening on port ${port}...`)
});
