/* PATIENT DASHBOARD DOM FUNCTIONS */

// Make user a global variable for now
let user;
let add_patient_list = [];

// Populate DOM with server data on page load
$(function() {
    $('[data-toggle="popover"]').popover()
    $().popover({container: 'body'})

    $('#myModal').on('shown.bs.modal', function () {
        $('#add-patient-trigger').trigger('focus')
      })

    const searchForm = document.querySelector('#search-form');
    searchForm.addEventListener('input', dynamicSearch);

    // Make a fake doctor and patient for now
    // createPatient will be removed when server calls are implemented
    createDoctor(0, "password123", "user", "(123) 456 - 7890", "Mike", "Song", "General Surgeon", "123 Street");
    createPatient(0,'password','patient1@gmail.com', '(123) 456 - 7890', 'Mark', 'Kazakevich','Male','Feb 1', '1234');
    createPatient(1,'password','patient2@gmail.com', '(123) 456 - 7890', 'Mike', 'Song','Male','Feb 23', '4');
    createPatient(2,'password','patient3@gmail.com', '(123) 456 - 7890', 'Bill', 'Bob','Male','Feb 12', '5');
    createPatient(3,'password','patient3@gmail.com', '(123) 456 - 7890', 'Alice', 'Lee','Female','Feb 12', '5');
    createPatient(4,'password','patient3@gmail.com', '(123) 456 - 7890', 'Tom', 'Aasdf','Male','Feb 12', '5');
    createPatient(5,'password','patient3@gmail.com', '(123) 456 - 7890', 'Some', 'Body','Male','Feb 12', '5');

    getCurrentUser();
    user.assignPatient(patientList[0]);
    user.assignPatient(patientList[1]);
    user.assignPatient(patientList[2]);
    populate_appointments();
    populate_patients();
});

document.addEventListener("click", function() {
    $('#patients-card').css("z-index", "1");
});

function bringToFront() {
        // Set everything else to back
        $('#patients-card').css("z-index", "-1");
}

// Function to return information of current user profile
function getCurrentUser() {
    // SERVER_CALL Get information of user profile from server
    // For now return fake user we created
    user = doctorList[0];
}

// Function to get list of user's patients
// Will be replaced by user.getPatients() eventually when server functionality added
function getUserPatients() {
    return user.getPatients();
}

// Function to get list of user's appointments
// Will be replaced by user.getAppointments() eventually when server functionality added
function getUserAppointments() {
    // Hard-code in appointments for now
    const patient1 = patientList[0];
    const patient2 = patientList[1];

    const appt1 = new Appointment(0, "Regular Checkup", new dateTime("2019", "Feb","28",1100), new dateTime("2019", "Feb","28",1200),patient1);
    const appt2 = new Appointment(1, "Medication Info", new dateTime("2019", "Mar","05",1400), new dateTime("2019", "Mar","05",1500),patient2);

    // Note: Adding appointments is done from doctor's side
    // Rescheduling appointments is a different functionality and may be initiated by either patients or doctors
    user.addAppointment(patient1, appt1);
    user.addAppointment(patient2, appt2);

    return user.getAppointments();
}

function getUserNotifications() {
    return user.getNotifications();
}

// Populate the "Appointments" section
function populate_appointments() {
    const appointmentList = getUserAppointments();

    for (let i = 0; i < appointmentList.length; i++) { 
        $('#appt-list').append('<div class="item-container">'+
                                    '<div class="info-container">'+
                                        '<p class="med-info">'+
                                            '<span class="card-subsection-name">'+
                                                appointmentList[i].getName()+
                                            '</span>'+
                                            '<div class="card-subsection-h1">'+
                                                appointmentList[i].getWith().getFName()+ " " +  appointmentList[i].getWith().getLName() +
                                            '</div>'+
                                            '<div class="card-subsection-h1">'+
                                                appointmentList[i].getStartTime()+ " - " + appointmentList[i].getEndTime()+
                                            '</div>'+
                                            '<div class="card-subsection-h1">'+
                                                appointmentList[i].getDate()+
                                            '</div>'+
                                        '</p>'+
                                    '</div>'+
                                    '<div class="med-reminder-container">'+
                                        '<div class="btn-group">'+
                                            '<button class="btn"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" type="button">'+
                                                '<img class="hover-pointer navbar-icon invert-color" src="./resources/images/icons/med-notification-icon.png">'+
                                            '</button>'+
                                                '<div class="dropdown-menu dropdown-menu-right">'+
                                                    '<h6 class="dropdown-header">Notification Frequency</h6>'+
                                                    '<div class="dropdown-divider"></div>'+
                                                    '<a onclick="clearDoctorNotification(\''+user.id+'\','+'\''+appointmentList[i].getName()+'\''+')" class="dropdown-item roboto-light" href="#">None</a>'+
                                                    '<div class="dropdown-divider"></div>'+
                                                    '<a onclick="createDoctorNotification(\''+user.id+'\','+'\''+appointmentList[i].getName()+'\''+','+'\'demo\''+')" class="dropdown-item roboto-light" href="#">5 Seconds (Demo)</a>'+
                                                    '<div class="dropdown-divider"></div>'+
                                                    '<a onclick="createDoctorNotification(\''+user.id+'\','+'\''+appointmentList[i].getName()+'\''+','+'\'daily\''+')" class="dropdown-item roboto-light" href="#">Daily</a>'+
                                                    '<div class="dropdown-divider"></div>'+
                                                    '<a onclick="createDoctorNotification(\''+user.id+'\','+'\''+appointmentList[i].getName()+'\''+','+'\'weekly\''+')"  class="dropdown-item roboto-light" href="#">Weekly</a>'+
                                                '</div>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>')
    }
}

