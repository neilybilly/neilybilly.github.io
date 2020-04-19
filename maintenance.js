var BASEURL = "https://maintenancetracker.herokuapp.com"

window.onload = function() {
    loadJobs();
}

var button = document.querySelector("#create-btn");

button.onclick = function(){
    var nameInput = document.querySelector("#name").value;
    var hoursInput = document.querySelector("#hours").value;
    var lawnInput = document.querySelector("#lawn").value;
    var otherInput = document.querySelector("#other").value;
    var dateInput = document.querySelector("#date").value;

    if (nameInput!="" && hoursInput!="" && dateInput!="" && otherInput!=""){
        var data = "name=" + encodeURIComponent(nameInput) + "&hours=" + encodeURIComponent(hoursInput) + "&lawn=" + encodeURIComponent(lawnInput) + "&other=" + encodeURIComponent(otherInput) + "&date=" + encodeURIComponent(dateInput);
        
        console.log(data);
        fetch(BASEURL + "/jobs", {
            method: "POST",
            credentials: "include",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function () {
            loadJobs();
        });
        modal.style.display = "none";
    }
};

// loads the list of restaurants and appends them to a list on the website.
function loadJobs() {
    fetch(BASEURL + "/jobs", {
        credentials: "include"
    }).then(function (response) {
        if (response.status == 200) {
            document.querySelector('.register-card').style.display = "none";
            document.querySelector('.login-card').style.display = "none";
            document.querySelector("#main").style.display = 'block';

            response.json().then(function (jobsFromServer) {
                jobs = jobsFromServer;
                console.log(jobs);
                jobsTable = document.querySelector('#jobs-table');

                jobsTable.innerHTML = "";

                var tr = document.createElement("tr");          
                list = ['Name', 'Hours', 'Lawn', 'Other', 'Date', ' ', ' '];
                for (var i=0; i < 7; i++){
                var th = document.createElement("th");
                th.innerHTML = list[i];
                tr.appendChild(th);
                }
                jobsTable.appendChild(tr);
                var id;
                jobs.forEach(function (job){
                    var tr = document.createElement("tr");
                    var keys = ['name', 'hours', 'lawn', 'other', 'date'];
                    keys.forEach(function (key){
                        var td = document.createElement("td");
                        td.innerHTML = job[key];
                        tr.appendChild(td);
                    });
                    var td = document.createElement("td");
                    var td2 = document.createElement("td");             
                    td.onclick = function(){
                        deleteJobOnServer(job['id']);
                    }
                    td2.onclick = function(){
                        selectJobOnServer(job['id']);
                    }
                    td2.innerHTML = '<i class="fa fa-pencil fa-lg" aria-hidden="true"></i>';
                    td.innerHTML = '<i class="fa fa-trash-o fa-lg" aria-hidden="true"></i>';
                    tr.appendChild(td2);     
                    tr.appendChild(td);
                    jobsTable.appendChild(tr);
                    
                });
            
            });
        } else {
            document.querySelector(".register-card").style.display = 'block';
            document.querySelector("#main").style.display = 'none';
        }
    });
}

function deleteJobOnServer(jobId) {
    console.log(jobId);
    if (confirm("Are you sure you want to Delete this item?")) {
        fetch(BASEURL +"/jobs/" + jobId, {
            method: "DELETE",
            credentials: "include"
        }).then(function (response){
            loadJobs();
        });
    // } else {
    //   txt = "You pressed Cancel!";
    }  
}

function selectJobOnServer(jobId){
    fetch(BASEURL + "/jobs/" + jobId).then(function (response) {
        response.json().then(function (jobsFromServer) {
        console.log(jobsFromServer);
        modal.style.display = "block";

        var title = document.querySelector('#modal-title');
        title.innerHTML = 'Update Entry';

        document.querySelector('#create-btn').style.display = 'none';
        document.querySelector('#save-btn').style.display = 'block';

        document.querySelector("#name").value = jobsFromServer['name'];
        document.querySelector("#hours").value = jobsFromServer['hours'];
        document.querySelector("#lawn").value = jobsFromServer['lawn'];
        document.querySelector("#other").value = jobsFromServer['other'];
        document.querySelector("#date").value = jobsFromServer['date'];

        var save = document.querySelector("#save-btn");

        save.onclick = function(){

            var nameInput = document.querySelector("#name").value;
            var hoursInput = document.querySelector("#hours").value;
            var lawnInput = document.querySelector("#lawn").value;
            var otherInput = document.querySelector("#other").value;
            var dateInput = document.querySelector("#date").value;  

            if (nameInput!="" && hoursInput!="" && dateInput!="" && otherInput!=""){
                var data = "name=" + encodeURIComponent(nameInput) + "&hours=" + encodeURIComponent(hoursInput) + "&lawn=" + encodeURIComponent(lawnInput) + "&other=" + encodeURIComponent(otherInput) + "&date=" + encodeURIComponent(dateInput);
                
                console.log(data);
                fetch(BASEURL + "/jobs/" + jobsFromServer['id'], {
                    method: "PUT",
                    credentials: "include",
                    body: data,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function () {
                    loadJobs();
                });
                modal.style.display = "none";
            }
        };  
        });
    });
}  

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("create-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
    document.querySelector("#name").value = "";
    document.querySelector("#hours").value = "";
    document.querySelector("#lawn").value = "N/A";
    document.querySelector("#other").value = "None";
    document.querySelector("#date").value = "";
    document.querySelector('#create-btn').style.display = 'block';
    document.querySelector('#save-btn').style.display = 'none';
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == modal) {
    modal.style.display = "none";
}
}

var registerBtn = document.querySelector('#register-btn');

registerBtn.onclick = function(){
    var firstInput = document.querySelector("#first").value;
    var lastInput = document.querySelector("#last").value;
    var emailInput = document.querySelector("#email").value;
    var passwordInput = document.querySelector("#password").value;

    if (firstInput!="" && lastInput!="" && emailInput!="" && passwordInput!=""){
        var data = "first=" + encodeURIComponent(firstInput) + "&last=" + encodeURIComponent(lastInput) + "&email=" + encodeURIComponent(emailInput) + "&password=" + encodeURIComponent(passwordInput);

        fetch(BASEURL + "/users", {
            method: "POST",
            credentials: "include",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response){
            if(response.status == 422) {
                document.querySelector('#alertMsg').style.display = 'block';
                document.querySelector('.login-card').style.display = "none";
                document.querySelector('.register-card').style.display = "block";
            }
        });
    }
};

var loginBtn = document.querySelector('#login-btn');

loginBtn.onclick = function(){
    var emailInput = document.querySelector("#email2").value;
    var passwordInput = document.querySelector("#password2").value;
    console.log(passwordInput);

    if (emailInput!="" && passwordInput!=""){
        var data = "email=" + encodeURIComponent(emailInput) + "&password=" + encodeURIComponent(passwordInput);

        fetch(BASEURL + "/sessions", {
            method: "POST",
            credentials: "include",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response){
            if(response.status == 401) {
                document.querySelector('#alertMsg2').style.display = 'block';
                document.querySelector('.register-card').style.display = "none";
                document.querySelector('.login-card').style.display = "block";       
            } else {
                loadJobs();
            }
            
        });
    }
};

document.querySelector('#already').onclick = function() {
    document.querySelector('.register-card').style.display = "none";
    document.querySelector('.login-card').style.display = "block";
};

document.querySelector('#dont').onclick = function() {
    document.querySelector('.register-card').style.display = "block";
    document.querySelector('.login-card').style.display = "none";
};