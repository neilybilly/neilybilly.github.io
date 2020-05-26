var BASEURL = "https://maintenancetracker.herokuapp.com"

window.onload = function() {
    loadJobs();
}

$("#date").datepicker({
    dateFormat: "m/d/y"
});

document.querySelector('#month').value = new Date().getMonth();

document.querySelector("#month").onchange = function() {

    document.querySelector('#total-hours').innerHTML = "";
    
    var month = document.querySelector('#month').value;

    loadHours(month);

};

function loadHours(month) {

    fetch(BASEURL + "/jobs", {
        credentials: "include"
    }).then(function (response) {
        if (response.status == 200) {

            response.json().then(function (jobsFromServer) {
                jobs = jobsFromServer;

                function onlyUnique(value, index, self) { 
                    return self.indexOf(value) === index;
                }
                
                var total = 0;
                var names = [];
                var usersHours = [];
                receipts = 0;
                jobs.forEach(function (job){
                    names.push(job['name']);
                });

                names = names.filter(onlyUnique);

                names.forEach(function (name){   
                    var userTotal = 0;
                    jobs.forEach(function (job){
                        if (name == job['name']){
                            var date = job['date'].split('/');
                            if ( date[0]-1 == month ) {
                                total += parseFloat(job['hours']);
                                userTotal += parseFloat(job['hours']);

                                if(job['reimburse'] == 1){
                                    receipts += 1;
                                }
                            }
                        }
                    });
                    usersHours.push(userTotal);
                    document.querySelector('#reimbursment').innerHTML = "There are " + receipts + " receipts";
                });

                var list = document.querySelector('#total-hours');
                for(let i=0; i < names.length; i++) {
                    var li = document.createElement('li');
                    li.innerHTML = names[i] + ' ' + usersHours[i];
                    list.appendChild(li);
                };
                var li = document.createElement('li');
                    li.innerHTML = 'Total ' + total;
                    list.appendChild(li);
            });
        } else {
            
        }
    });
}

var button = document.querySelector("#create-btn");

button.onclick = function(){
    var nameInput = document.querySelector("#name").value;
    var hoursInput = document.querySelector("#hours").value;
    var lawnInput = document.querySelector("#lawn").value;
    var otherInput = document.querySelector("#other").value;
    var dateInput = document.querySelector("#date").value;
    var reimburseInput = document.querySelector('#reimburse');

    var checked;
    if ( reimburseInput.checked == true) {
        checked = 1;
    } else {
        checked = 0;
    }

    if (nameInput!="" && hoursInput!="" && dateInput!="" && otherInput!=""){
        var data = "name=" + encodeURIComponent(nameInput) + "&hours=" + encodeURIComponent(hoursInput) + "&lawn=" + encodeURIComponent(lawnInput) + "&other=" + encodeURIComponent(otherInput) + "&date=" + encodeURIComponent(dateInput) + "&reimburse=" + encodeURIComponent(checked);;
        
        console.log(data);
        fetch(BASEURL + "/jobs", {
            method: "POST",
            credentials: "include",
            body: data
        }).then(function () {
            loadJobs();
        });
        modal.style.display = "none";
    } else {
        document.querySelector('.fillFields').style.display = 'block';
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
    fetch(BASEURL +"/jobs/" + jobId, {
        credentials: "include"
    }).then(function (response) {
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
        var checked = jobsFromServer['reimburse'];

        if (checked == 1){
            document.querySelector('#reimburse').checked = true;
        } else {
            document.querySelector('#reimburse').checked = false;
        }

        var save = document.querySelector("#save-btn");

        save.onclick = function(){

            var nameInput = document.querySelector("#name").value;
            var hoursInput = document.querySelector("#hours").value;
            var lawnInput = document.querySelector("#lawn").value;
            var otherInput = document.querySelector("#other").value;
            var dateInput = document.querySelector("#date").value;
            var reimburseInput = document.querySelector('#reimburse');  

            var checked;
            if ( reimburseInput.checked == true) {
                checked = 1;
            } else {
                checked = 0;
            }

            if (nameInput!="" && hoursInput!="" && dateInput!="" && otherInput!=""){
                var data = "name=" + encodeURIComponent(nameInput) + "&hours=" + encodeURIComponent(hoursInput) + "&lawn=" + encodeURIComponent(lawnInput) + "&other=" + encodeURIComponent(otherInput) + "&date=" + encodeURIComponent(dateInput) + "&reimburse=" + encodeURIComponent(checked);
                
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
            } else {
                document.querySelector('.fillFields').style.display = 'block';
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

// Get the modal
var HoursModal = document.getElementById("hours-modal");

// Get the button that opens the modal
var hoursBtn = document.getElementById("hours-btn");

// Get the <span> element that closes the modal
var hoursSpan = document.getElementsByClassName("hours-close")[0];

// When the user clicks the button, open the modal 
hoursBtn.onclick = function() {
    loadHours(new Date().getMonth());
    HoursModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
hoursSpan.onclick = function() {
    HoursModal.style.display = "none";
    document.querySelector('#total-hours').innerHTML = "";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
if (event.target == HoursModal) {
    this.HoursModal.style.display = "none";
    document.querySelector('#total-hours').innerHTML = "";
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
        });
    }
};

var loginBtn = document.querySelector('#login-btn');

loginBtn.onclick = function(){
    var emailInput = document.querySelector("#email2").value;
    var passwordInput = document.querySelector("#password2").value;

    if (emailInput!="" && passwordInput!=""){
        var data = "email=" + encodeURIComponent(emailInput) + "&password=" + encodeURIComponent(passwordInput);

        fetch(BASEURL + "/sessions", {
            method: "POST",
            credentials: "include",
            body: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(function (response) {
            console.log(response.status)
            loadJobs();
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

document.querySelector('#reimburse').onchange = function() {
    if (document.querySelector('#reimburse').checked == true) {
        alert('Plese turn in your receipt');
    }
}