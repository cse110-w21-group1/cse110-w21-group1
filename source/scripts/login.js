// moves to signup page
function moveSignup() {
    document.querySelector('.error').innerHTML = "";
    document.querySelectorAll('.error')[1].innerHTML = "";
    document.getElementById("page1").style.display = "none";
    document.getElementById("page2").style.display = "block";
    document.getElementById("page3").style.display = "none";
}

// moves to login page
function moveLogin() {
    document.querySelector('.error').innerHTML = "";
    document.querySelectorAll('.error')[1].innerHTML = "";
    document.getElementById("page2").style.display = "none";
    document.getElementById("page1").style.display = "block";
    document.getElementById("page3").style.display = "none";
}
