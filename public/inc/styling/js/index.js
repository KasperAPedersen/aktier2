// -- Config variables
let alertTime = 10000; // How long should the alert show (in ms)

// -- Operation variables
let currentAlert = 0;

document.getElementById('loginBtn').addEventListener('click', () => {
    let uname = document.getElementById('uname').value;
    let pword = document.getElementById('pword').value;
    
    if(uname == "") {
        alert("failure", "Invalid username!"); 
        return;
    }

    if(pword == "") {
        alert("failure", "Invalid password! (Min. 6 characters)");
        return;
    }

    alert("success", "Succesfully signed in!");
});

function alert(type, msg) {
    if(msg != undefined && msg != "" && type != undefined && type != "") {
        let tmp = currentAlert;
        let elem = document.createElement('p');
        elem.classList = (type == "success" ? "alertMsg2" : "alertMsg1");
        elem.innerHTML = msg;
        elem.id = `alert${tmp}`;
        document.getElementById('alert').appendChild(elem);
        setTimeout(() => {
            document.getElementById(`alert${tmp}`).remove();
            currentAlert++;
        }, alertTime);
    }
}