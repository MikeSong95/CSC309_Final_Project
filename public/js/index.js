const signInForm = document.querySelector('#signInForm');

signInForm.addEventListener('submit', signInClicked);

function signInClicked(e){
    e.preventDefault();

    const username = document.getElementById("login").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("error");

    if(username=="user" && password=="user"){
        window.location.href = "patient-dashboard.html";
    }

    else if(username=="doctor" && password=="doctor"){  
        window.location.href = "doctor-dashboard.html";
    }

    else if(username=="admin" && password=="admin"){
        window.location.href = "admin-dashboard.html";
    }
    
    else{
        error.innerHTML = "Invalid username/password!";
    }
}