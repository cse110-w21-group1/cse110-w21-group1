function signUp() {
    // reset error output box
    document.querySelector('.error').innerHTML = "";
    document.querySelectorAll('.error')[1].innerHTML = "";

    // changes tabs
    var loginPage = document.getElementById("page1");
    var signupPage = document.getElementById("page2");
    if (document.querySelector("h1").innerHTML == "Sign Up") {
        document.querySelector("h1").innerHTML = "Login";
    } else {
        document.querySelector("h1").innerHTML = "Sign Up";
    }
    
    if (loginPage.style.display === "none") {
      loginPage.style.display = "block";
    } else {
      loginPage.style.display = "none";
    }
    if (signupPage.style.display === "block") {
        signupPage.style.display = "none";
    } else {
        signupPage.style.display = "block";
    }
}