function populate_patients() {
    const patients = getUserPatients();
    $("#patients").empty();

    for (let i = 0; i < patients.length; i++) {
        $("#patients").append('<div class="patient-container">'+
                                        '<a class="nav-link" href="patient-profile.html" >'+
                                            '<div class="patient-picture-container">'+
                                                '<img class="patient-picture" src="./resources/images/mark.jpeg">' +
                                            '</div>'+
                                            '<div class="patient-info-container">'+
                                                '<h6>'+patients[i].getFName() + " " + patients[i].getLName()+ '</h6>'+
                                                '<h6>'+patients[i].getPhoneNum()+'</h6>'+
                                                '<h6>'+patients[i].getEmail()+'</h6>'+
                                            '</div>'+
                                            '</a>'+
                                            '<div class="patient-icon-container">'+
                                                '<img onclick="removePatient('+'\''+patients[i].getID()+'\''+')" class="hover-pointer navbar-icon delete-icon" src="./resources/images/icons/delete-icon.png">' +
                                            '</div>'+
                                        
                                    '</div>')
    }
}

function openNotifications() {
    const notificationList = getUserNotifications();

    // Don't stack notifications
    $('#notification-dropdown').empty();

    // Set everything else to back
    $('#patients-card').css("z-index", "-1");

    for (let i = 0; i < notificationList.length; i++) {
        $('#notification-dropdown').append('<a onclick="removeDoctorNotification(\''+user.id+'\','+'\''+i+'\''+')" class="dropdown-item roboto-light" href="#">'+notificationList[i].description+'</a>'+
                    '<div class="dropdown-divider"></div>')
    }
}

function displaySearchResults(arr) {
    $("#patients").empty();

    for (let i = 0; i < arr.length; i++) {
        $("#patients").append('<div class="patient-container">'+
                                        '<a class="nav-link" href="patient-profile.html" >'+
                                            '<div class="patient-picture-container">'+
                                                '<img class="patient-picture" src="./resources/images/mark.jpeg">' +
                                            '</div>'+
                                            '<div class="patient-info-container">'+
                                                '<h6>'+arr[i].getFName() + " " + arr[i].getLName()+ '</h6>'+
                                                '<h6>'+arr[i].getPhoneNum()+'</h6>'+
                                                '<h6>'+arr[i].getEmail()+'</h6>'+
                                            '</div>'+
                                        '</a>'+
                                        '<div class="patient-icon-container">'+
                                            '<img onclick="removePatient('+'\''+arr[i].getID()+'\''+')" class="hover-pointer navbar-icon delete-icon" src="./resources/images/icons/delete-icon.png">' +
                                        '</div>'+
                                    '</div>')
    }
}

function populate_modal() {
    const assignedPatients = getUserPatients();
    $("#add-patient").empty();
    for (let i = 0; i < patientList.length; i++) {
        if (assignedPatients.includes(patientList[i]) === false) {
            $("#add-patient").append('<div class="modal-patient-container">'+
                                                '<div class="patient-picture-container">'+
                                                    '<img class="invert-color patient-picture" src="./resources/images/icons/stockprofile-icon.png">'+
                                                '</div>'+
                                                '<div class="modal-patient-info-container">'+
                                                    '<h6>'+patientList[i].getFName() + " " + patientList[i].getLName()+'</h6>'+
                                                    '<h6>'+patientList[i].getPhoneNum()+'</h6>'+
                                                    '<h6>'+patientList[i].getEmail() + " " + patientList[i].getLName()+'</h6>'+
                                                '</div>'+
                                                '<div class="modal-patient-icon-container">'+
                                                    '<a onclick="addToAddPatientList(event,' + '\''+ patientList[i].getID()+ '\''+')"><img class="hover-pointer patient-icon" src="./resources/images/icons/add-patient-icon.png"></a>'+
                                                '</div>'+
                                            '</div>')
        }
       
    }
}

// Event handler for user typing into textbox
function dynamicSearch(e) {
    let stringToMatch = e.target.value.toLowerCase();
    let patients = getUserPatients();
	let matchArray = [];

	if (stringToMatch != undefined) {
		for (let i = 0; i < patients.length; i++) {
			// Search for stringToMatch properties
			// NOTE: We want to match directly (index to index, not simply contains substring)
			if (String(patients[i].getFName()+" " + patients[i].getLName()).substring(0,stringToMatch.length).toLowerCase().includes(stringToMatch) ||
                patients[i].getLName().substring(0,stringToMatch.length).toLowerCase().includes(stringToMatch) || 
                patients[i].getPhoneNum().substring(0,stringToMatch.length).toLowerCase().includes(stringToMatch) ||
                patients[i].getEmail().substring(0,stringToMatch.length).toLowerCase().includes(stringToMatch)
			) {
				matchArray.push(patients[i]);
			}
		}
	} else {
        populate_patients();
    }

	displaySearchResults(matchArray);
}

function addToAddPatientList(e,userID) {
    // Find user
    for (let i = 0; i < patientList.length; i++) {
        if (patientList[i].getID() == userID) {
            if (add_patient_list.includes(patientList[i])) {
                // Already included it, so remove it
                const index = add_patient_list.indexOf(patientList[i]);
                add_patient_list.splice(index, 1);
                e.target.setAttribute("src", "./resources/images/icons/add-patient-icon.png"); 
                break
            } else {
                 // Haven't included it, so add it
                add_patient_list.push(patientList[i]);
                e.target.setAttribute("src","./resources/images/icons/added-icon.png" ); 
                break;
            }

        }
    }

}

function addAddPatientList() {
    for (let i = 0; i < add_patient_list.length; i++) {
        user.assignPatient(add_patient_list[i]);
    }

    add_patient_list = [];

    populate_patients();
}

function removePatient(patientID) {
    user.unassignPatient(patientID);

    populate_patients();
}