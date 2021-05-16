function signUp() {
    var x = document.getElementById("page1");
    var y = document.getElementById("page2");
    if (document.querySelector("h1").innerHTML == "Sign Up") {
        document.querySelector("h1").innerHTML = "Login";
    } else {
        document.querySelector("h1").innerHTML = "Sign Up";
    }
    
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
    if (y.style.display === "block") {
        y.style.display = "none";
    } else {
        y.style.display = "block";
    }
}

function changePage(){
    window.location.href = "index.html";
} 

// document.querySelector(".loginbutton")

